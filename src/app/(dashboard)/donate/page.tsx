"use client";

import { SettingsField, SettingsTextArea } from "@/components/settings/SettingsField";
import { SettingsToggleRow } from "@/components/settings/SettingsToggle";
import { fetchDonateSettings, saveDonateSettings } from "@/lib/api/donate";
import { getDefaultDonateSettings, type DonateSettings } from "@/lib/donate-data";
import { useCallback, useEffect, useState } from "react";

export default function DonatePage() {
  const [settings, setSettings] = useState<DonateSettings>(getDefaultDonateSettings);
  const [amountsInput, setAmountsInput] = useState(getDefaultDonateSettings().suggestedAmounts.join(", "));
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [source, setSource] = useState<"api" | "mock" | null>(null);
  const [loadError, setLoadError] = useState<string | undefined>();
  const [actionError, setActionError] = useState<string | null>(null);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    const result = await fetchDonateSettings();
    setSettings(result.settings);
    setAmountsInput(result.settings.suggestedAmounts.join(", "));
    setSource(result.source);
    setLoadError(result.error);
    setLoading(false);
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  function update<K extends keyof DonateSettings>(key: K, value: DonateSettings[K]) {
    setSaveSuccess(false);
    setSettings((current) => ({ ...current, [key]: value }));
  }

  async function handleSave() {
    setActionError(null);
    setSaveSuccess(false);
    setSaving(true);

    const suggestedAmounts = amountsInput
      .split(",")
      .map((value) => value.trim())
      .filter(Boolean);
    const next = { ...settings, suggestedAmounts };

    if (source === "api") {
      try {
        const result = await saveDonateSettings(next);
        setSettings(result.settings);
        setAmountsInput(result.settings.suggestedAmounts.join(", "));
        setSaveSuccess(true);
      } catch (error) {
        setActionError(error instanceof Error ? error.message : "Save failed");
      }
    } else {
      setSettings(next);
      setSaveSuccess(true);
    }

    setSaving(false);
  }

  return (
    <div className="flex mt-3 h-full min-h-0 flex-col overflow-hidden">
      <div className="flex shrink-0 items-start justify-between gap-3">
        <div>
          <h1 className="text-[22px] font-semibold text-neutral-900">Donate Settings</h1>
          <p className="mt-1 text-[15px] font-normal text-neutral-900">
            Manage the bank details and donation options shown on the Donate page.
          </p>
        </div>
        {source === "mock" && loadError && (
          <span className="max-w-[220px] shrink-0 text-right text-[10px] font-light text-neutral-500">
            API error: {loadError}
          </span>
        )}
      </div>

      {actionError && <p className="mt-2 text-[12px] font-medium text-red-600">{actionError}</p>}
      {saveSuccess && <p className="mt-2 text-[12px] font-medium text-[#2E7D32]">Donate settings saved successfully.</p>}

      <div className="mt-6 min-h-0 flex-1 overflow-y-auto rounded-[10px] border border-neutral-200/80 bg-white shadow-sm">
        {loading ? (
          <p className="py-16 text-center text-[13px] text-neutral-400">Loading donate settings...</p>
        ) : (
          <div className="px-6 py-6">
            <section className="border-b border-neutral-200/80 pb-6 pt-2">
              <h2 className="mb-2 text-[15px] font-semibold text-neutral-900">Bank details</h2>
              <div className="grid grid-cols-2 gap-x-6 gap-y-5">
                <SettingsField label="Bank Name" value={settings.bankName} onChange={(v) => update("bankName", v)} />
                <SettingsField label="Account Name" value={settings.accountName} onChange={(v) => update("accountName", v)} />
                <SettingsField label="Account Number" value={settings.accountNumber} onChange={(v) => update("accountNumber", v)} />
                <SettingsField label="Currency Symbol" value={settings.currency} onChange={(v) => update("currency", v)} />
              </div>
            </section>

            <section className="border-b border-neutral-200/80 py-6">
              <h2 className="mb-2 text-[15px] font-semibold text-neutral-900">Donate page copy</h2>
              <div className="grid grid-cols-2 gap-x-6 gap-y-5">
                <SettingsField label="Suggested amounts (comma-separated)" value={amountsInput} onChange={setAmountsInput} />
                <SettingsTextArea label="Intro text" value={settings.introText} onChange={(v) => update("introText", v)} />
              </div>
            </section>

            <section className="py-6">
              <h2 className="mb-2 text-[15px] font-semibold text-neutral-900">Payment options</h2>
              <div>
                <SettingsToggleRow
                  label="Accept online payments"
                  checked={settings.acceptOnlinePayments}
                  onChange={(v) => update("acceptOnlinePayments", v)}
                />
                <SettingsToggleRow
                  label="Accept bank transfer"
                  checked={settings.acceptBankTransfer}
                  onChange={(v) => update("acceptBankTransfer", v)}
                />
              </div>
            </section>

            <div className="mt-4 flex justify-end border-t border-neutral-200/80 pt-6">
              <button
                type="button"
                onClick={handleSave}
                disabled={saving}
                className="h-[52px] rounded-full bg-black px-8 text-[15px] font-medium text-white transition-colors hover:bg-neutral-900 disabled:opacity-60"
              >
                {saving ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
