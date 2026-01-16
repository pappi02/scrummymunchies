"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { useCart } from "@/context/CartContext";
import Cart from "@/components/Cart";
import ContactForm from "@/components/ContactForm";
import ScrollToTop from "@/components/ScrollToTop";
import { getMenuItems, getCategories, isBogoActive, getNextBogoDay } from "@/lib/menu";
import { MenuItem, CartItem } from "@/types";
import Image from "next/image";
import whatsappLogo from "@/assets/whatsapplogo.png";
import callsLogo from "@/assets/callslogo.png";



export default function Page() {
  const { addToCart, cart, openCart } = useCart();
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [orderMode, setOrderMode] = useState<"delivery" | "takeaway">("delivery");
  const [orderArea, setOrderArea] = useState<string>("");
  
  const menuItems = getMenuItems();
  const categories = getCategories();
  const bogoActive = isBogoActive();
  
  const filteredItems = selectedCategory === "all" 
    ? menuItems 
    : menuItems.filter((item: MenuItem) => item.category === selectedCategory);

  const cartItemCount = cart.reduce((sum: number, item: CartItem) => sum + item.quantity, 0);

  const [isScrolling, setIsScrolling] = useState(false);

  useEffect(() => {
    let timeoutId: NodeJS.Timeout;
    let rafId: number | null = null;

    const handleScroll = () => {
      setIsScrolling(true);
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        setIsScrolling(false);
      }, 150);
    };

    const onScroll = () => {
      if (rafId) return;
      rafId = requestAnimationFrame(() => {
        handleScroll();
        rafId = null;
      });
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      clearTimeout(timeoutId);
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, []);

  return (
    <main>
      <Cart />
      
      <header className="navbar">
        <div className="container nav-inner">
          <div className="brand">
            <span className="brand-mark">SM</span>
            Scrummy Munchies
          </div>
          <div className="nav-actions">
            {bogoActive ? (
              <div className="pill" style={{ background: "rgba(20, 184, 94, 0.12)", color: "var(--green)" }}>
                🎉 BOGO Active Now!
              </div>
            ) : (
              <div className="pill">
                Next BOGO: {getNextBogoDay()}
              </div>
            )}
            <button
              onClick={openCart}
              className="btn-ghost"
              style={{ position: "relative" }}
            >
              🛒 Cart
              {cartItemCount > 0 && (
                <span
                  style={{
                    position: "absolute",
                    top: -8,
                    right: -8,
                    background: "var(--red)",
                    color: "#fff",
                    borderRadius: 999,
                    width: 22,
                    height: 22,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "0.75rem",
                    fontWeight: 700,
                  }}
                >
                  {cartItemCount}
                </span>
              )}
            </button>
            <a className="btn-primary" href="https://wa.me/254116909161" target="_blank" rel="noreferrer">
              WhatsApp Order
            </a>
          </div>
        </div>
      </header>

      <section className="hero hero-modern">
        <div className="hero-wave" aria-hidden="true" />
        <div className="container hero-grid">
          <div>
            <span className="badge">
              <span className="badge-dot" />
              Scrummy Munchies • Maseno
            </span>
            <h1 className="display" style={{ marginTop: 10 }}>Order Your Favourite Pizza</h1>
            <p className="lead">
              Wherever you are, we’ll serve something to make your favourite food moment. Pick delivery or takeaway to get started.
            </p>

            <div className="order-card">
              <div className="order-tabs">
                <button
                  className={orderMode === "delivery" ? "tab active" : "tab"}
                  onClick={() => setOrderMode("delivery")}
                >
                  🚚 Delivery
                </button>
                <button
                  className={orderMode === "takeaway" ? "tab active" : "tab"}
                  onClick={() => setOrderMode("takeaway")}
                >
                  🥡 Takeaway
                </button>
              </div>
              <div className="order-fields">
                <div className="field">
                  <label>Choose area</label>
                  <input
                    type="text"
                    placeholder={orderMode === "delivery" ? "e.g. Caroline Hostels, Maseno" : "e.g. Pink House pickup"}
                    value={orderArea}
                    onChange={(e) => setOrderArea(e.target.value)}
                  />
                </div>
                <button
                  className="btn-primary"
                  onClick={openCart}
                  style={{ width: "100%", justifyContent: "center" }}
                >
                  Start Order
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="ribbon">Menu highlights</div>
          <h2 className="display" style={{ fontSize: "2rem", margin: "14px 0" }}>
            The crowd-pleasers (Kenyan pricing)
          </h2>
          <p className="section-lead">
            A showcase of your bestsellers. Click "Add to Cart" to try the BOGO pricing engine live.
          </p>
          
          <div style={{ display: "flex", gap: 10, marginBottom: 24, flexWrap: "wrap" }}>
            <button
              onClick={() => setSelectedCategory("all")}
              className={selectedCategory === "all" ? "btn-primary" : "btn-ghost"}
              style={{ padding: "10px 16px" }}
            >
              All Items
            </button>
            {categories.map((cat: { id: string; name: string }) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={selectedCategory === cat.id ? "btn-primary" : "btn-ghost"}
                style={{ padding: "10px 16px" }}
              >
                {cat.name}
              </button>
            ))}
          </div>

          <div className="menu-grid">
            {filteredItems.map((item: MenuItem, index: number) => {
              const itemImage = require(`@/assets/${item.image}`);
              return (
                <div className="menu-card" key={item.id}>
                  <Link href={`/product/${item.id}`} style={{ display: "block" }}>
                    <Image src={itemImage} alt={item.name} priority={index < 4} />
                  </Link>
                  <div className="menu-body">
                    <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 8 }}>
                      {item.tags.map((tag: string) => (
                        <div key={tag} className="tag" style={{ fontSize: "0.8rem", padding: "4px 8px" }}>
                          <span style={{ width: 6, height: 6, borderRadius: 999, background: "var(--green)" }} />
                          {tag}
                        </div>
                      ))}
                    </div>
                    <h3 style={{ margin: "4px 0" }}>
                      <Link href={`/product/${item.id}`} style={{ color: "inherit", textDecoration: "none" }}>
                        {item.name}
                      </Link>
                    </h3>
                    <p style={{ margin: 0, color: "var(--muted)", fontSize: "0.9rem" }}>{item.description}</p>
                    <div className="menu-meta" style={{ marginTop: 12 }}>
                      <span style={{ fontSize: "1.1rem", fontWeight: 700 }}>KES {item.price.toLocaleString()}</span>
                      {item.bogoEligible && (
                        <span style={{ color: "var(--green)", fontSize: "0.85rem", fontWeight: 700 }}>
                          {bogoActive ? "BOGO NOW" : "BOGO Tue & Fri"}
                        </span>
                      )}
                    </div>
                    <button
                      onClick={() => addToCart(item)}
                      className="btn-primary"
                      style={{ width: "100%", marginTop: 12, justifyContent: "center", padding: "10px" }}
                    >
                      Add to Cart
                    </button>
                    <Link
                      href={`/product/${item.id}`}
                      className="btn-ghost"
                      style={{ width: "100%", marginTop: 8, justifyContent: "center", padding: "10px", textAlign: "center", display: "inline-block" }}
                    >
                      View details
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="section" style={{ paddingTop: 10 }}>
        <div className="container">
          <ContactForm />
        </div>
      </section>

      <section className="section" style={{ paddingTop: 10 }}>
        <div className="container">
          <div className="ribbon">Where to find us</div>
          <h2 className="display" style={{ fontSize: "2.1rem", margin: "14px 0" }}>
            Maseno — Pink House (next to Caroline Hostels)
          </h2>
          <p className="section-lead">
            Call or WhatsApp to order ahead; we will confirm your pickup time. Delivery and live tracking are lined up for
            the full build.
          </p>
          <div className="meta-grid">
            <div className="meta-card">
              <strong>Order</strong>
              <div style={{ color: "var(--muted)" }}>WhatsApp 0116909161 or call 0116909161</div>
            </div>
            <div className="meta-card">
              <strong>Deal schedule</strong>
              <div style={{ color: "var(--muted)" }}>Every Tue & Fri • All Day • Buy 1 Get 1</div>
            </div>
            <div className="meta-card">
              <strong>What's next</strong>
              <div style={{ color: "var(--muted)" }}>Online ordering, payment links, delivery tracking, loyalty</div>
            </div>
          </div>
          <div className="cta-row" style={{ marginTop: 22 }}>
            <a className="btn-primary" href="https://wa.me/254116909161" target="_blank" rel="noreferrer">
              WhatsApp us now
            </a>
            <a className="btn-ghost" href="tel:0116909161">
              Call 0116909161
            </a>
          </div>
        </div>
      </section>

      <div 
        className="action-bar" 
        style={{ 
          opacity: isScrolling ? 0.3 : 1, 
          transition: "opacity 0.3s ease",
          pointerEvents: isScrolling ? "none" : "auto" 
        }}
        onMouseEnter={() => setIsScrolling(false)}
      >
        <button onClick={openCart} className="action-btn primary" style={{ position: "relative" }}>
          🛒 Cart
          {cartItemCount > 0 && (
            <span
              style={{
                position: "absolute",
                top: -6,
                right: -6,
                background: "var(--yellow)",
                color: "var(--ink)",
                borderRadius: 999,
                width: 20,
                height: 20,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "0.7rem",
                fontWeight: 800,
              }}
            >
              {cartItemCount}
            </span>
          )}
        </button>
        <a className="action-btn" href="https://wa.me/254116909161" target="_blank" rel="noreferrer">
          WhatsApp
        </a>
        <a className="action-btn" href="tel:0116909161">
          Call
        </a>
        <ScrollToTop />
      </div>

      <footer className="footer" style={{ background: "linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%)", borderTop: "1px solid rgba(255,255,255,0.1)" }}>
        <div className="container" style={{ paddingTop: 48, paddingBottom: 24 }}>
          {/* Main Footer Grid */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 32, marginBottom: 40 }}>
            {/* Brand Section */}
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
                <span style={{ fontSize: "1.5rem" }}>🍕</span>
                <div style={{ fontWeight: 800, letterSpacing: "0.03em", fontSize: "1.1rem" }}>Scrummy Munchies</div>
              </div>
              <p style={{ color: "#999", fontSize: "0.9rem", lineHeight: 1.6, margin: 0 }}>
                Crafting memorable pizza experiences in Maseno with quality ingredients and innovative delivery solutions.
              </p>
              <div style={{ display: "flex", gap: 12, marginTop: 16 }}>
                <a 
                  href="https://wa.me/254116909161" 
                  target="_blank" 
                  rel="noreferrer" 
                  style={{ 
                    display: "block", 
                    width: 40, 
                    height: 40, 
                    borderRadius: "50%",
                    overflow: "hidden",
                    transition: "transform 0.2s ease",
                    filter: "drop-shadow(0 4px 6px rgba(0,0,0,0.1))"
                  }} 
                  title="WhatsApp"
                  onMouseEnter={(e) => e.currentTarget.style.transform = "scale(1.1)"}
                  onMouseLeave={(e) => e.currentTarget.style.transform = "scale(1)"}
                >
                  <Image src={whatsappLogo} alt="WhatsApp" width={40} height={40} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                </a>
                <a 
                  href="tel:0116909161" 
                  style={{ 
                    display: "block", 
                    width: 40, 
                    height: 40,
                    borderRadius: "50%",
                    overflow: "hidden",
                    transition: "transform 0.2s ease",
                    filter: "drop-shadow(0 4px 6px rgba(0,0,0,0.1))"
                  }} 
                  title="Call"
                  onMouseEnter={(e) => e.currentTarget.style.transform = "scale(1.1)"}
                  onMouseLeave={(e) => e.currentTarget.style.transform = "scale(1)"}
                >
                  <Image src={callsLogo} alt="Call" width={40} height={40} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                </a>
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h4 style={{ fontWeight: 700, marginBottom: 16, fontSize: "0.95rem", textTransform: "uppercase", letterSpacing: "0.05em", color: "#fff" }}>Quick Links</h4>
              <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: 10 }}>
                <li><a href="#" onClick={(e) => { e.preventDefault(); setSelectedCategory("all"); }} style={{ color: "#999", textDecoration: "none", fontSize: "0.9rem", transition: "color 0.3s" }} onMouseEnter={(e) => e.currentTarget.style.color = "var(--green)"} onMouseLeave={(e) => e.currentTarget.style.color = "#999"}>📋 View Menu</a></li>
                <li><a href="#" onClick={(e) => { e.preventDefault(); openCart(); }} style={{ color: "#999", textDecoration: "none", fontSize: "0.9rem", transition: "color 0.3s" }} onMouseEnter={(e) => e.currentTarget.style.color = "var(--green)"} onMouseLeave={(e) => e.currentTarget.style.color = "#999"}>🛒 My Cart</a></li>
                <li><a href="https://wa.me/254116909161" target="_blank" rel="noreferrer" style={{ color: "#999", textDecoration: "none", fontSize: "0.9rem", transition: "color 0.3s" }} onMouseEnter={(e) => e.currentTarget.style.color = "var(--green)"} onMouseLeave={(e) => e.currentTarget.style.color = "#999"}>💬 Contact Us</a></li>
              </ul>
            </div>

            {/* Location & Hours */}
            <div>
              <h4 style={{ fontWeight: 700, marginBottom: 16, fontSize: "0.95rem", textTransform: "uppercase", letterSpacing: "0.05em", color: "#fff" }}>Location</h4>
              <div style={{ fontSize: "0.9rem", lineHeight: 1.8 }}>
                <div style={{ color: "#fff", fontWeight: 600, marginBottom: 4 }}>📍 Pink House</div>
                <div style={{ color: "#999", marginBottom: 12 }}>Next to Caroline Hostels, Maseno</div>
                <div style={{ color: "#fff", fontWeight: 600, marginBottom: 4 }}>⏰ Operating Hours</div>
                <div style={{ color: "#999" }}>10:00 AM - 10:00 PM</div>
              </div>
            </div>

            {/* Contact & Deals */}
            <div>
              <h4 style={{ fontWeight: 700, marginBottom: 16, fontSize: "0.95rem", textTransform: "uppercase", letterSpacing: "0.05em", color: "#fff" }}>Get in Touch</h4>
              <div style={{ fontSize: "0.9rem", lineHeight: 1.8, marginBottom: 16 }}>
                <div style={{ color: "#fff", fontWeight: 600, marginBottom: 4 }}>📞 Phone</div>
                <a href="tel:0116909161" style={{ color: "var(--green)", textDecoration: "none", transition: "opacity 0.3s" }} onMouseEnter={(e) => e.currentTarget.style.opacity = "0.7"} onMouseLeave={(e) => e.currentTarget.style.opacity = "1"}>0116909161</a>
              </div>
              <div style={{ background: "rgba(20, 184, 94, 0.1)", padding: 12, borderRadius: 8, border: "1px solid rgba(20, 184, 94, 0.3)" }}>
                <div style={{ fontSize: "0.85rem", color: "var(--green)", fontWeight: 700, marginBottom: 4 }}>🎉 BOGO Every Tue & Fri</div>
                <div style={{ fontSize: "0.8rem", color: "#999" }}>Buy 1 Get 1 All Day</div>
              </div>
            </div>
          </div>

          {/* Divider */}
          <div style={{ height: "1px", background: "rgba(255,255,255,0.1)", marginBottom: 24 }} />

          {/* Bottom Section */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 16 }}>
            <div style={{ color: "#666", fontSize: "0.85rem" }}>
              © 2026 Scrummy Munchies. All rights reserved.
            </div>
            <div style={{ display: "flex", gap: 24, flexWrap: "wrap" }}>
              <a href="https://wa.me/254116909161" target="_blank" rel="noreferrer" style={{ color: "#666", textDecoration: "none", fontSize: "0.85rem", transition: "color 0.3s" }} onMouseEnter={(e) => e.currentTarget.style.color = "var(--green)"} onMouseLeave={(e) => e.currentTarget.style.color = "#666"}>WhatsApp Order</a>
              <a href="tel:0116909161" style={{ color: "#666", textDecoration: "none", fontSize: "0.85rem", transition: "color 0.3s" }} onMouseEnter={(e) => e.currentTarget.style.color = "var(--green)"} onMouseLeave={(e) => e.currentTarget.style.color = "#666"}>Call Order</a>
              <div style={{ color: "#666", fontSize: "0.85rem" }}>Maseno 🇰🇪</div>
            </div>
          </div>
        </div>
      </footer>
    </main>
  );
}
