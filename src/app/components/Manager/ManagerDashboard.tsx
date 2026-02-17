import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import {
  BookOpen,
  Building2,
  DollarSign,
  GraduationCap,
  LayoutDashboard,
  UserPlus,
  Users,
  Shield,
  UserCog,
} from "lucide-react";
import { toast } from "sonner";
import { authUtils } from "../../utils/auth";
import DashboardLayout from "../shared/DashboardLayout";
import ProfilePage from "../shared/ProfilePage";
import NotificationsPage from "../shared/NotificationsPage";
import AdminOverview from "../Admin/AdminOverview";
import BranchesPage from "../Admin/BranchesPage";
import CoursesPage from "../Admin/CoursesPage";
import GroupsPage from "../Admin/GroupsPage";
import StudentsPage from "../Admin/StudentsPage";
import TeachersPage from "../Admin/TeachersPage";
import LeadsPage from "../Admin/LeadsPage";
import TransactionsPage from "../Admin/TransactionsPage";
import AdminsPage from "./AdminsPage";
import StaffPage from "./StaffPage";

type Page = "overview" | "admins" | "staff" | "branches" | "courses" | "groups" | "students" | "teachers" | "leads" | "transactions" | "profile" | "notifications";

export default function ManagerDashboard() {
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState<Page>("overview");
  const currentUser = authUtils.getCurrentUser();

  useEffect(() => {
    if (!currentUser) {
      navigate("/login");
    }
  }, [currentUser, navigate]);

  if (!currentUser) {
    return null;
  }

  const navigation = [
    { id: "overview", name: "Dashboard", icon: LayoutDashboard },
    { id: "admins", name: "Admins", icon: Shield },
    { id: "staff", name: "Staff", icon: UserCog },
    { id: "branches", name: "Branches", icon: Building2 },
    { id: "courses", name: "Courses", icon: BookOpen },
    { id: "groups", name: "Groups", icon: Users },
    { id: "students", name: "Students", icon: GraduationCap },
    { id: "teachers", name: "Teachers", icon: Users },
    { id: "leads", name: "Leads (CRM)", icon: UserPlus },
    { id: "transactions", name: "Transactions", icon: DollarSign },
  ];

  const handleLogout = () => {
    authUtils.removeToken();
    toast.success("Tizimdan muvaffaqiyatli chiqdingiz");
    navigate("/login");
  };

  const handleNavigateToProfile = () => {
    setCurrentPage("profile");
  };

  const handleNavigateToNotifications = () => {
    setCurrentPage("notifications");
  };

  const handleUpdateProfile = (data: any) => {
    console.log("Updating profile:", data);
  };

  const handleChangePassword = (oldPassword: string, newPassword: string) => {
    console.log("Changing password");
  };

  const renderPage = () => {
    const tenantId = currentUser.tenantId || 1;
    
    switch (currentPage) {
      case "overview":
        return <AdminOverview tenantId={tenantId} />;
      case "admins":
        return <AdminsPage tenantId={tenantId} />;
      case "staff":
        return <StaffPage tenantId={tenantId} />;
      case "branches":
        return <BranchesPage tenantId={tenantId} />;
      case "courses":
        return <CoursesPage tenantId={tenantId} />;
      case "groups":
        return <GroupsPage tenantId={tenantId} />;
      case "students":
        return <StudentsPage tenantId={tenantId} />;
      case "teachers":
        return <TeachersPage tenantId={tenantId} />;
      case "leads":
        return <LeadsPage tenantId={tenantId} />;
      case "transactions":
        return <TransactionsPage tenantId={tenantId} />;
      case "profile":
        return (
          <ProfilePage
            profileData={{
              firstName: "Manager",
              lastName: "User",
              phone: "+998 90 234 56 78",
              email: "manager@education.uz",
              role: "Manager",
              createdAt: "15.02.2024",
              stats: [
                { label: "Jami O'quvchilar", value: "345" },
                { label: "Faol Guruhlar", value: "28" },
                { label: "O'qituvchilar", value: "24" },
              ],
            }}
            onUpdateProfile={handleUpdateProfile}
            onChangePassword={handleChangePassword}
          />
        );
      case "notifications":
        return <NotificationsPage />;
      default:
        return <AdminOverview tenantId={tenantId} />;
    }
  };

  return (
    <DashboardLayout
      currentPage={currentPage}
      setCurrentPage={setCurrentPage}
      navigation={navigation}
      userName="Manager User"
      userRole="Manager"
      notificationCount={5}
      sidebarColor="bg-indigo-900"
      onLogout={handleLogout}
      onNavigateToProfile={handleNavigateToProfile}
      onNavigateToNotifications={handleNavigateToNotifications}
      logoUrl={undefined}
    >
      {renderPage()}
    </DashboardLayout>
  );
}