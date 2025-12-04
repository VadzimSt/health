import { useParams, Link } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { useRequests } from "@/contexts/RequestsContext";
import { StatusBadge } from "@/components/common/StatusBadge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  ArrowLeft,
  Calendar,
  FileText,
  Download,
  User,
  Pill,
  Clock,
  AlertCircle,
} from "lucide-react";
import { format } from "date-fns";
import { enUS } from "date-fns/locale";

export default function PatientRequestDetail() {
  const { id } = useParams();
  const { getRequestById } = useRequests();

  const request = id ? getRequestById(id) : undefined;

  if (!request) {
    return (
      <Layout>
        <div className="container py-16 text-center">
          <AlertCircle className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-foreground mb-2">
            Request Not Found
          </h1>
          <p className="text-muted-foreground mb-6">
            Request with this ID does not exist or has been deleted.
          </p>
          <Button asChild>
            <Link to="/patient">Back to List</Link>
          </Button>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container py-8 max-w-4xl">
        {/* Header */}
        <div className="mb-8">
          <Link
            to="/patient"
            className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-4"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to List
          </Link>
          <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
            <div>
              <h1 className="text-3xl font-display font-bold text-foreground">
                {request.title}
              </h1>
              <div className="flex items-center gap-4 mt-2 text-muted-foreground">
                <span className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  {format(request.createdAt, "MMM d, yyyy 'at' HH:mm", {
                    locale: enUS,
                  })}
                </span>
              </div>
            </div>
            <StatusBadge
              status={request.status}
              className="text-sm px-4 py-2"
            />
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Description */}
            <Card>
              <CardHeader>
                <CardTitle>Description</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-foreground whitespace-pre-wrap">
                  {request.description}
                </p>
              </CardContent>
            </Card>

            {/* Symptoms */}
            <Card>
              <CardHeader>
                <CardTitle>Symptoms</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {request.symptoms.map((symptom, index) => (
                    <Badge key={index} variant="secondary">
                      {symptom}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Attachments */}
            {request.attachments.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Attached Files</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {request.attachments.map((file) => (
                      <div
                        key={file.id}
                        className="flex items-center justify-between p-3 rounded-lg bg-muted/50 border border-border/50"
                      >
                        <div className="flex items-center gap-3">
                          <FileText className="h-5 w-5 text-muted-foreground" />
                          <div>
                            <p className="text-sm font-medium">{file.name}</p>
                            <p className="text-xs text-muted-foreground">
                              {(file.size / 1024).toFixed(1)} KB
                            </p>
                          </div>
                        </div>
                        <Button variant="ghost" size="sm">
                          <Download className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Doctor Notes */}
            {request.doctorNotes && (
              <Card>
                <CardHeader>
                  <CardTitle>Doctor's Comment</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-foreground">{request.doctorNotes}</p>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Prescription */}
            {request.prescription && (
              <Card className="border-success/30 bg-success/5">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-success">
                    <Pill className="h-5 w-5" />
                    Prescription Issued
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Medication</p>
                    <p className="font-semibold text-foreground">
                      {request.prescription.medication}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Dosage</p>
                    <p className="font-medium text-foreground">
                      {request.prescription.dosage}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Frequency</p>
                    <p className="font-medium text-foreground">
                      {request.prescription.frequency}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Duration</p>
                    <p className="font-medium text-foreground">
                      {request.prescription.duration}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">
                      Instructions
                    </p>
                    <p className="text-foreground">
                      {request.prescription.instructions}
                    </p>
                  </div>

                  <div className="pt-4 border-t border-border/50">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <User className="h-4 w-4" />
                      {request.prescription.doctorName}
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
                      <Clock className="h-4 w-4" />
                      {format(request.prescription.issuedAt, "MMM d, yyyy", {
                        locale: enUS,
                      })}
                    </div>
                  </div>

                  <Button className="w-full" variant="success">
                    <Download className="h-4 w-4 mr-2" />
                    Download Prescription
                  </Button>
                </CardContent>
              </Card>
            )}

            {/* Status Info */}
            {request.status === "pending" && (
              <Card className="border-warning/30 bg-warning/5">
                <CardContent className="pt-6">
                  <div className="flex items-start gap-3">
                    <Clock className="h-5 w-5 text-warning mt-0.5" />
                    <div>
                      <p className="font-medium text-foreground">
                        Under Review
                      </p>
                      <p className="text-sm text-muted-foreground mt-1">
                        Your request is under review by the doctor. Usually a
                        response comes within 24-48 hours.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {request.status === "rejected" && (
              <Card className="border-destructive/30 bg-destructive/5">
                <CardContent className="pt-6">
                  <div className="flex items-start gap-3">
                    <AlertCircle className="h-5 w-5 text-destructive mt-0.5" />
                    <div>
                      <p className="font-medium text-foreground">
                        Request Rejected
                      </p>
                      <p className="text-sm text-muted-foreground mt-1">
                        Unfortunately, the doctor could not approve your
                        request. Please review the comment above.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
}
