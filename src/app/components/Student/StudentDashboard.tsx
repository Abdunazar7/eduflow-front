import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { BookOpen, Calendar, CheckSquare, ClipboardList, DollarSign, LayoutDashboard, User } from "lucide-react";
import { toast } from "sonner";
import { authUtils } from "../../utils/auth";
import DashboardLayout from "../shared/DashboardLayout";
import ProfilePage from "../shared/ProfilePage";
import NotificationsPage from "../shared/NotificationsPage";
import StudentOverview from "./StudentOverview";
import MyCoursesPage from "./MyCoursesPage";
import SchedulePage from "./SchedulePage";
import MyAttendancePage from "./MyAttendancePage";
import MyHomeworkPage from "./MyHomeworkPage";
import PaymentsPage from "./PaymentsPage";

type Page = "overview" | "courses" | "schedule" | "attendance" | "homework" | "payments" | "profile" | "notifications";

export default function StudentDashboard() {
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
    { id: "courses", name: "My Courses", icon: BookOpen },
    { id: "schedule", name: "Schedule", icon: Calendar },
    { id: "attendance", name: "Attendance", icon: CheckSquare },
    { id: "homework", name: "Homework", icon: ClipboardList },
    { id: "payments", name: "Payments", icon: DollarSign },
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
    const studentId = currentUser.userId;
    
    switch (currentPage) {
      case "overview":
        return <StudentOverview studentId={studentId} />;
      case "courses":
        return <MyCoursesPage studentId={studentId} />;
      case "schedule":
        return <SchedulePage studentId={studentId} />;
      case "attendance":
        return <MyAttendancePage studentId={studentId} />;
      case "homework":
        return <MyHomeworkPage studentId={studentId} />;
      case "payments":
        return <PaymentsPage studentId={studentId} />;
      case "profile":
        return (
          <ProfilePage
            profileData={{
              firstName: "Jasur",
              lastName: "Aliyev",
              phone: "+998 90 567 89 01",
              email: "jasur.student@education.uz",
              role: "Student",
              createdAt: "05.04.2024",
              stats: [
                { label: "Kurslarim", value: "3" },
                { label: "Davomat", value: "92%" },
                { label: "Balans", value: "250,000 UZS" },
              ],
            }}
            onUpdateProfile={handleUpdateProfile}
            onChangePassword={handleChangePassword}
          />
        );
      case "notifications":
        return <NotificationsPage />;
      default:
        return <StudentOverview studentId={studentId} />;
    }
  };

  return (
    <DashboardLayout
      currentPage={currentPage}
      setCurrentPage={setCurrentPage}
      navigation={navigation}
      userName="Jasur Aliyev"
      userRole="Student"
      notificationCount={2}
      sidebarColor="bg-orange-900"
      onLogout={handleLogout}
      onNavigateToProfile={handleNavigateToProfile}
      onNavigateToNotifications={handleNavigateToNotifications}
      logoUrl={undefined}
    >
      {renderPage()}
    </DashboardLayout>
  );
}