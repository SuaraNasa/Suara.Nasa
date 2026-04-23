import { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import {
  Shield, Eye, EyeOff, CheckCircle, LayoutDashboard, FileText, Users,
  Menu, X, Search, UserCircle, LogOut,
  Clock, Bell, CheckCircle2, HelpCircle, Download
} from "lucide-react";
import { login as doLogin, logout as doLogout, isAuthenticated, getReports, updateReportStatus, getOffenderStats, validateTeacher } from "@/lib/data";
import type { Report } from "@/types";

type Tab = "overview" | "laporan" | "pelaku";

/* ============================================
   LOGIN SCREEN
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
          <h3 className="font-playfair text-2xl font-bold text-navy mt-4">Akses Guru</h3>
          <p className="text-sm text-gray mt-2">
            Masukkan kredensial Anda untuk mengakses dashboard laporan perundungan.
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
   JENIS BADGE
   ============================================ */
function JenisBadge({ jenis }: { jenis: string }) {
  const getColor = () => {
    if (jenis.includes("Verbal")) return "bg-sky/15 text-sky";
    if (jenis.includes("Fisik")) return "bg-coral/15 text-coral";
    if (jenis.includes("Sosial")) return "bg-gray/15 text-gray";
    if (jenis.includes("Cyber")) return "bg-soft-lavender/15 text-soft-lavender";
    if (jenis.includes("Seksual")) return "bg-red-100 text-red-600";
    return "bg-gray/15 text-gray";
  };
  return (
    <span className={`inline-block text-xs font-medium rounded-full px-3 py-1 ${getColor()}`}>
      {jenis.split(" (")[0]}
    </span>
  );
}

function StatusBadge({ status }: { status: string }) {
  const colors: Record<string, string> = {
    Baru: "bg-sky/15 text-sky",
    Diproses: "bg-yellow-100 text-yellow-700",
    Selesai: "bg-sage/20 text-[#2d6a4f]",
  };
  return (
    <span className={`inline-block text-xs font-medium rounded-full px-3.5 py-1 ${colors[status] || colors.Baru}`}>
      {status}
    </span>
  );
}

/* ============================================
   REPORT CARD
   ============================================ */
function ReportCard({ report, onClick }: { report: Report; onClick: () => void }) {
  return (
    <div
      onClick={onClick}
      className="bg-white rounded-2xl shadow-card p-6 cursor-pointer transition-all hover:shadow-card-hover hover:-translate-y-1"
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-light-gray flex items-center justify-center">
            <HelpCircle className="w-5 h-5 text-gray" />
          </div>
          <h4 className="font-semibold text-navy">Laporan Anonim #{String(report.id).padStart(3, "0")}</h4>
        </div>
        <span className="bg-mint text-[#2d6a4f] text-xs font-medium rounded-lg px-3 py-1">
          {new Date(report.createdAt).toLocaleDateString("id-ID")}
        </span>
      </div>

      <div className="grid grid-cols-2 gap-3 mb-4">
        <div>
          <p className="text-xs text-gray mb-0.5">Pelaku</p>
          <p className="text-sm font-medium text-charcoal">{report.pelaku}</p>
          <p className="text-xs text-gray">{report.kelasPelaku}</p>
        </div>
        <div>
          <p className="text-xs text-gray mb-0.5">Korban</p>
          <p className="text-sm font-medium text-charcoal">{report.korban || "Anonim"}</p>
        </div>
        <div>
          <p className="text-xs text-gray mb-0.5">Lokasi</p>
          <p className="text-sm text-charcoal">{report.lokasi}</p>
        </div>
        <div>
          <p className="text-xs text-gray mb-0.5">Jenis</p>
          <JenisBadge jenis={report.jenis} />
        </div>
      </div>

      <div className="flex items-center justify-between">
        <StatusBadge status={report.status} />
        {report.bukti && (
          <span className="text-xs text-sage flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5" /> Ada bukti
          </span>
        )}
      </div>
    </div>
  );
}

/* ============================================
   REPORT DETAIL MODAL
   ============================================ */
function ReportDetailModal({ report, onClose, onStatusChange }: {
  report: Report; onClose: () => void; onStatusChange: (s: Report["status"]) => void;
}) {
  const [status, setStatus] = useState(report.status);

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="bg-white rounded-[20px] shadow-modal max-w-[640px] w-full max-h-[90vh] overflow-y-auto relative z-10">
        <div className="p-6 md:p-10">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-playfair text-xl font-bold text-navy">
              Detail Laporan #{String(report.id).padStart(3, "0")}
            </h3>
            <button onClick={onClose} className="text-gray hover:text-charcoal transition-colors">
              <X className="w-6 h-6" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
            <div><p className="text-xs text-gray mb-1">Pelaku</p><p className="text-sm font-medium text-charcoal">{report.pelaku}</p></div>
            <div><p className="text-xs text-gray mb-1">Kelas Pelaku</p><p className="text-sm font-medium text-charcoal">{report.kelasPelaku}</p></div>
            <div><p className="text-xs text-gray mb-1">Korban</p><p className="text-sm font-medium text-charcoal">{report.korban || "Anonim"}</p></div>
            <div><p className="text-xs text-gray mb-1">Kelas Korban</p><p className="text-sm text-charcoal">{report.kelasKorban || "-"}</p></div>
            <div><p className="text-xs text-gray mb-1">Lokasi</p><p className="text-sm text-charcoal">{report.lokasi}</p></div>
            <div><p className="text-xs text-gray mb-1">Waktu</p><p className="text-sm text-charcoal">{new Date(report.waktu).toLocaleString("id-ID")}</p></div>
            <div><p className="text-xs text-gray mb-1">Jenis</p><JenisBadge jenis={report.jenis} /></div>
            <div><p className="text-xs text-gray mb-1">Dilaporkan</p><p className="text-sm text-charcoal">{new Date(report.createdAt).toLocaleString("id-ID")}</p></div>
          </div>

          <div className="mb-6">
            <p className="text-xs text-gray mb-1">Deskripsi</p>
            <div className="bg-[#f7fafc] rounded-xl p-4 text-sm text-charcoal leading-relaxed max-h-[200px] overflow-y-auto">
              {report.deskripsi}
            </div>
          </div>

          <div className="mb-6">
            <p className="text-xs text-gray mb-1">Bukti</p>
            {report.bukti ? (
              <div className="flex items-center gap-2 text-sm text-sage">
                <CheckCircle2 className="w-4 h-4" />
                <span>{report.bukti}</span>
                <Download className="w-4 h-4 ml-1 cursor-pointer" />
              </div>
            ) : (
              <p className="text-sm text-gray italic">Tidak ada bukti</p>
            )}
          </div>

          <div className="mb-6">
            <label className="block text-xs text-gray mb-1.5 font-medium">Status</label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value as Report["status"])}
              className="border border-light-gray rounded-xl px-4 py-2.5 text-sm bg-white focus:outline-none focus:border-sky"
            >
              <option value="Baru">Baru</option>
              <option value="Diproses">Diproses</option>
              <option value="Selesai">Selesai</option>
            </select>
          </div>

          <div className="flex gap-3">
            <button onClick={onClose} className="flex-1 border border-light-gray text-gray rounded-full py-2.5 text-sm font-medium hover:bg-[#f7fafc] transition-colors">
              Tutup
            </button>
            <button
              onClick={() => { onStatusChange(status); onClose(); }}
              className="flex-1 btn-primary py-2.5 text-sm"
            >
              Simpan Status
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ============================================
   DASHBOARD OVERVIEW TAB
   ============================================ */
