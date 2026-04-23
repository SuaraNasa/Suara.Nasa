import { useState, useEffect } from "react";
import { ScrollText } from "lucide-react";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import { getContent } from "@/lib/data";

export default function IkrarSection() {
  const ref = useScrollReveal();
  const [ikrar, setIkrar] = useState("");

  useEffect(() => {
    setIkrar(getContent().ikrar);
    const interval = setInterval(() => setIkrar(getContent().ikrar), 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section
      id="taruna"
      className="bg-gradient-to-br from-navy to-[#2c5282] section-padding"
      ref={ref}
    >
      <div className="container-main">
        <div data-reveal>
          <span className="inline-block bg-white/15 text-white text-xs font-medium uppercase tracking-wider rounded-full px-4 py-1.5">
            Ikrar Taruna-Taruni
          </span>
          <h2 className="font-playfair text-3xl md:text-4xl font-bold text-white mt-4">
            Ikrar Taruna-Taruni SMAN 3 Taruna Angkasa Jawa Timur
          </h2>
        </div>

        <div data-reveal className="mt-8">
          {ikrar ? (
            <div className="bg-white/[0.08] rounded-[20px] p-8 md:p-12">
              <div className="text-white/90 leading-relaxed whitespace-pre-line text-base md:text-lg">
                {ikrar}
              </div>
            </div>
          ) : (
            <div className="bg-white/[0.08] border-2 border-dashed border-white/25 rounded-[20px] p-12 md:p-16 flex flex-col items-center justify-center text-center transition-all duration-300 hover:bg-white/[0.12] hover:border-white/40 cursor-pointer group">
              <ScrollText className="w-16 h-16 text-white/40 animate-pulse-opacity mb-4 group-hover:text-white/60 transition-colors" />
              <h3 className="font-playfair text-2xl md:text-3xl font-semibold text-white/50 italic group-hover:text-white/70 transition-colors">
                [Isi Ikrar Taruna-Taruni]
              </h3>
              <p className="text-sm text-white/35 mt-2 group-hover:text-white/50 transition-colors">
                Ikrar akan diisi oleh pengelola website.
              </p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
