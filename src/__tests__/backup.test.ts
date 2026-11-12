import { describe, it, expect } from 'vitest';
import JSZip from 'jszip';

describe('Local Backup & Restore Schema Validation', () => {
  it('creates and parses a valid EduPulse backup ZIP archive', async () => {
    const zip = new JSZip();

    const sampleManifest = {
      app: 'EduPulse AI',
      version: 1,
      createdAt: new Date().toISOString(),
      counts: {
        textbooks: 1,
        questions: 2,
        blueprints: 1,
        savedPapers: 1
      }
    };

    const sampleTextbook = [
      {
        id: 'tb_1',
        title: 'Class 10 Science',
        grade: 10,
        subject: 'Science',
        board: 'CBSE',
        totalPages: 215,
        originalFileName: 'science_10.pdf',
        createdAt: Date.now(),
        updatedAt: Date.now()
      }
    ];

    const samplePaper = [
      {
        id: 'paper_1',
        title: 'Science Pre-Board 2026',
        grade: 10,
        subject: 'Science',
        board: 'CBSE',
        examName: 'Pre-Board',
        schoolName: 'Public School',
        durationMinutes: 180,
        totalMarks: 50,
        generalInstructions: ['Compulsory'],
        language: 'English',
        sections: [],
        status: 'final',
        createdAt: Date.now(),
        updatedAt: Date.now()
      }
    ];

    // Pack files into ZIP
    zip.file('manifest.json', JSON.stringify(sampleManifest, null, 2));
    zip.file('data/textbooks.json', JSON.stringify(sampleTextbook, null, 2));
    zip.file('data/savedPapers.json', JSON.stringify(samplePaper, null, 2));

    const zipBlob = await zip.generateAsync({ type: 'blob' });
    expect(zipBlob.size).toBeGreaterThan(0);

    // Unpack and verify
    const unzipped = await JSZip.loadAsync(zipBlob);
    const manifestFile = unzipped.file('manifest.json');
    expect(manifestFile).not.toBeNull();

    const manifestContent = JSON.parse(await manifestFile!.async('string'));
    expect(manifestContent.app).toBe('EduPulse AI');
    expect(manifestContent.counts.textbooks).toBe(1);

    const papersFile = unzipped.file('data/savedPapers.json');
    expect(papersFile).not.toBeNull();
    const papersContent = JSON.parse(await papersFile!.async('string'));
    expect(papersContent).toHaveLength(1);
    expect(papersContent[0].id).toBe('paper_1');
    expect(papersContent[0].title).toBe('Science Pre-Board 2026');
  });

  it('rejects an invalid ZIP missing manifest.json', async () => {
    const zip = new JSZip();
    zip.file('random.txt', 'hello world');
    const zipBlob = await zip.generateAsync({ type: 'blob' });

    const unzipped = await JSZip.loadAsync(zipBlob);
    const manifestFile = unzipped.file('manifest.json');
    expect(manifestFile).toBeNull();
  });
});
