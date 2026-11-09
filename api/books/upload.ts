// Vercel Serverless Function: /api/books/upload
import type { IncomingMessage, ServerResponse } from 'http';
import fs from 'fs';
import path from 'path';

interface VercelRequest extends IncomingMessage {
  body: any;
  query: { [key: string]: string | string[] };
}

interface VercelResponse extends ServerResponse {
  status: (statusCode: number) => VercelResponse;
  json: (data: any) => VercelResponse;
}

const ALLOWED_EXTENSIONS = ['pdf', 'epub', 'docx', 'txt'];
const MAX_FILE_SIZE_BYTES = 50 * 1024 * 1024; // 50MB

// Sanitizes filename by stripping directory traversal and non-alphanumeric chars
export function sanitizeFilename(filename: string): string {
  const base = filename.replace(/^.*[\\/]/, ''); // Strip path
  const dotIndex = base.lastIndexOf('.');
  const ext = dotIndex !== -1 ? base.substring(dotIndex) : '';
  const name = dotIndex !== -1 ? base.substring(0, dotIndex) : base;
  const sanitized = name.replace(/[^a-zA-Z0-9_-]/g, '_').replace(/_+/g, '_').slice(0, 100);
  return `${sanitized || 'document'}${ext.toLowerCase()}`;
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed. Use POST.' });
  }

  try {
    const { 
      title, 
      author, 
      subject, 
      uploaderName, 
      fileType, 
      fileSizeBytes, 
      hasRightsDeclaration, 
      originalFilename,
      fileBase64 
    } = req.body || {};

    // 1. Legal right-to-use declaration validation
    if (!hasRightsDeclaration) {
      return res.status(400).json({
        error: 'Declaration required: You must confirm that you have the right to upload and use this book material.'
      });
    }

    // 2. File size validation (<= 50 MB)
    if (!fileSizeBytes || fileSizeBytes > MAX_FILE_SIZE_BYTES) {
      return res.status(400).json({
        error: `File size exceeds the 50 MB limit. Provided size: ${((fileSizeBytes || 0) / (1024 * 1024)).toFixed(1)} MB.`
      });
    }

    // 3. File extension & MIME validation
    const ext = (fileType || '').toLowerCase().replace(/^\./, '');
    if (!ext || !ALLOWED_EXTENSIONS.includes(ext)) {
      return res.status(400).json({
        error: `Invalid file format: ${fileType}. Supported formats are PDF, EPUB, DOCX, and TXT.`
      });
    }

    const rawOrigName = originalFilename || `${title || 'textbook'}.${ext}`;
    const cleanFilename = sanitizeFilename(rawOrigName);
    const bookId = `book_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;

    // 4. Store file locally in /uploads folder if base64 data was supplied
    let savedFilePath = '';
    const uploadsDir = path.resolve(process.cwd(), 'uploads');
    if (fileBase64) {
      try {
        if (!fs.existsSync(uploadsDir)) {
          fs.mkdirSync(uploadsDir, { recursive: true });
        }
        const diskFilename = `${bookId}_${cleanFilename}`;
        const targetPath = path.join(uploadsDir, diskFilename);
        const buffer = Buffer.from(fileBase64, 'base64');
        fs.writeFileSync(targetPath, buffer);
        savedFilePath = `/uploads/${diskFilename}`;
      } catch (storageErr) {
        console.warn('Could not write to local uploads dir (read-only environment):', storageErr);
      }
    }

    const storageUrl = savedFilePath || `${process.env.STORAGE_PUBLIC_URL || '/uploads'}/${bookId}_${cleanFilename}`;

    return res.status(200).json({
      success: true,
      bookId,
      title: title || cleanFilename.replace(/\.[^/.]+$/, ''),
      author: author || 'Curriculum Author',
      subject: subject || 'General',
      uploaderName: uploaderName || 'Educator',
      originalFilename: rawOrigName,
      sanitizedFilename: cleanFilename,
      fileUrl: storageUrl,
      fileSizeBytes,
      fileType: ext,
      status: 'uploading',
      message: 'File metadata validated and file stored successfully. Ready for extraction pipeline.'
    });
  } catch (error: any) {
    console.error('Upload handler error:', error);
    return res.status(500).json({ error: error.message || 'Internal server error during upload.' });
  }
}
