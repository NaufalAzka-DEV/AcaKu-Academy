import { MessageCircle } from "lucide-react";

export function WhatsAppButton() {
  const phone = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "6282225304516";
  const message =
    process.env.NEXT_PUBLIC_WHATSAPP_MESSAGE ||
    "Halo Acaku Academy, saya ingin konsultasi layanan akademik.";
  const url = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;

  return (
    <a
      href={url}
      target="_blank"
      rel="noreferrer"
      className="fixed bottom-5 right-5 z-50 inline-flex min-h-12 items-center gap-2 rounded-full bg-[#25D366] px-5 py-3 text-sm font-black text-ink shadow-soft transition hover:translate-y-[-1px]"
      aria-label="Contact Acaku Academy on WhatsApp"
      title="WhatsApp"
    >
      <MessageCircle size={19} aria-hidden="true" />
      <span className="hidden sm:inline">WhatsApp</span>
    </a>
  );
}
