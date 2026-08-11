"use client";

import { ContentEditor } from "@/components/content/ContentEditor";
import { fetchContentSections, saveContentSection } from "@/lib/api/content";
import { getDefaultContentSections, type ContentSection } from "@/lib/content-data";
import { cn } from "@/lib/utils";
import { useCallback, useEffect, useMemo, useState } from "react";

export default function ContentPage() {
  const [sections, setSections] = useState<ContentSection[]>(getDefaultContentSections);
  const [selectedId, setSelectedId] = useState<string>(sections[0]?.id ?? "");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [source, setSource] = useState<"api" | "mock" | null>(null);
  const [loadError, setLoadError] = useState<string | undefined>();
  const [actionError, setActionError] = useState<string | null>(null);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    const result = await fetchContentSections();
    setSections(result.sections);
    setSelectedId((current) => (result.sections.some((s) => s.id === current) ? current : (result.sections[0]?.id ?? "")));
    setSource(result.source);
    setLoadError(result.error);
    setLoading(false);
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const selected = useMemo(() => sections.find((s) => s.id === selectedId) ?? null, [sections, selectedId]);

  const grouped = useMemo(() => {
    const byPage = new Map<string, ContentSection[]>();
    for (const section of sections) {
      const list = byPage.get(section.page) ?? [];
      list.push(section);
      byPage.set(section.page, list);
    }
    return Array.from(byPage.entries());
  }, [sections]);

  function updateBody(body: string) {
    setSaveSuccess(false);
    setSections((prev) => prev.map((s) => (s.id === selectedId ? { ...s, body } : s)));
  }

  async function handleSave() {
    if (!selected) return;
    setActionError(null);
    setSaveSuccess(false);
    setSaving(true);

    if (source === "api") {
      try {
        await saveContentSection(selected);
        setSaveSuccess(true);
      } catch (error) {
        setActionError(error instanceof Error ? error.message : "Save failed");
      }
    } else {
      setSaveSuccess(true);
    }

    setSaving(false);
  }

  return (
    <div className="flex mt-3 h-full min-h-0 flex-col overflow-hidden">
      <div className="flex shrink-0 items-start justify-between gap-3">
        <div>
          <h1 className="text-[22px] font-semibold text-neutral-900">Site Content</h1>
          <p className="mt-1 text-[15px] font-normal text-neutral-900">
            Edit copy shown on the public website&apos;s Home and About pages.
          </p>
        </div>
        {source === "mock" && loadError && (
          <span className="max-w-[220px] shrink-0 text-right text-[10px] font-light text-neutral-500">
            API error: {loadError}
          </span>
        )}
      </div>

      {actionError && <p className="mt-2 text-[12px] font-medium text-red-600">{actionError}</p>}
      {saveSuccess && <p className="mt-2 text-[12px] font-medium text-[#2E7D32]">Section saved successfully.</p>}

      <div className="mt-5 grid min-h-0 flex-1 grid-cols-[240px_1fr] gap-4 overflow-hidden">
        <div className="min-h-0 overflow-y-auto rounded-[10px] border border-neutral-200/80 bg-white p-2 shadow-sm">
          {grouped.map(([page, items]) => (
            <div key={page} className="mb-2">
              <p className="px-2 py-1.5 text-[11px] font-semibold uppercase tracking-wide text-neutral-400">{page}</p>
              {items.map((section) => (
                <button
                  key={section.id}
                  type="button"
                  onClick={() => setSelectedId(section.id)}
                  className={cn(
                    "block w-full rounded-lg px-2 py-2 text-left text-[13px] font-medium transition-colors",
                    section.id === selectedId
                      ? "bg-ifwyd-brand/10 text-ifwyd-brand-dark"
                      : "text-neutral-700 hover:bg-neutral-50",
                  )}
                >
                  {section.label}
                </button>
              ))}
            </div>
          ))}
        </div>

        <div className="flex min-h-0 flex-col overflow-hidden">
          {loading || !selected ? (
            <div className="flex min-h-0 flex-1 items-center justify-center rounded-[10px] border border-neutral-200/80 bg-white shadow-sm">
              <p className="text-[13px] text-neutral-400">Loading content...</p>
            </div>
          ) : (
            <>
              <p className="mb-3 shrink-0 text-[13px] text-neutral-500">{selected.description}</p>
              <ContentEditor content={selected.body} onChange={updateBody} disabled={saving} />
            </>
          )}

          <div className="mt-4 flex shrink-0 justify-end">
            <button
              type="button"
              onClick={handleSave}
              disabled={loading || saving || !selected}
              className="h-[48px] w-[120px] rounded-full bg-black text-[14px] font-medium text-white transition-colors hover:bg-neutral-900 disabled:opacity-60"
            >
              {saving ? "Saving..." : "Save"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
