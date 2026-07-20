const fs = require('fs');
const path = require('path');

function walkDir(dir, callback) {
  fs.readdirSync(dir).forEach(f => {
    let dirPath = path.join(dir, f);
    let isDirectory = fs.statSync(dirPath).isDirectory();
    isDirectory ? walkDir(dirPath, callback) : callback(path.join(dir, f));
  });
}

function removeBrokenDecorations() {
  const targetDir = path.join(__dirname, '..', 'src', 'app', '(dashboard)');
  walkDir(targetDir, (file) => {
    if (file.endsWith('.tsx')) {
      let content = fs.readFileSync(file, 'utf8');
      
      // Look for the Animated character decoration block
      const blockRegex = /\{\/\*\s*Animated character decoration\s*\*\/\}\s*<div className="absolute[^>]+>\s*<img src="[^"]+" alt="" className="w-full h-full object-contain"\s*\/>\s*<\/div>\s*/g;
      
      if (content.match(blockRegex)) {
        content = content.replace(blockRegex, '');
        fs.writeFileSync(file, content, 'utf8');
        console.log(`Removed decoration from ${file}`);
      }
    }
  });
}

removeBrokenDecorations();
