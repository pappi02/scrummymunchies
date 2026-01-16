export interface MenuItem {
  id: string;
  name: string;
  description: string;
  category: string;
  price: number;
  image: string;
  tags: string[];
  available: boolean;
  bogoEligible: boolean;
  variants?: {
    group: "size" | "portion";
    options: Array<{ id: string; name: string; price: number }>;
  };
}

export interface Category {
  id: string;
  name: string;
  description: string;
  bogoEligible: boolean;
}

export interface Promo {
  id: string;
  name: string;
  description: string;
  type: "bogo" | "percent" | "fixed";
  daysOfWeek: number[];
  startTime?: string;
  endTime?: string;
  applicableCategories: string[];
  active: boolean;
}

export interface CartItem {
  item: MenuItem;
  quantity: number;
  bogoApplied: boolean;
  unitPrice: number;
  selectedVariantName?: string;
  note?: string;
}

export interface Cart {
  items: CartItem[];
  subtotal: number;
  discount: number;
  total: number;
}
