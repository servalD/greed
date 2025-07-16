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
  [UserRoleIds.CO_OWNER]: "Co-Owner",
  [UserRoleIds.ADMIN]: "Admin",
};

export interface User {
  id: number,
  eth_address: Address,
  first_name: string,
  last_name: string,
  email: string,
  role: UserRoleIds,
}

export interface UserUpdate {
  id: number,
  eth_address: Address,
  first_name?: string,
  last_name?: string,
  email?: string,
  role?: UserRoleIds,
  password: string,
  new_password?: string,
}
