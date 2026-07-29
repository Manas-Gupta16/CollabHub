const fs = require('fs');

const DEFAULT_AVATARS = [
  { id: 'peeps-1', name: 'Alex', url: 'https://api.dicebear.com/7.x/open-peeps/svg?seed=Alex&backgroundColor=b6e3f4' },
  { id: 'peeps-2', name: 'Jordan', url: 'https://api.dicebear.com/7.x/open-peeps/svg?seed=Jordan&backgroundColor=c0aede' },
  { id: 'peeps-3', name: 'Taylor', url: 'https://api.dicebear.com/7.x/open-peeps/svg?seed=Taylor&backgroundColor=ffd5dc' },
  { id: 'peeps-4', name: 'Morgan', url: 'https://api.dicebear.com/7.x/open-peeps/svg?seed=Morgan&backgroundColor=d1d4f9' },
  { id: 'smile-1', name: 'Felix', url: 'https://api.dicebear.com/7.x/big-smile/svg?seed=Felix&backgroundColor=b6e3f4' },
  { id: 'smile-2', name: 'Charlie', url: 'https://api.dicebear.com/7.x/big-smile/svg?seed=Charlie&backgroundColor=ffd5dc' },
  { id: 'avataaars-1', name: 'Sam', url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sam&backgroundColor=c0aede' },
  { id: 'avataaars-2', name: 'Riley', url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Riley&backgroundColor=d1d4f9' },
  { id: 'micah-1', name: 'Avery', url: 'https://api.dicebear.com/7.x/micah/svg?seed=Avery&backgroundColor=b6e3f4' },
  { id: 'bottts-1', name: 'Leo', url: 'https://api.dicebear.com/7.x/bottts/svg?seed=Leo&backgroundColor=ffd5dc' },
];

async function run() {
  const result = [];
  for (const item of DEFAULT_AVATARS) {
    try {
      const res = await fetch(item.url);
      const svgText = await res.text();
      const encoded = 'data:image/svg+xml;utf8,' + encodeURIComponent(svgText);
      result.push({ id: item.id, name: item.name, url: encoded });
      console.log(`Successfully fetched ${item.name}`);
    } catch (e) {
      console.error(`Failed ${item.name}:`, e.message);
      result.push(item);
    }
  }
  fs.writeFileSync('./avatars_data.json', JSON.stringify(result, null, 2));
  console.log('Saved to avatars_data.json');
}

run();
