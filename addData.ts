
import { db } from './firebase';
import { collection, addDoc } from 'firebase/firestore';
import { FundAccount, LiabilityAccount, Task, Employee, PayrollEntry, Vendor, Customer, Product, Invoice, TimesheetEntry, TimesheetStatus } from './types';

const today = new Date();
const getDate = (daysAgo: number) => new Date(today.getTime() - daysAgo * 24 * 60 * 60 * 1000).toISOString();

const mockEmployees: Omit<Employee, 'id'>[] = [
  { name: 'John Doe', position: 'Resort Manager', rate: 300, deductions: { sss: 1125, philhealth: 437.5, pagibig: 100, tax: 2479.17 }, hireDate: getDate(365) },
  { name: 'Jane Smith', position: 'Front Desk Officer', rate: 150, deductions: { sss: 562.5, philhealth: 218.75, pagibig: 100, tax: 0 }, hireDate: getDate(180) },
  { name: 'Peter Jones', position: 'Maintenance Staff', rate: 120, deductions: { sss: 450, philhealth: 175, pagibig: 100, tax: 0 }, hireDate: getDate(90) },
  { name: 'Mary Williams', position: 'Housekeeping Supervisor', rate: 130, deductions: { sss: 495, philhealth: 192.5, pagibig: 100, tax: 0 }, hireDate: getDate(600) },
];

const mockTimesheetEntries: Omit<TimesheetEntry, 'id'>[] = [
    { employeeId: 'emp1', date: getDate(1), startTime: '09:00', endTime: '17:30', breakDuration: 60, totalHours: 7.5, status: TimesheetStatus.APPROVED, approvedBy: 'admin', approvedAt: getDate(0), createdAt: getDate(1), updatedAt: getDate(0) },
    { employeeId: 'emp2', date: getDate(1), startTime: '08:30', endTime: '17:00', breakDuration: 30, totalHours: 8, status: TimesheetStatus.APPROVED, approvedBy: 'admin', approvedAt: getDate(0), createdAt: getDate(1), updatedAt: getDate(0) },
    { employeeId: 'emp3', date: getDate(1), startTime: '10:00', endTime: '19:00', breakDuration: 60, totalHours: 8, status: TimesheetStatus.PENDING, createdAt: getDate(1), updatedAt: getDate(1) },
    { employeeId: 'emp4', date: getDate(2), startTime: '09:00', endTime: '18:00', breakDuration: 60, totalHours: 8, status: TimesheetStatus.PENDING, createdAt: getDate(2), updatedAt: getDate(2) },
    { employeeId: 'emp1', date: getDate(2), startTime: '09:00', endTime: '19:00', breakDuration: 60, totalHours: 9, notes: 'Stayed late to finish report', status: TimesheetStatus.PENDING, createdAt: getDate(2), updatedAt: getDate(2) },
    { employeeId: 'emp2', date: getDate(3), startTime: '08:00', endTime: '12:00', breakDuration: 0, totalHours: 4, notes: 'Half day', status: TimesheetStatus.REJECTED, approvedBy: 'admin', approvedAt: getDate(2), createdAt: getDate(3), updatedAt: getDate(2) },
];

const seedCollection = async <T extends { id?: string }>(collectionName: string, data: Omit<T, 'id'>[]) => {
    const collectionRef = collection(db, collectionName);
    console.log(`Seeding ${collectionName}...`);
    for (const item of data) {
        await addDoc(collectionRef, item);
    }
    console.log(`${collectionName} seeded successfully!`);
};

export const seedDatabase = async () => {
    await seedCollection<Employee>('employees', mockEmployees);
    await seedCollection<TimesheetEntry>('timesheetEntries', mockTimesheetEntries);
    // Add other collections here as needed
    // await seedCollection<FundAccount>('fundAccounts', mockFundAccounts);
    // await seedCollection<LiabilityAccount>('liabilityAccounts', mockLiabilityAccounts);
    // await seedCollection<Task>('tasks', mockTasks);
    // await seedCollection<PayrollEntry>('payrollEntries', mockPayrollEntries);
    // await seedCollection<Vendor>('vendors', mockVendors);
    // await seedCollection<Customer>('customers', mockCustomers);
    // await seedCollection<Product>('products', mockProducts);
    // await seedCollection<Invoice>('invoices', mockInvoices);
};

// To run the seeding, you could expose this function to a script that you can execute, for example:
// seedDatabase().then(() => console.log('Database seeding complete!')).catch(console.error);
