import { Navigate } from "react-router-dom";
import { useAuthStore } from "@/store/authStore";
import { useQuery } from "@tanstack/react-query";
import { authApi } from "@/api/auth.api";
import { useEffect } from "react";

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, setUser } = useAuthStore();

  const { isLoading, isError } = useQuery({
    queryKey: ["me"],
    queryFn: authApi.me,
    enabled: !!localStorage.getItem("accessToken") && !isAuthenticated,
    retry: false,
    meta: { skipAuthRefresh: true } as Record<string, unknown>,
  });

  useEffect(() => {
    if (isError) {
      setUser(null);
    }
  }, [isError, setUser]);

  // Se está carregando a validação do token, mostra um loading
  if (isLoading && !isAuthenticated) {
    return (
      <div className="flex min-h-[80vh] items-center justify-center">
        <div className="size-8 animate-spin rounded-full border-4 border-sky-600 border-t-transparent" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
}
