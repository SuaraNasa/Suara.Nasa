import type { Report } from "@/types";

const STORAGE_KEY = "shtp-reports";
const AUTH_KEY = "shtp-auth";
const TEACHERS_KEY = "shtp-teachers";
const CONTENT_KEY = "shtp-content";

export interface SiteContent {
  poster: string | null; // base64 image
  ikrar: string;
  perduptar: { no: string; ket: string; sanksi: string }[];
  contact: {
    address: string;
    phone: string;
    email: string;
  };
}

const defaultContent: SiteContent = {
  poster: null,
  ikrar: "",
  perduptar: [],
  contact: {
    address: "",
    phone: "",
    email: "",
  },
};

// ============ CLASS OPTIONS ============
export const kelasOptions = [
  "X1", "X2", "X3", "X4", "X5", "X6", "X7", "X8",
  "XI1", "XI2", "XI3", "XI4", "XI5", "XI6", "XI7", "XI8",
  "XII1", "XII2", "XII3", "XII4", "XII5", "XII6", "XII7", "XII8",
];

// ============ REPORTS ============
const sampleReports: Report[] = [
  {
    id: 1,
    pelaku: "Ahmad Fauzi",
    kelasPelaku: "XI2",
    korban: "Anonim",
    kelasKorban: "XI1",
    lokasi: "Halaman Belakang Sekolah",
    waktu: "2025-04-18T15:30:00",
    jenis: "Verbal (ejekan, hinaan, ancaman)",
    deskripsi:
      "Korban sering dipanggil dengan nama julukan yang menghina di depan teman-teman kelasnya. Pelaku mengatakan korban tidak pantas bergaul dengan anak-anak kelas XI. Kejadian ini sudah berlangsung selama 2 minggu terakhir setiap pulang sekolah.",
    bukti: null,
    status: "Baru",
    createdAt: "2025-04-18T16:00:00",
  },
  {
    id: 2,
    pelaku: "Dewi Anggraini",
    kelasPelaku: "X3",
    korban: "Rina Susanti",
    kelasKorban: "X3",
    lokasi: "Kantin Sekolah",
    waktu: "2025-04-19T12:15:00",
    jenis: "Sosial (pengucilan, penyebaran isu)",
    deskripsi:
      "Pelaku menyebarkan isu buruk tentang korban di grup WhatsApp kelas. Korban dikucilkan oleh teman-temannya dan tidak diajak makan bersama di kantin. Pelaku juga memposting foto korban dengan caption menjelekkan di Instagram story.",
    bukti: "screenshot_grup_wa.jpg",
    status: "Diproses",
    createdAt: "2025-04-19T13:00:00",
  },
  {
    id: 3,
    pelaku: "Ahmad Fauzi",
    kelasPelaku: "XI2",
    korban: "Anonim",
    kelasKorban: "XI4",
    lokasi: "Toilet Lantai 2",
    waktu: "2025-04-17T09:45:00",
    jenis: "Fisik (kekeratan, penyerangan)",
    deskripsi:
      "Pelaku mendorong korban di koridor toilet hingga korban terjatuh. Pelaku mengancam akan memukul korban jika melapor ke guru. Kejadian terjadi saat jam istirahat kedua.",
    bukti: null,
    status: "Baru",
    createdAt: "2025-04-17T10:30:00",
  },
];

export function seedReports(): void {
  const existing = localStorage.getItem(STORAGE_KEY);
  if (!existing) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(sampleReports));
  }
}

export function getReports(): Report[] {
  seedReports();
  const data = localStorage.getItem(STORAGE_KEY);
  return data ? JSON.parse(data) : [];
}

export function addReport(report: Omit<Report, "id" | "status" | "createdAt">): Report {
  const reports = getReports();
  const newReport: Report = {
    ...report,
    id: reports.length > 0 ? Math.max(...reports.map((r) => r.id)) + 1 : 1,
    status: "Baru",
    createdAt: new Date().toISOString(),
  };
  reports.unshift(newReport);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(reports));
  return newReport;
}

export function updateReportStatus(id: number, status: Report["status"]): void {
  const reports = getReports();
  const idx = reports.findIndex((r) => r.id === id);
  if (idx !== -1) {
    reports[idx].status = status;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(reports));
  }
}

export function deleteReport(id: number): void {
  const reports = getReports().filter((r) => r.id !== id);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(reports));
}

export function getOffenderStats() {
  const reports = getReports();
  const grouped = new Map<string, { name: string; kelas: string; reports: Report[] }>();

  reports.forEach((r) => {
    const key = `${r.pelaku}|${r.kelasPelaku}`;
    if (!grouped.has(key)) {
      grouped.set(key, { name: r.pelaku, kelas: r.kelasPelaku, reports: [] });
    }
    grouped.get(key)!.reports.push(r);
  });

  const stats = Array.from(grouped.values())
    .map((g) => {
      const jenisSet = [...new Set(g.reports.map((r) => r.jenis))];
      const locations = g.reports.map((r) => r.lokasi);
      const locCount = new Map<string, number>();
      locations.forEach((l) => locCount.set(l, (locCount.get(l) || 0) + 1));
      let favoriteLocation = locations[0] || "";
      let maxCount = 0;
      locCount.forEach((count, loc) => {
        if (count > maxCount) {
          maxCount = count;
          favoriteLocation = loc;
        }
      });
      const lastReportDate = g.reports.sort(
        (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      )[0].createdAt;

      return {
        name: g.name,
        kelas: g.kelas,
        count: g.reports.length,
        jenisSet,
        locations,
        favoriteLocation,
        lastReportDate,
      };
    })
    .sort((a, b) => b.count - a.count);

  return stats;
}

// ============ AUTH ============
export function isAuthenticated(): boolean {
  return localStorage.getItem(AUTH_KEY) === "true";
}

export function login(): void {
  localStorage.setItem(AUTH_KEY, "true");
}

export function logout(): void {
  localStorage.removeItem(AUTH_KEY);
}

// ============ TEACHERS ============
export function getTeachers(): string[] {
  const data = localStorage.getItem(TEACHERS_KEY);
  if (!data) {
    const defaultTeachers = ["rifqi adliansyah"];
    localStorage.setItem(TEACHERS_KEY, JSON.stringify(defaultTeachers));
    return defaultTeachers;
  }
  return JSON.parse(data);
}

export function addTeacher(name: string): void {
  const teachers = getTeachers();
  if (!teachers.includes(name.toLowerCase())) {
    teachers.push(name.toLowerCase());
    localStorage.setItem(TEACHERS_KEY, JSON.stringify(teachers));
  }
}

export function removeTeacher(name: string): void {
  const teachers = getTeachers().filter((t) => t !== name.toLowerCase());
  localStorage.setItem(TEACHERS_KEY, JSON.stringify(teachers));
}

export function validateTeacher(name: string, password: string): boolean {
  const teachers = getTeachers();
  return teachers.includes(name.toLowerCase().trim()) && password === name.toLowerCase().trim();
}

// ============ SITE CONTENT ============
export function getContent(): SiteContent {
  const data = localStorage.getItem(CONTENT_KEY);
  if (!data) {
    localStorage.setItem(CONTENT_KEY, JSON.stringify(defaultContent));
    return defaultContent;
  }
  return { ...defaultContent, ...JSON.parse(data) };
}

export function saveContent(content: Partial<SiteContent>): void {
  const current = getContent();
  const updated = { ...current, ...content };
  localStorage.setItem(CONTENT_KEY, JSON.stringify(updated));
}
