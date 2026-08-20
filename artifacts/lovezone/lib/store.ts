import { randomBytes, scryptSync, timingSafeEqual } from "node:crypto";
import { promises as fs } from "node:fs";
import path from "node:path";
import QRCode from "qrcode";
import { calculateExpiryDate } from "./membership";
import { stateSeoPages } from "./seo-states";
import type { ApprovalStatus, Contact, Database, Member, MembershipDuration, SafeMember, SeoEntry, SeoKey, SiteSettings } from "./types";

// Set STORAGE_DIR to a mounted VPS volume for large persistent storage.
// Without it, the app keeps data in the project-local /storage directory.
const storageRoot = process.env.STORAGE_DIR
  ? path.resolve(process.env.STORAGE_DIR)
  : path.join(process.cwd(), "storage");
const databasePath = path.join(storageRoot, "database.json");
const uploadFolders = ["profiles", "certificates", "qrcodes"] as const;

const defaultContacts: Contact[] = [
  { id: "contact-1", name: "Member Support", phone: "9891167174", whatsapp: "9891167174" },
  { id: "contact-2", name: "Registration Desk", phone: "9876543210", whatsapp: "9876543210" },
  { id: "contact-3", name: "Membership Help", phone: "", whatsapp: "" },
  { id: "contact-4", name: "Verification Team", phone: "", whatsapp: "" },
  { id: "contact-5", name: "Account Assistance", phone: "", whatsapp: "" },
  { id: "contact-6", name: "Travel Support", phone: "", whatsapp: "" },
  { id: "contact-7", name: "Meeting Coordination", phone: "", whatsapp: "" },
  { id: "contact-8", name: "Priority Support", phone: "", whatsapp: "" },
];

const defaultSeo = {
  home: { title: "PlayboyZone | Membership Platform", description: "Verified membership and digital ID platform.", keywords: "membership, digital ID, verified platform" },
  signup: { title: "Join PlayboyZone | Membership Application", description: "Create your PlayboyZone membership profile.", keywords: "membership signup, profile application" },
  login: { title: "Login | PlayboyZone", description: "Secure access to your PlayboyZone membership profile.", keywords: "member login, PlayboyZone" },
  member: { title: "My Membership | PlayboyZone", description: "View your membership status and verified digital ID.", keywords: "member dashboard, digital ID" },
  verify: { title: "Member Verification | PlayboyZone", description: "Verify a PlayboyZone digital employee ID.", keywords: "employee verification, digital ID verification" },
  ...Object.fromEntries(stateSeoPages.map(({ slug, name }) => [slug, {
    title: `Playboy Jobs in ${name} | High Paying Jobs`,
    description: `Find playboy jobs, call boy jobs, male escort jobs in ${name}. High income opportunities.`,
    keywords: `playboy jobs ${name}, call boy jobs ${name}, male escort jobs ${name}, high paying jobs ${name}`,
  }])),
} as Record<string, SeoEntry>;

const defaultSettings: SiteSettings = {
  hero: {
    lines: ["PLAY BOY JOBS", "CALL BOY JOBS", "MALE ESCORTS JOBS"],
    subtitle: "Verified & Trusted Platform Since 2009",
    description:
      "Join our premium membership platform and start receiving high-paying job opportunities near your location.",
  },
  process: {
    subtext: "Simple, Verified & Trusted Process Since 2009",
    steps: [
      { title: "Registration", points: ["Joining is completely free", "No hidden charges", "Register easily on the website"] },
      { title: "Profile Submission", points: ["Submit your basic details", "Choose your preferred work location"] },
      { title: "Membership Activation", points: ["A professional work licence is required", "Valid for 3 months"] },
      { title: "Verification Process", points: ["Admin reviews your profile", "Approved accounts receive a digital ID"] },
      { title: "Work Opportunities", points: ["Receive regular opportunities", "Flexible scheduling based on location"] },
    ],
  },
  contacts: defaultContacts,
  certificates: {},
  seo: defaultSeo,
};

