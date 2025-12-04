import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Layout } from "@/components/layout/Layout";
import { useAuth } from "@/contexts/AuthContext";
import {
  Heart,
  Shield,
  Clock,
  ArrowRight,
  Sparkles,
  MessageCircle,
  FileCheck,
  Users,
} from "lucide-react";

const features = [
  {
    icon: Shield,
    title: "Secure and Confidential",
    description:
      "Your data is protected by encryption. Only you and your doctor have access to the information.",
  },
  {
    icon: Clock,
    title: "Quick Prescription",
    description:
      "Receive your prescription within 24-48 hours after doctor approval.",
  },
  {
    icon: MessageCircle,
    title: "Direct Doctor Communication",
    description:
      "Describe your symptoms and attach documents for a more accurate consultation.",
  },
];

const steps = [
  {
    number: "01",
    title: "Create an Account",
    description:
      "Register in a couple of minutes and fill in basic information about yourself.",
  },
  {
    number: "02",
    title: "Describe Your Symptoms",
    description:
      "Create a request with a detailed description of your condition and attach documents.",
  },
  {
    number: "03",
    title: "Receive Your Prescription",
    description:
      "The doctor will review the request and issue an electronic prescription if necessary.",
  },
];

export default function Index() {
  const { isAuthenticated, user } = useAuth();

  const getDashboardLink = () => {
    if (!user) return "/auth?mode=register";
    return user.role === "admin" ? "/doctor" : "/patient";
  };

  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 gradient-hero" />
        <div className="absolute top-20 left-10 w-72 h-72 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-accent/20 rounded-full blur-3xl" />

        <div className="container relative py-24 lg:py-32">
          <div className="max-w-3xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent/50 text-sm font-medium text-accent-foreground mb-6 animate-fade-in">
              <Sparkles className="h-4 w-4 text-primary" />
              Care for your health
            </div>

            <h1
              className="text-4xl md:text-5xl lg:text-6xl font-display font-bold text-foreground mb-6 animate-fade-in-up text-balance"
              style={{ animationDelay: "0.1s" }}
            >
              Get a prescription <span className="text-primary">online</span>{" "}
              without queues
            </h1>

            <p
              className="text-lg md:text-xl text-muted-foreground mb-8 animate-fade-in-up text-balance"
              style={{ animationDelay: "0.2s" }}
            >
              HealthCare is a simple and safe way to get a prescription for
              medications. Consultation with a licensed doctor online.
            </p>

            <div
              className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-in-up"
              style={{ animationDelay: "0.3s" }}
            >
              <Button asChild size="xl" variant="hero">
                <Link to={getDashboardLink()}>
                  {isAuthenticated ? "Go to Dashboard" : "Start Now"}
                  <ArrowRight className="h-5 w-5" />
                </Link>
              </Button>
              <Button asChild size="xl" variant="outline">
                <Link to="#how-it-works">How it Works</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-muted/30">
        <div className="container">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-display font-bold text-foreground mb-4">
              Why Choose HealthCare
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              We have created a platform that makes health care accessible and
              convenient
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div
                key={feature.title}
                className="group p-8 rounded-2xl bg-card border border-border/50 shadow-soft hover:shadow-elevated transition-all duration-300 animate-fade-in-up"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center mb-6 group-hover:bg-primary/20 transition-colors">
                  <feature.icon className="h-7 w-7 text-primary" />
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-3">
                  {feature.title}
                </h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-24">
        <div className="container">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-display font-bold text-foreground mb-4">
              How it Works
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Three simple steps to get your prescription
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 lg:gap-12">
            {steps.map((step, index) => (
              <div
                key={step.number}
                className="relative animate-fade-in-up"
                style={{ animationDelay: `${index * 0.15}s` }}
              >
                {index < steps.length - 1 && (
                  <div className="hidden md:block absolute top-8 left-full w-full h-0.5 bg-gradient-to-r from-primary/30 to-transparent -translate-x-8" />
                )}
                <div className="text-6xl font-display font-bold text-primary/10 mb-4">
                  {step.number}
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-3">
                  {step.title}
                </h3>
                <p className="text-muted-foreground">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-primary/5">
        <div className="container">
          <div className="max-w-3xl mx-auto text-center">
            <Heart className="h-12 w-12 text-primary mx-auto mb-6" />
            <h2 className="text-3xl md:text-4xl font-display font-bold text-foreground mb-4">
              Ready to take care of yourself?
            </h2>
            <p className="text-lg text-muted-foreground mb-8">
              Join thousands of people who are already receiving quality online
              help.
            </p>
            <Button asChild size="xl" variant="hero">
              <Link
                to={
                  isAuthenticated ? getDashboardLink() : "/auth?mode=register"
                }
              >
                {isAuthenticated
                  ? "Go to Dashboard"
                  : "Create Account for Free"}
                <ArrowRight className="h-5 w-5" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Trust Section */}
      <section className="py-16 border-t border-border/50">
        <div className="container">
          <div className="flex flex-col md:flex-row items-center justify-center gap-8 md:gap-16">
            <div className="flex items-center gap-3">
              <Users className="h-6 w-6 text-primary" />
              <div>
                <p className="text-2xl font-bold text-foreground">5,000+</p>
                <p className="text-sm text-muted-foreground">Patients</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <FileCheck className="h-6 w-6 text-primary" />
              <div>
                <p className="text-2xl font-bold text-foreground">10,000+</p>
                <p className="text-sm text-muted-foreground">
                  Prescriptions Issued
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Shield className="h-6 w-6 text-primary" />
              <div>
                <p className="text-2xl font-bold text-foreground">100%</p>
                <p className="text-sm text-muted-foreground">Confidential</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
}
