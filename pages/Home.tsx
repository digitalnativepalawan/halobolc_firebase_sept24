import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Modal from '../components/ui/Modal';
import { RightArrowIcon, FundsIcon, ReportsIcon, TransactionsIcon, TasksIcon, VendorsIcon, EmployeesIcon, PayrollIcon, DataIcon, FlagIcon, ClipboardListIcon, CogIcon, ExclamationCircleIcon, CheckCircleIcon, PencilIcon, TrashIcon, ChevronLeftIcon, ChevronRightIcon, PlusIcon } from '../components/Icons';
import { getTasks, updateTask, deleteTask, addTask } from '../services/mockApi';
import { Task, TaskPriority, TaskStatus } from '../types';
import { formatDate } from '../utils/formatters';

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
    { title: 'Create Task', to: '/tasks', icon: TasksIcon, color: 'text-yellow-400' },
    { title: 'Manage Funds', to: '/funds', icon: FundsIcon, color: 'text-purple-400' },
    { title: 'View Reports', to: '/reports', icon: ReportsIcon, color: 'text-blue-400' },
    { title: 'Manage Employees', to: '/employees', icon: EmployeesIcon, color: 'text-pink-400' },
    { title: 'Manage Vendors', to: '/vendors', icon: VendorsIcon, color: 'text-indigo-400' },
    { title: 'Run Payroll', to: '/payroll', icon: PayrollIcon, color: 'text-teal-400' },
    { title: 'Upload Data', to: '/data', icon: DataIcon, color: 'text-orange-400' }
];

const assigneeMap: { [key: string]: string } = {
    'staff-1': 'John Doe',
    'manager-1': 'Jane Smith',
    'admin': 'Admin User',
};

const priorityConfig: { [key in TaskPriority]: { label: string, color: string, iconColor: string } } = {
    [TaskPriority.LOW]: { label: 'Low', color: 'bg-gray-500/10 text-gray-400', iconColor: 'text-gray-400' },
    [TaskPriority.MEDIUM]: { label: 'Medium', color: 'bg-yellow-500/10 text-yellow-400', iconColor: 'text-yellow-400' },
    [TaskPriority.HIGH]: { label: 'High', color: 'bg-red-500/10 text-red-400', iconColor: 'text-red-400' },
};

const statusConfig: { [key in TaskStatus]: { title: string, color: string, icon: React.FC<{className?: string}> } } = {
    [TaskStatus.TODO]: { title: 'To Do', color: 'bg-gray-500/10 text-gray-400', icon: ClipboardListIcon },
    [TaskStatus.IN_PROGRESS]: { title: 'In Progress', color: 'bg-blue-500/10 text-blue-400', icon: CogIcon },
    [TaskStatus.BLOCKED]: { title: 'Blocked', color: 'bg-red-500/10 text-red-400', icon: ExclamationCircleIcon },
    [TaskStatus.DONE]: { title: 'Done', color: 'bg-green-500/10 text-green-400', icon: CheckCircleIcon },
};

