'use client'

import { useEffect, useState, useMemo } from 'react';
import { useClerk, useUser, useAuth } from '@clerk/nextjs';
import AddTask from '@/components/AddTask';
import Box from '@mui/material/Box';
import CameraEnhanceIcon from '@mui/icons-material/CameraEnhance';
import Modal from '@mui/material/Modal';
import axios from "axios";
import dayjs from 'dayjs';
import isoWeek from 'dayjs/plugin/isoWeek';
dayjs.extend(isoWeek);

import { TotalTasks, CompletedTask, AverageWeekChecker, ProgressChart, DayStreak, EmptyDashboard, ProofModal } from "@/components/index";


const style = {
  position: 'relative',
  display: 'flex',
};

interface UserTask {
  image_url?: string;
  note?: string;
  task_name: string;
  color?: string;
  is_done?: boolean;
  category: string;
  created_at:string;
  priority:string;
  repeat:string;
  task_id: string;
  user_id: string;
  date?: string;
  }

  type TaskRecord = {
    isDone: boolean;
    image: string | null;
    note: string | null;
  };
  
  type TaskLookup = Record<string, Record<string, TaskRecord>>;



interface UploadImageState {
  image: File | null;
  userId: string | undefined;
}

const todayDate = new Date().getDate();

const catStyle: Record<string, string> = {
  work:     'bg-[#EEEDFE] text-[#534AB7]',
  health:   'bg-[#E1F5EE] text-[#0F6E56]',
  personal: 'bg-[#FAEEDA] text-[#854F0B]',
  learning: 'bg-[#FAECE7] text-[#993C1D]',
}

const getWeekDates = () => {
  const date = new Date();
  const today = new Date(date);
  const dayOfWeek = today.getDay();
  const diffToMonday = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;
  today.setDate(today.getDate() + diffToMonday);

  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(today);
    d.setDate(today.getDate() + i);
    return d.toISOString().split("T")[0]; // "YYYY-MM-DD"
  });
}



