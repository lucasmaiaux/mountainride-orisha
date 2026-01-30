import { useEffect, useState } from 'react';
import { Package, Users, FileText, TrendingUp, AlertCircle, CheckCircle } from 'lucide-react';
import { api, Rental, Product, Customer } from '@/lib/api';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface Stats {
  totalProducts: number;
  availableProducts: number;
  totalCustomers: number;
  activeRentals: number;
  completedRentals: number;
  totalRevenue: number;
}

export default function Dashboard() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [recentRentals, setRecentRentals] = useState<Rental[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [products, customers, rentals] = await Promise.all([
          api.getProducts(),
          api.getCustomers(),
          api.getRentals(),
        ]);

        const availableProducts = products.filter((p) => p.available).length;
        const activeRentals = rentals.filter((r) => r.status === 'ACTIVE');
        const completedRentals = rentals.filter((r) => r.status === 'COMPLETED');
        const totalRevenue = rentals.reduce((sum, r) => sum + r.totalPrice, 0);

        setStats({
          totalProducts: products.length,
          availableProducts,
          totalCustomers: customers.length,
          activeRentals: activeRentals.length,
          completedRentals: completedRentals.length,
          totalRevenue,
        });

        // Trier par date de début décroissante et prendre les 5 dernières
        const sorted = [...rentals].sort(
          (a, b) => new Date(b.startDate).getTime() - new Date(a.startDate).getTime()
        );
        setRecentRentals(sorted.slice(0, 5));
      } catch (err: any) {
        setError(err.message || 'Erreur lors du chargement des données');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-lg bg-destructive/10 p-6 text-center">
        <AlertCircle className="mx-auto h-12 w-12 text-destructive" />
        <p className="mt-4 text-destructive">{error}</p>
        <p className="mt-2 text-sm text-muted-foreground">
          Vérifiez que l'API est accessible et que vous êtes bien connecté.
        </p>
      </div>
    );
  }

  const statCards = [
    {
      title: 'Locations actives',
      value: stats?.activeRentals || 0,
      icon: FileText,
      color: 'text-warning',
      bgColor: 'bg-warning/10',
    },
    {
      title: 'Produits disponibles',
      value: `${stats?.availableProducts || 0} / ${stats?.totalProducts || 0}`,
      icon: Package,
      color: 'text-success',
      bgColor: 'bg-success/10',
    },
    {
      title: 'Clients enregistrés',
      value: stats?.totalCustomers || 0,
      icon: Users,
      color: 'text-primary',
      bgColor: 'bg-primary/10',
    },
    {
      title: 'Chiffre d\'affaires',
      value: `${(stats?.totalRevenue || 0).toFixed(2)} €`,
      icon: TrendingUp,
      color: 'text-accent-foreground',
      bgColor: 'bg-accent',
    },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Tableau de bord</h1>
        <p className="text-muted-foreground">Vue d'ensemble de votre activité de location</p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {statCards.map((stat) => (
          <Card key={stat.title} className="stat-card">
            <CardContent className="p-0">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">{stat.title}</p>
                  <p className="mt-1 text-2xl font-bold">{stat.value}</p>
                </div>
                <div className={cn('rounded-lg p-3', stat.bgColor)}>
                  <stat.icon className={cn('h-6 w-6', stat.color)} />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Recent Rentals */}
      <Card>
        <CardHeader>
          <CardTitle>Locations récentes</CardTitle>
          <CardDescription>Les 5 dernières locations enregistrées</CardDescription>
        </CardHeader>
        <CardContent>
          {recentRentals.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">Aucune location trouvée</p>
          ) : (
            <div className="space-y-4">
              {recentRentals.map((rental) => (
                <div
                  key={rental.id}
                  className="flex items-center justify-between rounded-lg border p-4 table-row-hover"
                >
                  <div className="flex items-center gap-4">
                    <div
                      className={cn(
                        'flex h-10 w-10 items-center justify-center rounded-full',
                        rental.status === 'ACTIVE' ? 'bg-warning/10' : 'bg-muted'
                      )}
                    >
                      {rental.status === 'ACTIVE' ? (
                        <AlertCircle className="h-5 w-5 text-warning" />
                      ) : (
                        <CheckCircle className="h-5 w-5 text-muted-foreground" />
                      )}
                    </div>
                    <div>
                      <p className="font-medium">
                        {rental.customer.firstName} {rental.customer.lastName}
                      </p>
                      <p className="text-sm text-muted-foreground">{rental.code}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <Badge
                      variant="outline"
                      className={cn(
                        rental.status === 'ACTIVE' ? 'badge-active' : 'badge-completed'
                      )}
                    >
                      {rental.status === 'ACTIVE' ? 'En cours' : 'Terminée'}
                    </Badge>
                    <p className="mt-1 text-sm font-medium">{rental.totalPrice.toFixed(2)} €</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
