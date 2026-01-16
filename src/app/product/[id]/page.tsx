"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useMemo } from "react";
import { useCart } from "@/context/CartContext";
import { getMenuItems, formatPrice, isBogoActive } from "@/lib/menu";
import { MenuItem } from "@/types";
import ScrollToTop from "@/components/ScrollToTop";

export default function ProductDetail({ params }: { params: { id: string } }) {
  const router = useRouter();
  const { addToCart } = useCart();
  const items = getMenuItems();
  const item = useMemo<MenuItem | undefined>(() => items.find((i: MenuItem) => i.id === params.id), [items, params.id]);
  const bogoActive = isBogoActive();

  const [quantity, setQuantity] = useState<number>(1);
  const [note, setNote] = useState<string>("");
  const [selectedVariantId, setSelectedVariantId] = useState<string | undefined>(() => item?.variants?.options?.[0]?.id);

  if (!item) {
    return (
      <main className="section">
        <div className="container">
          <div className="card" style={{ padding: 24 }}>
            <h2 style={{ marginTop: 0 }}>Item not found</h2>
            <p style={{ color: "var(--muted)" }}>The product you are looking for doesn't exist.</p>
            <Link href="/" className="btn-primary" style={{ display: "inline-block", marginTop: 10 }}>Back to menu</Link>
          </div>
        </div>
      </main>
    );
  }

  const itemImage = require(`@/assets/${item.image}`);

  const selectedVariant = item.variants?.options.find((opt: { id: string; name: string; price: number }) => opt.id === selectedVariantId);
  const unitPrice = selectedVariant ? selectedVariant.price : item.price;
  const selectedVariantName = selectedVariant ? selectedVariant.name : undefined;

  const handleAddToCart = () => {
    addToCart(item, quantity, unitPrice, selectedVariantName, note);
  };

  const handleProceedToPay = () => {
    addToCart(item, quantity, unitPrice, selectedVariantName, note);
    router.push("/cart");
  };

  return (
    <main>
      <section className="section">
        <div className="container">
          <div className="card" style={{ padding: 24 }}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
              <div>
                <Image src={itemImage} alt={item.name} priority />
              </div>
              <div>
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <Link href="/" className="btn-ghost">← Back</Link>
                  {item.bogoEligible && (
                    <div className="pill" style={{ background: bogoActive ? "rgba(20, 184, 94, 0.12)" : "rgba(247, 201, 72, 0.12)", color: bogoActive ? "var(--green)" : "var(--ink)" }}>
                      {bogoActive ? "BOGO Active" : "BOGO Tue & Fri"}
                    </div>
                  )}
                </div>
                <h1 style={{ margin: "12px 0" }}>{item.name}</h1>
                <p style={{ color: "var(--muted)", marginTop: 0 }}>{item.description}</p>

                <div style={{ marginTop: 16 }}>
                  {item.variants ? (
                    <div>
                      <div style={{ fontWeight: 700, marginBottom: 8 }}>
                        {item.variants.group === "size" ? "Choose size" : "Choose portion"}
                      </div>
                      <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                        {item.variants.options.map((opt: { id: string; name: string; price: number }) => (
                          <button
                            key={opt.id}
                            onClick={() => setSelectedVariantId(opt.id)}
                            className={selectedVariantId === opt.id ? "btn-primary" : "btn-ghost"}
                            style={{ padding: "10px 14px" }}
                          >
                            {opt.name} • {formatPrice(opt.price)}
                          </button>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <div style={{ fontWeight: 700 }}>Price: {formatPrice(item.price)}</div>
                  )}
                </div>

                <div style={{ display: "flex", gap: 12, alignItems: "center", marginTop: 16 }}>
                  <div>
                    <div style={{ fontWeight: 700, marginBottom: 6 }}>Quantity</div>
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <button
                        onClick={() => setQuantity((q) => Math.max(1, q - 1))}
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
                      <span style={{ minWidth: 24, textAlign: "center", fontWeight: 700 }}>{quantity}</span>
                      <button
                        onClick={() => setQuantity((q) => q + 1)}
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
                  </div>
                </div>
                </div>

                <div style={{ marginTop: 16 }}>
                  <div style={{ fontWeight: 700, marginBottom: 6 }}>Preference / Note (optional)</div>
                  <textarea
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                    placeholder="e.g. extra cheese, less spicy"
                    style={{ width: "100%", minHeight: 80, padding: 12, borderRadius: 12, border: "1px solid rgba(22,22,22,0.15)" }}
                  />
                </div>

                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 20, flexWrap: "wrap", gap: 10 }}>
                  <div style={{ fontWeight: 800, fontSize: "1.1rem" }}>Total: {formatPrice(unitPrice * quantity)}</div>
                  <div style={{ display: "flex", gap: 10 }}>
                    <button className="btn-ghost" onClick={handleAddToCart} style={{ padding: "12px 18px", border: "2px solid rgba(22,22,22,0.1)" }}>
                      Add to Cart
                    </button>
                    <button className="btn-primary" onClick={handleProceedToPay} style={{ padding: "12px 18px" }}>
                      Proceed to Pay
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      <ScrollToTop fixed={true} />
    </main>
  );
}
