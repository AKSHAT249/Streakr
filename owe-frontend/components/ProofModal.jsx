"use client";
import { useRef } from "react";
import { useAuth } from "@clerk/nextjs";

export default function ProofModal({ open, onClose, taskObject, setSelectedTask }) {
  const fileRef = useRef();
  const { getToken } = useAuth();

  const getWeekDate = (date) => {
    if (!date) return "";
    const d = date instanceof Date ? date : new Date(date);
    if (isNaN(d.getTime())) return "";
    return d.toISOString().split("T")[0];
  };

  if (!open) return null;
  const task = taskObject.taskObject;
  const taskId = task?.task_id;

  const handleTaskCompletion = async () => {
    const token = await getToken();
    const formData = new FormData();
    formData.append("taskId", taskId);
    formData.append("status", taskObject?.isDone);
    formData.append("weekDate", getWeekDate(taskObject?.date));
    formData.append("note", taskObject?.note);
    formData.append("image", taskObject?.image);

    const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/updateTask`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });
  };

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(15, 15, 20, 0.5)",
        backdropFilter: "blur(3px)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 999,
        padding: 20,
      }}
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          width: "100%",
          maxWidth: 380,
          background: "#fff",
          borderRadius: 18,
          boxShadow: "0 20px 60px rgba(0,0,0,.25)",
          overflow: "hidden",
          fontFamily: "Inter, sans-serif",
        }}
      >
        {/* Header */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            padding: "18px 20px",
            borderBottom: "1px solid #F0EEFB",
          }}
        >
          <h3
            style={{
              margin: 0,
              fontSize: 17,
              fontWeight: 700,
              color: "#1A1A1A",
              letterSpacing: "-0.01em",
            }}
          >
            {task.task_name}
          </h3>

          <button
            onClick={onClose}
            style={{
              border: "none",
              background: "#F5F4FA",
              width: 28,
              height: 28,
              borderRadius: "50%",
              fontSize: 16,
              cursor: "pointer",
              color: "#777",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              lineHeight: 1,
              transition: "background .15s ease",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.background = "#EBE9F7")}
            onMouseLeave={(e) => (e.currentTarget.style.background = "#F5F4FA")}
          >
            ×
          </button>
        </div>

        {/* Body */}
        <div style={{ padding: "20px 20px 22px" }}>
          {/* Checkbox */}
          <label
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              cursor: "pointer",
              fontSize: 14,
              fontWeight: 500,
              color: "#333",
              marginBottom: 22,
              padding: "10px 12px",
              borderRadius: 10,
              background: taskObject?.isDone ? "#F3F0FF" : "#FAFAFA",
              border: `1px solid ${taskObject?.isDone ? "#DCD3FF" : "#EEEEEE"}`,
              transition: "all .15s ease",
            }}
          >
            <input
              type="checkbox"
              checked={taskObject?.isDone}
              onChange={() =>
                setSelectedTask((prev) =>
                  prev
                    ? {
                        ...prev,
                        isDone: !prev.isDone,
                      }
                    : null
                )
              }
              style={{
                width: 18,
                height: 18,
                accentColor: "#7C5CFC",
                cursor: "pointer",
              }}
            />
            Mark as completed
          </label>

          {/* Upload */}
          <p
            style={{
              margin: "0 0 8px",
              fontSize: 12,
              fontWeight: 700,
              color: "#8A8A8A",
              textTransform: "uppercase",
              letterSpacing: "0.04em",
            }}
          >
            Upload Proof <span style={{ fontWeight: 400, textTransform: "none" }}>(optional)</span>
          </p>

          <div
            style={{
              position: "relative",
              border: taskObject?.image ? "1px solid #E6E1FB" : "2px dashed #D7C8FF",
              borderRadius: 12,
              minHeight: 96,
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              cursor: "pointer",
              background: taskObject?.image ? "#fff" : "#FAF8FF",
              marginBottom: 20,
              overflow: "hidden",
              transition: "border-color .15s ease, background .15s ease",
            }}
            onClick={() => fileRef.current?.click()}
            onMouseEnter={(e) => {
              if (!taskObject?.image) e.currentTarget.style.background = "#F5F0FF";
            }}
            onMouseLeave={(e) => {
              if (!taskObject?.image) e.currentTarget.style.background = "#FAF8FF";
            }}
          >
            {taskObject?.image ? (
              <div
                style={{
                  position: "relative",
                  width: "100%",
                  padding: 12,
                  display: "flex",
                  justifyContent: "center",
                }}
              >
                <img
                  src={
                    typeof taskObject.image === "string"
                      ? taskObject.image
                      : URL.createObjectURL(taskObject.image)
                  }
                  alt="Preview"
                  style={{
                    width: 96,
                    height: 96,
                    objectFit: "cover",
                    borderRadius: 10,
                    boxShadow: "0 2px 8px rgba(0,0,0,.12)",
                  }}
                />
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedTask({ ...taskObject, image: null });
                  }}
                  style={{
                    position: "absolute",
                    top: 6,
                    right: "calc(50% - 48px - 6px)",
                    width: 22,
                    height: 22,
                    borderRadius: "50%",
                    border: "none",
                    background: "rgba(0,0,0,0.55)",
                    color: "#fff",
                    fontSize: 13,
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    lineHeight: 1,
                  }}
                  title="Remove image"
                >
                  ×
                </button>
              </div>
            ) : (
              <span
                style={{
                  color: "#7C5CFC",
                  fontWeight: 600,
                  fontSize: 13.5,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: 4,
                }}
              >
                <span style={{ fontSize: 20 }}>⬆</span>
                Choose Image
              </span>
            )}

            <input
              ref={fileRef}
              type="file"
              hidden
              accept="image/*"
              onChange={(e) =>
                setSelectedTask({ ...taskObject, image: e.target.files?.[0] || null })
              }
            />
          </div>

          {/* Notes */}
          <p
            style={{
              margin: "0 0 8px",
              fontSize: 12,
              fontWeight: 700,
              color: "#8A8A8A",
              textTransform: "uppercase",
              letterSpacing: "0.04em",
            }}
          >
            Add Notes <span style={{ fontWeight: 400, textTransform: "none" }}>(optional)</span>
          </p>

          <textarea
            rows={3}
            value={taskObject.note}
            onChange={(e) => setSelectedTask({ ...taskObject, note: e.target.value })}
            placeholder="Write a note..."
            style={{
              width: "100%",
              resize: "none",
              border: "1px solid #E6E6E6",
              borderRadius: 10,
              padding: "12px 14px",
              fontSize: 14,
              fontFamily: "inherit",
              outline: "none",
              boxSizing: "border-box",
              marginBottom: 22,
              color: "#333",
              transition: "border-color .15s ease",
            }}
            onFocus={(e) => (e.currentTarget.style.borderColor = "#B9A8FF")}
            onBlur={(e) => (e.currentTarget.style.borderColor = "#E6E6E6")}
          />

          {/* Button */}
          <button
            onClick={handleTaskCompletion}
            style={{
              width: "100%",
              border: "none",
              padding: "13px",
              borderRadius: 10,
              background: "#7C5CFC",
              color: "#fff",
              fontSize: 15,
              fontWeight: 600,
              cursor: "pointer",
              boxShadow: "0 4px 14px rgba(124, 92, 252, 0.35)",
              transition: "background .15s ease, transform .1s ease",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.background = "#6D4CEF")}
            onMouseLeave={(e) => (e.currentTarget.style.background = "#7C5CFC")}
            onMouseDown={(e) => (e.currentTarget.style.transform = "scale(0.98)")}
            onMouseUp={(e) => (e.currentTarget.style.transform = "scale(1)")}
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
}