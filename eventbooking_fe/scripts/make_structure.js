const fs = require('fs');
const path = require('path');

const srcDir = path.join(__dirname, '..', 'src');

const structure = {
  'api': [
    'axiosClient.js', 'authApi.js', 'userApi.js', 'roleApi.js',
    'categoryApi.js', 'eventApi.js', 'bookingApi.js', 'dashboardApi.js'
  ],
  'components': {
    'common': [
      'Button.js', 'Input.js', 'Modal.js', 'Table.js', 'Pagination.js',
      'Loading.js', 'Notification.js', 'ProtectedRoute.js'
    ],
    'auth': [
      'LoginForm.js', 'RegisterForm.js', 'ForgotPasswordForm.js',
      'ResetPasswordForm.js', 'ChangePasswordForm.js'
    ],
    'events': [
      'EventCard.js', 'EventTable.js', 'EventForm.js', 'EventFilter.js', 'EventStatusBadge.js'
    ],
    'bookings': [
      'BookingTable.js', 'BookingForm.js', 'BookingStatusBadge.js', 'BookingInfoCard.js'
    ],
    'users': [
      'UserTable.js', 'UserForm.js', 'UserStatusBadge.js'
    ],
    'categories': [
      'CategoryTable.js', 'CategoryForm.js'
    ],
    'roles': [
      'RoleTable.js', 'RoleForm.js'
    ],
    'dashboard': [
      'StatCard.js', 'RevenueChart.js', 'TopEventsChart.js'
    ],
    'client': [
      'Navbar.js', 'Footer.js', 'EventCarousel.js', 'TicketCard.js'
    ],
    'staff': [
      'StaffSidebar.js', 'StaffHeader.js'
    ],
    'admin': [
      'AdminSidebar.js', 'AdminHeader.js'
    ]
  },
  'layouts': [
    'ClientLayout.js', 'StaffLayout.js', 'AdminLayout.js'
  ],
  'pages': {
    'client': {
      'auth': ['LoginPage.js', 'RegisterPage.js', 'ForgotPasswordPage.js', 'ResetPasswordPage.js'],
      '': ['HomePage.js'],
      'events': ['EventListPage.js', 'EventDetailPage.js'],
      'bookings': ['CreateBookingPage.js', 'MyTicketsPage.js', 'BookingDetailPage.js'],
      'profile': ['ProfilePage.js', 'ChangePasswordPage.js']
    },
    'staff': {
      'auth': ['LoginPage.js'],
      '': ['StaffDashboardPage.js'],
      'events': ['EventManagementPage.js', 'EventCreatePage.js', 'EventEditPage.js'],
      'bookings': ['EventBookingsPage.js', 'BookingDetailPage.js', 'CheckBookingPage.js'],
      'categories': ['CategoryManagementPage.js', 'CategoryCreatePage.js', 'CategoryEditPage.js']
    },
    'admin': {
      'auth': ['LoginPage.js'],
      'dashboard': ['DashboardPage.js'],
      'users': ['UserListPage.js', 'UserCreatePage.js', 'UserEditPage.js', 'UserDetailPage.js'],
      'roles': ['RoleManagementPage.js', 'RoleCreatePage.js', 'RoleEditPage.js'],
      'categories': ['CategoryManagementPage.js', 'CategoryCreatePage.js', 'CategoryEditPage.js'],
      'events': ['EventManagementPage.js', 'EventCreatePage.js', 'EventEditPage.js', 'EventDetailPage.js'],
      'bookings': ['AllBookingsPage.js', 'BookingDetailPage.js']
    }
  },
  'context': ['AuthContext.js'],
  'hooks': ['useAuth.js', 'useFetch.js', 'usePagination.js', 'useForm.js'],
  'constants': ['roles.js', 'eventStatus.js', 'bookingStatus.js', 'config.js', 'routes.js'],
  'utils': ['tokenStorage.js', 'permissions.js', 'formatDate.js', 'formatCurrency.js', 'validators.js']
};

