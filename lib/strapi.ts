import { TempatPKL } from "@/types";

const STRAPI_URL =
  process.env.NEXT_PUBLIC_STRAPI_URL ?? "https://simpul-production.up.railway.app";

export interface AppInfoData {
  title?: string;
  content?: string;
  logo?: {
    url?: string;
  };
}

function fullUrl(path?: string | null) {
  if (!path) return null;
  return path.startsWith("http") ? path : `${STRAPI_URL}${path}`;
}

// Helper untuk fetch seluruh halaman (jika dibatasi maxLimit 25 oleh Strapi)
async function fetchAllPages(endpoint: string): Promise<any[]> {
  const allItems: any[] = [];
  let page = 1;
  let hasMore = true;

  while (hasMore && page <= 10) {
    try {
      const url = `${STRAPI_URL}${endpoint}${
        endpoint.includes("?") ? "&" : "?"
      }pagination[page]=${page}&pagination[pageSize]=50`;

      const res = await fetch(url, { cache: "no-store" });
      if (!res.ok) break;

      const json = await res.json();
      const items = json.data || [];
      if (items.length === 0) break;

      allItems.push(...items);

      const pageCount = json.meta?.pagination?.pageCount;
      if (pageCount && page >= pageCount) {
        hasMore = false;
      } else if (items.length < 50 && !pageCount) {
        hasMore = false;
      } else {
        page++;
      }
    } catch {
      break;
    }
  }

  return allItems;
}

// 1. Ambil Hero Slider aktif
export async function getHeroSliders() {
  try {
    const res = await fetch(`${STRAPI_URL}/api/hero-sliders?populate=*`, {
      cache: "no-store",
    });
    if (!res.ok) return [];
    const json = await res.json();
    return json.data || [];
  } catch (err) {
    console.error("Gagal mengambil hero sliders:", err);
    return [];
  }
}

// 2. Ambil Daftar Jurusan
export async function getMajors() {
  try {
    const res = await fetch(`${STRAPI_URL}/api/majors?populate=*`, {
      cache: "no-store",
    });
    if (!res.ok) return [];
    const json = await res.json();
    return json.data || [];
  } catch (err) {
    console.error("Gagal mengambil jurusan:", err);
    return [];
  }
}

// 3. Ambil Master Bidang Perusahaan
export async function getBusinessFields() {
  try {
    const res = await fetch(`${STRAPI_URL}/api/business-fields?populate=*`, {
      cache: "no-store",
    });
    if (!res.ok) return [];
    const json = await res.json();
    return json.data || [];
  } catch (err) {
    console.error("Gagal mengambil business fields:", err);
    return [];
  }
}

// 4. Ambil Testimoni
export async function getTestimonials() {
  try {
    const res = await fetch(
      `${STRAPI_URL}/api/testimonials?filters[is_featured][$eq]=true&populate=*`,
      { cache: "no-store" }
    );
    if (!res.ok) return [];
    const json = await res.json();
    return json.data || [];
  } catch (err) {
    console.error("Gagal mengambil testimoni:", err);
    return [];
  }
}

// 5. Ambil Info Aplikasi
export async function getAppInfo(): Promise<AppInfoData | null> {
  try {
    const res = await fetch(`${STRAPI_URL}/api/app-info?populate=*`, {
      cache: "no-store",
    });
    if (!res.ok) return null;
    const json = await res.json();
    return json.data || null;
  } catch (err) {
    console.error("Gagal mengambil info aplikasi:", err);
    return null;
  }
}

