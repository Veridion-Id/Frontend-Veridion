'use client';

import React, { useState } from 'react';
import { Dialog, DialogContent, DialogTitle } from '@/shared/ui/dialog';
import { Button } from '@/shared/ui/button';
import { Badge } from '@/shared/ui/badge';
import { Card, CardContent } from '@/shared/ui/card';
import { Separator } from '@/shared/components/separator';
import { X, Clock, DollarSign, CheckCircle, ExternalLink, Coins } from 'lucide-react';
import { StellarVerification } from './stellar-verification';
import { StellarIcon } from '@/shared/components/icons/stellar-icon';
import { useWalletStore } from '@/features/wallet/store/wallet-store';

interface StellarModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function StellarModal({ isOpen, onClose }: StellarModalProps) {
  const [verificationComplete, setVerificationComplete] = useState(false);
  const [verificationData, setVerificationData] = useState<{
    points: number;
    level: string;
    transactionCount: number;
  } | null>(null);

  const { isConnected, publicKey, network } = useWalletStore();

  const handleComplete = (points: number, level: string, transactionCount: number) => {
    setVerificationData({ points, level, transactionCount });
    setVerificationComplete(true);
  };

  const handleError = (error: string) => {
    console.error('Stellar verification error:', error);
  };

  const handleClose = () => {
    setVerificationComplete(false);
    setVerificationData(null);
    onClose();
  };

  const getPointsColor = (points: number) => {
    if (points >= 25) return 'bg-green-100 text-green-800';
    if (points >= 10) return 'bg-blue-100 text-blue-800';
    if (points >= 5) return 'bg-yellow-100 text-yellow-800';
    return 'bg-gray-100 text-gray-800';
  };

