import { get, post, put, delete_ } from "@/utils/api";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

export interface Realty {
  id: number;
  name: string;
  user_id: number; // promoter
  address: string;
}

export interface NewRealty {
  name: string;
  user_id: number;
  address: string;
}

// API Functions
export class RealtyAPI {
  // Créer un nouveau bien immobilier
  static async create(realty: NewRealty): Promise<Realty> {
    return post<Realty>("/realty", realty as unknown as Record<string, unknown>);
  }

  // Récupérer un bien immobilier par ID
  static async getById(id: number): Promise<Realty> {
    return get<Realty>(`/realty/${id}`);
  }

  // Récupérer tous les biens immobiliers
  static async getAll(): Promise<Realty[]> {
    return get<Realty[]>("/realty");
  }

  // Mettre à jour un bien immobilier
  static async update(id: number, realty: NewRealty): Promise<Realty> {
    return put<Realty>(`/realty/${id}`, realty as unknown as Record<string, unknown>);
  }

  // Supprimer un bien immobilier
  static async delete(id: number): Promise<string> {
    return delete_<string>(`/realty/${id}`);
  }

  // Rechercher des biens immobiliers
  static async search(query: string): Promise<Realty[]> {
    return get<Realty[]>(`/realty/search?q=${encodeURIComponent(query)}`);
  }
}

// React Query Hooks
export const useRealties = () => {
  return useQuery({
    queryKey: ['realties'],
    queryFn: RealtyAPI.getAll,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useRealty = (id: number) => {
  return useQuery({
    queryKey: ['realty', id],
    queryFn: () => RealtyAPI.getById(id),
    enabled: !!id,
  });
};

export const useSearchRealties = (query: string) => {
  return useQuery({
    queryKey: ['realties', 'search', query],
    queryFn: () => RealtyAPI.search(query),
    enabled: !!query.trim(),
  });
};

export const useCreateRealty = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: RealtyAPI.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['realties'] });
    },
  });
};

export const useUpdateRealty = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, realty }: { id: number; realty: NewRealty }) =>
      RealtyAPI.update(id, realty),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['realties'] });
      queryClient.invalidateQueries({ queryKey: ['realty', data.id] });
    },
  });
};

export const useDeleteRealty = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: RealtyAPI.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['realties'] });
    },
  });
};
