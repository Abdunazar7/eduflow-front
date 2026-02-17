import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { BookOpen, Calendar, CheckSquare, ClipboardList, DollarSign, LayoutDashboard, Users, UserCheck } from "lucide-react";
import { toast } from "sonner";
import { authUtils } from "../../utils/auth";
import DashboardLayout from "../shared/DashboardLayout";
import ProfilePage from "../shared/ProfilePage";
import NotificationsPage from "../shared/NotificationsPage";
import TeacherOverview from "./TeacherOverview";
import MyGroupsPage from "./MyGroupsPage";
import LessonsPage from "./LessonsPage";
import AttendancePage from "./AttendancePage";
import HomeworkPage from "./HomeworkPage";
import SettlementsPage from "./SettlementsPage";
import StudentsPage from "./StudentsPage";

type Page = "overview" | "groups" | "students" | "lessons" | "attendance" | "homework" | "settlements" | "profile" | "notifications";

export default function TeacherDashboard() {
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
    { id: "groups", name: "My Groups", icon: Users },
    { id: "students", name: "Students", icon: UserCheck },
    { id: "lessons", name: "Lessons", icon: BookOpen },
    { id: "attendance", name: "Attendance", icon: CheckSquare },
    { id: "homework", name: "Homework", icon: ClipboardList },
    { id: "settlements", name: "Salary", icon: DollarSign },
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
    const teacherId = currentUser.userId;
    
    switch (currentPage) {
      case "overview":
        return <TeacherOverview teacherId={teacherId} />;
      case "groups":
        return <MyGroupsPage teacherId={teacherId} />;
      case "students":
        return <StudentsPage teacherId={teacherId} />;
      case "lessons":
        return <LessonsPage teacherId={teacherId} />;
      case "attendance":
        return <AttendancePage teacherId={teacherId} />;
      case "homework":
        return <HomeworkPage teacherId={teacherId} />;
      case "settlements":
        return <SettlementsPage teacherId={teacherId} />;
      case "profile":
        return (
          <ProfilePage
            profileData={{
              firstName: "Aziza",
              lastName: "Karimova",
              phone: "+998 90 456 78 90",
              email: "aziza.teacher@education.uz",
              role: "Teacher",
              createdAt: "10.03.2024",
              stats: [
                { label: "Mening Guruhlarim", value: "5" },
                { label: "Jami O'quvchilar", value: "78" },
                { label: "Oylik Maosh", value: "5,500,000 UZS" },
              ],
            }}
            onUpdateProfile={handleUpdateProfile}
            onChangePassword={handleChangePassword}
          />
        );
      case "notifications":
        return <NotificationsPage />;
      default:
        return <TeacherOverview teacherId={teacherId} />;
    }
  };

  return (
    <DashboardLayout
      currentPage={currentPage}
      setCurrentPage={setCurrentPage}
      navigation={navigation}
      userName="Aziza Karimova"
      userRole="Teacher"
      notificationCount={6}
      sidebarColor="bg-green-900"
      onLogout={handleLogout}
      onNavigateToProfile={handleNavigateToProfile}
      onNavigateToNotifications={handleNavigateToNotifications}
      logoUrl={undefined}
    >
      {renderPage()}
    </DashboardLayout>
  );
}