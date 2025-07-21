import { get, post, put, delete_ } from "@/utils/api";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

export interface Apartment {
  id: number;
  realty_id: number;
  name: string;
  image_url: string;
}

export interface NewApartment {
  realty_id: number;
  name: string;
  image_url: string;
}

// API Functions
export class ApartmentAPI {
  // Créer un nouvel appartement
  static async create(apartment: NewApartment): Promise<Apartment> {
    return post<Apartment>("/apartments", apartment as unknown as Record<string, unknown>);
  }

  // Récupérer un appartement par ID
  static async getById(id: number): Promise<Apartment> {
    return get<Apartment>(`/apartments/${id}`);
  }

  // Récupérer tous les appartements
  static async getAll(): Promise<Apartment[]> {
    return get<Apartment[]>("/apartments");
  }

  // Récupérer les appartements par bien immobilier
  static async getByRealty(realtyId: number): Promise<Apartment[]> {
    return get<Apartment[]>(`/realty/${realtyId}/apartments`);
  }

  // Mettre à jour un appartement
  static async update(id: number, apartment: NewApartment): Promise<Apartment> {
    return put<Apartment>(`/apartments/${id}`, apartment as unknown as Record<string, unknown>);
  }

  // Supprimer un appartement
  static async delete(id: number): Promise<string> {
    return delete_<string>(`/apartments/${id}`);
  }
}

// React Query Hooks
export const useApartments = () => {
  return useQuery({
    queryKey: ['apartments'],
    queryFn: ApartmentAPI.getAll,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useApartment = (id: number) => {
  return useQuery({
    queryKey: ['apartment', id],
    queryFn: () => ApartmentAPI.getById(id),
    enabled: !!id,
  });
};

export const useApartmentsByRealty = (realtyId: number) => {
  return useQuery({
    queryKey: ['apartments', 'realty', realtyId],
    queryFn: () => ApartmentAPI.getByRealty(realtyId),
    enabled: !!realtyId,
  });
};

export const useCreateApartment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ApartmentAPI.create,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['apartments'] });
      queryClient.invalidateQueries({ queryKey: ['apartments', 'realty', data.realty_id] });
    },
  });
};

export const useUpdateApartment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, apartment }: { id: number; apartment: NewApartment }) =>
      ApartmentAPI.update(id, apartment),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['apartments'] });
      queryClient.invalidateQueries({ queryKey: ['apartment', data.id] });
      queryClient.invalidateQueries({ queryKey: ['apartments', 'realty', data.realty_id] });
    },
  });
};

export const useDeleteApartment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ApartmentAPI.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['apartments'] });
    },
  });
}
