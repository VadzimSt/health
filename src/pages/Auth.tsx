import { useState, useEffect } from "react";
import { useNavigate, useSearchParams, Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Brain, Eye, EyeOff, ArrowLeft, Loader2 } from "lucide-react";
import { UserRole } from "@/types";
import { toast } from "sonner";

export default function Auth() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { login, register, isAuthenticated, user, isLoading } = useAuth();

  const [isRegisterMode, setIsRegisterMode] = useState(
    searchParams.get("mode") === "register"
  );
  const [showPassword, setShowPassword] = useState(false);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [role, setRole] = useState<UserRole>("patient");

  useEffect(() => {
    if (isAuthenticated && user) {
      const redirectTo = user.role === "admin" ? "/doctor" : "/patient";
      navigate(redirectTo);
    }
  }, [isAuthenticated, user, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      if (isRegisterMode) {
        await register(email, password, name, role);
        toast.success("Registration successful!");
      } else {
        await login(email, password);
        toast.success("Welcome back!");
      }
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "An error occurred");
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Header */}
      <header className="p-4">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Back
        </Link>
      </header>

      {/* Main Content */}
      <div className="flex-1 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          {/* Logo */}
          <div className="flex items-center justify-center gap-2 mb-8">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
              <Brain className="h-6 w-6 text-primary" />
            </div>
            <span className="font-display text-2xl font-semibold text-foreground">
              HealthCare
            </span>
          </div>

          <Card className="border-border/50 shadow-elevated">
            <CardHeader className="text-center pb-4">
              <CardTitle className="text-2xl font-display">
                {isRegisterMode ? "Create Account" : "Sign In"}
              </CardTitle>
              <CardDescription>
                {isRegisterMode
                  ? "Register to get online prescriptions"
                  : "Sign into your HealthCare account"}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                {isRegisterMode && (
                  <>
                    <div className="space-y-2">
                      <Label htmlFor="name">Full Name</Label>
                      <Input
                        id="name"
                        placeholder="John Doe"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                      />
                    </div>

                    {/* <div className="space-y-3">
                      <Label>Account Type</Label>
                      <RadioGroup
                        value={role}
                        onValueChange={(value) => setRole(value as UserRole)}
                        className="grid grid-cols-2 gap-4"
                      >
                        <div>
                          <RadioGroupItem
                            value="patient"
                            id="patient"
                            className="peer sr-only"
                          />
                          <Label
                            htmlFor="patient"
                            className="flex flex-col items-center justify-center rounded-xl border-2 border-input bg-background p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary peer-data-[state=checked]:bg-primary/5 cursor-pointer transition-all"
                          >
                            <span className="font-medium">Patient</span>
                            <span className="text-xs text-muted-foreground mt-1">
                              Get Prescription
                            </span>
                          </Label>
                        </div>
                        <div>
                          <RadioGroupItem
                            value="admin"
                            id="admin"
                            className="peer sr-only"
                          />
                          <Label
                            htmlFor="admin"
                            className="flex flex-col items-center justify-center rounded-xl border-2 border-input bg-background p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary peer-data-[state=checked]:bg-primary/5 cursor-pointer transition-all"
                          >
                            <span className="font-medium">Doctor</span>
                            <span className="text-xs text-muted-foreground mt-1">
                              Issue Prescriptions
                            </span>
                          </Label>
                        </div>
                      </RadioGroup>
                    </div> */}
                  </>
                )}

                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      className="pr-10"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                </div>

                <Button
                  type="submit"
                  className="w-full"
                  size="lg"
                  disabled={isLoading}
                >
                  {isLoading && (
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  )}
                  {isRegisterMode ? "Register" : "Sign In"}
                </Button>
              </form>

              <div className="mt-6 text-center">
                <button
                  type="button"
                  onClick={() => setIsRegisterMode(!isRegisterMode)}
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  {isRegisterMode
                    ? "Already have an account? Sign In"
                    : "Don't have an account? Register"}
                </button>
              </div>

              {/* Demo Credentials */}
              <div className="mt-6 p-4 rounded-xl bg-muted/50 border border-border/50">
                <p className="text-xs text-muted-foreground text-center mb-2">
                  Demo credentials for testing:
                </p>
                <div className="space-y-1 text-xs text-center">
                  <p>
                    <span className="font-medium">Patient:</span>{" "}
                    patient@demo.com
                  </p>
                  <p>
                    <span className="font-medium">Doctor:</span> doctor@demo.com
                  </p>
                  <p className="text-muted-foreground">(any password)</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
