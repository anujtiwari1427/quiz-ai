import JSZip from 'jszip';
import { db } from '../db';
import { 
  TextbookRecord, 
  QuestionItem, 
  PaperBlueprint, 
  SavedPaper 
} from '../types';

const DIR_HANDLE_KEY = 'libraryDirectoryHandle';
const LAST_BACKUP_DATE_KEY = 'lastBackupTimestamp';
const PAPERS_CREATED_SINCE_BACKUP_KEY = 'papersCreatedSinceBackup';

export class FileSystemService {
  private dirHandle: FileSystemDirectoryHandle | null = null;

  /**
   * Check if the File System Access API is supported by the current browser (Chrome / Edge)
   */
  isFileSystemAccessSupported(): boolean {
    return typeof window !== 'undefined' && 'showDirectoryPicker' in window;
  }

  /**
   * Load stored directory handle from IndexedDB on startup
   */
  async initStoredDirectory(): Promise<boolean> {
    if (!this.isFileSystemAccessSupported()) return false;
    try {
      const stored = await db.settings.get(DIR_HANDLE_KEY);
      if (stored && stored.value) {
        this.dirHandle = stored.value as FileSystemDirectoryHandle;
        return true;
      }
    } catch (e) {
      console.warn('Could not restore stored folder handle:', e);
    }
    return false;
  }

  /**
   * Let user choose a root folder e.g. "EduPulse Library"
   */
  async selectLibraryFolder(): Promise<{ success: boolean; name?: string; error?: string }> {
    if (!this.isFileSystemAccessSupported()) {
      return { success: false, error: 'File System Access API is not supported in this browser.' };
    }
    try {
      const handle = await (window as any).showDirectoryPicker({
        mode: 'readwrite',
        startIn: 'documents'
      });

      this.dirHandle = handle;
      await db.settings.put({ key: DIR_HANDLE_KEY, value: handle });

      // Create standard subfolder hierarchy
      await this.ensureSubdirectories();

      return { success: true, name: handle.name };
    } catch (err: any) {
      if (err.name === 'AbortError') {
        return { success: false, error: 'User cancelled folder selection.' };
      }
      return { success: false, error: err.message || 'Failed to select folder.' };
    }
  }

  /**
   * Verify and request permission if handle has expired (e.g. across browser sessions)
   */
  async verifyPermission(readWrite = true): Promise<boolean> {
    if (!this.dirHandle) return false;
    const options: any = {};
    if (readWrite) options.mode = 'readwrite';

    try {
      if ((await (this.dirHandle as any).queryPermission(options)) === 'granted') {
        return true;
      }
      if ((await (this.dirHandle as any).requestPermission(options)) === 'granted') {
        return true;
      }
    } catch (e) {
      console.warn('Failed to verify folder permission:', e);
    }
    return false;
  }

  /**
   * Create standard folder structure:
   * /Textbooks, /QuestionBanks, /Papers, /Exports
   */
  async ensureSubdirectories() {
    if (!this.dirHandle) return;
    const hasPerm = await this.verifyPermission(true);
    if (!hasPerm) return;

    try {
      await this.dirHandle.getDirectoryHandle('Textbooks', { create: true });
      await this.dirHandle.getDirectoryHandle('QuestionBanks', { create: true });
      await this.dirHandle.getDirectoryHandle('Papers', { create: true });
      await this.dirHandle.getDirectoryHandle('Exports', { create: true });
    } catch (e) {
      console.warn('Could not ensure subdirectories:', e);
    }
  }

  /**
   * Save uploaded textbook original binary file and metadata into /Textbooks
   */
  async saveTextbookToFolder(textbook: TextbookRecord, fileBlob?: Blob) {
    if (!this.dirHandle) return;
    const hasPerm = await this.verifyPermission(true);
    if (!hasPerm) return;

    try {
      const tbDir = await this.dirHandle.getDirectoryHandle('Textbooks', { create: true });
      
      // Save metadata JSON
      const jsonFileName = `${sanitizeFileName(textbook.title)}_meta.json`;
      const jsonFileHandle = await tbDir.getFileHandle(jsonFileName, { create: true });
      const jsonWritable = await (jsonFileHandle as any).createWritable();
      await jsonWritable.write(JSON.stringify(textbook, null, 2));
      await jsonWritable.close();

      // Save binary blob if available
      if (fileBlob) {
        const binFileName = textbook.originalFileName || `${sanitizeFileName(textbook.title)}.pdf`;
        const binFileHandle = await tbDir.getFileHandle(binFileName, { create: true });
        const binWritable = await (binFileHandle as any).createWritable();
        await binWritable.write(fileBlob);
        await binWritable.close();
      }
    } catch (e) {
      console.warn('Failed to save textbook into folder:', e);
    }
  }

