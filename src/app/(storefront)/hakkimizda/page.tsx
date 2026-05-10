import type { Metadata } from "next";
import { getSettings } from "@/lib/settings";
import { ScrollReveal } from "@/components/storefront/ScrollReveal";
import { CheckCircle2, Factory, Wrench, Users, Award, Building2, ArrowRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSettings();
  return { title: settings["pagetitle.about"] || "Hakkımızda" };
}

const FACILITY_IMGS = [
  "https://res.cloudinary.com/djghexldz/image/upload/v1778090667/new-wardrobe/portfolio/page49_img1_zevzoq.jpg",
  "https://res.cloudinary.com/djghexldz/image/upload/v1778090668/new-wardrobe/portfolio/page49_img2_qa4gx4.jpg",
  "https://res.cloudinary.com/djghexldz/image/upload/v1778090669/new-wardrobe/portfolio/page49_img3_qvnd9s.jpg",
  "https://res.cloudinary.com/djghexldz/image/upload/v1778090670/new-wardrobe/portfolio/page50_img1_ws0uph.jpg",
  "https://res.cloudinary.com/djghexldz/image/upload/v1778090671/new-wardrobe/portfolio/page50_img2_mltsjr.jpg",
  "https://res.cloudinary.com/djghexldz/image/upload/v1778090673/new-wardrobe/portfolio/page51_img1_a7b3xq.jpg",
];

const INTRO_IMGS = [
  "https://res.cloudinary.com/djghexldz/image/upload/v1778090571/new-wardrobe/portfolio/page03_img1_a4e0st.jpg",
  "https://res.cloudinary.com/djghexldz/image/upload/v1778090572/new-wardrobe/portfolio/page03_img2_fvcq0p.jpg",
  "https://res.cloudinary.com/djghexldz/image/upload/v1778090573/new-wardrobe/portfolio/page03_img3_z1saze.jpg",
  "https://res.cloudinary.com/djghexldz/image/upload/v1778090574/new-wardrobe/portfolio/page04_img1_pebexq.jpg",
];

const services = [
  { title: "Ölçülendirme ve Yerinde Keşif", desc: "Projenize özel yerinde ölçüm ve detaylı analiz." },
  { title: "Proje ve Tasarım Geliştirme", desc: "3D tasarım ve tüm proje geliştirme süreçleri." },
  { title: "Üretim", desc: "CNC destekli modern üretim tesisimizde kaliteli imalat." },
  { title: "Boyama ve Yüzey Uygulamaları", desc: "Bünyemizdeki boyahanede tüm yüzey işlemleri." },
  { title: "Montaj ve Kurulum", desc: "Deneyimli ekibimizle yerinde profesyonel montaj." },
  { title: "Garanti ve Teknik Destek", desc: "Satış sonrası tam garanti ve teknik destek hizmeti." },
];

const infrastructure = [
  { icon: Factory, title: "Modern Üretim Tesisi",
    desc: "CNC Freze, CNC Delik, Panel Kesim, Press, Kalibre, Bantlama, Kaplama ve daha fazlası — tüm aşamalar tek çatı altında." },
  { icon: Wrench, title: "Boyahane",
    desc: "Kendi bünyemizdeki boyahanemizle tüm boya ve yüzey işlemlerini iç kontrolle gerçekleştiriyoruz." },
  { icon: Building2, title: "Demir Hane",
    desc: "Demir, pirinç ve alüminyum mobilya tamamlayıcı parçalarını kendi atölyemizde üretiyoruz." },
];

const hrBenefits = [
  "Lojman İmkânı: Uzaktan gelen çalışanlarımız için firmamıza ait lojmanımız bulunmaktadır.",
  "3 Öğün Yemek: Lojmanda kalan tüm çalışanlarımıza günlük 3 öğün yemek hizmeti sağlıyoruz.",
  "İş Güvenliği ve Konfor: Tüm çalışma ortamlarımızda iş güvenliği ve konfor önceliğimizdir.",
  "Personel Servisleri: Hem lojmanda kalan hem de şehir içinden gelen çalışanlarımız için servis hizmetimiz mevcuttur.",
];

