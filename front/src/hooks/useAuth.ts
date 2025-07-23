import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { redirect } from 'next/navigation';
import { getUser, updateUser, deleteUser, logout as s_logout } from '@/service/auth';
import { useAccount } from 'wagmi';
import { useReadAgencyGuests, useReadManagerGetRole } from '@/contracts/generatedContracts';
import { UserUpdate, UserRoleIds, UserRoleIdLabels } from '@/types/users';
import { useActiveWalletConnectionStatus } from 'thirdweb/react';
import { useEffect, useState } from 'react';

export interface User {
  id: number;
  address: string;
  nonce: string;
  role: UserRoleIds;
  created_at: string;
  updated_at: string;
}

export interface AuthUser {
  user: User;
  token: string;
  refresh_token: string;
}

// Hook pour récupérer l'utilisateur actuel
export const useAuth = () => {
  const queryClient = useQueryClient();
  const { address } = useAccount();
  const connectionStatus = useActiveWalletConnectionStatus();
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Role verification
  const { data: userRole, refetch: refetchUserRole } = useReadManagerGetRole({
    args: [address!],
  });

  const {
    data: user,
    isLoading,
    error,
    refetch
  } = useQuery({
    queryKey: ['auth', 'user'],
    queryFn: getUser,
    enabled: typeof window !== 'undefined' && !!localStorage.getItem('access_token') && connectionStatus === 'connected',
    retry: false,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  const logoutMutation = useMutation({
    mutationFn: s_logout,
    onSuccess: () => {

      // Invalider le cache
      queryClient.invalidateQueries({ queryKey: ['auth', 'user'] });

      // Rediriger vers la page de connexion
      redirect('/');
    },
  });

  const updateUserMutation = useMutation({
    mutationFn: updateUser,
    onSuccess: (updatedUser) => {
      // Mettre à jour le cache utilisateur
      queryClient.setQueryData(['auth', 'user'], updatedUser);
      queryClient.invalidateQueries({ queryKey: ['auth', 'user'] });
    },
    onError: (error) => {
      console.error('Update user failed:', error);
    },
  });

  const deleteUserMutation = useMutation({
    mutationFn: ({ id, password }: { id: number; password: string }) =>
      deleteUser(id, password),
    onSuccess: () => {
      // Nettoyer le stockage local
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');

      // Invalider le cache
      queryClient.invalidateQueries({ queryKey: ['auth', 'user'] });

      // Rediriger vers la page de connexion
      redirect('/');
    },
    onError: (error) => {
      console.error('Delete user failed:', error);
    },
  });

  const logout = () => {
    logoutMutation.mutate();
  };

  const updateUserProfile = async (userData: UserUpdate) => {
    return updateUserMutation.mutateAsync(userData);
  };

  const deleteUserAccount = (id: number, password: string) => {
    deleteUserMutation.mutate({ id, password });
  };

  // console.log(isAuthenticated, user, error, connectionStatus);
  // Met a jour le user si le role du back est différent de selui du front
  useEffect(() => {
    if (user && userRole && user.role !== Number(userRole)) {
      updateUserProfile({
        ...user,
        role: UserRoleIdLabels[Number(userRole)],
      });
    }
  
  }, [userRole]);

  if (user) user.role = userRole ? Number(userRole) : user?.role;

  useEffect(() => {// sync role when address changes
    if (address) {
      refetchUserRole();
      refetch();
    }
  }, [address, refetchUserRole]);

  useEffect(() => {
    if (user && !error && connectionStatus === 'connected') {
      setIsAuthenticated(true);
    } else {
      setIsAuthenticated(false);
    }
  }, [user, error, connectionStatus]);

  return {
    user,
    isLoading,
    error,
    refetch,
    logout,
    updateUserProfile,
    deleteUserAccount,
    isAuthenticated,
    isLoggingOut: logoutMutation.isPending,
    isUpdatingUser: updateUserMutation.isPending,
    isDeletingUser: deleteUserMutation.isPending,
    updateUserError: updateUserMutation.error,
    deleteUserError: deleteUserMutation.error,
  };
};
