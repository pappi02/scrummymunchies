"use client";

import { useEffect, useState } from "react";

interface ScrollToTopProps {
  fixed?: boolean;
}

export default function ScrollToTop({ fixed = false }: ScrollToTopProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    let ticking = false;
    const toggleVisibility = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const shouldBeVisible = window.scrollY > 300;
          setIsVisible((prev) => (prev === shouldBeVisible ? prev : shouldBeVisible));
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener("scroll", toggleVisibility, { passive: true });
    return () => window.removeEventListener("scroll", toggleVisibility);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  if (!isVisible) return null;

  const fixedStyle: React.CSSProperties = fixed
    ? {
        position: "fixed",
        bottom: "22px",
        right: "18px",
        zIndex: 30,
      }
    : {};

  return (
    <button
      onClick={scrollToTop}
      className="action-btn"
      style={{
        justifyContent: "center",
        width: 45, // Consistent with other circular buttons
        height: 45,
        padding: 0,
        borderRadius: "50%",
        boxShadow: "0 10px 20px rgba(0,0,0,0.15)",
        background: "#ffffff",
        color: "var(--ink)",
        ...fixedStyle,
      }}
      aria-label="Scroll to top"
    >
      <span style={{ fontSize: "1.4rem", lineHeight: 1 }}>↑</span>
    </button>
  );
}