function DashboardOverview({ reports, onViewDetail }: { reports: Report[]; onViewDetail: (r: Report) => void }) {
  const newCount = reports.filter((r) => r.status === "Baru").length;
  const uniqueOffenders = useMemo(() => {
    const set = new Set(reports.map((r) => `${r.pelaku}|${r.kelasPelaku}`));
    return set.size;
  }, [reports]);

  return (
    <div className="p-6 md:p-8">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {[
          { icon: FileText, color: "text-sky", bg: "bg-sky/15", num: reports.length, label: "Total Laporan" },
          { icon: Clock, color: "text-coral", bg: "bg-coral/15", num: newCount, label: "Laporan Baru" },
          { icon: Users, color: "text-sage", bg: "bg-sage/15", num: uniqueOffenders, label: "Pelaku Teridentifikasi" },
        ].map(({ icon: Icon, color, bg, num, label }) => (
          <div key={label} className="bg-white rounded-2xl shadow-card p-6">
            <div className={`w-14 h-14 rounded-full ${bg} flex items-center justify-center mb-4`}>
              <Icon className={`w-7 h-7 ${color}`} />
            </div>
            <p className="font-playfair text-4xl md:text-5xl font-bold text-navy">{num}</p>
            <p className="text-sm text-gray mt-1">{label}</p>
          </div>
        ))}
      </div>

      <h3 className="font-playfair text-xl font-bold text-navy mb-4">Laporan Terbaru</h3>
      {reports.length === 0 ? (
        <p className="text-gray italic text-center py-12">Belum ada laporan. Laporan dari siswa akan muncul di sini.</p>
      ) : (
        <div className="bg-white rounded-2xl shadow-card overflow-hidden overflow-x-auto">
          <table className="w-full min-w-[600px]">
            <thead>
              <tr className="bg-navy text-white">
                <th className="text-left px-5 py-3.5 text-xs font-semibold uppercase tracking-wider">ID</th>
                <th className="text-left px-5 py-3.5 text-xs font-semibold uppercase tracking-wider">Tanggal</th>
                <th className="text-left px-5 py-3.5 text-xs font-semibold uppercase tracking-wider">Pelaku</th>
                <th className="text-left px-5 py-3.5 text-xs font-semibold uppercase tracking-wider">Jenis</th>
                <th className="text-left px-5 py-3.5 text-xs font-semibold uppercase tracking-wider">Status</th>
                <th className="text-left px-5 py-3.5 text-xs font-semibold uppercase tracking-wider">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {reports.slice(0, 10).map((r, i) => (
                <tr key={r.id} className={`border-b border-light-gray hover:bg-[#edf2f7] transition-colors ${i % 2 === 1 ? "bg-[#f7fafc]" : ""}`}>
                  <td className="px-5 py-3 text-sm text-charcoal">#{String(r.id).padStart(3, "0")}</td>
                  <td className="px-5 py-3 text-sm text-charcoal">{new Date(r.createdAt).toLocaleDateString("id-ID")}</td>
                  <td className="px-5 py-3 text-sm text-charcoal">{r.pelaku}<br/><span className="text-xs text-gray">{r.kelasPelaku}</span></td>
                  <td className="px-5 py-3"><JenisBadge jenis={r.jenis} /></td>
                  <td className="px-5 py-3"><StatusBadge status={r.status} /></td>
                  <td className="px-5 py-3">
                    <button onClick={() => onViewDetail(r)} className="text-sm text-sky hover:underline">Lihat Detail</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

/* ============================================
   LAPORAN MASUK TAB
   ============================================ */
function LaporanMasukTab({ reports, onViewDetail }: { reports: Report[]; onViewDetail: (r: Report) => void }) {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [jenisFilter, setJenisFilter] = useState("All");
  const [sortOrder, setSortOrder] = useState<"newest" | "oldest">("newest");

  const filtered = useMemo(() => {
    let result = [...reports];
    if (search) {
      const q = search.toLowerCase();
      result = result.filter((r) =>
        r.pelaku.toLowerCase().includes(q) ||
        r.lokasi.toLowerCase().includes(q) ||
        r.deskripsi.toLowerCase().includes(q)
      );
    }
    if (statusFilter !== "All") result = result.filter((r) => r.status === statusFilter);
    if (jenisFilter !== "All") result = result.filter((r) => r.jenis.includes(jenisFilter));
    result.sort((a, b) => {
      const ta = new Date(a.createdAt).getTime();
      const tb = new Date(b.createdAt).getTime();
      return sortOrder === "newest" ? tb - ta : ta - tb;
    });
    return result;
  }, [reports, search, statusFilter, jenisFilter, sortOrder]);

  return (
    <div className="p-6 md:p-8">
      <div className="flex flex-wrap gap-3 mb-6">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Cari laporan..."
            className="w-full border border-light-gray rounded-xl pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:border-sky"
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="border border-light-gray rounded-xl px-4 py-2.5 text-sm bg-white focus:outline-none focus:border-sky"
        >
          <option value="All">Semua Status</option>
          <option value="Baru">Baru</option>
          <option value="Diproses">Diproses</option>
          <option value="Selesai">Selesai</option>
        </select>
        <select
          value={jenisFilter}
          onChange={(e) => setJenisFilter(e.target.value)}
          className="border border-light-gray rounded-xl px-4 py-2.5 text-sm bg-white focus:outline-none focus:border-sky"
        >
          <option value="All">Semua Jenis</option>
          <option value="Verbal">Verbal</option>
          <option value="Fisik">Fisik</option>
          <option value="Sosial">Sosial</option>
          <option value="Cyber">Cyberbullying</option>
          <option value="Seksual">Seksual</option>
        </select>
        <select
          value={sortOrder}
          onChange={(e) => setSortOrder(e.target.value as "newest" | "oldest")}
          className="border border-light-gray rounded-xl px-4 py-2.5 text-sm bg-white focus:outline-none focus:border-sky"
        >
          <option value="newest">Terbaru</option>
          <option value="oldest">Terlama</option>
        </select>
      </div>

      {filtered.length === 0 ? (
        <p className="text-gray italic text-center py-12">Tidak ada laporan yang sesuai.</p>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filtered.map((r) => (
            <ReportCard key={r.id} report={r} onClick={() => onViewDetail(r)} />
          ))}
        </div>
      )}
    </div>
  );
}

/* ============================================
   PAPAN PELAKU TAB
   ============================================ */
function PapanPelakuTab({ reports }: { reports: Report[] }) {
  const offenders = useMemo(() => getOffenderStats(), [reports]);

  return (
    <div className="p-6 md:p-8">
      <div className="bg-white rounded-2xl shadow-card p-6 md:p-8 mb-8">
        <h3 className="font-playfair text-xl font-bold text-navy">Papan Pelaku Perundungan</h3>
        <p className="text-sm text-gray mt-1">Berdasarkan laporan yang masuk</p>

        <div className="mt-6">
          <p className="font-playfair text-5xl font-bold text-coral">{reports.length}</p>
          <p className="text-sm text-gray">Total Laporan</p>
        </div>

        {offenders.length === 0 ? (
          <p className="text-gray italic text-center py-12 mt-6">
            Belum ada data pelaku. Laporan dari siswa akan muncul di sini.
          </p>
        ) : (
          <div className="mt-6 space-y-4">
            {offenders.map((o, i) => (
              <div key={`${o.name}|${o.kelas}`} className="flex items-center gap-4 p-4 bg-[#f7fafc] rounded-xl">
                <div className="w-8 h-8 rounded-full bg-navy text-white flex items-center justify-center text-sm font-bold flex-shrink-0">
                  {i + 1}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-charcoal">{o.name}</p>
                  <p className="text-xs text-gray">{o.kelas}</p>
                </div>
                <span className="bg-peach text-[#c05621] text-xs font-medium rounded-full px-3 py-1 flex-shrink-0">
                  {o.count} kasus
                </span>
                <div className="flex gap-1 flex-wrap flex-shrink-0">
                  {o.jenisSet.map((j) => (
                    <span key={j} className="text-[10px] bg-light-gray text-gray rounded px-2 py-0.5">
                      {j.split(" (")[0]}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <h3 className="font-playfair text-xl font-bold text-navy mb-4">Detail Pelaku</h3>
      {offenders.length === 0 ? (
        <p className="text-gray italic text-center py-8">Belum ada data pelaku.</p>
      ) : (
        <div className="bg-white rounded-2xl shadow-card overflow-hidden overflow-x-auto">
          <table className="w-full min-w-[700px]">
            <thead>
              <tr className="bg-navy text-white">
                <th className="text-left px-5 py-3.5 text-xs font-semibold uppercase tracking-wider w-12">No</th>
                <th className="text-left px-5 py-3.5 text-xs font-semibold uppercase tracking-wider">Nama Pelaku</th>
                <th className="text-left px-5 py-3.5 text-xs font-semibold uppercase tracking-wider">Kelas</th>
                <th className="text-center px-5 py-3.5 text-xs font-semibold uppercase tracking-wider">Jumlah Kasus</th>
                <th className="text-left px-5 py-3.5 text-xs font-semibold uppercase tracking-wider">Jenis Perundungan</th>
                <th className="text-left px-5 py-3.5 text-xs font-semibold uppercase tracking-wider">Lokasi Favorit</th>
                <th className="text-left px-5 py-3.5 text-xs font-semibold uppercase tracking-wider">Terakhir Melapor</th>
              </tr>
            </thead>
            <tbody>
              {offenders.map((o, i) => (
                <tr key={`${o.name}|${o.kelas}`} className={`border-b border-light-gray hover:bg-[#edf2f7] ${i % 2 === 1 ? "bg-[#f7fafc]" : ""}`}>
                  <td className="px-5 py-3.5 text-sm text-charcoal font-medium">{i + 1}</td>
                  <td className="px-5 py-3.5 text-sm font-semibold text-charcoal">{o.name}</td>
                  <td className="px-5 py-3.5 text-sm text-charcoal">{o.kelas}</td>
                  <td className="px-5 py-3.5 text-sm font-bold text-coral text-center">{o.count}</td>
                  <td className="px-5 py-3.5">
                    <div className="flex gap-1 flex-wrap">
                      {o.jenisSet.map((j) => <JenisBadge key={j} jenis={j} />)}
                    </div>
                  </td>
                  <td className="px-5 py-3.5 text-sm text-charcoal">{o.favoriteLocation}</td>
                  <td className="px-5 py-3.5 text-sm text-charcoal">{new Date(o.lastReportDate).toLocaleDateString("id-ID")}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

/* ============================================
   MAIN DASHBOARD
   ============================================ */
function Dashboard() {
  const [activeTab, setActiveTab] = useState<Tab>("overview");
  const [reports, setReports] = useState<Report[]>([]);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [selectedReport, setSelectedReport] = useState<Report | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    setReports(getReports());
  }, []);

  const refresh = () => setReports(getReports());

  const handleLogout = () => {
    doLogout();
    navigate("/guru");
    window.location.reload();
  };

  const handleStatusChange = (id: number, status: Report["status"]) => {
    updateReportStatus(id, status);
    refresh();
  };

  const navItems: { key: Tab; label: string; icon: typeof LayoutDashboard }[] = [
    { key: "overview", label: "Dashboard", icon: LayoutDashboard },
    { key: "laporan", label: "Laporan Masuk", icon: FileText },
    { key: "pelaku", label: "Papan Pelaku", icon: Users },
  ];

  return (
    <div className="min-h-screen bg-[#f0f4f8] flex">
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-[200] lg:hidden">
          <div className="absolute inset-0 bg-black/40" onClick={() => setSidebarOpen(false)} />
          <div className="absolute left-0 top-0 bottom-0 w-[260px] bg-navy p-6 flex flex-col">
            <button onClick={() => setSidebarOpen(false)} className="text-white mb-8 self-end">
              <X className="w-6 h-6" />
            </button>
            <div className="flex flex-col gap-2">
              {navItems.map(({ key, label, icon: Icon }) => (
                <button
                  key={key}
                  onClick={() => { setActiveTab(key); setSidebarOpen(false); }}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors ${
                    activeTab === key
                      ? "bg-white/[0.12] text-white"
                      : "text-white/60 hover:text-white hover:bg-white/[0.06]"
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  {label}
                  {key === "laporan" && (
                    <span className="ml-auto bg-coral text-white text-[10px] font-bold rounded-full min-w-[20px] h-5 flex items-center justify-center px-1.5">
                      {reports.length}
                    </span>
                  )}
                </button>
              ))}
            </div>
            <div className="mt-auto">
              <button onClick={handleLogout} className="text-white/50 text-xs hover:text-coral transition-colors flex items-center gap-1">
                <LogOut className="w-4 h-4" /> Keluar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Desktop sidebar */}
      <aside className="hidden lg:flex w-[220px] bg-navy flex-col flex-shrink-0 py-6 fixed h-full">
        <div className="px-6 flex items-center gap-2">
          <Shield className="w-7 h-7 text-white" />
          <span className="text-white font-bold text-[15px] tracking-wider">SHTP</span>
        </div>
        <div className="border-b border-white/15 mx-6 my-5" />
        <div className="flex flex-col gap-1 px-3 flex-1">
          {navItems.map(({ key, label, icon: Icon }) => (
            <button
              key={key}
              onClick={() => setActiveTab(key)}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors ${
                activeTab === key
                  ? "bg-white/[0.12] text-white"
                  : "text-white/60 hover:text-white hover:bg-white/[0.06]"
              }`}
            >
              <Icon className="w-5 h-5" />
              <span className="flex-1 text-left">{label}</span>
              {key === "laporan" && (
                <span className="bg-coral text-white text-[10px] font-bold rounded-full min-w-[20px] h-5 flex items-center justify-center px-1.5">
                  {reports.length}
                </span>
              )}
            </button>
          ))}
        </div>
        <div className="px-6 mt-auto">
          <div className="bg-white/[0.08] rounded-xl p-4">
            <div className="flex items-center gap-2 mb-2">
              <UserCircle className="w-8 h-8 text-white/60" />
              <span className="text-white text-sm font-medium">rifqi adliansyah</span>
            </div>
            <span className="inline-block bg-white/[0.15] text-white text-[10px] font-medium rounded-full px-2.5 py-0.5">
              Guru
            </span>
          </div>
          <button onClick={handleLogout} className="text-white/50 text-xs mt-3 hover:text-coral transition-colors flex items-center gap-1">
            <LogOut className="w-3.5 h-3.5" /> Keluar
          </button>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 lg:ml-[220px]">
        {/* Top bar */}
        <div className="h-16 bg-white shadow-nav px-6 md:px-8 flex items-center justify-between flex-shrink-0">
          <div className="flex items-center gap-3">
            <button onClick={() => setSidebarOpen(true)} className="lg:hidden text-navy">
              <Menu className="w-6 h-6" />
            </button>
            <h4 className="font-semibold text-navy text-lg">
              {activeTab === "overview" && "Dashboard"}
              {activeTab === "laporan" && "Laporan Masuk"}
              {activeTab === "pelaku" && "Papan Pelaku"}
            </h4>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray hidden sm:block">
              {new Date().toLocaleDateString("id-ID", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}
            </span>
            <div className="relative">
              <Bell className="w-6 h-6 text-gray" />
              {reports.some((r) => r.status === "Baru") && (
                <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 bg-coral rounded-full" />
              )}
            </div>
          </div>
        </div>

        {/* Tab content */}
        <div className="overflow-y-auto" style={{ height: "calc(100vh - 64px)" }}>
          {activeTab === "overview" && (
            <DashboardOverview reports={reports} onViewDetail={setSelectedReport} />
          )}
          {activeTab === "laporan" && (
            <LaporanMasukTab reports={reports} onViewDetail={setSelectedReport} />
          )}
          {activeTab === "pelaku" && <PapanPelakuTab reports={reports} />}
        </div>
      </div>

      {/* Detail modal */}
      {selectedReport && (
        <ReportDetailModal
          report={selectedReport}
          onClose={() => setSelectedReport(null)}
          onStatusChange={(s) => handleStatusChange(selectedReport.id, s)}
        />
      )}
    </div>
  );
}

/* ============================================
   GURU PAGE EXPORT
   ============================================ */
export default function Guru() {
  const [auth, setAuth] = useState(isAuthenticated());

  if (!auth) {
    return <LoginScreen onSuccess={() => setAuth(true)} />;
  }

  return <Dashboard />;
}
