# Language Learning Management System (LMS) & CRM

A comprehensive SaaS platform for managing language educational centers with multi-tenant architecture.

## 🎯 Overview

This is a full-featured LMS/CRM system designed specifically for language schools and educational centers. The platform supports multi-tenant architecture where each educational center can manage their operations independently.

## 🏗️ Architecture

### Database Schema (Prisma)
The application is built based on a comprehensive Prisma schema that includes:

- **Multi-tenancy**: Tenant-based isolation for each educational center
- **User Management**: Role-based access control (Super Admin, Admin, Teacher, Student, Staff)
- **Academic Management**: Courses, Levels, Groups, Lessons, Attendance, Homework
- **CRM**: Lead management with customizable statuses and pipeline tracking
- **Financial**: Transactions, Teacher Settlements, Student Balances
- **Infrastructure**: Branches, Rooms, Group Schedules
- **Subscriptions**: SaaS subscription plans and billing

## 📊 Four Role-Based Dashboards

### 1. Super Admin Dashboard (Purple Theme)
**For**: SaaS Platform Owners

**Features**:
- **Overview**: System-wide analytics, revenue trends, tenant distribution
- **Tenants Management**: View all educational centers, subscription status
- **Subscriptions**: Manage pricing plans, track active subscriptions
- **Revenue Analytics**: MRR tracking, ARR projections, churn analysis, revenue distribution

**Key Metrics**:
- Total active tenants
- Monthly recurring revenue (MRR)
- Growth rates
- Plan distribution

---

### 2. Admin Dashboard (Blue Theme)
**For**: Educational Center Managers/Owners

**Features**:
- **Dashboard**: Student growth, revenue trends, lead pipeline, alerts
- **Branches**: Manage physical locations and rooms
- **Courses & Levels**: Create and organize educational programs
- **Groups**: Manage classes, schedules, and teacher assignments
- **Students**: Student profiles, balances, discounts, enrollment tracking
- **Teachers**: Staff management, salary tracking, group assignments
- **Leads (CRM)**: Lead pipeline, status tracking, source attribution
- **Transactions**: Income/expense tracking, financial reports

**Key Metrics**:
- Total students and teachers
- Active groups
- Revenue and expenses
- Lead conversion funnel

---

### 3. Teacher Dashboard (Green Theme)
**For**: Teaching Staff

**Features**:
- **Overview**: Assigned groups, student count, lesson statistics
- **My Groups**: View all assigned classes with student lists
- **Lessons**: Plan and track lesson topics and schedules
- **Attendance**: Record and view student attendance
- **Homework**: Create assignments, track submissions, grade work
- **Salary**: View salary structure, payment history, settlements

**Key Metrics**:
- Number of groups teaching
- Total students
- Completed vs upcoming lessons
- Salary information

---

### 4. Student Dashboard (Orange Theme)
**For**: Students and Parents

**Features**:
- **Overview**: Enrolled courses, attendance rate, balance, upcoming classes
- **My Courses**: View enrolled programs with progress tracking
- **Schedule**: Weekly calendar, upcoming and past lessons
- **Attendance**: Personal attendance history and statistics
- **Homework**: View assignments, submit work, check grades
- **Payments**: Account balance, payment history, make payments

**Key Metrics**:
- Courses enrolled
- Attendance percentage
- Account balance
- Average homework scores

## 🎨 Design System

- **Color Themes**:
  - Super Admin: Purple (`purple-900`, `purple-600`)
  - Admin: Blue (`blue-900`, `blue-600`)
  - Teacher: Green (`green-900`, `green-600`)
  - Student: Orange (`orange-900`, `orange-600`)

- **Components**: Built with Radix UI and Tailwind CSS
- **Charts**: Recharts for data visualization
- **Icons**: Lucide React

## 📁 Project Structure

```
/src/app/
├── data/
│   └── mockData.ts              # Mock database with Prisma schema structure
├── components/
│   ├── LoginPage.tsx            # Role selection and authentication
│   ├── SuperAdmin/              # Super Admin dashboard pages
│   │   ├── SuperAdminDashboard.tsx
│   │   ├── SuperAdminOverview.tsx
│   │   ├── TenantsPage.tsx
│   │   ├── SubscriptionsPage.tsx
│   │   └── RevenueAnalytics.tsx
│   ├── Admin/                   # Admin dashboard pages
│   │   ├── AdminDashboard.tsx
│   │   ├── AdminOverview.tsx
│   │   ├── BranchesPage.tsx
│   │   ├── CoursesPage.tsx
│   │   ├── GroupsPage.tsx
│   │   ├── StudentsPage.tsx
│   │   ├── TeachersPage.tsx
│   │   ├── LeadsPage.tsx
│   │   └── TransactionsPage.tsx
│   ├── Teacher/                 # Teacher dashboard pages
│   │   ├── TeacherDashboard.tsx
│   │   ├── TeacherOverview.tsx
│   │   ├── MyGroupsPage.tsx
│   │   ├── LessonsPage.tsx
│   │   ├── AttendancePage.tsx
│   │   ├── HomeworkPage.tsx
│   │   └── SettlementsPage.tsx
│   └── Student/                 # Student dashboard pages
│       ├── StudentDashboard.tsx
│       ├── StudentOverview.tsx
│       ├── MyCoursesPage.tsx
│       ├── SchedulePage.tsx
│       ├── MyAttendancePage.tsx
│       ├── MyHomeworkPage.tsx
│       └── PaymentsPage.tsx
└── App.tsx                      # Main app with routing logic
```

## 🔑 Key Features

### Multi-Tenant Architecture
- Each educational center operates independently
- Isolated data per tenant
- Subscription-based billing

### Academic Management
- Course and level organization
- Group/class scheduling
- Attendance tracking
- Homework and grading system

### CRM System
- Lead capture and tracking
- Customizable pipeline stages
- Source attribution
- Assignment to staff members

### Financial Management
- Student balance tracking
- Payment processing
- Teacher salary calculations
- Revenue/expense reporting

### User Roles & Permissions
- Super Admin: Platform management
- Admin: Center management
- Teacher: Teaching operations
- Student: Learning tracking
- Staff: Administrative support

## 📊 Data Relationships

The mock data demonstrates all key Prisma schema relationships:

- **Tenant** → Users, Branches, Courses, Groups, Leads, Transactions
- **User** → Role, Student/Teacher/Staff Profiles
- **Course** → Levels → Groups
- **Group** → Enrollments, Lessons, Schedules
- **Lesson** → Attendance, Homework
- **Lead** → Status, Assigned User
- **Transaction** → User, Creator

## 🚀 Getting Started

1. Click on a role card on the login page
2. Explore the dashboard and all available pages
3. All data is simulated based on the Prisma schema structure

## 💡 Demo Features

- **Live Charts**: Revenue trends, growth metrics, attendance rates
- **Interactive Tables**: Sortable data with actions
- **Status Badges**: Visual indicators for states (active, pending, completed)
- **Progress Bars**: Visual progress tracking
- **Cards & Metrics**: KPI displays across all dashboards
- **Responsive Design**: Works on desktop and tablet devices

## 🎓 Educational Use Cases

- Language schools
- Test preparation centers (IELTS, TOEFL, etc.)
- Corporate language training
- Private tutoring businesses
- Online language academies

---

Built with React, TypeScript, Tailwind CSS, Radix UI, and Recharts
