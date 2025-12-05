import { useState } from "react";
import { User } from "@/types";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { CreditCard, AlertCircle } from "lucide-react";

interface PaymentFormProps {
  user: User;
}

export function PaymentForm({ user }: PaymentFormProps) {
  const { updateProfile } = useAuth();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const [formData, setFormData] = useState({
    cardNumber: user.paymentMethod?.cardNumber || "",
    expiryDate: user.paymentMethod?.expiryDate || "",
    cvc: user.paymentMethod?.cvc || "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (
      formData.cardNumber &&
      !/^\d{13,19}$/.test(formData.cardNumber.replace(/\s/g, ""))
    ) {
      newErrors.cardNumber = "Card number must be 13-19 digits";
    }

    if (
      formData.expiryDate &&
      !/^(0[1-9]|1[0-2])\/\d{2}$/.test(formData.expiryDate)
    ) {
      newErrors.expiryDate = "Expiry date must be in MM/YY format";
    }

    if (formData.cvc && !/^\d{3,4}$/.test(formData.cvc)) {
      newErrors.cvc = "CVC must be 3-4 digits";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      setIsLoading(true);
      await updateProfile({
        paymentMethod: formData,
      });
      toast({
        title: "Payment method updated",
        description: "Your payment information has been saved successfully.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update payment method. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="space-y-2">
          <Label htmlFor="cardNumber">
            <div className="flex items-center gap-2">
              <CreditCard className="h-4 w-4" />
              Card Number
            </div>
          </Label>
          <Input
            id="cardNumber"
            name="cardNumber"
            value={formData.cardNumber}
            onChange={handleInputChange}
            placeholder="1234 5678 9012 3456"
            className={`font-mono ${
              errors.cardNumber ? "border-destructive" : ""
            }`}
          />
          {errors.cardNumber && (
            <p className="text-sm text-destructive flex items-center gap-1">
              <AlertCircle className="h-3 w-3" />
              {errors.cardNumber}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="expiryDate">MM/YY</Label>
          <Input
            id="expiryDate"
            name="expiryDate"
            value={formData.expiryDate}
            onChange={handleInputChange}
            placeholder="MM/YY"
            className={errors.expiryDate ? "border-destructive" : ""}
          />
          {errors.expiryDate && (
            <p className="text-sm text-destructive flex items-center gap-1">
              <AlertCircle className="h-3 w-3" />
              {errors.expiryDate}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="cvc">CVC</Label>
          <Input
            id="cvc"
            name="cvc"
            value={formData.cvc}
            onChange={handleInputChange}
            placeholder="123"
            className={errors.cvc ? "border-destructive" : ""}
          />
          {errors.cvc && (
            <p className="text-sm text-destructive flex items-center gap-1">
              <AlertCircle className="h-3 w-3" />
              {errors.cvc}
            </p>
          )}
        </div>
      </div>

      <div className="flex gap-3">
        <Button type="submit" disabled={isLoading}>
          {isLoading ? "Saving..." : "Save Changes"}
        </Button>
      </div>
    </form>
  );
}
