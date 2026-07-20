const fs = require('fs');

function applyCharacterFix(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');

  // Change character positioning from fixed to absolute
  content = content.replace(/className="fixed bottom-0/g, 'className="absolute bottom-0');
  
  // Add mouth=smile to all Micah avatar URLs that have backgroundColor=transparent
  content = content.replace(/backgroundColor=transparent"/g, 'backgroundColor=transparent&mouth=smile"');
  content = content.replace(/backgroundColor=transparent&mouth=smile&mouth=smile"/g, 'backgroundColor=transparent&mouth=smile"');

  // One of the avatars in settings is missing the backgroundColor=transparent in the old script maybe?
  // Let's just blindly add &mouth=smile to dicebear micah urls if not present
  content = content.replace(/(api\.dicebear\.com\/7\.x\/micah\/svg\?seed=[a-zA-Z0-9_-]+&backgroundColor=[a-zA-Z0-9]+)(?!&mouth=smile)/g, '$1&mouth=smile');

  fs.writeFileSync(filePath, content, 'utf8');
  console.log(`Updated ${filePath}`);
}

const files = [
  'src/app/(dashboard)/dashboard/page.tsx',
  'src/app/(dashboard)/activity/page.tsx',
  'src/app/(dashboard)/notifications/page.tsx',
  'src/app/(dashboard)/workspaces/page.tsx',
  'src/app/(dashboard)/profile/page.tsx',
  'src/app/(dashboard)/settings/page.tsx',
];

files.forEach(f => applyCharacterFix(f));