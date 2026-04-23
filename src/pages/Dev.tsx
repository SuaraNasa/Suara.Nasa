import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import {
  Shield, Eye, EyeOff, CheckCircle, Image, FileText, Users, Phone,
  Mail, MapPin, Plus, Trash2, ScrollText, ArrowLeft, LogOut
} from "lucide-react";
import {
  login as doLogin,
  logout as doLogout,
  isAuthenticated,
  validateTeacher,
  getContent,
  saveContent,
  getTeachers,
  addTeacher,
  removeTeacher,
  type SiteContent,
} from "@/lib/data";

/* ============================================
   LOGIN SCREEN (same as guru)
   ============================================ */
function LoginScreen({ onSuccess }: { onSuccess: () => void }) {
  const [nama, setNama] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(false);
    if (!nama.trim() || !password.trim()) {
      setError(true);
      return;
    }
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      if (validateTeacher(nama.trim(), password)) {
        doLogin();
        setSuccess(true);
        setTimeout(onSuccess, 600);
      } else {
        setError(true);
      }
    }, 600);
  };

  return (
    <div className="min-h-screen bg-cream flex items-center justify-center relative overflow-hidden p-4">
      <div className="absolute top-20 right-20 w-[300px] h-[300px] rounded-full bg-gradient-radial from-sky/20 to-transparent animate-float opacity-50" />
      <div className="absolute bottom-20 left-20 w-[250px] h-[250px] rounded-full bg-gradient-radial from-sage/15 to-transparent animate-float-delayed opacity-50" />

      <div className="bg-white rounded-[20px] shadow-modal p-8 md:p-12 max-w-[440px] w-full relative z-10">
        <div className="text-center">
          <Shield className="w-12 h-12 text-navy mx-auto" />
          <h3 className="font-playfair text-2xl font-bold text-navy mt-4">Akses Developer</h3>
          <p className="text-sm text-gray mt-2">
            Masukkan kredensial guru untuk mengakses editor konten.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="mt-8 flex flex-col gap-4">
          <div>
            <label className="block text-sm font-semibold text-charcoal mb-1">Nama Guru</label>
            <input
              type="text"
              value={nama}
              onChange={(e) => setNama(e.target.value)}
              placeholder="Masukkan nama Anda"
              className="w-full border border-light-gray rounded-xl px-4 py-3.5 text-sm focus:outline-none focus:border-2 focus:border-sky focus:shadow-[0_0_0_4px_rgba(135,206,235,0.15)] transition-all"
            />
          </div>

          <div className="relative">
            <label className="block text-sm font-semibold text-charcoal mb-1">Password</label>
            <input
              type={showPw ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Masukkan password"
              className="w-full border border-light-gray rounded-xl px-4 py-3.5 text-sm pr-11 focus:outline-none focus:border-2 focus:border-sky focus:shadow-[0_0_0_4px_rgba(135,206,235,0.15)] transition-all"
            />
            <button
              type="button"
              onClick={() => setShowPw(!showPw)}
              className="absolute right-3 top-[34px] text-gray hover:text-charcoal"
            >
              {showPw ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
          </div>

          {error && (
            <p className="text-xs text-coral text-center animate-shake">Nama atau password salah.</p>
          )}

          <button
            type="submit"
            disabled={loading || success}
            className={`w-full btn-primary mt-2 flex items-center justify-center gap-2 ${success ? "!bg-sage" : ""}`}
          >
            {loading ? (
              <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : success ? (
              <><CheckCircle className="w-5 h-5" /> Berhasil!</>
            ) : (
              "Masuk"
            )}
          </button>
        </form>
      </div>
    </div>
  );
}

/* ============================================
   POSTER EDITOR
   ============================================ */
function PosterEditor({ content, onChange }: { content: SiteContent; onChange: (c: Partial<SiteContent>) => void }) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      alert("File terlalu besar. Maksimal 5MB.");
      return;
    }
    const reader = new FileReader();
    reader.onloadend = () => {
      onChange({ poster: reader.result as string });
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="bg-white rounded-2xl shadow-card p-6 md:p-8">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-xl bg-sky/15 flex items-center justify-center">
          <Image className="w-5 h-5 text-sky" />
        </div>
        <div>
          <h3 className="font-playfair text-lg font-bold text-navy">Poster Kampanye</h3>
          <p className="text-xs text-gray">Upload poster anti-perundungan</p>
        </div>
      </div>

      {content.poster ? (
        <div className="space-y-4">
          <div className="rounded-xl overflow-hidden border border-light-gray">
            <img src={content.poster} alt="Poster" className="w-full h-auto max-h-[400px] object-contain bg-[#f7fafc]" />
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => fileInputRef.current?.click()}
              className="btn-secondary text-sm py-2.5 px-5"
            >
              Ganti Poster
            </button>
            <button
              onClick={() => onChange({ poster: null })}
              className="text-coral text-sm font-medium hover:underline flex items-center gap-1"
            >
              <Trash2 className="w-4 h-4" /> Hapus
            </button>
          </div>
        </div>
      ) : (
        <div
          onClick={() => fileInputRef.current?.click()}
          className="border-2 border-dashed border-light-gray rounded-xl p-12 text-center cursor-pointer hover:border-sky hover:bg-sky/5 transition-all"
        >
          <Image className="w-10 h-10 text-[#a0aec0] mx-auto mb-3" />
          <p className="text-sm text-[#a0aec0]">Klik untuk upload poster</p>
          <p className="text-xs text-[#a0aec0] mt-1">JPG, PNG (maks. 5MB)</p>
        </div>
      )}
      <input ref={fileInputRef} type="file" accept=".jpg,.jpeg,.png" className="hidden" onChange={handleFile} />
    </div>
  );
}

