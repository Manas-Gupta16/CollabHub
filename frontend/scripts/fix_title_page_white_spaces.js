const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '..', 'src/app/(marketing)/page.tsx');
let content = fs.readFileSync(filePath, 'utf8');

// Fix section backgrounds
content = content.replace(/bg-\[\#F8FAFC\](?!\s*dark:)/g, 'bg-[#F8FAFC] dark:bg-slate-950');

// Fix hover:bg-gray-50 dark:bg-slate-800/50
content = content.replace(/hover:bg-gray-50 dark:bg-slate-800\/50/g, 'hover:bg-gray-50 dark:hover:bg-slate-800/50');
content = content.replace(/hover:bg-gray-50(?!\s*dark:)/g, 'hover:bg-gray-50 dark:hover:bg-slate-800');

// Fix mockup light borders and inner elements
content = content.replace(/border-gray-50(?!\s*dark:)/g, 'border-gray-100 dark:border-slate-800');
content = content.replace(/bg-blue-50(?!\s*dark:)/g, 'bg-blue-50 dark:bg-blue-950/40');
content = content.replace(/bg-purple-50(?!\s*dark:)/g, 'bg-purple-50 dark:bg-purple-950/40');
content = content.replace(/bg-orange-50(?!\s*dark:)/g, 'bg-orange-50 dark:bg-amber-950/40');
content = content.replace(/bg-emerald-50(?!\s*dark:)/g, 'bg-emerald-50 dark:bg-emerald-950/40');
content = content.replace(/bg-red-50(?!\s*dark:)/g, 'bg-red-50 dark:bg-red-950/40');
content = content.replace(/bg-amber-50(?!\s*dark:)/g, 'bg-amber-50 dark:bg-amber-950/40');
content = content.replace(/bg-sky-50(?!\s*dark:)/g, 'bg-sky-50 dark:bg-sky-950/40');

// Fix avatar ring borders
content = content.replace(/border-white(?!\s*dark:)/g, 'border-white dark:border-slate-900');

// Clean duplicate dark: classes
content = content.replace(/dark:(dark:[a-z0-9\/-]+)+/g, (match) => {
  return match.replace(/dark:/g, '').replace(/^/, 'dark:');
});

fs.writeFileSync(filePath, content, 'utf8');
console.log('Successfully cleaned all section backgrounds and mockups in marketing page.');
