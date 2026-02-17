import { createBrowserRouter, Navigate } from 'react-router';
import LoginPage from './components/LoginPage';
import ForgotPasswordPage from './components/ForgotPasswordPage';
import SuperAdminDashboard from './components/SuperAdmin/SuperAdminDashboard';
import ManagerDashboard from './components/Manager/ManagerDashboard';
import AdminDashboard from './components/Admin/AdminDashboard';
import TeacherDashboard from './components/Teacher/TeacherDashboard';
import StudentDashboard from './components/Student/StudentDashboard';
import { authUtils, UserRole } from './utils/auth';

// Protected Route wrapper component
const ProtectedRoute = ({ 
  element, 
  allowedRoles 
}: { 
  element: JSX.Element; 
  allowedRoles: UserRole[] 
}) => {
  const currentUser = authUtils.getCurrentUser();
  
  if (!currentUser) {
    return <Navigate to="/login" replace />;
  }

  if (!allowedRoles.includes(currentUser.role)) {
    // Redirect to their appropriate dashboard
    return <Navigate to={authUtils.getRoleRedirectPath(currentUser.role)} replace />;
  }

  return element;
};

// Root redirect based on auth status
const RootRedirect = () => {
  const currentUser = authUtils.getCurrentUser();
  
  if (!currentUser) {
    return <Navigate to="/login" replace />;
  }

  return <Navigate to={authUtils.getRoleRedirectPath(currentUser.role)} replace />;
};

export const router = createBrowserRouter([
  {
    path: '/',
    element: <RootRedirect />
  },
  {
    path: '/login',
    element: <LoginPage />
  },
  {
    path: '/forgot-password',
    element: <ForgotPasswordPage />
  },
  {
    path: '/super-admin/*',
    element: (
      <ProtectedRoute 
        element={<SuperAdminDashboard />} 
        allowedRoles={[UserRole.PLATFORM_ADMIN]} 
      />
    )
  },
  {
    path: '/manager/*',
    element: (
      <ProtectedRoute 
        element={<ManagerDashboard />} 
        allowedRoles={[UserRole.MANAGER]} 
      />
    )
  },
  {
    path: '/admin/*',
    element: (
      <ProtectedRoute 
        element={<AdminDashboard />} 
        allowedRoles={[UserRole.ADMIN]} 
      />
    )
  },
  {
    path: '/teacher/*',
    element: (
      <ProtectedRoute 
        element={<TeacherDashboard />} 
        allowedRoles={[UserRole.TEACHER]} 
      />
    )
  },
  {
    path: '/student/*',
    element: (
      <ProtectedRoute 
        element={<StudentDashboard />} 
        allowedRoles={[UserRole.STUDENT]} 
      />
    )
  },
  {
    path: '*',
    element: <Navigate to="/" replace />
  }
]);