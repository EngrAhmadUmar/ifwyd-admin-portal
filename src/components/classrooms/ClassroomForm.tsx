"use client";

import { SettingsField, SettingsSelect } from "@/components/settings/SettingsField";
import { createClassroom, getClassroom, updateClassroom } from "@/lib/api/classrooms";
import { CLASSROOM_STATUSES, type ClassroomStatus } from "@/lib/classrooms-data";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

type ClassroomFormProps = {
  mode: "create" | "edit";
  editId?: string;
};

export function ClassroomForm({ mode, editId }: ClassroomFormProps) {
  const router = useRouter();
  const [name, setName] = useState("");
  const [subject, setSubject] = useState("");
  const [schedule, setSchedule] = useState("");
  const [capacity, setCapacity] = useState("0");
  const [enrolled, setEnrolled] = useState("0");
  const [status, setStatus] = useState<ClassroomStatus>("Draft");
  const [loading, setLoading] = useState(mode === "edit");
  const [notFound, setNotFound] = useState(false);
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  useEffect(() => {
    if (mode !== "edit" || !editId) return;
    let active = true;
    getClassroom(editId).then((result) => {
      if (!active) return;
      if (!result.classroom) {
        setNotFound(true);
        setLoading(false);
        return;
      }
      setName(result.classroom.name);
      setSubject(result.classroom.subject);
      setSchedule(result.classroom.schedule);
      setCapacity(String(result.classroom.capacity));
      setEnrolled(String(result.classroom.enrolled));
      setStatus(result.classroom.status);
      setLoading(false);
    });
    return () => {
      active = false;
    };
  }, [mode, editId]);

  async function handleSave() {
    if (!name.trim()) {
      setFormError("Add a name before saving.");
      return;
    }
    setFormError(null);
    setSaving(true);

    const input = {
      name,
      subject,
      schedule,
      capacity: Number(capacity) || 0,
      enrolled: Number(enrolled) || 0,
      status,
    };

    if (mode === "edit" && editId) {
      await updateClassroom(editId, input);
    } else {
      await createClassroom(input);
    }
    router.push("/classrooms");
  }

  if (notFound) {
    return (
      <div className="mt-3 flex h-full min-h-0 flex-col items-center justify-center text-center">
        <p className="text-[15px] text-neutral-500">That classroom couldn&apos;t be found.</p>
      </div>
    );
  }

  return (
    <div className="mt-3 flex h-full min-h-0 flex-col overflow-hidden">
      <div className="shrink-0">
        <h1 className="text-[22px] font-semibold text-neutral-900">
          {mode === "edit" ? "Edit Classroom" : "New Classroom"}
        </h1>
        <p className="mt-1 text-[15px] font-normal text-neutral-900">
          {mode === "edit" ? "Update this classroom's details." : "Add a new classroom program."}
        </p>
      </div>

      {formError && <p className="mt-2 shrink-0 text-[12px] font-medium text-red-600">{formError}</p>}

      <div className="mt-6 min-h-0 flex-1 overflow-y-auto rounded-[10px] border border-neutral-200/80 bg-white shadow-sm">
        {loading ? (
          <p className="py-16 text-center text-[13px] text-neutral-400">Loading...</p>
        ) : (
          <div className="space-y-5 px-6 py-6">
            <SettingsField label="Name" value={name} onChange={setName} />
            <div className="grid grid-cols-2 gap-4">
              <SettingsField label="Subject" value={subject} onChange={setSubject} />
              <SettingsField label="Schedule" value={schedule} onChange={setSchedule} placeholder="e.g. Mon & Wed, 10am" />
            </div>
            <div className="grid grid-cols-3 gap-4">
              <SettingsField label="Capacity" type="number" value={capacity} onChange={setCapacity} />
              <SettingsField label="Enrolled" type="number" value={enrolled} onChange={setEnrolled} />
              <SettingsSelect
                label="Status"
                value={status}
                onChange={(value) => setStatus(value as ClassroomStatus)}
                options={CLASSROOM_STATUSES}
              />
            </div>
          </div>
        )}
      </div>

      <div className="mt-5 flex shrink-0 justify-end gap-3">
        <button
          type="button"
          onClick={() => router.push("/classrooms")}
          className="h-[52px] rounded-full bg-[#F0F0F0] px-8 text-[15px] font-medium text-neutral-900 transition-colors hover:bg-[#E8E8E8]"
        >
          Cancel
        </button>
        <button
          type="button"
          onClick={handleSave}
          disabled={saving || loading}
          className="h-[52px] rounded-full bg-ifwyd-brand px-8 text-[15px] font-medium text-white transition-colors hover:bg-ifwyd-brand-dark disabled:opacity-60"
        >
          {saving ? "Saving..." : mode === "edit" ? "Save Changes" : "Create Classroom"}
        </button>
      </div>
    </div>
  );
}
