import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import {
  Building2,
  CreditCard,
  LayoutDashboard,
  TrendingUp,
  UserCog,
  DollarSign,
  Package,
} from "lucide-react";
import { toast } from "sonner";
import { authUtils } from "../../utils/auth";
import DashboardLayout from "../shared/DashboardLayout";
import ProfilePage from "../shared/ProfilePage";
import NotificationsPage from "../shared/NotificationsPage";
import SuperAdminOverview from "./SuperAdminOverview";
import TenantsPage from "./TenantsPage";
import SubscriptionsPage from "./SubscriptionsPage";
import RevenueAnalytics from "./RevenueAnalytics";
import ManagersPage from "./ManagersPage";
import TenantPaymentsPage from "./TenantPaymentsPage";
import PlansPage from "./PlansPage";

type Page = "overview" | "tenants" | "managers" | "plans" | "subscriptions" | "revenue" | "payments" | "profile" | "notifications";

export default function SuperAdminDashboard() {
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
    { id: "overview", name: "Overview", icon: LayoutDashboard },
    { id: "tenants", name: "Tenants", icon: Building2 },
    { id: "managers", name: "Managers", icon: UserCog },
    { id: "plans", name: "Plans", icon: Package },
    { id: "subscriptions", name: "Subscriptions", icon: CreditCard },
    { id: "payments", name: "Tenant Payments", icon: DollarSign },
    { id: "revenue", name: "Revenue Analytics", icon: TrendingUp },
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
    // In real app, this would make an API call
    console.log("Updating profile:", data);
  };

  const handleChangePassword = (oldPassword: string, newPassword: string) => {
    // In real app, this would make an API call
    console.log("Changing password");
  };

  const renderPage = () => {
    switch (currentPage) {
      case "overview":
        return <SuperAdminOverview />;
      case "tenants":
        return <TenantsPage />;
      case "managers":
        return <ManagersPage />;
      case "plans":
        return <PlansPage />;
      case "subscriptions":
        return <SubscriptionsPage />;
      case "payments":
        return <TenantPaymentsPage />;
      case "revenue":
        return <RevenueAnalytics />;
      case "profile":
        return (
          <ProfilePage
            profileData={{
              firstName: "Platform",
              lastName: "Admin",
              phone: "+998 90 123 45 67",
              email: "admin@platform.uz",
              role: "Platform Admin",
              createdAt: "01.01.2024",
              stats: [
                { label: "Jami Tenantlar", value: "24" },
                { label: "Faol Obunalar", value: "18" },
                { label: "Oylik Daromad", value: "$12,450" },
              ],
            }}
            onUpdateProfile={handleUpdateProfile}
            onChangePassword={handleChangePassword}
          />
        );
      case "notifications":
        return <NotificationsPage />;
      default:
        return <SuperAdminOverview />;
    }
  };

  return (
    <DashboardLayout
      currentPage={currentPage}
      setCurrentPage={setCurrentPage}
      navigation={navigation}
      userName="Platform Admin"
      userRole="Super Admin"
      notificationCount={3}
      sidebarColor="bg-purple-900"
      onLogout={handleLogout}
      onNavigateToProfile={handleNavigateToProfile}
      onNavigateToNotifications={handleNavigateToNotifications}
      logoUrl={undefined} // Will be fetched from backend
    >
      {renderPage()}
    </DashboardLayout>
  );
}