import { useEffect, useState } from 'react';
import { Plus, Pencil, Trash2, Package } from 'lucide-react';
import { api, ProductType, Product } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

export default function ProductTypes() {
  const [productTypes, setProductTypes] = useState<ProductType[]>([]);
  const [loading, setLoading] = useState(true);

  // Dialog states
  const [showForm, setShowForm] = useState(false);
  const [showDelete, setShowDelete] = useState(false);
  const [showProducts, setShowProducts] = useState(false);
  const [editingType, setEditingType] = useState<ProductType | null>(null);
  const [typeToDelete, setTypeToDelete] = useState<ProductType | null>(null);
  const [selectedType, setSelectedType] = useState<ProductType | null>(null);
  const [typeProducts, setTypeProducts] = useState<Product[]>([]);
  const [submitting, setSubmitting] = useState(false);

  // Form state
  const [name, setName] = useState('');

  const fetchProductTypes = async () => {
    try {
      const data = await api.getProductTypes();
      setProductTypes(data);
    } catch (err: any) {
      toast.error(err.message || 'Erreur lors du chargement');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProductTypes();
  }, []);

  const openCreateForm = () => {
    setEditingType(null);
    setName('');
    setShowForm(true);
  };

  const openEditForm = (type: ProductType) => {
    setEditingType(type);
    setName(type.name);
    setShowForm(true);
  };

  const handleViewProducts = async (type: ProductType) => {
    setSelectedType(type);
    try {
      const products = await api.getProductsByType(type.id);
      setTypeProducts(products);
      setShowProducts(true);
    } catch (err: any) {
      toast.error(err.message || 'Erreur lors du chargement des produits');
    }
  };

  const handleSubmit = async () => {
    if (!name.trim()) {
      toast.error('Le nom est obligatoire');
      return;
    }

    setSubmitting(true);
    try {
      if (editingType) {
        await api.updateProductType(editingType.id, { name });
        toast.success('Type modifié avec succès');
      } else {
        await api.createProductType({ name });
        toast.success('Type créé avec succès');
      }
      setShowForm(false);
      fetchProductTypes();
    } catch (err: any) {
      toast.error(err.message || 'Erreur lors de l\'enregistrement');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!typeToDelete) return;
    try {
      await api.deleteProductType(typeToDelete.id);
      toast.success('Type supprimé');
      setShowDelete(false);
      setTypeToDelete(null);
      fetchProductTypes();
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
          <h1 className="text-3xl font-bold tracking-tight">Types de produits</h1>
          <p className="text-muted-foreground">Gérez les catégories de matériel</p>
        </div>
        <Button onClick={openCreateForm}>
          <Plus className="mr-2 h-4 w-4" />
          Nouveau type
        </Button>
      </div>

      {/* Types Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {productTypes.map((type) => (
          <Card key={type.id} className="stat-card">
            <CardContent className="p-0">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                    <Package className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-semibold">{type.name}</p>
                    <button
                      onClick={() => handleViewProducts(type)}
                      className="text-sm text-primary hover:underline"
                    >
                      Voir les produits
                    </button>
                  </div>
                </div>
                <div className="flex gap-1">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => openEditForm(type)}
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-destructive hover:text-destructive"
                    onClick={() => {
                      setTypeToDelete(type);
                      setShowDelete(true);
                    }}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {productTypes.length === 0 && (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Package className="h-12 w-12 text-muted-foreground" />
            <p className="mt-4 text-lg font-medium">Aucun type de produit</p>
            <p className="text-sm text-muted-foreground">
              Créez votre premier type de produit pour commencer
            </p>
            <Button className="mt-4" onClick={openCreateForm}>
              <Plus className="mr-2 h-4 w-4" />
              Créer un type
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Form Dialog */}
      <Dialog open={showForm} onOpenChange={setShowForm}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {editingType ? 'Modifier le type' : 'Nouveau type'}
            </DialogTitle>
            <DialogDescription>
              {editingType
                ? 'Modifiez le nom du type de produit'
                : 'Ajoutez une nouvelle catégorie de matériel'}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-2">
            <Label htmlFor="name">Nom *</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ex: Ski, Snowboard, Casques..."
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowForm(false)}>
              Annuler
            </Button>
            <Button onClick={handleSubmit} disabled={submitting}>
              {submitting ? 'Enregistrement...' : editingType ? 'Modifier' : 'Créer'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Products Dialog */}
      <Dialog open={showProducts} onOpenChange={setShowProducts}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Produits - {selectedType?.name}</DialogTitle>
            <DialogDescription>
              Liste des produits de ce type
            </DialogDescription>
          </DialogHeader>
          {typeProducts.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">
              Aucun produit de ce type
            </p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nom</TableHead>
                  <TableHead>Taille</TableHead>
                  <TableHead>Prix/jour</TableHead>
                  <TableHead>Statut</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {typeProducts.map((product) => (
                  <TableRow key={product.id}>
                    <TableCell className="font-medium">{product.name}</TableCell>
                    <TableCell>{product.size}</TableCell>
                    <TableCell>{product.basePrice.toFixed(2)} €</TableCell>
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
            <AlertDialogTitle>Supprimer le type ?</AlertDialogTitle>
            <AlertDialogDescription>
              Cette action est irréversible. Le type "{typeToDelete?.name}" sera
              définitivement supprimé. Attention : cela peut échouer si des produits
              utilisent encore ce type.
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
