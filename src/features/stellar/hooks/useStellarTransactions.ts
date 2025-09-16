import { useState, useEffect, useCallback } from 'react';
import { stellarApi, StellarTransaction, StellarOperation, StellarPayment, StellarAccountInfo } from '../../verifications/services/stellar-api';

interface UseStellarTransactionsReturn {
  // Estados
  transactions: StellarTransaction[];
  operations: StellarOperation[];
  payments: StellarPayment[];
  accountInfo: StellarAccountInfo | null;
  loading: boolean;
  error: string | null;
  
  // Funciones
  loadTransactions: (accountId: string, limit?: number) => Promise<void>;
  loadOperations: (accountId: string, limit?: number) => Promise<void>;
  loadPayments: (accountId: string, limit?: number) => Promise<void>;
  loadAccountInfo: (accountId: string) => Promise<void>;
  refreshData: (accountId: string) => Promise<void>;
  clearData: () => void;
}

export const useStellarTransactions = (): UseStellarTransactionsReturn => {
  const [transactions, setTransactions] = useState<StellarTransaction[]>([]);
  const [operations, setOperations] = useState<StellarOperation[]>([]);
  const [payments, setPayments] = useState<StellarPayment[]>([]);
  const [accountInfo, setAccountInfo] = useState<StellarAccountInfo | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadTransactions = useCallback(async (accountId: string, limit: number = 10) => {
    try {
      setLoading(true);
      setError(null);
      const data = await stellarApi.getLatestTransactions(accountId, limit);
      setTransactions(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al cargar transacciones');
      console.error('Error loading transactions:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  const loadOperations = useCallback(async (accountId: string, limit: number = 10) => {
    try {
      setLoading(true);
      setError(null);
      const data = await stellarApi.getAccountOperations(accountId, limit);
      setOperations(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al cargar operaciones');
      console.error('Error loading operations:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  const loadPayments = useCallback(async (accountId: string, limit: number = 10) => {
    try {
      setLoading(true);
      setError(null);
      const data = await stellarApi.getAccountPayments(accountId, limit);
      setPayments(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al cargar pagos');
      console.error('Error loading payments:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  const loadAccountInfo = useCallback(async (accountId: string) => {
    try {
      setLoading(true);
      setError(null);
      const data = await stellarApi.getAccountInfo(accountId);
      setAccountInfo(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al cargar información de cuenta');
      console.error('Error loading account info:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  const refreshData = useCallback(async (accountId: string) => {
    await Promise.all([
      loadTransactions(accountId),
      loadOperations(accountId),
      loadPayments(accountId),
      loadAccountInfo(accountId)
    ]);
  }, [loadTransactions, loadOperations, loadPayments, loadAccountInfo]);

  const clearData = useCallback(() => {
    setTransactions([]);
    setOperations([]);
    setPayments([]);
    setAccountInfo(null);
    setError(null);
  }, []);

  return {
    transactions,
    operations,
    payments,
    accountInfo,
    loading,
    error,
    loadTransactions,
    loadOperations,
    loadPayments,
    loadAccountInfo,
    refreshData,
    clearData
  };
};

// Hook especializado para obtener solo las últimas transacciones
export const useLatestTransactions = (accountId: string | null, limit: number = 5) => {
  const [transactions, setTransactions] = useState<StellarTransaction[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!accountId) {
      setTransactions([]);
      return;
    }

    const fetchTransactions = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await stellarApi.getLatestTransactions(accountId, limit);
        setTransactions(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error al cargar transacciones');
        console.error('Error loading latest transactions:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchTransactions();
  }, [accountId, limit]);

  return { transactions, loading, error };
};

// Hook para verificar si una cuenta existe
export const useAccountExists = (accountId: string | null) => {
  const [exists, setExists] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!accountId) {
      setExists(null);
      return;
    }

    const checkAccount = async () => {
      try {
        setLoading(true);
        setError(null);
        const accountExists = await stellarApi.accountExists(accountId);
        setExists(accountExists);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error al verificar cuenta');
        console.error('Error checking account:', err);
      } finally {
        setLoading(false);
      }
    };

    checkAccount();
  }, [accountId]);

  return { exists, loading, error };
};