  /**
   * Save uploaded textbook binary directly by filename
   */
  async saveTextbookFile(fileName: string, fileBlob: Blob) {
    if (!this.dirHandle) return;
    const hasPerm = await this.verifyPermission(true);
    if (!hasPerm) return;
    try {
      const tbDir = await this.dirHandle.getDirectoryHandle('Textbooks', { create: true });
      const binFileHandle = await tbDir.getFileHandle(fileName, { create: true });
      const binWritable = await (binFileHandle as any).createWritable();
      await binWritable.write(fileBlob);
      await binWritable.close();
    } catch (e) {
      console.warn('Could not mirror textbook file to folder:', e);
    }
  }

  /**
   * Save paper JSON into /Papers/<class>-<subject>/
   */
  async savePaperToFolder(paper: SavedPaper) {
    if (!this.dirHandle) return;
    const hasPerm = await this.verifyPermission(true);
    if (!hasPerm) return;

    try {
      const papersDir = await this.dirHandle.getDirectoryHandle('Papers', { create: true });
      const folderName = `Class_${paper.grade}_${sanitizeFileName(paper.subject)}`;
      const classSubjectDir = await papersDir.getDirectoryHandle(folderName, { create: true });

      const fileName = `${sanitizeFileName(paper.title)}.json`;
      const fileHandle = await classSubjectDir.getFileHandle(fileName, { create: true });
      const writable = await (fileHandle as any).createWritable();
      await writable.write(JSON.stringify(paper, null, 2));
      await writable.close();
    } catch (e) {
      console.warn('Failed to save paper into folder:', e);
    }
  }

  /**
   * Save exported PDF or DOCX file to /Exports
   */
  async saveExportFile(fileName: string, blob: Blob): Promise<boolean> {
    if (this.dirHandle && (await this.verifyPermission(true))) {
      try {
        const exportsDir = await this.dirHandle.getDirectoryHandle('Exports', { create: true });
        const fileHandle = await exportsDir.getFileHandle(fileName, { create: true });
        const writable = await (fileHandle as any).createWritable();
        await writable.write(blob);
        await writable.close();
        return true;
      } catch (e) {
        console.warn('Failed to write export file to folder handle, falling back to download:', e);
      }
    }
    // Safari / Firefox fallback: trigger download
    this.triggerBrowserDownload(blob, fileName);
    return true;
  }

  /**
   * Trigger standard browser download for fallback
   */
  triggerBrowserDownload(blob: Blob, fileName: string) {
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    setTimeout(() => URL.revokeObjectURL(url), 2000);
  }

  /**
   * Create Full Backup ZIP of all local data
   */
  async createFullBackupZip(): Promise<Blob> {
    const zip = new JSZip();

    // 1. Export all tables as JSON
    const [textbooks, chapters, chunks, questions, blueprints, savedPapers] = await Promise.all([
      db.textbooks.toArray(),
      db.chapters.toArray(),
      db.textbookChunks.toArray(),
      db.questionBank.toArray(),
      db.blueprints.toArray(),
      db.savedPapers.toArray()
    ]);

    const backupManifest = {
      app: 'EduPulse AI',
      version: '1.0.0',
      exportedAt: new Date().toISOString(),
      counts: {
        textbooks: textbooks.length,
        chapters: chapters.length,
        chunks: chunks.length,
        questions: questions.length,
        blueprints: blueprints.length,
        savedPapers: savedPapers.length
      }
    };

    zip.file('manifest.json', JSON.stringify(backupManifest, null, 2));
    zip.file('data/textbooks.json', JSON.stringify(textbooks.map(t => ({ ...t, fileBlob: undefined })), null, 2));
    zip.file('data/chapters.json', JSON.stringify(chapters, null, 2));
    zip.file('data/chunks.json', JSON.stringify(chunks, null, 2));
    zip.file('data/questionBank.json', JSON.stringify(questions, null, 2));
    zip.file('data/blueprints.json', JSON.stringify(blueprints, null, 2));
    zip.file('data/savedPapers.json', JSON.stringify(savedPapers, null, 2));

    // 2. Add PDF file blobs
    const filesFolder = zip.folder('files');
    if (filesFolder) {
      for (const tb of textbooks) {
        if (tb.fileBlob) {
          filesFolder.file(`${tb.id}_${tb.originalFileName}`, tb.fileBlob);
        }
      }
    }

    const content = await zip.generateAsync({ type: 'blob' });

    // Update last backup timestamp
    await db.settings.put({ key: LAST_BACKUP_DATE_KEY, value: Date.now() });
    await db.settings.put({ key: PAPERS_CREATED_SINCE_BACKUP_KEY, value: 0 });

    return content;
  }

