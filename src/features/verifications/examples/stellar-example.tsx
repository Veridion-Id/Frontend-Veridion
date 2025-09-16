'use client';

import React, { useState } from 'react';
import { StellarVerification } from '../components/blockchain/stellar-verification';
import { stellarApi } from '../services/stellar-api';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/ui/card';
import { Button } from '@/shared/ui/button';
import { Badge } from '@/shared/ui/badge';

/**
 * Ejemplo de uso de la verificación de Stellar
 * Este componente muestra cómo usar el servicio de Stellar API
 */
export function StellarExample() {
  const [exampleAccountId, setExampleAccountId] = useState('GABC123...');
  const [verificationResult, setVerificationResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  // Ejemplo de cuentas de testnet para probar
  const testAccounts = [
    {
      id: 'GABC123...',
      name: 'Test Account 1',
      description: 'Cuenta de ejemplo con pocas transacciones'
    },
    {
      id: 'GDEF456...',
      name: 'Test Account 2', 
      description: 'Cuenta de ejemplo con muchas transacciones'
    }
  ];

  const handleTestVerification = async (accountId: string) => {
    setLoading(true);
    try {
      // Verificar si la cuenta existe
      const exists = await stellarApi.accountExists(accountId);
      if (!exists) {
        setVerificationResult({ error: 'Account not found' });
        return;
      }

      // Obtener información de la cuenta
      const accountInfo = await stellarApi.getAccountInfo(accountId);
      const transactionCount = await stellarApi.getTransactionCount(accountId);
      const points = stellarApi.calculatePoints(transactionCount);
      const level = stellarApi.getVerificationLevel(transactionCount);

      setVerificationResult({
        accountInfo,
        transactionCount,
        points,
        level,
        success: true
      });
    } catch (error) {
      setVerificationResult({ 
        error: error instanceof Error ? error.message : 'Unknown error' 
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 p-6">
      <div>
        <h1 className="text-2xl font-bold text-white mb-2">Stellar Verification Example</h1>
        <p className="text-gray-400">
          Este es un ejemplo de cómo funciona la verificación de Stellar
        </p>
      </div>

      {/* Test Accounts */}
      <Card className="bg-gradient-to-br from-card-darker to-card-dark border-gray-700/30">
        <CardHeader>
          <CardTitle className="text-white">Test Accounts</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {testAccounts.map((account, index) => (
              <div key={index} className="p-4 border border-gray-600 rounded-lg">
                <h3 className="font-semibold text-white mb-1">{account.name}</h3>
                <p className="text-sm text-gray-400 mb-2">{account.description}</p>
                <p className="font-mono text-xs text-gray-300 mb-3">{account.id}</p>
                <Button
                  size="sm"
                  onClick={() => handleTestVerification(account.id)}
                  disabled={loading}
                  className="w-full"
                >
                  {loading ? 'Testing...' : 'Test Verification'}
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Verification Result */}
      {verificationResult && (
        <Card className="bg-gradient-to-br from-card-darker to-card-dark border-gray-700/30">
          <CardHeader>
            <CardTitle className="text-white">Verification Result</CardTitle>
          </CardHeader>
          <CardContent>
            {verificationResult.error ? (
              <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-lg">
                <p className="text-red-400">Error: {verificationResult.error}</p>
              </div>
            ) : verificationResult.success ? (
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="text-center p-4 bg-gray-800/30 rounded-lg">
                    <p className="text-2xl font-bold text-white">
                      {verificationResult.transactionCount}
                    </p>
                    <p className="text-sm text-gray-400">Transactions</p>
                  </div>
                  
                  <div className="text-center p-4 bg-gray-800/30 rounded-lg">
                    <Badge className="bg-blue-100 text-blue-800 text-lg px-3 py-1">
                      {verificationResult.points} Points
                    </Badge>
                    <p className="text-sm text-gray-400 mt-1">Earned</p>
                  </div>
                  
                  <div className="text-center p-4 bg-gray-800/30 rounded-lg">
                    <Badge className="bg-green-100 text-green-800 text-sm px-3 py-1">
                      {verificationResult.level}
                    </Badge>
                    <p className="text-sm text-gray-400 mt-1">Level</p>
                  </div>
                </div>

                {verificationResult.accountInfo && (
                  <div>
                    <h4 className="text-white font-semibold mb-2">Account Information</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                      <div>
                        <span className="text-gray-400">Account ID:</span>
                        <p className="font-mono text-white break-all">
                          {verificationResult.accountInfo.account_id}
                        </p>
                      </div>
                      <div>
                        <span className="text-gray-400">Sequence:</span>
                        <p className="font-mono text-white">
                          {verificationResult.accountInfo.sequence}
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ) : null}
          </CardContent>
        </Card>
      )}

      {/* Points System Info */}
      <Card className="bg-gradient-to-br from-card-darker to-card-dark border-gray-700/30">
        <CardHeader>
          <CardTitle className="text-white">Points System</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h4 className="text-white font-semibold mb-2">Transaction Thresholds</h4>
              <div className="space-y-1 text-sm">
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
            
            <div>
              <h4 className="text-white font-semibold mb-2">Verification Levels</h4>
              <div className="space-y-1 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-300">Expert Trader:</span>
                  <span className="text-purple-400 font-semibold">100+ tx</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-300">Active Trader:</span>
                  <span className="text-green-400 font-semibold">50+ tx</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-300">Regular User:</span>
                  <span className="text-blue-400 font-semibold">25+ tx</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-300">Frequent User:</span>
                  <span className="text-yellow-400 font-semibold">10+ tx</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-300">Occasional User:</span>
                  <span className="text-orange-400 font-semibold">5+ tx</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-300">New User:</span>
                  <span className="text-gray-400 font-semibold">1+ tx</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Actual Verification Component */}
      <Card className="bg-gradient-to-br from-card-darker to-card-dark border-gray-700/30">
        <CardHeader>
          <CardTitle className="text-white">Live Verification</CardTitle>
        </CardHeader>
        <CardContent>
          <StellarVerification
            onComplete={(points, level, transactionCount) => {
              console.log('Verification completed:', { points, level, transactionCount });
            }}
            onError={(error) => {
              console.error('Verification error:', error);
            }}
          />
        </CardContent>
      </Card>
    </div>
  );
}

export default StellarExample;
