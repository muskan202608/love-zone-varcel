"use client";

import { ChangeEvent, useState } from "react";
import type { ApprovalStatus, SafeMember, SiteSettings } from "../lib/types";

type Tab = "overview" | "members" | "contacts" | "certificates" | "content";

const tabs: { value: Tab; label: string }[] = [
  { value: "overview", label: "Overview" },
  { value: "members", label: "Members" },
  { value: "contacts", label: "Contacts" },
  { value: "certificates", label: "Certificates" },
  { value: "content", label: "Homepage content" },
];

const statusStyle: Record<ApprovalStatus, string> = {
  Pending: "bg-amber-400/10 text-amber-200",
  Approved: "bg-emerald-500/15 text-emerald-200",
  Rejected: "bg-red-500/15 text-red-200",
};

export function AdminDashboard({ initialMembers, initialSettings }: { initialMembers: SafeMember[]; initialSettings: SiteSettings }) {
  const [tab, setTab] = useState<Tab>("overview");
  const [members, setMembers] = useState(initialMembers);
  const [settings, setSettings] = useState(initialSettings);
  const [message, setMessage] = useState("");
  const [saving, setSaving] = useState(false);
  const notify = (text: string) => { setMessage(text); window.setTimeout(() => setMessage(""), 3500); };
  const saveSettings = async (payload: unknown) => {
    setSaving(true);
    try {
      const response = await fetch("/api/admin", { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || "Unable to save changes.");
      setSettings(result.settings); notify("Changes saved.");
    } catch (error) { notify(error instanceof Error ? error.message : "Unable to save changes."); } finally { setSaving(false); }
  };
  const updateStatus = async (memberId: string, status: ApprovalStatus) => {
    setSaving(true);
    try {
      const response = await fetch("/api/admin", { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ action: "status", memberId, status }) });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || "Unable to update member.");
      setMembers((current) => current.map((member) => member.id === memberId ? result.member : member));
      notify(status === "Approved" ? "Member approved and ID card generated." : "Member status updated.");
    } catch (error) { notify(error instanceof Error ? error.message : "Unable to update member."); } finally { setSaving(false); }
  };
  const uploadCertificate = async (type: "gst" | "police", event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]; if (!file) return;
    setSaving(true);
    try {
      const formData = new FormData(); formData.append("type", type); formData.append("file", file);
      const response = await fetch("/api/admin/certificate", { method: "POST", body: formData }); const result = await response.json();
      if (!response.ok) throw new Error(result.error || "Unable to upload certificate.");
      setSettings(result.settings); notify("Certificate uploaded.");
    } catch (error) { notify(error instanceof Error ? error.message : "Unable to upload certificate."); } finally { setSaving(false); event.target.value = ""; }
  };
  const pending = members.filter((member) => member.status === "Pending").length;
  return <div className="grid gap-7 lg:grid-cols-[224px_minmax(0,1fr)]"><aside className="surface h-fit p-3 lg:sticky lg:top-24"><p className="px-3 py-2 text-sm font-bold">Admin workspace</p><nav className="mt-2 grid gap-1">{tabs.map((item) => <button key={item.value} onClick={() => setTab(item.value)} className={`rounded-xl px-3 py-2.5 text-left text-sm font-semibold transition ${tab === item.value ? "bg-red-500/15 text-white ring-1 ring-red-500/25" : "text-zinc-400 hover:bg-white/5 hover:text-white"}`}>{item.label}</button>)}</nav></aside><section className="min-w-0">{message && <p className="mb-5 rounded-xl border border-red-400/20 bg-red-500/10 px-4 py-3 text-sm text-red-100">{message}</p>}{tab === "overview" && <><p className="eyebrow">Membership operations</p><h1 className="section-title">Dashboard</h1><div className="mt-8 grid gap-4 sm:grid-cols-3"><article className="surface p-5"><p className="text-sm text-zinc-500">Total users</p><strong className="mt-3 block text-4xl font-semibold tracking-tight">{members.length}</strong><p className="mt-2 text-xs text-zinc-500">Registered profiles</p></article><article className="surface p-5"><p className="text-sm text-zinc-500">Approved members</p><strong className="mt-3 block text-4xl font-semibold tracking-tight">{members.filter((member) => member.status === "Approved").length}</strong><p className="mt-2 text-xs text-zinc-500">Digital IDs issued</p></article><article className="surface p-5"><p className="text-sm text-zinc-500">Pending approvals</p><strong className="mt-3 block text-4xl font-semibold tracking-tight">{pending}</strong><p className="mt-2 text-xs text-zinc-500">Require review</p></article></div><article className="surface mt-5 p-6"><h2 className="text-lg font-semibold">Approval workflow</h2><p className="mt-2 max-w-2xl text-sm leading-6 text-zinc-400">Approve a profile to assign the next employee ID in the PBZ-5600 sequence and create its QR-code verification page automatically.</p><button className="button-primary mt-5" onClick={() => setTab("members")}>Review members</button></article></>}{tab === "members" && <><p className="eyebrow">Member directory</p><h1 className="section-title">Users &amp; approvals</h1><div className="mt-8 grid gap-4">{members.length ? members.map((member) => <article className="surface flex flex-col gap-5 p-5 sm:flex-row sm:items-center" key={member.id}><img className="h-16 w-16 rounded-full border border-red-500/30 object-cover" src={member.photoUrl} alt={member.name} /><div className="min-w-0 flex-1"><div className="flex flex-wrap items-center gap-2"><h2 className="font-semibold">{member.name}</h2><span className={`badge ${statusStyle[member.status]}`}>{member.status}</span></div><p className="mt-1 text-sm text-zinc-500">{member.email} · {member.mobile}</p><p className="mt-1 text-xs text-zinc-500">{member.city}, {member.state} · DOB {member.dateOfBirth} · {member.bodyWeight}</p>{member.employeeId && <p className="mt-2 text-sm font-bold text-red-400">{member.employeeId}</p>}</div><div className="flex flex-wrap gap-2"><button disabled={saving} className="button-primary !min-h-10 !px-3 !py-2 text-xs" onClick={() => updateStatus(member.id, "Approved")}>{member.employeeId ? "Approved" : "Approve & issue ID"}</button><button disabled={saving} className="button-secondary !min-h-10 !px-3 !py-2 text-xs" onClick={() => updateStatus(member.id, "Rejected")}>Reject</button></div></article>) : <article className="surface p-6 text-sm text-zinc-500">No member applications yet.</article>}</div></>}{tab === "contacts" && <><p className="eyebrow">Homepage support</p><h1 className="section-title">Contact management</h1><p className="mt-3 text-sm text-zinc-500">Phone numbers and WhatsApp destinations update on the homepage immediately.</p><div className="mt-7 grid gap-4">{settings.contacts.map((contact, index) => <article className="surface grid gap-4 p-5 sm:grid-cols-3" key={contact.id}><label className="field-label">Label<input className="field" value={contact.name} onChange={(event) => { const contacts = [...settings.contacts]; contacts[index] = { ...contact, name: event.target.value }; setSettings({ ...settings, contacts }); }} /></label><label className="field-label">Phone<input className="field" inputMode="numeric" value={contact.phone} onChange={(event) => { const contacts = [...settings.contacts]; contacts[index] = { ...contact, phone: event.target.value }; setSettings({ ...settings, contacts }); }} /></label><label className="field-label">WhatsApp<input className="field" inputMode="numeric" value={contact.whatsapp} onChange={(event) => { const contacts = [...settings.contacts]; contacts[index] = { ...contact, whatsapp: event.target.value }; setSettings({ ...settings, contacts }); }} /></label></article>)}</div><button disabled={saving} className="button-primary mt-5" onClick={() => saveSettings({ action: "contacts", contacts: settings.contacts })}>Save contacts</button></>}{tab === "certificates" && <><p className="eyebrow">Trust documents</p><h1 className="section-title">Certificates</h1><div className="mt-7 grid gap-4"><label className="surface grid gap-4 p-5"><span className="font-semibold">GST Certificate</span>{settings.certificates.gst && <img className="max-h-56 w-full rounded-xl bg-black object-contain" src={settings.certificates.gst} alt="GST certificate" />}<input className="field" type="file" accept="image/*" disabled={saving} onChange={(event) => uploadCertificate("gst", event)} /></label><label className="surface grid gap-4 p-5"><span className="font-semibold">Police Verification Certificate</span>{settings.certificates.police && <img className="max-h-56 w-full rounded-xl bg-black object-contain" src={settings.certificates.police} alt="Police certificate" />}<input className="field" type="file" accept="image/*" disabled={saving} onChange={(event) => uploadCertificate("police", event)} /></label></div></>}{tab === "content" && <><p className="eyebrow">Homepage copy</p><h1 className="section-title">Content management</h1><article className="surface mt-7 grid gap-4 p-5"><h2 className="font-semibold">Hero section</h2>{settings.hero.lines.map((line, index) => <label className="field-label" key={index}>Heading line {index + 1}<input className="field" value={line} onChange={(event) => { const lines = [...settings.hero.lines] as [string, string, string]; lines[index] = event.target.value; setSettings({ ...settings, hero: { ...settings.hero, lines } }); }} /></label>)}<label className="field-label">Subtitle<input className="field" value={settings.hero.subtitle} onChange={(event) => setSettings({ ...settings, hero: { ...settings.hero, subtitle: event.target.value } })} /></label><label className="field-label">Description<textarea className="field min-h-28 resize-y" value={settings.hero.description} onChange={(event) => setSettings({ ...settings, hero: { ...settings.hero, description: event.target.value } })} /></label><button disabled={saving} className="button-primary w-fit" onClick={() => saveSettings({ action: "hero", hero: settings.hero })}>Save hero</button></article><article className="surface mt-5 grid gap-4 p-5"><h2 className="font-semibold">Company process</h2><label className="field-label">Subtext<input className="field" value={settings.process.subtext} onChange={(event) => setSettings({ ...settings, process: { ...settings.process, subtext: event.target.value } })} /></label>{settings.process.steps.map((step, index) => <div className="grid gap-3 border-t border-white/10 pt-4" key={index}><label className="field-label">Step {index + 1} title<input className="field" value={step.title} onChange={(event) => { const steps = settings.process.steps.map((item) => ({ ...item })); steps[index].title = event.target.value; setSettings({ ...settings, process: { ...settings.process, steps } }); }} /></label><label className="field-label">Points (one per line)<textarea className="field min-h-24 resize-y" value={step.points.join("\n")} onChange={(event) => { const steps = settings.process.steps.map((item) => ({ ...item })); steps[index].points = event.target.value.split("\n").filter(Boolean); setSettings({ ...settings, process: { ...settings.process, steps } }); }} /></label></div>)}<button disabled={saving} className="button-primary w-fit" onClick={() => saveSettings({ action: "process", process: settings.process })}>Save process</button></article></>}</section></div>;
}
