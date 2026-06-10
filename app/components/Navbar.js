"use client";

import Link from "next/link";
import { usePathname } from "next/navigation"; 
import { useState, useEffect } from "react";

export default function Navbar() {
  const pathname = usePathname(); 
  const [isPremium, setIsPremium] = useState(false);

  const checkPremium = () => {
    const status = localStorage.getItem("isPremium");
    setIsPremium(status === "true");
  };

  useEffect(() => {
    checkPremium();

    window.addEventListener("storage_update", checkPremium);
    return () => window.removeEventListener("storage_update", checkPremium);
  }, []);

  return (
    <header className="sticky top-0 z-40 border-b border-black/10 bg-white/80 backdrop-blur dark:border-white/10 dark:bg-black/70">
      <nav className="mx-auto flex max-w-5xl items-center justify-between px-6 py-3">
        
        <Link 
          href="/" 
          className={`text-lg font-bold tracking-tight transition-colors ${
            pathname === "/" ? "text-indigo-600 dark:text-indigo-400" : "text-black dark:text-white"
          }`}
        >
          ⚡ TechCart
        </Link>

        <div className="flex items-center gap-4">
          {isPremium && (
            <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-bold text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-400 border border-emerald-500/20">
              Premium ✓
            </span>
          )}

          <Link
            href="/premium"
            className={`rounded-full px-4 py-2 text-sm font-semibold transition-colors ${
              pathname === "/premium"
                ? "bg-indigo-100 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300 border border-indigo-500/30" // Aktiv olanda (Premium səhifəsindədirsə)
                : "bg-indigo-600 text-white hover:bg-indigo-500" // Normal vəziyyətdə
            }`}
          >
            {isPremium ? "Manage Premium" : "Go Premium"}
          </Link>
        </div>

      </nav>
    </header>
  );
}