const EditTaskForm: React.FC<{
    onClose: () => void;
    onTaskUpdated: (updatedTask: Task) => void;
    initialData: Task;
}> = ({ onClose, onTaskUpdated, initialData }) => {
    const [formData, setFormData] = useState({
        title: initialData.title,
        description: initialData.description || '',
        assignee: initialData.assignee,
        priority: initialData.priority,
        status: initialData.status,
        dueDate: initialData.dueDate ? new Date(initialData.dueDate).toISOString().split('T')[0] : '',
    });
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({...prev, [name]: value}));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.title.trim() || isSubmitting) return;
        setIsSubmitting(true);
        try {
            const updates: Partial<Task> = {
                ...formData,
                dueDate: formData.dueDate ? new Date(formData.dueDate).toISOString() : undefined,
            };
            const updatedTask = await updateTask(initialData.id, updates);
            onTaskUpdated(updatedTask);
            onClose();
        } catch (error) {
            console.error("Failed to update task:", error);
        } finally {
            setIsSubmitting(false);
        }
    };
    
    const inputClasses = "bg-[#0D0D12] border border-[#2D2D3A] rounded-lg px-3 py-2 text-sm w-full focus:ring-1 focus:ring-[#8A5CF6] focus:border-[#8A5CF6] outline-none";

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div>
                <label className="text-xs text-gray-400 mb-1 block">Title</label>
                <input type="text" name="title" value={formData.title} onChange={handleChange} className={inputClasses} required autoFocus />
            </div>
            <div>
                <label className="text-xs text-gray-400 mb-1 block">Description (optional)</label>
                <textarea name="description" value={formData.description} onChange={handleChange} rows={3} className={inputClasses} />
            </div>
            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="text-xs text-gray-400 mb-1 block">Assignee</label>
                    <select name="assignee" value={formData.assignee} onChange={handleChange} className={inputClasses}>
                        {Object.entries(assigneeMap).map(([id, name]) => (
                            <option key={id} value={id}>{name}</option>
                        ))}
                    </select>
                </div>
                 <div>
                    <label className="text-xs text-gray-400 mb-1 block">Priority</label>
                    <select name="priority" value={formData.priority} onChange={handleChange} className={inputClasses}>
                        {Object.entries(priorityConfig).map(([level, {label}]) => (
                            <option key={level} value={level}>{label}</option>
                        ))}
                    </select>
                </div>
            </div>
             <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="text-xs text-gray-400 mb-1 block">Status</label>
                    <select name="status" value={formData.status} onChange={handleChange} className={inputClasses}>
                        {Object.entries(statusConfig).map(([status, {title}]) => (
                            <option key={status} value={status}>{title}</option>
                        ))}
                    </select>
                </div>
                <div>
                    <label className="text-xs text-gray-400 mb-1 block">Due Date</label>
                    <input type="date" name="dueDate" value={formData.dueDate} onChange={handleChange} className={inputClasses} />
                </div>
            </div>
            
            <div className="flex justify-end space-x-2 pt-4">
                <Button type="button" variant="secondary" onClick={onClose}>Cancel</Button>
                <Button type="submit" variant="primary" disabled={isSubmitting}>
                    {isSubmitting ? 'Updating...' : 'Update Task'}
                </Button>
            </div>
        </form>
    );
};

const AddTaskForm: React.FC<{
    onClose: () => void;
    onTaskAdded: (newTask: Task) => void;
    defaultDate: Date;
}> = ({ onClose, onTaskAdded, defaultDate }) => {
    const [formData, setFormData] = useState({
        title: '',
        assignee: 'staff-1',
        priority: TaskPriority.MEDIUM,
    });
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.title.trim() || isSubmitting) return;
        setIsSubmitting(true);
        try {
            const newTaskData = {
                ...formData,
                dueDate: defaultDate.toISOString(),
            };
            const newTask = await addTask(newTaskData);
            onTaskAdded(newTask);
            onClose();
        } catch (error) {
            console.error("Failed to add task:", error);
        } finally {
            setIsSubmitting(false);
        }
    };

    const inputClasses = "bg-[#0D0D12] border border-[#2D2D3A] rounded-lg px-3 py-2 text-sm w-full focus:ring-1 focus:ring-[#8A5CF6] focus:border-[#8A5CF6] outline-none";

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div>
                <label className="text-xs text-gray-400 mb-1 block">Title</label>
                <input type="text" name="title" value={formData.title} onChange={handleChange} className={inputClasses} required autoFocus />
            </div>
            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="text-xs text-gray-400 mb-1 block">Assignee</label>
                    <select name="assignee" value={formData.assignee} onChange={handleChange} className={inputClasses}>
                        {Object.entries(assigneeMap).map(([id, name]) => (
                            <option key={id} value={id}>{name}</option>
                        ))}
                    </select>
                </div>
                <div>
                    <label className="text-xs text-gray-400 mb-1 block">Priority</label>
                    <select name="priority" value={formData.priority} onChange={e => setFormData(p => ({...p, priority: e.target.value as TaskPriority}))} className={inputClasses}>
                        {Object.entries(priorityConfig).map(([level, { label }]) => (
                            <option key={level} value={level}>{label}</option>
                        ))}
                    </select>
                </div>
            </div>
            <div className="flex justify-end space-x-2 pt-4">
                <Button type="button" variant="secondary" onClick={onClose}>Cancel</Button>
                <Button type="submit" variant="primary" disabled={isSubmitting}>
                    {isSubmitting ? 'Adding...' : 'Add Task'}
                </Button>
            </div>
        </form>
    );
};


