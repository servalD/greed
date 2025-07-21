import { get, post, put, delete_ } from "../utils/api";
import { IRealty } from "@/app/models/realty.model";
import { ServiceResult } from "./service.result";

export class RealtyService {
    static async createRealty(data: IRealty): Promise<ServiceResult<IRealty | undefined>> {
        try {
            const res = await post<IRealty>("/realty", data as unknown as Record<string, unknown>);
            return ServiceResult.success(res);
        } catch (err) {
            console.log(err);
            return ServiceResult.failed();
        }
    }

    static async getRealtyById(id: number): Promise<ServiceResult<IRealty | undefined>> {
        try {
            const res = await get<IRealty>(`/realty/${id}`);
            return ServiceResult.success(res);
        } catch (err) {
            console.log(err);
            return ServiceResult.failed();
        }
    }

    static async getAllRealties(): Promise<ServiceResult<IRealty[] | undefined>> {
        try {
            const res = await get<IRealty[]>("/realty");
            return ServiceResult.success(res);
        } catch (err) {
            console.log(err);
            return ServiceResult.failed();
        }
    }

    static async updateRealty(id: number, data: Partial<IRealty>): Promise<ServiceResult<IRealty | undefined>> {
        try {
            const res = await put<IRealty>(`/realty/${id}`, data as unknown as Record<string, unknown>);
            return ServiceResult.success(res);
        } catch (err) {
            console.log(err);
            return ServiceResult.failed();
        }
    }

    static async deleteRealty(id: number): Promise<ServiceResult<void>> {
        try {
            await delete_<void>(`/realty/${id}`);
            return ServiceResult.success(undefined);
        } catch (err) {
            console.log(err);
            return ServiceResult.failed();
        }
    }

    static async searchRealties(params: Record<string, any>): Promise<ServiceResult<IRealty[] | undefined>> {
        try {
            const query = new URLSearchParams(params).toString();
            const res = await get<IRealty[]>(`/realty/search?${query}`);
            return ServiceResult.success(res);
        } catch (err) {
            console.log(err);
            return ServiceResult.failed();
        }
    }
}
