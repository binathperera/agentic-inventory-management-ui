import React, { useState } from 'react';
import { createTransaction } from '../services/api';

interface Props {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
}

const CreateSaleModal: React.FC<Props> = ({ isOpen, onClose, onSuccess }) => {
    const [paymentMethod, setPaymentMethod] = useState('Cash');
    const [grossAmount, setGrossAmount] = useState(0);
    const [discount, setDiscount] = useState(0);
    const [paidAmount, setPaidAmount] = useState(0);
    
    // Auto-calculate Net and Balance
    const netAmount = grossAmount - discount;
    const balance = netAmount - paidAmount;

    if (!isOpen) return null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await createTransaction({
                paymentMethod,
                grossAmount,
                discount,
                totalAmount: netAmount, // This maps to "totalAmount" in Java
                paidAmount,
                balance
            });
            alert("Sale Saved!");
            onSuccess();
            onClose();
        } catch (error) {
            console.error("Error saving sale", error);
            alert("Failed to save sale.");
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
            <div className="bg-white p-6 rounded-lg w-96">
                <h2 className="text-xl font-bold mb-4">New Sale</h2>
                <form onSubmit={handleSubmit} className="flex flex-col gap-3">
                    <select className="border p-2 rounded" value={paymentMethod} onChange={e => setPaymentMethod(e.target.value)}>
                        <option>Cash</option> <option>Card</option>
                    </select>
                    
                    <input type="number" placeholder="Gross Amount" className="border p-2 rounded"
                        onChange={e => setGrossAmount(Number(e.target.value))} required />
                        
                    <input type="number" placeholder="Discount" className="border p-2 rounded"
                        onChange={e => setDiscount(Number(e.target.value))} />
                        
                    <div className="font-bold">Net Amount: ${netAmount}</div>
                    
                    <input type="number" placeholder="Paid Amount" className="border p-2 rounded"
                        onChange={e => setPaidAmount(Number(e.target.value))} required />
                        
                    <div className="text-blue-600 font-bold">Balance: ${balance}</div>
                    
                    <div className="flex justify-end gap-2 mt-4">
                        <button type="button" onClick={onClose} className="bg-gray-300 px-4 py-2 rounded">Cancel</button>
                        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">Save</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CreateSaleModal;