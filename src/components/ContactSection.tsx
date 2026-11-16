import { useState, type FormEvent } from "react";
import { CheckCircle2, LoaderCircle, Mail, MapPin, Phone, Send } from "lucide-react";
import { useLanguage } from "@/i18n/LanguageContext";
import { supabase } from "@/lib/supabase";

export default function ContactSection() {
  const { cms, lang } = useLanguage();
  const hi = lang === "hi";
  const [busy, setBusy] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    const formElement = event.currentTarget;
    const form = new FormData(formElement);
    const name = String(form.get("name") ?? "").trim();
    const email = String(form.get("email") ?? "").trim().toLowerCase();
    const message = String(form.get("message") ?? "").trim();
    if (name.length < 2 || name.length > 100 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || message.length < 10 || message.length > 3000) {
      setError(hi ? "कृपया सही नाम, ईमेल और संदेश (10–3000 अक्षर) दर्ज करें।" : "Please enter a valid name, email, and message (10–3000 characters).");
      return;
    }
    if (!supabase) { setError(hi ? "संपर्क फ़ॉर्म अभी उपलब्ध नहीं है। कृपया विद्यालय के संपर्क विवरण का उपयोग करें।" : "Contact form is temporarily unavailable. Please use the school contact details."); return; }
    setBusy(true);
    const { error: submitError } = await supabase.from("contact_messages").insert({ name, email, message });
    setBusy(false);
    if (submitError) { setError(hi ? "संदेश अभी नहीं भेजा जा सका। कृपया बाद में पुनः प्रयास करें।" : "We could not send your message right now. Please try again later."); return; }
    formElement.reset();
    setSent(true);
  }

  return (
    <section id="contact" className="section-pad bg-white">
      <div className="mx-auto grid max-w-7xl gap-10 px-5 sm:px-6 lg:grid-cols-[.8fr_1.2fr] lg:gap-16">
        <div className="flex flex-col justify-center">
          <p className="font-heading text-xs font-bold tracking-[.22em] text-gold-600 uppercase">{hi ? "संपर्क करें" : "Get in touch"}</p>
          <h2 className="mt-3 text-3xl text-royal-950 sm:text-4xl">{hi ? "विद्यालय से संपर्क करें" : "Contact the school"}</h2>
          <p className="mt-4 max-w-lg leading-7 text-slate-600">{hi ? "प्रवेश, विद्यालय की जानकारी या सामान्य पूछताछ के लिए संदेश भेजें। विद्यालय कार्यालय आपसे संपर्क करेगा।" : "For admissions, school information, or general enquiries, send us a message and the school office will follow up."}</p>
          <div className="mt-8 space-y-4 text-sm text-slate-700">
            <p className="flex items-start gap-3"><MapPin className="mt-0.5 h-5 w-5 shrink-0 text-royal-700" />{cms.settings.address}</p>
            {cms.settings.phone && <a className="flex items-center gap-3 hover:text-royal-700" href={`tel:${cms.settings.phone}`}><Phone className="h-5 w-5 text-royal-700" />{cms.settings.phone}</a>}
            {cms.settings.email && <a className="flex items-center gap-3 hover:text-royal-700" href={`mailto:${cms.settings.email}`}><Mail className="h-5 w-5 text-royal-700" />{cms.settings.email}</a>}
          </div>
        </div>
        <form onSubmit={submit} className="rounded-3xl border border-royal-100 bg-[#f7faff] p-6 shadow-[0_18px_48px_-32px_rgba(8,43,73,.4)] sm:p-8">
          <div className="grid gap-5 sm:grid-cols-2">
            <label className="font-heading text-sm font-semibold text-royal-900">{hi ? "नाम" : "Name"}
              <input name="name" required minLength={2} maxLength={100} autoComplete="name" className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 font-body font-normal outline-none focus:border-royal-500 focus:ring-4 focus:ring-royal-100" placeholder={hi ? "आपका नाम" : "Your name"} />
            </label>
            <label className="font-heading text-sm font-semibold text-royal-900">{hi ? "ईमेल" : "Email"}
              <input name="email" required type="email" maxLength={254} autoComplete="email" className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 font-body font-normal outline-none focus:border-royal-500 focus:ring-4 focus:ring-royal-100" placeholder="you@example.com" />
            </label>
          </div>
          <label className="mt-5 block font-heading text-sm font-semibold text-royal-900">{hi ? "संदेश" : "Message"}
            <textarea name="message" required minLength={10} maxLength={3000} rows={5} className="mt-2 w-full resize-y rounded-xl border border-slate-200 bg-white px-4 py-3 font-body font-normal outline-none focus:border-royal-500 focus:ring-4 focus:ring-royal-100" placeholder={hi ? "विद्यालय आपकी कैसे सहायता कर सकता है?" : "How can the school help?"} />
          </label>
          <div aria-live="polite" className="mt-4 min-h-6 text-sm">
            {error && <p role="alert" className="text-red-700">{error}</p>}
            {sent && <p className="flex items-center gap-2 text-emerald-700"><CheckCircle2 className="h-4 w-4" />{hi ? "संदेश भेज दिया गया है। संपर्क करने के लिए धन्यवाद।" : "Message sent. Thank you for contacting the school."}</p>}
          </div>
          <button type="submit" disabled={busy} className="mt-3 inline-flex items-center justify-center gap-2 rounded-xl bg-royal-800 px-5 py-3 font-heading font-semibold text-white shadow-md transition hover:-translate-y-0.5 hover:bg-royal-700 disabled:cursor-wait disabled:opacity-60">
            {busy ? <LoaderCircle className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}{busy ? (hi ? "भेज रहे हैं…" : "Sending…") : (hi ? "संदेश भेजें" : "Send message")}
          </button>
        </form>
      </div>
    </section>
  );
}
