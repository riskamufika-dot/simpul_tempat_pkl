/* eslint-disable @typescript-eslint/no-explicit-any */
import { TempatPKL } from "@/types";

const STRAPI_URL =
  process.env.NEXT_PUBLIC_STRAPI_URL ?? "https://simpul-production.up.railway.app";

const TIMEOUT_MS = 15000;

export interface AppInfoData {
  title?: string;
  content?: string;
  logo?: {
    url?: string;
  };
}

function fullUrl(path?: string | null) {
  if (!path) return null;
  const url = path.startsWith("http") ? path : `${STRAPI_URL}${path}`;
  return url.includes("res.cloudinary.com")
    ? url.replace("/upload/", "/upload/w_600,q_auto,f_auto/")
    : url;
}

function fetchTimeout(url: string) {
  return fetch(url, {
    next: { revalidate: 60 },
    signal: AbortSignal.timeout(TIMEOUT_MS),
  });
}

async function fetchAllPages(endpoint: string): Promise<any[]> {
  const PAGE_SIZE = 100;
  const sep = endpoint.includes("?") ? "&" : "?";
  const urlFor = (p: number) =>
    `${STRAPI_URL}${endpoint}${sep}pagination[page]=${p}&pagination[pageSize]=${PAGE_SIZE}`;

  const res = await fetchTimeout(urlFor(1));
  if (!res.ok) throw new Error(`Server menjawab ${res.status}`);
  const json = await res.json();
  const all: any[] = [...(json.data || [])];

  const pageCount = Math.min(json.meta?.pagination?.pageCount ?? 1, 10);
  if (pageCount > 1) {
    const rest = await Promise.all(
      Array.from({ length: pageCount - 1 }, (_, i) =>
        fetchTimeout(urlFor(i + 2))
          .then((r) => (r.ok ? r.json() : { data: [] }))
          .then((j) => j.data || [])
          .catch(() => [])
      )
    );
    rest.forEach((items) => all.push(...items));
  }
  return all;
}

async function getList(endpoint: string, label: string): Promise<any[]> {
  try {
    const res = await fetchTimeout(`${STRAPI_URL}${endpoint}`);
    if (!res.ok) return [];
    const json = await res.json();
    return json.data || [];
  } catch (err) {
    console.error(`Gagal mengambil ${label}:`, err);
    return [];
  }
}

// 1. Ambil Hero Slider aktif utuh/mentah (Dipakai oleh Beranda.tsx)
export function getHeroSliders() {
  return getList("/api/hero-sliders?populate=*", "hero sliders");
}

// 1b. Ambil Hero Slider KHUSUS ENTRY 2 (Dipakai oleh Daftar Tempat)
export async function getHeroSlidersDaftarTempat(): Promise<string[]> {
  try {
    const rawList = await getList("/api/hero-sliders?populate=*", "hero sliders");
    if (!rawList || rawList.length === 0) return [];

    const entry2 = rawList[1] || rawList[0];

    const rawImgs =
      entry2.images ||
      entry2.gambar ||
      entry2.attributes?.images?.data ||
      entry2.attributes?.gambar?.data ||
      entry2.attributes?.images ||
      entry2.attributes?.gambar ||
      [];

    const resultUrls: string[] = [];

    if (Array.isArray(rawImgs)) {
      rawImgs.forEach((img: any) => {
        const u = img.url || img.attributes?.url;
        const parsed = fullUrl(u);
        if (parsed) resultUrls.push(parsed);
      });
    } else if (rawImgs && typeof rawImgs === "object") {
      const u = rawImgs.url || rawImgs.attributes?.url;
      const parsed = fullUrl(u);
      if (parsed) resultUrls.push(parsed);
    }

    return resultUrls;
  } catch (err) {
    console.error("Gagal parse hero slider entry 2:", err);
    return [];
  }
}

// 2. Ambil Daftar Jurusan (Objek lengkap Strapi: dipakai oleh KategoriJurusan.tsx dan DaftarTempat)
export function getMajors(): Promise<any[]> {
  return getList("/api/majors?populate=*", "jurusan");
}

// 3. Ambil Master Bidang Perusahaan (Objek lengkap Strapi)
export function getBusinessFields(): Promise<any[]> {
  return getList("/api/business-fields?populate=*", "business fields");
}

// 4. Ambil Testimoni
export function getTestimonials() {
  return getList(
    "/api/testimonials?filters[is_featured][$eq]=true&populate=*",
    "testimoni"
  );
}

// 5. Ambil Info Aplikasi
export async function getAppInfo(): Promise<AppInfoData | null> {
  try {
    const res = await fetchTimeout(`${STRAPI_URL}/api/app-info?populate=*`);
    if (!res.ok) return null;
    const json = await res.json();
    return json.data || null;
  } catch (err) {
    console.error("Gagal mengambil info aplikasi:", err);
    return null;
  }
}

