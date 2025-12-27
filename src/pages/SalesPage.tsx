import React, { useEffect, useState } from 'react';
import CreateSaleModal from '../components/CreateSaleModal';
import { transactionService } from '../services/api';
import type { Transaction } from '../types';


const SalesPage: React.FC = () => {
    const [isModalOpen, setModalOpen] = useState(false);
    const [sales, setSales] = useState<Transaction[]>([]);

    const loadSales = async () => {
   try {
    const data = await transactionService.getAllTransactions();
    setSales(data);
   } catch (error) {
    console.error('Failed to load sales:', error);
   }
   };


    useEffect(() => { loadSales(); }, []);

    return (
        <div className="p-6">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">Sales Management</h1>
                <button onClick={() => setModalOpen(true)} className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
                    + New Sale
                </button>
            </div>

            <div className="bg-white shadow rounded-lg overflow-hidden">
                <table className="min-w-full leading-normal">
                    <thead className="bg-gray-100">
                        <tr>
                            <th className="px-5 py-3 border-b text-left text-xs font-semibold text-gray-600 uppercase">Date</th>
                            <th className="px-5 py-3 border-b text-left text-xs font-semibold text-gray-600 uppercase">Method</th>
                            <th className="px-5 py-3 border-b text-left text-xs font-semibold text-gray-600 uppercase">Net Amount</th>
                            <th className="px-5 py-3 border-b text-left text-xs font-semibold text-gray-600 uppercase">Balance</th>
                        </tr>
                    </thead>
                    <tbody>
                        {sales.map((sale) => (
                            <tr key={sale.transactionId} className="border-b">
                                <td className="px-5 py-5 bg-white text-sm">
                                    {sale.createdAt ? new Date(sale.createdAt).toLocaleDateString() : 'Just now'}
                                </td>
                                <td className="px-5 py-5 bg-white text-sm">{sale.paymentMethod}</td>
                                <td className="px-5 py-5 bg-white text-sm font-bold">${sale.grossAmount}</td>
                                <td className="px-5 py-5 bg-white text-sm text-red-500">${sale.balanceAmount}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <CreateSaleModal 
                isOpen={isModalOpen} 
                onClose={() => setModalOpen(false)} 
                onSuccess={loadSales} 
            />
        </div>
    );
};

export default SalesPage;