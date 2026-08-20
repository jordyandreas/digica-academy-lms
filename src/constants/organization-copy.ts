export type OrganizationCopy = {
  placeholder: string;
  helper: string;
};

export type OrganizationCopyLocale = "en" | "id";

const defaults: Record<OrganizationCopyLocale, OrganizationCopy> = {
  en: {
    placeholder: "Enter your company, school, university, or organization",
    helper: "Ex: Google, Universitas Indonesia",
  },
  id: {
    placeholder: "Masukkan nama perusahaan, sekolah, atau organisasi",
    helper: "Contoh: Google, Universitas Indonesia",
  },
};

const copyByOccupation: Record<
  OrganizationCopyLocale,
  Record<string, OrganizationCopy>
> = {
  en: {
    mahasiswa: {
      placeholder: "Enter your school or university name",
      helper: "Ex: Universitas Indonesia, Universitas Bina Nusantara",
    },
    fresh_graduate: {
      placeholder: "Enter your last school or university",
      helper: "Ex: Universitas Indonesia, Universitas Bina Nusantara",
    },
    karyawan: {
      placeholder: "Enter your company name",
      helper: "Ex: Google, Tokopedia, PT Telkom Indonesia",
    },
    freelance: {
      placeholder: "Enter your business or personal brand",
      helper: "Ex: Jasa Desain, Self-Employed",
    },
    job_seeker: {
      placeholder: "Enter your last company or school",
      helper: "Ex: PT ABC, Universitas Gadjah Mada",
    },
    other: {
      placeholder: "Enter your profession or organization",
      helper: "Ex: Online Shop, Learning Community",
    },
  },
  id: {
    mahasiswa: {
      placeholder: "Masukkan nama sekolah atau universitas",
      helper: "Contoh: Universitas Indonesia, Universitas Bina Nusantara",
    },
    fresh_graduate: {
      placeholder: "Masukkan sekolah atau universitas terakhir",
      helper: "Contoh: Universitas Indonesia, Universitas Bina Nusantara",
    },
    karyawan: {
      placeholder: "Masukkan nama perusahaan",
      helper: "Contoh: Google, Tokopedia, PT Telkom Indonesia",
    },
    freelance: {
      placeholder: "Masukkan nama bisnis atau personal brand",
      helper: "Contoh: Jasa Desain, Self-Employed",
    },
    job_seeker: {
      placeholder: "Masukkan perusahaan atau sekolah terakhir",
      helper: "Contoh: PT ABC, Universitas Gadjah Mada",
    },
    other: {
      placeholder: "Masukkan nama pekerjaan atau organisasi",
      helper: "Contoh: Online Shop, Komunitas Belajar",
    },
  },
};

export function getOrganizationCopy(
  occupation: string,
  locale: OrganizationCopyLocale,
): OrganizationCopy {
  return copyByOccupation[locale][occupation] ?? defaults[locale];
}
