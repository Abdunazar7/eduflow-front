// Mock data representing the Prisma schema structure

export interface Tenant {
  id: number;
  name: string;
  subdomain: string;
  logoUrl?: string;
  contactPhone?: string;
  isActive: boolean;
  createdAt: Date;
}

export interface SubscriptionPlan {
  id: number;
  name: string;
  maxStudents?: number;
  monthlyPrice: number;
}

export interface TenantSubscription {
  id: number;
  tenantId: number;
  planId: number;
  startDate: Date;
  endDate: Date;
  status: string;
}

export interface User {
  id: number;
  tenantId?: number;
  roleId: number;
  phone: string;
  firstName: string;
  lastName: string;
  photoUrl?: string;
  isActive: boolean;
  lastLogin?: Date;
  createdAt: Date;
  role: Role;
  studentProfile?: StudentProfile;
  teacherProfile?: TeacherProfile;
  staffProfile?: StaffProfile;
}

export interface Role {
  id: number;
  name: string;
  description?: string;
}

export interface StudentProfile {
  userId: number;
  birthDate?: Date;
  parentName?: string;
  parentPhone?: string;
  balance: number;
  discountPercent: number;
  notes?: string;
}

export interface TeacherProfile {
  userId: number;
  specialization?: string;
  salaryType: string;
  salaryValue: number;
  hiredDate: Date;
}

export interface StaffProfile {
  userId: number;
  jobTitle?: string;
  fixedSalary?: number;
}

export interface Branch {
  id: number;
  tenantId: number;
  name: string;
  address?: string;
  phone?: string;
}

export interface Course {
  id: number;
  tenantId: number;
  name: string;
  description?: string;
  isActive: boolean;
}

export interface CourseLevel {
  id: number;
  courseId: number;
  name: string;
  orderIndex: number;
  price: number;
  durationMonths: number;
}

export interface Group {
  id: number;
  tenantId: number;
  branchId?: number;
  courseLevelId: number;
  teacherId: number;
  supportTeacherId?: number;
  name: string;
  startDate?: Date;
  endDate?: Date;
  status: string;
  roomId?: number;
}

export interface Enrollment {
  id: number;
  studentId: number;
  groupId: number;
  joinedAt: Date;
  status: string;
  contractPrice?: number;
}

export interface Lesson {
  id: number;
  groupId: number;
  date: Date;
  topic?: string;
  status: string;
  teacherId?: number;
}

export interface Attendance {
  id: number;
  lessonId: number;
  studentId: number;
  status: string;
  comment?: string;
}

export interface Lead {
  id: number;
  tenantId: number;
  firstName: string;
  phone: string;
  source?: string;
  statusId?: number;
  assignedTo?: number;
  createdAt: Date;
}

export interface LeadStatus {
  id: number;
  tenantId?: number;
  name: string;
  orderIndex?: number;
}

export interface Transaction {
  id: number;
  tenantId: number;
  userId?: number;
  amount: number;
  type: string;
  category?: string;
  paymentMethod?: string;
  createdAt: Date;
}

// Mock Data
export const subscriptionPlans: SubscriptionPlan[] = [
  { id: 1, name: "Starter", maxStudents: 50, monthlyPrice: 99 },
  { id: 2, name: "Professional", maxStudents: 200, monthlyPrice: 299 },
  { id: 3, name: "Enterprise", maxStudents: undefined, monthlyPrice: 799 },
];

export const tenants: Tenant[] = [
  {
    id: 1,
    name: "English Excellence Academy",
    subdomain: "excellence",
    contactPhone: "+1234567890",
    isActive: true,
    createdAt: new Date("2024-01-15"),
  },
  {
    id: 2,
    name: "Language Masters Center",
    subdomain: "masters",
    contactPhone: "+1234567891",
    isActive: true,
    createdAt: new Date("2024-03-20"),
  },
  {
    id: 3,
    name: "Global Speak Institute",
    subdomain: "globalspeak",
    contactPhone: "+1234567892",
    isActive: true,
    createdAt: new Date("2024-06-10"),
  },
];

export const tenantSubscriptions: TenantSubscription[] = [
  {
    id: 1,
    tenantId: 1,
    planId: 2,
    startDate: new Date("2024-01-15"),
    endDate: new Date("2025-01-15"),
    status: "active",
  },
  {
    id: 2,
    tenantId: 2,
    planId: 3,
    startDate: new Date("2024-03-20"),
    endDate: new Date("2025-03-20"),
    status: "active",
  },
  {
    id: 3,
    tenantId: 3,
    planId: 1,
    startDate: new Date("2024-06-10"),
    endDate: new Date("2025-06-10"),
    status: "active",
  },
];

