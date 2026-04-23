import { useState, useEffect } from "react";
import { FileText } from "lucide-react";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import { getContent } from "@/lib/data";

const uudData = [
  {
    no: "UU RI No. 35 Tahun 2014",
    ket: "Perlindungan Anak — Pasal 76: Setiap orang dilarang melakukan kekerasan fisik, psikis, dan/atau pelecehan seksual terhadap anak",
    sanksi: "Pidana penjara paling lama 5 tahun dan/atau denda paling banyak Rp100.000.000",
  },
  {
    no: "Pasal 80 ayat (1)",
    ket: "Perlindungan Anak — Setiap orang yang dengan sengaja melakukan kekerasan atau ancaman kekerasan memaksa anak melakukan sesuatu yang tidak ingin dilakukannya",
    sanksi: "Pidana penjara paling lama 3 tahun 6 bulan dan/atau denda paling banyak Rp72.000.000",
  },
  {
    no: "Pasal 80 ayat (2)",
    ket: "Perlindungan Anak — Setiap orang yang dengan sengaja melakukan kekerasan atau ancaman kekerasan memaksa anak melakukan perilaku asusila",
    sanksi: "Pidana penjara paling lama 5 tahun dan/atau denda paling banyak Rp100.000.000",
  },
  {
    no: "Pasal 80 ayat (3)",
    ket: "Perlindungan Anak — Setiap orang yang dengan sengaja melakukan kekerasan atau ancaman kekerasan memaksa anak melakukan tindak pidana",
    sanksi: "Pidana penjara paling lama 5 tahun dan/atau denda paling banyak Rp100.000.000",
  },
  {
    no: "UU RI No. 11 Tahun 2008",
    ket: "ITE — Pasal 27 ayat (3): Setiap Orang dengan sengaja dan tanpa hak mendistribusikan Informasi Elektronik yang memiliki muatan penghinaan dan/atau pencemaran nama baik",
    sanksi: "Pidana penjara paling lama 4 tahun dan/atau denda paling banyak Rp750.000.000",
  },
  {
    no: "UU RI No. 1 Tahun 2023 (KUHP)",
    ket: "KUHP — Pasal 367: Memaksa orang dengan kekerasan atau ancaman kekerasan untuk memberikan barang sesuatu, membayar utang, atau melepaskan utang",
    sanksi: "Pidana penjara paling lama 4 tahun",
  },
  {
    no: "Pasal 368 KUHP",
    ket: "Barang siapa memaksa seseorang dengan kekerasan atau ancaman kekerasan untuk memberikan sesuatu, membayar atau mengurangi utang",
    sanksi: "Pidana penjara paling lama 4 tahun",
  },
  {
    no: "Pasal 406 KUHP",
    ket: "Barang siapa dengan sengaja merusak atau menghancurkan barang milik orang lain",
    sanksi: "Pidana penjara paling lama 2 tahun 8 bulan",
  },
  {
    no: "Pasal 289 KUHP",
    ket: "Barang siapa melakukan perbuatan cabul dengan orang lain dengan kekerasan atau ancaman kekerasan",
    sanksi: "Pidana penjara paling lama 9 tahun",
  },
  {
    no: "Pasal 285 KUHP",
    ket: "Barang siapa memperkosa seorang perempuan dengan kekeratan atau ancaman kekeratan",
    sanksi: "Pidana penjara paling lama 12 tahun",
  },
];

