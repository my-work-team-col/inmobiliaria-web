/**
 * Renames .jpg images in the current folder using:
 * property-<PROPERTY_NUMBER>-<POSITION>.jpg
 *
 * Usage:
 *   node rename-images.js <propertyStart> <position>
 *
 * Example:
 *   node rename-images.js 4 1
 *   → property-4-1.jpg, property-5-1.jpg, ...
 */

import fs from "fs";
import path from "path";

const propertyStart = parseInt(process.argv[2], 10);
const position = parseInt(process.argv[3], 10);

if (!propertyStart || !position) {
  console.error("❌ Uso: node rename-images.js <propertyStart> <position>");
  process.exit(1);
}

const directory = process.cwd();

const files = fs
  .readdirSync(directory)
  .filter((f) => f.toLowerCase().endsWith(".jpg"))
  .sort();

if (!files.length) {
  console.log("⚠️ No se encontraron imágenes .jpg");
  process.exit(0);
}

files.forEach((file, index) => {
  const propertyNumber = propertyStart + index;
  const newName = `property-${propertyNumber}-${position}.jpg`;

  const oldPath = path.join(directory, file);
  const newPath = path.join(directory, newName);

  fs.renameSync(oldPath, newPath);
  console.log(`✔ ${file} → ${newName}`);
});

console.log(`✅ ${files.length} imágenes renombradas`);