export const roles: Role[] = [
  { id: 1, name: "Super Admin", description: "System administrator" },
  { id: 2, name: "Admin", description: "Tenant administrator" },
  { id: 3, name: "Teacher", description: "Course teacher" },
  { id: 4, name: "Student", description: "Student user" },
  { id: 5, name: "Staff", description: "Staff member" },
];

export const branches: Branch[] = [
  { id: 1, tenantId: 1, name: "Central Branch", address: "123 Main St", phone: "+1234567890" },
  { id: 2, tenantId: 1, name: "North Branch", address: "456 North Ave", phone: "+1234567891" },
  { id: 3, tenantId: 2, name: "Downtown Center", address: "789 Center Blvd", phone: "+1234567892" },
];

export const courses: Course[] = [
  { id: 1, tenantId: 1, name: "English for Beginners", description: "Basic English course", isActive: true },
  { id: 2, tenantId: 1, name: "Business English", description: "Professional English course", isActive: true },
  { id: 3, tenantId: 1, name: "IELTS Preparation", description: "IELTS exam preparation", isActive: true },
  { id: 4, tenantId: 2, name: "Spanish A1", description: "Beginner Spanish", isActive: true },
];

export const courseLevels: CourseLevel[] = [
  { id: 1, courseId: 1, name: "A1 - Elementary", orderIndex: 1, price: 200, durationMonths: 3 },
  { id: 2, courseId: 1, name: "A2 - Pre-Intermediate", orderIndex: 2, price: 220, durationMonths: 3 },
  { id: 3, courseId: 2, name: "B1 - Intermediate", orderIndex: 1, price: 250, durationMonths: 3 },
  { id: 4, courseId: 3, name: "IELTS Band 6.5+", orderIndex: 1, price: 300, durationMonths: 2 },
];

export const leadStatuses: LeadStatus[] = [
  { id: 1, tenantId: 1, name: "New", orderIndex: 1 },
  { id: 2, tenantId: 1, name: "Contacted", orderIndex: 2 },
  { id: 3, tenantId: 1, name: "Trial Scheduled", orderIndex: 3 },
  { id: 4, tenantId: 1, name: "Enrolled", orderIndex: 4 },
  { id: 5, tenantId: 1, name: "Lost", orderIndex: 5 },
];

