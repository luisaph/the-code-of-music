const fs = require('fs/promises');
const path = require('path');
const QRCode = require('qrcode');

const SOURCE_FOLDER = path.join(__dirname, '../src/notion-docs');
const QR_FOLDER = path.join(__dirname, '../src/qr');
const urlRegex = /(https?:\/\/[^\s]+)/g;

async function ensureQRDirectoryExists() {
    try {
        await fs.access(QR_FOLDER);
    } catch {
        await fs.mkdir(QR_FOLDER, { recursive: true });
    }
}

async function generateQRCode(url, fileName, lineNumber) {
    const sanitizedUrl = url.replace(/[^a-zA-Z0-9]/g, '_');
    const qrFileName = `qr_${fileName}_line${lineNumber}_${sanitizedUrl}.png`;
    const filePath = path.join(QR_FOLDER, qrFileName);

    try {
        await QRCode.toFile(filePath, url);
    } catch (error) {
        console.error("Error generating QR code for URL:", url, error);
    }
}

async function processMarkdownFile(filePath) {
    try {
        const content = await fs.readFile(filePath, 'utf-8');
        const lines = content.split('\n');
        const fileName = path.basename(filePath, '.md');

        for (let i = 0; i < lines.length; i++) {
            const urls = lines[i].match(urlRegex);
            if (urls) {
                for (const url of urls) {
                    await generateQRCode(url, fileName, i + 1);
                }
            }
        }
    } catch (error) {
        console.error("Error processing file:", filePath, error);
    }
}

async function findMarkdownFiles(dir) {
    const entries = await fs.readdir(dir, { withFileTypes: true });

    for (const entry of entries) {
        const fullPath = path.join(dir, entry.name);
        if (entry.isDirectory()) {
            await findMarkdownFiles(fullPath);
        } else if (entry.isFile() && entry.name.endsWith('.md')) {
            await processMarkdownFile(fullPath);
        }
    }
}

async function main() {
    await ensureQRDirectoryExists();
    await findMarkdownFiles(SOURCE_FOLDER);
}

main().catch(error => console.error("Error in main execution:", error));