/* ============================================
   IKRAR EDITOR
   ============================================ */
function IkrarEditor({ content, onChange }: { content: SiteContent; onChange: (c: Partial<SiteContent>) => void }) {
  return (
    <div className="bg-white rounded-2xl shadow-card p-6 md:p-8">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-xl bg-sage/15 flex items-center justify-center">
          <ScrollText className="w-5 h-5 text-sage" />
        </div>
        <div>
          <h3 className="font-playfair text-lg font-bold text-navy">Ikrar Taruna-Taruni</h3>
          <p className="text-xs text-gray">Edit teks ikrar siswa</p>
        </div>
      </div>

      <textarea
        value={content.ikrar}
        onChange={(e) => onChange({ ikrar: e.target.value })}
        placeholder="Masukkan teks ikrar taruna-taruni di sini..."
        rows={10}
        className="w-full border border-light-gray rounded-xl px-4 py-3.5 text-sm text-charcoal placeholder:text-[#a0aec0] focus:outline-none focus:border-2 focus:border-sky focus:shadow-[0_0_0_4px_rgba(135,206,235,0.15)] transition-all resize-none leading-relaxed"
      />
    </div>
  );
}

/* ============================================
   PERDUPTAR EDITOR
   ============================================ */
function PerduptarEditor({ content, onChange }: { content: SiteContent; onChange: (c: Partial<SiteContent>) => void }) {
  const addRule = () => {
    const newRule = { no: "", ket: "", sanksi: "" };
    const updated = [...content.perduptar, newRule];
    onChange({ perduptar: updated });
  };

  const updateRule = (index: number, field: string, value: string) => {
    const updated = content.perduptar.map((r, i) =>
      i === index ? { ...r, [field]: value } : r
    );
    onChange({ perduptar: updated });
  };

  const deleteRule = (index: number) => {
    const updated = content.perduptar.filter((_, i) => i !== index);
    onChange({ perduptar: updated });
  };

  return (
    <div className="bg-white rounded-2xl shadow-card p-6 md:p-8">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-coral/15 flex items-center justify-center">
            <FileText className="w-5 h-5 text-coral" />
          </div>
          <div>
            <h3 className="font-playfair text-lg font-bold text-navy">PERDUPTAR</h3>
            <p className="text-xs text-gray">Kelola peraturan kehidupan taruna</p>
          </div>
        </div>
        <button
          onClick={addRule}
          className="btn-primary text-sm py-2 px-4 flex items-center gap-1.5"
        >
          <Plus className="w-4 h-4" /> Tambah
        </button>
      </div>

      {content.perduptar.length === 0 ? (
        <div className="text-center py-10 text-gray italic">
          Belum ada peraturan. Klik "Tambah" untuk menambahkan.
        </div>
      ) : (
        <div className="space-y-4">
          {content.perduptar.map((rule, i) => (
            <div key={i} className="border border-light-gray rounded-xl p-4 space-y-3">
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold text-navy bg-navy/10 rounded-lg px-2.5 py-1">#{i + 1}</span>
                <button
                  onClick={() => deleteRule(i)}
                  className="ml-auto text-gray hover:text-coral transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
              <input
                value={rule.no}
                onChange={(e) => updateRule(i, "no", e.target.value)}
                placeholder="No / Pasal"
                className="w-full border border-light-gray rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-sky"
              />
              <textarea
                value={rule.ket}
                onChange={(e) => updateRule(i, "ket", e.target.value)}
                placeholder="Keterangan"
                rows={2}
                className="w-full border border-light-gray rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-sky resize-none"
              />
              <textarea
                value={rule.sanksi}
                onChange={(e) => updateRule(i, "sanksi", e.target.value)}
                placeholder="Hukuman / Sanksi"
                rows={2}
                className="w-full border border-light-gray rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-sky resize-none"
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

/* ============================================
   TEACHERS EDITOR
   ============================================ */
function TeachersEditor() {
  const [teachers, setTeachers] = useState<string[]>([]);
  const [newName, setNewName] = useState("");

  useEffect(() => {
    setTeachers(getTeachers());
  }, []);

  const refresh = () => setTeachers(getTeachers());

  const handleAdd = () => {
    if (!newName.trim()) return;
    addTeacher(newName.trim());
    setNewName("");
    refresh();
  };

  const handleDelete = (name: string) => {
    if (confirm(`Hapus guru "${name}"?`)) {
      removeTeacher(name);
      refresh();
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-card p-6 md:p-8">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-xl bg-soft-lavender/15 flex items-center justify-center">
          <Users className="w-5 h-5 text-soft-lavender" />
        </div>
        <div>
          <h3 className="font-playfair text-lg font-bold text-navy">Daftar Guru</h3>
          <p className="text-xs text-gray">Kelola guru yang bisa akses dashboard</p>
        </div>
      </div>

      <div className="flex gap-2 mb-6">
        <input
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleAdd()}
          placeholder="Nama guru baru"
          className="flex-1 border border-light-gray rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-sky"
        />
        <button onClick={handleAdd} className="btn-primary text-sm py-2.5 px-4 flex items-center gap-1.5">
          <Plus className="w-4 h-4" /> Tambah
        </button>
      </div>

      <p className="text-xs text-gray mb-3">
        Password otomatis = nama guru (lowercase)
      </p>

      <div className="space-y-2">
        {teachers.map((t) => (
          <div
            key={t}
            className="flex items-center justify-between p-3 bg-[#f7fafc] rounded-xl"
          >
            <div>
              <p className="text-sm font-medium text-charcoal capitalize">{t}</p>
              <p className="text-xs text-gray">Pass: {t}</p>
            </div>
            <button
              onClick={() => handleDelete(t)}
              className="text-gray hover:text-coral transition-colors p-1"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ============================================
   CONTACT EDITOR
   ============================================ */
function ContactEditor({ content, onChange }: { content: SiteContent; onChange: (c: Partial<SiteContent>) => void }) {
  return (
    <div className="bg-white rounded-2xl shadow-card p-6 md:p-8">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-xl bg-peach flex items-center justify-center">
          <Phone className="w-5 h-5 text-[#c05621]" />
        </div>
        <div>
          <h3 className="font-playfair text-lg font-bold text-navy">Kontak Sekolah</h3>
          <p className="text-xs text-gray">Edit informasi kontak di footer</p>
        </div>
      </div>

      <div className="space-y-4">
        <div>
          <label className="flex items-center gap-1.5 text-sm font-semibold text-charcoal mb-1">
            <MapPin className="w-4 h-4 text-gray" /> Alamat
          </label>
          <textarea
            value={content.contact.address}
            onChange={(e) =>
              onChange({ contact: { ...content.contact, address: e.target.value } })
            }
            placeholder="Alamat sekolah"
            rows={2}
            className="w-full border border-light-gray rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-sky resize-none"
          />
        </div>
        <div>
          <label className="flex items-center gap-1.5 text-sm font-semibold text-charcoal mb-1">
            <Phone className="w-4 h-4 text-gray" /> Telepon
          </label>
          <input
            value={content.contact.phone}
            onChange={(e) =>
              onChange({ contact: { ...content.contact, phone: e.target.value } })
            }
            placeholder="Nomor telepon sekolah"
            className="w-full border border-light-gray rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-sky"
          />
        </div>
        <div>
          <label className="flex items-center gap-1.5 text-sm font-semibold text-charcoal mb-1">
            <Mail className="w-4 h-4 text-gray" /> Email
          </label>
          <input
            value={content.contact.email}
            onChange={(e) =>
              onChange({ contact: { ...content.contact, email: e.target.value } })
            }
            placeholder="Email sekolah"
            className="w-full border border-light-gray rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-sky"
          />
        </div>
      </div>
    </div>
  );
}

/* ============================================
   MAIN DEV DASHBOARD
   ============================================ */
function DevDashboard() {
  const [content, setContent] = useState<SiteContent>(getContent());
  const [saved, setSaved] = useState(false);
  const navigate = useNavigate();

  const handleChange = (updates: Partial<SiteContent>) => {
    const updated = { ...content, ...updates };
    setContent(updated);
    saveContent(updates);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const handleLogout = () => {
    doLogout();
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-[#f0f4f8]">
      {/* Top bar */}
      <div className="h-16 bg-white shadow-nav px-6 md:px-8 flex items-center justify-between sticky top-0 z-50">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate("/")}
            className="text-navy hover:text-coral transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-navy" />
            <h4 className="font-semibold text-navy">Developer Editor</h4>
          </div>
        </div>
        <div className="flex items-center gap-4">
          {saved && (
            <span className="text-xs text-sage font-medium flex items-center gap-1">
              <CheckCircle className="w-3.5 h-3.5" /> Tersimpan
            </span>
          )}
          <button
            onClick={handleLogout}
            className="text-sm text-gray hover:text-coral transition-colors flex items-center gap-1"
          >
            <LogOut className="w-4 h-4" /> Keluar
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="p-6 md:p-8 max-w-[900px] mx-auto space-y-6">
        <div className="bg-coral/10 rounded-xl p-4 border border-coral/20">
          <p className="text-sm text-coral font-medium">
            Editor Konten — Semua perubahan tersimpan otomatis ke browser.
          </p>
        </div>

        <PosterEditor content={content} onChange={handleChange} />
        <IkrarEditor content={content} onChange={handleChange} />
        <PerduptarEditor content={content} onChange={handleChange} />
        <TeachersEditor />
        <ContactEditor content={content} onChange={handleChange} />

        <div className="h-8" />
      </div>
    </div>
  );
}

/* ============================================
   DEV PAGE EXPORT
   ============================================ */
export default function Dev() {
  const [auth, setAuth] = useState(isAuthenticated());

  if (!auth) {
    return <LoginScreen onSuccess={() => setAuth(true)} />;
  }

  return <DevDashboard />;
}
