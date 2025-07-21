import { ApiService } from "./api.service";
import { IRealty } from "@/app/models/realty.model";
import axios from 'axios';
import { ServiceResult } from "./service.result";

function authorizationHeader(): Record<string, string> {
    const token = typeof window !== 'undefined' ? localStorage.getItem("access_token") : null;
    return token ? { Authorization: `Bearer ${token}` } : {};
}

export class RealtyService {
    static async createRealty(data: IRealty): Promise<ServiceResult<IRealty | undefined>> {
        try {
            const res = await axios.post(`${ApiService.baseURL}/realty`, data, {
                headers: { ...authorizationHeader() }
            });
            if (res.status === 200) {
                return ServiceResult.success(res.data);
            }
            return ServiceResult.failed();
        } catch (err) {
            console.log(err);
            return ServiceResult.failed();
        }
    }

    static async getRealtyById(id: number): Promise<ServiceResult<IRealty | undefined>> {
        try {
            const res = await axios.get(`${ApiService.baseURL}/realty/${id}`, {
                headers: { ...authorizationHeader() }
            });
            if (res.status === 200) {
                return ServiceResult.success(res.data);
            }
            return ServiceResult.failed();
        } catch (err) {
            console.log(err);
            return ServiceResult.failed();
        }
    }

    static async getAllRealties(): Promise<ServiceResult<IRealty[] | undefined>> {
        try {
            const res = await axios.get(`${ApiService.baseURL}/realty`, {
                headers: { ...authorizationHeader() }
            });
            if (res.status === 200) {
                return ServiceResult.success(res.data);
            }
            return ServiceResult.failed();
        } catch (err) {
            console.log(err);
            return ServiceResult.failed();
        }
    }

    static async updateRealty(id: number, data: Partial<IRealty>): Promise<ServiceResult<IRealty | undefined>> {
        try {
            const res = await axios.put(`${ApiService.baseURL}/realty/${id}`, data, {
                headers: { ...authorizationHeader() }
            });
            if (res.status === 200) {
                return ServiceResult.success(res.data);
            }
            return ServiceResult.failed();
        } catch (err) {
            console.log(err);
            return ServiceResult.failed();
        }
    }

    static async deleteRealty(id: number): Promise<ServiceResult<void>> {
        try {
            const res = await axios.delete(`${ApiService.baseURL}/realty/${id}`, {
                headers: { ...authorizationHeader() }
            });
            if (res.status === 200) {
                return ServiceResult.success(undefined);
            }
            return ServiceResult.failed();
        } catch (err) {
            console.log(err);
            return ServiceResult.failed();
        }
    }

    static async searchRealties(params: Record<string, any>): Promise<ServiceResult<IRealty[] | undefined>> {
        try {
            const res = await axios.get(`${ApiService.baseURL}/realty/search`, {
                params,
                headers: { ...authorizationHeader() }
            });
            if (res.status === 200) {
                return ServiceResult.success(res.data);
            }
            return ServiceResult.failed();
        } catch (err) {
            console.log(err);
            return ServiceResult.failed();
        }
    }
}
