import type { ApprovalStatus, Member, MembershipDuration } from "./types";

export const membershipDurations = [1, 2, 3] as const;
export type MembershipStatus = "Active" | "Expired" | Exclude<ApprovalStatus, "Approved">;

export const isMembershipDuration = (value: unknown): value is MembershipDuration => membershipDurations.includes(value as MembershipDuration);

export const calculateExpiryDate = (approvedAt: string | Date, duration: MembershipDuration) => {
  const expiryDate = new Date(approvedAt);
  expiryDate.setDate(expiryDate.getDate() + (30 * duration));
  return expiryDate.toISOString();
};

export const membershipPlanLabel = (duration?: MembershipDuration) => `${duration || 3} Month`;

export const membershipPlanBadge = (duration?: MembershipDuration) => `${duration || 3}M`;

export const getApprovedAt = (member: Pick<Member, "approvedAt" | "membershipStartedAt">) => member.approvedAt || member.membershipStartedAt;

export const getExpiryDate = (member: Pick<Member, "expiryDate" | "membershipExpiresAt">) => member.expiryDate || member.membershipExpiresAt;

export const getMembershipStatus = (member: Pick<Member, "status" | "expiryDate" | "membershipExpiresAt">, now = new Date()): MembershipStatus => {
  if (member.status !== "Approved") return member.status;
  const expiryDate = getExpiryDate(member);
  return expiryDate && new Date(expiryDate) < now ? "Expired" : "Active";
};