export const users: User[] = [
  {
    id: 1,
    tenantId: undefined,
    roleId: 1,
    phone: "+1111111111",
    firstName: "System",
    lastName: "Admin",
    isActive: true,
    createdAt: new Date("2024-01-01"),
    role: roles[0],
  },
  {
    id: 2,
    tenantId: 1,
    roleId: 2,
    phone: "+2222222222",
    firstName: "John",
    lastName: "Manager",
    isActive: true,
    createdAt: new Date("2024-01-15"),
    role: roles[1],
  },
  {
    id: 3,
    tenantId: 1,
    roleId: 3,
    phone: "+3333333333",
    firstName: "Sarah",
    lastName: "Williams",
    isActive: true,
    createdAt: new Date("2024-02-01"),
    role: roles[2],
    teacherProfile: {
      userId: 3,
      specialization: "IELTS, Business English",
      salaryType: "per_student",
      salaryValue: 15,
      hiredDate: new Date("2024-02-01"),
    },
  },
  {
    id: 4,
    tenantId: 1,
    roleId: 3,
    phone: "+3333333334",
    firstName: "Michael",
    lastName: "Johnson",
    isActive: true,
    createdAt: new Date("2024-02-15"),
    role: roles[2],
    teacherProfile: {
      userId: 4,
      specialization: "General English",
      salaryType: "fixed",
      salaryValue: 1200,
      hiredDate: new Date("2024-02-15"),
    },
  },
  {
    id: 5,
    tenantId: 1,
    roleId: 4,
    phone: "+4444444445",
    firstName: "Emma",
    lastName: "Brown",
    isActive: true,
    createdAt: new Date("2024-03-01"),
    role: roles[3],
    studentProfile: {
      userId: 5,
      birthDate: new Date("2005-05-15"),
      parentName: "Robert Brown",
      parentPhone: "+4444444440",
      balance: 150,
      discountPercent: 10,
    },
  },
  {
    id: 6,
    tenantId: 1,
    roleId: 4,
    phone: "+4444444446",
    firstName: "Oliver",
    lastName: "Davis",
    isActive: true,
    createdAt: new Date("2024-03-05"),
    role: roles[3],
    studentProfile: {
      userId: 6,
      birthDate: new Date("2006-08-20"),
      parentName: "Lisa Davis",
      parentPhone: "+4444444441",
      balance: -50,
      discountPercent: 0,
    },
  },
  {
    id: 7,
    tenantId: 1,
    roleId: 4,
    phone: "+4444444447",
    firstName: "Sophia",
    lastName: "Wilson",
    isActive: true,
    createdAt: new Date("2024-03-10"),
    role: roles[3],
    studentProfile: {
      userId: 7,
      birthDate: new Date("2004-12-10"),
      parentName: "James Wilson",
      parentPhone: "+4444444442",
      balance: 200,
      discountPercent: 5,
    },
  },
  {
    id: 8,
    tenantId: 1,
    roleId: 4,
    phone: "+4444444448",
    firstName: "Xonzoda",
    lastName: "Aliyeva",
    isActive: true,
    createdAt: new Date("2024-03-12"),
    role: roles[3],
    studentProfile: {
      userId: 8,
      birthDate: new Date("2005-03-15"),
      parentName: "Dilshod Aliyev",
      parentPhone: "+998901234567",
      balance: 100,
      discountPercent: 0,
    },
  },
  {
    id: 9,
    tenantId: 1,
    roleId: 4,
    phone: "+4444444449",
    firstName: "Abdulaziz",
    lastName: "Karimov",
    isActive: true,
    createdAt: new Date("2024-03-13"),
    role: roles[3],
    studentProfile: {
      userId: 9,
      birthDate: new Date("2006-07-20"),
      parentName: "Jamshid Karimov",
      parentPhone: "+998901234568",
      balance: 50,
      discountPercent: 10,
    },
  },
  {
    id: 10,
    tenantId: 1,
    roleId: 4,
    phone: "+4444444450",
    firstName: "Muslima",
    lastName: "Ibragimova",
    isActive: true,
    createdAt: new Date("2024-03-14"),
    role: roles[3],
    studentProfile: {
      userId: 10,
      birthDate: new Date("2005-11-25"),
      parentName: "Rustam Ibragimov",
      parentPhone: "+998901234569",
      balance: 150,
      discountPercent: 5,
    },
  },
  {
    id: 11,
    tenantId: 1,
    roleId: 4,
    phone: "+4444444451",
    firstName: "Omina",
    lastName: "Tursunova",
    isActive: true,
    createdAt: new Date("2024-03-15"),
    role: roles[3],
    studentProfile: {
      userId: 11,
      birthDate: new Date("2004-09-10"),
      parentName: "Anvar Tursunov",
      parentPhone: "+998901234570",
      balance: 75,
      discountPercent: 0,
    },
  },
  {
    id: 12,
    tenantId: 1,
    roleId: 4,
    phone: "+4444444452",
    firstName: "Malikabonu",
    lastName: "Ortiqova",
    isActive: true,
    createdAt: new Date("2024-03-16"),
    role: roles[3],
    studentProfile: {
      userId: 12,
      birthDate: new Date("2006-01-30"),
      parentName: "Sherzod Ortiqov",
      parentPhone: "+998901234571",
      balance: 125,
      discountPercent: 8,
    },
  },
  {
    id: 13,
    tenantId: 1,
    roleId: 4,
    phone: "+4444444453",
    firstName: "Ruxsora",
    lastName: "Abdullayeva",
    isActive: true,
    createdAt: new Date("2024-03-17"),
    role: roles[3],
    studentProfile: {
      userId: 13,
      birthDate: new Date("2005-06-18"),
      parentName: "Farrux Abdullayev",
      parentPhone: "+998901234572",
      balance: 90,
      discountPercent: 5,
    },
  },
  {
    id: 14,
    tenantId: 1,
    roleId: 4,
    phone: "+4444444454",
    firstName: "Asadbek",
    lastName: "Axmedov",
    isActive: true,
    createdAt: new Date("2024-03-18"),
    role: roles[3],
    studentProfile: {
      userId: 14,
      birthDate: new Date("2006-04-22"),
      parentName: "Ulugbek Axmedov",
      parentPhone: "+998901234573",
      balance: 110,
      discountPercent: 0,
    },
  },
  {
    id: 15,
    tenantId: 1,
    roleId: 4,
    phone: "+4444444455",
    firstName: "Madina",
    lastName: "Normatova",
    isActive: true,
    createdAt: new Date("2024-03-19"),
    role: roles[3],
    studentProfile: {
      userId: 15,
      birthDate: new Date("2005-08-14"),
      parentName: "Otabek Normatov",
      parentPhone: "+998901234574",
      balance: 95,
      discountPercent: 3,
    },
  },
  {
    id: 16,
    tenantId: 1,
    roleId: 4,
    phone: "+4444444456",
    firstName: "Abdumalik",
    lastName: "Gofurov",
    isActive: true,
    createdAt: new Date("2024-03-20"),
    role: roles[3],
    studentProfile: {
      userId: 16,
      birthDate: new Date("2006-02-28"),
      parentName: "Bobur Gofurov",
      parentPhone: "+998901234575",
      balance: 140,
      discountPercent: 7,
    },
  },
  {
    id: 17,
    tenantId: 1,
    roleId: 4,
    phone: "+4444444457",
    firstName: "Marjona",
    lastName: "Ahmadjonova",
    isActive: true,
    createdAt: new Date("2024-03-21"),
    role: roles[3],
    studentProfile: {
      userId: 17,
      birthDate: new Date("2005-12-05"),
      parentName: "Sardor Ahmadjonov",
      parentPhone: "+998901234576",
      balance: 85,
      discountPercent: 5,
    },
  },
];

