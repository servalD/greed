import { ApiService } from "./api.service";
import { IApartment } from "@/app/models/apartment.model";
import axios from 'axios';
import { ServiceResult } from "./service.result";

function authorizationHeader(): Record<string, string> {
    const token = typeof window !== 'undefined' ? localStorage.getItem("access_token") : null;
    return token ? { Authorization: `Bearer ${token}` } : {};
}

export class ApartmentService {
    static async createApartment(data: IApartment): Promise<ServiceResult<IApartment | undefined>> {
        try {
            const res = await axios.post(`${ApiService.baseURL}/apartments`, data, {
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

    static async getApartmentById(id: number): Promise<ServiceResult<IApartment | undefined>> {
        try {
            const res = await axios.get(`${ApiService.baseURL}/apartments/${id}`, {
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

    static async getAllApartments(): Promise<ServiceResult<IApartment[] | undefined>> {
        try {
            const res = await axios.get(`${ApiService.baseURL}/apartments`, {
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

    static async updateApartment(id: number, data: Partial<IApartment>): Promise<ServiceResult<IApartment | undefined>> {
        try {
            const res = await axios.put(`${ApiService.baseURL}/apartments/${id}`, data, {
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

    static async deleteApartment(id: number): Promise<ServiceResult<void>> {
        try {
            const res = await axios.delete(`${ApiService.baseURL}/apartments/${id}`, {
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

    static async getApartmentsByRealty(realty_id: number): Promise<ServiceResult<IApartment[] | undefined>> {
        try {
            const res = await axios.get(`${ApiService.baseURL}/realty/${realty_id}/apartments`, {
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
