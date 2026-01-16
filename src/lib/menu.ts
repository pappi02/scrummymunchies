import menuData from "@/data/menu.json";
import { MenuItem, Promo, CartItem, Cart } from "@/types";

export function getMenuItems(): MenuItem[] {
  return menuData.items as MenuItem[];
}

export function getCategories() {
  return menuData.categories;
}

export function getPromos(): Promo[] {
  return menuData.promos as Promo[];
}

export function getActivePromo(): Promo | null {
  const now = new Date();
  const dayOfWeek = now.getDay(); // 0 = Sunday, 1 = Monday, ..., 5 = Friday, 6 = Saturday
  const activePromo = getPromos().find((promo) => {
    if (!promo.active) return false;
    if (!promo.daysOfWeek.includes(dayOfWeek)) return false;
    // All-day promotion; ignore time constraints
    return true;
  });

  return activePromo || null;
}

export function isBogoActive(): boolean {
  const promo = getActivePromo();
  return promo?.type === "bogo" || false;
}

export function calculateCart(cartItems: CartItem[]): Cart {
  let subtotal = 0;
  let discount = 0;

  // Group items by BOGO eligibility
  const bogoItems = cartItems.filter((item) => item.item.bogoEligible);
  const regularItems = cartItems.filter((item) => !item.item.bogoEligible);

  // Calculate regular items
  regularItems.forEach((cartItem) => {
    subtotal += cartItem.unitPrice * cartItem.quantity;
  });

  // Calculate BOGO items
  if (isBogoActive() && bogoItems.length > 0) {
    bogoItems.forEach((cartItem) => {
      const itemTotal = cartItem.unitPrice * cartItem.quantity;
      subtotal += itemTotal;

      // BOGO: Buy 1 Get 1 Free - for every pizza purchased, get one free
      // So if quantity is 1, customer gets 2 pizzas but pays for 1
      // If quantity is 3, customer gets 6 pizzas but pays for 3
      const freePizzas = cartItem.quantity;
      const itemDiscount = freePizzas * cartItem.unitPrice;
      discount += itemDiscount;
    });
  } else {
    // No BOGO active, just add to subtotal
    bogoItems.forEach((cartItem) => {
      subtotal += cartItem.unitPrice * cartItem.quantity;
    });
  }

  const total = subtotal - discount;

  return {
    items: cartItems,
    subtotal,
    discount,
    total,
  };
}

export function formatPrice(price: number): string {
  return `KES ${price.toLocaleString()}`;
}

export function getBogoEligibleCount(cartItems: CartItem[]): number {
  return cartItems
    .filter((item) => item.item.bogoEligible)
    .reduce((sum, item) => sum + item.quantity, 0);
}

export function getNextBogoDay(): string {
  const now = new Date();
  const currentDay = now.getDay();
  
  // Days: 0 = Sun, 1 = Mon, 2 = Tue, 3 = Wed, 4 = Thu, 5 = Fri, 6 = Sat
  const bogoDays = [2, 5]; // Tuesday and Friday
  
  let daysUntilNext = 7;
  for (const bogoDay of bogoDays) {
    let diff = bogoDay - currentDay;
    if (diff <= 0) diff += 7;
    if (diff < daysUntilNext) daysUntilNext = diff;
  }
  
  if (daysUntilNext === 0) return "Today";
  if (daysUntilNext === 1) return "Tomorrow";
  
  const nextDate = new Date(now);
  nextDate.setDate(now.getDate() + daysUntilNext);
  return nextDate.toLocaleDateString("en-US", { weekday: "long", month: "short", day: "numeric" });
}
