import { AuthForm } from "../../components/auth-form";
import { Header } from "../../components/header";

export default function LoginPage() { return <div className="shell"><Header /><main className="grid min-h-[calc(100vh-74px)] place-items-center bg-[radial-gradient(50%_36%_at_50%_0%,rgba(255,0,0,.16),transparent_100%)] px-5 py-12"><AuthForm mode="login" /></main></div>; }
