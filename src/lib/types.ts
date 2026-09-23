export type Product = {
  id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  compare_at_price: number | null;
  image_url: string | null;
  images: string[];
  category: string;
  stock: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
};

export type Banner = {
  id: string;
  image_url: string;
  title: string;
  subtitle: string;
  product_id: string | null;
  sort_order: number;
  is_active: boolean;
  created_at: string;
};

export type FeaturedProduct = {
  id: string;
  product_id: string;
  sort_order: number;
  created_at: string;
};

export type CartItem = {
  product_id: string;
  name: string;
  price: number;
  image_url: string | null;
  quantity: number;
};

export type OrderItem = {
  product_id: string;
  name: string;
  price: number;
  quantity: number;
};

export type Order = {
  id: string;
  order_number: string;
  customer_name: string;
  customer_phone: string;
  customer_phone_alt: string | null;
  shipping_address: string;
  area: string;
  city: string;
  items: OrderItem[];
  subtotal: number;
  total: number;
  payment_method: 'cod';
  payment_status: 'pending' | 'paid' | 'failed';
  order_status: 'pending' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled';
  created_at: string;
  updated_at: string;
};
