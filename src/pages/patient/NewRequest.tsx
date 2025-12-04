import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { useAuth } from "@/contexts/AuthContext";
import { useRequests } from "@/contexts/RequestsContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Upload, X, Loader2, FileText, Plus } from "lucide-react";
import { Attachment } from "@/types";
import { toast } from "sonner";

const commonSymptoms = [
  "Anxiety",
  "Depression",
  "Sleep Disorders",
  "Panic Attacks",
  "Stress",
  "Irritability",
  "Reduced Concentration",
  "Apathy",
  "Obsessive Thoughts",
  "Social Anxiety",
];

export default function NewRequest() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { createRequest } = useRequests();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [selectedSymptoms, setSelectedSymptoms] = useState<string[]>([]);
  const [customSymptom, setCustomSymptom] = useState("");
  const [attachments, setAttachments] = useState<Attachment[]>([]);

  const toggleSymptom = (symptom: string) => {
    setSelectedSymptoms((prev) =>
      prev.includes(symptom)
        ? prev.filter((s) => s !== symptom)
        : [...prev, symptom]
    );
  };

  const addCustomSymptom = () => {
    if (
      customSymptom.trim() &&
      !selectedSymptoms.includes(customSymptom.trim())
    ) {
      setSelectedSymptoms((prev) => [...prev, customSymptom.trim()]);
      setCustomSymptom("");
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    const newAttachments: Attachment[] = Array.from(files).map((file) => ({
      id: Math.random().toString(36).substr(2, 9),
      name: file.name,
      type: file.type,
      size: file.size,
      url: URL.createObjectURL(file),
    }));

    setAttachments((prev) => [...prev, ...newAttachments]);
  };

  const removeAttachment = (id: string) => {
    setAttachments((prev) => prev.filter((a) => a.id !== id));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user) return;
    if (selectedSymptoms.length === 0) {
      toast.error("Please select at least one symptom");
      return;
    }

    setIsSubmitting(true);

    try {
      await createRequest({
        patientId: user.id,
        patientName: user.name,
        patientEmail: user.email,
        title,
        description,
        symptoms: selectedSymptoms,
        attachments,
      });

      toast.success("Request created successfully!");
      navigate("/patient");
    } catch (error) {
      toast.error("Error creating request");
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + " B";
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
    return (bytes / (1024 * 1024)).toFixed(1) + " MB";
  };

  return (
    <Layout>
      <div className="container py-8 max-w-3xl">
        {/* Header */}
        <div className="mb-8">
          <Link
            to="/patient"
            className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-4"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to List
          </Link>
          <h1 className="text-3xl font-display font-bold text-foreground">
            New Prescription Request
          </h1>
          <p className="text-muted-foreground mt-2">
            Describe your symptoms and attach documents for the doctor
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Info */}
          <Card>
            <CardHeader>
              <CardTitle>Basic Information</CardTitle>
              <CardDescription>
                Enter the title and detailed description of your request
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Request Title</Label>
                <Input
                  id="title"
                  placeholder="E.g.: Extension of antidepressant prescription"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Detailed Description</Label>
                <Textarea
                  id="description"
                  placeholder="Describe your condition, how long you've had symptoms, what medications you've taken before..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={5}
                  required
                />
              </div>
            </CardContent>
          </Card>

          {/* Symptoms */}
          <Card>
            <CardHeader>
              <CardTitle>Symptoms</CardTitle>
              <CardDescription>
                Select the symptoms that bother you
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-wrap gap-2">
                {commonSymptoms.map((symptom) => (
                  <Badge
                    key={symptom}
                    variant={
                      selectedSymptoms.includes(symptom) ? "default" : "outline"
                    }
                    className="cursor-pointer transition-all hover:scale-105"
                    onClick={() => toggleSymptom(symptom)}
                  >
                    {symptom}
                  </Badge>
                ))}
              </div>

              <div className="flex gap-2">
                <Input
                  placeholder="Add your own symptom"
                  value={customSymptom}
                  onChange={(e) => setCustomSymptom(e.target.value)}
                  onKeyPress={(e) =>
                    e.key === "Enter" &&
                    (e.preventDefault(), addCustomSymptom())
                  }
                />
                <Button
                  type="button"
                  variant="outline"
                  onClick={addCustomSymptom}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>

              {selectedSymptoms.length > 0 && (
                <div className="pt-4 border-t border-border">
                  <p className="text-sm text-muted-foreground mb-2">
                    Selected symptoms:
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {selectedSymptoms.map((symptom) => (
                      <Badge
                        key={symptom}
                        variant="secondary"
                        className="gap-1"
                      >
                        {symptom}
                        <button
                          type="button"
                          onClick={() => toggleSymptom(symptom)}
                          className="ml-1 hover:text-destructive"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Attachments */}
          <Card>
            <CardHeader>
              <CardTitle>Attached Files</CardTitle>
              <CardDescription>
                Attach old prescriptions, test results or other documents
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="border-2 border-dashed border-border rounded-xl p-8 text-center hover:border-primary/50 transition-colors">
                <input
                  type="file"
                  id="file-upload"
                  multiple
                  onChange={handleFileUpload}
                  className="hidden"
                  accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                />
                <label htmlFor="file-upload" className="cursor-pointer">
                  <Upload className="h-10 w-10 text-muted-foreground mx-auto mb-4" />
                  <p className="text-foreground font-medium mb-1">
                    Click to upload files
                  </p>
                  <p className="text-sm text-muted-foreground">
                    PDF, DOC, DOCX, JPG, PNG up to 10 MB
                  </p>
                </label>
              </div>

              {attachments.length > 0 && (
                <div className="space-y-2">
                  {attachments.map((file) => (
                    <div
                      key={file.id}
                      className="flex items-center gap-3 p-3 rounded-lg bg-muted/50 border border-border/50"
                    >
                      <FileText className="h-5 w-5 text-muted-foreground" />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">
                          {file.name}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {formatFileSize(file.size)}
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => removeAttachment(file.id)}
                        className="p-1 hover:bg-destructive/10 rounded text-muted-foreground hover:text-destructive transition-colors"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Submit */}
          <div className="flex gap-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate("/patient")}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button type="submit" className="flex-1" disabled={isSubmitting}>
              {isSubmitting && (
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
              )}
              Submit Request
            </Button>
          </div>
        </form>
      </div>
    </Layout>
  );
}
