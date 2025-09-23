

import { AnyTransaction, FundAccount, Task, TransactionType, TaskStatus, TaskPriority, Income, Expense, Employee, PayrollEntry, PayrollStatus, Deductions, Vendor, Customer, Product, Invoice, InvoiceStatus, LineItem, LiabilityAccount, TimesheetEntry, TimesheetStatus } from '../types';

const today = new Date();
const getDate = (daysAgo: number) => new Date(today.getTime() - daysAgo * 24 * 60 * 60 * 1000).toISOString();

let mockFundAccounts: FundAccount[] = [];

let mockLiabilityAccounts: LiabilityAccount[] = [];

let mockTransactions: AnyTransaction[] = [];

let mockTasks: Task[] = [];

let mockEmployees: Employee[] = [
  { id: 'emp1', name: 'John Doe', position: 'Resort Manager', rate: 300, deductions: { sss: 1125, philhealth: 437.5, pagibig: 100, tax: 2479.17 }, hireDate: getDate(365) },
  { id: 'emp2', name: 'Jane Smith', position: 'Front Desk Officer', rate: 150, deductions: { sss: 562.5, philhealth: 218.75, pagibig: 100, tax: 0 }, hireDate: getDate(180) },
  { id: 'emp3', name: 'Peter Jones', position: 'Maintenance Staff', rate: 120, deductions: { sss: 450, philhealth: 175, pagibig: 100, tax: 0 }, hireDate: getDate(90) },
  { id: 'emp4', name: 'Mary Williams', position: 'Housekeeping Supervisor', rate: 130, deductions: { sss: 495, philhealth: 192.5, pagibig: 100, tax: 0 }, hireDate: getDate(600) },
];

let mockPayrollEntries: PayrollEntry[] = [];

let mockVendors: Vendor[] = [];

let mockCustomers: Customer[] = [];

let mockProducts: Product[] = [];

let mockInvoices: Invoice[] = [];

let mockTimesheetEntries: TimesheetEntry[] = [
    { id: 'ts1', employeeId: 'emp1', date: getDate(1), startTime: '09:00', endTime: '17:30', breakDuration: 60, totalHours: 7.5, status: TimesheetStatus.APPROVED, approvedBy: 'admin', approvedAt: getDate(0), createdAt: getDate(1), updatedAt: getDate(0) },
    { id: 'ts2', employeeId: 'emp2', date: getDate(1), startTime: '08:30', endTime: '17:00', breakDuration: 30, totalHours: 8, status: TimesheetStatus.APPROVED, approvedBy: 'admin', approvedAt: getDate(0), createdAt: getDate(1), updatedAt: getDate(0) },
    { id: 'ts3', employeeId: 'emp3', date: getDate(1), startTime: '10:00', endTime: '19:00', breakDuration: 60, totalHours: 8, status: TimesheetStatus.PENDING, createdAt: getDate(1), updatedAt: getDate(1) },
    { id: 'ts4', employeeId: 'emp4', date: getDate(2), startTime: '09:00', endTime: '18:00', breakDuration: 60, totalHours: 8, status: TimesheetStatus.PENDING, createdAt: getDate(2), updatedAt: getDate(2) },
    { id: 'ts5', employeeId: 'emp1', date: getDate(2), startTime: '09:00', endTime: '19:00', breakDuration: 60, totalHours: 9, notes: 'Stayed late to finish report', status: TimesheetStatus.PENDING, createdAt: getDate(2), updatedAt: getDate(2) },
    { id: 'ts6', employeeId: 'emp2', date: getDate(3), startTime: '08:00', endTime: '12:00', breakDuration: 0, totalHours: 4, notes: 'Half day', status: TimesheetStatus.REJECTED, approvedBy: 'admin', approvedAt: getDate(2), createdAt: getDate(3), updatedAt: getDate(2) },
];

const apiRequest = <T,>(data: T, delay = 500): Promise<T> => 
  new Promise(resolve => setTimeout(() => resolve(data), delay));

export const getFundAccounts = () => apiRequest(mockFundAccounts);
export const getLiabilityAccounts = () => apiRequest(mockLiabilityAccounts);
export const getTransactions = () => apiRequest(mockTransactions);
export const getTasks = () => apiRequest(mockTasks);
export const getEmployees = () => apiRequest(mockEmployees);
export const getPayrollEntries = () => apiRequest(mockPayrollEntries);
export const getVendors = () => apiRequest(mockVendors);
export const getCustomers = () => apiRequest(mockCustomers);
export const getProducts = () => apiRequest(mockProducts);
export const getInvoices = () => apiRequest(mockInvoices);
export const getTimesheetEntries = () => apiRequest(mockTimesheetEntries);

