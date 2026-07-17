'use client'

import { useEffect, useRef, useState, useMemo } from 'react';
import { useClerk, useUser } from '@clerk/nextjs';
import { SignOutButton } from '@clerk/nextjs';
import AddTask from '@/components/AddTask';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import Button from '@mui/material/Button';
import axios from "axios";
import { TotalTasks, CompletedTask, AverageWeekChecker } from "@/components/index";


const style = {
  position: 'relative',
  display: 'flex',
};

interface UserTask {
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

const todayDate = new Date().getDate();
const chartData = [55, 70, 45, 80, 60, 90, 67]
const chartDays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']

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
  const chartRef = useRef<HTMLCanvasElement>(null)
  const [addTaskModal, setAddTaskModal] = useState(false);
  const { user } = useUser();
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
  const [totalTask, setTotalTask] = useState(0);

  

  const handleLogout = () => {
    signOut({ redirectUrl: '/' });
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
    const result = await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/tasks/week/${userId}`,{startDate, endDate});
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



  

  useEffect(() => {
    let chart: unknown = null

    async function loadChart() {
      const { Chart, registerables } = await import('chart.js')
      Chart.register(...registerables)
      if (!chartRef.current) return

      chart = new Chart(chartRef.current, {
        type: 'line',
        data: {
          labels: chartDays,
          datasets: [{
            data: chartData,
            borderColor: '#7F77DD',
            borderWidth: 2,
            pointBackgroundColor: '#7F77DD',
            pointRadius: 3,
            pointHoverRadius: 5,
            tension: 0.4,
            fill: true,
            backgroundColor: (ctx: { chart: { ctx: CanvasRenderingContext2D; chartArea?: { bottom: number } } }) => {
              const g = ctx.chart.ctx.createLinearGradient(0, 0, 0, ctx.chart.chartArea?.bottom ?? 200)
              g.addColorStop(0, 'rgba(127,119,221,0.18)')
              g.addColorStop(1, 'rgba(127,119,221,0)')
              return g
            },
          }],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { display: false },
            tooltip: { callbacks: { label: (c) => c.parsed.y + '%' } },
          },
          scales: {
            y: { min: 0, max: 100, ticks: { color: '#888', font: { size: 11 }, callback: (v) => v + '%' }, grid: { color: 'rgba(0,0,0,0.05)' } },
            x: { ticks: { color: '#888', font: { size: 11 } }, grid: { display: false } },
          },
        },
      })
    }

    loadChart()
    return () => { if (chart && typeof (chart as { destroy?: () => void }).destroy === 'function') (chart as { destroy: () => void }).destroy() }
  }, [])

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

  const taskLookup = useMemo(() => {
    return userWeekData.reduce((acc: Record<string, Record<string, boolean>>, task: UserTask) => {
      if (!task.date) return acc;
      const date = toLocalYMD(task.date);
  
      if (!acc[task.task_id]) {
        acc[task.task_id] = {};
      }
  
      acc[task.task_id][date] = task.is_done ?? false;
  
      return acc;
    }, {} as Record<string, Record<string, boolean>>);
  }, [userWeekData]);

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

  console.log("weeklyStats", weeklyStats)


  const hasTaskData = 
  userWeekData?.length > 0 && 
  userTask?.length > 0 && 
  taskLookup && Object.keys(taskLookup).length > 0;


  return (
    <div className="p-6 md:p-7 max-w-[1100px]">

      {/* ── Top bar ── */}
      <div className="flex items-start justify-between mb-6">
        <div>
          <h1 className="text-xl font-semibold text-gray-900">My tasks</h1>
          <p className="text-xs text-gray-400 mt-0.5">Tuesday, 10 June 2025</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="hidden sm:flex items-center gap-2 px-3 py-2 bg-white border border-black/10 rounded-lg text-xs text-gray-500 hover:bg-gray-50 transition-colors">
            <svg width="13" height="13" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
              <circle cx="6" cy="6" r="4" /><line x1="10" y1="10" x2="13" y2="13" />
            </svg>
            Search
          </button>
          <button onClick={()=> setAddTaskModal(true)} className="btn-primary flex items-center gap-2">
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round">
              <line x1="7" y1="1" x2="7" y2="13" /><line x1="1" y1="7" x2="13" y2="7" />
            </svg>
            Add task
          </button>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-3 py-2 bg-white border border-black/10 rounded-lg text-xs text-gray-500 hover:bg-gray-50 transition-colors"
          >
            <svg width="13" height="13" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 2H3a1 1 0 0 0-1 1v8a1 1 0 0 0 1 1h2M9 10l3-3-3-3M12 7H5" />
            </svg>
            Log out
          </button>
        </div>
      </div>

      {/* ── Stats ── */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-5">
        {hasTaskData && (
          <>
          <TotalTasks 
            totalTask={totalTask} 
            data={todayStats} 
          />
          <CompletedTask 
            data={todayStats} 
          />
          <AverageWeekChecker 
            data={weeklyStats} 
          />
          </>
        )}
      </div>

      {/* ── Table ── */}
      <div className="bg-white border border-black/8 rounded-xl overflow-hidden mb-5">
        <div className="flex items-center justify-between px-5 py-3 border-b border-black/7">
          <span className="text-sm font-semibold text-gray-900">Task tracker</span>
          <div className="flex gap-2">
            {['All', 'Work', 'Health', 'Personal'].map((f, i) => (
              <button key={f} className={`text-[11px] px-3 py-1 rounded-full font-medium ${i === 0 ? 'bg-[#EEEDFE] text-[#534AB7]' : 'bg-[#F1EFE8] text-gray-500 hover:bg-gray-100'}`}>
                {f}
              </button>
            ))}
          </div>
        </div>

        {/* Desktop table */}
        <div className="hidden md:block overflow-x-auto">
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
                    const isDone = taskLookup[task.task_id]?.[w] ?? false;
                    const date = new Date().getDate();
                    const isToday = date == todayDate;
                    return (
                    <td key={i} className="px-3 py-3 text-center">
                      <div
                        onClick={() => handleToggle(!isDone, task.task_id, new Date(w))}
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
                  {/* <td className="px-3 py-3">
                    <div className="h-1.5 bg-violet-100 rounded-full w-20">
                      <div className="h-1.5 bg-primary rounded-full" style={{ width: `${task.pct}%` }} />
                    </div>
                    <div className="text-[10px] text-gray-400 mt-1">{task.pct}%</div>
                  </td> */}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

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

      {/* ── Chart ── */}
      {/* <div className="bg-white border border-black/8 rounded-xl p-5">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h2 className="text-sm font-semibold text-gray-900">Weekly progress</h2>
            <p className="text-[11px] text-gray-400 mt-0.5">Completion rate over last 7 days</p>
          </div>
          <div className="flex items-center gap-2 text-[11px] text-gray-400">
            <span className="w-2 h-2 rounded-full bg-primary" />
            Completion %
          </div>
        </div>
        <div className="relative h-[140px] md:h-[160px]">
          <canvas ref={chartRef} />
        </div>
      </div> */}

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