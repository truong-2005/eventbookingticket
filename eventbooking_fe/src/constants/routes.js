export const ROUTES = {
  HOME: '/',
  CLIENT_LOGIN: '/login',
  CLIENT_REGISTER: '/register',
  CLIENT_FORGOT_PASSWORD: '/forgot-password',
  CLIENT_RESET_PASSWORD: '/reset-password',
  EVENTS: '/events',
  EVENT_DETAIL: '/events/:id',
  CREATE_BOOKING: '/events/:id/book',
  MY_TICKETS: '/my-tickets',
  MY_BOOKING_DETAIL: '/my-tickets/:id',
  PROFILE: '/profile',
  CHANGE_PASSWORD: '/profile/change-password',
  PAYMENT_RETURN: '/payment-return',

  STAFF_LOGIN: '/staff/login',
  STAFF_DASHBOARD: '/staff',
  STAFF_EVENTS: '/staff/events',
  STAFF_EVENT_CREATE: '/staff/events/create',
  STAFF_EVENT_EDIT: '/staff/events/:id/edit',
  STAFF_BOOKINGS: '/staff/bookings',
  STAFF_BOOKING_DETAIL: '/staff/bookings/:id',
  STAFF_CHECK_BOOKING: '/staff/check-booking',
  STAFF_CATEGORIES: '/staff/categories',
  STAFF_CATEGORY_CREATE: '/staff/categories/create',
  STAFF_CATEGORY_EDIT: '/staff/categories/:id/edit',

  ADMIN_LOGIN: '/admin/login',
  ADMIN_DASHBOARD: '/admin',
  ADMIN_USERS: '/admin/users',
  ADMIN_USER_CREATE: '/admin/users/create',
  ADMIN_USER_EDIT: '/admin/users/:id/edit',
  ADMIN_USER_DETAIL: '/admin/users/:id',
  ADMIN_ROLES: '/admin/roles',
  ADMIN_ROLE_CREATE: '/admin/roles/create',
  ADMIN_ROLE_EDIT: '/admin/roles/:id/edit',
  ADMIN_CATEGORIES: '/admin/categories',
  ADMIN_CATEGORY_CREATE: '/admin/categories/create',
  ADMIN_CATEGORY_EDIT: '/admin/categories/:id/edit',
  ADMIN_EVENTS: '/admin/events',
  ADMIN_EVENT_CREATE: '/admin/events/create',
  ADMIN_EVENT_EDIT: '/admin/events/:id/edit',
  ADMIN_EVENT_DETAIL: '/admin/events/:id',
  ADMIN_BOOKINGS: '/admin/bookings',
  ADMIN_BOOKING_DETAIL: '/admin/bookings/:id'
};

export const buildPath = (route, params = {}) => {
  let path = route;
  Object.entries(params).forEach(([key, value]) => {
    path = path.replace(`:${key}`, value);
  });
  return path;
};
