import { useState, useEffect } from 'react';
import { Plus, Minus, ShoppingCart, UserPlus, UserCheck } from 'lucide-react';
import { api, Product, ProductType } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
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
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

interface CartItem {
  product: Product;
  duration: number;
}

interface NewRentalDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

export default function NewRentalDialog({ open, onOpenChange, onSuccess }: NewRentalDialogProps) {
  const [step, setStep] = useState(1);
  const [products, setProducts] = useState<Product[]>([]);
  const [productTypes, setProductTypes] = useState<ProductType[]>([]);
  const [selectedType, setSelectedType] = useState<string>('all');
  const [cart, setCart] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Customer form
  const [customerMode, setCustomerMode] = useState<'existing' | 'new'>('existing');
  const [customer, setCustomer] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phoneNumber: '',
    address: '',
  });

  useEffect(() => {
    if (open) {
      fetchData();
    }
  }, [open]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [prods, types] = await Promise.all([
        api.getProducts(),
        api.getProductTypes(),
      ]);
      setProducts(prods.filter((p) => p.available));
      setProductTypes(types);
    } catch (err: any) {
      toast.error(err.message || 'Erreur lors du chargement');
    } finally {
      setLoading(false);
    }
  };

  const filteredProducts = selectedType === 'all'
    ? products
    : products.filter((p) => p.productType.id.toString() === selectedType);

  const addToCart = (product: Product) => {
    const existing = cart.find((item) => item.product.id === product.id);
    if (existing) {
      setCart(cart.map((item) =>
        item.product.id === product.id
          ? { ...item, duration: item.duration + 1 }
          : item
      ));
    } else {
      setCart([...cart, { product, duration: 1 }]);
    }
  };

  const updateDuration = (productId: number, duration: number) => {
    if (duration <= 0) {
      setCart(cart.filter((item) => item.product.id !== productId));
    } else {
      setCart(cart.map((item) =>
        item.product.id === productId ? { ...item, duration } : item
      ));
    }
  };

  const removeFromCart = (productId: number) => {
    setCart(cart.filter((item) => item.product.id !== productId));
  };

  const calculateTotal = () => {
    return cart.reduce((sum, item) => {
      // Calcul simplifié basé sur le prix de base
      return sum + item.product.basePrice * item.duration;
    }, 0);
  };

  const handleSubmit = async () => {
    if (cart.length === 0) {
      toast.error('Ajoutez au moins un produit au panier');
      return;
    }

    setSubmitting(true);
    try {
      await api.startRental({
        customer,
        items: cart.map((item) => ({
          productId: item.product.id,
          duration: item.duration,
        })),
      });
      toast.success('Location créée avec succès');
      resetForm();
      onSuccess();
    } catch (err: any) {
      toast.error(err.message || 'Erreur lors de la création');
    } finally {
      setSubmitting(false);
    }
  };

  const resetForm = () => {
    setStep(1);
    setCart([]);
    setCustomerMode('existing');
    setCustomer({
      firstName: '',
      lastName: '',
      email: '',
      phoneNumber: '',
      address: '',
    });
    setSelectedType('all');
  };

  const handleClose = (open: boolean) => {
    if (!open) {
      resetForm();
    }
    onOpenChange(open);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-4xl max-h-[90vh]">
        <DialogHeader>
          <DialogTitle>Nouvelle location</DialogTitle>
          <DialogDescription>
            {step === 1 ? 'Sélectionnez les produits à louer' : 'Informations du client'}
          </DialogDescription>
        </DialogHeader>

        {loading ? (
          <div className="flex h-64 items-center justify-center">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
          </div>
        ) : step === 1 ? (
          <div className="grid gap-6 md:grid-cols-2">
            {/* Products List */}
            <div className="space-y-4">
              <Select value={selectedType} onValueChange={setSelectedType}>
                <SelectTrigger>
                  <SelectValue placeholder="Filtrer par type" />
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

              <ScrollArea className="h-[400px] rounded-lg border p-4">
                <div className="space-y-2">
                  {filteredProducts.length === 0 ? (
                    <p className="text-center text-muted-foreground py-8">
                      Aucun produit disponible
                    </p>
                  ) : (
                    filteredProducts.map((product) => (
                      <div
                        key={product.id}
                        className="flex items-center justify-between rounded-lg border p-3 hover:bg-accent/50 transition-colors"
                      >
                        <div className="flex-1 min-w-0">
                          <p className="font-medium truncate">{product.name}</p>
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Badge variant="secondary" className="text-xs">
                              {product.productType.name}
                            </Badge>
                            <span>{product.size}</span>
                            <span className="font-medium text-foreground">
                              {product.basePrice.toFixed(2)} €/j
                            </span>
                          </div>
                        </div>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => addToCart(product)}
                          disabled={cart.some((item) => item.product.id === product.id)}
                        >
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>
                    ))
                  )}
                </div>
              </ScrollArea>
            </div>

            {/* Cart */}
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <ShoppingCart className="h-5 w-5" />
                <h3 className="font-semibold">Panier ({cart.length})</h3>
              </div>

              <ScrollArea className="h-[400px] rounded-lg border p-4">
                {cart.length === 0 ? (
                  <p className="text-center text-muted-foreground py-8">
                    Le panier est vide
                  </p>
                ) : (
                  <div className="space-y-3">
                    {cart.map((item) => (
                      <div
                        key={item.product.id}
                        className="rounded-lg border p-3 space-y-2"
                      >
                        <div className="flex items-start justify-between">
                          <div>
                            <p className="font-medium">{item.product.name}</p>
                            <p className="text-sm text-muted-foreground">
                              {item.product.size} - {item.product.basePrice.toFixed(2)} €/j
                            </p>
                          </div>
                          <Button
                            size="icon"
                            variant="ghost"
                            className="h-8 w-8 text-destructive"
                            onClick={() => removeFromCart(item.product.id)}
                          >
                            <Minus className="h-4 w-4" />
                          </Button>
                        </div>
                        <div className="flex items-center gap-2">
                          <Label className="text-sm">Durée (jours) :</Label>
                          <Input
                            type="number"
                            min={1}
                            value={item.duration}
                            onChange={(e) =>
                              updateDuration(item.product.id, parseInt(e.target.value) || 1)
                            }
                            className="w-20 h-8"
                          />
                          <span className="ml-auto font-medium">
                            {(item.product.basePrice * item.duration).toFixed(2)} €
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </ScrollArea>

              {cart.length > 0 && (
                <div className="flex justify-between items-center border-t pt-4">
                  <span className="font-medium">Total estimé</span>
                  <span className="text-xl font-bold">{calculateTotal().toFixed(2)} €</span>
                </div>
              )}
            </div>
          </div>
        ) : (
          /* Customer Form */
          <div className="space-y-6">
            {/* Customer Mode Selection */}
            <RadioGroup
              value={customerMode}
              onValueChange={(value: 'existing' | 'new') => setCustomerMode(value)}
              className="grid grid-cols-2 gap-4"
            >
              <div>
                <RadioGroupItem
                  value="existing"
                  id="existing"
                  className="peer sr-only"
                />
                <Label
                  htmlFor="existing"
                  className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary cursor-pointer"
                >
                  <UserCheck className="mb-3 h-6 w-6" />
                  <span className="font-medium">Client existant</span>
                  <span className="text-xs text-muted-foreground">Recherche par email</span>
                </Label>
              </div>
              <div>
                <RadioGroupItem
                  value="new"
                  id="new"
                  className="peer sr-only"
                />
                <Label
                  htmlFor="new"
                  className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary cursor-pointer"
                >
                  <UserPlus className="mb-3 h-6 w-6" />
                  <span className="font-medium">Nouveau client</span>
                  <span className="text-xs text-muted-foreground">Créer un compte</span>
                </Label>
              </div>
            </RadioGroup>

            {/* Form Fields */}
            {customerMode === 'existing' ? (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email du client *</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="client@exemple.fr"
                    value={customer.email}
                    onChange={(e) => setCustomer({ ...customer, email: e.target.value })}
                    required
                  />
                  <p className="text-sm text-muted-foreground">
                    Le client sera retrouvé automatiquement via son email
                  </p>
                </div>
              </div>
            ) : (
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="firstName">Prénom *</Label>
                  <Input
                    id="firstName"
                    value={customer.firstName}
                    onChange={(e) => setCustomer({ ...customer, firstName: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">Nom *</Label>
                  <Input
                    id="lastName"
                    value={customer.lastName}
                    onChange={(e) => setCustomer({ ...customer, lastName: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email *</Label>
                  <Input
                    id="email"
                    type="email"
                    value={customer.email}
                    onChange={(e) => setCustomer({ ...customer, email: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phoneNumber">Téléphone *</Label>
                  <Input
                    id="phoneNumber"
                    value={customer.phoneNumber}
                    onChange={(e) => setCustomer({ ...customer, phoneNumber: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2 sm:col-span-2">
                  <Label htmlFor="address">Adresse</Label>
                  <Input
                    id="address"
                    value={customer.address}
                    onChange={(e) => setCustomer({ ...customer, address: e.target.value })}
                  />
                </div>
              </div>
            )}

            <div className="rounded-lg bg-muted p-4">
              <h4 className="font-medium mb-2">Récapitulatif</h4>
              <p className="text-sm text-muted-foreground">
                {cart.length} produit(s) - Total : {calculateTotal().toFixed(2)} €
              </p>
            </div>
          </div>
        )}

        <DialogFooter>
          {step === 1 ? (
            <>
              <Button variant="outline" onClick={() => handleClose(false)}>
                Annuler
              </Button>
              <Button
                onClick={() => setStep(2)}
                disabled={cart.length === 0}
              >
                Suivant
              </Button>
            </>
          ) : (
            <>
              <Button variant="outline" onClick={() => setStep(1)}>
                Retour
              </Button>
              <Button
                onClick={handleSubmit}
                disabled={
                  submitting ||
                  !customer.email ||
                  (customerMode === 'new' && (
                    !customer.firstName ||
                    !customer.lastName ||
                    !customer.phoneNumber
                  ))
                }
              >
                {submitting ? 'Création...' : 'Créer la location'}
              </Button>
            </>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
