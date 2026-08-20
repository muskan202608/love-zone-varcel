export function WhatsAppButton({ number }: { number?: string }) {
  const destination = (number || "").replace(/\D/g, "");
  if (!destination) return null;
  const message = encodeURIComponent("Hi, I am interested in joining PlayboyZone");
  return <a className="fixed bottom-5 right-5 z-20 rounded-full border border-emerald-300/30 bg-emerald-600 px-4 py-3 text-sm font-bold text-white shadow-lg transition hover:-translate-y-0.5 hover:bg-emerald-500" href={`https://wa.me/91${destination}?text=${message}`} target="_blank" rel="noreferrer">WhatsApp</a>;
}
