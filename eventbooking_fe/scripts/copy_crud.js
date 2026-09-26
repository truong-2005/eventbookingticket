const fs = require('fs');
const path = require('path');

function copyAndReplace(src, dest, replacements) {
  let content = fs.readFileSync(src, 'utf-8');
  for (const { searchValue, replaceValue } of replacements) {
    content = content.replaceAll(searchValue, replaceValue);
  }
  fs.writeFileSync(dest, content);
  console.log(`Copied ${src} to ${dest}`);
}

const basePath = 'c:\\eventbooking_fe\\src\\pages';

// 1. Admin Events (Copy from Staff Events)
const staffEvents = path.join(basePath, 'staff', 'events');
const adminEvents = path.join(basePath, 'admin', 'events');

copyAndReplace(
  path.join(staffEvents, 'EventManagementPage.js'),
  path.join(adminEvents, 'EventManagementPage.js'),
  [
    { searchValue: 'StaffEventListPage', replaceValue: 'AdminEventManagementPage' },
    { searchValue: 'ROUTES.STAFF_EVENTS_CREATE', replaceValue: 'ROUTES.ADMIN_EVENT_CREATE' },
    { searchValue: '/staff/events/', replaceValue: '/admin/events/' }
  ]
);

copyAndReplace(
  path.join(staffEvents, 'EventCreatePage.js'),
  path.join(adminEvents, 'EventCreatePage.js'),
  [
    { searchValue: 'StaffEventCreatePage', replaceValue: 'AdminEventCreatePage' },
    { searchValue: 'ROUTES.STAFF_EVENTS', replaceValue: 'ROUTES.ADMIN_EVENTS' }
  ]
);

copyAndReplace(
  path.join(staffEvents, 'EventEditPage.js'),
  path.join(adminEvents, 'EventEditPage.js'),
  [
    { searchValue: 'StaffEventEditPage', replaceValue: 'AdminEventEditPage' },
    { searchValue: 'ROUTES.STAFF_EVENTS', replaceValue: 'ROUTES.ADMIN_EVENTS' }
  ]
);

// 2. Staff Categories (Copy from Admin Categories)
const adminCategories = path.join(basePath, 'admin', 'categories');
const staffCategories = path.join(basePath, 'staff', 'categories');

copyAndReplace(
  path.join(adminCategories, 'CategoryManagementPage.js'),
  path.join(staffCategories, 'CategoryManagementPage.js'),
  [
    { searchValue: 'CategoryListPage', replaceValue: 'StaffCategoryManagementPage' },
    { searchValue: 'ROUTES.ADMIN_CATEGORIES_CREATE', replaceValue: 'ROUTES.STAFF_CATEGORY_CREATE' },
    { searchValue: '/admin/categories/', replaceValue: '/staff/categories/' }
  ]
);

copyAndReplace(
  path.join(adminCategories, 'CategoryCreatePage.js'),
  path.join(staffCategories, 'CategoryCreatePage.js'),
  [
    { searchValue: 'CategoryCreatePage', replaceValue: 'StaffCategoryCreatePage' },
    { searchValue: 'ROUTES.ADMIN_CATEGORIES', replaceValue: 'ROUTES.STAFF_CATEGORIES' }
  ]
);

copyAndReplace(
  path.join(adminCategories, 'CategoryEditPage.js'),
  path.join(staffCategories, 'CategoryEditPage.js'),
  [
    { searchValue: 'CategoryEditPage', replaceValue: 'StaffCategoryEditPage' },
    { searchValue: 'ROUTES.ADMIN_CATEGORIES', replaceValue: 'ROUTES.STAFF_CATEGORIES' }
  ]
);

// 3. Staff Bookings (Copy from Admin Bookings)
const adminBookings = path.join(basePath, 'admin', 'bookings');
const staffBookings = path.join(basePath, 'staff', 'bookings');

copyAndReplace(
  path.join(adminBookings, 'AllBookingsPage.js'),
  path.join(staffBookings, 'EventBookingsPage.js'),
  [
    { searchValue: 'BookingListPage', replaceValue: 'StaffEventBookingsPage' }
  ]
);

console.log('All files copied and adapted successfully!');
