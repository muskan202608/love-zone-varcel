"use client";

import Image from "next/image";
import { type ChangeEvent, useMemo, useState } from "react";
import { getExpiryDate, getMembershipStatus, membershipDurations, membershipPlanBadge, membershipPlanLabel, type MembershipStatus } from "../lib/membership";
import { stateSeoPages } from "../lib/seo-states";
import type { MembershipDuration, SafeMember, SeoKey, SiteSettings } from "../lib/types";

type Tab = "overview" | "members" | "contacts" | "certificates" | "content" | "seo";

const tabs: { value: Tab; label: string }[] = [
  { value: "overview", label: "Overview" },
  { value: "members", label: "Members" },
  { value: "contacts", label: "Contacts" },
  { value: "certificates", label: "Certificates" },
  { value: "content", label: "Homepage content" },
  { value: "seo", label: "SEO manager" },
];

const publicSeoPages: { value: SeoKey; label: string; group: "Site pages" }[] = [
  { value: "home", label: "Homepage", group: "Site pages" },
  { value: "signup", label: "Join page", group: "Site pages" },
  { value: "login", label: "Login page", group: "Site pages" },
  { value: "member", label: "Member dashboard", group: "Site pages" },
  { value: "verify", label: "Verification page", group: "Site pages" },
];

const seoPages = [
  ...publicSeoPages,
  ...stateSeoPages.map((state) => ({ value: state.slug, label: state.name, group: "State SEO pages" as const })),
];

const membershipStatusStyle: Record<MembershipStatus, string> = {
  Active: "bg-emerald-500/15 text-emerald-200",
  Expired: "bg-red-500/15 text-red-200",
  Pending: "bg-amber-400/10 text-amber-200",
  Rejected: "bg-red-500/15 text-red-200",
};

const displayDate = (value?: string) => {
  if (!value) return "—";
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? value : new Intl.DateTimeFormat("en-IN", { day: "2-digit", month: "short", year: "numeric" }).format(date);
};

