import { useEffect, useState } from 'react';
import { Plus, Search, Pencil, Trash2 } from 'lucide-react';
import { api, Product, ProductType } from '@/lib/api';
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
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
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

export default function Products() {
  const [products, setProducts] = useState<Product[]>([]);
  const [productTypes, setProductTypes] = useState<ProductType[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [availabilityFilter, setAvailabilityFilter] = useState<string>('all');

  // Dialog states
  const [showForm, setShowForm] = useState(false);
  const [showDelete, setShowDelete] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [productToDelete, setProductToDelete] = useState<Product | null>(null);
  const [submitting, setSubmitting] = useState(false);

  // Form state
  const [form, setForm] = useState({
    productTypeId: '',
    name: '',
    size: '',
    description: '',
    basePrice: '',
  });

  const fetchData = async () => {
    try {
      const [prods, types] = await Promise.all([
        api.getProducts(),
        api.getProductTypes(),
      ]);
      setProducts(prods);
      setFilteredProducts(prods);
      setProductTypes(types);
    } catch (err: any) {
      toast.error(err.message || 'Erreur lors du chargement');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    let result = products;

    if (typeFilter !== 'all') {
      result = result.filter((p) => p.productType.id.toString() === typeFilter);
    }

    if (availabilityFilter !== 'all') {
      const isAvailable = availabilityFilter === 'available';
      result = result.filter((p) => p.available === isAvailable);
    }

    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(term) ||
          p.size.toLowerCase().includes(term) ||
          p.description.toLowerCase().includes(term)
      );
    }

    setFilteredProducts(result);
  }, [products, searchTerm, typeFilter, availabilityFilter]);

  const openCreateForm = () => {
    setEditingProduct(null);
    setForm({
      productTypeId: productTypes[0]?.id.toString() || '',
      name: '',
      size: '',
      description: '',
      basePrice: '',
    });
    setShowForm(true);
  };

  const openEditForm = (product: Product) => {
    setEditingProduct(product);
    setForm({
      productTypeId: product.productType.id.toString(),
      name: product.name,
      size: product.size,
      description: product.description,
      basePrice: product.basePrice.toString(),
    });
    setShowForm(true);
  };

  const handleSubmit = async () => {
    if (!form.productTypeId || !form.name || !form.basePrice) {
      toast.error('Veuillez remplir tous les champs obligatoires');
      return;
    }

    setSubmitting(true);
    try {
      const data = {
        productTypeId: parseInt(form.productTypeId),
        name: form.name,
        size: form.size,
        description: form.description,
        basePrice: parseFloat(form.basePrice),
      };

      if (editingProduct) {
        await api.updateProduct(editingProduct.id, data);
        toast.success('Produit modifié avec succès');
      } else {
        await api.createProduct(data);
        toast.success('Produit créé avec succès');
      }
      setShowForm(false);
      fetchData();
    } catch (err: any) {
      toast.error(err.message || 'Erreur lors de l\'enregistrement');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!productToDelete) return;
    try {
      await api.deleteProduct(productToDelete.id);
      toast.success('Produit supprimé');
      setShowDelete(false);
      setProductToDelete(null);
      fetchData();
    } catch (err: any) {
      toast.error(err.message || 'Erreur lors de la suppression');
    }
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
          <h1 className="text-3xl font-bold tracking-tight">Produits</h1>
          <p className="text-muted-foreground">Gérez votre inventaire de matériel</p>
        </div>
        <Button onClick={openCreateForm}>
          <Plus className="mr-2 h-4 w-4" />
          Nouveau produit
        </Button>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col gap-4 sm:flex-row">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Rechercher un produit..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder="Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous les types</SelectItem>
                {productTypes.map((type) => (
                  <SelectItem key={type.id} value={type.id.toString()}>
                    {type.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={availabilityFilter} onValueChange={setAvailabilityFilter}>
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder="Disponibilité" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous</SelectItem>
                <SelectItem value="available">Disponibles</SelectItem>
                <SelectItem value="unavailable">En location</SelectItem>
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
                <TableHead>Nom</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Taille</TableHead>
                <TableHead>Prix/jour</TableHead>
                <TableHead>Statut</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredProducts.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="h-24 text-center">
                    Aucun produit trouvé
                  </TableCell>
                </TableRow>
              ) : (
                filteredProducts.map((product) => (
                  <TableRow key={product.id} className="table-row-hover">
                    <TableCell>
                      <div>
                        <p className="font-medium">{product.name}</p>
                        {product.description && (
                          <p className="text-sm text-muted-foreground line-clamp-1">
                            {product.description}
                          </p>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary">{product.productType.name}</Badge>
                    </TableCell>
                    <TableCell>{product.size}</TableCell>
                    <TableCell className="font-medium">
                      {product.basePrice.toFixed(2)} €
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant="outline"
                        className={cn(
                          product.available ? 'badge-available' : 'badge-unavailable'
                        )}
                      >
                        {product.available ? 'Disponible' : 'En location'}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => openEditForm(product)}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-destructive hover:text-destructive"
                          onClick={() => {
                            setProductToDelete(product);
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
              {editingProduct ? 'Modifier le produit' : 'Nouveau produit'}
            </DialogTitle>
            <DialogDescription>
              {editingProduct
                ? 'Modifiez les informations du produit'
                : 'Ajoutez un nouveau produit à l\'inventaire'}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4">
            <div className="space-y-2">
              <Label htmlFor="productType">Type de produit *</Label>
              <Select
                value={form.productTypeId}
                onValueChange={(value) => setForm({ ...form, productTypeId: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner un type" />
                </SelectTrigger>
                <SelectContent>
                  {productTypes.map((type) => (
                    <SelectItem key={type.id} value={type.id.toString()}>
                      {type.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="name">Nom *</Label>
              <Input
                id="name"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="Ski Alpin Rossignol Experience"
              />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="size">Taille</Label>
                <Input
                  id="size"
                  value={form.size}
                  onChange={(e) => setForm({ ...form, size: e.target.value })}
                  placeholder="170cm"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="basePrice">Prix/jour (€) *</Label>
                <Input
                  id="basePrice"
                  type="number"
                  step="0.01"
                  value={form.basePrice}
                  onChange={(e) => setForm({ ...form, basePrice: e.target.value })}
                  placeholder="35.00"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                placeholder="Ski polyvalent pour pistes"
                rows={3}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowForm(false)}>
              Annuler
            </Button>
            <Button onClick={handleSubmit} disabled={submitting}>
              {submitting ? 'Enregistrement...' : editingProduct ? 'Modifier' : 'Créer'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <AlertDialog open={showDelete} onOpenChange={setShowDelete}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Supprimer le produit ?</AlertDialogTitle>
            <AlertDialogDescription>
              Cette action est irréversible. Le produit "{productToDelete?.name}" sera
              définitivement supprimé.
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
