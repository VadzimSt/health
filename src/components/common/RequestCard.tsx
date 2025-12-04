import { Link } from "react-router-dom";
import { PrescriptionRequest } from "@/types";
import { StatusBadge } from "./StatusBadge";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText, Paperclip, Calendar, ArrowRight } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { enUS } from "date-fns/locale";

interface RequestCardProps {
  request: PrescriptionRequest;
  linkTo: string;
  showPatientInfo?: boolean;
}

export function RequestCard({
  request,
  linkTo,
  showPatientInfo = false,
}: RequestCardProps) {
  return (
    <Card className="group hover:shadow-elevated transition-all duration-300 border-border/50 overflow-hidden">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors line-clamp-1">
              {request.title}
            </h3>
            {showPatientInfo && (
              <p className="text-sm text-muted-foreground mt-1">
                {request.patientName} • {request.patientEmail}
              </p>
            )}
          </div>
          <StatusBadge status={request.status} />
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
          {request.description}
        </p>

        <div className="flex flex-wrap gap-2 mb-4">
          {request.symptoms.slice(0, 3).map((symptom, index) => (
            <span
              key={index}
              className="px-2 py-1 bg-accent text-accent-foreground text-xs rounded-md"
            >
              {symptom}
            </span>
          ))}
          {request.symptoms.length > 3 && (
            <span className="px-2 py-1 text-xs text-muted-foreground">
              +{request.symptoms.length - 3}
            </span>
          )}
        </div>

        <div className="flex items-center justify-between pt-3 border-t border-border/50">
          <div className="flex items-center gap-4 text-xs text-muted-foreground">
            <span className="flex items-center gap-1">
              <Calendar className="h-3.5 w-3.5" />
              {formatDistanceToNow(request.createdAt, {
                addSuffix: true,
                locale: enUS,
              })}
            </span>
            {request.attachments.length > 0 && (
              <span className="flex items-center gap-1">
                <Paperclip className="h-3.5 w-3.5" />
                {request.attachments.length}
              </span>
            )}
            {request.prescription && (
              <span className="flex items-center gap-1 text-success">
                <FileText className="h-3.5 w-3.5" />
                Prescription Issued
              </span>
            )}
          </div>
          <Button asChild variant="ghost" size="sm" className="gap-1">
            <Link to={linkTo}>
              Details
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
