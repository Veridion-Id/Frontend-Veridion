"use client";

import { Card, CardContent } from "@/shared/ui/card";
import { Separator } from "@/shared/components/separator";
import { Badge } from "@/shared/ui/badge";
import { Circle, CheckCircle } from "lucide-react";
import { type PhysicalVerification, type SocialMediaVerification } from "../../features/dashboard/constants/verification-methods";
import { useVerificationStore } from "../../features/dashboard/store/verification-store";

interface VerificationCardProps {
  method: PhysicalVerification | SocialMediaVerification;
  type?: "physical" | "social";
  onClick?: () => void;
}

export function VerificationCard({ method, type = "physical", onClick }: VerificationCardProps) {
  const isSocialMedia = type === "social";
  const { isVerificationCompleted } = useVerificationStore();
  const isCompleted = isVerificationCompleted(method.id);

  return (
    <Card 
      className="bg-gradient-to-br from-card-darker to-card-dark border-[2px] border-gray-700/30 hover:border-gray-600/50 transition-colors duration-200 relative z-10 cursor-pointer hover:scale-[1.02] transform transition-all"
      onClick={onClick}
    >
      <CardContent className="p-4 sm:p-6">
        <div className="space-y-3 sm:space-y-4">
          {/* Header */}
          <div className="flex items-start gap-2 sm:gap-3">
            <div className="p-1.5 sm:p-2 bg-gray-800/50 rounded-lg">
              <method.icon 
                size={isSocialMedia ? 20 : 16} 
                className={`${isSocialMedia ? 'sm:w-5 sm:h-5' : 'h-4 w-4 sm:h-5 sm:w-5'} text-gray-300`} 
              />
            </div>
            <div className="flex-1">
              <h4 className="font-semibold text-white text-sm sm:text-base">{method.title}</h4>
              <p className="text-sm text-gray-400 mt-1 leading-relaxed">
                {method.description}
              </p>
            </div>
          </div>

          {/* Security Verification - Only for Physical */}
          {!isSocialMedia && (
            <div>
              <p className="text-sm text-gray-500 mb-2">Security verification</p>
            </div>
          )}

          {/* Points and Stats */}
          <div className="space-y-3">
            <Separator className="my-2" />
            <Badge 
              variant="outline" 
              className={`rounded-full p-2 text-sm ${
                isCompleted 
                  ? 'border-green-500 text-green-400 bg-green-500/10' 
                  : 'border-gray-600 text-gray-300 bg-button-verify'
              }`}
            >
              {isCompleted ? (
                <CheckCircle className="h-3 w-3 mr-1 fill-current" />
              ) : (
                <Circle className="h-3 w-3 mr-1 fill-current" />
              )}
              {method.points} Points
            </Badge>
            
          </div>
        </div>
      </CardContent>
    </Card>
  );
}