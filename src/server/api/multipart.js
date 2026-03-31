import fs from 'fs';
import path from 'path';
import formidable from 'formidable';

export const multipartConfig = {
  api: {
    bodyParser: false,
  },
};

export function parseMultipartForm(req) {
  const uploadDir = path.join(process.cwd(), 'temp');
  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
  }

  const form = formidable({
    multiples: false,
    uploadDir,
    keepExtensions: true,
  });

  return new Promise((resolve, reject) => {
    form.parse(req, (error, fields, files) => {
      if (error) {
        reject(error);
        return;
      }

      resolve({ fields, files });
    });
  });
}
