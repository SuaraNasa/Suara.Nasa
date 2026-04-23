export interface Report {
  id: number;
  pelaku: string;
  kelasPelaku: string;
  korban: string;
  kelasKorban: string;
  lokasi: string;
  waktu: string;
  jenis: string;
  deskripsi: string;
  bukti: string | null;
  status: "Baru" | "Diproses" | "Selesai";
  createdAt: string;
}

export interface OffenderStats {
  name: string;
  kelas: string;
  count: number;
  jenisSet: string[];
  locations: string[];
  favoriteLocation: string;
  lastReportDate: string;
}
