import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ProfileForm } from "@/components/patient/ProfileForm";
import { useNavigate, Link } from "react-router-dom";
import { User } from "@/types";
import { User as UserIcon, Loader2, ArrowLeft } from "lucide-react";
import { Layout } from "@/components/layout/Layout";

export default function Profile() {
  const { user } = useAuth();
  const navigate = useNavigate();

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
            <CardHeader>
              <CardTitle>Profile Information</CardTitle>
              <CardDescription>
                Make changes to your profile here. Click save when you're done.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ProfileForm user={user} />
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
}
