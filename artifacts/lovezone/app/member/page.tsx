import Link from "next/link";
import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { Header } from "../../components/header";
import { IdCard } from "../../components/id-card";
import { getSession } from "../../lib/auth";
import { getApprovedAt, getExpiryDate, getMembershipStatus, membershipPlanLabel } from "../../lib/membership";
import { createMetadata } from "../../lib/seo";
import { readDatabase, withoutPassword } from "../../lib/store";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  const { settings } = await readDatabase();
  return createMetadata(settings, "member");
}

const displayDate = (value?: string) => {
  if (!value) return "—";
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? value : new Intl.DateTimeFormat("en-IN", { day: "2-digit", month: "short", year: "numeric" }).format(date);
};

const benefits = ["3–4 meetings per week", "Free cab service", "High income opportunity", "Verified premium clients"];

export default async function MemberPage() {
  const session = await getSession();
  if (session?.role !== "member") redirect("/login");
  const database = await readDatabase();
  const member = database.members.find((item) => item.id === session.memberId);
  if (!member) redirect("/login");
  const safeMember = withoutPassword(member);
  const approved = safeMember.status === "Approved" && Boolean(safeMember.employeeId);
  const membershipStatus = getMembershipStatus(safeMember);
  const statusStyle = membershipStatus === "Active" ? "bg-emerald-500/15 text-emerald-100" : membershipStatus === "Expired" || membershipStatus === "Rejected" ? "bg-red-500/15 text-red-100" : "bg-amber-400/10 text-amber-100";

  return (
    <div className="shell">
      <Header />
      <main className="container py-14 sm:py-20">
        <div className="mx-auto max-w-3xl text-center">
          <p className="eyebrow">Member dashboard</p>
          <h1 className="section-title">Hello, {safeMember.name.split(" ")[0]}</h1>
          <p className="mx-auto mt-4 max-w-2xl text-sm leading-6 text-zinc-400">{approved ? "Your profile is verified and your digital ID card is ready to use." : safeMember.status === "Rejected" ? "Your application was not approved. Please contact the support team for more information." : "Your profile is under review. Your digital employee ID will be generated after approval."}</p>
        </div>

        {approved ? (
          <div className="mx-auto mt-10 grid max-w-5xl items-start gap-7 lg:grid-cols-[minmax(0,1fr)_28rem]">
            <section className="surface order-2 p-6 sm:p-7 lg:order-1">
              <p className="eyebrow">Membership overview</p>
              <div className="mt-4 flex flex-wrap items-center justify-between gap-3"><h2 className="text-2xl font-semibold tracking-tight">My membership</h2><span className={`badge ${statusStyle}`}>✓ {membershipStatus}</span></div>
              <dl className="mt-7 grid gap-0 overflow-hidden rounded-2xl border border-white/10 bg-black/20 text-sm">
                <div className="flex flex-col gap-1 border-b border-white/10 px-4 py-4 sm:flex-row sm:items-center sm:justify-between"><dt className="text-zinc-500">Membership plan</dt><dd className="font-semibold">{membershipPlanLabel(safeMember.membershipDuration)}</dd></div>
                <div className="flex flex-col gap-1 border-b border-white/10 px-4 py-4 sm:flex-row sm:items-center sm:justify-between"><dt className="text-zinc-500">Valid from</dt><dd className="font-semibold">{displayDate(getApprovedAt(safeMember))}</dd></div>
                <div className="flex flex-col gap-1 px-4 py-4 sm:flex-row sm:items-center sm:justify-between"><dt className="text-zinc-500">Valid till</dt><dd className={`font-semibold ${membershipStatus === "Expired" ? "text-red-300" : "text-red-200"}`}>{displayDate(getExpiryDate(safeMember))}</dd></div>
              </dl>
              <p className="mt-4 text-xs leading-5 text-zinc-500">Your membership status updates automatically when its saved expiry date passes.</p>
              <Link className="button-secondary mt-6" href={`/verify/${safeMember.employeeId}`}>Open public verification page</Link>
            </section>
            <section className="order-1 lg:order-2"><p className="mb-4 text-center text-sm font-semibold text-zinc-300">My ID Card</p><IdCard member={safeMember} downloadable /></section>
          </div>
        ) : (
          <section className="surface mx-auto mt-10 max-w-xl p-6 text-center"><span className={`badge ${statusStyle}`}>{membershipStatus}</span><p className="mt-4 text-sm leading-6 text-zinc-400">Keep an eye on this page for the review outcome. Your membership dates and downloadable ID card will appear when your profile is approved.</p></section>
        )}

        <section className="mx-auto mt-14 max-w-5xl">
          <div className="text-center"><p className="eyebrow">Membership Benefits</p><h2 className="section-title">Designed around flexibility.</h2></div>
          <div className="mt-7 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">{benefits.map((benefit) => <article className="surface p-5 text-center" key={benefit}><span className="mx-auto grid h-10 w-10 place-items-center rounded-full bg-red-500/10 text-lg text-red-300">✓</span><p className="mt-4 text-sm font-semibold leading-6 text-zinc-100">{benefit}</p></article>)}</div>
        </section>
      </main>
    </div>
  );
}