export default function RegulationsSection() {
  const [activeTab, setActiveTab] = useState<"perduptar" | "uud">("perduptar");
  const [perduptarData, setPerduptarData] = useState<{ no: string; ket: string; sanksi: string }[]>([]);
  const ref = useScrollReveal(0.05);

  useEffect(() => {
    setPerduptarData(getContent().perduptar);
    const interval = setInterval(() => setPerduptarData(getContent().perduptar), 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section id="peraturan" className="bg-white section-padding" ref={ref}>
      <div className="container-main">
        <div data-reveal>
          <span className="inline-block bg-mint text-[#2d6a4f] text-xs font-medium uppercase tracking-wider rounded-full px-4 py-1.5">
            Regulasi
          </span>
          <h2 className="font-playfair text-3xl md:text-4xl font-bold text-navy mt-4">
            Peraturan & Hukum
          </h2>
          <p className="text-gray mt-2 max-w-[600px]">
            Ketahui dasar hukum dan peraturan sekolah yang melindungi siswa dari perundungan.
          </p>
        </div>

        <div data-reveal className="mt-8">
          <div className="inline-flex bg-[#f0f4f8] rounded-xl p-1">
            {(["perduptar", "uud"] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-6 py-2.5 rounded-lg text-sm font-medium transition-all duration-300 ${
                  activeTab === tab
                    ? "bg-navy text-white"
                    : "text-gray hover:text-charcoal"
                }`}
              >
                {tab === "perduptar" ? "PERDUPTAR" : "UU Perundungan"}
              </button>
            ))}
          </div>
        </div>

        <div data-reveal className="mt-6">
          {activeTab === "perduptar" ? (
            perduptarData.length === 0 ? (
              <div className="bg-white rounded-2xl shadow-card overflow-hidden">
                <div className="bg-navy text-white px-6 py-4 grid grid-cols-12 gap-4 text-xs font-semibold uppercase tracking-wider">
                  <div className="col-span-2">No / Pasal</div>
                  <div className="col-span-5">Keterangan</div>
                  <div className="col-span-5">Hukuman / Sanksi</div>
                </div>
                <div className="flex flex-col items-center justify-center py-16 text-gray">
                  <FileText className="w-10 h-10 mb-3 text-light-gray" />
                  <p className="italic">
                    [Peraturan Kehidupan Taruna akan diunggah oleh pengelola]
                  </p>
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-2xl shadow-card overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full min-w-[700px]">
                    <thead>
                      <tr className="bg-navy text-white">
                        <th className="text-left px-6 py-4 text-xs font-semibold uppercase tracking-wider w-[18%]">No / Pasal</th>
                        <th className="text-left px-6 py-4 text-xs font-semibold uppercase tracking-wider w-[45%]">Keterangan</th>
                        <th className="text-left px-6 py-4 text-xs font-semibold uppercase tracking-wider w-[37%]">Hukuman / Sanksi</th>
                      </tr>
                    </thead>
                    <tbody>
                      {perduptarData.map((row, i) => (
                        <tr
                          key={i}
                          className={`border-b border-light-gray transition-colors hover:bg-[#edf2f7] ${
                            i % 2 === 1 ? "bg-[#f7fafc]" : "bg-white"
                          }`}
                        >
                          <td className="px-6 py-3.5 text-sm text-charcoal font-medium">{row.no}</td>
                          <td className="px-6 py-3.5 text-sm text-charcoal leading-relaxed">{row.ket}</td>
                          <td className="px-6 py-3.5 text-sm text-coral font-medium leading-relaxed">{row.sanksi}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )
          ) : (
            <div className="bg-white rounded-2xl shadow-card overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full min-w-[700px]">
                  <thead>
                    <tr className="bg-navy text-white">
                      <th className="text-left px-6 py-4 text-xs font-semibold uppercase tracking-wider w-[20%]">No / Pasal</th>
                      <th className="text-left px-6 py-4 text-xs font-semibold uppercase tracking-wider w-[45%]">Keterangan</th>
                      <th className="text-left px-6 py-4 text-xs font-semibold uppercase tracking-wider w-[35%]">Hukuman / Sanksi</th>
                    </tr>
                  </thead>
                  <tbody>
                    {uudData.map((row, i) => (
                      <tr
                        key={i}
                        className={`border-b border-light-gray transition-colors hover:bg-[#edf2f7] ${
                          i % 2 === 1 ? "bg-[#f7fafc]" : "bg-white"
                        }`}
                      >
                        <td className="px-6 py-3.5 text-sm text-charcoal font-medium">{row.no}</td>
                        <td className="px-6 py-3.5 text-sm text-charcoal leading-relaxed">{row.ket}</td>
                        <td className="px-6 py-3.5 text-sm text-coral font-medium leading-relaxed">{row.sanksi}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
