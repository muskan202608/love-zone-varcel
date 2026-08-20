import Link from "next/link";

export default function NotFound() { return <main className="grid min-h-screen place-items-center bg-[#0a0a0a] px-5 text-center text-white"><div><p className="eyebrow">Not found</p><h1 className="mt-3 text-4xl font-semibold tracking-tight">Verification record unavailable</h1><Link className="button-primary mt-7" href="/">Return home</Link></div></main>; }
