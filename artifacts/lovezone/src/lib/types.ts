export type ApprovalStatus = "Pending" | "Approved" | "Rejected";

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
  employeeId?: string;
  qrCodeUrl?: string;
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
};

export type Database = {
  nextEmployeeNumber: number;
  members: Member[];
  settings: SiteSettings;
};

export type SafeMember = Omit<Member, "passwordHash">;
