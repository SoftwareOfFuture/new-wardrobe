"use client";

import { useState } from "react";
import { Send, Loader2, CheckCircle2 } from "lucide-react";

interface FormState {
  name: string;
  email: string;
  subject: string;
  message: string;
}

interface FieldErrors {
  name?: string[];
  email?: string[];
  subject?: string[];
  message?: string[];
}

export function ContactForm() {
  const [form, setForm] = useState<FormState>({ name: "", email: "", subject: "", message: "" });
  const [errors, setErrors] = useState<FieldErrors>({});
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
    if (errors[e.target.name as keyof FieldErrors]) {
      setErrors(prev => ({ ...prev, [e.target.name]: undefined }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setErrors({});

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (!res.ok) {
        setErrors(data.error || {});
      } else {
        setSuccess(true);
        setForm({ name: "", email: "", subject: "", message: "" });
      }
    } catch {
      setErrors({ message: ["Sunucu hatası. Lütfen tekrar deneyin."] });
    } finally {
      setSubmitting(false);
    }
  };

  if (success) {
    return (
      <div className="rounded-3xl p-10 flex flex-col items-center justify-center text-center gap-6 min-h-[400px]"
        style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(212,168,83,0.2)" }}>
        <div className="p-5 rounded-full" style={{ background: "rgba(212,168,83,0.12)" }}>
          <CheckCircle2 className="w-10 h-10" style={{ color: "#D4A853" }} />
        </div>
        <div>
          <h3 className="text-2xl font-bold mb-2">Mesajınız İletildi!</h3>
          <p className="text-muted-foreground leading-relaxed">En kısa sürede sizinle iletişime geçeceğiz.<br />Teşekkür ederiz.</p>
        </div>
        <button
          onClick={() => setSuccess(false)}
          className="px-6 py-2.5 rounded-full text-sm font-medium transition-all hover:scale-105"
          style={{ background: "rgba(212,168,83,0.1)", border: "1px solid rgba(212,168,83,0.25)", color: "#D4A853" }}>
          Yeni Mesaj
        </button>
      </div>
    );
  }

  return (
    <div className="rounded-3xl p-8 sm:p-10"
      style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)" }}>
      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-2">Mesaj Gönderin</h2>
        <p className="text-sm text-muted-foreground">Tüm alanları doldurun, size en kısa sürede dönelim.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5" noValidate>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <Field label="Ad Soyad" error={errors.name?.[0]}>
            <input name="name" value={form.name} onChange={handleChange} placeholder="Adınız Soyadınız"
              className={fieldClass(!!errors.name)} />
          </Field>
          <Field label="E-posta" error={errors.email?.[0]}>
            <input name="email" type="email" value={form.email} onChange={handleChange} placeholder="email@ornek.com"
              className={fieldClass(!!errors.email)} />
          </Field>
        </div>

        <Field label="Konu" error={errors.subject?.[0]}>
          <input name="subject" value={form.subject} onChange={handleChange} placeholder="Mesaj konusu"
            className={fieldClass(!!errors.subject)} />
        </Field>

        <Field label="Mesajınız" error={errors.message?.[0]}>
          <textarea name="message" value={form.message} onChange={handleChange} rows={5}
            placeholder="Projeniz, talebiniz veya sorunuz..."
            className={fieldClass(!!errors.message) + " resize-none"} />
        </Field>

        <button type="submit" disabled={submitting}
          className="group w-full sm:w-auto flex items-center justify-center gap-2.5 px-8 py-3.5 rounded-full font-medium text-sm transition-all duration-300 hover:scale-105 hover:glow-gold disabled:opacity-60 disabled:cursor-not-allowed"
          style={{ background: "#D4A853", color: "#09090b" }}>
          {submitting ? (
            <><Loader2 className="w-4 h-4 animate-spin" /> Gönderiliyor...</>
          ) : (
            <><Send className="w-4 h-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" /> Mesaj Gönder</>
          )}
        </button>
      </form>
    </div>
  );
}

function Field({ label, error, children }: { label: string; error?: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1.5">
      <label className="block text-sm font-medium text-foreground/80">{label}</label>
      {children}
      {error && <p className="text-xs text-red-400 mt-1">{error}</p>}
    </div>
  );
}

function fieldClass(hasError: boolean) {
  return `w-full px-4 py-3 rounded-xl text-sm text-foreground placeholder-muted-foreground/50 transition-all duration-200 focus:outline-none ${
    hasError
      ? "border-red-500/50 bg-red-500/5 focus:border-red-400"
      : "focus:border-primary/50"
  }` + " bg-white/[0.04] border border-white/10 focus:bg-white/[0.06]";
}