function parseList(raw: any): string[] {
  if (!raw) return [];

  if (Array.isArray(raw)) {
    return raw
      .flatMap((item) => {
        if (typeof item === "string") {
          const trimmed = item.trim();
          if (trimmed.startsWith("[") && trimmed.endsWith("]")) {
            try {
              const parsed = JSON.parse(trimmed);
              if (Array.isArray(parsed)) return parsed;
            } catch {}
          }
          return item.split(/\r?\n|;/);
        }
        return String(item);
      })
      .map((s: string) =>
        s
          .trim()
          .replace(/^[-•*]\s*/, "")
          .replace(/^\d+[.)]\s*/, "")
          .replace(/^["'](.*)["']$/, "$1")
          .trim()
      )
      .filter((s) => s.length > 0 && s !== "[" && s !== "]");
  }

  if (typeof raw === "string" && raw.trim()) {
    const str = raw.trim();
    if (str.startsWith("[") && str.endsWith("]")) {
      try {
        const parsed = JSON.parse(str);
        if (Array.isArray(parsed)) return parseList(parsed);
      } catch {}
    }
    return str
      .split(/\r?\n|;/)
      .map((s) =>
        s
          .trim()
          .replace(/^[-•*]\s*/, "")
          .replace(/^\d+[.)]\s*/, "")
          .replace(/^["'](.*)["']$/, "$1")
          .trim()
      )
      .filter(Boolean);
  }

  return [];
}

// 6. Ambil Tempat PKL dengan penggabungan seluruh data
export async function getTempatPKL(): Promise<TempatPKL[]> {
  try {
    const [companiesData, compRolesData, masterRolesData] = await Promise.all([
      fetchAllPages("/api/companies?populate=*"),
      fetchAllPages("/api/company-roles?populate=*"),
      fetchAllPages("/api/roles?populate=*"),
    ]);

    if (companiesData.length === 0) return [];

    const roleMasterMap = new Map<string, { title: string; tasks: string[] }>();
    masterRolesData.forEach((r: any) => {
      const title = r.title || r.name;
      const tasks = parseList(r.description || r.responsibilities || r.tasks);
      if (title) {
        const val = { title, tasks };
        if (r.id) roleMasterMap.set(String(r.id), val);
        if (r.documentId) roleMasterMap.set(String(r.documentId), val);
      }
    });

    const companyRoleDetailMap = new Map<string, { role: string; tasks: string[] }>();
    const companyToRolesMap = new Map<string, { role: string; tasks: string[] }[]>();

    compRolesData.forEach((cr: any) => {
      let roleTitle =
        cr.role?.title ||
        cr.role?.name ||
        cr.title ||
        cr.name ||
        cr.role_name ||
        "";

      let tasks = parseList(
        cr.description ||
          cr.responsibilities ||
          cr.tasks ||
          cr.role?.description ||
          cr.role?.responsibilities
      );

      const refId1 = String(cr.role?.documentId || "");
      const refId2 = String(cr.role?.id || "");
      const refIdRaw =
        typeof cr.role === "string" || typeof cr.role === "number"
          ? String(cr.role)
          : "";

      const masterEntry =
        (refId1 && roleMasterMap.get(refId1)) ||
        (refId2 && roleMasterMap.get(refId2)) ||
        (refIdRaw && roleMasterMap.get(refIdRaw));

      if (masterEntry) {
        if (!roleTitle) roleTitle = masterEntry.title;
        if (tasks.length === 0) tasks = masterEntry.tasks;
      }

      const val = { role: roleTitle, tasks };

      if (cr.id) companyRoleDetailMap.set(String(cr.id), val);
      if (cr.documentId) companyRoleDetailMap.set(String(cr.documentId), val);

      if (cr.company && roleTitle) {
        const compRef = String(cr.company.documentId || cr.company.id || cr.company);
        const existing = companyToRolesMap.get(compRef) || [];
        existing.push(val);
        companyToRolesMap.set(compRef, existing);
      }
    });

    return companiesData.map((item: any): TempatPKL => {
      const imagesList: string[] = [];
      if (Array.isArray(item.images)) {
        item.images.forEach((img: any) => {
          const u = fullUrl(img?.url);
          if (u) imagesList.push(u);
        });
      } else if (item.images?.url) {
        const u = fullUrl(item.images.url);
        if (u) imagesList.push(u);
      }
      const firstImage = imagesList[0] || null;

      const jamKerjaList = Array.isArray(item.working_hours)
        ? item.working_hours.map((w: any) => {
            if (typeof w === "string") return w;
            const text = w.working_hours_text || w.hours || w.title || "";
            const name = w.shift_name || "";
            if (name && text) {
              return text.toLowerCase().includes(name.toLowerCase())
                ? text
                : `${name}: ${text}`;
            }
            return text || name || "-";
          })
        : [];

      const primaryMajor =
        Array.isArray(item.majors) && item.majors.length > 0 ? item.majors[0] : null;
      const jurusanNama = primaryMajor?.name ?? primaryMajor?.title ?? "";
      const jurusanKode = primaryMajor?.code ?? primaryMajor?.abbreviation ?? "";
      const jurusanLabel = jurusanKode ? `${jurusanNama} (${jurusanKode})` : jurusanNama;

      const bfRaw = item.business_fields || item.business_field;
      const bfItem = Array.isArray(bfRaw) ? bfRaw[0] : bfRaw;
      const bidangNama =
        bfItem?.name || bfItem?.title || (typeof bfItem === "string" ? bfItem : "");

      const companyTasks = parseList(
        item.responsibilities || item.tasks || item.tugas || item.description
      );

      const detailedRoles: { role: string; tasks: string[] }[] = [];
      const roleNamesSet = new Set<string>();

      const addRole = (role: string, tasks: string[]) => {
        if (!role || /^[a-z0-9]{20,}$/i.test(role) || roleNamesSet.has(role)) return;
        roleNamesSet.add(role);
        detailedRoles.push({ role, tasks });
      };

      const rawRoles = [
        ...(Array.isArray(item.roles) ? item.roles : []),
        ...(Array.isArray(item.company_roles) ? item.company_roles : []),
      ];

      rawRoles.forEach((entry: any) => {
        const keyDocId = String(entry?.documentId || "");
        const keyId = String(entry?.id || "");
        const keyRaw =
          typeof entry === "string" || typeof entry === "number" ? String(entry) : "";

        const detail =
          (keyDocId && companyRoleDetailMap.get(keyDocId)) ||
          (keyId && companyRoleDetailMap.get(keyId)) ||
          (keyRaw && companyRoleDetailMap.get(keyRaw));

        if (detail && detail.role) {
          addRole(detail.role, detail.tasks);
          return;
        }

        const masterDetail =
          (keyDocId && roleMasterMap.get(keyDocId)) ||
          (keyId && roleMasterMap.get(keyId)) ||
          (keyRaw && roleMasterMap.get(keyRaw));

        if (masterDetail) {
          const directTasks = parseList(
            entry?.description || entry?.responsibilities || entry?.tasks
          );
          addRole(
            masterDetail.title,
            directTasks.length > 0 ? directTasks : masterDetail.tasks
          );
          return;
        }

        if (typeof entry === "object" && entry !== null) {
          const embeddedTitle =
            entry.role?.title ||
            entry.role?.name ||
            entry.title ||
            entry.name ||
            entry.role_name ||
            "";
          if (embeddedTitle) {
            const tasks = parseList(
              entry.description ||
                entry.responsibilities ||
                entry.tasks ||
                entry.role?.description ||
                entry.role?.responsibilities
            );
            addRole(embeddedTitle, tasks);
          }
        }
      });

      const cDocId = String(item.documentId || "");
      const cId = String(item.id || "");
      const linkedRoles =
        (cDocId && companyToRolesMap.get(cDocId)) ||
        (cId && companyToRolesMap.get(cId)) ||
        [];

      linkedRoles.forEach((lr) => addRole(lr.role, lr.tasks));

      if (detailedRoles.length === 0) {
        const fallbackTitle = jurusanKode
          ? `Staff (${jurusanKode})`
          : jurusanNama
          ? `Staff ${jurusanNama}`
          : bidangNama
          ? `Staff ${bidangNama}`
          : "Staff PKL";

        detailedRoles.push({
          role: fallbackTitle,
          tasks:
            companyTasks.length > 0
              ? companyTasks
              : [
                  "Membantu administrasi dan pengarsipan berkas di unit kerja",
                  "Membantu operasional harian sesuai arahan pembimbing lapangan",
                  "Mempelajari sistem tata kelola dan alur kerja instansi",
                ],
        });
      }

      const rawTestimonials = Array.isArray(item.testimonials) ? item.testimonials : [];
      const selectedTestimonial =
        rawTestimonials.find((t: any) => t.is_featured === true) ||
        rawTestimonials[0] ||
        null;

      return {
        id: item.id,
        // @ts-ignore
        documentId: item.documentId,
        nama: item.name ?? "",
        jurusan: jurusanLabel,
        singkatanJurusan: jurusanKode,
        deskripsi: item.description ?? "",
        alamat: item.address ?? "",
        jarak: item.distance_note ?? "",
        gambar: firstImage,
        // @ts-ignore
        bidang: bidangNama,
        // @ts-ignore
        images: imagesList,
        jamKerja: jamKerjaList,
        kuota: item.quota_status ?? "Tersedia",
        role: detailedRoles.map((r) => r.role),
        // @ts-ignore
        detailedRoles: detailedRoles,
        tugas: detailedRoles[0]?.tasks || companyTasks,
        syaratBerkas: parseList(item.requirements),
        fasilitas: parseList(item.facilities),
        testimoni: selectedTestimonial
          ? {
              nama:
                selectedTestimonial.full_name || selectedTestimonial.name || "Alumni Siswa",
              sekolah: selectedTestimonial.school_name || selectedTestimonial.school || "",
              isi:
                selectedTestimonial.review ||
                selectedTestimonial.content ||
                selectedTestimonial.feedback ||
                "",
            }
          : null,
        linkMaps: item.google_maps_url ?? null,
        contacts: item.contact_info ?? null,
      };
    });
  } catch (err) {
    console.error("Gagal mengambil data Company:", err);
    throw err;
  }
}