import { Address } from "thirdweb";

export type UserRole = 'agency' | 'guest' | 'client' | 'co_owner' | 'admin' | 'agent';
export enum UserRoleIds {
  GUEST = 0,
  AGENCY = 1,
  AGENT = 2,
  CLIENT = 3,
  CO_OWNER = 4,
  ADMIN = 5,
}

export const UserRoleLabels: Record<UserRole, string> = {
  agency: "Agency",
  guest: "Guest",
  client: "Client",
  co_owner: "Co-Owner",
  admin: "Admin",
  agent: "Agent",
};

export const UserRoleIdLabels: Record<UserRoleIds, string> = {
  [UserRoleIds.GUEST]: "Guest",
  [UserRoleIds.AGENCY]: "Agency",
  [UserRoleIds.AGENT]: "Agent",
  [UserRoleIds.CLIENT]: "Client",
  [UserRoleIds.CO_OWNER]: "Co_owner",
  [UserRoleIds.ADMIN]: "Admin",
};

export const UserLabelRoleIds: Record<string, UserRoleIds> = {
  "Guest": UserRoleIds.GUEST,
  "Agency": UserRoleIds.AGENCY,
  "Agent": UserRoleIds.AGENT,
  "Client": UserRoleIds.CLIENT,
  "Co-Owner": UserRoleIds.CO_OWNER,
  "Admin": UserRoleIds.ADMIN,
};

export interface User {
  id: number,
  eth_address: Address,
  first_name: string,
  last_name: string,
  email: string,
  role: UserRoleIds,
  is_setup: boolean,
}

export interface UserUpdate {
  id: number,
  eth_address: Address,
  first_name?: string,
  last_name?: string,
  email?: string,
  role?: string,
  password: string,
  new_password?: string,
}
