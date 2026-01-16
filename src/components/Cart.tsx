"use client";

import { useCart } from "@/context/CartContext";
import { calculateCart, formatPrice, isBogoActive, getNextBogoDay } from "@/lib/menu";
import { CartItem } from "@/types";

export default function Cart() {
  const { cart, removeFromCart, updateQuantity, clearCart, isCartOpen, closeCart } = useCart();

  if (!isCartOpen) return null;

  const cartCalculation = calculateCart(cart);
  const bogoActive = isBogoActive();

  const handleWhatsAppOrder = () => {
    if (cart.length === 0) return;

    let message = "🍕 *Scrummy Munchies Order*\n\n";
    
    cart.forEach((cartItem: CartItem) => {
      const actualQuantity = cartItem.item.bogoEligible && bogoActive 
        ? cartItem.quantity * 2  // Buy 1 Get 1 Free means double the quantity
        : cartItem.quantity;
      
      const line = `• ${cartItem.item.name}${cartItem.selectedVariantName ? ` (${cartItem.selectedVariantName})` : ""} x${actualQuantity}${cartItem.item.bogoEligible && bogoActive ? ' (BOGO)' : ''} - ${formatPrice(
        cartItem.unitPrice * cartItem.quantity
      )}`;
      message += `${line}\n`;
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

  return (
    <>
      <div
        className="cart-overlay"
        onClick={closeCart}
        style={{
          position: "fixed",
          inset: 0,
          background: "rgba(0, 0, 0, 0.5)",
          zIndex: 40,
          backdropFilter: "blur(4px)",
        }}
      />
      <div
        className="cart-drawer"
        style={{
          position: "fixed",
          right: 0,
          top: 0,
          bottom: 0,
          width: "min(420px, 100vw)",
          background: "#ffffff",
          zIndex: 50,
          boxShadow: "-20px 0 60px rgba(0, 0, 0, 0.15)",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <div
          style={{
            padding: "20px 24px",
            borderBottom: "1px solid rgba(22, 22, 22, 0.1)",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <h2 style={{ margin: 0, fontSize: "1.4rem", fontWeight: 800 }}>Your Order</h2>
          <button
            onClick={closeCart}
            style={{
              background: "none",
              border: "none",
              fontSize: "1.6rem",
              cursor: "pointer",
              padding: 8,
              lineHeight: 1,
            }}
          >
            ×
          </button>
        </div>

        {bogoActive && (
          <div
            style={{
              padding: "14px 24px",
              background: "linear-gradient(135deg, rgba(20, 184, 94, 0.1), rgba(247, 201, 72, 0.1))",
              borderBottom: "1px solid rgba(20, 184, 94, 0.2)",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <span style={{ fontSize: "1.2rem" }}>🎉</span>
              <div>
                <strong style={{ color: "var(--green)", fontSize: "0.95rem" }}>
                  BOGO Active Now!
                </strong>
                <div style={{ fontSize: "0.85rem", color: "var(--muted)" }}>
                  Buy 1 Get 1 on all pizzas
                </div>
              </div>
            </div>
          </div>
        )}

        {!bogoActive && (
          <div
            style={{
              padding: "12px 24px",
              background: "rgba(247, 201, 72, 0.08)",
              borderBottom: "1px solid rgba(228, 20, 28, 0.1)",
              fontSize: "0.9rem",
              color: "var(--muted)",
            }}
          >
            💡 Next BOGO: {getNextBogoDay()}
          </div>
        )}

        <div style={{ flex: 1, overflowY: "auto", padding: "16px 24px" }}>
          {cart.length === 0 ? (
            <div style={{ textAlign: "center", padding: "60px 20px", color: "var(--muted)" }}>
              <div style={{ fontSize: "3rem", marginBottom: 12 }}>🍕</div>
              <p>Your cart is empty</p>
              <p style={{ fontSize: "0.9rem" }}>Add items from the menu to get started!</p>
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              {cart.map((cartItem: CartItem) => (
                <div
                  key={cartItem.item.id}
                  style={{
                    display: "flex",
                    gap: 12,
                    padding: 12,
                    background: "#fafafa",
                    borderRadius: 12,
                  }}
                >
                  <div style={{ flex: 1 }}>
                    <h4 style={{ margin: "0 0 4px", fontSize: "1rem" }}>{cartItem.item.name}</h4>
                    <div style={{ fontSize: "0.9rem", color: "var(--muted)" }}>
                      {cartItem.selectedVariantName ? (
                        <>
                          <strong>{cartItem.selectedVariantName}</strong> • {formatPrice(cartItem.unitPrice)} each
                        </>
                      ) : (
                        <>{formatPrice(cartItem.unitPrice)} each</>
                      )}
                    </div>
                    {cartItem.item.bogoEligible && bogoActive && (
                      <div
                        style={{
                          fontSize: "0.85rem",
                          color: "var(--green)",
                          fontWeight: 700,
                          marginTop: 4,
                        }}
                      >
                        ✓ Buy {cartItem.quantity} Get {cartItem.quantity} Free!
                      </div>
                    )}
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <button
                      onClick={() => updateQuantity(cartItem.item.id, cartItem.quantity - 1)}
                      style={{
                        width: 32,
                        height: 32,
                        border: "1px solid rgba(22, 22, 22, 0.2)",
                        background: "#fff",
                        borderRadius: 8,
                        cursor: "pointer",
                        fontWeight: 700,
                      }}
                    >
                      −
                    </button>
                    <span style={{ minWidth: 24, textAlign: "center", fontWeight: 700 }}>
                      {cartItem.quantity}
                    </span>
                    <button
                      onClick={() => updateQuantity(cartItem.item.id, cartItem.quantity + 1)}
                      style={{
                        width: 32,
                        height: 32,
                        border: "1px solid rgba(22, 22, 22, 0.2)",
                        background: "#fff",
                        borderRadius: 8,
                        cursor: "pointer",
                        fontWeight: 700,
                      }}
                    >
                      +
                    </button>
                    <button
                      onClick={() => removeFromCart(cartItem.item.id)}
                      style={{
                        width: 32,
                        height: 32,
                        border: "none",
                        background: "rgba(228, 20, 28, 0.1)",
                        color: "var(--red)",
                        borderRadius: 8,
                        cursor: "pointer",
                        marginLeft: 4,
                      }}
                    >
                      ×
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {cart.length > 0 && (
          <div
            style={{
              padding: "20px 24px",
              borderTop: "1px solid rgba(22, 22, 22, 0.1)",
              background: "#fafafa",
            }}
          >
            <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 16 }}>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span>Subtotal</span>
                <span>{formatPrice(cartCalculation.subtotal)}</span>
              </div>
              {cartCalculation.discount > 0 && (
                <div style={{ display: "flex", justifyContent: "space-between", color: "var(--green)" }}>
                  <span>BOGO Discount</span>
                  <span>-{formatPrice(cartCalculation.discount)}</span>
                </div>
              )}
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  fontSize: "1.2rem",
                  fontWeight: 800,
                  paddingTop: 10,
                  borderTop: "1px solid rgba(22, 22, 22, 0.1)",
                }}
              >
                <span>Total</span>
                <span>{formatPrice(cartCalculation.total)}</span>
              </div>
            </div>
            <button
              onClick={handleWhatsAppOrder}
              className="btn-primary"
              style={{
                width: "100%",
                justifyContent: "center",
                padding: "16px",
                fontSize: "1rem",
              }}
            >
              Order via WhatsApp
            </button>
            <button
              onClick={clearCart}
              style={{
                width: "100%",
                marginTop: 10,
                padding: "12px",
                background: "none",
                border: "1px solid rgba(22, 22, 22, 0.2)",
                borderRadius: 12,
                cursor: "pointer",
                color: "var(--muted)",
              }}
            >
              Clear cart
            </button>
          </div>
        )}
      </div>
    </>
  );
}
