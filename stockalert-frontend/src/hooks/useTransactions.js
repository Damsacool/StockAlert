import { useEffect, useState } from 'react';
import { transactionService } from '../services/transaction.service';

export const useTransactions = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadTransactions = async () => {
      try {
        const data = await transactionService.getAll();
        setTransactions(data);
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    loadTransactions();
  }, []);

  return { transactions, loading, error };
};
