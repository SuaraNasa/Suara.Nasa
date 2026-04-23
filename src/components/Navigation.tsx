import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Shield, Menu, X } from "lucide-react";

export default function Navigation() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const isHome = location.pathname === "/";

  const scrollTo = (id: string) => {
    if (!isHome) {
      navigate("/");
      setTimeout(() => {
        const el = document.getElementById(id);
        if (el) el.scrollIntoView({ behavior: "smooth" });
      }, 100);
      return;
    }
    const el = document.getElementById(id);
    if (el) {
      const offset = 80;
      const top = el.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: "smooth" });
    }
    setMobileOpen(false);
  };

  const navLinks = [
    { label: "Beranda", action: () => scrollTo("beranda") },
    { label: "Peraturan", action: () => scrollTo("peraturan") },
    { label: "Laporkan", action: () => scrollTo("laporkan") },
    { label: "Akses Guru", action: () => { navigate("/guru"); setMobileOpen(false); } },
    { label: "Dev", action: () => { navigate("/dev"); setMobileOpen(false); } },
  ];

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 h-[72px] bg-white/95 backdrop-blur-xl shadow-nav z-[100]">
        <div className="container-main h-full flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Shield className="w-6 h-6 text-navy" />
            <span className="text-sm font-bold text-navy tracking-wider uppercase hidden sm:block">
              Sekolah Hierarki Tanpa Perundungan
            </span>
            <span className="text-sm font-bold text-navy tracking-wider uppercase sm:hidden">
              SHTP
            </span>
          </div>

          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <button
                key={link.label}
                onClick={link.action}
                className="relative text-[15px] font-medium text-charcoal hover:text-coral transition-colors duration-200 group"
              >
                {link.label}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-coral transition-all duration-200 group-hover:w-full" />
              </button>
            ))}
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => scrollTo("laporkan")}
              className="hidden sm:block btn-primary text-sm py-2.5 px-5"
            >
              Laporkan Sekarang
            </button>
            <button
              className="md:hidden text-navy"
              onClick={() => setMobileOpen(true)}
            >
              <Menu className="w-6 h-6" />
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div className="fixed inset-0 z-[200] md:hidden">
          <div
            className="absolute inset-0 bg-navy/98"
            onClick={() => setMobileOpen(false)}
          />
          <div className="absolute top-0 right-0 w-full max-w-sm h-full bg-navy p-8 flex flex-col">
            <button
              className="self-end text-white mb-12"
              onClick={() => setMobileOpen(false)}
            >
              <X className="w-7 h-7" />
            </button>
            <div className="flex flex-col gap-6">
              {navLinks.map((link) => (
                <button
                  key={link.label}
                  onClick={link.action}
                  className="text-left text-2xl font-semibold text-white/80 hover:text-white transition-colors"
                >
                  {link.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
