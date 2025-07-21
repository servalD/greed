import { config } from 'dotenv';
config();

export class ApiService {
    static readonly baseURL : string = process.env.NEXT_PUBLIC_API_URL as string
}