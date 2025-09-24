import React, { useState, useEffect } from 'react';
import { AnyTransaction, TransactionType, Income, Expense } from '../../types';
import Modal from './Modal';
import Button from './Button';

interface EditTransactionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (updates: Partial<AnyTransaction>) => void;
  transaction: AnyTransaction | null;
}

const EditTransactionModal: React.FC<EditTransactionModalProps> = ({ isOpen, onClose, onSave, transaction }) => {
  const [formData, setFormData] = useState<Partial<AnyTransaction>>({});

  useEffect(() => {
    if (transaction) {
      setFormData({
        ...transaction,
        date: transaction.date.split('T')[0], // Format for date input
      });
    }
  }, [transaction]);

  if (!transaction) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  const inputClasses = "bg-[#0D0D12] border border-[#2D2D3A] rounded-lg px-3 py-1.5 text-sm w-full focus:ring-1 focus:ring-[#8A5CF6] focus:border-[#8A5CF6] outline-none";

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Edit Transaction">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="text-xs text-gray-400 mb-1 block">Date</label>
          <input type="date" name="date" value={formData.date || ''} onChange={handleChange} className={inputClasses} />
        </div>
        <div>
          <label className="text-xs text-gray-400 mb-1 block">Amount</label>
          <input type="number" name="amount" value={formData.amount || ''} onChange={handleChange} className={inputClasses} />
        </div>
        <div>
          <label className="text-xs text-gray-400 mb-1 block">Type</label>
          <select name="type" value={formData.type} onChange={handleChange} className={inputClasses}>
            <option value={TransactionType.INCOME}>Income</option>
            <option value={TransactionType.EXPENSE}>Expense</option>
          </select>
        </div>
        <div>
          <label className="text-xs text-gray-400 mb-1 block">Category</label>
          <input type="text" name="category" value={formData.category || ''} onChange={handleChange} className={inputClasses} />
        </div>
        <div>
          <label className="text-xs text-gray-400 mb-1 block">Account/Method</label>
          <input type="text" name="method" value={formData.method || ''} onChange={handleChange} className={inputClasses} />
        </div>
        {formData.type === TransactionType.INCOME && (
          <div>
            <label className="text-xs text-gray-400 mb-1 block">Source</label>
            <input type="text" name="source" value={(formData as Income).source || ''} onChange={handleChange} className={inputClasses} />
          </div>
        )}
        {formData.type === TransactionType.EXPENSE && (
          <div>
            <label className="text-xs text-gray-400 mb-1 block">Vendor</label>
            <input type="text" name="vendor" value={(formData as Expense).vendor || ''} onChange={handleChange} className={inputClasses} />
          </div>
        )}
        <div>
          <label className="text-xs text-gray-400 mb-1 block">Notes</label>
          <textarea name="notes" value={formData.notes || ''} onChange={handleChange} className={inputClasses}></textarea>
        </div>
        <div className="flex justify-end space-x-2 pt-4">
          <Button type="button" variant="secondary" onClick={onClose}>Cancel</Button>
          <Button type="submit">Save Changes</Button>
        </div>
      </form>
    </Modal>
  );
};

export default EditTransactionModal;