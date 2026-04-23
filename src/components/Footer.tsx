import { useState, useEffect } from "react";
import { Instagram, Twitter, Facebook } from "lucide-react";
import { getContent } from "@/lib/data";

export default function Footer() {
  const [contact, setContact] = useState({ address: "", phone: "", email: "" });

  useEffect(() => {
    setContact(getContent().contact);
    const interval = setInterval(() => setContact(getContent().contact), 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <footer className="bg-navy text-white pt-12 pb-8">
      <div className="container-main">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h4 className="text-xl font-semibold mb-4">Sekolah Hierarki Tanpa Perundungan</h4>
            <p className="text-sm text-white/70 leading-relaxed">
              Bersama menciptakan lingkungan sekolah yang aman, nyaman, dan bebas dari perundungan
              untuk seluruh siswa SMAN 3 Taruna Angkasa Jawa Timur.
            </p>
            <div className="flex gap-3 mt-5">
              {[Instagram, Twitter, Facebook].map((Icon, i) => (
                <button
                  key={i}
                  className="w-9 h-9 rounded-full border border-white/20 flex items-center justify-center text-white/60 hover:text-white hover:border-white/40 transition-colors"
                >
                  <Icon className="w-4 h-4" />
                </button>
              ))}
            </div>
          </div>

          <div>
            <h5 className="text-xs font-medium uppercase tracking-wider text-white/50 mb-4">Menu</h5>
            <div className="flex flex-col gap-2.5">
              {["Beranda", "Peraturan", "Laporkan", "Akses Guru"].map((item) => (
                <span key={item} className="text-sm text-white/70 hover:text-white cursor-pointer transition-colors">
                  {item}
                </span>
              ))}
            </div>
          </div>

          <div>
            <h5 className="text-xs font-medium uppercase tracking-wider text-white/50 mb-4">Kontak</h5>
            <div className="flex flex-col gap-2.5 text-sm text-white/70">
              <p>{contact.address || "SMAN 3 Taruna Angkasa Jawa Timur"}</p>
              <p>{contact.phone || "—"}</p>
              <p>{contact.email || "—"}</p>
            </div>
          </div>
        </div>

        <div className="border-t border-white/15 mt-8 pt-6 text-center">
          <p className="text-xs text-white/40">
            &copy; 2025 Sekolah Hierarki Tanpa Perundungan. SMAN 3 Taruna Angkasa Jawa Timur.
          </p>
        </div>
      </div>
    </footer>
  );
}
