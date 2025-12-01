import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { LoginScreen } from './components/auth/LoginScreen';
import { RegisterScreen } from './components/auth/RegisterScreen';
import { RegisterSelectionScreen } from './components/auth/RegisterSelectionScreen';
import { RegisterSimpleScreen } from './components/auth/RegisterSimpleScreen';
import { RegisterMemberScreen } from './components/auth/RegisterMemberScreen';
import { RoleGuard } from './components/auth/RoleGuard';
import { Dashboard } from './components/dashboard/Dashboard';
import { DashboardPage } from './pages/dashboard/DashboardPage';
import { MembersPage } from './pages/members/MembersPage';
import { EventsPage } from './pages/events/EventsPage';
import { FinancePage } from './pages/finance/FinancePage';
import { InventoryPage } from './pages/inventory/InventoryPage';
import { UnitsPage } from './pages/units/UnitsPage';
import { ProgressPage } from './pages/progress/ProgressPage';
import { UsersPage } from './pages/users/UsersPage';
import { MemberDashboard } from './pages/member/MemberDashboard';
import { LoadingOverlay } from './components/ui/LoadingSpinner';
import { isAdmin } from './utils/roles';
import './App.css';

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return <LoadingOverlay message="Carregando..." />;
  }

  if (isAuthenticated) {
    console.log('🛡️ ProtectedRoute: autenticado, renderizando children');
    return <>{children}</>;
  }
  console.warn('🛡️ ProtectedRoute: não autenticado, redirecionando para /login');
  return <Navigate to="/login" replace />;
};

const AppContent: React.FC = () => {
  const { isAuthenticated, user } = useAuth();
  
  // Determine if user is admin or normal member
  const userIsAdmin = user ? isAdmin(user.role) : false;

  return (
    <Routes>
      <Route path="/login" element={isAuthenticated ? <Navigate to="/" replace /> : <LoginScreen />} />
      
      {/* Rotas de Registro */}
      <Route path="/register" element={isAuthenticated ? <Navigate to="/" replace /> : <RegisterSelectionScreen />} />
      <Route path="/register/simple" element={isAuthenticated ? <Navigate to="/" replace /> : <RegisterSimpleScreen />} />
      <Route path="/register/member" element={isAuthenticated ? <Navigate to="/" replace /> : <RegisterMemberScreen />} />
      <Route path="/register/legacy" element={isAuthenticated ? <Navigate to="/" replace /> : <RegisterScreen />} />
      
      {/* Admin Routes */}
      <Route path="/" element={<ProtectedRoute>{userIsAdmin ? <DashboardPage /> : <MemberDashboard />}</ProtectedRoute>} />
      <Route path="/dashboard-old" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
      <Route path="/members" element={<ProtectedRoute><MembersPage /></ProtectedRoute>} />
      <Route path="/events" element={<ProtectedRoute><EventsPage /></ProtectedRoute>} />
      <Route
        path="/finance"
        element={
          <ProtectedRoute>
            <RoleGuard allowedRoles={["ADMIN", "DIRECTOR"]}>
              <FinancePage />
            </RoleGuard>
          </ProtectedRoute>
        }
      />
      <Route
        path="/inventory"
        element={
          <ProtectedRoute>
            <RoleGuard allowedRoles={["ADMIN", "DIRECTOR"]}>
              <InventoryPage />
            </RoleGuard>
          </ProtectedRoute>
        }
      />
      <Route
        path="/units"
        element={
          <ProtectedRoute>
            <RoleGuard allowedRoles={["ADMIN", "DIRECTOR"]}>
              <UnitsPage />
            </RoleGuard>
          </ProtectedRoute>
        }
      />
      <Route
        path="/users"
        element={
          <ProtectedRoute>
            <RoleGuard allowedRoles={["ADMIN", "DIRECTOR"]}>
              <UsersPage />
            </RoleGuard>
          </ProtectedRoute>
        }
      />
      <Route path="/progress" element={<ProtectedRoute><ProgressPage /></ProtectedRoute>} />
      
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </BrowserRouter>
  );
};

export default App;
