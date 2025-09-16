'use client';

import React, { useState } from 'react';
import { useStellarTransactions, useLatestTransactions } from '../hooks/useStellarTransactions';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/ui/card';
import { Button } from '@/shared/ui/button';
import { Badge } from '@/shared/ui/badge';
import { Input } from '@/shared/ui/input';

interface TransactionHistoryProps {
  accountId?: string;
  showLatestOnly?: boolean;
  limit?: number;
}

export const TransactionHistory: React.FC<TransactionHistoryProps> = ({
  accountId: propAccountId,
  showLatestOnly = false,
  limit = 10 // eslint-disable-line @typescript-eslint/no-unused-vars
}) => {
  const [inputAccountId, setInputAccountId] = useState(propAccountId || '');
  const [currentAccountId, setCurrentAccountId] = useState(propAccountId || '');

  const {
    accountInfo,
    refreshData,
    clearData
  } = useStellarTransactions();

  const { transactions: latestTransactions, loading: latestLoading, error: latestError } = 
    useLatestTransactions(currentAccountId || null, 5);

  const handleLoadData = async () => {
    if (!currentAccountId.trim()) {
      return;
    }

    if (showLatestOnly) {
      // Solo cargar las últimas transacciones usando refreshData
      await refreshData(currentAccountId);
    } else {
      // Cargar todos los datos
      await refreshData(currentAccountId);
    }
  };

  const handleAccountIdSubmit = () => {
    setCurrentAccountId(inputAccountId);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('es-ES', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  };


  const getTransactionStatus = (successful: boolean) => {
    return successful ? 'success' : 'error';
  };

  const getStatusColor = (successful: boolean) => {
    return successful ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800';
  };

  const displayTransactions = latestTransactions;
  const displayLoading = latestLoading;
  const displayError = latestError;

  return (
    <div className="space-y-6">
      {/* Input para ingresar Account ID */}
      {!propAccountId && (
        <Card>
          <CardHeader>
            <CardTitle>Buscar Transacciones de Stellar</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex gap-2">
              <Input
                placeholder="Ingresa el Account ID de Stellar (ej: GABC123...)"
                value={inputAccountId}
                onChange={(e) => setInputAccountId(e.target.value)}
                className="flex-1"
              />
              <Button 
                onClick={handleAccountIdSubmit}
                disabled={!inputAccountId.trim()}
              >
                Buscar
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Información de la cuenta */}
      {accountInfo && !showLatestOnly && (
        <Card>
          <CardHeader>
            <CardTitle>Información de la Cuenta</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-600">Account ID:</p>
                <p className="font-mono text-sm break-all">{accountInfo.account_id}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Sequence:</p>
                <p className="font-mono text-sm">{accountInfo.sequence}</p>
              </div>
              <div className="md:col-span-2">
                <p className="text-sm text-gray-600 mb-2">Balances:</p>
                <div className="space-y-1">
                  {accountInfo.balances.map((balance: Record<string, unknown>, index: number) => (
                    <div key={index} className="flex justify-between items-center">
                      <span className="text-sm">
                        {balance.asset_type === 'native' ? 'XLM' : (balance.asset_code as string)}
                      </span>
                      <span className="font-mono text-sm">
                        {parseFloat(balance.balance as string).toFixed(7)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Controles */}
      {currentAccountId && !showLatestOnly && (
        <div className="flex gap-2">
          <Button onClick={() => handleLoadData()} disabled={displayLoading}>
            {displayLoading ? 'Cargando...' : 'Actualizar Datos'}
          </Button>
          <Button variant="outline" onClick={clearData}>
            Limpiar
          </Button>
        </div>
      )}

      {/* Error */}
      {displayError && (
        <Card className="border-red-200">
          <CardContent className="pt-6">
            <p className="text-red-600">{displayError}</p>
          </CardContent>
        </Card>
      )}

      {/* Transacciones */}
      {currentAccountId && (
        <Card>
          <CardHeader>
            <CardTitle>
              {showLatestOnly ? 'Últimas Transacciones' : 'Historial de Transacciones'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {displayLoading ? (
              <div className="text-center py-8">
                <p>Cargando transacciones...</p>
              </div>
            ) : displayTransactions.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-500">No se encontraron transacciones</p>
              </div>
            ) : (
              <div className="space-y-4">
                {displayTransactions.map((transaction, index) => (
                  <div key={transaction.id} className="border rounded-lg p-4">
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex items-center gap-2">
                        <Badge className={getStatusColor(transaction.successful)}>
                          {getTransactionStatus(transaction.successful)}
                        </Badge>
                        <span className="text-sm text-gray-600">
                          #{displayTransactions.length - index}
                        </span>
                      </div>
                      <span className="text-sm text-gray-500">
                        {formatDate(transaction.created_at)}
                      </span>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                      <div>
                        <span className="text-gray-600">Hash:</span>
                        <p className="font-mono text-xs break-all">{transaction.hash}</p>
                      </div>
                      <div>
                        <span className="text-gray-600">Fee:</span>
                        <p>{transaction.fee_charged} stroops</p>
                      </div>
                      <div>
                        <span className="text-gray-600">Operaciones:</span>
                        <p>{transaction.operation_count}</p>
                      </div>
                      {transaction.memo && (
                        <div>
                          <span className="text-gray-600">Memo:</span>
                          <p>{transaction.memo}</p>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Pagos (solo si no es showLatestOnly) */}
      {!showLatestOnly && (
        <Card>
          <CardHeader>
            <CardTitle>Últimos Pagos</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <p className="text-gray-500 text-center">No payments data available</p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default TransactionHistory;
