import Link from "next/link";
import { notFound } from "next/navigation";
import { Header } from "../../../components/header";
import { readDatabase, withoutPassword } from "../../../lib/store";

export const dynamic = "force-dynamic";

export default async function VerifyPage({ params }: { params: Promise<{ employeeId: string }> }) {
  const { employeeId } = await params;
  const database = await readDatabase();
  const member = database.members.find((item) => item.employeeId === employeeId.toUpperCase());
  if (!member) notFound();
  const profile = withoutPassword(member);
  const verified = profile.status === "Approved";
  return <div className="shell"><Header /><main className="container grid min-h-[calc(100vh-74px)] place-items-center py-14"><article className="surface w-full max-w-md overflow-hidden text-center"><div className="bg-[radial-gradient(circle_at_50%_0,rgba(255,0,0,.2),transparent_70%)] px-6 pb-7 pt-9"><p className="eyebrow">Employee verification</p><div className="mx-auto mt-6 h-28 w-28 overflow-hidden rounded-full border-4 border-red-500/70 bg-black"><img className="h-full w-full object-cover" src={profile.photoUrl} alt={profile.name} /></div><h1 className="mt-4 text-2xl font-semibold tracking-tight">{profile.name}</h1><p className="mt-1 text-sm font-bold text-red-400">{profile.employeeId}</p></div><div className="grid gap-4 border-t border-white/10 px-7 py-7 text-left text-sm"><div className="flex justify-between gap-4"><span className="text-zinc-500">City</span><span>{profile.city}</span></div><div className="flex justify-between gap-4"><span className="text-zinc-500">State</span><span>{profile.state}</span></div><div className="flex justify-between gap-4"><span className="text-zinc-500">Status</span><span className={`badge ${verified ? "bg-emerald-500/15 text-emerald-200" : "bg-red-500/15 text-red-200"}`}>{verified ? "Verified" : "Not Approved"}</span></div></div></article><Link className="mt-7 text-sm font-semibold text-zinc-400 hover:text-white" href="/">Back to homepage</Link></main></div>;
}