// Helper pembersih daftar string tugas & fasilitas
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
          .replace(/^\d+[\.\)]\s*/, "")
          .replace(/^["'](.*)["']$/, "$1")
          .trim()
      )
      .filter((s) => s.length > 0 && s !== "[" && s !== "]");
  }

  if (typeof raw === "string" && raw.trim()) {
    let str = raw.trim();
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
          .replace(/^\d+[\.\)]\s*/, "")
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
    // Ambil SEMUA halaman untuk Companies, Company-Roles, dan Roles
    const [companiesData, compRolesData, masterRolesData] = await Promise.all([
      fetchAllPages("/api/companies?populate=*"),
      fetchAllPages("/api/company-roles?populate=*"),
      fetchAllPages("/api/roles?populate=*"),
    ]);

    if (companiesData.length === 0) return [];

    // 1. Peta Master Roles (Role ID / documentId -> Title)
    const roleTitleMap = new Map<string, string>();
    masterRolesData.forEach((r: any) => {
      const title = r.title || r.name;
      if (title) {
        if (r.id) roleTitleMap.set(String(r.id), title);
        if (r.documentId) roleTitleMap.set(String(r.documentId), title);
      }
    });

    // 2. Peta Company Roles (ID / documentId -> { role, tasks })
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

      // Cek relasi ke master role jika hanya berupa ID
      if (!roleTitle && cr.role) {
        const refId1 = String(cr.role.documentId || "");
        const refId2 = String(cr.role.id || "");
        const refIdRaw =
          typeof cr.role === "string" || typeof cr.role === "number"
            ? String(cr.role)
            : "";

        if (refId1 && roleTitleMap.has(refId1)) roleTitle = roleTitleMap.get(refId1)!;
        else if (refId2 && roleTitleMap.has(refId2)) roleTitle = roleTitleMap.get(refId2)!;
        else if (refIdRaw && roleTitleMap.has(refIdRaw)) roleTitle = roleTitleMap.get(refIdRaw)!;
      }

      const tasks = parseList(cr.responsibilities || cr.tasks);
      const val = { role: roleTitle, tasks };

      if (cr.id) companyRoleDetailMap.set(String(cr.id), val);
      if (cr.documentId) companyRoleDetailMap.set(String(cr.documentId), val);

      // Cek relasi balik ke company
      if (cr.company && roleTitle) {
        const compRef = String(cr.company.documentId || cr.company.id || cr.company);
        const existing = companyToRolesMap.get(compRef) || [];
        existing.push(val);
        companyToRolesMap.set(compRef, existing);
      }
    });

    // 3. Mapping data Companies
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

      const companyTasks = parseList(item.responsibilities);

      const detailedRoles: { role: string; tasks: string[] }[] = [];
      const roleNamesSet = new Set<string>();

      const addRole = (role: string, tasks: string[]) => {
        if (!role || /^[a-z0-9]{20,}$/i.test(role) || roleNamesSet.has(role)) return;
        roleNamesSet.add(role);
        detailedRoles.push({
          role,
          tasks: tasks.length > 0 ? tasks : companyTasks,
        });
      };

      // Cek dari relasi roles / company_roles pada company
      const rawRoles = [
        ...(Array.isArray(item.roles) ? item.roles : []),
        ...(Array.isArray(item.company_roles) ? item.company_roles : []),
      ];

      rawRoles.forEach((entry: any) => {
        const keyDocId = String(entry?.documentId || "");
        const keyId = String(entry?.id || "");
        const keyRaw =
          typeof entry === "string" || typeof entry === "number" ? String(entry) : "";

        // 1. Cek di Company Role Detail Map
        const detail =
          (keyDocId && companyRoleDetailMap.get(keyDocId)) ||
          (keyId && companyRoleDetailMap.get(keyId)) ||
          (keyRaw && companyRoleDetailMap.get(keyRaw));

        if (detail && detail.role) {
          addRole(detail.role, detail.tasks);
          return;
        }

        // 2. Cek di Master Role Map
        const directTitle =
          (keyDocId && roleTitleMap.get(keyDocId)) ||
          (keyId && roleTitleMap.get(keyId)) ||
          (keyRaw && roleTitleMap.get(keyRaw));

        if (directTitle) {
          const tasks = parseList(entry?.responsibilities || entry?.tasks);
          addRole(directTitle, tasks);
          return;
        }

        // 3. Cek langsung objek entry jika nama role tertera
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
              entry.responsibilities || entry.tasks || entry.role?.responsibilities
            );
            addRole(embeddedTitle, tasks);
          }
        }
      });

      // Cek relasi balik dari companyToRolesMap
      const cDocId = String(item.documentId || "");
      const cId = String(item.id || "");
      const linkedRoles =
        (cDocId && companyToRolesMap.get(cDocId)) ||
        (cId && companyToRolesMap.get(cId)) ||
        [];

      linkedRoles.forEach((lr) => addRole(lr.role, lr.tasks));

      // Fallback jika memang tidak ada relasi di database untuk tempat ini
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
              nama: selectedTestimonial.full_name || selectedTestimonial.name || "Alumni Siswa",
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
    return [];
  }
}