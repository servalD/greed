
export type UserRole = 'agency' | 'guest' | 'client' | 'co_owner' | 'admin';
export enum UserRoleIds {
  GUEST = 0,
  AGENCY = 1,
  AGENT = 2,
  CLIENT = 3,
  CO_OWNER = 4,
}

export const UserRoleLabels: Record<UserRole, string> = {
  agency: "Agency",
  guest: "Guest",
  client: "Client",
  co_owner: "Co-Owner",
  admin: "Admin",
};

export const UserRoleIdLabels: Record<UserRoleIds, string> = {
  [UserRoleIds.GUEST]: "Guest",
  [UserRoleIds.AGENCY]: "Agency",
  [UserRoleIds.AGENT]: "Agent",
  [UserRoleIds.CLIENT]: "Client",
  [UserRoleIds.CO_OWNER]: "Co-Owner",
};
