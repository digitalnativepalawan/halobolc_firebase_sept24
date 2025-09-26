
import { db } from '../firebase';
import { collection, getDocs, addDoc, doc, updateDoc, deleteDoc } from 'firebase/firestore';
import { AnyTransaction, FundAccount, Task, TransactionType, TaskStatus, TaskPriority, Income, Expense, Employee, PayrollEntry, PayrollStatus, Deductions, Vendor, Customer, Product, Invoice, InvoiceStatus, LineItem, LiabilityAccount, TimesheetEntry, TimesheetStatus } from '../types';

const apiRequest = <T,>(data: T, delay = 500): Promise<T> =>
  new Promise(resolve => setTimeout(() => resolve(data), delay));

export const getFundAccounts = async (): Promise<FundAccount[]> => {
    const fundAccountsCol = collection(db, 'fundAccounts');
    const fundAccountSnapshot = await getDocs(fundAccountsCol);
    const fundAccountList = fundAccountSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as FundAccount));
    return fundAccountList;
};

export const getLiabilityAccounts = async (): Promise<LiabilityAccount[]> => {
    const liabilityAccountsCol = collection(db, 'liabilityAccounts');
    const liabilityAccountSnapshot = await getDocs(liabilityAccountsCol);
    const liabilityAccountList = liabilityAccountSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as LiabilityAccount));
    return liabilityAccountList;
};

export const getTasks = async (): Promise<Task[]> => {
    const tasksCol = collection(db, 'tasks');
    const taskSnapshot = await getDocs(tasksCol);
    const taskList = taskSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Task));
    return taskList;
};

export const getEmployees = async (): Promise<Employee[]> => {
    const employeesCol = collection(db, 'employees');
    const employeeSnapshot = await getDocs(employeesCol);
    const employeeList = employeeSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Employee));
    return employeeList;
};

export const getPayrollEntries = async (): Promise<PayrollEntry[]> => {
    const payrollEntriesCol = collection(db, 'payrollEntries');
    const payrollEntrySnapshot = await getDocs(payrollEntriesCol);
    const payrollEntryList = payrollEntrySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as PayrollEntry));
    return payrollEntryList;
};

export const getVendors = async (): Promise<Vendor[]> => {
    const vendorsCol = collection(db, 'vendors');
    const vendorSnapshot = await getDocs(vendorsCol);
    const vendorList = vendorSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Vendor));
    return vendorList;
};

export const getCustomers = async (): Promise<Customer[]> => {
    const customersCol = collection(db, 'customers');
    const customerSnapshot = await getDocs(customersCol);
    const customerList = customerSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Customer));
    return customerList;
};

export const getProducts = async (): Promise<Product[]> => {
    const productsCol = collection(db, 'products');
    const productSnapshot = await getDocs(productsCol);
    const productList = productSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Product));
    return productList;
};

export const getInvoices = async (): Promise<Invoice[]> => {
    const invoicesCol = collection(db, 'invoices');
    const invoiceSnapshot = await getDocs(invoicesCol);
    const invoiceList = invoiceSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Invoice));
    return invoiceList;
};

export const getTimesheetEntries = async (): Promise<TimesheetEntry[]> => {
    const timesheetEntriesCol = collection(db, 'timesheetEntries');
    const timesheetEntrySnapshot = await getDocs(timesheetEntriesCol);
    const timesheetEntryList = timesheetEntrySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as TimesheetEntry));
    return timesheetEntryList;
};

export const getTransactions = async (): Promise<AnyTransaction[]> => {
    const transactionsCol = collection(db, 'transactions');
    const transactionSnapshot = await getDocs(transactionsCol);
    const transactionList = transactionSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as AnyTransaction));
    return transactionList;
};

export const addTransactions = async (transactions: Omit<AnyTransaction, 'id'>[]): Promise<AnyTransaction[]> => {
    const addedTransactions: AnyTransaction[] = [];
    for (const transaction of transactions) {
        const docRef = await addDoc(collection(db, 'transactions'), transaction);
        addedTransactions.push({ id: docRef.id, ...transaction } as AnyTransaction);
    }
    return addedTransactions;
};

export const updateTransaction = async (transactionId: string, updates: Partial<Omit<AnyTransaction, 'id'>>): Promise<AnyTransaction> => {
    const transactionRef = doc(db, 'transactions', transactionId);
    await updateDoc(transactionRef, updates);
    return { id: transactionId, ...updates } as AnyTransaction;
};

export const deleteTransaction = async (transactionId: string): Promise<void> => {
    const transactionRef = doc(db, 'transactions', transactionId);
    await deleteDoc(transactionRef);
};


