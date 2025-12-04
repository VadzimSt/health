import { Link } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { useAuth } from "@/contexts/AuthContext";
import { useRequests } from "@/contexts/RequestsContext";
import { Button } from "@/components/ui/button";
import { RequestCard } from "@/components/common/RequestCard";
import { StatsCard } from "@/components/common/StatsCard";
import {
  Plus,
  FileText,
  Clock,
  CheckCircle2,
  XCircle,
  Sparkles,
  User,
} from "lucide-react";

export default function PatientDashboard() {
  const { user } = useAuth();
  const { getRequestsByPatientId } = useRequests();

  const requests = user ? getRequestsByPatientId(user.id) : [];

  const stats = {
    total: requests.length,
    pending: requests.filter((r) => r.status === "pending").length,
    approved: requests.filter((r) => r.status === "approved").length,
    rejected: requests.filter((r) => r.status === "rejected").length,
  };

  return (
    <Layout>
      <div className="container py-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-display font-bold text-foreground">
              Welcome, {user?.name?.split(" ")[0]}!
            </h1>
            <p className="text-muted-foreground mt-1">
              Manage your prescription requests
            </p>
          </div>
          <div className="flex gap-3">
            {/* <Button asChild size="lg" variant="outline">
              <Link to="/patient/profile">
                <User className="h-5 w-5 mr-2" />
                Edit Profile
              </Link>
            </Button> */}
            <Button asChild size="lg" variant="hero">
              <Link to="/patient/new-request">
                <Plus className="h-5 w-5" />
                New Request
              </Link>
            </Button>
          </div>
        </div>

        {/* Requests List */}
        <div>
          <h2 className="text-xl font-semibold text-foreground mb-4">
            Your Requests
          </h2>

          {requests.length === 0 ? (
            <div className="text-center py-16 px-4 rounded-2xl border border-dashed border-border bg-muted/30">
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                <Sparkles className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">
                You have no requests yet
              </h3>
              <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                Create your first prescription request. Describe your symptoms
                and attach necessary documents.
              </p>
              <Button asChild>
                <Link to="/patient/new-request">
                  <Plus className="h-4 w-4 mr-2" />
                  Create Request
                </Link>
              </Button>
            </div>
          ) : (
            <div className="grid gap-4">
              {requests.map((request) => (
                <RequestCard
                  key={request.id}
                  request={request}
                  linkTo={`/patient/request/${request.id}`}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}