const defaultDatabase = (): Database => ({
  nextEmployeeNumber: 5600,
  members: [],
  settings: structuredClone(defaultSettings),
});

const safeName = (name: string) => name.replace(/[^a-zA-Z0-9._-]/g, "-");

const normalizeContacts = (contacts: unknown): Contact[] => {
  const incoming = Array.isArray(contacts) ? contacts : [];
  return defaultContacts.map((fallback, index) => {
    const contact = incoming[index] as Partial<Contact> | undefined;
    return {
      id: contact?.id || fallback.id,
      name: typeof contact?.name === "string" && contact.name.trim() ? contact.name : fallback.name,
      phone: typeof contact?.phone === "string" ? contact.phone.replace(/\D/g, "").slice(0, 15) : fallback.phone,
      whatsapp: typeof contact?.whatsapp === "string" ? contact.whatsapp.replace(/\D/g, "").slice(0, 15) : fallback.whatsapp,
    };
  });
};

const normalizeSeo = (seo: unknown): Record<string, SeoEntry> => {
  const incoming = (seo && typeof seo === "object" ? seo : {}) as Record<string, Partial<SeoEntry>>;
  return Object.keys(defaultSeo).reduce((result, page) => {
    const entry = incoming[page];
    result[page] = {
      title: typeof entry?.title === "string" && entry.title.trim() ? entry.title : defaultSeo[page].title,
      description: typeof entry?.description === "string" && entry.description.trim() ? entry.description : defaultSeo[page].description,
      keywords: typeof entry?.keywords === "string" ? entry.keywords : defaultSeo[page].keywords,
      canonicalUrl: typeof entry?.canonicalUrl === "string" ? entry.canonicalUrl : "",
    };
    return result;
  }, {} as Record<string, SeoEntry>);
};

const hydrateMembership = (member: Member): Member => {
  if (member.status !== "Approved") return member;
  const duration: MembershipDuration = member.membershipDuration === 1 || member.membershipDuration === 2 || member.membershipDuration === 3 ? member.membershipDuration : 3;
  const approvedAt = member.approvedAt || member.membershipStartedAt || member.createdAt;
  const expiryDate = member.expiryDate || member.membershipExpiresAt || calculateExpiryDate(approvedAt, duration);
  return {
    ...member,
    isApproved: true,
    membershipDuration: duration,
    approvedAt,
    expiryDate,
    membershipStartedAt: approvedAt,
    membershipExpiresAt: expiryDate,
  };
};

export async function ensureStorage() {
  await fs.mkdir(storageRoot, { recursive: true });
  await Promise.all(uploadFolders.map((folder) => fs.mkdir(path.join(storageRoot, folder), { recursive: true })));
  try {
    await fs.access(databasePath);
  } catch {
    await fs.writeFile(databasePath, JSON.stringify(defaultDatabase(), null, 2), "utf8");
  }
}

export async function readDatabase(): Promise<Database> {
  await ensureStorage();
  try {
    const parsed = JSON.parse(await fs.readFile(databasePath, "utf8")) as Partial<Database>;
    const defaults = defaultDatabase();
    const rawMembers = Array.isArray(parsed.members) ? parsed.members as Member[] : [];
    const savedSeo = parsed.settings?.seo as Partial<Record<string, SeoEntry>> | undefined;
    const database: Database = {
      ...defaults,
      ...parsed,
      members: rawMembers.map(hydrateMembership),
      settings: {
        ...defaults.settings,
        ...parsed.settings,
        hero: { ...defaults.settings.hero, ...parsed.settings?.hero },
        process: { ...defaults.settings.process, ...parsed.settings?.process },
        contacts: normalizeContacts(parsed.settings?.contacts),
        certificates: { ...defaults.settings.certificates, ...parsed.settings?.certificates },
        seo: normalizeSeo(parsed.settings?.seo),
      },
    };
    const needsMigration = rawMembers.some((member) => member.status === "Approved" && (!member.isApproved || !member.membershipDuration || !member.approvedAt || !member.expiryDate || !member.membershipStartedAt || !member.membershipExpiresAt))
      || !Array.isArray(parsed.settings?.contacts)
      || parsed.settings?.contacts?.length !== defaultContacts.length
      || Object.keys(defaultSeo).some((page) => !savedSeo?.[page]);
    if (needsMigration) await writeDatabase(database);
    return database;
  } catch {
    return defaultDatabase();
  }
}

