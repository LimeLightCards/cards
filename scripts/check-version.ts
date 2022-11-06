
const fs = require('fs-extra');

(async () => {
  const thisVersionFile = fs.readJsonSync('dist/version.json').version;
  
  const currentVersionJSON = await fetch('https://data.limelight.cards/version.json');
  const currentVersionFile = await currentVersionJSON.json();
  
  if(thisVersionFile.version === currentVersionFile.version) {
    console.error('Versions are the same; no update required.');
    process.exit(1);
  }
})();