export const groups: Group[] = [
  {
    id: 1,
    tenantId: 1,
    branchId: 1,
    courseLevelId: 1,
    teacherId: 3,
    name: "A1-Morning-01",
    startDate: new Date("2024-02-01"),
    endDate: new Date("2024-05-01"),
    status: "active",
    roomId: 1,
  },
  {
    id: 2,
    tenantId: 1,
    branchId: 1,
    courseLevelId: 2,
    teacherId: 4,
    name: "A2-Evening-01",
    startDate: new Date("2024-02-15"),
    endDate: new Date("2024-05-15"),
    status: "active",
    roomId: 2,
  },
  {
    id: 3,
    tenantId: 1,
    branchId: 2,
    courseLevelId: 3,
    teacherId: 3,
    name: "B1-Business-01",
    startDate: new Date("2024-03-01"),
    status: "recruiting",
    roomId: 3,
  },
];

export const enrollments: Enrollment[] = [
  {
    id: 1,
    studentId: 5,
    groupId: 1,
    joinedAt: new Date("2024-02-01"),
    status: "active",
    contractPrice: 180,
  },
  {
    id: 2,
    studentId: 6,
    groupId: 1,
    joinedAt: new Date("2024-02-01"),
    status: "active",
    contractPrice: 200,
  },
  {
    id: 3,
    studentId: 7,
    groupId: 2,
    joinedAt: new Date("2024-02-15"),
    status: "active",
    contractPrice: 209,
  },
  {
    id: 4,
    studentId: 8,
    groupId: 1,
    joinedAt: new Date("2024-02-01"),
    status: "active",
    contractPrice: 200,
  },
  {
    id: 5,
    studentId: 9,
    groupId: 1,
    joinedAt: new Date("2024-02-01"),
    status: "active",
    contractPrice: 180,
  },
  {
    id: 6,
    studentId: 10,
    groupId: 1,
    joinedAt: new Date("2024-02-01"),
    status: "active",
    contractPrice: 190,
  },
  {
    id: 7,
    studentId: 11,
    groupId: 1,
    joinedAt: new Date("2024-02-01"),
    status: "active",
    contractPrice: 200,
  },
  {
    id: 8,
    studentId: 12,
    groupId: 1,
    joinedAt: new Date("2024-02-01"),
    status: "active",
    contractPrice: 184,
  },
  {
    id: 9,
    studentId: 13,
    groupId: 1,
    joinedAt: new Date("2024-02-01"),
    status: "active",
    contractPrice: 190,
  },
  {
    id: 10,
    studentId: 14,
    groupId: 1,
    joinedAt: new Date("2024-02-01"),
    status: "active",
    contractPrice: 200,
  },
  {
    id: 11,
    studentId: 15,
    groupId: 1,
    joinedAt: new Date("2024-02-01"),
    status: "active",
    contractPrice: 194,
  },
  {
    id: 12,
    studentId: 16,
    groupId: 1,
    joinedAt: new Date("2024-02-01"),
    status: "active",
    contractPrice: 186,
  },
  {
    id: 13,
    studentId: 17,
    groupId: 1,
    joinedAt: new Date("2024-02-01"),
    status: "active",
    contractPrice: 190,
  },
];

