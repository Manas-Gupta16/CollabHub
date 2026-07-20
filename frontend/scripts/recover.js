const fs = require('fs');
const path = require('path');

const logFilePath = 'C:\\Users\\manas\\.gemini\\antigravity-ide\\brain\\8cc150a0-a438-4a48-b9d0-381ab4878125\\.system_generated\\logs\\transcript_full.jsonl';

const lines = fs.readFileSync(logFilePath, 'utf8').split('\n').filter(Boolean);

const fileContents = {};

for (const line of lines) {
  try {
    const entry = JSON.parse(line);
    
    // We only care about tool_calls
    if (entry.tool_calls && entry.tool_calls.length > 0) {
      for (const call of entry.tool_calls) {
        if (call.name === 'write_to_file') {
          const targetFile = call.args.TargetFile;
          if (targetFile && targetFile.includes('c:\\Users\\manas\\Desktop\\Code\\CollabHub\\frontend')) {
             fileContents[targetFile] = call.args.CodeContent;
          }
        }
      }
    }
  } catch (e) {
    // Ignore parse errors
  }
}

// Restore files
for (const [file, content] of Object.entries(fileContents)) {
  try {
    // Strip the quotes added by stringification if needed, but wait: 
    // CodeContent is passed as a string which might be properly unescaped by JSON.parse
    // Actually, in the log, args might be a string or object.
    
    // Let's just output the keys we found first.
    console.log('Found:', file);
    fs.writeFileSync(file, content, 'utf8');
  } catch (err) {
    console.error('Error writing', file, err.message);
  }
}

console.log('Done restoring from transcript!');