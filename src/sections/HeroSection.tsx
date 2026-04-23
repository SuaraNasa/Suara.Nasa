import { useEffect, useRef } from "react";

export default function HeroSection() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const items = el.querySelectorAll("[data-hero-animate]");
    items.forEach((item) => {
      const htmlItem = item as HTMLElement;
      htmlItem.style.opacity = "0";
      htmlItem.style.transform = "translateY(20px)";
    });
    const timer = setTimeout(() => {
      items.forEach((item, i) => {
        const htmlItem = item as HTMLElement;
        htmlItem.style.transition = `opacity 0.7s ease-out ${0.2 + i * 0.2}s, transform 0.7s ease-out ${0.2 + i * 0.2}s`;
        htmlItem.style.opacity = "1";
        htmlItem.style.transform = "translateY(0)";
      });
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      const offset = 80;
      const top = el.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: "smooth" });
    }
  };

  return (
    <section
      id="beranda"
      ref={sectionRef}
      className="relative min-h-[85vh] bg-cream flex items-center overflow-hidden"
    >
      {/* Decorative shapes */}
      <div className="absolute top-10 right-10 w-[400px] h-[400px] rounded-full bg-gradient-radial from-sky/30 to-transparent animate-float opacity-60 hidden lg:block" />
      <div className="absolute top-1/3 right-1/4 w-[300px] h-[200px] rounded-full bg-gradient-radial from-sage/25 to-transparent animate-float-delayed opacity-60 hidden lg:block" />
      <div className="absolute bottom-20 right-20 w-[250px] h-[250px] rounded-full bg-gradient-radial from-soft-lavender/20 to-transparent animate-float-delayed-2 opacity-60 hidden lg:block" />

      <div className="container-main relative z-10 py-24 pt-32">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <h1
              data-hero-animate
              className="font-playfair text-4xl md:text-5xl font-bold text-navy leading-tight"
            >
              Sekolah Hierarki Tanpa Perundungan
            </h1>
            <p
              data-hero-animate
              className="mt-4 text-charcoal/70 text-base md:text-lg max-w-[520px] leading-relaxed"
            >
              Bersama Menciptakan Lingkungan Belajar yang Aman, Nyaman, dan Penuh Rasa Saling
              Menghormati
            </p>
            <div data-hero-animate className="flex flex-wrap gap-3 mt-8">
              <button onClick={() => scrollTo("peraturan")} className="btn-secondary text-sm">
                Pelajari Peraturan
              </button>
              <button onClick={() => scrollTo("laporkan")} className="btn-primary text-sm">
                Laporkan Kasus
              </button>
            </div>

            <div data-hero-animate className="flex flex-wrap gap-6 md:gap-0 mt-12">
              {[
                { num: "1.000+", label: "Siswa Terlindungi" },
                { num: "24/7", label: "Layanan Laporan" },
                { num: "100%", label: "Anonim & Aman" },
              ].map((stat, i) => (
                <div
                  key={stat.label}
                  className={`flex flex-col ${i < 2 ? "md:pr-8 md:mr-8 md:border-r md:border-light-gray" : ""}`}
                >
                  <span className="font-playfair text-4xl md:text-5xl font-bold text-coral">
                    {stat.num}
                  </span>
                  <span className="text-sm text-gray mt-1">{stat.label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Right decorative area */}
          <div className="hidden lg:flex items-center justify-center">
            <div className="relative">
              <div className="w-80 h-80 rounded-full bg-gradient-to-br from-sky/20 via-sage/15 to-soft-lavender/10 flex items-center justify-center">
                <div className="w-56 h-56 rounded-full bg-gradient-to-br from-sage/20 via-sky/15 to-peach/10 flex items-center justify-center">
                  <div className="w-32 h-32 rounded-full bg-gradient-to-br from-coral/10 via-sky/10 to-sage/10" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
