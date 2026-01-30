import { useEffect, useState } from 'react';
import { Plus, Search, Pencil, Trash2, FileText } from 'lucide-react';
import { api, Customer, Rental } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
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
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

export default function Customers() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [filteredCustomers, setFilteredCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  // Dialog states
  const [showForm, setShowForm] = useState(false);
  const [showDelete, setShowDelete] = useState(false);
  const [showRentals, setShowRentals] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null);
  const [customerToDelete, setCustomerToDelete] = useState<Customer | null>(null);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [customerRentals, setCustomerRentals] = useState<Rental[]>([]);
  const [submitting, setSubmitting] = useState(false);

  // Form state
  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phoneNumber: '',
    address: '',
  });

  const fetchCustomers = async () => {
    try {
      const data = await api.getCustomers();
      setCustomers(data);
      setFilteredCustomers(data);
    } catch (err: any) {
      toast.error(err.message || 'Erreur lors du chargement');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  useEffect(() => {
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      setFilteredCustomers(
        customers.filter(
          (c) =>
            c.firstName.toLowerCase().includes(term) ||
            c.lastName.toLowerCase().includes(term) ||
            c.email.toLowerCase().includes(term) ||
            c.phoneNumber.includes(term)
        )
      );
    } else {
      setFilteredCustomers(customers);
    }
  }, [customers, searchTerm]);

  const openCreateForm = () => {
    setEditingCustomer(null);
    setForm({
      firstName: '',
      lastName: '',
      email: '',
      phoneNumber: '',
      address: '',
    });
    setShowForm(true);
  };

  const openEditForm = (customer: Customer) => {
    setEditingCustomer(customer);
    setForm({
      firstName: customer.firstName,
      lastName: customer.lastName,
      email: customer.email,
      phoneNumber: customer.phoneNumber,
      address: customer.address,
    });
    setShowForm(true);
  };

  const handleViewRentals = async (customer: Customer) => {
    setSelectedCustomer(customer);
    try {
      const rentals = await api.getCustomerRentals(customer.id);
      setCustomerRentals(rentals);
      setShowRentals(true);
    } catch (err: any) {
      toast.error(err.message || 'Erreur lors du chargement des locations');
    }
  };

  const handleSubmit = async () => {
    if (!form.firstName || !form.lastName || !form.email || !form.phoneNumber) {
      toast.error('Veuillez remplir tous les champs obligatoires');
      return;
    }

    setSubmitting(true);
    try {
      if (editingCustomer) {
        await api.updateCustomer(editingCustomer.id, form);
        toast.success('Client modifié avec succès');
      } else {
        await api.createCustomer(form);
        toast.success('Client créé avec succès');
      }
      setShowForm(false);
      fetchCustomers();
    } catch (err: any) {
      toast.error(err.message || 'Erreur lors de l\'enregistrement');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!customerToDelete) return;
    try {
      await api.deleteCustomer(customerToDelete.id);
      toast.success('Client supprimé');
      setShowDelete(false);
      setCustomerToDelete(null);
      fetchCustomers();
    } catch (err: any) {
      toast.error(err.message || 'Erreur lors de la suppression');
    }
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('fr-FR');
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
          <h1 className="text-3xl font-bold tracking-tight">Clients</h1>
          <p className="text-muted-foreground">Gérez votre base de clients</p>
        </div>
        <Button onClick={openCreateForm}>
          <Plus className="mr-2 h-4 w-4" />
          Nouveau client
        </Button>
      </div>

      {/* Search */}
      <Card>
        <CardContent className="pt-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Rechercher par nom, email ou téléphone..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* Table */}
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nom</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Téléphone</TableHead>
                <TableHead>Adresse</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredCustomers.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="h-24 text-center">
                    Aucun client trouvé
                  </TableCell>
                </TableRow>
              ) : (
                filteredCustomers.map((customer) => (
                  <TableRow key={customer.id} className="table-row-hover">
                    <TableCell className="font-medium">
                      {customer.firstName} {customer.lastName}
                    </TableCell>
                    <TableCell>{customer.email}</TableCell>
                    <TableCell>{customer.phoneNumber}</TableCell>
                    <TableCell className="max-w-[200px] truncate">
                      {customer.address || '-'}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleViewRentals(customer)}
                          title="Voir les locations"
                        >
                          <FileText className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => openEditForm(customer)}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-destructive hover:text-destructive"
                          onClick={() => {
                            setCustomerToDelete(customer);
                            setShowDelete(true);
                          }}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Form Dialog */}
      <Dialog open={showForm} onOpenChange={setShowForm}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {editingCustomer ? 'Modifier le client' : 'Nouveau client'}
            </DialogTitle>
            <DialogDescription>
              {editingCustomer
                ? 'Modifiez les informations du client'
                : 'Ajoutez un nouveau client'}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="firstName">Prénom *</Label>
                <Input
                  id="firstName"
                  value={form.firstName}
                  onChange={(e) => setForm({ ...form, firstName: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName">Nom *</Label>
                <Input
                  id="lastName"
                  value={form.lastName}
                  onChange={(e) => setForm({ ...form, lastName: e.target.value })}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email *</Label>
              <Input
                id="email"
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phoneNumber">Téléphone *</Label>
              <Input
                id="phoneNumber"
                value={form.phoneNumber}
                onChange={(e) => setForm({ ...form, phoneNumber: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="address">Adresse</Label>
              <Input
                id="address"
                value={form.address}
                onChange={(e) => setForm({ ...form, address: e.target.value })}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowForm(false)}>
              Annuler
            </Button>
            <Button onClick={handleSubmit} disabled={submitting}>
              {submitting ? 'Enregistrement...' : editingCustomer ? 'Modifier' : 'Créer'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Rentals Dialog */}
      <Dialog open={showRentals} onOpenChange={setShowRentals}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Historique des locations</DialogTitle>
            <DialogDescription>
              {selectedCustomer?.firstName} {selectedCustomer?.lastName}
            </DialogDescription>
          </DialogHeader>
          {customerRentals.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">
              Aucune location pour ce client
            </p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Code</TableHead>
                  <TableHead>Date début</TableHead>
                  <TableHead>Date fin</TableHead>
                  <TableHead>Statut</TableHead>
                  <TableHead className="text-right">Total</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {customerRentals.map((rental) => (
                  <TableRow key={rental.id}>
                    <TableCell className="font-mono text-sm">{rental.code}</TableCell>
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
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <AlertDialog open={showDelete} onOpenChange={setShowDelete}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Supprimer le client ?</AlertDialogTitle>
            <AlertDialogDescription>
              Cette action est irréversible. Le client "{customerToDelete?.firstName}{' '}
              {customerToDelete?.lastName}" sera définitivement supprimé.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annuler</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Supprimer
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
