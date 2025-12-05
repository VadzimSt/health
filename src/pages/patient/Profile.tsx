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
import { Label } from "@/components/ui/label";
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
  Mail,
  Calendar,
  Phone,
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
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>
                      <div className="flex items-center gap-2">
                        <UserIcon className="h-4 w-4" />
                        Full Name
                      </div>
                    </Label>
                    <div className="font-display font-medium text-foreground">
                      {user.name}
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>
                      <div className="flex items-center gap-2">
                        <Mail className="h-4 w-4" />
                        Email Address
                      </div>
                    </Label>
                    <div className="font-display font-medium text-foreground">
                      {user.email}
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4" />
                        Date of Birth
                      </div>
                    </Label>
                    <div className="font-display font-medium text-foreground">
                      {user.dateOfBirth
                        ? new Date(user.dateOfBirth).toLocaleDateString()
                        : "Not provided"}
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>
                      <div className="flex items-center gap-2">
                        <Phone className="h-4 w-4" />
                        Phone Number
                      </div>
                    </Label>
                    <div className="font-display font-medium text-foreground">
                      {user.phone || "Not provided"}
                    </div>
                  </div>
                  <div className="md:col-span-2 space-y-2">
                    <Label>Allergies</Label>
                    <div className="font-display font-medium text-foreground">
                      {user.allergies || "None reported"}
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Payment Method Card */}
          <Card>
            <CardHeader className="relative">
              <CardTitle className="flex items-center gap-2">
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
                <div className="space-y-2">
                  <Label>
                    <div className="flex items-center gap-2">
                      <CreditCard className="h-4 w-4" />
                      Card Number
                    </div>
                  </Label>
                  {user.paymentMethod?.cardNumber ? (
                    <div className="font-mono font-medium">
                      •••• •••• •••• {user.paymentMethod.cardNumber.slice(-4)}
                    </div>
                  ) : (
                    <div className="text-muted-foreground">
                      There is no payment information
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
}
