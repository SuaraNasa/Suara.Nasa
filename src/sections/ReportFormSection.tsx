import { useState, useRef, type FormEvent } from "react";
import { ShieldCheck, Lock, Clock, AlertTriangle, Upload, CheckCircle } from "lucide-react";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import { addReport, kelasOptions } from "@/lib/data";

const jenisOptions = [
  "Verbal (ejekan, hinaan, ancaman)",
  "Fisik (kekeratan, penyerangan)",
  "Sosial (pengucilan, penyebaran isu)",
  "Cyberbullying (di media sosial, chat)",
  "Seksual (pelecehan, perbuatan tidak senonoh)",
];

export default function ReportFormSection() {
  const ref = useScrollReveal(0.05);
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const [fileName, setFileName] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitting(true);

    const form = e.currentTarget;
    const formData = new FormData(form);

    setTimeout(() => {
      addReport({
        pelaku: (formData.get("pelaku") as string) || "",
        kelasPelaku: (formData.get("kelasPelaku") as string) || "",
        korban: (formData.get("korban") as string) || "Anonim",
        kelasKorban: (formData.get("kelasKorban") as string) || "",
        lokasi: (formData.get("lokasi") as string) || "",
        waktu: (formData.get("waktu") as string) || new Date().toISOString(),
        jenis: (formData.get("jenis") as string) || "",
        deskripsi: (formData.get("deskripsi") as string) || "",
        bukti: fileName,
      });

      setSubmitting(false);
      setSubmitted(true);
      form.reset();
      setFileName(null);

      setTimeout(() => {
        setSubmitted(false);
      }, 3000);
    }, 800);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) setFileName(file.name);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      setFileName(file.name);
      if (fileInputRef.current) {
        const dt = new DataTransfer();
        dt.items.add(file);
        fileInputRef.current.files = dt.files;
      }
    }
  };

  return (
    <section id="laporkan" className="bg-mint section-padding" ref={ref}>
      <div className="container-main">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-14">
          {/* Info Panel */}
          <div data-reveal>
            <span className="inline-block bg-white text-[#2d6a4f] text-xs font-medium uppercase tracking-wider rounded-full px-4 py-1.5">
              Laporkan
            </span>
            <h2 className="font-playfair text-3xl md:text-4xl font-bold text-navy mt-4">
              Laporkan Kasus Perundungan
            </h2>
            <p className="text-[#2d6a4f] mt-3 leading-relaxed">
              Anda dapat melaporkan kasus perundungan secara anonim. Setiap laporan akan
              ditindaklanjuti oleh pihak sekolah dengan serius dan rahasia.
            </p>

            <div className="mt-6 flex flex-col gap-4">
              {[
                { icon: ShieldCheck, text: "Laporan bersifat anonim" },
                { icon: Lock, text: "Data dijaga kerahasiaannya" },
                { icon: Clock, text: "Tindak lanjut dalam 24 jam" },
              ].map(({ icon: Icon, text }) => (
                <div key={text} className="flex items-center gap-2.5">
                  <Icon className="w-5 h-5 text-sage flex-shrink-0" />
                  <span className="text-sm text-[#2d3748]">{text}</span>
                </div>
              ))}
            </div>

            <div className="mt-8 bg-peach rounded-xl p-5 flex items-start gap-3">
              <AlertTriangle className="w-6 h-6 text-[#c05621] flex-shrink-0 mt-0.5" />
              <p className="text-sm text-[#744210] leading-relaxed">
                Jika Anda dalam bahaya segera, hubungi wali kelas atau guru BP langsung.
              </p>
            </div>
          </div>

          {/* Form */}
          <div data-reveal>
            <div className="bg-white rounded-[20px] shadow-card p-6 md:p-10">
              <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                <div>
                  <label className="block text-sm font-semibold text-charcoal mb-1">
                    Identitas Pelaku <span className="text-coral">*</span>
                  </label>
                  <input
                    name="pelaku"
                    required
                    type="text"
                    placeholder="Nama pelaku perundungan"
                    className="w-full border border-light-gray rounded-xl px-4 py-3.5 text-sm text-charcoal placeholder:text-[#a0aec0] focus:outline-none focus:border-2 focus:border-sky focus:shadow-[0_0_0_4px_rgba(135,206,235,0.15)] transition-all"
                  />
                  <p className="text-xs text-gray mt-1">Nama lengkap atau panggilan pelaku</p>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-charcoal mb-1">
                    Kelas Pelaku <span className="text-coral">*</span>
                  </label>
                  <select
                    name="kelasPelaku"
                    required
                    className="w-full border border-light-gray rounded-xl px-4 py-3.5 text-sm text-charcoal focus:outline-none focus:border-2 focus:border-sky focus:shadow-[0_0_0_4px_rgba(135,206,235,0.15)] transition-all bg-white"
                  >
                    <option value="">Pilih kelas pelaku</option>
                    {kelasOptions.map((k) => (
                      <option key={k} value={k}>{k}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-charcoal mb-1">
                    Identitas Korban
                  </label>
                  <input
                    name="korban"
                    type="text"
                    placeholder="Nama korban (bisa anonim)"
                    className="w-full border border-light-gray rounded-xl px-4 py-3.5 text-sm text-charcoal placeholder:text-[#a0aec0] focus:outline-none focus:border-2 focus:border-sky focus:shadow-[0_0_0_4px_rgba(135,206,235,0.15)] transition-all"
                  />
                  <p className="text-xs text-gray mt-1">Kosongkan jika ingin tetap anonim</p>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-charcoal mb-1">
                    Kelas Korban
                  </label>
                  <select
                    name="kelasKorban"
                    className="w-full border border-light-gray rounded-xl px-4 py-3.5 text-sm text-charcoal focus:outline-none focus:border-2 focus:border-sky focus:shadow-[0_0_0_4px_rgba(135,206,235,0.15)] transition-all bg-white"
                  >
                    <option value="">Pilih kelas korban</option>
                    {kelasOptions.map((k) => (
                      <option key={k} value={k}>{k}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-charcoal mb-1">
                    Lokasi Kejadian <span className="text-coral">*</span>
                  </label>
                  <input
                    name="lokasi"
                    required
                    type="text"
                    placeholder="Contoh: Halaman sekolah, kelas, kantin..."
                    className="w-full border border-light-gray rounded-xl px-4 py-3.5 text-sm text-charcoal placeholder:text-[#a0aec0] focus:outline-none focus:border-2 focus:border-sky focus:shadow-[0_0_0_4px_rgba(135,206,235,0.15)] transition-all"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-charcoal mb-1">
                    Waktu Kejadian <span className="text-coral">*</span>
                  </label>
                  <input
                    name="waktu"
                    required
                    type="datetime-local"
                    className="w-full border border-light-gray rounded-xl px-4 py-3.5 text-sm text-charcoal focus:outline-none focus:border-2 focus:border-sky focus:shadow-[0_0_0_4px_rgba(135,206,235,0.15)] transition-all"
                  />
                  <p className="text-xs text-gray mt-1">Perkiraan waktu kejadian</p>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-charcoal mb-1">
                    Jenis Perundungan <span className="text-coral">*</span>
                  </label>
                  <select
                    name="jenis"
                    required
                    className="w-full border border-light-gray rounded-xl px-4 py-3.5 text-sm text-charcoal focus:outline-none focus:border-2 focus:border-sky focus:shadow-[0_0_0_4px_rgba(135,206,235,0.15)] transition-all bg-white"
                  >
                    <option value="">Pilih jenis perundungan</option>
                    {jenisOptions.map((j) => (
                      <option key={j} value={j}>{j}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-charcoal mb-1">
                    Deskripsi Kejadian <span className="text-coral">*</span>
                  </label>
                  <textarea
                    name="deskripsi"
                    required
                    rows={5}
                    placeholder="Ceritakan kejadian secara detail..."
                    className="w-full border border-light-gray rounded-xl px-4 py-3.5 text-sm text-charcoal placeholder:text-[#a0aec0] focus:outline-none focus:border-2 focus:border-sky focus:shadow-[0_0_0_4px_rgba(135,206,235,0.15)] transition-all resize-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-charcoal mb-1">
                    Bukti (opsional)
                  </label>
                  <div
                    onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
                    onDragLeave={() => setDragOver(false)}
                    onDrop={handleDrop}
                    onClick={() => fileInputRef.current?.click()}
                    className={`w-full border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all ${
                      dragOver
                        ? "border-sky bg-sky/5"
                        : "border-light-gray hover:border-sky/60"
                    }`}
                  >
                    <input
                      ref={fileInputRef}
                      type="file"
                      name="bukti"
                      className="hidden"
                      accept=".jpg,.jpeg,.png,.pdf"
                      onChange={handleFileChange}
                    />
                    {fileName ? (
                      <div className="flex items-center justify-center gap-2">
                        <CheckCircle className="w-5 h-5 text-sage" />
                        <span className="text-sm text-charcoal">{fileName}</span>
                      </div>
                    ) : (
                      <>
                        <Upload className="w-8 h-8 text-[#a0aec0] mx-auto mb-2" />
                        <p className="text-sm text-[#a0aec0]">Klik atau seret file ke sini</p>
                        <p className="text-xs text-[#a0aec0] mt-1">Format: JPG, PNG, PDF (maks. 10MB)</p>
                      </>
                    )}
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className={`w-full btn-primary flex items-center justify-center gap-2 mt-2 transition-all duration-300 ${
                    submitted
                      ? "!bg-sage hover:!bg-sage"
                      : submitting
                      ? "opacity-70"
                      : ""
                  }`}
                >
                  {submitting ? (
                    <>
                      <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Mengirim...
                    </>
                  ) : submitted ? (
                    <>
                      <CheckCircle className="w-5 h-5" />
                      Laporan Terkirim!
                    </>
                  ) : (
                    <>
                      <ShieldCheck className="w-5 h-5" />
                      Kirim Laporan
                    </>
                  )}
                </button>

                {submitted && (
                  <div className="bg-mint border border-sage rounded-xl p-5 flex items-start gap-3 animate-in fade-in">
                    <CheckCircle className="w-5 h-5 text-[#2d6a4f] flex-shrink-0 mt-0.5" />
                    <p className="text-sm text-[#2d6a4f]">
                      Terima kasih! Laporan Anda telah diterima dan akan segera ditindaklanjuti.
                    </p>
                  </div>
                )}
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
