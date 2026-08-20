import type { SafeMember } from "../lib/types";

export function IdCard({ member }: { member: SafeMember }) {
  return (
    <article className="mx-auto w-full max-w-sm overflow-hidden rounded-[26px] border border-red-300/30 bg-gradient-to-br from-[#ef1023] via-[#a6000d] to-[#400007] p-1 shadow-[0_25px_60px_rgba(0,0,0,.42)]">
      <div className="rounded-[22px] bg-[#0b0b0b] px-6 py-7 text-center">
        <div className="mx-auto mb-4 h-28 w-28 overflow-hidden rounded-full border-4 border-red-500/80 bg-black shadow-glow"><img className="h-full w-full object-cover" src={member.photoUrl} alt={member.name} /></div>
        <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-red-400">Verified employee ID</p>
        <h2 className="mt-2 text-2xl font-semibold tracking-tight">{member.name}</h2>
        <p className="mt-1 text-sm font-bold text-red-400">{member.employeeId}</p>
        <dl className="mt-6 grid gap-3 border-t border-white/10 pt-5 text-left text-sm"><div className="flex justify-between gap-4"><dt className="text-zinc-500">Location</dt><dd>{member.city}, {member.state}</dd></div><div className="flex justify-between gap-4"><dt className="text-zinc-500">Date of birth</dt><dd>{member.dateOfBirth}</dd></div><div className="flex justify-between gap-4"><dt className="text-zinc-500">Body weight</dt><dd>{member.bodyWeight}</dd></div></dl>
        {member.qrCodeUrl && <img className="mx-auto mt-6 h-28 w-28 rounded-lg bg-white p-1" src={member.qrCodeUrl} alt="Verification QR code" />}
      </div>
    </article>
  );
}
