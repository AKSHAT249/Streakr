import { useState } from "react";
import axios from 'axios';

const CATEGORIES = ["Work", "Personal", "Shopping", "Health", "Finance", "Other"];
const PRIORITIES = ["Low", "Medium", "High", "Urgent"];
const REPEATS = ["Daily", "Weekdays", "Weekly", "Monthly"];

export default function AddTaskModal({ onClose, onSave, data }) {

  const handleSave =async () => {
    const response = await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/addTask`, data );
    if(response){
      alert(response.message || response.error);
    }
    
    onClose();
  };

  const handleChange = (e) => {
    onSave({...data, [e.target.name]:e.target.value})
  }

  return (
    <div className="modal-overlay">
      <div className="modal">
        <h2>Add new task</h2>

        <div className="field">
          <label>TASK NAME</label>
          <input
            type="text"
            name="taskName"
            value={data.taskName}
            onChange={(e) => handleChange(e)}
            placeholder="Enter task name"
          />
        </div>

        <div className="row">
          <div className="field">
            <label>CATEGORY</label>
            <select name="category" value={data.category} onChange={(e) => handleChange(e)}>
              {CATEGORIES.map((c) => <option key={c}>
                {c}
                </option>)}
            </select>
          </div>
          <div className="field">
            <label>PRIORITY</label>
            <select name="priority" value={data.priority} onChange={(e) => handleChange(e)}>
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
                name={r}
                value={data.repeat}
                className={`pill ${data.repeat == r ? "active" : ""}`}
                onClick={(e) => onSave({...data, ['repeat']:r})}
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