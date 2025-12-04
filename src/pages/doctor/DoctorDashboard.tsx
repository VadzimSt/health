import { useState } from "react";
import { Layout } from "@/components/layout/Layout";
import { useAuth } from "@/contexts/AuthContext";
import { useRequests } from "@/contexts/RequestsContext";
import { RequestCard } from "@/components/common/RequestCard";
import { StatsCard } from "@/components/common/StatsCard";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FileText, Clock, CheckCircle2, XCircle, Filter } from "lucide-react";
import { RequestStatus } from "@/types";

export default function DoctorDashboard() {
  const { user } = useAuth();
  const { requests } = useRequests();
  const [activeTab, setActiveTab] = useState<"all" | RequestStatus>("all");

  const stats = {
    total: requests.length,
    pending: requests.filter((r) => r.status === "pending").length,
    approved: requests.filter((r) => r.status === "approved").length,
    rejected: requests.filter((r) => r.status === "rejected").length,
  };

  const filteredRequests =
    activeTab === "all"
      ? requests
      : requests.filter((r) => r.status === activeTab);

  return (
    <Layout>
      <div className="container py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-display font-bold text-foreground">
            Doctor Dashboard
          </h1>
          <p className="text-muted-foreground mt-1">
            Welcome, {user?.name}. Manage prescription requests.
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <StatsCard
            title="Total Requests"
            value={stats.total}
            icon={FileText}
          />
          <StatsCard
            title="Pending"
            value={stats.pending}
            icon={Clock}
            trend={
              stats.pending > 0
                ? { value: stats.pending, isPositive: false }
                : undefined
            }
          />
          <StatsCard
            title="Approved"
            value={stats.approved}
            icon={CheckCircle2}
          />
          <StatsCard title="Rejected" value={stats.rejected} icon={XCircle} />
        </div>

        {/* Requests List */}
        <div>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-foreground">
              Patient Requests
            </h2>
          </div>

          <Tabs
            value={activeTab}
            onValueChange={(v) => setActiveTab(v as typeof activeTab)}
          >
            <TabsList className="mb-6">
              <TabsTrigger value="all" className="gap-2">
                All
                <span className="text-xs bg-muted px-2 py-0.5 rounded-full">
                  {stats.total}
                </span>
              </TabsTrigger>
              <TabsTrigger value="pending" className="gap-2">
                Pending
                <span className="text-xs bg-warning/20 text-warning px-2 py-0.5 rounded-full">
                  {stats.pending}
                </span>
              </TabsTrigger>
              <TabsTrigger value="approved" className="gap-2">
                Approved
                <span className="text-xs bg-success/20 text-success px-2 py-0.5 rounded-full">
                  {stats.approved}
                </span>
              </TabsTrigger>
              <TabsTrigger value="rejected" className="gap-2">
                Rejected
                <span className="text-xs bg-destructive/20 text-destructive px-2 py-0.5 rounded-full">
                  {stats.rejected}
                </span>
              </TabsTrigger>
            </TabsList>

            <TabsContent value={activeTab}>
              {filteredRequests.length === 0 ? (
                <div className="text-center py-16 px-4 rounded-2xl border border-dashed border-border bg-muted/30">
                  <Filter className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-foreground mb-2">
                    No Requests
                  </h3>
                  <p className="text-muted-foreground">
                    {activeTab === "pending"
                      ? "Great job! All requests processed."
                      : "No requests in this category yet."}
                  </p>
                </div>
              ) : (
                <div className="grid gap-4">
                  {filteredRequests.map((request) => (
                    <RequestCard
                      key={request.id}
                      request={request}
                      linkTo={`/doctor/request/${request.id}`}
                      showPatientInfo
                    />
                  ))}
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </Layout>
  );
}
