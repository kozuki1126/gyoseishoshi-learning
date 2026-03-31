import fs from 'fs';
import path from 'path';
import contentRepository from '@/server/repositories/contentRepository';

const PUBLIC_DIR = path.join(process.cwd(), 'public');
const AUDIO_DIR = path.join(PUBLIC_DIR, 'audio');
const PDF_DIR = path.join(PUBLIC_DIR, 'pdf');

function ensureDirectory(directory) {
  if (!fs.existsSync(directory)) {
    fs.mkdirSync(directory, { recursive: true });
  }
}

function sanitizeFileName(fileName) {
  return fileName.replace(/[^a-zA-Z0-9._-]/g, '_');
}

export function saveAsset(file, type, unitId) {
  if (!file || !file.filepath) {
    return null;
  }

  const targetDirectory = type === 'audio' ? AUDIO_DIR : PDF_DIR;
  ensureDirectory(targetDirectory);

  const extension = path.extname(file.originalFilename || file.newFilename || '');
  const safeName = sanitizeFileName(`${unitId}-${Date.now()}${extension}`);
  const targetPath = path.join(targetDirectory, safeName);
  fs.copyFileSync(file.filepath, targetPath);

  return `${type === 'audio' ? '/audio' : '/pdf'}/${safeName}`;
}

export function deletePublicAsset(assetPath) {
  if (!assetPath) {
    return;
  }

  const normalized = assetPath.replace(/^\//, '');
  const resolvedPath = path.join(PUBLIC_DIR, normalized);
  if (resolvedPath.startsWith(PUBLIC_DIR) && fs.existsSync(resolvedPath)) {
    fs.unlinkSync(resolvedPath);
  }
}

export function listUploadedAssets() {
  const units = contentRepository.listUnits({}, { includeDraft: true }).units;
  const unitsByAsset = new Map();

  units.forEach((unit) => {
    if (unit.audioUrl) {
      unitsByAsset.set(unit.audioUrl, { unitId: unit.id, title: unit.title, type: 'audio' });
    }
    if (unit.pdfUrl) {
      unitsByAsset.set(unit.pdfUrl, { unitId: unit.id, title: unit.title, type: 'pdf' });
    }
  });

  return ['/audio', '/pdf']
    .flatMap((routePrefix) => {
      const directory = path.join(PUBLIC_DIR, routePrefix.replace(/^\//, ''));
      if (!fs.existsSync(directory)) {
        return [];
      }

      return fs.readdirSync(directory).map((fileName) => {
        const absolutePath = path.join(directory, fileName);
        const relativePath = `${routePrefix}/${fileName}`;
        const stats = fs.statSync(absolutePath);
        const linked = unitsByAsset.get(relativePath);

        return {
          id: relativePath,
          name: fileName,
          path: relativePath,
          type: routePrefix === '/audio' ? 'audio' : 'pdf',
          size: stats.size,
          updatedAt: stats.mtime.toISOString(),
          unitId: linked?.unitId || null,
          unitTitle: linked?.title || null,
        };
      });
    })
    .sort((left, right) => new Date(right.updatedAt) - new Date(left.updatedAt));
}
