import { useAuth } from "@/contexts/AuthContext";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ProfileForm } from "@/components/patient/ProfileForm";
import { PaymentForm } from "@/components/patient/PaymentForm";
import { useNavigate, Link } from "react-router-dom";
import { User } from "@/types";
import {
  User as UserIcon,
  Loader2,
  ArrowLeft,
  CreditCard,
  Edit,
} from "lucide-react";
import { Layout } from "@/components/layout/Layout";

export default function Profile() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isProfileEditing, setIsProfileEditing] = useState(false);
  const [isPaymentEditing, setIsPaymentEditing] = useState(false);

  if (!user) {
    return (
      <Layout>
        <div className="container py-8">
          <Card>
            <CardContent className="py-8">
              <div className="text-center">
                <Loader2 className="h-8 w-8 animate-spin mx-auto text-muted-foreground" />
                <p className="mt-2 text-muted-foreground">Loading profile...</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container py-8">
        <div className="max-w-4xl mx-auto space-y-6">
          {/* Header */}
          <div className="mb-8">
            <Link
              to="/patient"
              className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-4"
            >
              <ArrowLeft className="h-4 w-4" />
              Back
            </Link>
            <h1 className="text-3xl font-display font-bold text-foreground">
              Edit Profile
            </h1>
            <p className="text-muted-foreground mt-2">
              Update your personal and medical information
            </p>
          </div>

          {/* Profile Form */}
          <Card>
            <CardHeader className="relative">
              <CardTitle>Profile Information</CardTitle>
              <CardDescription>
                {isProfileEditing
                  ? "Make changes to your profile here. Click save when you're done."
                  : "Click the edit button to modify your profile information."}
              </CardDescription>
              <Button
                variant="ghost"
                size="icon"
                className="absolute right-4 top-4 rounded-full"
                onClick={() => setIsProfileEditing(!isProfileEditing)}
              >
                <Edit className="h-4 w-4" />
              </Button>
            </CardHeader>
            <CardContent>
              {isProfileEditing ? (
                <ProfileForm user={user} />
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  Profile information will appear here when you click edit
                </div>
              )}
            </CardContent>
          </Card>

          {/* Payment Method Card */}
          <Card>
            <CardHeader className="relative">
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="h-5 w-5" />
                Payment Method
              </CardTitle>
              <CardDescription>
                {isPaymentEditing
                  ? "Add or update your payment information for medical services"
                  : "Click the edit button to modify your payment information"}
              </CardDescription>
              <Button
                variant="ghost"
                size="icon"
                className="absolute right-4 top-4 rounded-full"
                onClick={() => setIsPaymentEditing(!isPaymentEditing)}
              >
                <Edit className="h-4 w-4" />
              </Button>
            </CardHeader>
            <CardContent>
              {isPaymentEditing ? (
                <PaymentForm user={user} />
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  Payment information will appear here when you click edit
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
}
