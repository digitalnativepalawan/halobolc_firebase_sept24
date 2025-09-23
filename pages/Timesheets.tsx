
import React, { useState, useEffect, useMemo, useCallback } from 'react';
import KpiCard from '../components/ui/KpiCard';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Modal from '../components/ui/Modal';
import { getTimesheetEntries, getEmployees, addTimesheetEntry, updateTimesheetEntry, deleteTimesheetEntry } from '../services/mockApi';
import { TimesheetEntry, Employee, TimesheetStatus } from '../types';
import { formatDate } from '../utils/formatters';
import { PlusIcon, EllipsisVerticalIcon, PencilIcon, TrashIcon, CheckCircleIcon, ExclamationCircleIcon, TimesheetsIcon } from '../components/Icons';

// Helper function to calculate hours between two "HH:mm" strings
const calculateHours = (start: string, end: string, breakMinutes: number): number => {
    if (!start || !end) return 0;
    try {
        const [startH, startM] = start.split(':').map(Number);
        const [endH, endM] = end.split(':').map(Number);
        const startDate = new Date(0, 0, 0, startH, startM);
        const endDate = new Date(0, 0, 0, endH, endM);
        let diff = endDate.getTime() - startDate.getTime();
        if (diff < 0) { // Handle overnight shifts
            endDate.setDate(endDate.getDate() + 1);
            diff = endDate.getTime() - startDate.getTime();
        }
        const diffMinutes = diff / (1000 * 60);
        const totalHours = (diffMinutes - breakMinutes) / 60;
        return Math.max(0, parseFloat(totalHours.toFixed(2)));
    } catch (e) {
        return 0;
    }
};

const statusConfig: { [key in TimesheetStatus]: { label: string; color: string; icon: React.FC<{className?:string}> } } = {
    [TimesheetStatus.PENDING]: { label: 'Pending', color: 'bg-yellow-500/10 text-yellow-400', icon: TimesheetsIcon },
    [TimesheetStatus.APPROVED]: { label: 'Approved', color: 'bg-green-500/10 text-green-400', icon: CheckCircleIcon },
    [TimesheetStatus.REJECTED]: { label: 'Rejected', color: 'bg-red-500/10 text-red-400', icon: ExclamationCircleIcon },
};

const LogTimeForm: React.FC<{
    employees: Employee[];
    onCancel: () => void;
    onSubmit: (entry: Omit<TimesheetEntry, 'id' | 'createdAt' | 'updatedAt' | 'status'>) => void;
    initialData?: TimesheetEntry | null;
}> = ({ employees, onCancel, onSubmit, initialData }) => {
    const [formData, setFormData] = useState({
        employeeId: initialData?.employeeId || (employees.length > 0 ? employees[0].id : ''),
        date: initialData?.date ? initialData.date.split('T')[0] : new Date().toISOString().split('T')[0],
        startTime: initialData?.startTime || '09:00',
        endTime: initialData?.endTime || '17:00',
        breakDuration: initialData?.breakDuration || 60,
        notes: initialData?.notes || '',
    });

    const totalHours = useMemo(() => 
        calculateHours(formData.startTime, formData.endTime, formData.breakDuration),
        [formData.startTime, formData.endTime, formData.breakDuration]
    );
    
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: name === 'breakDuration' ? parseInt(value, 10) : value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.employeeId) {
            alert("Please select an employee.");
            return;
        }
        if (totalHours <= 0) {
            alert("Total hours must be greater than 0. Check start/end times and break duration.");
            return;
        }
        onSubmit({ ...formData, totalHours });
    };

    const inputClasses = "bg-[#0D0D12] border border-[#2D2D3A] rounded-lg px-3 py-2 text-sm w-full focus:ring-1 focus:ring-[#8A5CF6] focus:border-[#8A5CF6] outline-none";

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="text-xs text-gray-400 mb-1 block">Employee</label>
                    <select name="employeeId" value={formData.employeeId} onChange={handleChange} className={inputClasses}>
                        {employees.map(emp => <option key={emp.id} value={emp.id}>{emp.name}</option>)}
                    </select>
                </div>
                <div>
                    <label className="text-xs text-gray-400 mb-1 block">Date</label>
                    <input type="date" name="date" value={formData.date} onChange={handleChange} className={inputClasses} required />
                </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="text-xs text-gray-400 mb-1 block">Start Time</label>
                    <input type="time" name="startTime" value={formData.startTime} onChange={handleChange} className={inputClasses} required />
                </div>
                <div>
                    <label className="text-xs text-gray-400 mb-1 block">End Time</label>
                    <input type="time" name="endTime" value={formData.endTime} onChange={handleChange} className={inputClasses} required />
                </div>
            </div>
            <div>
                <label className="text-xs text-gray-400 mb-1 block">Break Duration (minutes)</label>
                <input type="number" name="breakDuration" value={formData.breakDuration} onChange={handleChange} className={inputClasses} required />
            </div>
            <div>
                 <p className="text-sm text-gray-400">Total Hours: <span className="font-bold text-white">{totalHours.toFixed(2)}</span></p>
            </div>
            <div>
                <label className="text-xs text-gray-400 mb-1 block">Notes (Optional)</label>
                <textarea name="notes" value={formData.notes} onChange={handleChange} className={inputClasses} rows={3}></textarea>
            </div>
            <div className="flex justify-end space-x-2 pt-4">
                <Button type="button" variant="secondary" onClick={onCancel}>Cancel</Button>
                <Button type="submit" variant="primary">{initialData ? 'Update Entry' : 'Log Time'}</Button>
            </div>
        </form>
    );
};