export const addInvoice = (invoiceData: Omit<Invoice, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newInvoice: Invoice = {
        ...invoiceData,
        id: `inv${new Date().getTime()}`,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
    };
    mockInvoices = [newInvoice, ...mockInvoices];
    return apiRequest(newInvoice);
};

export const addTask = (taskData: Omit<Task, 'id' | 'createdAt' | 'updatedAt' | 'status' | 'createdBy'>) => {
    const newTask: Task = {
        ...taskData,
        id: `task${new Date().getTime()}`,
        status: TaskStatus.TODO, // New tasks always start in 'To Do'
        createdBy: 'admin', // Assume admin is creating
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
    };
    mockTasks = [newTask, ...mockTasks];
    return apiRequest(newTask);
};

export const updateTask = (taskId: string, updates: Partial<Omit<Task, 'id'>>) => {
    let updatedTask: Task | undefined;
    mockTasks = mockTasks.map(task => {
        if (task.id === taskId) {
            updatedTask = {
                ...task,
                ...updates,
                updatedAt: new Date().toISOString(),
            };
            return updatedTask;
        }
        return task;
    });
    if (!updatedTask) throw new Error("Task not found");
    return apiRequest(updatedTask);
};

export const deleteTask = (taskId: string) => {
    const taskToDelete = mockTasks.find(t => t.id === taskId);
    if (!taskToDelete) throw new Error("Task not found");
    mockTasks = mockTasks.filter(t => t.id !== taskId);
    return apiRequest(taskToDelete);
};

export const addTaskComment = (taskId: string, text: string, userId: string) => {
    let updatedTask: Task | undefined;
    mockTasks = mockTasks.map(task => {
        if (task.id === taskId) {
            const newComment = {
                userId,
                text,
                createdAt: new Date().toISOString(),
            };
            const comments = task.comments ? [...task.comments, newComment] : [newComment];
            updatedTask = {
                ...task,
                comments,
                updatedAt: new Date().toISOString(),
            };
            return updatedTask;
        }
        return task;
    });
    if (!updatedTask) throw new Error("Task not found");
    return apiRequest(updatedTask);
};

export const addTaskAttachment = (taskId: string, attachmentUrl: string) => {
    let updatedTask: Task | undefined;
    mockTasks = mockTasks.map(task => {
        if (task.id === taskId) {
            const newAttachments = task.attachments ? [...task.attachments, attachmentUrl] : [attachmentUrl];
            updatedTask = {
                ...task,
                attachments: newAttachments,
                updatedAt: new Date().toISOString(),
            };
            return updatedTask;
        }
        return task;
    });
    if (!updatedTask) throw new Error("Task not found");
    return apiRequest(updatedTask);
};

export const addFundAccount = (accountData: Omit<FundAccount, 'id' | 'lastUpdated' | 'isHidden'>) => {
    const newAccount: FundAccount = {
        ...accountData,
        id: new Date().getTime().toString(),
        lastUpdated: new Date().toISOString(),
        isHidden: false,
    };
    mockFundAccounts = [newAccount, ...mockFundAccounts];
    return apiRequest(newAccount);
};

export const addLiabilityAccount = (accountData: Omit<LiabilityAccount, 'id' | 'lastUpdated'>) => {
    const newAccount: LiabilityAccount = {
        ...accountData,
        id: `lia-${new Date().getTime().toString()}`,
        lastUpdated: new Date().toISOString(),
    };
    mockLiabilityAccounts = [newAccount, ...mockLiabilityAccounts];
    return apiRequest(newAccount);
};

export const updateFundAccount = (accountId: string, updates: Partial<FundAccount>) => {
    let updatedAccount: FundAccount | undefined;
    mockFundAccounts = mockFundAccounts.map(acc => {
        if (acc.id === accountId) {
            updatedAccount = { ...acc, ...updates, lastUpdated: new Date().toISOString() };
            return updatedAccount;
        }
        return acc;
    });
    if (!updatedAccount) throw new Error("Account not found");
    return apiRequest(updatedAccount);
}

export const deleteFundAccount = (accountId: string) => {
    const accountToDelete = mockFundAccounts.find(acc => acc.id === accountId);
    if (!accountToDelete) throw new Error("Account not found");
    mockFundAccounts = mockFundAccounts.filter(acc => acc.id !== accountId);
    return apiRequest(accountToDelete);
}

export const addVendor = (vendorData: Omit<Vendor, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newVendor: Vendor = {
        ...vendorData,
        id: `v${new Date().getTime()}`,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
    };
    mockVendors = [newVendor, ...mockVendors];
    return apiRequest(newVendor);
};

