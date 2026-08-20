import Link from "next/link";
import { Header } from "../components/header";
import { WhatsAppButton } from "../components/whatsapp-button";
import { readDatabase } from "../lib/store";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const { settings } = await readDatabase();
  const { hero, process, contacts, certificates } = settings;
  return (
    <div className="shell">
      <Header />
      <main>
        <section className="relative isolate overflow-hidden border-b border-white/[0.08] bg-[radial-gradient(52%_44%_at_50%_0%,rgba(255,0,0,.2),transparent_100%),#0a0a0a] px-5 py-24 text-center sm:py-32">
          <div className="absolute inset-x-[12%] bottom-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />
          <div className="relative mx-auto max-w-4xl">
            <p className="eyebrow">{hero.subtitle}</p>
            <h1 className="mt-5 grid gap-2 text-4xl font-semibold uppercase leading-[1.05] tracking-[-0.05em] sm:text-6xl"><span>{hero.lines[0]}</span><span className="text-zinc-300">{hero.lines[1]}</span><span className="text-[#ff0000]">{hero.lines[2]}</span></h1>
            <p className="mx-auto mt-7 max-w-xl text-sm leading-7 text-zinc-400 sm:text-[15px]">{hero.description}</p>
            <Link className="button-primary mt-8 px-7" href="/signup">JOIN NOW</Link>
          </div>
        </section>

        <section className="container py-20 sm:py-28">
          <div className="mx-auto max-w-2xl text-center"><p className="eyebrow">Speak to our team</p><h2 className="section-title">Direct contact, real support.</h2></div>
          <div className="mt-10 grid gap-4 sm:grid-cols-2">{contacts.map((contact) => <article key={contact.id} className="surface p-5"><div className="flex items-start justify-between gap-4"><div><p className="font-semibold">{contact.name}</p><p className="mt-1 text-sm text-zinc-500">{contact.phone}</p></div><div className="h-10 w-10 rounded-full bg-red-500/10 text-center leading-10 text-red-400">{contact.name[0]}</div></div><div className="mt-5 grid grid-cols-2 gap-2"><a className="button-secondary !min-h-10 !rounded-lg !px-3 !py-2 text-xs" href={`tel:${contact.phone}`}>Call</a><a className="button-secondary !min-h-10 !rounded-lg !border-emerald-300/20 !bg-emerald-500/10 !px-3 !py-2 text-xs !text-emerald-200" href={`https://wa.me/91${contact.whatsapp.replace(/\D/g, "")}?text=${encodeURIComponent("Hi, I am interested in joining PlayboyZone")}`} target="_blank" rel="noreferrer">WhatsApp</a></div></article>)}</div>
        </section>

        <section className="border-y border-white/[0.08] bg-white/[0.015]"><div className="container py-20 sm:py-28"><div className="mx-auto max-w-2xl text-center"><p className="eyebrow">{process.subtext}</p><h2 className="section-title">How Our Company Works</h2></div><div className="mt-10 grid gap-4 md:grid-cols-2 xl:grid-cols-5">{process.steps.map((step, index) => <article className="surface p-5" key={`${step.title}-${index}`}><div className="flex items-center justify-between"><span className="text-sm font-bold text-red-400">0{index + 1}</span><span className="grid h-9 w-9 place-items-center rounded-xl border border-red-500/30 bg-red-500/10 text-red-400">✓</span></div><h3 className="mt-6 font-semibold">{step.title}</h3><ul className="mt-4 grid gap-2 text-xs leading-5 text-zinc-400">{step.points.map((point) => <li className="flex gap-2" key={point}><span className="text-red-500">•</span>{point}</li>)}</ul></article>)}</div></div></section>

        <section className="container py-20 sm:py-28"><div className="mx-auto max-w-2xl text-center"><p className="eyebrow">Trust & compliance</p><h2 className="section-title">Our Certifications</h2></div><div className="mt-10 grid gap-5">{[{ label: "GST Certificate", src: certificates.gst }, { label: "Police Verification Certificate", src: certificates.police }].map((certificate) => <article className="surface overflow-hidden" key={certificate.label}><div className="flex min-h-72 items-center justify-center bg-black p-3 sm:min-h-[520px] sm:p-6">{certificate.src ? <img className="h-full max-h-[620px] w-full object-contain" src={certificate.src} alt={certificate.label} /> : <p className="text-sm text-zinc-600">{certificate.label} will be uploaded soon.</p>}</div><h3 className="border-t border-white/10 bg-white/[0.025] px-5 py-4 text-sm font-semibold">{certificate.label}</h3></article>)}</div></section>
      </main>
      <WhatsAppButton number={contacts[0]?.whatsapp} />
    </div>
  );
}
