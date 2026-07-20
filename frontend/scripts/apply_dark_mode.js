const fs = require('fs');

function applyDarkMode(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');

  // Character fixes
  content = content.replace(/className="fixed bottom-0/g, 'className="absolute bottom-0');
  content = content.replace(/backgroundColor=transparent"/g, 'backgroundColor=transparent&mouth=smile"');

  // Common light mode classes -> adding dark mode classes
  content = content.replace(/bg-gradient-to-br from-\[\#F5F8FF\] to-\[\#E9F0FE\]/g, 'bg-gradient-to-br from-[#F5F8FF] to-[#E9F0FE] dark:from-slate-950 dark:to-slate-900');
  
  content = content.replace(/text-gray-900/g, 'text-gray-900 dark:text-gray-100');
  content = content.replace(/text-gray-800/g, 'text-gray-800 dark:text-gray-200');
  content = content.replace(/text-gray-700/g, 'text-gray-700 dark:text-gray-300');
  content = content.replace(/text-gray-500/g, 'text-gray-500 dark:text-slate-400');
  content = content.replace(/text-gray-400/g, 'text-gray-400 dark:text-slate-500');
  
  content = content.replace(/bg-white\/80/g, 'bg-white/80 dark:bg-slate-900/80');
  content = content.replace(/bg-white\/20/g, 'bg-white/20 dark:bg-slate-800/20');
  content = content.replace(/bg-white(?!\/)/g, 'bg-white dark:bg-slate-950');
  
  content = content.replace(/border-gray-200\/60/g, 'border-gray-200/60 dark:border-slate-800/60');
  content = content.replace(/border-gray-200\/50/g, 'border-gray-200/50 dark:border-slate-800/50');
  content = content.replace(/border-gray-200/g, 'border-gray-200 dark:border-slate-800');
  content = content.replace(/border-gray-100/g, 'border-gray-100 dark:border-slate-800');
  
  content = content.replace(/border-white\/40/g, 'border-white/40 dark:border-slate-700/40');
  
  content = content.replace(/hover:bg-white\/30/g, 'hover:bg-white/30 dark:hover:bg-slate-800/30');
  content = content.replace(/hover:bg-white(?!\/)/g, 'hover:bg-white dark:hover:bg-slate-900');
  content = content.replace(/hover:border-gray-300\/60/g, 'hover:border-gray-300/60 dark:hover:border-slate-700/60');
  
  content = content.replace(/bg-gray-100/g, 'bg-gray-100 dark:bg-slate-800');
  content = content.replace(/bg-gray-50/g, 'bg-gray-50 dark:bg-slate-900');
  
  content = content.replace(/stroke-\[\#E5E7EB\]/g, 'stroke-[#E5E7EB] dark:stroke-slate-800');
  content = content.replace(/fill-white/g, 'fill-white dark:fill-slate-950');

  // Prevent multiple dark:dark:
  content = content.replace(/dark:(dark:[a-z0-9-]+)+/g, (match) => {
    return match.replace(/dark:/g, '').replace(/^/, 'dark:');
  });

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
  'src/app/(dashboard)/tasks/page.tsx',
  'src/app/(dashboard)/layout.tsx'
];

files.forEach(f => applyDarkMode(f));
