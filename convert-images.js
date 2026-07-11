const sharp = require('sharp');
const path = require('path');
const fs = require('fs');

const images = [
  'hero_bg',
  'about_team',
  'emergency_tree',
  'stump_grinding',
  'tree_removal',
  'tree_trimming',
];

const dir = __dirname;

async function recompress() {
  for (const name of images) {
    const inputPath = path.join(dir, `${name}.webp`);
    const origSize = (fs.statSync(inputPath).size / 1024).toFixed(1);

    // Read the entire file into memory as a buffer
    const buffer = fs.readFileSync(inputPath);

    // Full-size WebP — quality 50 (down from 80)
    const fullBuf = await sharp(buffer)
      .webp({ quality: 50, effort: 6 })
      .toBuffer();
    fs.writeFileSync(inputPath, fullBuf);

    // 800w version — quality 45 (down from 78)
    await sharp(buffer)
      .resize({ width: 800, withoutEnlargement: true })
      .webp({ quality: 45, effort: 6 })
      .toFile(path.join(dir, `${name}-800.webp`));

    // 400w version — quality 40 (down from 75)
    await sharp(buffer)
      .resize({ width: 400, withoutEnlargement: true })
      .webp({ quality: 40, effort: 6 })
      .toFile(path.join(dir, `${name}-400.webp`));

    const newSize = (fs.statSync(inputPath).size / 1024).toFixed(1);
    const size800 = (fs.statSync(path.join(dir, `${name}-800.webp`)).size / 1024).toFixed(1);
    const size400 = (fs.statSync(path.join(dir, `${name}-400.webp`)).size / 1024).toFixed(1);
    console.log(`${name}: ${origSize} KiB → full: ${newSize} KiB | 800w: ${size800} KiB | 400w: ${size400} KiB`);
  }
  console.log('\nDone! All WebP files re-compressed.');
}

recompress().catch(console.error);
