const fs = require('fs');
const path = require('path');

function replaceInFile(filePath, replacements) {
  if (fs.existsSync(filePath)) {
    let content = fs.readFileSync(filePath, 'utf-8');
    for (const { searchValue, replaceValue } of replacements) {
      content = content.replaceAll(searchValue, replaceValue);
    }
    fs.writeFileSync(filePath, content);
    console.log(`Updated ${filePath}`);
  } else {
    console.warn(`File not found: ${filePath}`);
  }
}

const srcDir = 'c:\\eventbooking_fe\\src';

// 1. Fix components (2 levels deep -> should use ../../ instead of ../../../)
const componentsToFix = [
  'components/admin/AdminHeader.js',
  'components/admin/AdminSidebar.js',
  'components/client/Footer.js',
  'components/client/Navbar.js',
  'components/staff/StaffHeader.js',
  'components/staff/StaffSidebar.js'
];

for (const comp of componentsToFix) {
  replaceInFile(path.join(srcDir, comp), [
    { searchValue: '../../../hooks/useAuth', replaceValue: '../../hooks/useAuth' },
    { searchValue: '../../../constants/routes', replaceValue: '../../constants/routes' }
  ]);
}

// 2. Fix client pages (3 levels deep -> should use ../../../ instead of ../../)
const pagesToFix = [
  'pages/client/bookings/CreateBookingPage.js',
  'pages/client/bookings/MyTicketsPage.js',
  'pages/client/events/EventDetailPage.js',
  'pages/client/events/EventListPage.js'
];

for (const page of pagesToFix) {
  replaceInFile(path.join(srcDir, page), [
    { searchValue: '../../api/', replaceValue: '../../../api/' },
    { searchValue: '../../utils/', replaceValue: '../../../utils/' },
    { searchValue: '../../components/', replaceValue: '../../../components/' },
    { searchValue: '../../constants/', replaceValue: '../../../constants/' },
    { searchValue: '../../hooks/', replaceValue: '../../../hooks/' }
  ]);
}