function createComponentStub(name) {
  const compName = name.replace('.js', '');
  return `import React from 'react';\n\nconst ${compName} = () => {\n  return <div>${compName}</div>;\n};\n\nexport default ${compName};\n`;
}

function processStructure(basePath, obj) {
  if (Array.isArray(obj)) {
    obj.forEach(file => {
      const filePath = path.join(basePath, file);
      if (!fs.existsSync(filePath)) {
        if (!fs.existsSync(basePath)) fs.mkdirSync(basePath, { recursive: true });
        // Create stub
        if (filePath.includes('components')) {
            fs.writeFileSync(filePath, createComponentStub(file));
            console.log(`Created component stub: ${filePath}`);
        } else {
            fs.writeFileSync(filePath, `// TODO: Implement ${file}\n`);
            console.log(`Created file stub: ${filePath}`);
        }
      }
    });
  } else if (typeof obj === 'object') {
    for (const [key, value] of Object.entries(obj)) {
      const currentPath = path.join(basePath, key);
      if (!fs.existsSync(currentPath)) {
        fs.mkdirSync(currentPath, { recursive: true });
      }
      processStructure(currentPath, value);
    }
  }
}

// Rename map for specific pages
const renameMap = [
  ['admin/events/EventListPage.js', 'admin/events/EventManagementPage.js'],
  ['admin/categories/CategoryListPage.js', 'admin/categories/CategoryManagementPage.js'],
  ['admin/roles/RoleListPage.js', 'admin/roles/RoleManagementPage.js'],
];

renameMap.forEach(([oldPath, newPath]) => {
  const oldFull = path.join(srcDir, 'pages', oldPath);
  const newFull = path.join(srcDir, 'pages', newPath);
  if (fs.existsSync(oldFull)) {
    if (fs.existsSync(newFull)) {
      fs.unlinkSync(newFull); // overwrite
    }
    fs.renameSync(oldFull, newFull);
    console.log(`Renamed ${oldPath} to ${newPath}`);
  }
});

// Run generation
processStructure(srcDir, structure);

// Remove extra files in pages to exactly match structure
function cleanDirectory(dirPath, allowedFilesObj) {
    if (!fs.existsSync(dirPath)) return;
    
    // Convert allowed structure into sets of files
    const allowedMap = {};
    for (const [folder, files] of Object.entries(allowedFilesObj)) {
        allowedMap[folder] = new Set(files);
    }

    // Read current subdirectories
    const subdirs = fs.readdirSync(dirPath, { withFileTypes: true })
        .filter(d => d.isDirectory())
        .map(d => d.name);

    for (const subdir of subdirs) {
        if (!allowedMap[subdir] && subdir !== '') {
           // Not a requested folder, skip or delete? Let's leave it alone to be safe
           continue;
        }
    }
    
    for (const [folder, files] of Object.entries(allowedMap)) {
        const targetDir = path.join(dirPath, folder);
        if (fs.existsSync(targetDir)) {
            const actualFiles = fs.readdirSync(targetDir, { withFileTypes: true });
            for (const item of actualFiles) {
                if (item.isFile() && item.name.endsWith('.js')) {
                    if (!files.has(item.name)) {
                        const filePath = path.join(targetDir, item.name);
                        console.log(`Deleting extra file: ${filePath}`);
                        fs.unlinkSync(filePath);
                    }
                }
            }
        }
    }
}

console.log("Cleaning admin pages...");
cleanDirectory(path.join(srcDir, 'pages', 'admin'), structure.pages.admin);
console.log("Cleaning staff pages...");
cleanDirectory(path.join(srcDir, 'pages', 'staff'), structure.pages.staff);
console.log("Cleaning client pages...");
cleanDirectory(path.join(srcDir, 'pages', 'client'), structure.pages.client);

console.log("Done enforcing structure!");
