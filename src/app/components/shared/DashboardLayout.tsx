import { useState, useEffect, ReactNode } from "react";
import { useNavigate } from "react-router";
import { Button } from "../ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Badge } from "../ui/badge";
import {
  Bell,
  ChevronLeft,
  ChevronRight,
  Moon,
  Sun,
} from "lucide-react";
import { toast } from "sonner";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "../ui/alert-dialog";

interface NavigationItem {
  id: string;
  name: string;
  icon: React.ComponentType<{ className?: string }>;
}

interface DashboardLayoutProps {
  children: ReactNode;
  currentPage: string;
  setCurrentPage: (page: string) => void;
  navigation: NavigationItem[];
  userName: string;
  userRole: string;
  userPhoto?: string;
  notificationCount?: number;
  sidebarColor?: string;
  onLogout: () => void;
  onNavigateToProfile: () => void;
  onNavigateToNotifications: () => void;
  logoUrl?: string;
}

export default function DashboardLayout({
  currentPage,
  setCurrentPage,
  navigation,
  userName,
  userRole,
  userPhoto,
  children,
  notificationCount,
  sidebarColor = "bg-gradient-to-b from-indigo-700 to-indigo-900",
  onNavigateToProfile,
  onNavigateToNotifications,
  onLogout,
  logoUrl,
}: DashboardLayoutProps) {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [showLogoutDialog, setShowLogoutDialog] = useState(false);

  useEffect(() => {
    // Check if dark mode is enabled
    const isDark = document.documentElement.classList.contains("dark");
    setIsDarkMode(isDark);
  }, []);

  const showSidebarContent = !isSidebarCollapsed;

  const handleLogoutClick = () => {
    setShowLogoutDialog(true);
  };

  const confirmLogout = () => {
    setShowLogoutDialog(false);
    onLogout();
  };

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
    document.documentElement.classList.toggle("dark");
    toast.success(isDarkMode ? "Kunduzgi rejim yoqildi" : "Tungi rejim yoqildi");
  };

  return (
    <div className={`flex h-screen bg-gray-50 dark:bg-gray-950`}>
      {/* Sidebar */}
      <aside
        className={`${sidebarColor} dark:bg-gradient-to-b dark:from-gray-900 dark:to-gray-800 text-white flex flex-col transition-all duration-300 relative shadow-2xl ${ isSidebarCollapsed ? "w-20" : "w-64"
        }`}
      >
        {/* Toggle Button */}
        <Button
          onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
          variant="ghost"
          size="icon"
          className="absolute -right-3 top-6 z-50 size-6 rounded-full bg-white dark:bg-gray-800 text-indigo-600 dark:text-indigo-400 hover:bg-gray-100 dark:hover:bg-gray-700 shadow-lg border border-gray-200 dark:border-gray-700"
        >
          {isSidebarCollapsed ? (
            <ChevronRight className="size-4" />
          ) : (
            <ChevronLeft className="size-4" />
          )}
        </Button>

        {/* Logo */}
        <div className="p-6 border-b border-white/10 dark:border-gray-700/50">
          {showSidebarContent ? (
            <div className="flex items-center gap-3">
              {logoUrl ? (
                <img src={logoUrl} alt="Logo" className="size-10 rounded-lg" />
              ) : (
                <div className="size-10 rounded-lg bg-white/10 dark:bg-gray-700/50 flex items-center justify-center backdrop-blur-sm">
                  <span className="text-xl">📚</span>
                </div>
              )}
              <div>
                <h1 className="text-lg font-semibold mb-0.5">{userRole}</h1>
                <p className="text-xs text-white/70 dark:text-gray-400">Dashboard</p>
              </div>
            </div>
          ) : (
            <div className="flex justify-center">
              {logoUrl ? (
                <img src={logoUrl} alt="Logo" className="size-8 rounded-lg" />
              ) : (
                <div className="size-8 rounded-lg bg-white/10 dark:bg-gray-700/50 flex items-center justify-center backdrop-blur-sm">
                  <span className="text-lg">📚</span>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 py-4 overflow-y-auto">
          {navigation.map((item) => {
            const Icon = item.icon;
            const isActive = currentPage === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setCurrentPage(item.id)}
                className={`w-full flex items-center gap-3 px-3 py-3 rounded-lg mb-1 transition-all ${ isActive
                    ? "bg-white/20 dark:bg-gray-700/50 text-white shadow-lg scale-105"
                    : "text-white/70 dark:text-gray-400 bg-transparent text-white"
                } ${!showSidebarContent ? "justify-center" : ""}`}
                title={!showSidebarContent ? item.name : undefined}
              >
                <Icon className="size-5 flex-shrink-0" />
                {showSidebarContent && <span className="font-medium">{item.name}</span>}
              </button>
            );
          })}
        </nav>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden bg-gray-50 dark:bg-gray-950 transition-colors duration-300">
        {/* Top Navbar */}
        <div className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 px-6 py-4 shadow-sm transition-colors duration-300">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
                {navigation.find((item) => item.id === currentPage)?.name || "Dashboard"}
              </h2>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
                Xush kelibsiz, {userName}
              </p>
            </div>

            <div className="flex items-center gap-3">
              {/* Dark Mode Toggle */}
              <Button
                variant="ghost"
                size="icon"
                onClick={toggleDarkMode}
                className="text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full"
              >
                {isDarkMode ? (
                  <Sun className="size-5 text-amber-500" />
                ) : (
                  <Moon className="size-5" />
                )}
              </Button>

              {/* Notifications */}
              <Button
                variant="ghost"
                size="icon"
                onClick={onNavigateToNotifications}
                className="relative text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full"
              >
                <Bell className="size-5" />
                {notificationCount > 0 && (
                  <Badge className="absolute -top-1 -right-1 size-5 flex items-center justify-center p-0 bg-red-500 text-white text-xs">
                    {notificationCount > 9 ? "9+" : notificationCount}
                  </Badge>
                )}
              </Button>

              {/* User Profile */}
              <Button 
                variant="ghost" 
                onClick={onNavigateToProfile}
                className="flex items-center gap-3 px-3 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg"
              >
                <Avatar className="size-9">
                  <AvatarImage src={userPhoto} />
                  <AvatarFallback className="bg-gradient-to-br from-indigo-500 to-purple-600 text-white font-semibold">
                    {userName.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="text-left hidden md:block">
                  <p className="text-sm font-medium text-gray-900 dark:text-white">{userName}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">{userRole}</p>
                </div>
              </Button>
            </div>
          </div>
        </div>

        {/* Page Content */}
        <div className="flex-1 overflow-auto">
          {children}
        </div>
      </div>

      {/* Logout Confirmation Dialog */}
      <AlertDialog open={showLogoutDialog} onOpenChange={setShowLogoutDialog}>
        <AlertDialogContent className="dark:bg-gray-900 dark:border-gray-800">
          <AlertDialogHeader>
            <AlertDialogTitle className="dark:text-white">Tizimdan chiqmoqchimisiz?</AlertDialogTitle>
            <AlertDialogDescription className="dark:text-gray-400">
              Tizimdan chiqqaningizdan so'ng qayta kirish uchun login qilishingiz kerak bo'ladi.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700 dark:border-gray-700">
              Yo'q
            </AlertDialogCancel>
            <AlertDialogAction 
              onClick={confirmLogout}
              className="bg-red-600 hover:bg-red-700 dark:bg-red-600 dark:hover:bg-red-700"
            >
              Ha, chiqish
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}