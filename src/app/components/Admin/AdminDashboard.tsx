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
} from "lucide-react";
import { toast } from "sonner";
import { authUtils } from "../../utils/auth";
import DashboardLayout from "../shared/DashboardLayout";
import ProfilePage from "../shared/ProfilePage";
import NotificationsPage from "../shared/NotificationsPage";
import AdminOverview from "./AdminOverview";
import BranchesPage from "./BranchesPage";
import CoursesPage from "./CoursesPage";
import GroupsPage from "./GroupsPage";
import StudentsPage from "./StudentsPage";
import TeachersPage from "./TeachersPage";
import LeadsPage from "./LeadsPage";
import TransactionsPage from "./TransactionsPage";

type Page = "overview" | "branches" | "courses" | "groups" | "students" | "teachers" | "leads" | "transactions" | "profile" | "notifications";

export default function AdminDashboard() {
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
              firstName: "Admin",
              lastName: "User",
              phone: "+998 90 345 67 89",
              email: "admin@education.uz",
              role: "Admin",
              createdAt: "20.02.2024",
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
      userName="Admin User"
      userRole="Administrator"
      notificationCount={4}
      sidebarColor="bg-blue-900"
      onLogout={handleLogout}
      onNavigateToProfile={handleNavigateToProfile}
      onNavigateToNotifications={handleNavigateToNotifications}
      logoUrl={undefined}
    >
      {renderPage()}
    </DashboardLayout>
  );
}