export const updateVendor = (vendorId: string, updates: Partial<Omit<Vendor, 'id'>>) => {
    let updatedVendor: Vendor | undefined;
    mockVendors = mockVendors.map(v => {
        if (v.id === vendorId) {
            updatedVendor = { 
                ...v, 
                ...updates,
                updatedAt: new Date().toISOString(),
            };
            return updatedVendor;
        }
        return v;
    });
    if (!updatedVendor) throw new Error("Vendor not found");
    return apiRequest(updatedVendor);
};

export const deleteVendor = (vendorId: string) => {
    const vendorToDelete = mockVendors.find(v => v.id === vendorId);
    if (!vendorToDelete) throw new Error("Vendor not found");
    mockVendors = mockVendors.filter(v => v.id !== vendorId);
    return apiRequest(vendorToDelete);
};

export const addPayrollRun = (entries: Omit<PayrollEntry, 'id' | 'status'>[]) => {
    const newEntries: PayrollEntry[] = entries.map((entry, index) => ({
        ...entry,
        id: `pr${new Date().getTime()}${index}`,
        status: PayrollStatus.DRAFT,
    }));
    mockPayrollEntries = [...newEntries, ...mockPayrollEntries];
    return apiRequest(newEntries);
};

export const addEmployee = (employeeData: Omit<Employee, 'id'>) => {
    const newEmployee: Employee = {
        ...employeeData,
        id: `emp${new Date().getTime()}`,
        deductions: employeeData.deductions || { sss: 0, philhealth: 0, pagibig: 0, tax: 0 },
    };
    mockEmployees = [newEmployee, ...mockEmployees];
    return apiRequest(newEmployee);
};

export const updateEmployee = (employeeId: string, updates: Partial<Omit<Employee, 'id'>>) => {
    let updatedEmployee: Employee | undefined;
    mockEmployees = mockEmployees.map(emp => {
        if (emp.id === employeeId) {
            updatedEmployee = { 
                ...emp, 
                ...updates,
                deductions: { ...emp.deductions, ...updates.deductions },
            };
            return updatedEmployee;
        }
        return emp;
    });
    if (!updatedEmployee) throw new Error("Employee not found");
    return apiRequest(updatedEmployee);
};

export const deleteEmployee = (employeeId: string) => {
    const employeeToDelete = mockEmployees.find(emp => emp.id === employeeId);
    if (!employeeToDelete) throw new Error("Employee not found");
    mockEmployees = mockEmployees.filter(emp => emp.id !== employeeId);
    return apiRequest(employeeToDelete);
};

export const addTransactions = (transactions: Omit<AnyTransaction, 'id'>[]) => {
    // Fix: Cast the mapped object to AnyTransaction to resolve a TypeScript inference issue.
    // When spreading a discriminated union, TypeScript can fail to preserve the specific type
    // (Income or Expense), leading to a type error. The cast assures the compiler that
    // the object structure is correct.
    const newTransactions: AnyTransaction[] = transactions.map((t, index) => ({
        ...t,
        id: `csv-${new Date().getTime()}-${index}`,
    }) as AnyTransaction);
    mockTransactions = [...newTransactions, ...mockTransactions];
    return apiRequest(newTransactions);
};

export const addCustomer = (customerData: Omit<Customer, 'id'>) => {
    const newCustomer: Customer = {
        ...customerData,
        id: `cust${new Date().getTime()}`,
    };
    mockCustomers = [newCustomer, ...mockCustomers];
    return apiRequest(newCustomer);
};

export const addTimesheetEntry = (entryData: Omit<TimesheetEntry, 'id' | 'createdAt' | 'updatedAt' | 'status'>) => {
    const newEntry: TimesheetEntry = {
        ...entryData,
        id: `ts${new Date().getTime()}`,
        status: TimesheetStatus.PENDING,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
    };
    mockTimesheetEntries = [newEntry, ...mockTimesheetEntries];
    return apiRequest(newEntry);
};

export const updateTimesheetEntry = (entryId: string, updates: Partial<Omit<TimesheetEntry, 'id'>>) => {
    let updatedEntry: TimesheetEntry | undefined;
    mockTimesheetEntries = mockTimesheetEntries.map(entry => {
        if (entry.id === entryId) {
            updatedEntry = {
                ...entry,
                ...updates,
                updatedAt: new Date().toISOString(),
            };
            return updatedEntry;
        }
        return entry;
    });
    if (!updatedEntry) throw new Error("Timesheet entry not found");
    return apiRequest(updatedEntry);
};

export const deleteTimesheetEntry = (entryId: string) => {
    const entryToDelete = mockTimesheetEntries.find(e => e.id === entryId);
    if (!entryToDelete) throw new Error("Timesheet entry not found");
    mockTimesheetEntries = mockTimesheetEntries.filter(e => e.id !== entryId);
    return apiRequest(entryToDelete);
};