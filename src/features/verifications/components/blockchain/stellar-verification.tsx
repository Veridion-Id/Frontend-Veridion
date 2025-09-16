'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/ui/card';
import { Button } from '@/shared/ui/button';
import { Input } from '@/shared/ui/input';
import { Badge } from '@/shared/ui/badge';
import { Separator } from '@/shared/components/separator';
import { StellarIcon } from '@/shared/components/icons/stellar-icon';
import { stellarApi, stellarMainnetApi, StellarAccountInfo } from '../../services/stellar-api';
import { useVerificationStore } from '../../store/verification-store';
import { useWalletStore } from '@/features/wallet/store/wallet-store';
import { CheckCircle, Circle, Loader2, ExternalLink } from 'lucide-react';

interface StellarVerificationProps {
  onComplete?: (points: number, level: string, transactionCount: number) => void;
  onError?: (error: string) => void;
}

export const StellarVerification: React.FC<StellarVerificationProps> = ({ onComplete, onError }) => {
  const [accountId, setAccountId] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [verificationResult, setVerificationResult] = useState<{
    transactionCount: number;
    points: number;
    level: string;
    accountInfo: StellarAccountInfo | null;
  } | null>(null);
  const [isVerified, setIsVerified] = useState(false);

  const { completeVerification } = useVerificationStore();
  const { publicKey, isConnected, network } = useWalletStore();

  // Auto-fill with connected wallet if available
  React.useEffect(() => {
    if (isConnected && publicKey) {
      setAccountId(publicKey);
    }
  }, [isConnected, publicKey]);

  const handleVerify = async () => {
    if (!accountId.trim()) {
      setError('Please enter a valid Stellar account ID');
      return;
    }

    setLoading(true);
    setError(null);
    setVerificationResult(null);

    try {
      // Use the appropriate API based on network
      const api = network === 'testnet' ? stellarApi : stellarMainnetApi;
      console.log('Using network:', network, 'API:', api === stellarApi ? 'testnet' : 'mainnet');
      console.log('Verifying account:', accountId);
      
      // Test with a known testnet account that has transactions
      if (network === 'testnet' && accountId.includes('GDKB')) {
        console.log('Testing with known testnet account');
      }
      
      // Check if the account exists
      const exists = await api.accountExists(accountId);
      console.log('Account exists:', exists);
      if (!exists) {
        setError('Account not found on Stellar network');
        setLoading(false);
        return;
      }

      // Get account information
      const accountInfo = await api.getAccountInfo(accountId);
      console.log('Account info:', accountInfo);
      if (!accountInfo) {
        setError('Could not retrieve account information');
        setLoading(false);
        return;
      }

      // Get the number of transactions
      const transactionCount = await api.getTransactionCount(accountId);
      console.log('Transaction count:', transactionCount);
      
      // Also get some sample transactions to debug
      const sampleTransactions = await api.getLatestTransactions(accountId, 5);
      console.log('Sample transactions:', sampleTransactions);
      
      // Calculate points and level
      const points = api.calculatePoints(transactionCount);
      const level = api.getVerificationLevel(transactionCount);

      setVerificationResult({
        transactionCount,
        points,
        level,
        accountInfo
      });

      console.log('Final verification check:', {
        transactionCount,
        points,
        level,
        hasTransactions: transactionCount >= 1
      });

      // If there's at least 1 transaction, complete the verification
      if (transactionCount >= 1) {
        completeVerification('stellar-transactions', 'blockchain', points);
        setIsVerified(true);
        onComplete?.(points, level, transactionCount);
      } else {
        console.log('No transactions found, showing error');
        onError?.('Account must have at least 1 transaction to complete verification');
      }

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An error occurred during verification';
      setError(errorMessage);
      onError?.(errorMessage);
      console.error('Stellar verification error:', err);
    } finally {
      setLoading(false);
    }
  };

  const formatBalance = (balance: { asset_type: string; balance: string; asset_code?: string }) => {
    if (balance.asset_type === 'native') {
      return `${parseFloat(balance.balance).toFixed(7)} XLM`;
    }
    return `${balance.balance} ${balance.asset_code || balance.asset_type}`;
  };

  const getPointsBreakdown = (_transactionCount: number) => {
    return [
      {
        minTransactions: 100,
        points: 50,
        description: 'Stellar Master'
      },
      {
        minTransactions: 50,
        points: 25,
        description: 'Stellar Expert'
      },
      {
        minTransactions: 25,
        points: 15,
        description: 'Stellar Pro'
      },
      {
        minTransactions: 10,
        points: 10,
        description: 'Stellar Active'
      },
      {
        minTransactions: 5,
        points: 5,
        description: 'Stellar User'
      },
      {
        minTransactions: 1,
        points: 1,
        description: 'Stellar Beginner'
      }
    ];
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
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="p-2 bg-gradient-to-br from-purple-500/20 to-blue-500/20 rounded-lg">
          <StellarIcon size={24} className="text-purple-400" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-white">Stellar Wallet Verification</h3>
          <p className="text-sm text-gray-400">Verify your Stellar blockchain activity</p>
        </div>
      </div>

      {/* Wallet Connection Status */}
      {isConnected && publicKey && (
        <Card className="bg-gradient-to-br from-green-500/10 to-blue-500/10 border-green-500/20">
          <CardContent className="pt-6">
            <div className="flex items-center gap-2 text-green-400 mb-2">
              <CheckCircle className="h-5 w-5" />
              <p className="font-semibold">Wallet Connected</p>
            </div>
            <div className="text-sm text-gray-300">
              <p><span className="text-gray-400">Account:</span> <span className="font-mono">{publicKey}</span></p>
              <p><span className="text-gray-400">Network:</span> <span className="capitalize">{network}</span></p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Input Section */}
      <Card className="bg-gradient-to-br from-card-darker to-card-dark border-gray-700/30">
        <CardHeader>
          <CardTitle className="text-white">
            {isConnected ? 'Verify Connected Wallet' : 'Enter Stellar Account ID'}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <Input
              placeholder="GABC123... (Stellar Account ID)"
              value={accountId}
              onChange={(e) => setAccountId(e.target.value)}
              className="flex-1 bg-gray-800/50 border-gray-600 text-white placeholder-gray-400"
              disabled={loading || isConnected}
            />
            <Button 
              onClick={handleVerify}
              disabled={loading || !accountId.trim()}
              className="border border-white hover:bg-white/10"
            >
              {loading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                'Verify'
              )}
            </Button>
          </div>
          

          {!isConnected && (
            <p className="text-sm text-gray-400">
              Connect your wallet to automatically verify your account, or enter a Stellar account ID manually.
            </p>
          )}
          
          {error && (
            <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg">
              <p className="text-red-400 text-sm">{error}</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Points Breakdown - Always Visible */}
      <Card className="bg-gradient-to-br from-card-darker to-card-dark border-gray-700/30">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <StellarIcon size={20} className="text-purple-400" />
            Points Breakdown
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {getPointsBreakdown(0).map((tier, index) => (
              <div key={index} className={`flex items-center justify-between p-3 rounded-lg ${
                verificationResult && verificationResult.transactionCount >= tier.minTransactions 
                  ? 'bg-green-500/10 border border-green-500/20' 
                  : 'bg-gray-800/30'
              }`}>
                <div className="flex items-center gap-3">
                  <div className={`w-3 h-3 rounded-full ${
                    verificationResult && verificationResult.transactionCount >= tier.minTransactions 
                      ? 'bg-green-400' 
                      : 'bg-gray-600'
                  }`} />
                  <div>
                    <p className="text-white font-medium">{tier.description}</p>
                    <p className="text-sm text-gray-400">{tier.minTransactions}+ transactions</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className={`font-bold ${
                    verificationResult && verificationResult.transactionCount >= tier.minTransactions 
                      ? 'text-green-400' 
                      : 'text-gray-400'
                  }`}>
                    {tier.points} points
                  </p>
                  {verificationResult && verificationResult.transactionCount >= tier.minTransactions && (
                    <p className="text-xs text-green-400">✓ Achieved</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Verification Result */}
      {verificationResult && (
        <Card className="bg-gradient-to-br from-card-darker to-card-dark border-gray-700/30">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              {isVerified ? (
                <CheckCircle className="h-5 w-5 text-green-400" />
              ) : (
                <Circle className="h-5 w-5 text-gray-400" />
              )}
              Verification Result
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Account Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-400 mb-1">Account ID</p>
                <p className="font-mono text-sm text-white break-all bg-gray-800/50 p-2 rounded">
                  {verificationResult.accountInfo?.account_id}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-400 mb-1">Sequence</p>
                <p className="font-mono text-sm text-white bg-gray-800/50 p-2 rounded">
                  {verificationResult.accountInfo?.sequence}
                </p>
              </div>
            </div>

            <Separator className="my-4" />

            {/* Transaction Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center p-4 bg-gray-800/30 rounded-lg">
                <p className="text-2xl font-bold text-white">
                  {verificationResult.transactionCount}
                </p>
                <p className="text-sm text-gray-400">Total Transactions</p>
              </div>
              
              <div className="text-center p-4 bg-gray-800/30 rounded-lg">
                <Badge className={`${getPointsColor(verificationResult.points)} text-lg px-3 py-1`}>
                  {verificationResult.points} Points
                </Badge>
                <p className="text-sm text-gray-400 mt-1">Earned</p>
              </div>
              
              <div className="text-center p-4 bg-gray-800/30 rounded-lg">
                <Badge className={`${getLevelColor(verificationResult.level)} text-sm px-3 py-1`}>
                  {verificationResult.level}
                </Badge>
                <p className="text-sm text-gray-400 mt-1">Level</p>
              </div>
            </div>


            {/* Balances */}
            {verificationResult.accountInfo?.balances && verificationResult.accountInfo.balances.length > 0 && (
              <>
                <Separator className="my-4" />
                <div>
                  <p className="text-sm text-gray-400 mb-2">Account Balances</p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    {verificationResult.accountInfo?.balances.map((balance, index: number) => (
                      <div key={index} className="flex justify-between items-center p-2 bg-gray-800/30 rounded">
                        <span className="text-white text-sm">
                          {balance.asset_type === 'native' ? 'XLM' : (balance.asset_code as string)}
                        </span>
                        <span className="font-mono text-sm text-gray-300">
                          {formatBalance(balance)}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            )}

            {/* Points Breakdown */}
            <Separator className="my-4" />
            <div>
              <p className="text-sm text-gray-400 mb-2">Points Breakdown</p>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-300">≥ 100 transactions:</span>
                  <span className="text-white font-semibold">50 points</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-300">≥ 50 transactions:</span>
                  <span className="text-white font-semibold">25 points</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-300">≥ 25 transactions:</span>
                  <span className="text-white font-semibold">15 points</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-300">≥ 10 transactions:</span>
                  <span className="text-white font-semibold">10 points</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-300">≥ 5 transactions:</span>
                  <span className="text-white font-semibold">5 points</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-300">≥ 1 transaction:</span>
                  <span className="text-white font-semibold">1 point</span>
                </div>
              </div>
            </div>

            {/* View on Explorer */}
            <div className="pt-4">
              <Button
                variant="outline"
                className="w-full border-gray-600 text-gray-300 hover:bg-gray-700"
                onClick={() => window.open(`https://stellar.expert/explorer/testnet/account/${accountId}`, '_blank')}
              >
                <ExternalLink className="h-4 w-4 mr-2" />
                View on Stellar Explorer
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Success Message */}
      {isVerified && (
        <Card className="bg-green-500/10 border-green-500/20">
          <CardContent className="pt-6">
            <div className="flex items-center gap-2 text-green-400">
              <CheckCircle className="h-5 w-5" />
              <p className="font-semibold">Verification Completed!</p>
            </div>
            <p className="text-green-300 text-sm mt-1">
              You&apos;ve earned {verificationResult?.points} points for your Stellar activity.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default StellarVerification;
