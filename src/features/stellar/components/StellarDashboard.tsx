'use client';

import React, { useState } from 'react';
import { useStellarTransactions } from '../hooks/useStellarTransactions';
import { TransactionHistory } from './TransactionHistory';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/ui/card';
import { Button } from '@/shared/ui/button';
import { Input } from '@/shared/ui/input';
import { Badge } from '@/shared/ui/badge';
import { Separator } from '@/shared/components/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/shared/ui/tabs';

interface StellarDashboardProps {
  initialAccountId?: string;
}

export const StellarDashboard: React.FC<StellarDashboardProps> = ({
  initialAccountId
}) => {
  const [accountId, setAccountId] = useState(initialAccountId || '');
  const [activeTab, setActiveTab] = useState('transactions');

  const {
    transactions,
    operations,
    payments,
    accountInfo,
    loading,
    error,
    refreshData,
    clearData
  } = useStellarTransactions();

  const handleLoadData = async () => {
    if (!accountId.trim()) return;
    await refreshData(accountId);
  };

  const formatBalance = (balance: any) => {
    if (balance.asset_type === 'native') {
      return `${parseFloat(balance.balance).toFixed(7)} XLM`;
    }
    return `${balance.balance} ${balance.asset_code || balance.asset_type}`;
  };

  const getNetworkBadge = () => {
    // Por defecto usamos testnet, pero esto se puede configurar
    return <Badge variant="outline">Testnet</Badge>;
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Stellar Dashboard</h1>
          <p className="text-gray-600">Explora transacciones y datos de la blockchain Stellar</p>
        </div>
        {getNetworkBadge()}
      </div>

      {/* Input para Account ID */}
      <Card>
        <CardHeader>
          <CardTitle>Buscar Cuenta Stellar</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2">
            <Input
              placeholder="Ingresa el Account ID de Stellar (ej: GABC123...)"
              value={accountId}
              onChange={(e) => setAccountId(e.target.value)}
              className="flex-1"
            />
            <Button 
              onClick={handleLoadData}
              disabled={!accountId.trim() || loading}
            >
              {loading ? 'Cargando...' : 'Buscar'}
            </Button>
            <Button variant="outline" onClick={clearData}>
              Limpiar
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Información de la cuenta */}
      {accountInfo && (
        <Card>
          <CardHeader>
            <CardTitle>Información de la Cuenta</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <p className="text-sm text-gray-600 mb-1">Account ID</p>
                <p className="font-mono text-sm break-all bg-gray-100 p-2 rounded">
                  {accountInfo.account_id}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-1">Sequence</p>
                <p className="font-mono text-sm bg-gray-100 p-2 rounded">
                  {accountInfo.sequence}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-1">Subentries</p>
                <p className="font-mono text-sm bg-gray-100 p-2 rounded">
                  {accountInfo.subentry_count}
                </p>
              </div>
            </div>
            
            <Separator className="my-4" />
            
            <div>
              <p className="text-sm text-gray-600 mb-2">Balances</p>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                  {accountInfo.balances.map((balance: any, index: number) => (
                  <div key={index} className="bg-gray-50 p-3 rounded-lg">
                    <div className="flex justify-between items-center">
                      <span className="font-medium">
                        {balance.asset_type === 'native' ? 'XLM' : balance.asset_code}
                      </span>
                      <span className="font-mono text-sm">
                        {formatBalance(balance)}
                      </span>
                    </div>
                    {balance.asset_issuer && (
                      <p className="text-xs text-gray-500 mt-1 break-all">
                        Issuer: {balance.asset_issuer}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Error */}
      {error && (
        <Card className="border-red-200">
          <CardContent className="pt-6">
            <p className="text-red-600">{error}</p>
          </CardContent>
        </Card>
      )}

      {/* Tabs con diferentes vistas */}
      {accountId && (
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="transactions">Transacciones</TabsTrigger>
            <TabsTrigger value="operations">Operaciones</TabsTrigger>
            <TabsTrigger value="payments">Pagos</TabsTrigger>
          </TabsList>

          <TabsContent value="transactions">
            <TransactionHistory accountId={accountId} />
          </TabsContent>

          <TabsContent value="operations">
            <Card>
              <CardHeader>
                <CardTitle>Últimas Operaciones</CardTitle>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="text-center py-8">
                    <p>Cargando operaciones...</p>
                  </div>
                ) : operations.length === 0 ? (
                  <div className="text-center py-8">
                    <p className="text-gray-500">No se encontraron operaciones</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {operations.map((operation, index) => (
                      <div key={operation.id} className="border rounded-lg p-4">
                        <div className="flex justify-between items-start mb-2">
                          <div className="flex items-center gap-2">
                            <Badge variant="outline">{operation.type}</Badge>
                            <span className="text-sm text-gray-600">
                              #{operations.length - index}
                            </span>
                          </div>
                          <span className="text-sm text-gray-500">
                            {new Date(operation.created_at).toLocaleString('es-ES')}
                          </span>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                          <div>
                            <span className="text-gray-600">ID:</span>
                            <p className="font-mono text-xs break-all">{operation.id}</p>
                          </div>
                          <div>
                            <span className="text-gray-600">Transaction Hash:</span>
                            <p className="font-mono text-xs break-all">{operation.transaction_hash}</p>
                          </div>
                          {operation.amount && (
                            <div>
                              <span className="text-gray-600">Cantidad:</span>
                              <p>{operation.amount}</p>
                            </div>
                          )}
                          {operation.from && (
                            <div>
                              <span className="text-gray-600">De:</span>
                              <p className="font-mono text-xs break-all">{operation.from}</p>
                            </div>
                          )}
                          {operation.to && (
                            <div>
                              <span className="text-gray-600">Para:</span>
                              <p className="font-mono text-xs break-all">{operation.to}</p>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="payments">
            <Card>
              <CardHeader>
                <CardTitle>Últimos Pagos</CardTitle>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="text-center py-8">
                    <p>Cargando pagos...</p>
                  </div>
                ) : payments.length === 0 ? (
                  <div className="text-center py-8">
                    <p className="text-gray-500">No se encontraron pagos</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {payments.map((payment, index) => (
                      <div key={payment.id} className="border rounded-lg p-4">
                        <div className="flex justify-between items-start mb-2">
                          <div className="flex items-center gap-2">
                            <Badge className="bg-blue-100 text-blue-800">Pago</Badge>
                            <span className="text-sm text-gray-600">
                              #{payments.length - index}
                            </span>
                          </div>
                          <span className="text-sm text-gray-500">
                            {new Date(payment.created_at).toLocaleString('es-ES')}
                          </span>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-sm">
                          <div>
                            <span className="text-gray-600">De:</span>
                            <p className="font-mono text-xs break-all">{payment.from}</p>
                          </div>
                          <div>
                            <span className="text-gray-600">Para:</span>
                            <p className="font-mono text-xs break-all">{payment.to}</p>
                          </div>
                          <div>
                            <span className="text-gray-600">Cantidad:</span>
                            <p className="font-semibold">
                              {payment.asset_type === 'native' 
                                ? `${parseFloat(payment.amount).toFixed(7)} XLM`
                                : `${payment.amount} ${payment.asset_code || payment.asset_type}`
                              }
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      )}
    </div>
  );
};

export default StellarDashboard;