const DatePickerForm: React.FC<{
    task: Task;
    onClose: () => void;
    onDateSet: (updatedTask: Task) => void;
}> = ({ task, onClose, onDateSet }) => {
    const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            const updatedTask = await updateTask(task.id, { dueDate: new Date(date).toISOString() });
            onDateSet(updatedTask);
        } catch (error) {
            console.error("Failed to set due date:", error);
        } finally {
            setIsSubmitting(false);
        }
    };

    const inputClasses = "bg-[#0D0D12] border border-[#2D2D3A] rounded-lg px-3 py-2 text-sm w-full focus:ring-1 focus:ring-[#8A5CF6] focus:border-[#8A5CF6] outline-none";

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div>
                <label className="text-xs text-gray-400 mb-1 block">Select a Due Date</label>
                <input type="date" value={date} onChange={e => setDate(e.target.value)} className={inputClasses} required autoFocus />
            </div>
            <div className="flex justify-end space-x-2 pt-4">
                <Button type="button" variant="secondary" onClick={onClose}>Cancel</Button>
                <Button type="submit" variant="primary" disabled={isSubmitting}>
                    {isSubmitting ? 'Saving...' : 'Set Date'}
                </Button>
            </div>
        </form>
    );
};

const Calendar: React.FC<{
    currentDate: Date;
    setCurrentDate: React.Dispatch<React.SetStateAction<Date>>;
    tasks: Task[];
    selectedDate: Date | null;
    onDayClick: (date: Date) => void;
}> = ({ currentDate, setCurrentDate, tasks, selectedDate, onDayClick }) => {
    const weekdays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

    const tasksByDate = useMemo(() => {
        const map = new Map<string, Task[]>();
        tasks.forEach(task => {
            if (task.dueDate) {
                const dateKey = new Date(task.dueDate).toDateString();
                if (!map.has(dateKey)) {
                    map.set(dateKey, []);
                }
                map.get(dateKey)?.push(task);
            }
        });
        return map;
    }, [tasks]);

    const daysInMonth = useMemo(() => {
        const year = currentDate.getFullYear();
        const month = currentDate.getMonth();
        const firstDayOfMonth = new Date(year, month, 1);
        const lastDayOfMonth = new Date(year, month + 1, 0);
        const days = [];
        
        for (let i = 0; i < firstDayOfMonth.getDay(); i++) {
            days.push(null);
        }
        
        for (let i = 1; i <= lastDayOfMonth.getDate(); i++) {
            days.push(new Date(year, month, i));
        }
        return days;
    }, [currentDate]);

    const changeMonth = (amount: number) => {
        setCurrentDate(prev => {
            const newDate = new Date(prev);
            newDate.setMonth(newDate.getMonth() + amount);
            return newDate;
        });
    };
    
    const priorityColorMap: { [key in TaskPriority]: string } = {
        [TaskPriority.HIGH]: 'bg-red-500',
        [TaskPriority.MEDIUM]: 'bg-yellow-500',
        [TaskPriority.LOW]: 'bg-gray-500',
    };

    return (
        <Card>
            <div className="flex justify-between items-center mb-4">
                <button onClick={() => changeMonth(-1)} className="p-1.5 rounded-full hover:bg-[#2D2D3A]"><ChevronLeftIcon className="h-5 w-5"/></button>
                <h3 className="font-semibold text-white text-lg">{currentDate.toLocaleString('default', { month: 'long', year: 'numeric' })}</h3>
                <button onClick={() => changeMonth(1)} className="p-1.5 rounded-full hover:bg-[#2D2D3A]"><ChevronRightIcon className="h-5 w-5"/></button>
            </div>
            <div className="grid grid-cols-7 gap-1 text-center text-xs text-gray-400 mb-2">
                {weekdays.map(day => <div key={day}>{day}</div>)}
            </div>
            <div className="grid grid-cols-7 gap-1">
                {daysInMonth.map((day, index) => {
                    const isToday = day && day.toDateString() === new Date().toDateString();
                    const isSelected = day && selectedDate && day.toDateString() === selectedDate.toDateString();
                    const tasksOnDay = day ? tasksByDate.get(day.toDateString()) : undefined;
                    
                    return (
                        <button 
                            key={index} 
                            onClick={() => day && onDayClick(day)}
                            disabled={!day}
                            className={`h-16 flex flex-col items-center justify-start p-1 rounded-lg border transition-colors duration-150
                                ${!day ? 'cursor-default' : 'hover:bg-gray-700'}
                                ${isToday ? 'border-purple-500 bg-purple-500/10' : 'border-transparent'}
                                ${isSelected ? 'ring-2 ring-purple-400' : ''}
                            `}>
                           {day && (
                                <>
                                    <span className={`text-sm ${isToday ? 'font-bold text-white' : 'text-gray-300'}`}>{day.getDate()}</span>
                                    <div className="flex flex-wrap justify-center gap-1 mt-2">
                                        {tasksOnDay?.slice(0, 3).map(task => (
                                             <div key={task.id} className={`w-2 h-2 rounded-full ${priorityColorMap[task.priority]}`} title={task.title}></div>
                                        ))}
                                    </div>
                                </>
                           )}
                        </button>
                    );
                })}
            </div>
        </Card>
    );
};