export function AdminDashboard({ initialMembers, initialSettings }: { initialMembers: SafeMember[]; initialSettings: SiteSettings }) {
  const [tab, setTab] = useState<Tab>("overview");
  const [members, setMembers] = useState(initialMembers);
  const [settings, setSettings] = useState(initialSettings);
  const [seoPage, setSeoPage] = useState<SeoKey>("home");
  const [seoQuery, setSeoQuery] = useState("");
  const [approvalTarget, setApprovalTarget] = useState<SafeMember | null>(null);
  const [membershipDuration, setMembershipDuration] = useState<MembershipDuration>(3);
  const [message, setMessage] = useState("");
  const [saving, setSaving] = useState(false);

  const notify = (text: string) => {
    setMessage(text);
    window.setTimeout(() => setMessage(""), 3500);
  };

  const saveSettings = async (payload: unknown, successMessage = "Changes saved.") => {
    setSaving(true);
    try {
      const response = await fetch("/api/admin", { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || "Unable to save changes.");
      setSettings(result.settings);
      notify(successMessage);
    } catch (error) {
      notify(error instanceof Error ? error.message : "Unable to save changes.");
    } finally {
      setSaving(false);
    }
  };

  const updateStatus = async (memberId: string, status: "Approved" | "Rejected", duration?: MembershipDuration) => {
    setSaving(true);
    try {
      const response = await fetch("/api/admin", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "status", memberId, status, membershipDuration: duration }),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || "Unable to update member.");
      setMembers((current) => current.map((member) => member.id === memberId ? result.member : member));
      if (status === "Approved") setApprovalTarget(null);
      notify(status === "Approved" ? "Membership approved and digital ID updated." : "Member status updated.");
    } catch (error) {
      notify(error instanceof Error ? error.message : "Unable to update member.");
    } finally {
      setSaving(false);
    }
  };

  const uploadCertificate = async (type: "gst" | "police", event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    setSaving(true);
    try {
      const formData = new FormData();
      formData.append("type", type);
      formData.append("file", file);
      const response = await fetch("/api/admin/certificate", { method: "POST", body: formData });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || "Unable to upload certificate.");
      setSettings(result.settings);
      notify("Certificate uploaded.");
    } catch (error) {
      notify(error instanceof Error ? error.message : "Unable to upload certificate.");
    } finally {
      setSaving(false);
      event.target.value = "";
    }
  };

  const updateContact = (index: number, field: "name" | "phone" | "whatsapp", value: string) => {
    const contacts = settings.contacts.map((contact, contactIndex) => contactIndex === index ? { ...contact, [field]: value } : contact);
    setSettings({ ...settings, contacts });
  };

  const pending = members.filter((member) => member.status === "Pending").length;
  const selectedSeo = settings.seo[seoPage] || { title: "", description: "", keywords: "" };
  const selectedSeoLabel = seoPages.find((page) => page.value === seoPage)?.label || seoPage;
  const matchingSeoPages = useMemo(() => {
    const query = seoQuery.trim().toLowerCase();
    return query ? seoPages.filter((page) => page.label.toLowerCase().includes(query) || page.value.includes(query)) : seoPages;
  }, [seoQuery]);

  const openApprovalModal = (member: SafeMember) => {
    setApprovalTarget(member);
    setMembershipDuration(member.membershipDuration || 3);
  };

  return (
    <>
      <div className="grid gap-7 lg:grid-cols-[224px_minmax(0,1fr)]">
        <aside className="surface h-fit p-3 lg:sticky lg:top-24">
          <p className="px-3 py-2 text-sm font-bold">Admin workspace</p>
          <nav className="mt-2 grid gap-1">{tabs.map((item) => <button type="button" key={item.value} onClick={() => setTab(item.value)} className={`rounded-xl px-3 py-2.5 text-left text-sm font-semibold transition ${tab === item.value ? "bg-red-500/15 text-white ring-1 ring-red-500/25" : "text-zinc-400 hover:bg-white/5 hover:text-white"}`}>{item.label}</button>)}</nav>
        </aside>

        <section className="min-w-0">
          {message && <p className="mb-5 rounded-xl border border-red-400/20 bg-red-500/10 px-4 py-3 text-sm text-red-100">{message}</p>}

          {tab === "overview" && <>
            <p className="eyebrow">Membership operations</p><h1 className="section-title">Dashboard</h1>
            <div className="mt-8 grid gap-4 sm:grid-cols-3">
              <article className="surface p-5"><p className="text-sm text-zinc-500">Total users</p><strong className="mt-3 block text-4xl font-semibold tracking-tight">{members.length}</strong><p className="mt-2 text-xs text-zinc-500">Registered profiles</p></article>
              <article className="surface p-5"><p className="text-sm text-zinc-500">Active members</p><strong className="mt-3 block text-4xl font-semibold tracking-tight">{members.filter((member) => getMembershipStatus(member) === "Active").length}</strong><p className="mt-2 text-xs text-zinc-500">Current memberships</p></article>
              <article className="surface p-5"><p className="text-sm text-zinc-500">Pending approvals</p><strong className="mt-3 block text-4xl font-semibold tracking-tight">{pending}</strong><p className="mt-2 text-xs text-zinc-500">Require review</p></article>
            </div>
            <article className="surface mt-5 p-6"><h2 className="text-lg font-semibold">Approval workflow</h2><p className="mt-2 max-w-2xl text-sm leading-6 text-zinc-400">Choose a 1, 2, or 3 month plan when approving a profile. The start and expiry dates are saved automatically, and the ID card reflects the current plan.</p><button type="button" className="button-primary mt-5" onClick={() => setTab("members")}>Review members</button></article>
          </>}

          {tab === "members" && <>
            <p className="eyebrow">Member directory</p><h1 className="section-title">Users &amp; approvals</h1><p className="mt-3 text-sm text-zinc-500">Select a membership plan before approval. Membership status switches to expired automatically after the saved expiry date.</p>
            <div className="mt-8 grid gap-4">{members.length ? members.map((member) => {
              const membershipStatus = getMembershipStatus(member);
              const isApproved = member.status === "Approved";
              return <article className="surface flex flex-col gap-5 p-5 sm:flex-row sm:items-center" key={member.id}>
                <Image className="h-16 w-16 rounded-full border border-red-500/30 object-cover" src={member.photoUrl} alt={member.name} width={64} height={64} sizes="64px" />
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2"><h2 className="font-semibold">{member.name}</h2><span className={`badge ${membershipStatusStyle[membershipStatus]}`}>{membershipStatus}</span>{isApproved && <span className="badge border border-red-400/20 bg-red-500/10 text-red-100">{membershipPlanBadge(member.membershipDuration)}</span>}</div>
                  <p className="mt-1 text-sm text-zinc-500">{member.email} · {member.mobile}</p>
                  <p className="mt-1 text-xs text-zinc-500">{member.city}, {member.state} · DOB {member.dateOfBirth} · {member.bodyWeight}</p>
                  {isApproved && <p className="mt-2 text-xs text-zinc-400"><span className="font-semibold text-zinc-200">Plan:</span> {membershipPlanLabel(member.membershipDuration)} · <span className="font-semibold text-zinc-200">Expiry:</span> {displayDate(getExpiryDate(member))}</p>}
                  {member.employeeId && <p className="mt-2 text-sm font-bold text-red-400">{member.employeeId}</p>}
                </div>
                <div className="flex flex-wrap gap-2"><button type="button" disabled={saving} className="button-primary !min-h-10 !px-3 !py-2 text-xs" onClick={() => openApprovalModal(member)}>{isApproved ? "Change plan" : "Approve membership"}</button><button type="button" disabled={saving} className="button-secondary !min-h-10 !px-3 !py-2 text-xs" onClick={() => updateStatus(member.id, "Rejected")}>Reject</button></div>
              </article>;
            }) : <article className="surface p-6 text-sm text-zinc-500">No member applications yet.</article>}</div>
          </>}

          {tab === "contacts" && <>
            <p className="eyebrow">Homepage support</p><h1 className="section-title">Eight contact cards</h1><p className="mt-3 text-sm text-zinc-500">These eight entries are shown on the homepage.</p>
            <div className="mt-7 grid gap-4 lg:grid-cols-2">{settings.contacts.map((contact, index) => <article className="surface grid gap-4 p-5 sm:grid-cols-3" key={contact.id}><p className="sm:col-span-3 text-xs font-bold uppercase tracking-[0.14em] text-red-300">Contact {index + 1}</p><label className="field-label">Name<input className="field" value={contact.name} onChange={(event) => updateContact(index, "name", event.target.value)} /></label><label className="field-label">Phone<input className="field" inputMode="numeric" value={contact.phone} onChange={(event) => updateContact(index, "phone", event.target.value)} /></label><label className="field-label">WhatsApp<input className="field" inputMode="numeric" value={contact.whatsapp} onChange={(event) => updateContact(index, "whatsapp", event.target.value)} /></label></article>)}</div>
            <button type="button" disabled={saving} className="button-primary mt-5" onClick={() => saveSettings({ action: "contacts", contacts: settings.contacts }, "All eight contact cards saved.")}>Save contacts</button>
          </>}

          {tab === "certificates" && <>
            <p className="eyebrow">Trust documents</p><h1 className="section-title">Certificates</h1>
            <div className="mt-7 grid gap-4"><label className="surface grid gap-4 p-5"><span className="font-semibold">GST Certificate</span>{settings.certificates.gst && <Image className="max-h-56 w-full rounded-xl bg-black object-contain" src={settings.certificates.gst} alt="GST certificate" width={1200} height={900} sizes="(max-width: 640px) calc(100vw - 3rem), 560px" />}<input className="field" type="file" accept="image/*" disabled={saving} onChange={(event) => uploadCertificate("gst", event)} /></label><label className="surface grid gap-4 p-5"><span className="font-semibold">Police Verification Certificate</span>{settings.certificates.police && <Image className="max-h-56 w-full rounded-xl bg-black object-contain" src={settings.certificates.police} alt="Police certificate" width={1200} height={900} sizes="(max-width: 640px) calc(100vw - 3rem), 560px" />}<input className="field" type="file" accept="image/*" disabled={saving} onChange={(event) => uploadCertificate("police", event)} /></label></div>
          </>}

          {tab === "content" && <>
            <p className="eyebrow">Homepage copy</p><h1 className="section-title">Content management</h1>
            <article className="surface mt-7 grid gap-4 p-5"><h2 className="font-semibold">Hero section</h2>{settings.hero.lines.map((line, index) => <label className="field-label" key={index}>Heading line {index + 1}<input className="field" value={line} onChange={(event) => { const lines = [...settings.hero.lines] as [string, string, string]; lines[index] = event.target.value; setSettings({ ...settings, hero: { ...settings.hero, lines } }); }} /></label>)}<label className="field-label">Subtitle<input className="field" value={settings.hero.subtitle} onChange={(event) => setSettings({ ...settings, hero: { ...settings.hero, subtitle: event.target.value } })} /></label><label className="field-label">Description<textarea className="field min-h-28 resize-y" value={settings.hero.description} onChange={(event) => setSettings({ ...settings, hero: { ...settings.hero, description: event.target.value } })} /></label><button type="button" disabled={saving} className="button-primary w-fit" onClick={() => saveSettings({ action: "hero", hero: settings.hero }, "Hero content saved.")}>Save hero</button></article>
            <article className="surface mt-5 grid gap-4 p-5"><h2 className="font-semibold">Company process</h2><label className="field-label">Subtext<input className="field" value={settings.process.subtext} onChange={(event) => setSettings({ ...settings, process: { ...settings.process, subtext: event.target.value } })} /></label>{settings.process.steps.map((step, index) => <div className="grid gap-3 border-t border-white/10 pt-4" key={index}><label className="field-label">Step {index + 1} title<input className="field" value={step.title} onChange={(event) => { const steps = settings.process.steps.map((item) => ({ ...item })); steps[index].title = event.target.value; setSettings({ ...settings, process: { ...settings.process, steps } }); }} /></label><label className="field-label">Points (one per line)<textarea className="field min-h-24 resize-y" value={step.points.join("\n")} onChange={(event) => { const steps = settings.process.steps.map((item) => ({ ...item })); steps[index].points = event.target.value.split("\n").filter(Boolean); setSettings({ ...settings, process: { ...settings.process, steps } }); }} /></label></div>)}<button type="button" disabled={saving} className="button-primary w-fit" onClick={() => saveSettings({ action: "process", process: settings.process }, "Company process saved.")}>Save process</button></article>
          </>}

          {tab === "seo" && <>
            <p className="eyebrow">Private admin setting</p><h1 className="section-title">SEO manager</h1><p className="mt-3 text-sm text-zinc-500">This management area is available only inside the protected admin dashboard.</p>
            <article className="surface mt-7 grid gap-5 p-5 sm:p-6"><div><label className="field-label" htmlFor="seo-page-search">Search page or state</label><input id="seo-page-search" className="field" value={seoQuery} placeholder="Search Delhi, Uttar Pradesh, homepage…" onChange={(event) => setSeoQuery(event.target.value)} /><div className="mt-3 max-h-64 overflow-y-auto rounded-xl border border-white/10 bg-black/25 p-2">{matchingSeoPages.length ? matchingSeoPages.map((page, index) => <div key={page.value}>{(index === 0 || matchingSeoPages[index - 1].group !== page.group) && <p className="px-2 pb-1 pt-2 text-[10px] font-bold uppercase tracking-[0.16em] text-zinc-500">{page.group}</p>}<button type="button" onClick={() => { setSeoPage(page.value); setSeoQuery(""); }} className={`flex w-full items-center justify-between rounded-lg px-3 py-2.5 text-left text-sm transition ${seoPage === page.value ? "bg-red-500/15 text-white ring-1 ring-red-500/30" : "text-zinc-300 hover:bg-white/5"}`}><span>{page.label}</span><span className="text-xs text-zinc-500">{page.group === "State SEO pages" ? `/${page.value}` : "Site page"}</span></button></div>) : <p className="px-3 py-4 text-sm text-zinc-500">No matching pages or states.</p>}</div></div><div className="rounded-xl border border-red-400/15 bg-red-500/[0.06] px-4 py-3 text-sm text-red-100"><span className="font-semibold">Editing: </span>{selectedSeoLabel}</div><label className="field-label">Page title<input className="field" value={selectedSeo.title} onChange={(event) => setSettings({ ...settings, seo: { ...settings.seo, [seoPage]: { ...selectedSeo, title: event.target.value } } })} /></label><label className="field-label">Meta description<textarea className="field min-h-28 resize-y" value={selectedSeo.description} onChange={(event) => setSettings({ ...settings, seo: { ...settings.seo, [seoPage]: { ...selectedSeo, description: event.target.value } } })} /></label><label className="field-label">Keywords <span className="font-normal text-zinc-500">(comma-separated)</span><input className="field" value={selectedSeo.keywords} onChange={(event) => setSettings({ ...settings, seo: { ...settings.seo, [seoPage]: { ...selectedSeo, keywords: event.target.value } } })} /></label><button type="button" disabled={saving} className="button-primary w-fit" onClick={() => saveSettings({ action: "seo", seo: settings.seo }, `${selectedSeoLabel} SEO saved.`)}>Save SEO</button></article>
          </>}
        </section>
      </div>

      {approvalTarget && <div className="fixed inset-0 z-50 grid place-items-center bg-black/75 p-4 backdrop-blur-sm" role="dialog" aria-modal="true" aria-labelledby="approval-dialog-title" onMouseDown={(event) => { if (event.target === event.currentTarget && !saving) setApprovalTarget(null); }}><section className="modal-panel surface w-full max-w-md border-red-400/25 p-6 shadow-[0_28px_90px_rgba(0,0,0,.7)] sm:p-7"><div className="flex items-start justify-between gap-4"><div><p className="eyebrow">Membership control</p><h2 id="approval-dialog-title" className="mt-2 text-2xl font-semibold tracking-tight">Approve Membership</h2><p className="mt-2 text-sm leading-6 text-zinc-400">Choose a duration for {approvalTarget.name}. The expiry date is calculated from today.</p></div><button type="button" className="grid h-9 w-9 shrink-0 place-items-center rounded-full border border-white/10 text-zinc-400 transition hover:bg-white/10 hover:text-white" aria-label="Close" disabled={saving} onClick={() => setApprovalTarget(null)}>×</button></div><fieldset className="mt-6 grid gap-3"><legend className="sr-only">Membership duration</legend>{membershipDurations.map((duration) => <label key={duration} className={`flex cursor-pointer items-center justify-between rounded-xl border p-4 transition ${membershipDuration === duration ? "border-red-400/60 bg-red-500/10 ring-1 ring-red-500/20" : "border-white/10 bg-black/20 hover:border-white/20"}`}><span className="flex items-center gap-3"><input className="h-4 w-4 accent-red-500" type="radio" name="membership-duration" value={duration} checked={membershipDuration === duration} onChange={() => setMembershipDuration(duration)} /><span><span className="block font-semibold">{membershipPlanLabel(duration)}</span><span className="mt-0.5 block text-xs text-zinc-500">Valid for {duration * 30} days</span></span></span><span className="text-xs font-bold text-red-200">{membershipPlanBadge(duration)}</span></label>)}</fieldset><div className="mt-7 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end"><button type="button" className="button-secondary" disabled={saving} onClick={() => setApprovalTarget(null)}>Cancel</button><button type="button" className="button-primary" disabled={saving} onClick={() => updateStatus(approvalTarget.id, "Approved", membershipDuration)}>{saving ? "Saving…" : "Confirm Approval"}</button></div></section></div>}
    </>
  );
}
