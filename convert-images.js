const sharp = require('sharp');
const path = require('path');

const images = [
  'hero_bg',
  'about_team',
  'emergency_tree',
  'stump_grinding',
  'tree_removal',
  'tree_trimming',
];

const dir = __dirname;

async function convert() {
  for (const name of images) {
    const input = path.join(dir, `${name}.png`);

    // Full-size WebP (high quality, good compression)
    await sharp(input)
      .webp({ quality: 80 })
      .toFile(path.join(dir, `${name}.webp`));

    // 800w version for responsive srcset
    await sharp(input)
      .resize({ width: 800, withoutEnlargement: true })
      .webp({ quality: 78 })
      .toFile(path.join(dir, `${name}-800.webp`));

    // 400w version for small screens
    await sharp(input)
      .resize({ width: 400, withoutEnlargement: true })
      .webp({ quality: 75 })
      .toFile(path.join(dir, `${name}-400.webp`));

    // Get sizes for reporting
    const fs = require('fs');
    const orig = (fs.statSync(input).size / 1024).toFixed(1);
    const webp = (fs.statSync(path.join(dir, `${name}.webp`)).size / 1024).toFixed(1);
    console.log(`${name}: ${orig} KiB → ${webp} KiB WebP (${Math.round((1 - webp/orig)*100)}% smaller)`);
  }
  console.log('\nDone! All WebP files generated.');
}

convert().catch(console.error);
