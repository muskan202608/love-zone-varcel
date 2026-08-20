import type { StateSeoPage } from "./seo-states";

export type ApprovalStatus = "Pending" | "Approved" | "Rejected";
export type MembershipDuration = 1 | 2 | 3;

export type Member = {
  id: string;
  name: string;
  mobile: string;
  email: string;
  passwordHash: string;
  city: string;
  state: string;
  dateOfBirth: string;
  bodyWeight: string;
  photoUrl: string;
  status: ApprovalStatus;
  isApproved?: boolean;
  employeeId?: string;
  qrCodeUrl?: string;
  membershipDuration?: MembershipDuration;
  approvedAt?: string;
  expiryDate?: string;
  membershipStartedAt?: string;
  membershipExpiresAt?: string;
  createdAt: string;
};

export type Contact = {
  id: string;
  name: string;
  phone: string;
  whatsapp: string;
};

export type ProcessStep = {
  title: string;
  points: string[];
};

export type SeoPage = "home" | "signup" | "login" | "member" | "verify";
export type SeoKey = SeoPage | StateSeoPage;

export type SeoEntry = {
  title: string;
  description: string;
  keywords: string;
  canonicalUrl?: string;
};

export type SiteSettings = {
  hero: {
    lines: [string, string, string];
    subtitle: string;
    description: string;
  };
  process: {
    subtext: string;
    steps: ProcessStep[];
  };
  contacts: Contact[];
  certificates: {
    gst?: string;
    police?: string;
  };
  seo: Record<string, SeoEntry>;
};

export type Database = {
  nextEmployeeNumber: number;
  members: Member[];
  settings: SiteSettings;
};

export type SafeMember = Omit<Member, "passwordHash">;
