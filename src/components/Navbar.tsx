import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/Logo";
import { useAuth } from "@/hooks/useAuth";
import { LogOut, LayoutDashboard, Shield, User, Menu, X } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetClose,
} from "@/components/ui/sheet";

const navLinks = [
  { label: "Pricing", href: "#pricing" },
  { label: "About", href: "#about" },
  { label: "Contact Us", href: "#contact" },
];

export function Navbar() {
  const { user, isAdmin, signOut } = useAuth();
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleSmoothScroll = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    const targetId = href.replace('#', '');
    const element = document.getElementById(targetId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  return (
    <nav
      className={`fixed top-4 left-1/2 -translate-x-1/2 z-50 transition-all duration-500 ease-out ${
        scrolled
          ? "bg-card/60 backdrop-blur-xl border border-border/50 shadow-lg rounded-full px-4 md:px-8 py-3"
          : "bg-transparent px-4 py-2"
      }`}
      style={{ width: scrolled ? "auto" : "100%", maxWidth: scrolled ? "900px" : "100%", minWidth: scrolled ? "auto" : "auto" }}
    >
      <div className={`flex items-center justify-between ${scrolled ? "gap-4 md:gap-16" : "gap-8"} ${scrolled ? "" : "container mx-auto"}`}>
        <Link to="/">
          <Logo />
        </Link>

        {/* Centered nav links - hidden on mobile/tablet */}
        <div className={`hidden lg:flex items-center gap-10 transition-opacity duration-300 ${scrolled ? 'animate-fade-in' : ''}`}>
          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              onClick={(e) => handleSmoothScroll(e, link.href)}
              className="text-sm text-muted-foreground hover:text-foreground transition-colors whitespace-nowrap"
            >
              {link.label}
            </a>
          ))}
        </div>

        <div className="flex items-center gap-3">
          {user ? (
            <>
              <Link to="/dashboard" className="hidden sm:block">
                <Button variant="ghost" size="sm" className="rounded-full">
                  <LayoutDashboard className="w-4 h-4 mr-2" />
                  Dashboard
                </Button>
              </Link>
              
              {isAdmin && (
                <Link to="/admin" className="hidden sm:block">
                  <Button variant="outline" size="sm" className="rounded-full">
                    <Shield className="w-4 h-4 mr-2" />
                    Admin
                  </Button>
                </Link>
              )}

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="rounded-full">
                    <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center">
                      <User className="w-4 h-4 text-foreground" />
                    </div>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <div className="px-2 py-1.5">
                    <p className="text-sm font-medium">{user.email}</p>
                    <p className="text-xs text-muted-foreground">
                      {isAdmin ? 'Administrator' : 'User'}
                    </p>
                  </div>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleSignOut} className="text-destructive">
                    <LogOut className="w-4 h-4 mr-2" />
                    Sign out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          ) : (
            <>
              {/* CTA button - hidden on mobile/tablet */}
              <Link to="/auth?mode=signup" className="hidden lg:block">
                <Button className="rounded-full">Get Started</Button>
              </Link>

              {/* Hamburger menu for mobile/tablet */}
              <Sheet>
                <SheetTrigger asChild className="lg:hidden">
                  <Button variant="ghost" size="icon" className="rounded-full">
                    <Menu className="w-5 h-5" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="right" className="w-[280px] bg-card border-border">
                  <div className="flex flex-col gap-6 mt-8">
                    {navLinks.map((link) => (
                      <SheetClose asChild key={link.label}>
                        <a
                          href={link.href}
                          onClick={(e) => handleSmoothScroll(e, link.href)}
                          className="text-lg text-foreground hover:text-muted-foreground transition-colors"
                        >
                          {link.label}
                        </a>
                      </SheetClose>
                    ))}
                    <SheetClose asChild>
                      <Link to="/auth?mode=signup">
                        <Button className="rounded-full w-full mt-4">Get Started</Button>
                      </Link>
                    </SheetClose>
                  </div>
                </SheetContent>
              </Sheet>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
