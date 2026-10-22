/**
 * EduPulse AI - PDF Storage Service
 * Uses IndexedDB to store raw PDF Blobs locally in the browser.
 * Overcomes localStorage 5MB quotas to support 50MB+ textbooks reliably.
 */

const DB_NAME = 'EduPulse_PdfStorage_DB';
const DB_VERSION = 1;
const STORE_NAME = 'pdf_documents';

interface StoredPdfRecord {
  bookId: string;
  blob: Blob;
  fileName: string;
  fileSizeBytes: number;
  updatedAt: string;
}

class PdfStorageService {
  private dbPromise: Promise<IDBDatabase> | null = null;
  private memoryCache: Map<string, Blob> = new Map();

  private getDB(): Promise<IDBDatabase> {
    if (this.dbPromise) return this.dbPromise;

    if (typeof window === 'undefined' || !window.indexedDB) {
      return Promise.reject(new Error('IndexedDB is not available in this environment'));
    }

    this.dbPromise = new Promise((resolve, reject) => {
      const request = window.indexedDB.open(DB_NAME, DB_VERSION);

      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;
        if (!db.objectStoreNames.contains(STORE_NAME)) {
          db.createObjectStore(STORE_NAME, { keyPath: 'bookId' });
        }
      };

      request.onsuccess = () => {
        resolve(request.result);
      };

      request.onerror = () => {
        reject(request.error || new Error('Failed to open PDF IndexedDB'));
      };
    });

    return this.dbPromise;
  }

  /**
   * Save a PDF Blob associated with a book ID
   */
  async savePdfBlob(bookId: string, blob: Blob, fileName?: string): Promise<void> {
    this.memoryCache.set(bookId, blob);

    try {
      const db = await this.getDB();
      return new Promise((resolve, reject) => {
        const tx = db.transaction(STORE_NAME, 'readwrite');
        const store = tx.objectStore(STORE_NAME);

        const record: StoredPdfRecord = {
          bookId,
          blob,
          fileName: fileName || `${bookId}.pdf`,
          fileSizeBytes: blob.size,
          updatedAt: new Date().toISOString()
        };

        const req = store.put(record);
        req.onsuccess = () => resolve();
        req.onerror = () => reject(req.error);
      });
    } catch (err) {
      console.warn('[PdfStorageService] IndexedDB save failed, stored in memory cache:', err);
    }
  }

  /**
   * Retrieve a PDF Blob by book ID
   */
  async getPdfBlob(bookId: string): Promise<Blob | null> {
    if (this.memoryCache.has(bookId)) {
      return this.memoryCache.get(bookId) || null;
    }

    try {
      const db = await this.getDB();
      return new Promise((resolve, reject) => {
        const tx = db.transaction(STORE_NAME, 'readonly');
        const store = tx.objectStore(STORE_NAME);
        const req = store.get(bookId);

        req.onsuccess = () => {
          const result = req.result as StoredPdfRecord | undefined;
          if (result && result.blob) {
            this.memoryCache.set(bookId, result.blob);
            resolve(result.blob);
          } else {
            resolve(null);
          }
        };

        req.onerror = () => reject(req.error);
      });
    } catch (err) {
      console.warn('[PdfStorageService] IndexedDB get failed:', err);
      return null;
    }
  }

  /**
   * Check if a PDF blob exists in storage
   */
  async hasPdf(bookId: string): Promise<boolean> {
    if (this.memoryCache.has(bookId)) return true;
    const blob = await this.getPdfBlob(bookId);
    return blob !== null;
  }

  /**
   * Delete a PDF from storage
   */
  async deletePdf(bookId: string): Promise<void> {
    this.memoryCache.delete(bookId);
    try {
      const db = await this.getDB();
      return new Promise((resolve, reject) => {
        const tx = db.transaction(STORE_NAME, 'readwrite');
        const store = tx.objectStore(STORE_NAME);
        const req = store.delete(bookId);
        req.onsuccess = () => resolve();
        req.onerror = () => reject(req.error);
      });
    } catch (err) {
      console.warn('[PdfStorageService] IndexedDB delete failed:', err);
    }
  }
}

export const PDF_STORAGE_SERVICE = new PdfStorageService();