export default function DashboardPage() {
  const [addTaskModal, setAddTaskModal] = useState(false);
  const { user } = useUser();
  const { getToken } = useAuth();
  const [userTask, setUserTask] = useState<UserTask[]>([]);
  const [userWeekData, setUserWeekData] = useState([]);
  const { signOut } = useClerk();
  const [taskData, setTaskData] = useState({
    taskName:'',
    category:'work',
    priority:'medium',
    repeat:'',
    userId:user?.id
  });
  const [uploadImage, setUploadImage ] = useState<UploadImageState>({
    image:null,
    userId:user?.id
  });
  const [openModal, setOpenModal] = useState(false);
  const [selectedTask, setSelectedTask] = useState<{
    taskObject: object;
    date: Date;
    isDone: boolean;
    image?: string|null; 
    note?: string;
  } | null>(null);

  const handleOpenModal = (
    task: object,
    isDone: boolean,
    date: Date,
    image: string|null,
    note: string
  ) => {
    setSelectedTask({
      taskObject: task,
      date,
      isDone,
      image: image,
      note: note
    });
  
    setOpenModal(true);
  };

  const [totalTask, setTotalTask] = useState(0);

  

  const handleLogout = () => {
    signOut({ redirectUrl: '/sign-in' });
  };
  const weekDates = getWeekDates(); 

  const handleClose = () => {
    setAddTaskModal(false);
    setTaskData(
      {
        taskName:'',
        category:'Work',
        priority:'Medium',
        repeat:'Daily',
        userId:user?.id
      }
    )
  }

  const fetchUserTask = async (userId:String | undefined) => {
    const result = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/getTask/${userId}`);
    if(result){
      setUserTask(result.data);
      setTotalTask(result.data.length)
    }
  };

  const fetchUserWeekData = async (userId:string | undefined, startDate:Date | undefined, endDate:Date) => {
    if(!userId){
      return ;
    }
    const token = await getToken();
    const result = await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/tasks/week`,{startDate, endDate}, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    if(result){
      setUserWeekData(result.data);
    }
  }

  useEffect(() => {
    const userId: string | undefined = user?.id;
    if(userId == undefined){
        return
    }
    const startDate = weekDates[0];
    const endDate = weekDates[weekDates.length -1];
    
    fetchUserTask(userId);
    fetchUserWeekData(userId, new Date(startDate), new Date(endDate));

  }, [user] )



  

  const handleToggle = async (status:boolean = false, taskId: string, weekDate: Date) => {
    const userId = user?.id;
    const result = await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/updateTask/${userId}`, {status, taskId, weekDate});

    const startDate = weekDates[0];
    const endDate = weekDates[weekDates.length -1];
    await fetchUserWeekData(userId, new Date(startDate), new Date(endDate));


  }

  const toLocalYMD = (isoString: string) => {
    const d = new Date(isoString);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  const taskLookup = useMemo<TaskLookup>(() => {
    return userWeekData.reduce<TaskLookup>((acc: Record<string, Record<string, {isDone: boolean, image: string | null, note: string | null}>>, task: UserTask) => {
      if (!task.date) return acc;
      const date = toLocalYMD(task.date);
  
      if (!acc[task.task_id]) {
        acc[task.task_id] = {};
      }
  
      acc[task.task_id][date] = {
        isDone: task.is_done ?? false,
        image: task.image_url ?? null,
        note: task.note ?? null,
      }
  
      return acc;
    }, {} as TaskLookup);
  }, [userWeekData]);


  const weeklyChartData = useMemo(() => {
    const weekRecordCount = Object.values(taskLookup).reduce((acc: Record<string, number>, dateMap: Record<string, {isDone: boolean}>) => {
      for (const [date, {isDone}] of Object.entries(dateMap)) {
        if (isDone) {
          acc[date] = (acc[date] || 0) + 1;
        }
      }
      return acc;
    }, {} as Record<string, number>);


    const dates = getWeekDates();
    const todayStr = toLocalYMD(new Date().toISOString());

    const chartData = dates.map((date) => {
      const doneCount = weekRecordCount[date] ?? 0;
      const d = new Date(date);
      const isToday = date === todayStr;

      return {
        day: isToday ? 'Today' : d.toLocaleDateString('en-US', { weekday: 'short' }),
        completed: doneCount,
        total: totalTask,
        isToday,
      };
    });

    return { chartData };
  }, [taskLookup, totalTask]);





  const todayStats = useMemo(() => {
    if (!taskLookup || Object.keys(taskLookup).length === 0) {
      return {
        doneToday: 0,
        pendingToday: 0,
        doneYesterday: 0,
        diffFromYesterday: 0,
      };
    }
  
    const todayStr = toLocalYMD(new Date().toISOString());
    const yesterdayDate = new Date();
    yesterdayDate.setDate(yesterdayDate.getDate() - 1);
    const yesterdayStr = toLocalYMD(yesterdayDate.toISOString());
  
    let doneToday = 0;
    let doneYesterday = 0;
  
    Object.values(taskLookup).forEach((dateMap) => {
      if (todayStr in dateMap && dateMap[todayStr]) {
        doneToday += 1;
      }
      if (yesterdayStr in dateMap && dateMap[yesterdayStr]) {
        doneYesterday += 1;
      }
    });
  
    const pendingToday = totalTask - doneToday;
    const diffFromYesterday = doneToday - doneYesterday;
  
    return {
      doneToday,
      pendingToday,
      doneYesterday,
      diffFromYesterday,
    };
  }, [taskLookup, totalTask]); // ✅ added totalTask

  const weeklyStats = useMemo(() => {
    if (!taskLookup || Object.keys(taskLookup).length === 0) {
      return {
        totalDoneThisWeek: 0,
        totalEntriesThisWeek: 0,
        completionRate: 0, // as a percentage, e.g. 75 for 75%
      };
    }
  
    let totalDoneThisWeek = 0;
    let totalEntriesThisWeek = 0;

    Object.values(taskLookup).forEach((dateMap) => {
      Object.values(dateMap).forEach((isDone) => {
        totalEntriesThisWeek += 1;
        if (isDone) {
          totalDoneThisWeek += 1;
        }
      });
    });
  
    const completionRate = totalEntriesThisWeek > 0 
      ? Math.round((totalDoneThisWeek / 35) * 100) 
      : 0;
  
    return {
      totalDoneThisWeek,
      totalEntriesThisWeek,
      completionRate,
    };
  }, [taskLookup, weekDates]);




  const dayStreak = useMemo(() => {
    if (!taskLookup || Object.keys(taskLookup).length === 0) return 0;

    let streak = 0;
    const cursor = new Date();

    for (let i = 0; i < 365; i++) {
      const dateStr = toLocalYMD(cursor.toISOString());
      const anyDone = Object.values(taskLookup).some((dateMap) => dateMap[dateStr]);

      if (anyDone) {
        streak += 1;
        cursor.setDate(cursor.getDate() - 1);
      } else if (i === 0) {
        cursor.setDate(cursor.getDate() - 1);
      } else {
        break;
      }
    }

    return streak;
  }, [taskLookup]);

  const hasTasks = (userTask?.length ?? 0) > 0;

  const userName = user?.firstName ?? user?.fullName?.split(' ')[0] ?? 'there';
  const formattedDate = new Date().toLocaleDateString('en-GB', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });


  return (
    <div className="mx-auto w-full max-w-[1100px] p-4 sm:p-6 md:p-7">

      {/* ── Top bar ── */}
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="min-w-0">
          <h1 className="text-2xl font-bold tracking-tight text-gray-900">
            Welcome back, {userName}! 👋
          </h1>
          <p className="mt-1 text-sm font-normal text-gray-500">{formattedDate}</p>
        </div>

        <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row sm:items-center">
          <div className="relative w-full sm:w-[280px]">
            <svg
              className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"
              width="16"
              height="16"
              viewBox="0 0 16 16"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
            >
              <circle cx="7" cy="7" r="4.5" />
              <line x1="10.5" y1="10.5" x2="14" y2="14" />
            </svg>
            <input
              type="search"
              placeholder="Search tasks..."
              className="h-10 w-full rounded-2xl border border-gray-200 bg-white pl-10 pr-4 text-sm font-normal text-gray-900 placeholder:text-gray-400 outline-none transition-colors focus:border-primary/40 focus:ring-2 focus:ring-primary/10"
            />
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setAddTaskModal(true)}
              className="flex h-10 flex-1 items-center justify-center gap-2 rounded-2xl bg-primary px-5 text-sm font-semibold text-white transition-opacity hover:opacity-90 sm:flex-none"
            >
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
                <line x1="7" y1="1" x2="7" y2="13" />
                <line x1="1" y1="7" x2="13" y2="7" />
              </svg>
              Add task
            </button>
            <button
              type="button"
              onClick={handleLogout}
              aria-label="Log out"
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-gray-200 bg-white text-gray-500 transition-colors hover:bg-gray-50 hover:text-gray-700"
            >
              <svg width="16" height="16" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 2H3a1 1 0 0 0-1 1v8a1 1 0 0 0 1 1h2M9 10l3-3-3-3M12 7H5" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* ── Stats ── */}
      <div className={`mb-5 grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4 ${hasTasks ? 'lg:grid-cols-3' : 'lg:grid-cols-4'}`}>
        <TotalTasks totalTask={totalTask} data={todayStats} isEmpty={!hasTasks} />
        <CompletedTask data={todayStats} isEmpty={!hasTasks} />
        <AverageWeekChecker data={weeklyStats} isEmpty={!hasTasks} />
        {!hasTasks && <DayStreak streak={dayStreak} isEmpty />}
      </div>

      {!hasTasks ? (
        <EmptyDashboard onAddTask={() => setAddTaskModal(true)} />
      ) : (
      <>
      {/* ── Table ── */}
      <div className="mb-5 overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
        <div className="flex flex-col gap-3 border-b border-black/7 px-4 py-3 sm:flex-row sm:items-center sm:justify-between sm:px-5">
          <span className="text-sm font-semibold text-gray-900">Task tracker</span>
          <div className="flex gap-2 overflow-x-auto pb-0.5">
            {['All', 'Work', 'Health', 'Personal'].map((f, i) => (
              <button key={f} className={`text-[11px] px-3 py-1 rounded-full font-medium ${i === 0 ? 'bg-[#EEEDFE] text-[#534AB7]' : 'bg-[#F1EFE8] text-gray-500 hover:bg-gray-100'}`}>
                {f}
              </button>
            ))}
          </div>
        </div>

        {/* Desktop table */}
        <div className="md:block overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="bg-gray-50 border-b border-black/7">
                <th className="text-left px-4 py-2.5 text-[11px] font-semibold text-gray-400 tracking-wide w-52">Task</th>
                <th className="text-left px-3 py-2.5 text-[11px] font-semibold text-gray-400 tracking-wide w-24">Category</th>
                {weekDates.map((dateStr, i) => {
                  const d = new Date(dateStr);
                  const date = d.getDate();
                  const month = d.getMonth() + 1;
                  const weekday = d.toLocaleDateString("en-US", { weekday: "short" });
                  return (
                    <th key={date} className={`text-center px-3 py-2.5 text-nowrap text-[11px] font-semibold tracking-wide w-16 ${date === todayDate ? 'text-primary' : 'text-gray-400'}`}>
                      {date == todayDate ? `Today` : `${date} ${weekday}`}
                    </th>
                  )
                })}
                <th className="text-left px-3 py-2.5 text-[11px] font-semibold text-gray-400 tracking-wide">Progress</th>
                
              </tr>
            </thead>
            <tbody>
              {userTask && userTask.map(task => (
                <tr key={task.task_name} className="border-b border-black/5 last:border-0 hover:bg-violet-50/40 transition-colors">
                  <td className="px-4 py-3">
                    <div className={`flex items-center gap-2 text-[12px] font-medium`}>
                      <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: task.color }} />
                      {task.task_name}
                    </div>
                  </td>
                  <td className="px-3 py-3">
                    <span className={`text-[10px] font-semibold px-2 py-1 rounded-full ${catStyle[task.category]}`}>
                      {task.category}
                    </span>
                  </td>
                  {weekDates.map((w, i) => {
                    const isDone = taskLookup[task.task_id]?.[w]?.isDone ?? false;
                    const image = taskLookup[task.task_id]?.[w]?.image ?? '';
                    const note = taskLookup[task.task_id]?.[w]?.note ?? '';

                    // const image = taskLookup[task.task_id]?.[w]?.image_url ?? null;
                    const date = new Date().getDate();
                    const isToday = date == todayDate;
                    return (
                    <td key={i} className="px-3 py-3 text-center">
                      <div
                        onClick={() => handleOpenModal(task,isDone,new Date(w), image, note)}
                        className={`w-4 h-4 rounded mx-auto flex items-center justify-center transition-colors
                          ${isDone 
                            ? 'bg-primary border-primary cursor-pointer' 
                            : isToday 
                              ? 'bg-violet-50 border border-primary cursor-pointer' 
                              : 'border border-gray-200 cursor-not-allowed'
                          }`}
                      >
                        {isDone && (
                          <svg width="9" height="9" viewBox="0 0 9 9" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            <polyline points="1.5,4.5 3.5,6.5 7.5,2.5" />
                          </svg>
                        )}                 
                      </div>
                    </td>
                  )
})}
                  <td className="px-3 py-3">
                    <div className="h-1.5 bg-violet-100 rounded-full w-20">
                      <div className="h-1.5 bg-primary rounded-full" style={{ width: `${80}%` }} />
                    </div>
                    <div className="text-[10px] text-gray-400 mt-1">{80}%</div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <ProofModal 
          open={openModal}
          taskObject={selectedTask}
          setSelectedTask={setSelectedTask}
          onClose={() => setOpenModal(false)} 
        />

        {/* Mobile task list */}
        <div className="md:hidden divide-y divide-black/5">
          {/* {tasks.map(task => (
            <div key={task.name} className="flex items-center gap-3 px-4 py-3">
              <div className={`w-4 h-4 rounded flex items-center justify-center cursor-pointer flex-shrink-0
                ${task.done ? 'bg-primary' : 'border border-primary bg-violet-50'}`}>
                {task.done && (
                  <svg width="9" height="9" viewBox="0 0 9 9" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="1.5,4.5 3.5,6.5 7.5,2.5" />
                  </svg>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className={`text-xs font-medium truncate ${task.done ? 'line-through text-gray-300' : 'text-gray-800'}`}>{task.name}</p>
                <span className={`inline-block text-[9px] font-semibold px-1.5 py-0.5 rounded-full mt-1 ${catStyle[task.category]}`}>{task.category}</span>
              </div>
              <div className="flex-shrink-0 text-right">
                <div className="h-1 w-10 bg-violet-100 rounded-full">
                  <div className="h-1 bg-primary rounded-full" style={{ width: `${task.pct}%` }} />
                </div>
                <div className="text-[10px] text-gray-400 mt-1">{task.pct}%</div>
              </div>
            </div>
          ))} */}
        </div>
      </div>
      </>
      )}

      {/* ── Chart ── */}
      <div className="mt-1">
        <ProgressChart chartData={weeklyChartData.chartData} />
      </div>

      {/* Open Add Task Modal */}
      <Modal
        open={addTaskModal}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={{ ...style}}>
          <AddTask onClose={handleClose} onSave={setTaskData} data={taskData} />
        </Box>
       
      </Modal>



    </div>
  )
}