// Configuration de l'API Mountain Ride Orisha
// IMPORTANT: Modifier cette URL pour pointer vers votre serveur API
export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api';

// Types
export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
}

export interface Customer {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  address: string;
}

export interface ProductType {
  id: number;
  name: string;
}

export interface Product {
  id: number;
  productType: ProductType;
  name: string;
  size: string;
  description: string;
  basePrice: number;
  available: boolean;
}

export interface ProductPrice {
  id: number;
  minDuration: number;
  maxDuration: number;
  dailyPrice: number;
}

export interface Rental {
  id: number;
  customer: Customer;
  code: string;
  startDate: string;
  endDate: string | null;
  status: 'ACTIVE' | 'COMPLETED';
  totalPrice: number;
}

export interface RentalItem {
  id: number;
  product: Product;
  duration: number;
  dailyPrice: number;
  finalPrice: number;
}

export interface StartRentalRequest {
  customer: Omit<Customer, 'id'>;
  items: Array<{ productId: number; duration: number }>;
}

export interface ApiError {
  timeStamp: string;
  message: string;
  httpStatus: number;
}

// Helper pour les requêtes authentifiées
class ApiClient {
  private getToken(): string | null {
    return localStorage.getItem('auth_token');
  }

  private getHeaders(includeAuth: boolean = true): HeadersInit {
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    };
    if (includeAuth) {
      const token = this.getToken();
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }
    }
    return headers;
  }

  private async handleResponse<T>(response: Response): Promise<T> {
    if (!response.ok) {
      const error: ApiError = await response.json().catch(() => ({
        timeStamp: new Date().toISOString(),
        message: 'Erreur de connexion au serveur',
        httpStatus: response.status,
      }));
      throw error;
    }
    if (response.status === 204) {
      return {} as T;
    }
    return response.json();
  }

  // Auth
  async login(credentials: LoginRequest): Promise<LoginResponse> {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: this.getHeaders(false),
      body: JSON.stringify(credentials),
    });
    return this.handleResponse<LoginResponse>(response);
  }

  // Customers
  async getCustomers(): Promise<Customer[]> {
    const response = await fetch(`${API_BASE_URL}/customer`, {
      headers: this.getHeaders(),
    });
    return this.handleResponse<Customer[]>(response);
  }

  async getCustomer(id: number): Promise<Customer> {
    const response = await fetch(`${API_BASE_URL}/customer/${id}`, {
      headers: this.getHeaders(),
    });
    return this.handleResponse<Customer>(response);
  }

  async getCustomerRentals(id: number): Promise<Rental[]> {
    const response = await fetch(`${API_BASE_URL}/customer/${id}/rentals`, {
      headers: this.getHeaders(),
    });
    return this.handleResponse<Rental[]>(response);
  }

  async createCustomer(customer: Omit<Customer, 'id'>): Promise<Customer> {
    const response = await fetch(`${API_BASE_URL}/customer`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify(customer),
    });
    return this.handleResponse<Customer>(response);
  }

  async updateCustomer(id: number, customer: Omit<Customer, 'id'>): Promise<Customer> {
    const response = await fetch(`${API_BASE_URL}/customer/${id}`, {
      method: 'PUT',
      headers: this.getHeaders(),
      body: JSON.stringify(customer),
    });
    return this.handleResponse<Customer>(response);
  }

  async deleteCustomer(id: number): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/customer/${id}`, {
      method: 'DELETE',
      headers: this.getHeaders(),
    });
    return this.handleResponse<void>(response);
  }

  // Product Types
  async getProductTypes(): Promise<ProductType[]> {
    const response = await fetch(`${API_BASE_URL}/product-type`, {
      headers: this.getHeaders(),
    });
    return this.handleResponse<ProductType[]>(response);
  }

  async getProductType(id: number): Promise<ProductType> {
    const response = await fetch(`${API_BASE_URL}/product-type/${id}`, {
      headers: this.getHeaders(),
    });
    return this.handleResponse<ProductType>(response);
  }

  async getProductsByType(typeId: number): Promise<Product[]> {
    const response = await fetch(`${API_BASE_URL}/product-type/${typeId}/products`, {
      headers: this.getHeaders(),
    });
    return this.handleResponse<Product[]>(response);
  }

  async createProductType(productType: Omit<ProductType, 'id'>): Promise<ProductType> {
    const response = await fetch(`${API_BASE_URL}/product-type`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify(productType),
    });
    return this.handleResponse<ProductType>(response);
  }

  async updateProductType(id: number, productType: Omit<ProductType, 'id'>): Promise<ProductType> {
    const response = await fetch(`${API_BASE_URL}/product-type/${id}`, {
      method: 'PUT',
      headers: this.getHeaders(),
      body: JSON.stringify(productType),
    });
    return this.handleResponse<ProductType>(response);
  }

  async deleteProductType(id: number): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/product-type/${id}`, {
      method: 'DELETE',
      headers: this.getHeaders(),
    });
    return this.handleResponse<void>(response);
  }

  // Products
  async getProducts(): Promise<Product[]> {
    const response = await fetch(`${API_BASE_URL}/product`, {
      headers: this.getHeaders(),
    });
    return this.handleResponse<Product[]>(response);
  }

  async getProduct(id: number): Promise<Product> {
    const response = await fetch(`${API_BASE_URL}/product/${id}`, {
      headers: this.getHeaders(),
    });
    return this.handleResponse<Product>(response);
  }

  async getProductPrices(productId: number): Promise<ProductPrice[]> {
    const response = await fetch(`${API_BASE_URL}/product/${productId}/prices`, {
      headers: this.getHeaders(),
    });
    return this.handleResponse<ProductPrice[]>(response);
  }

  async createProduct(product: { productTypeId: number; name: string; size: string; description: string; basePrice: number }): Promise<Product> {
    const response = await fetch(`${API_BASE_URL}/product`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify(product),
    });
    return this.handleResponse<Product>(response);
  }

  async updateProduct(id: number, product: { productTypeId: number; name: string; size: string; description: string; basePrice: number }): Promise<Product> {
    const response = await fetch(`${API_BASE_URL}/product/${id}`, {
      method: 'PUT',
      headers: this.getHeaders(),
      body: JSON.stringify(product),
    });
    return this.handleResponse<Product>(response);
  }

  async deleteProduct(id: number): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/product/${id}`, {
      method: 'DELETE',
      headers: this.getHeaders(),
    });
    return this.handleResponse<void>(response);
  }

  // Rentals
  async getRentals(): Promise<Rental[]> {
    const response = await fetch(`${API_BASE_URL}/rental`, {
      headers: this.getHeaders(),
    });
    return this.handleResponse<Rental[]>(response);
  }

  async getRental(id: number): Promise<Rental> {
    const response = await fetch(`${API_BASE_URL}/rental/${id}`, {
      headers: this.getHeaders(),
    });
    return this.handleResponse<Rental>(response);
  }

  async getRentalItems(rentalId: number): Promise<RentalItem[]> {
    const response = await fetch(`${API_BASE_URL}/rental/${rentalId}/items`, {
      headers: this.getHeaders(),
    });
    return this.handleResponse<RentalItem[]>(response);
  }

  async searchRentals(params: { code?: string; lastName?: string; phoneNumber?: string }): Promise<Rental[]> {
    const searchParams = new URLSearchParams();
    if (params.code) searchParams.append('code', params.code);
    if (params.lastName) searchParams.append('lastName', params.lastName);
    if (params.phoneNumber) searchParams.append('phoneNumber', params.phoneNumber);
    
    const response = await fetch(`${API_BASE_URL}/rental/search?${searchParams.toString()}`, {
      headers: this.getHeaders(),
    });
    return this.handleResponse<Rental[]>(response);
  }

  async startRental(request: StartRentalRequest): Promise<Rental> {
    const response = await fetch(`${API_BASE_URL}/rental/start`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify(request),
    });
    return this.handleResponse<Rental>(response);
  }

  async finishRental(id: number): Promise<Rental> {
    const response = await fetch(`${API_BASE_URL}/rental/${id}/finish`, {
      method: 'POST',
      headers: this.getHeaders(),
    });
    return this.handleResponse<Rental>(response);
  }

  async deleteRental(id: number): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/rental/${id}`, {
      method: 'DELETE',
      headers: this.getHeaders(),
    });
    return this.handleResponse<void>(response);
  }
}

export const api = new ApiClient();
