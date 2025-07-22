export interface IRealty {
    id?: number;
    name: string;
    user_id: number;
    street_number: string;
    street_name: string;
    complement_address?: string;
    city: string;
    zip_code: string;
    region: string;
    country: string;
    address: string;
    promoter: number;
    image_url: string;
    flat_count: number;
}
