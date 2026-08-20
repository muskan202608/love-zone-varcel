import { randomBytes, scryptSync, timingSafeEqual } from "node:crypto";
import { promises as fs } from "node:fs";
import path from "node:path";
import QRCode from "qrcode";
import type { ApprovalStatus, Database, Member, SafeMember, SiteSettings } from "./types";

// Set STORAGE_DIR to a mounted VPS volume for large persistent storage.
// Without it, the app keeps data in the project-local /storage directory.
const storageRoot = process.env.STORAGE_DIR
  ? path.resolve(process.env.STORAGE_DIR)
  : path.join(process.cwd(), "storage");
const databasePath = path.join(storageRoot, "database.json");
const uploadFolders = ["profiles", "certificates", "qrcodes"] as const;
const readCacheTtlMs = 2_000;
let storageReady: Promise<void> | null = null;
let databaseCache: { value: Database; expiresAt: number } | null = null;
let databaseRead: Promise<Database> | null = null;

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
  contacts: [
    { id: "contact-1", name: "Member support", phone: "9891167174", whatsapp: "9891167174" },
    { id: "contact-2", name: "Registration desk", phone: "9876543210", whatsapp: "9876543210" },
  ],
  certificates: {},
};

const defaultDatabase = (): Database => ({
  nextEmployeeNumber: 5600,
  members: [],
  settings: structuredClone(defaultSettings),
});

const safeName = (name: string) => name.replace(/[^a-zA-Z0-9._-]/g, "-");

export async function ensureStorage() {
  if (storageReady) return storageReady;
  storageReady = (async () => {
    await fs.mkdir(storageRoot, { recursive: true });
    await Promise.all(uploadFolders.map((folder) => fs.mkdir(path.join(storageRoot, folder), { recursive: true })));
    try {
      await fs.access(databasePath);
    } catch {
      await fs.writeFile(databasePath, JSON.stringify(defaultDatabase(), null, 2), "utf8");
    }
  })();
  try {
    await storageReady;
  } catch (error) {
    storageReady = null;
    throw error;
  }
}

export async function readDatabase(): Promise<Database> {
  const now = Date.now();
  if (databaseCache && databaseCache.expiresAt > now) return databaseCache.value;
  if (databaseRead) return databaseRead;
  databaseRead = (async () => {
    await ensureStorage();
    try {
      const parsed = JSON.parse(await fs.readFile(databasePath, "utf8")) as Partial<Database>;
      const defaults = defaultDatabase();
      const database: Database = {
        ...defaults,
        ...parsed,
        members: Array.isArray(parsed.members) ? parsed.members : [],
        settings: {
          ...defaults.settings,
          ...parsed.settings,
          hero: { ...defaults.settings.hero, ...parsed.settings?.hero },
          process: { ...defaults.settings.process, ...parsed.settings?.process },
          contacts: parsed.settings?.contacts || defaults.settings.contacts,
          certificates: { ...defaults.settings.certificates, ...parsed.settings?.certificates },
        },
      };
      databaseCache = { value: database, expiresAt: Date.now() + readCacheTtlMs };
      return database;
    } catch {
      const database = defaultDatabase();
      databaseCache = { value: database, expiresAt: Date.now() + readCacheTtlMs };
      return database;
    }
  })();
  try {
    return await databaseRead;
  } finally {
    databaseRead = null;
  }
}

export async function writeDatabase(database: Database) {
  await ensureStorage();
  databaseCache = null;
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

export async function approveMember(memberId: string, status: ApprovalStatus) {
  const database = await readDatabase();
  const member = database.members.find((item) => item.id === memberId);
  if (!member) throw new Error("Member not found.");
  member.status = status;
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