export default async function AboutPage() {
  const settings = await getSettings();

  const badge       = settings["about.badge"]       || "Mobilya Tutkusuyla Tasarlıyoruz";
  const title       = settings["about.title"]       || "Şirketimiz Hakkında";
  const description = settings["about.description"] || "";
  const mission     = settings["about.mission"]     || "";

  return (
    <div className="min-h-screen pt-28 sm:pt-32 pb-16 sm:pb-24 px-4 sm:px-6 relative overflow-hidden">
      {/* Ambient light */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 right-0 w-[700px] h-[600px] opacity-25"
          style={{ background: "radial-gradient(ellipse, rgba(212,168,83,0.07) 0%, transparent 65%)", transform: "translate(20%, -20%)" }} />
        <div className="absolute bottom-1/3 left-0 w-[500px] h-[400px] opacity-15"
          style={{ background: "radial-gradient(ellipse, rgba(212,168,83,0.06) 0%, transparent 70%)", transform: "translateX(-30%)" }} />
      </div>

      <div className="max-w-6xl mx-auto relative space-y-14 sm:space-y-20 lg:space-y-28">

        {/* Hero */}
        <ScrollReveal className="text-center">
          <div className="badge-gold mb-7">{badge}</div>
          <h1 className="text-4xl sm:text-5xl lg:text-7xl font-bold tracking-tight mb-7">
            {title.split(" ").slice(0, 1).map((w, i) => (
              <span key={i} className="text-gradient-gold">{w} </span>
            ))}
            <span className="text-foreground">{title.split(" ").slice(1).join(" ")}</span>
          </h1>
          {description && (
            <p className="text-lg text-muted-foreground leading-relaxed max-w-3xl mx-auto">
              {description}
            </p>
          )}
        </ScrollReveal>

        {/* Intro image gallery — asymmetric masonry */}
        <ScrollReveal>
          <div className="grid grid-cols-2 sm:grid-cols-3 grid-rows-2 gap-2 sm:gap-3 h-[280px] sm:h-[420px] lg:h-[500px]">
            <div className="col-span-1 sm:col-span-2 row-span-2 relative rounded-2xl overflow-hidden group">
              <Image src={INTRO_IMGS[0]} alt="Urban Mobilya" fill
                className="object-cover transition-transform duration-700 group-hover:scale-[1.03]"
                sizes="(max-width: 768px) 66vw, 40vw" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
            </div>
            {INTRO_IMGS.slice(1).map((url, i) => (
              <div key={i} className="relative rounded-2xl overflow-hidden group">
                <Image src={url} alt={`Referans ${i + 2}`} fill
                  className="object-cover transition-transform duration-700 group-hover:scale-[1.05]"
                  sizes="(max-width: 768px) 33vw, 20vw" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
              </div>
            ))}
          </div>
        </ScrollReveal>

        {/* Stats row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { value: "5.000+", label: "Mutlu Müşteri",        sub: "Türkiye geneli" },
            { value: "150+",   label: "Tamamlanan Proje",     sub: "Yurt içi & dışı" },
            { value: "12+",    label: "Yıllık Deneyim",       sub: "Sektörde güven" },
            { value: "98%",    label: "Müşteri Memnuniyeti",  sub: "Puanı" },
          ].map((stat, i) => (
            <ScrollReveal key={i} delay={i * 0.08}>
              <div className="relative rounded-2xl p-6 text-center group overflow-hidden shimmer transition-all duration-300 hover:glow-gold-subtle hover:-translate-y-1"
                style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(212,168,83,0.15)" }}>
                <p className="text-3xl sm:text-4xl font-bold text-gradient-gold">{stat.value}</p>
                <p className="mt-1.5 text-sm font-medium">{stat.label}</p>
                <p className="text-xs text-muted-foreground mt-0.5">{stat.sub}</p>
                <div className="absolute bottom-0 left-0 right-0 h-0.5 scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-center"
                  style={{ background: "linear-gradient(90deg, transparent, rgba(212,168,83,0.5), transparent)" }} />
              </div>
            </ScrollReveal>
          ))}
        </div>

        {/* Mission */}
        <ScrollReveal>
          <div className="relative rounded-3xl p-8 sm:p-12 overflow-hidden"
            style={{ background: "rgba(212,168,83,0.04)", border: "1px solid rgba(212,168,83,0.15)" }}>
            <div className="absolute top-0 right-0 w-96 h-96 pointer-events-none"
              style={{ background: "radial-gradient(circle at top right, rgba(212,168,83,0.08) 0%, transparent 60%)" }} />
            <div className="relative">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2.5 rounded-xl" style={{ background: "rgba(212,168,83,0.12)" }}>
                  <Award className="w-5 h-5" style={{ color: "#D4A853" }} />
                </div>
                <h2 className="text-2xl font-bold">Misyonumuz</h2>
              </div>
              <p className="text-muted-foreground leading-relaxed text-base max-w-3xl">
                {mission || "Kaliteli üretim, zamanında teslimat ve müşteri memnuniyetini ilke edindik. Antalya merkezli üretim tesisimizde, son teknolojiyle donatılmış ekipmanlarımız ve deneyimli kadromuzla sektöre yenilikçi çözümler sunuyoruz."}
              </p>
            </div>
          </div>
        </ScrollReveal>

        {/* Services */}
        <div>
          <ScrollReveal className="text-center mb-10 sm:mb-14">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight">
              <span className="text-gradient-gold">Hizmetlerimiz</span>
            </h2>
            <p className="mt-4 text-muted-foreground">Müşterilerimize en iyisini sunmak için titizlikle çalışıyoruz.</p>
          </ScrollReveal>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {services.map((s, i) => (
              <ScrollReveal key={i} delay={i * 0.07}>
                <div className="group flex gap-4 p-6 rounded-2xl h-full transition-all duration-300 hover:glow-gold-subtle hover:-translate-y-0.5 shimmer"
                  style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(212,168,83,0.12)" }}>
                  <div className="shrink-0 mt-0.5">
                    <div className="w-7 h-7 rounded-full flex items-center justify-center"
                      style={{ background: "rgba(212,168,83,0.12)" }}>
                      <CheckCircle2 className="w-4 h-4" style={{ color: "#D4A853" }} />
                    </div>
                  </div>
                  <div>
                    <h3 className="font-semibold text-sm mb-1.5 group-hover:text-primary transition-colors">{s.title}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">{s.desc}</p>
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>

        {/* Facility photo grid */}
        <ScrollReveal>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 sm:gap-3">
            {FACILITY_IMGS.map((url, i) => (
              <div key={i} className={`relative rounded-xl overflow-hidden group ${i === 0 ? "col-span-2 aspect-[16/9]" : "aspect-square"}`}>
                <Image src={url} alt={`Üretim tesisi ${i + 1}`} fill
                  className="object-cover transition-transform duration-600 group-hover:scale-[1.04]"
                  sizes="(max-width: 768px) 33vw, 25vw" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </div>
            ))}
          </div>
        </ScrollReveal>

        {/* Infrastructure */}
        <div>
          <ScrollReveal className="text-center mb-10 sm:mb-14">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight">
              Teknik <span className="text-gradient-gold">Altyapımız</span>
            </h2>
            <p className="mt-4 text-muted-foreground">Üretim gücümüzü destekleyen entegre altyapı.</p>
          </ScrollReveal>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {infrastructure.map((item, i) => (
              <ScrollReveal key={i} delay={i * 0.1}>
                <div className="group p-8 rounded-2xl h-full transition-all duration-300 hover:glow-gold-subtle hover:-translate-y-1 shimmer"
                  style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(212,168,83,0.15)" }}>
                  <div className="w-12 h-12 rounded-2xl flex items-center justify-center mb-6"
                    style={{ background: "rgba(212,168,83,0.1)", border: "1px solid rgba(212,168,83,0.2)" }}>
                    <item.icon className="w-6 h-6" style={{ color: "#D4A853" }} />
                  </div>
                  <h3 className="font-bold text-lg mb-3 group-hover:text-primary transition-colors">{item.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{item.desc}</p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>

        {/* HR section */}
        <ScrollReveal>
          <div className="relative rounded-3xl p-8 sm:p-12 overflow-hidden"
            style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(212,168,83,0.15)" }}>
            <div className="absolute bottom-0 right-0 w-72 h-72 pointer-events-none opacity-40"
              style={{ background: "radial-gradient(circle at bottom right, rgba(212,168,83,0.07) 0%, transparent 65%)" }} />
            <div className="flex items-center gap-3 mb-8">
              <div className="p-2.5 rounded-xl" style={{ background: "rgba(212,168,83,0.12)" }}>
                <Users className="w-5 h-5" style={{ color: "#D4A853" }} />
              </div>
              <h2 className="text-2xl font-bold">İnsan Kaynakları</h2>
            </div>
            <p className="text-muted-foreground mb-8 leading-relaxed max-w-2xl">
              Urban Mobilya olarak sadece kaliteli ürünler üretmekle kalmıyor, aynı zamanda güçlü bir ekip ruhu inşa ediyoruz.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {hrBenefits.map((b, i) => (
                <div key={i} className="flex items-start gap-3 p-4 rounded-xl"
                  style={{ background: "rgba(212,168,83,0.05)", border: "1px solid rgba(212,168,83,0.1)" }}>
                  <CheckCircle2 className="w-4 h-4 mt-0.5 shrink-0" style={{ color: "#D4A853" }} />
                  <p className="text-sm text-muted-foreground leading-relaxed">{b}</p>
                </div>
              ))}
            </div>
          </div>
        </ScrollReveal>

        {/* CTA */}
        <ScrollReveal className="text-center">
          <div className="divider-gold mb-16" />
          <h2 className="text-3xl font-bold mb-4">Projenizi Hayata Geçirelim</h2>
          <p className="text-muted-foreground mb-8">Ücretsiz keşif ve proje danışmanlığı için bizimle iletişime geçin.</p>
          <Link href="/iletisim"
            className="group inline-flex items-center gap-2 px-8 py-4 rounded-full font-medium text-sm transition-all duration-300 hover:scale-105 hover:glow-gold"
            style={{ background: "#D4A853", color: "#09090b" }}>
            İletişime Geç
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </ScrollReveal>

      </div>
    </div>
  );
}
