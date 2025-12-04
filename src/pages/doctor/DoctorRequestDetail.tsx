import { useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { useAuth } from "@/contexts/AuthContext";
import { useRequests } from "@/contexts/RequestsContext";
import { StatusBadge } from "@/components/common/StatusBadge";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  ArrowLeft,
  Calendar,
  FileText,
  Download,
  User,
  Mail,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Loader2,
  Pill,
} from "lucide-react";
import { format } from "date-fns";
import { enUS } from "date-fns/locale";
import { toast } from "sonner";

export default function DoctorRequestDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { getRequestById, updateRequestStatus, issuePrescription } =
    useRequests();

  const [isApproveDialogOpen, setIsApproveDialogOpen] = useState(false);
  const [isRejectDialogOpen, setIsRejectDialogOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Prescription form state
  const [medication, setMedication] = useState("");
  const [dosage, setDosage] = useState("");
  const [frequency, setFrequency] = useState("");
  const [duration, setDuration] = useState("");
  const [instructions, setInstructions] = useState("");
  const [doctorNotes, setDoctorNotes] = useState("");

  // Reject form state
  const [rejectReason, setRejectReason] = useState("");

  const request = id ? getRequestById(id) : undefined;

  const handleApprove = async () => {
    if (!user || !request) return;

    setIsSubmitting(true);
    try {
      await issuePrescription(request.id, {
        medication,
        dosage,
        frequency,
        duration,
        instructions,
        doctorId: user.id,
        doctorName: user.name,
      });

      if (doctorNotes) {
        await updateRequestStatus(request.id, "approved", doctorNotes);
      }

      toast.success("Prescription issued successfully!");
      setIsApproveDialogOpen(false);
      navigate("/doctor");
    } catch (error) {
      toast.error("Error issuing prescription");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReject = async () => {
    if (!request) return;

    setIsSubmitting(true);
    try {
      await updateRequestStatus(request.id, "rejected", rejectReason);
      toast.success("Request rejected");
      setIsRejectDialogOpen(false);
      navigate("/doctor");
    } catch (error) {
      toast.error("Error rejecting request");
    } finally {
      setIsSubmitting(false);
    }
  };

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
            <Link to="/doctor">Back to List</Link>
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
            to="/doctor"
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
            {/* Patient Info */}
            <Card>
              <CardHeader>
                <CardTitle>Patient Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center gap-3">
                  <User className="h-5 w-5 text-muted-foreground" />
                  <span className="font-medium">{request.patientName}</span>
                </div>
                <div className="flex items-center gap-3">
                  <Mail className="h-5 w-5 text-muted-foreground" />
                  <span>{request.patientEmail}</span>
                </div>
              </CardContent>
            </Card>

            {/* Description */}
            <Card>
              <CardHeader>
                <CardTitle>Request Description</CardTitle>
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
          </div>

          {/* Sidebar - Actions */}
          <div className="space-y-6">
            {request.status === "pending" && (
              <Card>
                <CardHeader>
                  <CardTitle>Actions</CardTitle>
                  <CardDescription>
                    Review the request and make a decision
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  {/* Approve Dialog */}
                  <Dialog
                    open={isApproveDialogOpen}
                    onOpenChange={setIsApproveDialogOpen}
                  >
                    <DialogTrigger asChild>
                      <Button className="w-full" variant="success">
                        <CheckCircle2 className="h-4 w-4 mr-2" />
                        Approve and Issue Prescription
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
                      <DialogHeader>
                        <DialogTitle>Issue Prescription</DialogTitle>
                        <DialogDescription>
                          Fill in the prescription details
                        </DialogDescription>
                      </DialogHeader>
                      <div className="space-y-4 py-4">
                        <div className="space-y-2">
                          <Label htmlFor="medication">Medication</Label>
                          <Input
                            id="medication"
                            placeholder="Medication name"
                            value={medication}
                            onChange={(e) => setMedication(e.target.value)}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="dosage">Dosage</Label>
                          <Input
                            id="dosage"
                            placeholder="E.g.: 50 mg"
                            value={dosage}
                            onChange={(e) => setDosage(e.target.value)}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="frequency">Frequency</Label>
                          <Input
                            id="frequency"
                            placeholder="E.g.: Once a day in the morning"
                            value={frequency}
                            onChange={(e) => setFrequency(e.target.value)}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="duration">Duration</Label>
                          <Input
                            id="duration"
                            placeholder="E.g.: 3 months"
                            value={duration}
                            onChange={(e) => setDuration(e.target.value)}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="instructions">Instructions</Label>
                          <Textarea
                            id="instructions"
                            placeholder="Additional instructions..."
                            value={instructions}
                            onChange={(e) => setInstructions(e.target.value)}
                            rows={3}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="notes">
                            Comment for Patient (optional)
                          </Label>
                          <Textarea
                            id="notes"
                            placeholder="Additional recommendations..."
                            value={doctorNotes}
                            onChange={(e) => setDoctorNotes(e.target.value)}
                            rows={2}
                          />
                        </div>
                      </div>
                      <div className="flex gap-3">
                        <Button
                          variant="outline"
                          onClick={() => setIsApproveDialogOpen(false)}
                          className="flex-1"
                        >
                          Cancel
                        </Button>
                        <Button
                          onClick={handleApprove}
                          disabled={
                            isSubmitting ||
                            !medication ||
                            !dosage ||
                            !frequency ||
                            !duration
                          }
                          className="flex-1"
                          variant="success"
                        >
                          {isSubmitting && (
                            <Loader2 className="h-4 w-4 animate-spin mr-2" />
                          )}
                          Issue Prescription
                        </Button>
                      </div>
                    </DialogContent>
                  </Dialog>

                  {/* Reject Dialog */}
                  <Dialog
                    open={isRejectDialogOpen}
                    onOpenChange={setIsRejectDialogOpen}
                  >
                    <DialogTrigger asChild>
                      <Button className="w-full" variant="outline">
                        <XCircle className="h-4 w-4 mr-2" />
                        Reject Request
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Reject Request</DialogTitle>
                        <DialogDescription>
                          Provide rejection reason for the patient
                        </DialogDescription>
                      </DialogHeader>
                      <div className="space-y-4 py-4">
                        <div className="space-y-2">
                          <Label htmlFor="rejectReason">Rejection Reason</Label>
                          <Textarea
                            id="rejectReason"
                            placeholder="Explain to the patient why the request cannot be approved..."
                            value={rejectReason}
                            onChange={(e) => setRejectReason(e.target.value)}
                            rows={4}
                          />
                        </div>
                      </div>
                      <div className="flex gap-3">
                        <Button
                          variant="outline"
                          onClick={() => setIsRejectDialogOpen(false)}
                          className="flex-1"
                        >
                          Cancel
                        </Button>
                        <Button
                          onClick={handleReject}
                          disabled={isSubmitting || !rejectReason}
                          className="flex-1"
                          variant="destructive"
                        >
                          {isSubmitting && (
                            <Loader2 className="h-4 w-4 animate-spin mr-2" />
                          )}
                          Reject
                        </Button>
                      </div>
                    </DialogContent>
                  </Dialog>
                </CardContent>
              </Card>
            )}

            {/* Issued Prescription */}
            {request.prescription && (
              <Card className="border-success/30 bg-success/5">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-success">
                    <Pill className="h-5 w-5" />
                    Issued Prescription
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
                </CardContent>
              </Card>
            )}

            {/* Doctor Notes */}
            {request.doctorNotes && (
              <Card>
                <CardHeader>
                  <CardTitle>Your Comment</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-foreground">{request.doctorNotes}</p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
}
