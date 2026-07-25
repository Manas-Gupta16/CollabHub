const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '..', 'src/app/(marketing)/page.tsx');
let content = fs.readFileSync(filePath, 'utf8');

content = content.replace(/text-gray-900(?!\s*dark:)/g, 'text-gray-900 dark:text-gray-100');
content = content.replace(/text-gray-800(?!\s*dark:)/g, 'text-gray-800 dark:text-gray-200');
content = content.replace(/text-gray-700(?!\s*dark:)/g, 'text-gray-700 dark:text-gray-300');
content = content.replace(/text-gray-600(?!\s*dark:)/g, 'text-gray-600 dark:text-slate-400');
content = content.replace(/text-gray-500(?!\s*dark:)/g, 'text-gray-500 dark:text-slate-400');

content = content.replace(/bg-white\/90(?!\s*dark:)/g, 'bg-white/90 dark:bg-slate-900/90');
content = content.replace(/bg-white(?!\/)(?!\s*dark:)/g, 'bg-white dark:bg-slate-900');
content = content.replace(/bg-gray-50(?!\s*dark:)/g, 'bg-gray-50 dark:bg-slate-800');
content = content.replace(/bg-indigo-50(?!\s*dark:)/g, 'bg-indigo-50 dark:bg-indigo-950/50');

content = content.replace(/border-gray-200(?!\s*dark:)/g, 'border-gray-200 dark:border-slate-800');
content = content.replace(/border-gray-100(?!\s*dark:)/g, 'border-gray-100 dark:border-slate-800');
content = content.replace(/border-gray-300(?!\s*dark:)/g, 'border-gray-300 dark:border-slate-700');

content = content.replace(/text-gray-800(?!\s*dark:)/g, 'text-gray-800 dark:text-gray-200');
content = content.replace(/hover:bg-white(?!\s*dark:)/g, 'hover:bg-white dark:hover:bg-slate-800');

// Clean duplicate dark: classes
content = content.replace(/dark:(dark:[a-z0-9\/-]+)+/g, (match) => {
  return match.replace(/dark:/g, '').replace(/^/, 'dark:');
});

fs.writeFileSync(filePath, content, 'utf8');
console.log('Marketing page dark mode applied successfully.');
