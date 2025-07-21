import { get, post, put, delete_ } from "../utils/api";
import { IApartment } from "@/app/models/apartment.model";
import { ServiceResult } from "./service.result";

export class ApartmentService {
    static async createApartment(data: IApartment): Promise<ServiceResult<IApartment | undefined>> {
        try {
            const res = await post<IApartment>("/apartments", data as unknown as Record<string, unknown>);
            return ServiceResult.success(res);
        } catch (err) {
            console.log(err);
            return ServiceResult.failed();
        }
    }

    static async getApartmentById(id: number): Promise<ServiceResult<IApartment | undefined>> {
        try {
            const res = await get<IApartment>(`/apartments/${id}`);
            return ServiceResult.success(res);
        } catch (err) {
            console.log(err);
            return ServiceResult.failed();
        }
    }

    static async getAllApartments(): Promise<ServiceResult<IApartment[] | undefined>> {
        try {
            const res = await get<IApartment[]>("/apartments");
            return ServiceResult.success(res);
        } catch (err) {
            console.log(err);
            return ServiceResult.failed();
        }
    }

    static async updateApartment(id: number, data: Partial<IApartment>): Promise<ServiceResult<IApartment | undefined>> {
        try {
            const res = await put<IApartment>(`/apartments/${id}`, data as unknown as Record<string, unknown>);
            return ServiceResult.success(res);
        } catch (err) {
            console.log(err);
            return ServiceResult.failed();
        }
    }

    static async deleteApartment(id: number): Promise<ServiceResult<void>> {
        try {
            await delete_<void>(`/apartments/${id}`);
            return ServiceResult.success(undefined);
        } catch (err) {
            console.log(err);
            return ServiceResult.failed();
        }
    }

    static async getApartmentsByRealty(realty_id: number): Promise<ServiceResult<IApartment[] | undefined>> {
        try {
            const res = await get<IApartment[]>(`/realty/${realty_id}/apartments`);
            return ServiceResult.success(res);
        } catch (err) {
            console.log(err);
            return ServiceResult.failed();
        }
    }
}
