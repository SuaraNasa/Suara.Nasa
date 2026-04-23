import { useNavigate } from "react-router-dom";
import { Shield } from "lucide-react";
import { useScrollReveal } from "@/hooks/useScrollReveal";

export default function GuruCTASection() {
  const navigate = useNavigate();
  const ref = useScrollReveal();

  return (
    <section
      className="bg-gradient-to-br from-coral to-[#ff8a65] section-padding"
      ref={ref}
    >
      <div className="container-main text-center">
        <div data-reveal className="flex flex-col items-center">
          <Shield className="w-16 h-16 text-white" />
          <h2 className="font-playfair text-3xl md:text-4xl font-bold text-white mt-5">
            Akses Dashboard Guru
          </h2>
          <p className="text-white/90 mt-3 max-w-[560px] leading-relaxed">
            Guru dan staf sekolah dapat mengakses dashboard untuk melihat dan mengelola
            laporan perundungan dari siswa.
          </p>

          <div className="mt-8 bg-white/15 backdrop-blur-lg rounded-2xl px-8 py-6 max-w-[400px] w-full">
            <p className="text-xs text-white/70 uppercase tracking-wider font-medium">
              Kredensial Demo:
            </p>
            <p className="text-sm text-white mt-2">
              <span className="font-semibold">Nama:</span> rifqi adliansyah
            </p>
            <p className="text-sm text-white">
              <span className="font-semibold">Password:</span> rifqi adliansyah
            </p>
          </div>

          <button
            onClick={() => navigate("/guru")}
            className="mt-6 bg-white text-coral font-semibold rounded-full px-9 py-3.5 transition-all duration-300 hover:bg-white/90 hover:shadow-[0_4px_20px_rgba(0,0,0,0.15)] hover:-translate-y-0.5"
          >
            Masuk ke Dashboard
          </button>
        </div>
      </div>
    </section>
  );
}
