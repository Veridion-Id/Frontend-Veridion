"use client";

import { useState } from "react";
import { Button } from "@/shared/ui/button";
import { Input } from "@/shared/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/shared/ui/dialog";
import { LocalStorageService } from "@/shared/services/local-storage.service";
import { User } from "@/shared/types/user.types";
import { Keypair } from "@stellar/stellar-sdk";

interface RegistrationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (user: User) => void;
  wallet: string;
  signer: Keypair | null;
  walletType?: string;
}

interface FormData {
  name: string;
  surnames: string;
}

interface FormErrors {
  name?: string;
  surnames?: string;
  general?: string;
}

export function RegistrationModal({
  isOpen,
  onClose,
  onSuccess,
  wallet,
  signer,
  walletType = "unknown",
}: RegistrationModalProps) {
  const [formData, setFormData] = useState<FormData>({
    name: "",
    surnames: "",
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [isLoading, setIsLoading] = useState(false);

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
    } else if (formData.name.trim().length < 2) {
      newErrors.name = "Name must be at least 2 characters";
    }

    if (!formData.surnames.trim()) {
      newErrors.surnames = "Surnames are required";
    } else if (formData.surnames.trim().length < 2) {
      newErrors.surnames = "Surnames must be at least 2 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));

    // Clear field error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    setErrors({});

    try {
      const userData = {
        wallet,
        name: formData.name.trim(),
        surnames: formData.surnames.trim(),
      };

      // Register in localStorage
      const newUser = LocalStorageService.createUser(userData);

      onSuccess(newUser);
      onClose();
      // Reset form
      setFormData({ name: "", surnames: "" });
    } catch (error) {
      setErrors({
        general:
          error instanceof Error
            ? error.message
            : "Unexpected error registering user",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    if (!isLoading) {
      onClose();
      setErrors({});
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-center">
            Complete Registration
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="text-center text-sm text-muted-foreground">
            <p>
              Your wallet{" "}
              <code className="bg-muted px-1 py-0.5 rounded text-xs">
                {wallet}
              </code>{" "}
              is not registered.
            </p>
            <p>Complete the following data to continue:</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="name" className="text-sm font-medium">
                Name *
              </label>
              <Input
                id="name"
                type="text"
                placeholder="Your name"
                value={formData.name}
                onChange={(e) => handleInputChange("name", e.target.value)}
                disabled={isLoading}
                className={errors.name ? "border-red-500" : ""}
              />
              {errors.name && (
                <p className="text-sm text-red-500">{errors.name}</p>
              )}
            </div>

            <div className="space-y-2">
              <label htmlFor="surnames" className="text-sm font-medium">
                Surnames *
              </label>
              <Input
                id="surnames"
                type="text"
                placeholder="Your surnames"
                value={formData.surnames}
                onChange={(e) => handleInputChange("surnames", e.target.value)}
                disabled={isLoading}
                className={errors.surnames ? "border-red-500" : ""}
              />
              {errors.surnames && (
                <p className="text-sm text-red-500">{errors.surnames}</p>
              )}
            </div>

            {errors.general && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-md">
                <p className="text-sm text-red-600">{errors.general}</p>
              </div>
            )}

            <div className="flex gap-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={handleClose}
                disabled={isLoading}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isLoading} className="flex-1">
                {isLoading ? "Registering..." : "Register"}
              </Button>
            </div>
          </form>

          <div className="text-xs text-muted-foreground text-center">
            <p>
              By registering, you accept our terms of service and privacy
              policy.
            </p>
            <p>Your information will be stored securely and encrypted.</p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
