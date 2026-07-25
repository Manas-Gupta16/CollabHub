const fs = require('fs');
const path = require('path');

const filesToFix = [
  'src/app/(dashboard)/dashboard/page.tsx',
  'src/app/(dashboard)/workspaces/page.tsx',
  'src/app/(dashboard)/workspaces/[id]/page.tsx',
  'src/app/(dashboard)/tasks/page.tsx',
  'src/app/(dashboard)/activity/page.tsx',
  'src/app/(dashboard)/notifications/page.tsx',
  'src/app/(dashboard)/settings/page.tsx',
  'src/app/(dashboard)/profile/page.tsx',
  'src/app/(dashboard)/messages/page.tsx',
];

filesToFix.forEach((relPath) => {
  const filePath = path.join(__dirname, '..', relPath);
  if (!fs.existsSync(filePath)) return;

  let content = fs.readFileSync(filePath, 'utf8');

  // Fix outer container backgrounds
  content = content.replace(/bg-\[\#FAFAFA\](?!\s*dark:)/g, 'bg-[#FAFAFA] dark:bg-slate-950 text-gray-900 dark:text-gray-100');
  content = content.replace(/bg-slate-50\/60(?!\s*dark:)/g, 'bg-slate-50/60 dark:bg-slate-950 text-gray-900 dark:text-gray-100');
  content = content.replace(/bg-slate-50\/30(?!\s*dark:)/g, 'bg-slate-50/30 dark:bg-slate-950');

  // Fix card backgrounds (cards should be dark:bg-slate-900 on dark:bg-slate-950 container)
  content = content.replace(/dark:bg-slate-950/g, 'dark:bg-slate-900');
  
  // Outer containers specifically should be dark:bg-slate-950
  content = content.replace(/flex-1 overflow-y-auto bg-slate-50\/60 dark:bg-slate-900/g, 'flex-1 overflow-y-auto bg-slate-50/60 dark:bg-slate-950');
  content = content.replace(/flex-1 overflow-y-auto bg-\[\#FAFAFA\] dark:bg-slate-900/g, 'flex-1 overflow-y-auto bg-[#FAFAFA] dark:bg-slate-950');
  content = content.replace(/flex-1 flex flex-col overflow-hidden bg-\[\#FAFAFA\] dark:bg-slate-900/g, 'flex-1 flex flex-col overflow-hidden bg-[#FAFAFA] dark:bg-slate-950');
  content = content.replace(/flex-1 flex overflow-hidden bg-white dark:bg-slate-900/g, 'flex-1 flex overflow-hidden bg-white dark:bg-slate-950');

  // Fix row hover background in dark mode
  content = content.replace(/hover:bg-gray-50 dark:bg-slate-900\/80/g, 'hover:bg-gray-50 dark:hover:bg-slate-800');
  content = content.replace(/hover:bg-gray-50(?!\s*dark:)/g, 'hover:bg-gray-50 dark:hover:bg-slate-800');

  // Fix text colors for dark mode readability
  content = content.replace(/text-gray-900(?!\s*dark:)/g, 'text-gray-900 dark:text-gray-100');
  content = content.replace(/text-gray-800(?!\s*dark:)/g, 'text-gray-800 dark:text-gray-200');
  content = content.replace(/text-gray-700(?!\s*dark:)/g, 'text-gray-700 dark:text-gray-300');
  content = content.replace(/text-gray-600(?!\s*dark:)/g, 'text-gray-600 dark:text-slate-300');
  content = content.replace(/text-gray-500(?!\s*dark:)/g, 'text-gray-500 dark:text-slate-400');
  content = content.replace(/text-gray-400(?!\s*dark:)/g, 'text-gray-400 dark:text-slate-500');

  // Fix borders
  content = content.replace(/border-gray-200(?!\s*dark:)/g, 'border-gray-200 dark:border-slate-800');
  content = content.replace(/border-gray-100(?!\s*dark:)/g, 'border-gray-100 dark:border-slate-800');
  content = content.replace(/divide-gray-100(?!\s*dark:)/g, 'divide-gray-100 dark:divide-slate-800');

  // Clean duplicate dark: classes
  content = content.replace(/dark:(dark:[a-z0-9\/-]+)+/g, (match) => {
    return match.replace(/dark:/g, '').replace(/^/, 'dark:');
  });

  fs.writeFileSync(filePath, content, 'utf8');
  console.log(`Successfully updated dark mode formatting for: ${relPath}`);
});