const Home: React.FC = () => {
    const [tasks, setTasks] = useState<Task[]>([]);
    const [editingTask, setEditingTask] = useState<Task | null>(null);
    const [deletingTask, setDeletingTask] = useState<Task | null>(null);
    const [currentDate, setCurrentDate] = useState(new Date());
    const [taskToSchedule, setTaskToSchedule] = useState<Task | null>(null);
    const [selectedDate, setSelectedDate] = useState<Date | null>(null);
    const [isAddTaskModalOpen, setIsAddTaskModalOpen] = useState(false);
    
    const fetchAllTasks = async () => {
        const tasksData = await getTasks();
        setTasks(tasksData);
    };

    useEffect(() => {
        fetchAllTasks();
    }, []);

    const outstandingTasks = useMemo(() => {
        return tasks.filter(task => task.status !== TaskStatus.DONE);
    }, [tasks]);

    const handleTaskUpdated = (updatedTask: Task) => {
        setTasks(prevTasks => prevTasks.map(t => t.id === updatedTask.id ? updatedTask : t));
    };

    const handleTaskAdded = (newTask: Task) => {
        setTasks(prev => [newTask, ...prev]);
    };

    const confirmDelete = async () => {
        if (!deletingTask) return;
        try {
            await deleteTask(deletingTask.id);
            setTasks(prev => prev.filter(t => t.id !== deletingTask.id));
        } catch (error) {
            console.error("Failed to delete task:", error);
        } finally {
            setDeletingTask(null);
        }
    };

    const handleCalendarToggle = (task: Task, checked: boolean) => {
        if (checked) {
            if (!task.dueDate) {
                setTaskToSchedule(task);
            }
        } else {
            if (task.dueDate) {
                if (window.confirm("Are you sure you want to remove the due date for this task?")) {
                    updateTask(task.id, { dueDate: undefined }).then(handleTaskUpdated);
                }
            }
        }
    };

    const tasksForSelectedDay = useMemo(() => {
        if (!selectedDate) return [];
        return tasks.filter(t => t.dueDate && new Date(t.dueDate).toDateString() === selectedDate.toDateString());
    }, [tasks, selectedDate]);

    return (
        <div className="space-y-16">
            <section>
                <Card className="p-8">
                    <h2 className="text-xl font-semibold text-white mb-6">Financial Overview</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                        <div className="text-center">
                            <h3 className="font-medium text-gray-300 mb-2">Income by Category</h3>
                            <ResponsiveContainer width="100%" height={160}>
                                <PieChart>
                                    <Pie data={incomeData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} fill="#8A5CF6" stroke="#1A1A23" />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                        <div className="text-center">
                            <h3 className="font-medium text-gray-300 mb-2">Expenses by Category</h3>
                             <ResponsiveContainer width="100%" height={160}>
                                <PieChart>
                                    <Pie data={expenseData} cx="50%" cy="50%" outerRadius={80} dataKey="value" stroke="#1A1A23">
                                        {expenseData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                        ))}
                                    </Pie>
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                    <div className="text-center mt-6">
                         <a href="#/dashboard" className="text-sm font-medium text-[#A881FF] hover:text-white transition-colors duration-200 inline-flex items-center">
                            View Detailed Reports <RightArrowIcon className="ml-1 w-4 h-4" />
                        </a>
                    </div>
                </Card>
            </section>
            
            <section className="text-center">
                <h2 className="text-3xl font-bold text-white mb-4">Quick Actions</h2>
                <p className="text-gray-400 max-w-xl mx-auto mb-8">Access key features with a single click</p>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
                    {quickActions.map(action => (
                        <Link to={action.to} key={action.title} className="block">
                            <Card className="flex flex-col items-center justify-center p-6 h-full hover:bg-[#2D2D3A] transition-all duration-200">
                                <action.icon className={`h-8 w-8 mb-3 ${action.color}`} />
                                <span className="font-semibold text-white text-center">{action.title}</span>
                            </Card>
                        </Link>
                    ))}
                </div>
            </section>

            <section className="space-y-8">
                <Card>
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-xl font-semibold text-white">Outstanding Tasks</h2>
                        <Link to="/tasks" className="text-sm font-medium text-[#A881FF] hover:text-white transition-colors duration-200">
                            View All Tasks
                        </Link>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left text-gray-400">
                            <thead className="text-xs text-gray-300 uppercase bg-[#0D0D12]">
                                <tr>
                                    <th scope="col" className="px-6 py-3">Task</th>
                                    <th scope="col" className="px-6 py-3">Priority</th>
                                    <th scope="col" className="px-6 py-3">Due Date</th>
                                    <th scope="col" className="px-6 py-3">Status</th>
                                    <th scope="col" className="px-3 py-3 text-center">Calendar</th>
                                    <th scope="col" className="px-3 py-3 text-center">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {outstandingTasks.length > 0 ? (
                                    outstandingTasks.map(task => {
                                        const priority = priorityConfig[task.priority];
                                        const status = statusConfig[task.status];
                                        const StatusIcon = status.icon;

                                        return (
                                            <tr key={task.id} className="border-b border-[#2D2D3A] hover:bg-[#0D0D12]">
                                                <td className="px-6 py-4 font-medium text-white">{task.title}</td>
                                                <td className="px-6 py-4">
                                                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${priority.color}`}>
                                                        <FlagIcon className={`w-3 h-3 mr-1.5 ${priority.iconColor}`} />
                                                        {priority.label}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">{task.dueDate ? formatDate(task.dueDate) : 'N/A'}</td>
                                                <td className="px-6 py-4">
                                                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${status.color}`}>
                                                        <StatusIcon className="w-3 h-3 mr-1.5" />
                                                        {status.title}
                                                    </span>
                                                </td>
                                                <td className="px-3 py-4 text-center">
                                                    <input 
                                                        type="checkbox"
                                                        checked={!!task.dueDate}
                                                        onChange={(e) => handleCalendarToggle(task, e.target.checked)}
                                                        className="h-4 w-4 rounded border-gray-300 text-[#8A5CF6] focus:ring-[#8A5CF6] bg-[#0D0D12]"
                                                        title={task.dueDate ? "Remove from calendar" : "Add to calendar"}
                                                    />
                                                </td>
                                                <td className="px-3 py-4 text-center">
                                                    <div className="flex items-center justify-center space-x-2">
                                                        <button onClick={() => setEditingTask(task)} className="p-1 text-gray-400 hover:text-purple-400 transition-colors" aria-label="Edit task">
                                                            <PencilIcon className="w-4 h-4" />
                                                        </button>
                                                        <button onClick={() => setDeletingTask(task)} className="p-1 text-gray-400 hover:text-red-400 transition-colors" aria-label="Delete task">
                                                            <TrashIcon className="w-4 h-4" />
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        );
                                    })
                                ) : (
                                    <tr>
                                        <td colSpan={6} className="text-center py-8 text-gray-500">
                                            No outstanding tasks. Great job!
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </Card>
                <Calendar 
                    currentDate={currentDate} 
                    setCurrentDate={setCurrentDate} 
                    tasks={tasks} 
                    selectedDate={selectedDate}
                    onDayClick={(day) => setSelectedDate(day)}
                />
            </section>

            {selectedDate && (
                <Modal
                    isOpen={!!selectedDate}
                    onClose={() => setSelectedDate(null)}
                    title={`Tasks for ${selectedDate.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}`}
                >
                    <div className="space-y-3 max-h-96 overflow-y-auto pr-2">
                        {tasksForSelectedDay.length > 0 ? (
                            tasksForSelectedDay.map(task => (
                                <div key={task.id} className="flex justify-between items-center bg-[#0D0D12] p-3 rounded-lg">
                                    <div>
                                        <p className="font-medium text-white">{task.title}</p>
                                        <p className="text-xs text-gray-400">{priorityConfig[task.priority].label} Priority</p>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <button 
                                            onClick={() => { setEditingTask(task); setSelectedDate(null); }} 
                                            className="p-1 text-gray-400 hover:text-purple-400 transition-colors" aria-label="Edit task">
                                            <PencilIcon className="w-4 h-4" />
                                        </button>
                                        <button 
                                            onClick={() => { setDeletingTask(task); setSelectedDate(null); }} 
                                            className="p-1 text-gray-400 hover:text-red-400 transition-colors" aria-label="Delete task">
                                            <TrashIcon className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <p className="text-center text-gray-400 py-4">No tasks scheduled for this day.</p>
                        )}
                    </div>
                    <div className="mt-6 flex justify-end">
                        <Button variant="primary" leftIcon={<PlusIcon/>} onClick={() => setIsAddTaskModalOpen(true)}>
                            Add Task
                        </Button>
                    </div>
                </Modal>
            )}

            {isAddTaskModalOpen && selectedDate && (
                <Modal
                    isOpen={isAddTaskModalOpen}
                    onClose={() => setIsAddTaskModalOpen(false)}
                    title={`Add Task for ${selectedDate.toLocaleDateString()}`}
                >
                    <AddTaskForm
                        defaultDate={selectedDate}
                        onClose={() => setIsAddTaskModalOpen(false)}
                        onTaskAdded={(newTask) => {
                            handleTaskAdded(newTask);
                            setIsAddTaskModalOpen(false);
                        }}
                    />
                </Modal>
            )}

            {editingTask && (
                <Modal
                    isOpen={!!editingTask}
                    onClose={() => setEditingTask(null)}
                    title="Edit Task"
                    size="lg"
                >
                    <EditTaskForm
                        initialData={editingTask}
                        onClose={() => setEditingTask(null)}
                        onTaskUpdated={handleTaskUpdated}
                    />
                </Modal>
            )}

            {taskToSchedule && (
                <Modal
                    isOpen={!!taskToSchedule}
                    onClose={() => setTaskToSchedule(null)}
                    title={`Set Due Date for "${taskToSchedule.title}"`}
                >
                    <DatePickerForm
                        task={taskToSchedule}
                        onClose={() => setTaskToSchedule(null)}
                        onDateSet={(updatedTask) => {
                            handleTaskUpdated(updatedTask);
                            setTaskToSchedule(null);
                        }}
                    />
                </Modal>
            )}

            <Modal isOpen={!!deletingTask} onClose={() => setDeletingTask(null)} title="Delete Task?">
                {deletingTask && (
                    <div>
                        <p className="text-gray-300">Are you sure you want to delete the task "{deletingTask.title}"? This action cannot be undone.</p>
                        <div className="flex justify-end space-x-2 mt-6">
                            <Button variant="secondary" onClick={() => setDeletingTask(null)}>Cancel</Button>
                            <Button variant="primary" className="bg-red-600 hover:bg-red-700 focus:ring-red-500" onClick={confirmDelete}>Delete</Button>
                        </div>
                    </div>
                )}
            </Modal>
        </div>
    );
};

export default Home;