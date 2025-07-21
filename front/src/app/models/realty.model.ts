export interface IRealty {
    id?: number;
    name: string;
    user_id: number;
    street_number: number;
    street_name: string;
    complement_address?: string;
    city: string;
    zip_code: string;
    region: string;
    country: string;
    address: string;
    image_url: string;
}