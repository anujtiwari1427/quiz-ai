import { 
  IngestedSource, 
  StudySummary, 
  SmartNotes, 
  FlashcardDeck, 
  StudioQuiz 
} from '../types/strater';

export const EXPORT_SERVICE = {
  /**
   * Export all study artifacts for a source into a structured Markdown document
   */
  exportToMarkdown(
    source: IngestedSource,
    summary?: StudySummary | null,
    notes?: SmartNotes | null,
    deck?: FlashcardDeck | null,
    quiz?: StudioQuiz | null
  ): string {
    let md = `# 📚 ${source.title}\n\n`;
    md += `*Source Type: ${source.sourceType.toUpperCase()} | Reading Time: ~${source.readingTimeMinutes} min | Word Count: ${source.wordCount} words*\n`;
    if (source.sourceUrl) md += `*Original URL: [${source.sourceUrl}](${source.sourceUrl})*\n`;
    md += `*Generated via Edu AI Learning Platform on ${new Date().toLocaleDateString()}*\n\n`;
    md += `---\n\n`;

    // 1. Summary
    if (summary) {
      md += `## 💡 Executive Summary\n\n`;
      md += `> **TL;DR**: ${summary.tldr}\n\n`;
      md += `${summary.executiveSummary}\n\n`;

      md += `### 🔑 Key Takeaways\n`;
      summary.keyTakeaways.forEach((kt, idx) => {
        md += `- ${kt.important ? '⭐ ' : ''}${kt.text}\n`;
      });
      md += `\n`;

      md += `### 🧠 Core Concepts\n`;
      summary.concepts.forEach(c => {
        md += `#### ${c.name} (${c.complexity})\n`;
        md += `- **Summary**: ${c.oneLineSummary}\n`;
        md += `- **Explanation**: ${c.inDepthExplanation}\n`;
        md += `- **Analogy**: *${c.analogy}*\n\n`;
      });

      md += `### 📖 Domain Glossary\n`;
      summary.glossary.forEach(g => {
        md += `- **${g.term}**: ${g.definition} *(Context: ${g.context})*\n`;
      });
      md += `\n---\n\n`;
    }

    // 2. Smart Notes (Cornell Format)
    if (notes) {
      md += `## 📝 Smart Cornell Notes\n\n`;
      md += `### Cues & Recall Prompts\n`;
      notes.cues.forEach(c => {
        md += `- ❓ **${c.cueQuestion}** [${c.tags.join(', ')}]\n`;
      });
      md += `\n`;

      md += `### Detailed Notes\n\n${notes.notesMarkdown}\n\n`;
      md += `### Action Items\n`;
      notes.actionItems.forEach(item => {
        md += `- [ ] ${item}\n`;
      });
      md += `\n---\n\n`;
    }

    // 3. Flashcards
    if (deck && deck.cards.length > 0) {
      md += `## 🗂️ Flashcard Deck (${deck.cards.length} Cards)\n\n`;
      deck.cards.forEach((card, idx) => {
        md += `**Card ${idx + 1}** [${card.tags.join(', ')}]\n`;
        md += `- **Front**: ${card.front}\n`;
        md += `- **Back**: ${card.back}\n`;
        if (card.hint) md += `- *Hint*: ${card.hint}\n`;
        if (card.citation) md += `- *Source*: ${card.citation}\n`;
        md += `\n`;
      });
      md += `---\n\n`;
    }

    // 4. Assessment Quiz
    if (quiz && quiz.questions.length > 0) {
      md += `## 🎯 Practice Assessment Quiz\n\n`;
      quiz.questions.forEach((q, idx) => {
        md += `### Question ${idx + 1} (${q.difficulty.toUpperCase()} • Bloom's: ${q.bloomsLevel})\n`;
        md += `${q.prompt}\n\n`;
        if (q.options) {
          q.options.forEach(opt => {
            md += `- [ ] ${opt.text}\n`;
          });
          md += `\n`;
        }
        md += `<details><summary>Reveal Answer & Explanation</summary>\n\n`;
        md += `**Correct Answer**: \`${q.correctAnswer}\`\n\n`;
        md += `**Explanation**: ${q.explanation}\n`;
        if (q.citation) md += `*Reference: ${q.citation}*\n`;
        md += `</details>\n\n`;
      });
    }

    return md;
  },

  /**
   * Export Flashcards formatted for Anki (.txt tab-separated)
   */
  exportToAnki(deck: FlashcardDeck): string {
    let ankiText = `#separator:tab\n#html:true\n#tags column:3\n`;
    deck.cards.forEach(c => {
      const frontHtml = c.front.replace(/\t/g, ' ').replace(/\n/g, '<br>');
      let backHtml = c.back.replace(/\t/g, ' ').replace(/\n/g, '<br>');
      if (c.hint) backHtml += `<br><br><small><i>Hint: ${c.hint}</i></small>`;
      if (c.citation) backHtml += `<br><small style="color:#888;">Ref: ${c.citation}</small>`;
      const tags = (c.tags || []).map(t => t.replace(/\s+/g, '_')).join(' ');
      ankiText += `${frontHtml}\t${backHtml}\t${tags || 'EduAI'}\n`;
    });
    return ankiText;
  },

  /**
   * Download a string as a file in browser
   */
  downloadStringAsFile(filename: string, content: string, contentType: string = 'text/plain') {
    const blob = new Blob([content], { type: contentType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  },

  /**
   * Trigger clean browser print preview for printable study sheet
   */
  triggerPrintStudySheet(sourceTitle: string) {
    window.print();
  }
};
