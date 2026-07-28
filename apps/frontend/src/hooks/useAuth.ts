import { useEffect } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { authApi } from "@/api/auth.api";
import { useAuthStore } from "@/store/authStore";
import { useNavigate } from "react-router-dom";
import type { LoginCredentials, RegisterData } from "@/types";

export function useAuth() {
  const { user, isAuthenticated, setUser, logout } = useAuthStore();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const {
    data: meData,
    isLoading: isLoadingMe,
    isError: isMeError,
  } = useQuery({
    queryKey: ["me"],
    queryFn: authApi.me,
    enabled: !!localStorage.getItem("accessToken"),
    retry: false,
    meta: { skipAuthRefresh: true } as Record<string, unknown>,
  });

  // Atualiza o store quando os dados da query "me" mudam
  useEffect(() => {
    if (meData) {
      setUser(meData);
    }
  }, [meData, setUser]);

  // Se a query "me" falhou, limpa o usuário
  useEffect(() => {
    if (isMeError) {
      setUser(null);
    }
  }, [isMeError, setUser]);

  const loginMutation = useMutation({
    mutationFn: (credentials: LoginCredentials) => authApi.login(credentials),
    onSuccess: async (data) => {
      localStorage.setItem("accessToken", data.accessToken);
      if (data.refreshToken) {
        localStorage.setItem("refreshToken", data.refreshToken);
      }
      try {
        const userData = await authApi.me();
        setUser(userData);
      } catch {
        // fallback: navigate to dashboard anyway
      }
      queryClient.invalidateQueries({ queryKey: ["me"] });
      navigate("/dashboard");
    },
  });

  const registerMutation = useMutation({
    mutationFn: (data: RegisterData) => authApi.register(data),
    onSuccess: () => {
      navigate("/login");
    },
  });

  return {
    user,
    isAuthenticated,
    isLoading: loginMutation.isPending || registerMutation.isPending,
    isLoadingMe,
    login: loginMutation.mutateAsync,
    register: registerMutation.mutateAsync,
    loginError: loginMutation.error,
    registerError: registerMutation.error,
    logout,
  };
}
