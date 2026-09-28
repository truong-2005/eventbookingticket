import React, { Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/common/ProtectedRoute';
import Loading from './components/common/Loading';
import { ROUTES } from './constants/routes';
import { Toaster } from 'react-hot-toast';

// ─── Layouts ─────────────────────────────────────────────────────────────────
import ClientLayout from './layouts/ClientLayout';
import AdminLayout from './layouts/AdminLayout';
import StaffLayout from './layouts/StaffLayout';

// ─── Client Auth Pages ────────────────────────────────────────────────────────
const ClientLoginPage = lazy(() => import('./pages/client/auth/LoginPage'));
const ClientRegisterPage = lazy(() => import('./pages/client/auth/RegisterPage'));
const ClientForgotPasswordPage = lazy(() => import('./pages/client/auth/ForgotPasswordPage'));
const ClientResetPasswordPage = lazy(() => import('./pages/client/auth/ResetPasswordPage'));

// ─── Client Pages ─────────────────────────────────────────────────────────────
const HomePage = lazy(() => import('./pages/client/HomePage'));
const ClientEventListPage = lazy(() => import('./pages/client/events/EventListPage'));
const ClientEventDetailPage = lazy(() => import('./pages/client/events/EventDetailPage'));
const CreateBookingPage = lazy(() => import('./pages/client/bookings/CreateBookingPage'));
const MyTicketsPage = lazy(() => import('./pages/client/bookings/MyTicketsPage'));
const ClientBookingDetailPage = lazy(() => import('./pages/client/bookings/BookingDetailPage'));
const ProfilePage = lazy(() => import('./pages/client/profile/ProfilePage'));
const ChangePasswordPage = lazy(() => import('./pages/client/profile/ChangePasswordPage'));

// ─── Admin Auth Pages ─────────────────────────────────────────────────────────
const AdminLoginPage = lazy(() => import('./pages/admin/auth/LoginPage'));

// ─── Admin Pages ──────────────────────────────────────────────────────────────
const DashboardPage = lazy(() => import('./pages/admin/dashboard/DashboardPage'));
const AdminEventManagementPage = lazy(() => import('./pages/admin/events/EventManagementPage'));
const AdminEventCreatePage = lazy(() => import('./pages/admin/events/EventCreatePage'));
const AdminEventEditPage = lazy(() => import('./pages/admin/events/EventEditPage'));
const AdminEventDetailPage = lazy(() => import('./pages/admin/events/EventDetailPage'));
const AdminAllBookingsPage = lazy(() => import('./pages/admin/bookings/AllBookingsPage'));
const AdminBookingDetailPage = lazy(() => import('./pages/admin/bookings/BookingDetailPage'));
const AdminUserListPage = lazy(() => import('./pages/admin/users/UserListPage'));
const AdminUserCreatePage = lazy(() => import('./pages/admin/users/UserCreatePage'));
const AdminUserEditPage = lazy(() => import('./pages/admin/users/UserEditPage'));
const AdminUserDetailPage = lazy(() => import('./pages/admin/users/UserDetailPage'));
const AdminCategoryManagementPage = lazy(() => import('./pages/admin/categories/CategoryManagementPage'));
const AdminCategoryCreatePage = lazy(() => import('./pages/admin/categories/CategoryCreatePage'));
const AdminCategoryEditPage = lazy(() => import('./pages/admin/categories/CategoryEditPage'));
const AdminRoleManagementPage = lazy(() => import('./pages/admin/roles/RoleManagementPage'));
const AdminRoleCreatePage = lazy(() => import('./pages/admin/roles/RoleCreatePage'));
const AdminRoleEditPage = lazy(() => import('./pages/admin/roles/RoleEditPage'));

// ─── Staff Auth Pages ─────────────────────────────────────────────────────────
const StaffLoginPage = lazy(() => import('./pages/staff/auth/LoginPage'));

// ─── Staff Pages ──────────────────────────────────────────────────────────────
const StaffDashboardPage = lazy(() => import('./pages/staff/dashboard/StaffDashboardPage'));
const StaffEventManagementPage = lazy(() => import('./pages/staff/events/EventManagementPage'));
const StaffEventCreatePage = lazy(() => import('./pages/staff/events/EventCreatePage'));
const StaffEventEditPage = lazy(() => import('./pages/staff/events/EventEditPage'));
const StaffEventBookingsPage = lazy(() => import('./pages/staff/bookings/EventBookingsPage'));
const StaffBookingDetailPage = lazy(() => import('./pages/staff/bookings/BookingDetailPage'));
const StaffCheckBookingPage = lazy(() => import('./pages/staff/bookings/CheckBookingPage'));
const StaffCategoryManagementPage = lazy(() => import('./pages/staff/categories/CategoryManagementPage'));
const StaffCategoryCreatePage = lazy(() => import('./pages/staff/categories/CategoryCreatePage'));
const StaffCategoryEditPage = lazy(() => import('./pages/staff/categories/CategoryEditPage'));

// ─── App ──────────────────────────────────────────────────────────────────────
function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Suspense fallback={<Loading />}>
          <Toaster position="top-right" />
          <Routes>
            {/* ── Auth Standalone (no layout) ─────────────────────────────── */}
            <Route path={ROUTES.CLIENT_LOGIN} element={<ClientLoginPage />} />
            <Route path={ROUTES.CLIENT_REGISTER} element={<ClientRegisterPage />} />
            <Route path={ROUTES.CLIENT_FORGOT_PASSWORD} element={<ClientForgotPasswordPage />} />
            <Route path={ROUTES.CLIENT_RESET_PASSWORD} element={<ClientResetPasswordPage />} />
            <Route path={ROUTES.ADMIN_LOGIN} element={<AdminLoginPage />} />
            <Route path={ROUTES.STAFF_LOGIN} element={<StaffLoginPage />} />

            {/* ── Client Routes ───────────────────────────────────────────── */}
            <Route element={<ClientLayout />}>
              <Route path={ROUTES.HOME} element={<HomePage />} />
              <Route path={ROUTES.EVENTS} element={<ClientEventListPage />} />
              <Route path={ROUTES.EVENT_DETAIL} element={<ClientEventDetailPage />} />

              {/* Protected: Customer */}
              <Route element={<ProtectedRoute allowedRoles={['CUSTOMER', 'ADMIN', 'STAFF']} />}>
                <Route path={ROUTES.CREATE_BOOKING} element={<CreateBookingPage />} />
                <Route path={ROUTES.MY_TICKETS} element={<MyTicketsPage />} />
                <Route path={ROUTES.MY_BOOKING_DETAIL} element={<ClientBookingDetailPage />} />
                <Route path={ROUTES.PROFILE} element={<ProfilePage />} />
                <Route path={ROUTES.CHANGE_PASSWORD} element={<ChangePasswordPage />} />
              </Route>
            </Route>

            {/* ── Admin Routes ─────────────────────────────────────────────── */}
            <Route element={<ProtectedRoute allowedRoles={['ADMIN']} redirectTo={ROUTES.ADMIN_LOGIN} />}>
              <Route element={<AdminLayout />}>
                <Route path={ROUTES.ADMIN_DASHBOARD} element={<DashboardPage />} />

                <Route path={ROUTES.ADMIN_EVENTS} element={<AdminEventManagementPage />} />
                <Route path={ROUTES.ADMIN_EVENT_CREATE} element={<AdminEventCreatePage />} />
                <Route path={ROUTES.ADMIN_EVENT_EDIT} element={<AdminEventEditPage />} />
                <Route path={ROUTES.ADMIN_EVENT_DETAIL} element={<AdminEventDetailPage />} />

                <Route path={ROUTES.ADMIN_BOOKINGS} element={<AdminAllBookingsPage />} />
                <Route path={ROUTES.ADMIN_BOOKING_DETAIL} element={<AdminBookingDetailPage />} />

                <Route path={ROUTES.ADMIN_USERS} element={<AdminUserListPage />} />
                <Route path={ROUTES.ADMIN_USER_CREATE} element={<AdminUserCreatePage />} />
                <Route path={ROUTES.ADMIN_USER_EDIT} element={<AdminUserEditPage />} />
                <Route path={ROUTES.ADMIN_USER_DETAIL} element={<AdminUserDetailPage />} />

                <Route path={ROUTES.ADMIN_CATEGORIES} element={<AdminCategoryManagementPage />} />
                <Route path={ROUTES.ADMIN_CATEGORY_CREATE} element={<AdminCategoryCreatePage />} />
                <Route path={ROUTES.ADMIN_CATEGORY_EDIT} element={<AdminCategoryEditPage />} />

                <Route path={ROUTES.ADMIN_ROLES} element={<AdminRoleManagementPage />} />
                <Route path={ROUTES.ADMIN_ROLE_CREATE} element={<AdminRoleCreatePage />} />
                <Route path={ROUTES.ADMIN_ROLE_EDIT} element={<AdminRoleEditPage />} />
              </Route>
            </Route>

            {/* ── Staff Routes ──────────────────────────────────────────────── */}
            <Route element={<ProtectedRoute allowedRoles={['STAFF', 'ADMIN']} redirectTo={ROUTES.STAFF_LOGIN} />}>
              <Route element={<StaffLayout />}>
                <Route path={ROUTES.STAFF_DASHBOARD} element={<StaffDashboardPage />} />

                <Route path={ROUTES.STAFF_EVENTS} element={<StaffEventManagementPage />} />
                <Route path={ROUTES.STAFF_EVENT_CREATE} element={<StaffEventCreatePage />} />
                <Route path={ROUTES.STAFF_EVENT_EDIT} element={<StaffEventEditPage />} />

                <Route path={ROUTES.STAFF_BOOKINGS} element={<StaffEventBookingsPage />} />
                <Route path={ROUTES.STAFF_BOOKING_DETAIL} element={<StaffBookingDetailPage />} />
                <Route path={ROUTES.STAFF_CHECK_BOOKING} element={<StaffCheckBookingPage />} />

                <Route path={ROUTES.STAFF_CATEGORIES} element={<StaffCategoryManagementPage />} />
                <Route path={ROUTES.STAFF_CATEGORY_CREATE} element={<StaffCategoryCreatePage />} />
                <Route path={ROUTES.STAFF_CATEGORY_EDIT} element={<StaffCategoryEditPage />} />
              </Route>
            </Route>

            {/* ── Redirect Shortcuts ────────────────────────────────────────── */}
            <Route path="/admin" element={<Navigate to={ROUTES.ADMIN_DASHBOARD} replace />} />
            <Route path="/staff" element={<Navigate to={ROUTES.STAFF_DASHBOARD} replace />} />

            {/* ── 404 ───────────────────────────────────────────────────────── */}
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </Suspense>
      </AuthProvider>
    </BrowserRouter>
  );
}

const NotFoundPage = () => (
  <div className="min-h-screen hero-gradient flex items-center justify-center text-center px-4">
    <div className="animate-slide-up">
      <p className="text-8xl font-extrabold text-white/30 mb-4">404</p>
      <h1 className="text-3xl font-bold text-white mb-2">Trang không tìm thấy</h1>
      <a href="/" className="btn btn-lg bg-white text-primary-700 font-semibold hover:bg-gray-100">
        ← Về trang chủ
      </a>
    </div>
  </div>
);

export default App;
