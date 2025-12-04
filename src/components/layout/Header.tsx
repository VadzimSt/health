import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { Brain, LogOut, User, Menu, X } from "lucide-react";
import { useState } from "react";

export function Header() {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const getDashboardLink = () => {
    if (!user) return "/";
    return user.role === "admin" ? "/doctor" : "/patient";
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/50 bg-background/80 backdrop-blur-lg">
      <div className="container flex h-16 items-center justify-between">
        <Link to="/" className="flex items-center gap-2 group">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 group-hover:bg-primary/20 transition-colors">
            <Brain className="h-5 w-5 text-primary" />
          </div>
          <span className="font-display text-xl font-semibold text-foreground">
            HealthCare
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-6">
          {isAuthenticated ? (
            <>
              <Link
                to={getDashboardLink()}
                className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
              >
                Dashboard
              </Link>
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2 px-3 py-1.5">
                  <User className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm font-medium">{user?.name}</span>
                  {user?.role === "admin" ? (
                    <span className="text-xs px-2 py-0.5 rounded-full bg-primary/10 text-primary"></span>
                  ) : (
                    <Link to="/patient/profile">
                      <span className="text-xs px-2 py-1.5 rounded-full bg-primary/10 text-primary">
                        Edit Profile
                      </span>
                    </Link>
                  )}
                </div>

                <Button variant="ghost" size="icon" onClick={handleLogout}>
                  <LogOut className="h-4 w-4" />
                </Button>
              </div>
            </>
          ) : (
            <>
              <Link
                to="/auth"
                className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
              >
                Sign In
              </Link>
              <Button asChild>
                <Link to="/auth?mode=register">Get Started</Link>
              </Button>
            </>
          )}
        </nav>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden p-2"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? (
            <X className="h-6 w-6" />
          ) : (
            <Menu className="h-6 w-6" />
          )}
        </button>
      </div>

      {/* Mobile Navigation */}
      {isMobileMenuOpen && (
        <div className="md:hidden border-t border-border bg-background p-4 animate-fade-in">
          <nav className="flex flex-col gap-4">
            {isAuthenticated ? (
              <>
                <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-secondary">
                  <User className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm font-medium">{user?.name}</span>
                  <span className="text-xs px-2 py-0.5 rounded-full bg-primary/10 text-primary ml-auto">
                    {user?.role === "admin" ? "Doctor" : "Patient"}
                  </span>
                </div>
                <Link
                  to={getDashboardLink()}
                  className="text-sm font-medium text-foreground hover:text-primary transition-colors py-2"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Dashboard
                </Link>
                <Button
                  variant="outline"
                  onClick={handleLogout}
                  className="w-full"
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  Sign Out
                </Button>
              </>
            ) : (
              <>
                <Button asChild variant="outline" className="w-full">
                  <Link to="/auth" onClick={() => setIsMobileMenuOpen(false)}>
                    Sign In
                  </Link>
                </Button>
                <Button asChild className="w-full">
                  <Link
                    to="/auth?mode=register"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Get Started
                  </Link>
                </Button>
              </>
            )}
          </nav>
        </div>
      )}
    </header>
  );
}
