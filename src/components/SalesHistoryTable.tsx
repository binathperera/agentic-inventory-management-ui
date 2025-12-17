import React, { useEffect, useState } from 'react';
import { getSalesHistory } from '../services/api';

interface Transaction {
  id: string;
  paymentMethod: string;
  totalAmount: number;
  createdAt: string;
}

const SalesHistoryTable: React.FC = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getSalesHistory();
        setTransactions(data);
      } catch (error) {
        console.error("Error loading sales", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) return <div>Loading...</div>;

  return (
    <div className="p-6 bg-white rounded-lg shadow-md mt-6">
      <h2 className="text-xl font-bold mb-4">Sales History</h2>
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="bg-gray-100 border-b">
            <th className="p-3">ID</th>
            <th className="p-3">Date</th>
            <th className="p-3">Method</th>
            <th className="p-3">Amount</th>
          </tr>
        </thead>
        <tbody>
          {transactions.map((t) => (
            <tr key={t.id} className="border-b hover:bg-gray-50">
              <td className="p-3">{t.id}</td>
              <td className="p-3">{new Date(t.createdAt).toLocaleDateString()}</td>
              <td className="p-3">{t.paymentMethod}</td>
              <td className="p-3 font-bold text-green-600">${t.totalAmount}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default SalesHistoryTable;