export async function writeDatabase(database: Database) {
  await ensureStorage();
  const temporaryPath = `${databasePath}.${randomBytes(6).toString("hex")}.tmp`;
  await fs.writeFile(temporaryPath, JSON.stringify(database, null, 2), "utf8");
  await fs.rename(temporaryPath, databasePath);
}

export async function saveUpload(file: File, folder: (typeof uploadFolders)[number]) {
  await ensureStorage();
  if (!file.type.startsWith("image/")) throw new Error("Only image uploads are supported.");
  if (file.size > 10 * 1024 * 1024) throw new Error("Images must be 10 MB or smaller.");
  const originalExtension = path.extname(file.name).toLowerCase();
  const extension = originalExtension && originalExtension.length <= 6 ? originalExtension : ".jpg";
  const filename = `${Date.now()}-${randomBytes(6).toString("hex")}-${safeName(path.basename(file.name, originalExtension))}${extension}`;
  await fs.writeFile(path.join(storageRoot, folder, filename), Buffer.from(await file.arrayBuffer()));
  return `/api/files/${folder}/${filename}`;
}

export async function getStoredFile(segments: string[]) {
  if (segments.length !== 2 || !uploadFolders.includes(segments[0] as (typeof uploadFolders)[number])) return null;
  const [folder, filename] = segments;
  if (!filename || filename !== path.basename(filename)) return null;
  try {
    return { data: await fs.readFile(path.join(storageRoot, folder, filename)), filename };
  } catch {
    return null;
  }
}

export function hashPassword(password: string) {
  const salt = randomBytes(16).toString("hex");
  return `${salt}:${scryptSync(password, salt, 64).toString("hex")}`;
}

export function matchesPassword(password: string, storedHash: string) {
  const [salt, hash] = storedHash.split(":");
  if (!salt || !hash) return false;
  const inputHash = scryptSync(password, salt, 64);
  const storedBuffer = Buffer.from(hash, "hex");
  return storedBuffer.length === inputHash.length && timingSafeEqual(storedBuffer, inputHash);
}

export function withoutPassword(member: Member): SafeMember {
  const { passwordHash: _passwordHash, ...safeMember } = member;
  return safeMember;
}

export async function approveMember(memberId: string, status: ApprovalStatus, duration?: MembershipDuration) {
  const database = await readDatabase();
  const member = database.members.find((item) => item.id === memberId);
  if (!member) throw new Error("Member not found.");
  member.status = status;
  if (status === "Approved") {
    if (!duration) throw new Error("Choose a membership duration before approving this member.");
    const approvedAt = new Date().toISOString();
    const expiryDate = calculateExpiryDate(approvedAt, duration);
    member.isApproved = true;
    member.membershipDuration = duration;
    member.approvedAt = approvedAt;
    member.expiryDate = expiryDate;
    member.membershipStartedAt = approvedAt;
    member.membershipExpiresAt = expiryDate;
  } else if (status === "Rejected") {
    member.isApproved = false;
  }
  if (status === "Approved" && !member.employeeId) {
    member.employeeId = `PBZ-${database.nextEmployeeNumber}`;
    database.nextEmployeeNumber += 1;
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
    const qrFilename = `${member.employeeId}.png`;
    await QRCode.toFile(path.join(storageRoot, "qrcodes", qrFilename), `${appUrl}/verify/${member.employeeId}`, {
      width: 360,
      margin: 2,
      color: { dark: "#000000", light: "#ffffff" },
    });
    member.qrCodeUrl = `/api/files/qrcodes/${qrFilename}`;
  }
  await writeDatabase(database);
  return withoutPassword(member);
}
