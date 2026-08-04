"use client";

import { useRef, useState } from "react";
import { useAuth } from "@clerk/nextjs";
import { formatLocalYMD } from "@/utils/date";

function UploadArrowIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M12 16V6M12 6l-4 4M12 6l4 4"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path d="M4 18h16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

export default function ProofModal({ open, onClose, taskObject, setSelectedTask }) {
  const fileRef = useRef(null);
  const { getToken } = useAuth();
  const [saving, setSaving] = useState(false);

  const getWeekDate = (date) => formatLocalYMD(date);

  if (!open) return null;

  const task = taskObject.taskObject;
  const taskId = task?.task_id;
  const isDone = Boolean(taskObject?.isDone);
  const hasImage = Boolean(taskObject?.image);

  const handleTaskCompletion = async () => {
    const token = await getToken();
    const formData = new FormData();
    formData.append("taskId", taskId);
    formData.append("status", taskObject?.isDone);
    formData.append("weekDate", getWeekDate(taskObject?.date));
    formData.append("note", taskObject?.note ?? "");
    if (taskObject?.image != null && taskObject?.image !== "") {
      formData.append("image", taskObject.image);
    }

    setSaving(true);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/updateTask`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      if (res) {
        onClose();
      }
    } finally {
      setSaving(false);
    }
  };

  const imagePreviewSrc =
    typeof taskObject?.image === "string"
      ? taskObject.image
      : taskObject?.image
        ? URL.createObjectURL(taskObject.image)
        : null;

  return (
    <div
      className="fixed inset-0 z-[999] flex items-center justify-center bg-[#0f0f14]/50 p-5 backdrop-blur-[3px]"
      role="dialog"
      aria-modal="true"
      aria-labelledby="proof-modal-title"
      onClick={onClose}
    >
      <div
        className="w-full max-w-[400px] overflow-hidden rounded-[20px] bg-white shadow-[0_24px_64px_rgba(0,0,0,0.22)]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#F0EEFB] px-5 py-4">
          <h3
            id="proof-modal-title"
            className="truncate pr-3 text-[17px] font-bold tracking-tight text-gray-900"
          >
            {task?.task_name}
          </h3>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#F5F4FA] text-lg leading-none text-gray-500 transition-colors hover:bg-[#EBE9F7] hover:text-gray-700"
          >
            ×
          </button>
        </div>

        {/* Body */}
        <div className="space-y-5 px-5 py-5">
          {/* Completed */}
          <label
            className={`flex cursor-pointer items-center gap-3 rounded-xl border px-3.5 py-3 text-sm font-medium text-gray-800 transition-colors ${
              isDone
                ? "border-[#DCD3FF] bg-[#F3F0FF]"
                : "border-gray-200 bg-[#FAFAFA] hover:border-gray-300"
            }`}
          >
            <input
              type="checkbox"
              checked={isDone}
              onChange={() =>
                setSelectedTask((prev) =>
                  prev
                    ? {
                        ...prev,
                        isDone: !prev.isDone,
                      }
                    : null,
                )
              }
              className="h-[18px] w-[18px] cursor-pointer rounded accent-primary"
            />
            Mark as completed
          </label>

          {/* Upload */}
          <div>
            <p className="mb-2 text-xs font-bold uppercase tracking-wide text-gray-400">
              Upload proof{" "}
              <span className="font-normal normal-case text-gray-400">(optional)</span>
            </p>

            <div
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") fileRef.current?.click();
              }}
              className={`relative flex min-h-[104px] cursor-pointer items-center justify-center overflow-hidden rounded-xl transition-colors ${
                hasImage
                  ? "border border-[#E6E1FB] bg-white"
                  : "border-2 border-dashed border-primary/35 bg-[#FAF8FF] hover:border-primary/50 hover:bg-[#F5F0FF]"
              }`}
              onClick={() => fileRef.current?.click()}
            >
              {hasImage && imagePreviewSrc ? (
                <div className="flex w-full justify-center py-3">
                  <div className="relative inline-block p-1">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={imagePreviewSrc}
                    alt="Proof preview"
                    className="h-24 w-24 rounded-xl object-cover shadow-md"
                  />
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedTask({ ...taskObject, image: null });
                    }}
                    className="absolute -right-1 -top-1 flex h-6 w-6 items-center justify-center rounded-full bg-black/55 text-sm text-white transition-opacity hover:bg-black/70"
                    title="Remove image"
                  >
                    ×
                  </button>
                  </div>
                </div>
              ) : (
                <span className="flex flex-col items-center gap-1.5 text-primary">
                  <UploadArrowIcon />
                  <span className="text-sm font-semibold">Choose image</span>
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
          </div>

          {/* Notes */}
          <div>
            <p className="mb-2 text-xs font-bold uppercase tracking-wide text-gray-400">
              Add notes{" "}
              <span className="font-normal normal-case text-gray-400">(optional)</span>
            </p>
            <textarea
              rows={3}
              value={taskObject?.note ?? ""}
              onChange={(e) => setSelectedTask({ ...taskObject, note: e.target.value })}
              placeholder="Write a note..."
              className="box-border w-full resize-none rounded-xl border border-gray-200 px-3.5 py-3 text-sm text-gray-800 outline-none transition-shadow placeholder:text-gray-400 focus:border-primary/40 focus:ring-2 focus:ring-primary/15"
            />
          </div>

          <button
            type="button"
            disabled={saving}
            onClick={handleTaskCompletion}
            className="w-full rounded-xl bg-primary py-3.5 text-[15px] font-semibold text-white shadow-[0_4px_14px_rgba(127,119,221,0.4)] transition-all hover:opacity-95 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {saving ? "Saving…" : "Save"}
          </button>
        </div>
      </div>
    </div>
  );
}