const Timesheets: React.FC = () => {
    const [entries, setEntries] = useState<TimesheetEntry[]>([]);
    const [employees, setEmployees] = useState<Employee[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingEntry, setEditingEntry] = useState<TimesheetEntry | null>(null);
    const [deletingEntry, setDeletingEntry] = useState<TimesheetEntry | null>(null);
    const [activeMenu, setActiveMenu] = useState<string | null>(null);

    // Filter state
    const [dateRange, setDateRange] = useState({ start: '', end: '' });
    const [selectedStatus, setSelectedStatus] = useState<TimesheetStatus | 'all'>('all');
    const [selectedEmployeeId, setSelectedEmployeeId] = useState('all');

    const fetchData = useCallback(async () => {
        setIsLoading(true);
        try {
            const [entryData, employeeData] = await Promise.all([getTimesheetEntries(), getEmployees()]);
            setEntries(entryData);
            setEmployees(employeeData);
        } catch (error) {
            console.error("Failed to fetch data:", error);
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const employeeMap = useMemo(() => new Map(employees.map(e => [e.id, e.name])), [employees]);

    const filteredEntries = useMemo(() => {
        return entries
            .filter(e => {
                if (dateRange.start && new Date(e.date) < new Date(dateRange.start)) return false;
                if (dateRange.end) {
                    const endDate = new Date(dateRange.end);
                    endDate.setHours(23, 59, 59, 999);
                    if (new Date(e.date) > endDate) return false;
                }
                return true;
            })
            .filter(e => selectedStatus === 'all' || e.status === selectedStatus)
            .filter(e => selectedEmployeeId === 'all' || e.employeeId === selectedEmployeeId);
    }, [entries, dateRange, selectedStatus, selectedEmployeeId]);

    const kpiData = useMemo(() => {
        const today = new Date();
        const startOfWeek = new Date(today.setDate(today.getDate() - today.getDay()));
        startOfWeek.setHours(0,0,0,0);
        
        const thisWeeksEntries = entries.filter(e => new Date(e.date) >= startOfWeek);
        
        const totalHours = thisWeeksEntries.reduce((sum, e) => sum + e.totalHours, 0);
        const pendingHours = entries.filter(e => e.status === TimesheetStatus.PENDING).reduce((sum, e) => sum + e.totalHours, 0);
        const overtimeHours = thisWeeksEntries.reduce((sum, e) => sum + Math.max(0, e.totalHours - 8), 0);

        return { totalHours, pendingHours, overtimeHours };
    }, [entries]);

    const handleFormSubmit = async (entryData: Omit<TimesheetEntry, 'id' | 'createdAt' | 'updatedAt' | 'status'>) => {
        try {
            if (editingEntry) {
                await updateTimesheetEntry(editingEntry.id, entryData);
            } else {
                await addTimesheetEntry(entryData);
            }
            fetchData();
        } catch (error) {
            console.error("Failed to save timesheet entry:", error);
        } finally {
            setIsModalOpen(false);
            setEditingEntry(null);
        }
    };

    const handleStatusChange = async (entry: TimesheetEntry, newStatus: TimesheetStatus.APPROVED | TimesheetStatus.REJECTED) => {
        try {
            await updateTimesheetEntry(entry.id, { 
                status: newStatus,
                approvedBy: 'admin', // Assume current user is admin
                approvedAt: new Date().toISOString()
            });
            fetchData();
        } catch (error) {
            console.error("Failed to update status:", error);
        } finally {
            setActiveMenu(null);
        }
    };
    
    const confirmDelete = async () => {
        if (!deletingEntry) return;
        try {
            await deleteTimesheetEntry(deletingEntry.id);
            fetchData();
        } catch (error) {
            console.error("Failed to delete entry:", error);
        } finally {
            setDeletingEntry(null);
        }
    };

    const resetFilters = () => {
        setDateRange({ start: '', end: '' });
        setSelectedStatus('all');
        setSelectedEmployeeId('all');
    };

    const filterInputClasses = "bg-[#0D0D12] border border-[#2D2D3A] rounded-lg px-3 py-1.5 text-sm w-full focus:ring-1 focus:ring-[#8A5CF6] focus:border-[#8A5CF6] outline-none";

    return (
        <div className="space-y-8">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-white">Timesheets</h1>
                    <p className="text-gray-400 mt-1">Log and manage employee work hours.</p>
                </div>
                <Button variant="primary" leftIcon={<PlusIcon/>} onClick={() => { setEditingEntry(null); setIsModalOpen(true); }}>Log Time</Button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <KpiCard title="Total Hours Logged (This Week)" value={kpiData.totalHours} isLoading={isLoading} isCurrency={false} />
                <KpiCard title="Pending Approval (Hours)" value={kpiData.pendingHours} isLoading={isLoading} isCurrency={false}/>
                <KpiCard title="Overtime Hours (This Week)" value={kpiData.overtimeHours} isLoading={isLoading} isCurrency={false}/>
            </div>

            <Card>
                 <div className="mb-6">
                    <h2 className="text-lg font-semibold text-white mb-4">Filter Timesheets</h2>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
                        <div>
                            <label className="text-xs text-gray-400 mb-1 block">Date Range</label>
                            <div className="flex gap-2">
                                <input type="date" value={dateRange.start} onChange={e => setDateRange(p => ({ ...p, start: e.target.value }))} className={filterInputClasses} />
                                <input type="date" value={dateRange.end} onChange={e => setDateRange(p => ({ ...p, end: e.target.value }))} className={filterInputClasses} />
                            </div>
                        </div>
                        <div>
                            <label className="text-xs text-gray-400 mb-1 block">Employee</label>
                            <select value={selectedEmployeeId} onChange={(e) => setSelectedEmployeeId(e.target.value)} className={filterInputClasses}>
                                <option value="all">All Employees</option>
                                {employees.map(e => <option key={e.id} value={e.id}>{e.name}</option>)}
                            </select>
                        </div>
                        <div>
                            <label className="text-xs text-gray-400 mb-1 block">Status</label>
                            <select value={selectedStatus} onChange={(e) => setSelectedStatus(e.target.value as any)} className={filterInputClasses}>
                                <option value="all">All Statuses</option>
                                {Object.entries(statusConfig).map(([status, {label}]) => <option key={status} value={status}>{label}</option>)}
                            </select>
                        </div>
                        <div>
                            <Button variant="subtle" onClick={resetFilters}>Reset Filters</Button>
                        </div>
                    </div>
                 </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left text-gray-400">
                        <thead className="text-xs text-gray-300 uppercase bg-[#0D0D12]">
                            <tr>
                                <th scope="col" className="px-6 py-3">Employee</th>
                                <th scope="col" className="px-6 py-3">Date</th>
                                <th scope="col" className="px-6 py-3">Time</th>
                                <th scope="col" className="px-6 py-3 text-center">Break</th>
                                <th scope="col" className="px-6 py-3 text-center">Total Hours</th>
                                <th scope="col" className="px-6 py-3">Status</th>
                                <th scope="col" className="px-6 py-3 text-center">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {isLoading ? (
                                Array.from({ length: 5 }).map((_, i) => (
                                    <tr key={i} className="border-b border-[#2D2D3A]"><td colSpan={7} className="p-4"><div className="h-8 bg-gray-700 rounded animate-pulse"></div></td></tr>
                                ))
                            ) : filteredEntries.map(entry => {
                                const status = statusConfig[entry.status];
                                const StatusIcon = status.icon;
                                return (
                                <tr key={entry.id} className="border-b border-[#2D2D3A] hover:bg-[#0D0D12]">
                                    <td className="px-6 py-4 font-medium text-white">{employeeMap.get(entry.employeeId) || 'Unknown'}</td>
                                    <td className="px-6 py-4">{formatDate(entry.date)}</td>
                                    <td className="px-6 py-4">{entry.startTime} - {entry.endTime}</td>
                                    <td className="px-6 py-4 text-center">{entry.breakDuration} min</td>
                                    <td className="px-6 py-4 text-center font-semibold text-white">{entry.totalHours.toFixed(2)}</td>
                                    <td className="px-6 py-4">
                                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${status.color}`}>
                                            <StatusIcon className="w-3 h-3 mr-1.5" />
                                            {status.label}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-center">
                                         <div className="relative inline-block">
                                            <button onClick={() => setActiveMenu(activeMenu === entry.id ? null : entry.id)} className="text-gray-400 hover:text-white">
                                                <EllipsisVerticalIcon className="h-5 w-5" />
                                            </button>
                                            {activeMenu === entry.id && (
                                                <div className="absolute right-0 mt-2 w-32 bg-[#2D2D3A] border border-[#4a4a5a] rounded-md shadow-lg z-10 text-left">
                                                    {entry.status === TimesheetStatus.PENDING && (
                                                        <>
                                                            <a href="#" onClick={(e) => { e.preventDefault(); handleStatusChange(entry, TimesheetStatus.APPROVED); }} className="block px-4 py-2 text-sm text-green-400 hover:bg-[#3c3c4a]">Approve</a>
                                                            <a href="#" onClick={(e) => { e.preventDefault(); handleStatusChange(entry, TimesheetStatus.REJECTED); }} className="block px-4 py-2 text-sm text-red-400 hover:bg-[#3c3c4a]">Reject</a>
                                                            <div className="border-t border-[#4a4a5a]"></div>
                                                        </>
                                                    )}
                                                    <a href="#" onClick={(e) => { e.preventDefault(); setEditingEntry(entry); setIsModalOpen(true); setActiveMenu(null); }} className="block px-4 py-2 text-sm text-gray-300 hover:bg-[#3c3c4a]">Edit</a>
                                                    <a href="#" onClick={(e) => { e.preventDefault(); setDeletingEntry(entry); setActiveMenu(null); }} className="block px-4 py-2 text-sm text-red-400 hover:bg-[#3c3c4a]">Delete</a>
                                                </div>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            )})}
                        </tbody>
                    </table>
                     {!isLoading && filteredEntries.length === 0 && <div className="text-center p-4">No timesheet entries found.</div>}
                </div>
            </Card>

            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={editingEntry ? 'Edit Time Entry' : 'Log New Time Entry'} size="lg">
                <LogTimeForm 
                    employees={employees}
                    onSubmit={handleFormSubmit}
                    onCancel={() => setIsModalOpen(false)}
                    initialData={editingEntry}
                />
            </Modal>

            <Modal isOpen={!!deletingEntry} onClose={() => setDeletingEntry(null)} title="Delete Timesheet Entry?">
                {deletingEntry && (
                    <div>
                        <p className="text-gray-300">Are you sure you want to delete this entry? This action cannot be undone.</p>
                        <div className="flex justify-end space-x-2 mt-6">
                            <Button variant="secondary" onClick={() => setDeletingEntry(null)}>Cancel</Button>
                            <Button variant="primary" className="bg-red-600 hover:bg-red-700 focus:ring-red-500" onClick={confirmDelete}>Delete</Button>
                        </div>
                    </div>
                )}
            </Modal>
        </div>
    );
};

export default Timesheets;
