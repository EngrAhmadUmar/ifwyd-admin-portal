"use client";

import { SettingsField } from "@/components/settings/SettingsField";
import { SettingsToggleRow } from "@/components/settings/SettingsToggle";
import { fetchSettings, resetSettings, saveSettings } from "@/lib/api/settings";
import { getDefaultSettings, type SettingsState } from "@/lib/settings-data";
import { useCallback, useEffect, useState } from "react";

function SettingsSection({
  title,
  children,
  showDivider = true,
}: {
  title: string;
  children: React.ReactNode;
  showDivider?: boolean;
}) {
  return (
    <section className={showDivider ? "border-b border-neutral-200/80 pb-6 pt-2" : "pt-2 pb-2"}>
      <h2 className="mb-2 text-[15px] font-semibold text-neutral-900">{title}</h2>
      {children}
    </section>
  );
}

export default function SettingsPage() {
  const [settings, setSettings] = useState<SettingsState>(getDefaultSettings);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [resetting, setResetting] = useState(false);
  const [source, setSource] = useState<"api" | "mock" | null>(null);
  const [loadError, setLoadError] = useState<string | undefined>();
  const [actionError, setActionError] = useState<string | null>(null);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const loadSettings = useCallback(async () => {
    setLoading(true);
    const result = await fetchSettings();
    setSettings(result.settings);
    setSource(result.source);
    setLoadError(result.error);
    setLoading(false);
  }, []);

  useEffect(() => {
    loadSettings();
  }, [loadSettings]);

  function updateBrand<K extends keyof SettingsState["brand"]>(key: K, value: SettingsState["brand"][K]) {
    setSaveSuccess(false);
    setSettings((current) => ({ ...current, brand: { ...current.brand, [key]: value } }));
  }

  function updateSocial<K extends keyof SettingsState["social"]>(key: K, value: SettingsState["social"][K]) {
    setSaveSuccess(false);
    setSettings((current) => ({ ...current, social: { ...current.social, [key]: value } }));
  }

  function updateApplication<K extends keyof SettingsState["application"]>(
    key: K,
    value: SettingsState["application"][K],
  ) {
    setSaveSuccess(false);
    setSettings((current) => ({ ...current, application: { ...current.application, [key]: value } }));
  }

  async function handleReset() {
    setActionError(null);
    setSaveSuccess(false);
    setResetting(true);

    if (source === "api") {
      try {
        const result = await resetSettings();
        setSettings(result.settings);
      } catch (error) {
        setActionError(error instanceof Error ? error.message : "Reset failed");
      }
    } else {
      setSettings(getDefaultSettings());
    }

    setResetting(false);
  }

  async function handleSave() {
    setActionError(null);
    setSaveSuccess(false);
    setSaving(true);

    if (source === "api") {
      try {
        const result = await saveSettings(settings);
        setSettings(result.settings);
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
          <h1 className="text-[22px] font-semibold text-neutral-900">Settings</h1>
          <p className="mt-1 text-[15px] font-normal text-neutral-900">
            Manage organization details, social links, and site-wide behavior.
          </p>
        </div>
        {source === "mock" && loadError && (
          <span className="max-w-[220px] shrink-0 text-right text-[10px] font-light text-neutral-500">
            API error: {loadError}
          </span>
        )}
      </div>

      {actionError && <p className="mt-2 text-[12px] font-medium text-red-600">{actionError}</p>}
      {saveSuccess && <p className="mt-2 text-[12px] font-medium text-[#2E7D32]">Settings saved successfully.</p>}

      <div className="mt-6 min-h-0 flex-1 overflow-y-auto rounded-[10px] border border-neutral-200/80 bg-white shadow-sm">
        {loading ? (
          <p className="py-16 text-center text-[13px] text-neutral-400">Loading settings...</p>
        ) : (
          <div className="px-6 py-6">
            <SettingsSection title="Organization details">
              <div className="grid grid-cols-2 gap-x-6 gap-y-5">
                <SettingsField label="Organization Name" value={settings.brand.orgName} onChange={(v) => updateBrand("orgName", v)} />
                <SettingsField label="Tagline" value={settings.brand.tagline} onChange={(v) => updateBrand("tagline", v)} />
                <SettingsField label="Contact Email" type="email" value={settings.brand.contactEmail} onChange={(v) => updateBrand("contactEmail", v)} />
                <SettingsField label="Contact Phone" type="tel" value={settings.brand.contactPhone} onChange={(v) => updateBrand("contactPhone", v)} />
                <SettingsField label="Address" value={settings.brand.address} onChange={(v) => updateBrand("address", v)} />
              </div>
            </SettingsSection>

            <SettingsSection title="Social links">
              <div className="grid grid-cols-2 gap-x-6 gap-y-5">
                <SettingsField label="Facebook" value={settings.social.facebook} onChange={(v) => updateSocial("facebook", v)} />
                <SettingsField label="Instagram" value={settings.social.instagram} onChange={(v) => updateSocial("instagram", v)} />
                <SettingsField label="Twitter / X" value={settings.social.twitter} onChange={(v) => updateSocial("twitter", v)} />
                <SettingsField label="LinkedIn" value={settings.social.linkedin} onChange={(v) => updateSocial("linkedin", v)} />
              </div>
            </SettingsSection>

            <SettingsSection title="Application settings" showDivider={false}>
              <div>
                <SettingsToggleRow
                  label="Accept volunteer applications"
                  checked={settings.application.acceptVolunteerApplications}
                  onChange={(v) => updateApplication("acceptVolunteerApplications", v)}
                />
                <SettingsToggleRow
                  label="Accept registrations"
                  checked={settings.application.acceptRegistrations}
                  onChange={(v) => updateApplication("acceptRegistrations", v)}
                />
                <SettingsToggleRow
                  label="Newsletter signup on website"
                  checked={settings.application.newsletterSignup}
                  onChange={(v) => updateApplication("newsletterSignup", v)}
                />
                <SettingsToggleRow
                  label="Maintenance mode"
                  checked={settings.application.maintenanceMode}
                  onChange={(v) => updateApplication("maintenanceMode", v)}
                />
              </div>
            </SettingsSection>

            <div className="mt-4 flex justify-end gap-4 border-t border-neutral-200/80 pt-6">
              <button
                type="button"
                onClick={handleReset}
                disabled={resetting || saving}
                className="h-[52px] rounded-full bg-[#F0F0F0] px-8 text-[15px] font-medium text-neutral-900 transition-colors hover:bg-[#E8E8E8] disabled:opacity-60"
              >
                {resetting ? "Resetting..." : "Reset to Default"}
              </button>
              <button
                type="button"
                onClick={handleSave}
                disabled={saving || resetting}
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
