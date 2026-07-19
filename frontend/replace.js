const fs = require('fs');
const path = require('path');

function walkSync(dir, filelist = []) {
  fs.readdirSync(dir).forEach(file => {
    const dirFile = path.join(dir, file);
    if (fs.statSync(dirFile).isDirectory()) {
      filelist = walkSync(dirFile, filelist);
    } else if (dirFile.endsWith('.tsx') || dirFile.endsWith('.ts')) {
      filelist.push(dirFile);
    }
  });
  return filelist;
}

const files = walkSync('src');
let names = ['Felix', 'Aneka', 'Jocelyn', 'George', 'Jasper', 'Oliver', 'Bob'];
let nameIdx = 0;

files.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  if (content.includes('images.unsplash.com')) {
    const updated = content.replace(/https:\/\/images\.unsplash\.com\/photo-[a-zA-Z0-9\-]+\?w=100&h=100&fit=crop/g, () => {
      const name = names[nameIdx % names.length];
      nameIdx++;
      return `https://api.dicebear.com/7.x/micah/svg?seed=${name}&backgroundColor=f3f4f6`;
    });
    
    // special case for the 200x200 and 800x400
    const finalContent = updated
        .replace(/https:\/\/images\.unsplash\.com\/photo-[a-zA-Z0-9\-]+\?w=200&h=200&fit=crop/g, 'https://api.dicebear.com/7.x/micah/svg?seed=Design&backgroundColor=f3f4f6')
        .replace(/https:\/\/images\.unsplash\.com\/photo-[a-zA-Z0-9\-]+\?w=800&h=400&fit=crop/g, 'https://images.unsplash.com/photo-1506744626753-eda8151a7474?w=800&h=400&fit=crop'); 
    
    fs.writeFileSync(file, finalContent);
    console.log('Updated', file);
  }
});
