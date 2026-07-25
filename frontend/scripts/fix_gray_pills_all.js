const fs = require('fs');
const path = require('path');

function walkDir(dir, callback) {
  fs.readdirSync(dir).forEach(f => {
    let dirPath = path.join(dir, f);
    let isDirectory = fs.statSync(dirPath).isDirectory();
    isDirectory ? walkDir(dirPath, callback) : callback(dirPath);
  });
}

const srcDir = path.join(__dirname, '..', 'src');

walkDir(srcDir, (filePath) => {
  if (!filePath.endsWith('.tsx') && !filePath.endsWith('.ts')) return;

  let content = fs.readFileSync(filePath, 'utf8');
  let original = content;

  // Fix bg-gray-100 without dark:bg-
  content = content.replace(/bg-gray-100(?!\s*dark:bg-)/g, 'bg-gray-100 dark:bg-slate-800');
  content = content.replace(/bg-gray-50(?!\s*dark:bg-)/g, 'bg-gray-50 dark:bg-slate-800/80');
  content = content.replace(/bg-gray-200(?!\s*dark:bg-)/g, 'bg-gray-200 dark:bg-slate-700');

  // Fix badges/pills in dark mode
  content = content.replace(/bg-indigo-50(?!\s*dark:bg-)/g, 'bg-indigo-50 dark:bg-indigo-950/60');
  content = content.replace(/bg-amber-50(?!\s*dark:bg-)/g, 'bg-amber-50 dark:bg-amber-950/60');
  content = content.replace(/bg-blue-50(?!\s*dark:bg-)/g, 'bg-blue-50 dark:bg-blue-950/60');
  content = content.replace(/bg-emerald-50(?!\s*dark:bg-)/g, 'bg-emerald-50 dark:bg-emerald-950/60');
  content = content.replace(/bg-purple-50(?!\s*dark:bg-)/g, 'bg-purple-50 dark:bg-purple-950/60');
  content = content.replace(/bg-red-50(?!\s*dark:bg-)/g, 'bg-red-50 dark:bg-red-950/60');

  // Fix text contrast on badges
  content = content.replace(/text-gray-600(?!\s*dark:text-)/g, 'text-gray-600 dark:text-slate-300');
  content = content.replace(/text-gray-700(?!\s*dark:text-)/g, 'text-gray-700 dark:text-slate-300');

  // Clean up any duplicate dark: classes
  content = content.replace(/dark:(dark:[a-z0-9\/-]+)+/g, (match) => {
    return match.replace(/dark:/g, '').replace(/^/, 'dark:');
  });

  if (content !== original) {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`Updated gray pill backgrounds in: ${path.relative(srcDir, filePath)}`);
  }
});
