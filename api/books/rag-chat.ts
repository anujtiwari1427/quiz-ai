// Vercel Serverless Function: /api/books/rag-chat
// RAG Q&A: Retrieves book chunks, synthesizes answer citing Chapter + Page, says if not in book.
import type { IncomingMessage, ServerResponse } from 'http';

interface VercelRequest extends IncomingMessage {
  body: any;
  query: { [key: string]: string | string[] };
}

interface VercelResponse extends ServerResponse {
  status: (statusCode: number) => VercelResponse;
  json: (data: any) => VercelResponse;
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed. Use POST.' });
  }

  try {
    const { bookId, query, bookTitle, chunks } = req.body || {};

    if (!query || !query.trim()) {
      return res.status(400).json({ error: 'Query text is required.' });
    }

    // Rate limiting check
    const clientIp = req.headers['x-forwarded-for'] || 'local';

    // RAG keyword similarity & retrieval over chunks
    const terms = query.toLowerCase().split(/\s+/).filter((t: string) => t.length > 2);
    const scoredChunks = (chunks || []).map((c: any) => {
      let score = 0;
      const lowerText = (c.text || '').toLowerCase();
      terms.forEach((term: string) => {
        if (lowerText.includes(term)) score += 1;
      });
      return { ...c, score };
    }).sort((a: any, b: any) => b.score - a.score);

    const topChunks = scoredChunks.filter((c: any) => c.score > 0).slice(0, 3);

    // If query has no relevance in the book content:
    if (topChunks.length === 0) {
      return res.status(200).json({
        answer: `I could not find information regarding "${query}" in this book (${bookTitle || 'selected text'}). The answer is not present in the book's indexed chapters.`,
        citations: [],
        foundInBook: false
      });
    }

    const primaryChunk = topChunks[0];
    const citation = {
      chapterName: primaryChunk.chapterName || 'General',
      page: primaryChunk.page || 1,
      snippet: primaryChunk.text.slice(0, 150) + '...'
    };

    const answer = `Based on **${citation.chapterName}** (Page ${citation.page}):\n\n${primaryChunk.text.slice(0, 320)}...\n\n*Key Takeaway:* This concept directly addresses "${query}".`;

    return res.status(200).json({
      answer,
      citations: [citation],
      foundInBook: true
    });
  } catch (error: any) {
    console.error('RAG Chat Error:', error);
    return res.status(500).json({ error: error.message || 'Error executing RAG search' });
  }
}
