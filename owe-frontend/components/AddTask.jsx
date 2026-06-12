import { useState } from "react";

const CATEGORIES = ["Work", "Personal", "Shopping", "Health", "Finance", "Other"];
const PRIORITIES = ["Low", "Medium", "High", "Urgent"];
const REPEATS = ["Daily", "Weekdays", "Weekly", "Monthly"];

export default function AddTaskModal({ onClose, onSave, data }) {
  const [taskName, setTaskName] = useState("");
  const [category, setCategory] = useState("Work");
  const [priority, setPriority] = useState("Medium");
  const [repeat, setRepeat] = useState("Daily");

  const handleSave = () => {
    if (!taskName.trim()) return;
    onSave({...data,  taskName, category, priority, repeat: repeat.toLowerCase(), status: false });
    onClose();
  };

  return (
    <div className="modal-overlay">
      <div className="modal">
        <h2>Add new task</h2>

        <div className="field">
          <label>TASK NAME</label>
          <input
            type="text"
            value={taskName}
            onChange={(e) => setTaskName(e.target.value)}
            placeholder="Enter task name"
          />
        </div>

        <div className="row">
          <div className="field">
            <label>CATEGORY</label>
            <select value={category} onChange={(e) => setCategory(e.target.value)}>
              {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
            </select>
          </div>
          <div className="field">
            <label>PRIORITY</label>
            <select value={priority} onChange={(e) => setPriority(e.target.value)}>
              {PRIORITIES.map((p) => <option key={p}>{p}</option>)}
            </select>
          </div>
        </div>

        <div className="field">
          <label>REPEAT</label>
          <div className="pill-group">
            {REPEATS.map((r) => (
              <button
                key={r}
                className={`pill ${repeat === r ? "active" : ""}`}
                onClick={() => setRepeat(r)}
              >
                {r}
              </button>
            ))}
          </div>
        </div>

        <div className="actions">
          <button className="cancel" onClick={onClose}>Cancel</button>
          <button className="save" onClick={handleSave}>Save task</button>
        </div>
      </div>
    </div>
  );
}