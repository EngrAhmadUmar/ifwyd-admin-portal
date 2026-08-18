"use client";

import { SettingsField, SettingsSelect, SettingsTextArea } from "@/components/settings/SettingsField";
import { createJob, getJob, updateJob } from "@/lib/api/career";
import { JOB_STATUSES, JOB_TYPES, type JobStatus, type JobType } from "@/lib/career-data";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

type JobFormProps = {
  mode: "create" | "edit";
  editId?: string;
};

export function JobForm({ mode, editId }: JobFormProps) {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [department, setDepartment] = useState("");
  const [location, setLocation] = useState("");
  const [description, setDescription] = useState("");
  const [type, setType] = useState<JobType>("Full-time");
  const [status, setStatus] = useState<JobStatus>("Open");
  const [loading, setLoading] = useState(mode === "edit");
  const [notFound, setNotFound] = useState(false);
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  useEffect(() => {
    if (mode !== "edit" || !editId) return;
    let active = true;
    getJob(editId).then((result) => {
      if (!active) return;
      if (!result.job) {
        setNotFound(true);
        setLoading(false);
        return;
      }
      setTitle(result.job.title);
      setDepartment(result.job.department);
      setLocation(result.job.location);
      setType(result.job.type);
      setStatus(result.job.status);
      setLoading(false);
    });
    return () => {
      active = false;
    };
  }, [mode, editId]);

  async function handleSave() {
    if (!title.trim()) {
      setFormError("Add a title before saving.");
      return;
    }
    setFormError(null);
    setSaving(true);

    const input = { title, department, location, description, type, status };

    if (mode === "edit" && editId) {
      await updateJob(editId, input);
    } else {
      await createJob(input);
    }
    router.push("/career");
  }

  if (notFound) {
    return (
      <div className="mt-3 flex h-full min-h-0 flex-col items-center justify-center text-center">
        <p className="text-[15px] text-neutral-500">That job posting couldn&apos;t be found.</p>
      </div>
    );
  }

  return (
    <div className="mt-3 flex h-full min-h-0 flex-col overflow-hidden">
      <div className="shrink-0">
        <h1 className="text-[22px] font-semibold text-neutral-900">
          {mode === "edit" ? "Edit Job Posting" : "New Job Posting"}
        </h1>
        <p className="mt-1 text-[15px] font-normal text-neutral-900">
          {mode === "edit" ? "Update this role's details." : "Add a new open role to the Career page."}
        </p>
      </div>

      {formError && <p className="mt-2 shrink-0 text-[12px] font-medium text-red-600">{formError}</p>}

      <div className="mt-6 min-h-0 flex-1 overflow-y-auto rounded-[10px] border border-neutral-200/80 bg-white shadow-sm">
        {loading ? (
          <p className="py-16 text-center text-[13px] text-neutral-400">Loading...</p>
        ) : (
          <div className="space-y-5 px-6 py-6">
            <SettingsField label="Title" value={title} onChange={setTitle} />
            <div className="grid grid-cols-2 gap-4">
              <SettingsField label="Department" value={department} onChange={setDepartment} />
              <SettingsField label="Location" value={location} onChange={setLocation} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <SettingsSelect label="Type" value={type} onChange={(value) => setType(value as JobType)} options={JOB_TYPES} />
              <SettingsSelect
                label="Status"
                value={status}
                onChange={(value) => setStatus(value as JobStatus)}
                options={JOB_STATUSES}
              />
            </div>
            <SettingsTextArea label="Description" value={description} onChange={setDescription} rows={6} />
          </div>
        )}
      </div>

      <div className="mt-5 flex shrink-0 justify-end gap-3">
        <button
          type="button"
          onClick={() => router.push("/career")}
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
          {saving ? "Saving..." : mode === "edit" ? "Save Changes" : "Create Posting"}
        </button>
      </div>
    </div>
  );
}