export const lessons: Lesson[] = [
  {
    id: 1,
    groupId: 1,
    date: new Date("2024-02-05 10:00"),
    topic: "Introduction to English Alphabet",
    status: "completed",
    teacherId: 3,
  },
  {
    id: 2,
    groupId: 1,
    date: new Date("2024-02-07 10:00"),
    topic: "Basic Greetings",
    status: "completed",
    teacherId: 3,
  },
  {
    id: 3,
    groupId: 1,
    date: new Date("2024-02-12 10:00"),
    topic: "Numbers and Counting",
    status: "planned",
    teacherId: 3,
  },
];

export const attendanceRecords: Attendance[] = [
  { id: 1, lessonId: 1, studentId: 5, status: "present", comment: "" },
  { id: 2, lessonId: 1, studentId: 6, status: "present", comment: "" },
  { id: 3, lessonId: 2, studentId: 5, status: "present", comment: "" },
  { id: 4, lessonId: 2, studentId: 6, status: "absent", comment: "Sick" },
];

export const leads: Lead[] = [
  {
    id: 1,
    tenantId: 1,
    firstName: "Alice Johnson",
    phone: "+5555555551",
    source: "Instagram",
    statusId: 1,
    assignedTo: 2,
    createdAt: new Date("2024-02-08"),
  },
  {
    id: 2,
    tenantId: 1,
    firstName: "Bob Smith",
    phone: "+5555555552",
    source: "Website",
    statusId: 2,
    assignedTo: 2,
    createdAt: new Date("2024-02-09"),
  },
  {
    id: 3,
    tenantId: 1,
    firstName: "Carol White",
    phone: "+5555555553",
    source: "Referral",
    statusId: 4,
    assignedTo: 2,
    createdAt: new Date("2024-02-10"),
  },
];

export const transactions: Transaction[] = [
  {
    id: 1,
    tenantId: 1,
    userId: 5,
    amount: 180,
    type: "income",
    category: "tuition",
    paymentMethod: "cash",
    createdAt: new Date("2024-02-01"),
  },
  {
    id: 2,
    tenantId: 1,
    userId: 6,
    amount: 200,
    type: "income",
    category: "tuition",
    paymentMethod: "card",
    createdAt: new Date("2024-02-01"),
  },
  {
    id: 3,
    tenantId: 1,
    userId: 7,
    amount: 209,
    type: "income",
    category: "tuition",
    paymentMethod: "bank_transfer",
    createdAt: new Date("2024-02-15"),
  },
  {
    id: 4,
    tenantId: 1,
    userId: 3,
    amount: 1200,
    type: "expense",
    category: "salary",
    paymentMethod: "bank_transfer",
    createdAt: new Date("2024-02-28"),
  },
];

// Helper functions to get related data
export const getTenantById = (id: number) => tenants.find((t) => t.id === id);
export const getUsersByTenantId = (tenantId: number) => users.filter((u) => u.tenantId === tenantId);
export const getStudentsByTenantId = (tenantId: number) =>
  users.filter((u) => u.tenantId === tenantId && u.roleId === 4);
export const getTeachersByTenantId = (tenantId: number) =>
  users.filter((u) => u.tenantId === tenantId && u.roleId === 3);
export const getGroupsByTenantId = (tenantId: number) => groups.filter((g) => g.tenantId === tenantId);
export const getLeadsByTenantId = (tenantId: number) => leads.filter((l) => l.tenantId === tenantId);
export const getTransactionsByTenantId = (tenantId: number) => transactions.filter((t) => t.tenantId === tenantId);
export const getEnrollmentsByStudentId = (studentId: number) => enrollments.filter((e) => e.studentId === studentId);
export const getGroupsByTeacherId = (teacherId: number) => groups.filter((g) => g.teacherId === teacherId);
export const getLessonsByGroupId = (groupId: number) => lessons.filter((l) => l.groupId === groupId);