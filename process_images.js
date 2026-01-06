
import fs from 'fs';
import path from 'path';
import sharp from 'sharp';

const SOURCE_DIR = path.resolve('../product_frame'); // This assumes we run from harshx-landing
const DEST_DIR = path.resolve('src/assets/frames');

async function processImages() {
    if (!fs.existsSync(SOURCE_DIR)) {
        console.error(`Source directory not found: ${SOURCE_DIR}`);
        process.exit(1);
    }

    if (!fs.existsSync(DEST_DIR)) {
        fs.mkdirSync(DEST_DIR, { recursive: true });
    }

    const files = fs.readdirSync(SOURCE_DIR)
        .filter(file => /\.(jpg|jpeg|png)$/i.test(file))
        .sort();

    if (files.length === 0) {
        console.error('No images found in source directory');
        process.exit(1);
    }

    console.log(`Found ${files.length} source images. Processing as native HD frames...`);

    for (let i = 0; i < files.length; i++) {
        const sourceFile = files[i];
        const sourcePath = path.join(SOURCE_DIR, sourceFile);

        // Format: frame_000.webp
        const frameName = `frame_${String(i).padStart(3, '0')}.webp`;
        const destPath = path.join(DEST_DIR, frameName);

        try {
            await sharp(sourcePath)
                // Resize to 1920 (Native HD) to avoid upscaling blur
                // We assume source is ~1920x1080.
                .resize({ width: 1920, kernel: sharp.kernel.lanczos3 })
                .sharpen({ sigma: 0.8 }) // Mild sharpening to pop details
                .webp({ quality: 100, lossless: true }) // Lossless for max clarity
                .toFile(destPath);

            if (i % 10 === 0) console.log(`Generated ${frameName} from ${sourceFile}`);
        } catch (err) {
            console.error(`Error processing ${frameName}:`, err);
        }
    }

    console.log('Done processing images.');
}

processImages();
