import { useAuthStore } from "@/store/authStore";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/Card";
import { ShoppingBag, Package, BarChart3, Users } from "lucide-react";

const stats = [
  {
    title: "Total de Pedidos",
    value: "0",
    description: "Pedidos realizados",
    icon: ShoppingBag,
    color: "text-sky-600",
    bgColor: "bg-sky-100 dark:bg-sky-900",
  },
  {
    title: "Produtos",
    value: "0",
    description: "Produtos cadastrados",
    icon: Package,
    color: "text-emerald-600",
    bgColor: "bg-emerald-100 dark:bg-emerald-900",
  },
  {
    title: "Receita",
    value: "R$ 0,00",
    description: "Receita total",
    icon: BarChart3,
    color: "text-violet-600",
    bgColor: "bg-violet-100 dark:bg-violet-900",
  },
  {
    title: "Clientes",
    value: "1",
    description: "Clientes ativos",
    icon: Users,
    color: "text-amber-600",
    bgColor: "bg-amber-100 dark:bg-amber-900",
  },
];

export function Dashboard() {
  const { user } = useAuthStore();

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
          Dashboard
        </h1>
        <p className="mt-2 text-zinc-500 dark:text-zinc-400">
          Bem-vindo, {user?.name}! Aqui está um resumo da sua loja.
        </p>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.title}>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-zinc-500 dark:text-zinc-400">
                  {stat.title}
                </CardTitle>
                <div className={`rounded-lg p-2 ${stat.bgColor}`}>
                  <Icon className={`size-5 ${stat.color}`} />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">
                  {stat.value}
                </div>
                <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
                  {stat.description}
                </p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Pedidos Recentes</CardTitle>
            <CardDescription>
              Últimos pedidos realizados na loja
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex h-48 items-center justify-center text-sm text-zinc-400">
              Nenhum pedido realizado ainda
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Produtos em Destaque</CardTitle>
            <CardDescription>Produtos com maior saída</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex h-48 items-center justify-center text-sm text-zinc-400">
              Nenhum produto cadastrado ainda
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
