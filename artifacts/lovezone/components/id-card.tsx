"use client";

import Image from "next/image";
import { useRef, useState } from "react";
import { getExpiryDate, getMembershipStatus, membershipPlanLabel } from "../lib/membership";
import type { SafeMember } from "../lib/types";

const displayDate = (value?: string) => {
  if (!value) return "—";
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? value : new Intl.DateTimeFormat("en-IN", { day: "2-digit", month: "short", year: "numeric" }).format(date);
};

export function IdCard({ member, downloadable = false }: { member: SafeMember; downloadable?: boolean }) {
  const cardRef = useRef<HTMLElement>(null);
  const [downloading, setDownloading] = useState(false);
  const membershipStatus = getMembershipStatus(member);
  const expired = membershipStatus === "Expired";

  const downloadCard = async () => {
    if (!cardRef.current) return;
    setDownloading(true);
    try {
      const [{ default: html2canvas }, { jsPDF }] = await Promise.all([import("html2canvas"), import("jspdf")]);
      const canvas = await html2canvas(cardRef.current, { backgroundColor: "#0a0a0a", scale: 2, useCORS: true });
      const pdf = new jsPDF({ orientation: "portrait", unit: "px", format: [canvas.width, canvas.height], hotfixes: ["px_scaling"] });
      pdf.addImage(canvas.toDataURL("image/png"), "PNG", 0, 0, canvas.width, canvas.height);
      pdf.save(`${member.employeeId || "playboyzone-member"}-id-card.pdf`);
    } finally {
      setDownloading(false);
    }
  };

  return (
    <div className="mx-auto w-full max-w-[29rem]">
      <article ref={cardRef} className="overflow-hidden rounded-[30px] border border-red-400/35 bg-gradient-to-br from-[#ff2636] via-[#a90011] to-[#3b0006] p-px shadow-[0_30px_80px_rgba(0,0,0,.62),0_0_46px_rgba(255,0,0,.13)]">
        <div className="relative overflow-hidden rounded-[29px] bg-[#0a0a0a] px-6 py-7 text-center sm:px-8 sm:py-8">
          <div className="pointer-events-none absolute inset-x-0 top-0 h-44 bg-[radial-gradient(circle_at_50%_-15%,rgba(255,40,55,.46),transparent_70%)]" />
          <div className="relative">
            <div className="mx-auto mb-5 grid h-36 w-36 place-items-center overflow-hidden rounded-full border-4 border-red-400 bg-black p-1 shadow-[0_0_28px_rgba(255,0,0,.34)]">
              <Image className="h-full w-full rounded-full object-cover" src={member.photoUrl} alt={member.name} width={136} height={136} sizes="136px" />
            </div>
            <span className={`badge border ${expired ? "border-red-300/25 bg-red-500/15 text-red-100" : "border-emerald-300/25 bg-emerald-500/15 text-emerald-100"}`}>{expired ? "✕ Membership Expired" : "✓ Verified Member"}</span>
            <p className="mt-4 text-[10px] font-bold uppercase tracking-[0.22em] text-red-300">PlayboyZone employee ID</p>
            <h2 className="mt-2 text-3xl font-bold tracking-[-0.045em] text-white">{member.name}</h2>
            <p className="mt-1 text-base font-bold tracking-[0.08em] text-red-300">{member.employeeId}</p>

            <dl className="mt-7 grid gap-0 overflow-hidden rounded-2xl border border-white/10 bg-white/[0.035] text-left text-sm">
              <div className="flex justify-between gap-4 border-b border-white/10 px-4 py-3.5"><dt className="text-zinc-500">Location</dt><dd className="font-medium text-right">{member.city}, {member.state}</dd></div>
              <div className="flex justify-between gap-4 border-b border-white/10 px-4 py-3.5"><dt className="text-zinc-500">Date of birth</dt><dd className="font-medium text-right">{displayDate(member.dateOfBirth)}</dd></div>
              <div className="flex justify-between gap-4 border-b border-white/10 px-4 py-3.5"><dt className="text-zinc-500">Body weight</dt><dd className="font-medium text-right">{member.bodyWeight}</dd></div>
              <div className="flex justify-between gap-4 border-b border-white/10 px-4 py-3.5"><dt className="text-zinc-500">Membership plan</dt><dd className="font-medium text-right">{membershipPlanLabel(member.membershipDuration)}</dd></div>
              <div className="flex justify-between gap-4 border-b border-white/10 px-4 py-3.5"><dt className="text-zinc-500">Valid till</dt><dd className="font-medium text-right text-red-200">{displayDate(getExpiryDate(member))}</dd></div>
              <div className="flex justify-between gap-4 px-4 py-3.5"><dt className="text-zinc-500">Status</dt><dd className={`font-semibold text-right ${expired ? "text-red-300" : "text-emerald-200"}`}>{membershipStatus}</dd></div>
            </dl>

            {member.qrCodeUrl && <div className="mt-6 inline-flex flex-col items-center rounded-2xl border border-white/10 bg-white p-2 shadow-lg"><Image className="h-28 w-28" src={member.qrCodeUrl} alt="Scan to verify this member" width={112} height={112} sizes="112px" /><span className="mt-1 text-[9px] font-bold uppercase tracking-[0.14em] text-black">Scan to verify</span></div>}
          </div>
        </div>
      </article>
      {downloadable && <div className="mt-5 text-center"><button type="button" className="button-primary w-full sm:w-auto" disabled={downloading} onClick={downloadCard}>{downloading ? "Preparing PDF…" : "Download ID Card"}</button></div>}
    </div>
  );
}
