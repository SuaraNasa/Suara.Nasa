import { useState, useEffect } from "react";
import { Image } from "lucide-react";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import { getContent } from "@/lib/data";

export default function PosterPlaceholder() {
  const ref = useScrollReveal();
  const [poster, setPoster] = useState<string | null>(null);

  useEffect(() => {
    setPoster(getContent().poster);
    const interval = setInterval(() => setPoster(getContent().poster), 1000);
    return () => clearInterval(interval);
  }, []);

  if (poster) {
    return (
      <section className="bg-[#f0f4f8] py-10" ref={ref}>
        <div className="container-main" data-reveal>
          <div className="w-full max-w-[900px] mx-auto rounded-2xl overflow-hidden shadow-card">
            <img src={poster} alt="Poster Kampanye" className="w-full h-auto" />
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="bg-[#f0f4f8] py-10" ref={ref}>
      <div className="container-main">
        <div
          data-reveal
          className="w-full max-w-[900px] mx-auto aspect-video rounded-2xl border-2 border-dashed border-[#cbd5e0] bg-[#f7fafc] flex flex-col items-center justify-center gap-3 transition-colors duration-300 hover:border-sky hover:text-sky cursor-pointer group"
        >
          <Image className="w-12 h-12 text-[#cbd5e0] group-hover:text-sky transition-colors duration-300" />
          <h4 className="text-lg font-semibold text-[#a0aec0] group-hover:text-sky transition-colors duration-300">
            Area Poster Kampanye
          </h4>
          <p className="text-sm text-[#a0aec0] group-hover:text-sky transition-colors duration-300">
            Poster anti-perundungan dapat dimasukkan di sini.
          </p>
        </div>
      </div>
    </section>
  );
}
