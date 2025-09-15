"use client";

import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/shared/ui/dialog';
import { Button } from '@/shared/ui/button';
import { Badge } from '@/shared/ui/badge';
import { Card, CardContent } from '@/shared/ui/card';
import { Separator } from '@/shared/components/separator';
import { X, Clock, DollarSign, CheckCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface VerificationModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  points: string | number;
  time: string;
  price: string;
  status: string;
  achievements: Array<{
    title: string;
    points: number;
    description: string;
  }>;
  requirements: string[];
}

export function VerificationModal({
  isOpen,
  onClose,
  title,
  points,
  time,
  price,
  status,
  achievements,
  requirements
}: VerificationModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-[#0B0A0A] border-l border-gray-700 p-0">
        <DialogTitle className="sr-only">{title}</DialogTitle>
        <div className="flex flex-col h-full p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-white">{title}</h2>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="text-gray-400 hover:text-white"
            >
              <X className="h-5 w-5" />
            </Button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4 mb-6">
            <Card className="bg-gradient-to-br from-card-darker to-card-dark border-gray-700/30">
              <CardContent className="p-4 text-center">
                <div className="text-lg font-bold text-white">{points}</div>
                <div className="text-xs text-gray-400">points gained</div>
              </CardContent>
            </Card>
            
            <Card className="bg-gradient-to-br from-card-darker to-card-dark border-gray-700/30">
              <CardContent className="p-4 text-center">
                <Clock className="h-4 w-4 text-blue-400 mx-auto mb-1" />
                <div className="text-xs text-gray-400">Time</div>
                <div className="text-sm font-medium text-white">{time}</div>
              </CardContent>
            </Card>
            
            <Card className="bg-gradient-to-br from-card-darker to-card-dark border-gray-700/30">
              <CardContent className="p-4 text-center">
                <DollarSign className="h-4 w-4 text-green-400 mx-auto mb-1" />
                <div className="text-xs text-gray-400">Price</div>
                <div className="text-sm font-medium text-white">{price}</div>
              </CardContent>
            </Card>
          </div>

          {/* Status */}
          <div className="mb-6">
            <Badge variant="outline" className="border-blue-500 text-blue-400 bg-blue-500/10">
              {status}
            </Badge>
          </div>

          <Separator className="bg-gray-700 mb-6" />

          {/* Content */}
          <div className="flex-1 overflow-y-auto space-y-6">
            {/* Achievements */}
            <div>
              <h3 className="text-lg font-semibold text-white mb-4">Developer Activity</h3>
              <div className="space-y-3">
                {achievements.map((achievement, index) => (
                  <Card key={index} className="bg-gradient-to-br from-card-darker to-card-dark border-gray-700/30">
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h4 className="font-medium text-white text-sm">{achievement.title}</h4>
                            <Badge variant="outline" className="border-green-500 text-green-400 bg-green-500/10 text-xs">
                              +{achievement.points}
                            </Badge>
                          </div>
                          <p className="text-xs text-gray-400 leading-relaxed">
                            {achievement.description}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            <Separator className="bg-gray-700" />

            {/* Requirements */}
            <div>
              <h3 className="text-lg font-semibold text-white mb-4">Stamp Requirements</h3>
              <div className="space-y-3">
                {requirements.map((requirement, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <div className="w-1.5 h-1.5 bg-blue-400 rounded-full mt-2 flex-shrink-0" />
                    <p className="text-sm text-gray-300 leading-relaxed">
                      {requirement}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="pt-6 border-t border-gray-700">
            <Button 
              className="w-full bg-blue-600 hover:bg-blue-700 text-white"
              onClick={onClose}
            >
              <CheckCircle className="h-4 w-4 mr-2" />
              Start Verification
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
