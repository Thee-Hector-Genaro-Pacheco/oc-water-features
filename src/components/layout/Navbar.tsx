"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Phone, Menu, X, ChevronRight } from "lucide-react";
import { companyData } from "@/data/company";
import { Container } from "./Container";
import { Button } from "@/components/ui/Button";
import { PhoneCallLink } from "@/components/ui/PhoneCallLink";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/services", label: "Services" },
  { href: "/projects", label: "Projects" },
  { href: "/service-areas", label: "Service Areas" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" }
];

export const Navbar: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();
  const navRef = useRef<HTMLDivElement>(null);

  // Handle scroll shadow transition
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileMenuOpen]);

  // Handle Escape keypress to close mobile menu
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && mobileMenuOpen) {
        setMobileMenuOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [mobileMenuOpen]);

  // Handle click outside navigation drawer to close
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (navRef.current && !navRef.current.contains(e.target as Node) && mobileMenuOpen) {
        setMobileMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [mobileMenuOpen]);

  return (
    <header
      ref={navRef}
      className={`sticky top-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-white/95 backdrop-blur-md shadow-md py-2.5 sm:py-3"
          : "bg-white border-b border-slate-100 py-3 sm:py-4"
      }`}
    >
      <Container>
        <div className="flex items-center justify-between gap-2 sm:gap-4">
          {/* Brand Logo & Title Area */}
          <Link
            href="/"
            className="flex items-center gap-2.5 sm:gap-3.5 min-w-0 flex-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 rounded-lg p-0.5"
            aria-label="OC Water Features - Home"
          >
            <div className="relative w-11 h-11 sm:w-14 sm:h-14 shrink-0">
              <Image
                src="/logos/OCWaterFeatLogo.png"
                alt="OC Water Features Logo"
                fill
                className="object-contain"
                priority
              />
            </div>
            <div className="flex flex-col justify-center min-w-0 overflow-hidden">
              <span className="text-base sm:text-xl font-extrabold text-navy-900 tracking-tight leading-tight truncate">
                OC WATER FEATURES
              </span>
              <span className="hidden sm:block text-[10px] sm:text-xs font-semibold text-brand-600 tracking-wider uppercase truncate">
                {companyData.serviceAreaTagline} • {companyData.credentialsTagline}
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center space-x-1" aria-label="Main Navigation">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`px-3.5 py-2 text-sm font-semibold rounded-lg transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 ${
                    isActive
                      ? "bg-brand-50 text-brand-700 font-bold"
                      : "text-slate-700 hover:text-brand-600 hover:bg-slate-50"
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>

          {/* Desktop Right CTAs */}
          <div className="hidden md:flex items-center gap-3 shrink-0">
            <PhoneCallLink
              locationLabel="navbar-desktop-header"
              className="inline-flex items-center gap-2 px-3 py-2 text-sm font-bold text-slate-800 hover:text-brand-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 rounded-lg"
              title="Call OC Water Features"
            >
              <div className="w-8 h-8 rounded-full bg-brand-50 text-brand-600 flex items-center justify-center">
                <Phone className="w-4 h-4" aria-hidden="true" />
              </div>
              <span className="hidden xl:inline">{companyData.phoneDisplay}</span>
              <span className="xl:hidden">Call Now</span>
            </PhoneCallLink>

            <Button href="/request-estimate" variant="primary" size="sm">
              Request Free Estimate
            </Button>
          </div>

          {/* Mobile Actions (Phone Call + Hamburger Toggle) */}
          <div className="flex items-center gap-1.5 sm:gap-2 lg:hidden shrink-0">
            <PhoneCallLink
              locationLabel="navbar-mobile-header"
              className="min-w-[44px] min-h-[44px] flex items-center justify-center p-2 text-brand-600 bg-brand-50 hover:bg-brand-100 rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 shrink-0"
              aria-label={`Call OC Water Features at ${companyData.phoneDisplay}`}
            >
              <Phone className="w-5 h-5" aria-hidden="true" />
            </PhoneCallLink>

            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="min-w-[44px] min-h-[44px] flex items-center justify-center p-2 rounded-lg text-slate-700 hover:text-brand-600 hover:bg-slate-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 shrink-0"
              aria-expanded={mobileMenuOpen}
              aria-controls="mobile-menu"
              aria-label={mobileMenuOpen ? "Close navigation menu" : "Open navigation menu"}
            >
              {mobileMenuOpen ? (
                <X className="w-6 h-6" aria-hidden="true" />
              ) : (
                <Menu className="w-6 h-6" aria-hidden="true" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div
            id="mobile-menu"
            className="lg:hidden mt-3 pt-4 border-t border-slate-100 pb-4 space-y-2 animate-in slide-in-from-top duration-200"
          >
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center justify-between px-4 py-3 rounded-lg text-base font-semibold transition-colors ${
                    isActive
                      ? "bg-brand-50 text-brand-700 font-bold"
                      : "text-slate-800 hover:bg-slate-50 hover:text-brand-600"
                  }`}
                >
                  <span>{link.label}</span>
                  <ChevronRight className="w-4 h-4 text-slate-400" aria-hidden="true" />
                </Link>
              );
            })}

            <div className="pt-4 space-y-3 px-2">
              <Button href="/request-estimate" variant="primary" className="w-full justify-center">
                Request Free Estimate
              </Button>
              <PhoneCallLink
                locationLabel="navbar-mobile-drawer"
                className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-lg bg-navy-900 text-white font-bold text-base hover:bg-navy-800"
              >
                <Phone className="w-5 h-5 text-aqua-400" aria-hidden="true" />
                <span>Call {companyData.phoneDisplay}</span>
              </PhoneCallLink>
            </div>
          </div>
        )}
      </Container>
    </header>
  );
};