  /**
   * One-click download of full backup ZIP
   */
  async exportFullBackupZip(): Promise<{ success: boolean; error?: string }> {
    try {
      const blob = await this.createFullBackupZip();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `EduPulse-Backup-${new Date().toISOString().slice(0, 10)}.zip`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      return { success: true };
    } catch (err: any) {
      return { success: false, error: err.message || 'Export backup failed' };
    }
  }

  /**
   * Restore Full Backup from a ZIP file
   */
  async restoreFromBackupZip(file: File, mode: 'merge' | 'overwrite' = 'merge'): Promise<{ success: boolean; counts?: any; error?: string }> {
    try {
      const zip = await JSZip.loadAsync(file);
      const manifestFile = zip.file('manifest.json');
      if (!manifestFile) {
        return { success: false, error: 'Invalid backup file: manifest.json is missing.' };
      }

      const manifest = JSON.parse(await manifestFile.async('text'));
      if (manifest.app !== 'EduPulse AI') {
        return { success: false, error: 'Unrecognized backup format: Not an EduPulse AI backup.' };
      }

      if (mode === 'overwrite') {
        await Promise.all([
          db.textbooks.clear(),
          db.chapters.clear(),
          db.textbookChunks.clear(),
          db.questionBank.clear(),
          db.blueprints.clear(),
          db.savedPapers.clear()
        ]);
      }

      // Read and restore tables
      const getJson = async (path: string) => {
        const f = zip.file(path);
        return f ? JSON.parse(await f.async('text')) : [];
      };

      const [textbooks, chapters, chunks, questions, blueprints, savedPapers] = await Promise.all([
        getJson('data/textbooks.json'),
        getJson('data/chapters.json'),
        getJson('data/chunks.json'),
        getJson('data/questionBank.json'),
        getJson('data/blueprints.json'),
        getJson('data/savedPapers.json')
      ]);

      // Re-attach blobs if present
      for (const tb of textbooks) {
        const binFile = zip.file(`files/${tb.id}_${tb.originalFileName}`);
        if (binFile) {
          tb.fileBlob = await binFile.async('blob');
        }
      }

      await Promise.all([
        db.textbooks.bulkPut(textbooks),
        db.chapters.bulkPut(chapters),
        db.textbookChunks.bulkPut(chunks),
        db.questionBank.bulkPut(questions),
        db.blueprints.bulkPut(blueprints),
        db.savedPapers.bulkPut(savedPapers)
      ]);

      return {
        success: true,
        counts: {
          textbooks: textbooks.length,
          questions: questions.length,
          blueprints: blueprints.length,
          savedPapers: savedPapers.length
        }
      };
    } catch (err: any) {
      return { success: false, error: err.message || 'Failed to restore backup.' };
    }
  }

  /**
   * Check if user should be reminded to back up
   * Trigger condition: > 7 days since last backup, or >= 3 new papers created
   */
  async shouldShowBackupReminder(): Promise<boolean> {
    const lastBackup = await db.settings.get(LAST_BACKUP_DATE_KEY);
    const newPapersCount = await db.settings.get(PAPERS_CREATED_SINCE_BACKUP_KEY);

    const sevenDaysMs = 7 * 24 * 60 * 60 * 1000;
    const isOverdue = !lastBackup || (Date.now() - (lastBackup.value || 0)) > sevenDaysMs;
    const hasUnsavedPapers = (newPapersCount?.value || 0) >= 3;

    return isOverdue || hasUnsavedPapers;
  }

  async recordBackupEvent() {
    await db.settings.put({ key: LAST_BACKUP_DATE_KEY, value: Date.now() });
    await db.settings.put({ key: PAPERS_CREATED_SINCE_BACKUP_KEY, value: 0 });
  }

  async recordPaperCreated() {
    const current = await db.settings.get(PAPERS_CREATED_SINCE_BACKUP_KEY);
    const count = (current?.value || 0) + 1;
    await db.settings.put({ key: PAPERS_CREATED_SINCE_BACKUP_KEY, value: count });
  }

  getConnectedFolderName(): string | null {
    return this.dirHandle ? this.dirHandle.name : null;
  }
}

export const FILE_SYSTEM_SERVICE = new FileSystemService();

function sanitizeFileName(name: string): string {
  return name.replace(/[^a-zA-Z0-9_\-]/g, '_').replace(/_+/g, '_').slice(0, 50);
}
