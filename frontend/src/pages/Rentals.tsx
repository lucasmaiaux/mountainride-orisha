import { useEffect, useState } from 'react';
import { Plus, Search, CheckCircle, Eye, Trash2, AlertCircle } from 'lucide-react';
import { api, Rental, RentalItem } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import NewRentalDialog from '@/components/rentals/NewRentalDialog';

export default function Rentals() {
  const [rentals, setRentals] = useState<Rental[]>([]);
  const [filteredRentals, setFilteredRentals] = useState<Rental[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedRental, setSelectedRental] = useState<Rental | null>(null);
  const [rentalItems, setRentalItems] = useState<RentalItem[]>([]);
  const [showDetails, setShowDetails] = useState(false);
  const [showNewRental, setShowNewRental] = useState(false);
  const [showFinishConfirm, setShowFinishConfirm] = useState(false);
  const [rentalToFinish, setRentalToFinish] = useState<Rental | null>(null);

  const fetchRentals = async () => {
    try {
      const data = await api.getRentals();
      const sorted = [...data].sort(
        (a, b) => new Date(b.startDate).getTime() - new Date(a.startDate).getTime()
      );
      setRentals(sorted);
      setFilteredRentals(sorted);
    } catch (err: any) {
      toast.error(err.message || 'Erreur lors du chargement');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRentals();
  }, []);

  useEffect(() => {
    let result = rentals;

    if (statusFilter !== 'all') {
      result = result.filter((r) => r.status === statusFilter);
    }

    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(
        (r) =>
          r.code.toLowerCase().includes(term) ||
          r.customer.firstName.toLowerCase().includes(term) ||
          r.customer.lastName.toLowerCase().includes(term) ||
          r.customer.phoneNumber.includes(term)
      );
    }

    setFilteredRentals(result);
  }, [rentals, searchTerm, statusFilter]);

  const handleViewDetails = async (rental: Rental) => {
    setSelectedRental(rental);
    setRentalItems([]);
    try {
      const items = await api.getRentalItems(rental.id);
      setRentalItems(items || []);
      setShowDetails(true);
    } catch (err: any) {
      toast.error(err.message || 'Erreur lors du chargement des articles');
      setShowDetails(true);
    }
  };

  const handleFinishRental = async () => {
    if (!rentalToFinish) return;
    try {
      await api.finishRental(rentalToFinish.id);
      toast.success('Location terminée avec succès');
      setShowFinishConfirm(false);
      setRentalToFinish(null);
      fetchRentals();
    } catch (err: any) {
      toast.error(err.message || 'Erreur lors de la clôture');
    }
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  };

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Locations</h1>
          <p className="text-muted-foreground">Gérez les locations de matériel</p>
        </div>
        <Button onClick={() => setShowNewRental(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Nouvelle location
        </Button>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col gap-4 sm:flex-row">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Rechercher par code, nom ou téléphone..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder="Statut" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous les statuts</SelectItem>
                <SelectItem value="ACTIVE">En cours</SelectItem>
                <SelectItem value="COMPLETED">Terminées</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Table */}
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Code</TableHead>
                <TableHead>Client</TableHead>
                <TableHead>Date début</TableHead>
                <TableHead>Date fin</TableHead>
                <TableHead>Statut</TableHead>
                <TableHead className="text-right">Total</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredRentals.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="h-24 text-center">
                    Aucune location trouvée
                  </TableCell>
                </TableRow>
              ) : (
                filteredRentals.map((rental) => (
                  <TableRow key={rental.id} className="table-row-hover">
                    <TableCell className="font-mono text-sm">{rental.code}</TableCell>
                    <TableCell>
                      <div>
                        <p className="font-medium">
                          {rental.customer.firstName} {rental.customer.lastName}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {rental.customer.phoneNumber}
                        </p>
                      </div>
                    </TableCell>
                    <TableCell>{formatDate(rental.startDate)}</TableCell>
                    <TableCell>{rental.endDate ? formatDate(rental.endDate) : '-'}</TableCell>
                    <TableCell>
                      <Badge
                        variant="outline"
                        className={cn(
                          rental.status === 'ACTIVE' ? 'badge-active' : 'badge-completed'
                        )}
                      >
                        {rental.status === 'ACTIVE' ? 'En cours' : 'Terminée'}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right font-medium">
                      {rental.totalPrice.toFixed(2)} €
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleViewDetails(rental)}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        {rental.status === 'ACTIVE' && (
                          <Button
                            variant="ghost"
                            size="icon"
                            className="text-success hover:text-success"
                            onClick={() => {
                              setRentalToFinish(rental);
                              setShowFinishConfirm(true);
                            }}
                          >
                            <CheckCircle className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Details Dialog */}
      <Dialog open={showDetails} onOpenChange={setShowDetails}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Détails de la location</DialogTitle>
            <DialogDescription>{selectedRental?.code}</DialogDescription>
          </DialogHeader>
          {selectedRental && (
            <div className="space-y-6">
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground">Client</h4>
                  <p className="mt-1 font-medium">
                    {selectedRental.customer.firstName} {selectedRental.customer.lastName}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {selectedRental.customer.email}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {selectedRental.customer.phoneNumber}
                  </p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground">Dates</h4>
                  <p className="mt-1">Début : {formatDate(selectedRental.startDate)}</p>
                  <p>
                    Fin : {selectedRental.endDate ? formatDate(selectedRental.endDate) : 'En cours'}
                  </p>
                </div>
              </div>

              <div>
                <h4 className="mb-3 text-sm font-medium text-muted-foreground">
                  Articles loués
                </h4>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Produit</TableHead>
                      <TableHead>Taille</TableHead>
                      <TableHead>Durée</TableHead>
                      <TableHead className="text-right">Prix/jour</TableHead>
                      <TableHead className="text-right">Total</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {rentalItems.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={5} className="text-center text-muted-foreground">
                          Aucun article
                        </TableCell>
                      </TableRow>
                    ) : (
                      rentalItems.map((item) => (
                        <TableRow key={item.id}>
                          <TableCell className="font-medium">{item.product?.name || '-'}</TableCell>
                          <TableCell>{item.product?.size || '-'}</TableCell>
                          <TableCell>{item.duration} jour(s)</TableCell>
                          <TableCell className="text-right">
                            {item.dailyPrice?.toFixed(2) || '0.00'} €
                          </TableCell>
                          <TableCell className="text-right font-medium">
                            {item.finalPrice?.toFixed(2) || '0.00'} €
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>

              <div className="flex justify-between border-t pt-4">
                <span className="font-medium">Total</span>
                <span className="text-xl font-bold">
                  {selectedRental.totalPrice.toFixed(2)} €
                </span>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Finish Confirm Dialog */}
      <Dialog open={showFinishConfirm} onOpenChange={setShowFinishConfirm}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Terminer la location ?</DialogTitle>
            <DialogDescription>
              Cette action va clôturer la location et remettre les produits en disponibilité.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowFinishConfirm(false)}>
              Annuler
            </Button>
            <Button onClick={handleFinishRental} className="bg-success hover:bg-success/90">
              <CheckCircle className="mr-2 h-4 w-4" />
              Terminer
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* New Rental Dialog */}
      <NewRentalDialog
        open={showNewRental}
        onOpenChange={setShowNewRental}
        onSuccess={() => {
          setShowNewRental(false);
          fetchRentals();
        }}
      />
    </div>
  );
}
