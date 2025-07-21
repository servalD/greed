import { get, put } from "../utils/api";
import { User, UserRoleIds } from "@/types/users";
import { ServiceResult } from "./service.result";

export class UserService {
    static async getGuests(): Promise<ServiceResult<User[] | undefined>> {
        try {
            const res = await get<User[]>("/users/guests");
            return ServiceResult.success(res);
        } catch (err) {
            console.log(err);
            return ServiceResult.failed();
        }
    }

    static async getClients(): Promise<ServiceResult<User[] | undefined>> {
        try {
            const res = await get<User[]>("/users/clients");
            return ServiceResult.success(res);
        } catch (err) {
            console.log(err);
            return ServiceResult.failed();
        }
    }

    static async updateUserRole(userId: number, newRole: UserRoleIds): Promise<ServiceResult<User | undefined>> {
        try {
            const res = await put<User>(`/user`, {
                id: userId,
                role: newRole,
            } as unknown as Record<string, unknown>);
            return ServiceResult.success(res);
        } catch (err) {
            console.log(err);
            return ServiceResult.failed();
        }
    }
} 