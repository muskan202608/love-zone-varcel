import Link from "next/link";
import { redirect } from "next/navigation";
import { Header } from "../../components/header";
import { IdCard } from "../../components/id-card";
import { getSession } from "../../lib/auth";
import { readDatabase, withoutPassword } from "../../lib/store";

export const dynamic = "force-dynamic";

export default async function MemberPage() {
  const session = await getSession();
  if (session?.role !== "member") redirect("/login");
  const database = await readDatabase();
  const member = database.members.find((item) => item.id === session.memberId);
  if (!member) redirect("/login");
  const safeMember = withoutPassword(member);
  return <div className="shell"><Header /><main className="container py-16 sm:py-24"><div className="mx-auto max-w-2xl text-center"><p className="eyebrow">Membership status</p><h1 className="section-title">Hello, {safeMember.name.split(" ")[0]}</h1><p className="mt-4 text-sm leading-6 text-zinc-400">{safeMember.status === "Approved" ? "Your membership has been approved. Your verified digital employee ID is ready." : safeMember.status === "Rejected" ? "Your application was not approved. Contact the support team for additional information." : "Your profile is under review. Your digital employee ID will be generated when your application is approved."}</p></div>{safeMember.status === "Approved" && safeMember.employeeId ? <div className="mt-10"><IdCard member={safeMember} /><div className="mt-6 text-center"><Link className="button-secondary" href={`/verify/${safeMember.employeeId}`}>Open public verification page</Link></div></div> : <div className="surface mx-auto mt-10 max-w-xl p-6 text-center"><span className="badge bg-amber-400/10 text-amber-200">{safeMember.status}</span><p className="mt-4 text-sm text-zinc-400">Keep an eye on this page for the review outcome.</p></div>}</main></div>;
}