  const getLevelColor = (level: string) => {
    if (level.includes('Expert')) return 'bg-purple-100 text-purple-800';
    if (level.includes('Active')) return 'bg-green-100 text-green-800';
    if (level.includes('Regular')) return 'bg-blue-100 text-blue-800';
    if (level.includes('Frequent')) return 'bg-yellow-100 text-yellow-800';
    if (level.includes('Occasional')) return 'bg-orange-100 text-orange-800';
    if (level.includes('New')) return 'bg-gray-100 text-gray-800';
    return 'bg-red-100 text-red-800';
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="bg-[#0B0A0A] border-0 p-0 max-w-4xl h-[95vh] overflow-y-auto">
        <DialogTitle className="sr-only">Stellar Wallet Verification</DialogTitle>

        <div className="flex flex-col h-full p-4">
          {/* Header */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gradient-to-br from-purple-500/20 to-blue-500/20 rounded-lg">
                <StellarIcon size={24} className="text-purple-400" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-white">Stellar Wallet Verification</h2>
                <p className="text-sm text-gray-400">
                  {isConnected ? `Verify your ${network} wallet activity` : 'Verify your blockchain activity'}
                </p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleClose}
              className="text-gray-400 hover:text-white"
            >
              <X className="h-5 w-5" />
            </Button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-3 mb-4">
            <Card className="bg-gradient-to-br from-card-darker to-card-dark border-gray-700/30">
              <CardContent className="p-3 text-center">
                <div className="text-lg font-bold text-white">
                  {verificationData ? verificationData.points : '0-50'}
                </div>
                <div className="text-xs text-gray-400">points gained</div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-card-darker to-card-dark border-gray-700/30">
              <CardContent className="p-3 text-center">
                <Clock className="h-3 w-3 text-blue-400 mx-auto mb-1" />
                <div className="text-xs text-gray-400">Time</div>
                <div className="text-sm font-medium text-white">1-2 min</div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-card-darker to-card-dark border-gray-700/30">
              <CardContent className="p-3 text-center">
                <DollarSign className="h-3 w-3 text-green-400 mx-auto mb-1" />
                <div className="text-xs text-gray-400">Price</div>
                <div className="text-sm font-medium text-white">Free</div>
              </CardContent>
            </Card>
          </div>

          {/* Status */}
          <div className="mb-4">
            <Badge variant="outline" className="border-purple-500 text-purple-400 bg-purple-500/10 text-xs">
              Blockchain Verification
            </Badge>
          </div>

          <Separator className="bg-gray-700 mb-4" />

          {/* Content */}
          <div className="flex-1 overflow-y-auto space-y-4">
            {/* Points Breakdown */}
            <div>
              <h3 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
                <Coins className="h-5 w-5 text-purple-400" />
                Points System
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <Card className="bg-gradient-to-br from-card-darker to-card-dark border-gray-700/30">
                  <CardContent className="p-3">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-white text-sm">≥ 100 transactions</span>
                      <Badge className="bg-green-100 text-green-800">50 points</Badge>
                    </div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-white text-sm">≥ 50 transactions</span>
                      <Badge className="bg-blue-100 text-blue-800">25 points</Badge>
                    </div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-white text-sm">≥ 25 transactions</span>
                      <Badge className="bg-yellow-100 text-yellow-800">15 points</Badge>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-card-darker to-card-dark border-gray-700/30">
                  <CardContent className="p-3">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-white text-sm">≥ 10 transactions</span>
                      <Badge className="bg-yellow-100 text-yellow-800">10 points</Badge>
                    </div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-white text-sm">≥ 5 transactions</span>
                      <Badge className="bg-yellow-100 text-yellow-800">5 points</Badge>
                    </div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-white text-sm">≥ 1 transaction</span>
                      <Badge className="bg-gray-100 text-gray-800">1 point</Badge>
                    </div>
                  </CardContent>
                  </Card>
              </div>
            </div>

            <Separator className="bg-gray-700" />

            {/* Requirements */}
            <div>
              <h3 className="text-lg font-semibold text-white mb-3">Requirements</h3>
              <div className="space-y-2">
                <div className="flex items-start gap-2">
                  <div className="w-1 h-1 bg-purple-400 rounded-full mt-1.5 flex-shrink-0" />
                  <p className="text-sm text-gray-300 leading-relaxed">
                    Must have a valid Stellar account ID (starts with &apos;G&apos;)
                  </p>
                </div>
                <div className="flex items-start gap-2">
                  <div className="w-1 h-1 bg-purple-400 rounded-full mt-1.5 flex-shrink-0" />
                  <p className="text-sm text-gray-300 leading-relaxed">
                    Account must have at least 1 transaction
                  </p>
                </div>
                <div className="flex items-start gap-2">
                  <div className="w-1 h-1 bg-purple-400 rounded-full mt-1.5 flex-shrink-0" />
                  <p className="text-sm text-gray-300 leading-relaxed">
                    Account must exist on Stellar network ({network})
                  </p>
                </div>
              </div>
            </div>

            <Separator className="bg-gray-700" />

            {/* Verification Result */}
            {verificationComplete && verificationData && (
              <div>
                <h3 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-green-400" />
                  Verification Complete!
                </h3>
                <Card className="bg-green-500/10 border-green-500/20">
                  <CardContent className="p-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="text-center">
                        <p className="text-2xl font-bold text-white">
                          {verificationData.transactionCount}
                        </p>
                        <p className="text-sm text-gray-400">Total Transactions</p>
                      </div>

                      <div className="text-center">
                        <Badge className={`${getPointsColor(verificationData.points)} text-lg px-3 py-1`}>
                          {verificationData.points} Points
                        </Badge>
                        <p className="text-sm text-gray-400 mt-1">Earned</p>
                      </div>

                      <div className="text-center">
                        <Badge className={`${getLevelColor(verificationData.level)} text-sm px-3 py-1`}>
                          {verificationData.level}
                        </Badge>
                        <p className="text-sm text-gray-400 mt-1">Level</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="pt-4 border-t border-gray-700">
            {!verificationComplete ? (
              <StellarVerification
                onComplete={handleComplete}
                onError={handleError}
              />
            ) : (
              <div className="space-y-3">
                <Button
                  className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white"
                  onClick={handleClose}
                >
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Close
                </Button>
                <Button
                  variant="outline"
                  className="w-full border-gray-600 text-gray-300 hover:bg-gray-700"
                  onClick={() => {
                    const explorerUrl = network === 'testnet'
                      ? 'https://stellar.expert/explorer/testnet'
                      : 'https://stellar.expert/explorer/public';
                    window.open(explorerUrl, '_blank');
                  }}
                >
                  <ExternalLink className="h-4 w-4 mr-2" />
                  View Stellar Explorer ({network})
                </Button>
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}