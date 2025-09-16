"use client";

import React from 'react';
import { Dialog, DialogContent, DialogTitle } from '@/shared/ui/dialog';
import { Button } from '@/shared/ui/button';
import { Badge } from '@/shared/ui/badge';
import { Card, CardContent } from '@/shared/ui/card';
import { Separator } from '@/shared/components/separator';
import { X, Clock, DollarSign, CheckCircle } from 'lucide-react';
import { GoogleAuth } from './social/google/google-auth';
import { DiscordAuth } from './social/discord/discord-auth';
import { GitHubAuth } from './social/github/github-auth';
import { LinkedInAuth } from './social/linkedin/linkedin-auth';
import { StellarVerification } from './blockchain/stellar-verification';

interface Achievement {
  readonly title: string;
  readonly points: number;
  readonly description: string;
}

interface VerificationModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  points: string | number;
  time: string;
  price: string;
  status: string;
  achievements: readonly Achievement[];
  requirements: readonly string[];
  verificationId?: string;
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
  requirements,
  verificationId
}: VerificationModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-[#0B0A0A] border-0 p-0">
        <DialogTitle className="sr-only">{title}</DialogTitle>
            <div className="flex flex-col h-full p-4">
              {/* Header */}
              <div className="flex items-center justify-between mb-4">
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
          <div className="grid grid-cols-3 gap-3 mb-4">
            <Card className="bg-gradient-to-br from-card-darker to-card-dark border-gray-700/30">
              <CardContent className="p-3 text-center">
                <div className="text-lg font-bold text-white">{points}</div>
                <div className="text-xs text-gray-400">points gained</div>
              </CardContent>
            </Card>
            
            <Card className="bg-gradient-to-br from-card-darker to-card-dark border-gray-700/30">
              <CardContent className="p-3 text-center">
                <Clock className="h-3 w-3 text-blue-400 mx-auto mb-1" />
                <div className="text-xs text-gray-400">Time</div>
                <div className="text-sm font-medium text-white">{time}</div>
              </CardContent>
            </Card>
            
            <Card className="bg-gradient-to-br from-card-darker to-card-dark border-gray-700/30">
              <CardContent className="p-3 text-center">
                <DollarSign className="h-3 w-3 text-green-400 mx-auto mb-1" />
                <div className="text-xs text-gray-400">Price</div>
                <div className="text-sm font-medium text-white">{price}</div>
              </CardContent>
            </Card>
          </div>

          {/* Status */}
          <div className="mb-4">
            <Badge variant="outline" className="border-blue-500 text-blue-400 bg-blue-500/10 text-xs">
              {status}
            </Badge>
          </div>

          <Separator className="bg-gray-700 mb-4" />

          {/* Content */}
          <div className="flex-1 overflow-y-auto space-y-4">
            {/* Achievements */}
            <div>
              <h3 className="text-lg font-semibold text-white mb-3">Developer Activity</h3>
              <div className="space-y-2">
                {achievements.map((achievement, index) => (
                  <Card key={index} className="bg-gradient-to-br from-card-darker to-card-dark border-gray-700/30">
                    <CardContent className="p-3">
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
              <h3 className="text-lg font-semibold text-white mb-3">Stamp Requirements</h3>
              <div className="space-y-2">
                {requirements.map((requirement, index) => (
                  <div key={index} className="flex items-start gap-2">
                    <div className="w-1 h-1 bg-blue-400 rounded-full mt-1.5 flex-shrink-0" />
                    <p className="text-sm text-gray-300 leading-relaxed">
                      {requirement}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="pt-4 border-t border-gray-700">
            {verificationId === 'google' ? (
              <GoogleAuth 
                onSuccess={() => {
                  console.log('Google verification completed');
                  onClose();
                }}
                onError={(error) => {
                  console.error('Google verification failed:', error);
                }}
              />
            ) : verificationId === 'discord' ? (
              <DiscordAuth 
                onSuccess={() => {
                  console.log('Discord verification completed');
                  onClose();
                }}
                onError={(error) => {
                  console.error('Discord verification failed:', error);
                }}
              />
                ) : verificationId === 'github' ? (
                  <GitHubAuth
                    onSuccess={() => {
                      console.log('GitHub verification completed');
                      onClose();
                    }}
                    onError={(error) => {
                      console.error('GitHub verification failed:', error);
                    }}
                  />
                ) : verificationId === 'linkedin' ? (
                  <LinkedInAuth
                    onSuccess={() => {
                      console.log('LinkedIn verification completed');
                      onClose();
                    }}
                    onError={(error) => {
                      console.error('LinkedIn verification failed:', error);
                    }}
                  />
                ) : verificationId === 'stellar-transactions' ? (
                  <StellarVerification
                    onComplete={(points, level, transactionCount) => {
                      console.log('Stellar verification completed:', { points, level, transactionCount });
                      onClose();
                    }}
                    onError={(error) => {
                      console.error('Stellar verification failed:', error);
                    }}
                  />
                ) : (
              <Button 
                className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                onClick={onClose}
              >
                <CheckCircle className="h-4 w-4 mr-2" />
                Start Verification
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
