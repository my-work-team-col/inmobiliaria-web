import fs from 'fs'
import path from 'path'

const totalProperties = 20 // Cambia si agregas más propiedades
const imagesPerProperty = 3
const validExt = '.jpg'

const folder = process.cwd() // carpeta actual donde ejecutes el script
const files = fs.readdirSync(folder).filter((f) => f.toLowerCase().endsWith(validExt))

console.log('📁 Imagenes encontradas:', files.length)

if (files.length < imagesPerProperty) {
    console.error(`❌ Necesitas al menos ${imagesPerProperty} imágenes base en la carpeta.`)
    process.exit(1)
}

// Crear nuevas imágenes
let fileIndex = 0

for (let propertyId = 1; propertyId <= totalProperties; propertyId++) {
    for (let i = 1; i <= imagesPerProperty; i++) {
        const original = files[fileIndex % files.length] // rotamos entre las disponibles
        const ext = path.extname(original)
        const newName = `property-${propertyId}-${i}${ext}`

        fs.copyFileSync(path.join(folder, original), path.join(folder, newName))

        console.log(`✔ ${original} → ${newName}`)
        fileIndex++
    }
}

console.log('\n🎉 Listo! Se generaron todas las imágenes mock.')
