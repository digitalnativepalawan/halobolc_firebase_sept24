import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import { RightArrowIcon, FundsIcon, ReportsIcon, TransactionsIcon, VendorsIcon, EmployeesIcon, PayrollIcon, DataIcon } from '../components/Icons';

const COLORS = ['#8A5CF6', '#A881FF', '#C6A9FF', '#E4D2FF', '#3D3D50', '#5A5A70'];
const incomeData = [{ name: 'Income', value: 4000 }];
const expenseData = [
  { name: 'F&B', value: 400 },
  { name: 'Materials', value: 300 },
  { name: 'Utilities', value: 300 },
  { name: 'Payroll', value: 200 },
  { name: 'Repairs', value: 100 },
  { name: 'Other', value: 50 },
];

const quickActions = [
    { title: 'Add Transaction', to: '/transactions', icon: TransactionsIcon, color: 'text-green-400' },
    { title: 'Manage Funds', to: '/funds', icon: FundsIcon, color: 'text-purple-400' },
    { title: 'View Reports', to: '/reports', icon: ReportsIcon, color: 'text-blue-400' },
    { title: 'Manage Employees', to: '/employees', icon: EmployeesIcon, color: 'text-pink-400' },
    { title: 'Manage Vendors', to: '/vendors', icon: VendorsIcon, color: 'text-indigo-400' },
    { title: 'Run Payroll', to: '/payroll', icon: PayrollIcon, color: 'text-teal-400' }
];

const Home: React.FC = () => {
    return (
        <div className="space-y-16">
            {/* All tables and quick actions removed as requested */}
        </div>
    );
};

export default Home;