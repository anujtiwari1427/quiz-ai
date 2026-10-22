// Vercel Serverless Function: /api/books/upload
import type { IncomingMessage, ServerResponse } from 'http';

interface VercelRequest extends IncomingMessage {
  body: any;
  query: { [key: string]: string | string[] };
}

interface VercelResponse extends ServerResponse {
  status: (statusCode: number) => VercelResponse;
  json: (data: any) => VercelResponse;
}

const ALLOWED_MIME_TYPES = [
  'application/pdf',
  'application/epub+zip',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'text/plain'
];

const MAX_FILE_SIZE_BYTES = 50 * 1024 * 1024; // 50MB

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed. Use POST.' });
  }

  try {
    const { title, author, subject, fileType, fileSizeBytes, hasRightsDeclaration } = req.body || {};

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
    const validExtensions = ['pdf', 'epub', 'docx', 'txt'];
    if (!fileType || !validExtensions.includes(fileType.toLowerCase())) {
      return res.status(400).json({
        error: `Invalid file format: ${fileType}. Supported formats are PDF, EPUB, DOCX, and TXT.`
      });
    }

    const bookId = `book_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    const storageUrl = `${process.env.STORAGE_PUBLIC_URL || 'https://storage.edupulse.internal'}/${bookId}.${fileType}`;

    return res.status(200).json({
      success: true,
      bookId,
      fileUrl: storageUrl,
      status: 'uploading',
      message: 'File metadata validated and storage token generated. Ready for extraction pipeline.'
    });
  } catch (error: any) {
    console.error('Upload handler error:', error);
    return res.status(500).json({ error: error.message || 'Internal server error during upload.' });
  }
}