export const addInvoice = async (invoiceData: Omit<Invoice, 'id'>): Promise<Invoice> => {
    const docRef = await addDoc(collection(db, 'invoices'), invoiceData);
    return { id: docRef.id, ...invoiceData } as Invoice;
};

export const addTask = async (taskData: Omit<Task, 'id'>): Promise<Task> => {
    const docRef = await addDoc(collection(db, 'tasks'), taskData);
    return { id: docRef.id, ...taskData } as Task;
};

export const updateTask = async (taskId: string, updates: Partial<Omit<Task, 'id'>>): Promise<Task> => {
    const taskRef = doc(db, 'tasks', taskId);
    await updateDoc(taskRef, updates);
    return { id: taskId, ...updates } as Task;
};

export const deleteTask = async (taskId: string): Promise<void> => {
    const taskRef = doc(db, 'tasks', taskId);
    await deleteDoc(taskRef);
};

export const addFundAccount = async (accountData: Omit<FundAccount, 'id'>): Promise<FundAccount> => {
    const docRef = await addDoc(collection(db, 'fundAccounts'), accountData);
    return { id: docRef.id, ...accountData } as FundAccount;
};

export const addLiabilityAccount = async (accountData: Omit<LiabilityAccount, 'id'>): Promise<LiabilityAccount> => {
    const docRef = await addDoc(collection(db, 'liabilityAccounts'), accountData);
    return { id: docRef.id, ...accountData } as LiabilityAccount;
};

export const updateFundAccount = async (accountId: string, updates: Partial<FundAccount>): Promise<FundAccount> => {
    const accountRef = doc(db, 'fundAccounts', accountId);
    await updateDoc(accountRef, updates);
    return { id: accountId, ...updates } as FundAccount;
}

export const deleteFundAccount = async (accountId: string): Promise<void> => {
    const accountRef = doc(db, 'fundAccounts', accountId);
    await deleteDoc(accountRef);
}

export const addVendor = async (vendorData: Omit<Vendor, 'id'>): Promise<Vendor> => {
    const docRef = await addDoc(collection(db, 'vendors'), vendorData);
    return { id: docRef.id, ...vendorData } as Vendor;
};

export const updateVendor = async (vendorId: string, updates: Partial<Omit<Vendor, 'id'>>): Promise<Vendor> => {
    const vendorRef = doc(db, 'vendors', vendorId);
    await updateDoc(vendorRef, updates);
    return { id: vendorId, ...updates } as Vendor;
};

export const deleteVendor = async (vendorId: string): Promise<void> => {
    const vendorRef = doc(db, 'vendors', vendorId);
    await deleteDoc(vendorRef);
};

export const addPayrollRun = async (entries: Omit<PayrollEntry, 'id'>[]): Promise<PayrollEntry[]> => {
    const addedEntries: PayrollEntry[] = [];
    for (const entry of entries) {
        const docRef = await addDoc(collection(db, 'payrollEntries'), entry);
        addedEntries.push({ id: docRef.id, ...entry } as PayrollEntry);
    }
    return addedEntries;
};

export const addEmployee = async (employeeData: Omit<Employee, 'id'>): Promise<Employee> => {
    const docRef = await addDoc(collection(db, 'employees'), employeeData);
    return { id: docRef.id, ...employeeData } as Employee;
};

export const updateEmployee = async (employeeId: string, updates: Partial<Omit<Employee, 'id'>>): Promise<Employee> => {
    const employeeRef = doc(db, 'employees', employeeId);
    await updateDoc(employeeRef, updates);
    return { id: employeeId, ...updates } as Employee;
};

export const deleteEmployee = async (employeeId: string): Promise<void> => {
    const employeeRef = doc(db, 'employees', employeeId);
    await deleteDoc(employeeRef);
};

export const addCustomer = async (customerData: Omit<Customer, 'id'>): Promise<Customer> => {
    const docRef = await addDoc(collection(db, 'customers'), customerData);
    return { id: docRef.id, ...customerData } as Customer;
};

export const addTimesheetEntry = async (entryData: Omit<TimesheetEntry, 'id'>): Promise<TimesheetEntry> => {
    const docRef = await addDoc(collection(db, 'timesheetEntries'), entryData);
    return { id: docRef.id, ...entryData } as TimesheetEntry;
};

export const updateTimesheetEntry = async (entryId: string, updates: Partial<Omit<TimesheetEntry, 'id'>>): Promise<TimesheetEntry> => {
    const entryRef = doc(db, 'timesheetEntries', entryId);
    await updateDoc(entryRef, updates);
    return { id: entryId, ...updates } as TimesheetEntry;
};

export const deleteTimesheetEntry = async (entryId: string): Promise<void> => {
    const entryRef = doc(db, 'timesheetEntries', entryId);
    await deleteDoc(entryRef);
};
