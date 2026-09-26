export const ROLES = {
  ADMIN: 'ADMIN',
  STAFF: 'STAFF',
  CUSTOMER: 'CUSTOMER',
};

export const hasRole = (user, role) => {
  if (!user || !user.roles) return false;
  return user.roles.includes(role);
};

export const hasAnyRole = (user, roles = []) => {
  if (!user || !user.roles) return false;
  return roles.some((role) => user.roles.includes(role));
};

export const isAdmin = (user) => hasRole(user, ROLES.ADMIN);
export const isStaff = (user) => hasRole(user, ROLES.STAFF);
export const isCustomer = (user) => hasRole(user, ROLES.CUSTOMER);
export const isAdminOrStaff = (user) => hasAnyRole(user, [ROLES.ADMIN, ROLES.STAFF]);

export const getDefaultRoute = (user) => {
  if (!user) return '/login';
  if (isAdmin(user)) return '/admin/dashboard';
  if (isStaff(user)) return '/staff/events';
  return '/';
};

export const getRoleLabel = (role) => {
  const labels = {
    ADMIN: 'Quản trị viên',
    STAFF: 'Nhân viên',
    CUSTOMER: 'Khách hàng',
  };
  return labels[role] || role;
};

export const getRoleBadgeClass = (role) => {
  const classes = {
    ADMIN: 'badge-purple',
    STAFF: 'badge-blue',
    CUSTOMER: 'badge-green',
  };
  return classes[role] || 'badge-gray';
};
