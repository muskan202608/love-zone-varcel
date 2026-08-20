import { redirect } from "next/navigation";
import { AdminDashboard } from "../../components/admin-dashboard";
import { Header } from "../../components/header";
import { getSession } from "../../lib/auth";
import { readDatabase, withoutPassword } from "../../lib/store";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const session = await getSession();
  if (session?.role !== "admin") redirect("/login");
  const database = await readDatabase();
  return <div className="shell"><Header /><main className="container py-10 sm:py-14"><AdminDashboard initialMembers={database.members.map(withoutPassword)} initialSettings={database.settings} /></main></div>;
}
