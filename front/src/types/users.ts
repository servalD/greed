import { Address } from "thirdweb";

export type UserRole = 'agency' | 'guest' | 'client' | 'co_owner' | 'admin' | 'agent' | 'nobody';
export enum UserRoleIds {
  NOBODY = 0,
  AGENCY = 1,
  AGENT = 2,
  CLIENT = 3,
  CO_OWNER = 4,
  GUEST = 5,
  ADMIN = 6,
}

export const UserRoleLabels: Record<UserRole, string> = {
  agency: "Agency",
  guest: "Guest",
  client: "Client",
  co_owner: "Co-Owner",
  admin: "Admin",
  agent: "Agent",
  nobody: "Nobody",
};

export const UserRoleIdLabels: Record<UserRoleIds, string> = {
  [UserRoleIds.GUEST]: "Guest",
  [UserRoleIds.AGENCY]: "Agency",
  [UserRoleIds.AGENT]: "Agent",
  [UserRoleIds.CLIENT]: "Client",
  [UserRoleIds.CO_OWNER]: "Co_owner",
  [UserRoleIds.ADMIN]: "Admin",
  [UserRoleIds.NOBODY]: "Nobody",
};

export const UserLabelRoleIds: Record<string, UserRoleIds> = {
  "Guest": UserRoleIds.GUEST,
  "Agency": UserRoleIds.AGENCY,
  "Agent": UserRoleIds.AGENT,
  "Client": UserRoleIds.CLIENT,
  "Co-Owner": UserRoleIds.CO_OWNER,
  "Admin": UserRoleIds.ADMIN,
  "Nobody": UserRoleIds.NOBODY,
};

export interface User {
  id: number,
  eth_address: Address,
  first_name: string,
  last_name: string,
  email: string,
  role: UserRoleIds
}

export interface UserUpdate {
  id: number,
  eth_address: Address,
  first_name?: string,
  last_name?: string,
  email?: string,
  role?: string,
}
