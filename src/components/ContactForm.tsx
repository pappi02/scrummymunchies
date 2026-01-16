"use client";

import { useState, FormEvent } from "react";

export default function ContactForm() {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    message: "",
  });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    // Send to WhatsApp
    const whatsappMessage = `
🔔 *New Inquiry from Website*

*Name:* ${formData.name}
*Phone:* ${formData.phone}
*Email:* ${formData.email}

*Message:*
${formData.message}
    `.trim();

    const whatsappUrl = `https://wa.me/254116909161?text=${encodeURIComponent(whatsappMessage)}`;
    window.open(whatsappUrl, "_blank");

    setSubmitted(true);
    setFormData({ name: "", phone: "", email: "", message: "" });

    setTimeout(() => setSubmitted(false), 5000);
  };

  return (
    <div className="card" style={{ maxWidth: 640, margin: "0 auto", padding: 32 }}>
      <div className="ribbon" style={{ marginBottom: 16 }}>Get in touch</div>
      <h3 style={{ fontSize: "1.8rem", margin: "0 0 8px" }}>
        Interested in the full build?
      </h3>
      <p style={{ color: "var(--muted)", marginBottom: 24 }}>
        Leave your details and we will reach out to discuss the full ordering platform, payments,
        delivery tracking, and more.
      </p>

      {submitted && (
        <div
          style={{
            padding: 16,
            background: "rgba(20, 184, 94, 0.1)",
            border: "1px solid rgba(20, 184, 94, 0.3)",
            borderRadius: 12,
            marginBottom: 20,
            color: "var(--green)",
            fontWeight: 600,
          }}
        >
          ✓ Message sent! We'll get back to you soon.
        </div>
      )}

      <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        <div>
          <label
            htmlFor="name"
            style={{ display: "block", marginBottom: 6, fontWeight: 600, fontSize: "0.95rem" }}
          >
            Your Name *
          </label>
          <input
            type="text"
            id="name"
            required
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            style={{
              width: "100%",
              padding: "12px 16px",
              border: "1.5px solid rgba(22, 22, 22, 0.15)",
              borderRadius: 12,
              fontSize: "1rem",
              outline: "none",
            }}
            onFocus={(e) => (e.target.style.borderColor = "var(--red)")}
            onBlur={(e) => (e.target.style.borderColor = "rgba(22, 22, 22, 0.15)")}
          />
        </div>

        <div>
          <label
            htmlFor="phone"
            style={{ display: "block", marginBottom: 6, fontWeight: 600, fontSize: "0.95rem" }}
          >
            Phone Number *
          </label>
          <input
            type="tel"
            id="phone"
            required
            value={formData.phone}
            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            style={{
              width: "100%",
              padding: "12px 16px",
              border: "1.5px solid rgba(22, 22, 22, 0.15)",
              borderRadius: 12,
              fontSize: "1rem",
              outline: "none",
            }}
            onFocus={(e) => (e.target.style.borderColor = "var(--red)")}
            onBlur={(e) => (e.target.style.borderColor = "rgba(22, 22, 22, 0.15)")}
          />
        </div>

        <div>
          <label
            htmlFor="email"
            style={{ display: "block", marginBottom: 6, fontWeight: 600, fontSize: "0.95rem" }}
          >
            Email
          </label>
          <input
            type="email"
            id="email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            style={{
              width: "100%",
              padding: "12px 16px",
              border: "1.5px solid rgba(22, 22, 22, 0.15)",
              borderRadius: 12,
              fontSize: "1rem",
              outline: "none",
            }}
            onFocus={(e) => (e.target.style.borderColor = "var(--red)")}
            onBlur={(e) => (e.target.style.borderColor = "rgba(22, 22, 22, 0.15)")}
          />
        </div>

        <div>
          <label
            htmlFor="message"
            style={{ display: "block", marginBottom: 6, fontWeight: 600, fontSize: "0.95rem" }}
          >
            Message *
          </label>
          <textarea
            id="message"
            required
            rows={4}
            value={formData.message}
            onChange={(e) => setFormData({ ...formData, message: e.target.value })}
            style={{
              width: "100%",
              padding: "12px 16px",
              border: "1.5px solid rgba(22, 22, 22, 0.15)",
              borderRadius: 12,
              fontSize: "1rem",
              outline: "none",
              resize: "vertical",
              fontFamily: "inherit",
            }}
            onFocus={(e) => (e.target.style.borderColor = "var(--red)")}
            onBlur={(e) => (e.target.style.borderColor = "rgba(22, 22, 22, 0.15)")}
          />
        </div>

        <button
          type="submit"
          className="btn-primary"
          style={{ width: "100%", justifyContent: "center", padding: 16, fontSize: "1rem" }}
        >
          Send via WhatsApp
        </button>
      </form>
    </div>
  );
}
