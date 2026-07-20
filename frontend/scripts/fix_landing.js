const fs = require('fs');

function applyLandingPageFixes(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');

  // Replace Unsplash images with Micah avatars
  let i = 0;
  content = content.replace(/https:\/\/images\.unsplash\.com\/photo-[a-zA-Z0-9-]+\?w=100&h=100&fit=crop/g, (match) => {
    i++;
    return `https://api.dicebear.com/7.x/micah/svg?seed=User${i}&backgroundColor=f3f4f6&mouth=smile`;
  });

  // Replace stick man SVG with animated character
  const svgStart = content.indexOf('<svg viewBox="0 0 400 400"');
  if (svgStart !== -1) {
    const svgEnd = content.indexOf('</svg>', svgStart) + 6;
    const svgContent = content.substring(svgStart, svgEnd);
    content = content.replace(svgContent, '<img src="https://api.dicebear.com/7.x/micah/svg?seed=Hero&backgroundColor=transparent&mouth=smile" alt="Hero Character" className="w-full h-full drop-shadow-xl" />');
  }

  fs.writeFileSync(filePath, content, 'utf8');
  console.log(`Updated ${filePath}`);
}

const file = 'src/app/(marketing)/page.tsx';
applyLandingPageFixes(file);
