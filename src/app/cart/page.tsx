"use client";

import Link from "next/link";
import Image from "next/image";
import { useCart } from "@/context/CartContext";
import { calculateCart, formatPrice, isBogoActive } from "@/lib/menu";
import { CartItem } from "@/types";
import { useState } from "react";

export default function CartPage() {
  const { cart, removeFromCart, updateQuantity, clearCart } = useCart();
  const cartCalculation = calculateCart(cart);
  const bogoActive = isBogoActive();
  const [orderArea, setOrderArea] = useState("");
  const [orderMode, setOrderMode] = useState<"delivery" | "takeaway">("delivery");

  const handleWhatsAppOrder = () => {
    if (cart.length === 0) return;

    let message = "🍕 *Scrummy Munchies Order*\n\n";
    
    // Order Mode
    message += `*Type:* ${orderMode === "delivery" ? "🚚 Delivery" : "🥡 Takeaway"}\n`;
    if (orderArea) {
      message += `*Location/Area:* ${orderArea}\n`;
    }
    message += "\n";

    cart.forEach((cartItem: CartItem) => {
      const actualQuantity = cartItem.item.bogoEligible && bogoActive 
        ? cartItem.quantity * 2 
        : cartItem.quantity;
      
      const line = `• ${cartItem.item.name}${cartItem.selectedVariantName ? ` (${cartItem.selectedVariantName})` : ""} x${actualQuantity}${cartItem.item.bogoEligible && bogoActive ? ' (BOGO)' : ''} - ${formatPrice(
        cartItem.unitPrice * cartItem.quantity
      )}`;
      message += `${line}\n`;
      if (cartItem.note) {
        message += `  _Note: ${cartItem.note}_\n`;
      }
    });

    message += `\n*Subtotal:* ${formatPrice(cartCalculation.subtotal)}`;
    
    if (cartCalculation.discount > 0) {
      message += `\n*BOGO Discount:* -${formatPrice(cartCalculation.discount)}`;
    }
    
    message += `\n*Total:* ${formatPrice(cartCalculation.total)}`;
    message += `\n\n📍 Pickup at: Pink House, Maseno (next to Caroline Hostels)`;

    const whatsappUrl = `https://wa.me/254116909161?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, "_blank");
  };

  if (cart.length === 0) {
    return (
      <main className="section" style={{ minHeight: "60vh" }}>
        <div className="container" style={{ textAlign: "center", paddingTop: 40 }}>
          <h1>Your Cart is Empty 🛒</h1>
          <p style={{ color: "var(--muted)", marginBottom: 20 }}>Looks like you haven't added any pizza yet.</p>
          <Link href="/" className="btn-primary" style={{ display: "inline-block" }}>
            Browse Menu
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="section">
      <div className="container">
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 24 }}>
          <Link href="/" className="btn-ghost" style={{ padding: "8px 12px" }}>← Menu</Link>
          <h1 style={{ margin: 0, fontSize: "2rem" }}>Your Cart</h1>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 32, alignItems: "start" }}>
          
          {/* Cart Items List */}
          <div className="card" style={{ padding: 24 }}>
            {bogoActive && (
              <div
                style={{
                  background: "rgba(20, 184, 94, 0.12)",
                  color: "var(--green)",
                  padding: "12px 16px",
                  borderRadius: 12,
                  marginBottom: 20,
                  fontSize: "0.95rem",
                  fontWeight: 600,
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                }}
              >
                <span>🎉</span>
                Buy 1 Get 1 Free is Active! Quantities are doubled automatically.
              </div>
            )}

            <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
              {cart.map((cartItem) => {
                const itemImage = require(`@/assets/${cartItem.item.image}`);
                return (
                  <div key={`${cartItem.item.id}-${cartItem.selectedVariantName}`} style={{ display: "flex", gap: 16 }}>
                    <div style={{ width: 80, height: 80, flexShrink: 0, borderRadius: 12, overflow: "hidden", background: "#f5f5f5" }}>
                      <Image src={itemImage} alt={cartItem.item.name} width={80} height={80} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start", marginBottom: 4 }}>
                        <h3 style={{ margin: 0, fontSize: "1.1rem" }}>{cartItem.item.name}</h3>
                        <button onClick={() => removeFromCart(cartItem.item.id)} style={{ color: "#ff4d4f", background: "none", border: "none", cursor: "pointer", padding: 4 }}>
                          Remove
                        </button>
                      </div>
                      
                      {cartItem.selectedVariantName && (
                        <div style={{ color: "var(--muted)", fontSize: "0.9rem", marginBottom: 4 }}>{cartItem.selectedVariantName}</div>
                      )}
                      
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 8 }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                           <button
                              onClick={() => updateQuantity(cartItem.item.id, cartItem.quantity - 1)}
                              style={{ width: 28, height: 28, borderRadius: 6, border: "1px solid #ddd", background: "#fff", cursor: "pointer", fontWeight: 700 }}
                            >
                              −
                            </button>
                            <span style={{ minWidth: 20, textAlign: "center", fontWeight: 600 }}>{cartItem.quantity}</span>
                            <button
                              onClick={() => updateQuantity(cartItem.item.id, cartItem.quantity + 1)}
                              style={{ width: 28, height: 28, borderRadius: 6, border: "1px solid #ddd", background: "#fff", cursor: "pointer", fontWeight: 700 }}
                            >
                              +
                            </button>
                        </div>
                        <div style={{ fontWeight: 700 }}>
                          {formatPrice(cartItem.unitPrice * cartItem.quantity)}
                        </div>
                      </div>

                      {cartItem.item.bogoEligible && bogoActive && (
                        <div style={{ fontSize: "0.85rem", color: "var(--green)", marginTop: 6, fontWeight: 600 }}>
                          Getting {cartItem.quantity * 2} items (BOGO)
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Order Details & Summary */}
          <div className="card" style={{ padding: 24, position: "sticky", top: 24 }}>
            <h2 style={{ marginTop: 0, marginBottom: 20, fontSize: "1.4rem" }}>Order Details</h2>
            
            <div style={{ marginBottom: 20 }}>
              <label style={{ display: "block", marginBottom: 8, fontWeight: 700 }}>Order Type</label>
              <div style={{ display: "flex", gap: 10 }}>
                <button
                  onClick={() => setOrderMode("delivery")}
                  className={orderMode === "delivery" ? "btn-primary" : "btn-ghost"}
                  style={{ flex: 1, justifyContent: "center" }}
                >
                  🚚 Delivery
                </button>
                <button
                  onClick={() => setOrderMode("takeaway")}
                  className={orderMode === "takeaway" ? "btn-primary" : "btn-ghost"}
                  style={{ flex: 1, justifyContent: "center" }}
                >
                  🥡 Takeaway
                </button>
              </div>
            </div>

            <div style={{ marginBottom: 24 }}>
              <label style={{ display: "block", marginBottom: 8, fontWeight: 700 }}>
                {orderMode === "delivery" ? "Delivery Location" : "Your Name (for pickup)"}
              </label>
              <input
                type="text"
                value={orderArea}
                onChange={(e) => setOrderArea(e.target.value)}
                placeholder={orderMode === "delivery" ? "e.g. Caroline Hostels, Room 12" : "e.g. John Doe"}
                style={{ width: "100%", padding: 12, borderRadius: 12, border: "1px solid rgba(22,22,22,0.15)", outline: "none" }}
              />
            </div>

            <div style={{ borderTop: "1px solid #eee", paddingTop: 16, display: "flex", flexDirection: "column", gap: 10 }}>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span style={{ color: "var(--muted)" }}>Subtotal</span>
                <strong>{formatPrice(cartCalculation.subtotal)}</strong>
              </div>
              {cartCalculation.discount > 0 && (
                <div style={{ display: "flex", justifyContent: "space-between", color: "var(--green)" }}>
                  <span>BOGO Discount</span>
                  <strong>-{formatPrice(cartCalculation.discount)}</strong>
                </div>
              )}
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: "1.2rem", fontWeight: 800, marginTop: 6 }}>
                <span>Total</span>
                <span>{formatPrice(cartCalculation.total)}</span>
              </div>
            </div>

            <button
              onClick={handleWhatsAppOrder}
              className="btn-primary"
              style={{ width: "100%", marginTop: 24, justifyContent: "center", fontSize: "1.1rem", padding: 16 }}
            >
              Complete Order on WhatsApp
            </button>
          </div>

        </div>
      </div>
    </main>
  );
}
