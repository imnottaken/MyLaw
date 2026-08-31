"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { MenuIcon, CloseIcon } from "./icons";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const atTop = !scrolled;

  return (
    <header
      className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${
        atTop
          ? "bg-white/10 backdrop-blur-md border-b border-white/15"
          : "bg-white/95 backdrop-blur-md border-b border-[#E6E8EC] shadow-[0_1px_3px_rgba(16,24,40,0.05)]"
      }`}
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">

          {/* Left: Brand Wordmark + Logo */}
          <div className="flex-shrink-0">
            <Link
              href="/"
              className="flex items-center gap-2.5 hover:opacity-85 transition-opacity duration-150"
            >
              <Image
                src="/logo mylaw.jpeg"
                alt="MyLaw logo"
                width={32}
                height={32}
                className="rounded-full object-cover border border-white/30"
                priority
              />
              <span
                className={`text-xl font-bold tracking-tight transition-colors duration-300 ${
                  atTop ? "text-white" : "text-[#172033]"
                }`}
              >
                MyLaw
              </span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            {["/#about", "/#how-it-works", "/#for-lawyers"].map((href, i) => {
              const labels = ["About", "How It Works", "For Lawyers"];
              return (
                <Link
                  key={href}
                  href={href}
                  className={`text-sm font-medium transition-colors duration-150 ${
                    atTop
                      ? "text-white/80 hover:text-white"
                      : "text-[#667085] hover:text-[#172033]"
                  }`}
                >
                  {labels[i]}
                </Link>
              );
            })}
            <Link
              href="/waitlist"
              className={`inline-flex items-center justify-center px-4 py-2 text-sm font-semibold rounded-[6px] transition-all duration-200 cursor-pointer text-white bg-[#285A8E] hover:bg-[#1e4670] shadow-[0_1px_3px_rgba(16,24,40,0.05)]`}
            >
              Join Waitlist
            </Link>
          </nav>

          {/* Mobile Hamburger */}
          <div className="flex md:hidden">
            <button
              type="button"
              onClick={() => setIsOpen(!isOpen)}
              className={`inline-flex items-center justify-center p-2 rounded-[6px] focus:outline-none transition-colors ${
                atTop
                  ? "text-white hover:bg-white/10"
                  : "text-[#172033] hover:text-[#285A8E] hover:bg-[#F7F8FA]"
              }`}
              aria-expanded={isOpen}
              aria-label={isOpen ? "Close menu" : "Open menu"}
            >
              {isOpen ? <CloseIcon className="w-6 h-6" /> : <MenuIcon className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Drawer */}
      {isOpen && (
        <div className="md:hidden border-t border-white/15 bg-[#172033]/90 backdrop-blur-md px-4 pt-3 pb-6 sm:px-6">
          <div className="flex flex-col space-y-1">
            {[
              { href: "/#about", label: "About" },
              { href: "/#how-it-works", label: "How It Works" },
              { href: "/#for-lawyers", label: "For Lawyers" },
            ].map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                onClick={() => setIsOpen(false)}
                className="px-3 py-2.5 rounded-[6px] text-base font-medium text-white/80 hover:text-white hover:bg-white/10 transition-colors"
              >
                {label}
              </Link>
            ))}
            <div className="pt-2">
              <Link
                href="/waitlist"
                onClick={() => setIsOpen(false)}
                className="flex w-full items-center justify-center px-4 py-3 text-base font-semibold text-white bg-[#285A8E] hover:bg-[#1e4670] rounded-[6px] transition-all duration-200 cursor-pointer"
              >
                Join Waitlist
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
