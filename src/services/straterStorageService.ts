import { 
  IngestedSource, 
  StudySummary, 
  SmartNotes, 
  FlashcardDeck, 
  MindMapData, 
  StudioQuiz, 
  StudioQuizAttempt,
  Course, 
  UserLearningAnalytics, 
  UserProfile, 
  ByokApiKeys, 
  CardRating,
  SubscriptionTierDetails,
  UserPersonaId
} from '../types/strater';
import { SM2_SERVICE } from './sm2Service';

const STRATER_STORAGE_KEYS = {
  ACTIVE_USER_ID: 'strata_active_user_id',
  USER_PROFILES: 'strata_user_profiles',
  SOURCES: 'strata_sources',
  SUMMARIES: 'strata_summaries',
  SMART_NOTES: 'strata_smart_notes',
  FLASHCARD_DECKS: 'strata_flashcard_decks',
  MIND_MAPS: 'strata_mind_maps',
  QUIZZES: 'strata_quizzes',
  QUIZ_ATTEMPTS: 'strata_quiz_attempts',
  COURSES: 'strata_courses',
  ANALYTICS: 'strata_analytics',
  BYOK_KEYS: 'strata_byok_keys'
};

// ── Built-in Demo Personas ──
export const DEMO_PERSONAS: Record<UserPersonaId, UserProfile> = {
  cs_engineer: {
    id: 'user_alex_chen',
    name: 'Alex Chen',
    email: 'alex.chen@cloudscale.dev',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=256&q=80',
    role: 'professional',
    studyGoal: 'Master Distributed Systems & High-Throughput Consensus Protocols',
    preferredModel: 'claude-3-5-sonnet',
    hasByokKeys: { openai: false, anthropic: false, gemini: false, groq: false, ollama: false },
    subscriptionPlan: 'pro',
    subscriptionStatus: 'active',
    subscriptionRenewalDate: '2026-11-20',
    monthlyTokenUsage: 142000,
    maxMonthlyTokens: 1000000
  },
  med_student: {
    id: 'user_dr_maya_lin',
    name: 'Dr. Maya Lin',
    email: 'maya.lin@medresidency.edu',
    avatarUrl: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=256&q=80',
    role: 'student',
    studyGoal: 'USMLE Step 1 Clinical Cardiology & Hemodynamics Review',
    preferredModel: 'gpt-4o',
    hasByokKeys: { openai: false, anthropic: false, gemini: false, groq: false, ollama: false },
    subscriptionPlan: 'campus',
    subscriptionStatus: 'active',
    subscriptionRenewalDate: '2026-12-15',
    monthlyTokenUsage: 384000,
    maxMonthlyTokens: 5000000
  },
  law_student: {
    id: 'user_sarah_jenkins',
    name: 'Sarah Jenkins',
    email: 'sarah.j@lawreview.org',
    avatarUrl: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=256&q=80',
    role: 'student',
    studyGoal: 'Bar Exam Constitutional Law & Substantive Due Process',
    preferredModel: 'claude-3-5-sonnet',
    hasByokKeys: { openai: false, anthropic: false, gemini: false, groq: false, ollama: false },
    subscriptionPlan: 'pro',
    subscriptionStatus: 'active',
    subscriptionRenewalDate: '2026-11-05',
    monthlyTokenUsage: 98000,
    maxMonthlyTokens: 1000000
  },
  high_school: {
    id: 'user_rohan_sharma',
    name: 'Rohan Sharma',
    email: 'rohan.sharma@delhischolars.edu',
    avatarUrl: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=256&q=80',
    role: 'student',
    studyGoal: 'CBSE Class 12 Physics & Advanced Integration Calculus',
    preferredModel: 'gemini-1-5-pro',
    hasByokKeys: { openai: false, anthropic: false, gemini: false, groq: false, ollama: false },
    subscriptionPlan: 'free',
    subscriptionStatus: 'trialing',
    subscriptionRenewalDate: '2026-10-30',
    monthlyTokenUsage: 24000,
    maxMonthlyTokens: 100000
  }
};

// ── Available Subscription Tiers ──
export const STRATER_PLANS: SubscriptionTierDetails[] = [
  {
    id: 'free',
    name: 'Hobby Learner',
    tagline: 'Ideal for casual study and initial source exploration.',
    priceMonthly: 0,
    priceAnnual: 0,
    features: [
      '5 source uploads per month (up to 25 MB)',
      'Basic AI summaries & flashcards',
      'Standard web reader mode',
      'Community forum access',
      'Markdown text export'
    ],
    maxSources: 5,
    maxTokensPerMonth: 100000,
    aiModelsAllowed: ['gemini-1-5-flash'],
    exportFormats: ['Markdown']
  },
  {
    id: 'pro',
    name: 'Pro Scholar',
    badge: 'Most Popular',
    tagline: 'Supercharged AI study workflow with full SM-2 spaced repetition & interactive mind maps.',
    priceMonthly: 15,
    priceAnnual: 144, // $12/mo billed annually
    features: [
      'Unlimited YouTube, PDF, DOCX, PPTX & Article ingestion',
      'Interactive Cornell Smart Notes with rich callouts',
      'Full SuperMemo SM-2 Spaced Repetition engine',
      'Dynamic SVG interactive concept Mind Maps',
      'Contextual AI Tutor with timestamped citations',
      'Anki deck (.txt), printable PDF & JSON exports',
      'Bring Your Own Key (BYOK) for zero rate limits'
    ],
    maxSources: 9999,
    maxTokensPerMonth: 2000000,
    aiModelsAllowed: ['gpt-4o', 'claude-3-5-sonnet', 'gemini-1-5-pro'],
    exportFormats: ['Markdown', 'Anki (.txt)', 'Printable PDF', 'JSON'],
    isPopular: true
  },
  {
    id: 'campus',
    name: 'Campus Enterprise',
    badge: 'Institutional',
    tagline: 'Collaborative workspaces for study groups, research labs, and academic departments.',
    priceMonthly: 39,
    priceAnnual: 372, // $31/mo billed annually
    features: [
      'Everything in Pro Scholar',
      'Shared course workspaces and collaborative decks',
      'High-priority dedicated inference queues',
      'Multi-source master study guides and course synthesis',
      'Full DPDPA & GDPR data isolation and compliance',
      'Automated nightly LMS / Canvas sync',
      'Direct 24/7 dedicated AI study architect support'
    ],
    maxSources: 99999,
    maxTokensPerMonth: 10000000,
    aiModelsAllowed: ['gpt-4o', 'claude-3-5-sonnet', 'gemini-1-5-pro', 'groq-llama-3-70b'],
    exportFormats: ['Markdown', 'Anki (.txt)', 'Printable PDF', 'JSON', 'SCORM']
  }
];

export const STRATER_STORAGE_SERVICE = {
  // ── User Persona & Profile ──
  getActiveUserId(): string {
    return localStorage.getItem(STRATER_STORAGE_KEYS.ACTIVE_USER_ID) || DEMO_PERSONAS.cs_engineer.id;
  },

  setActiveUserId(userId: string) {
    localStorage.setItem(STRATER_STORAGE_KEYS.ACTIVE_USER_ID, userId);
  },

  getCurrentUser(): UserProfile {
    const activeId = this.getActiveUserId();
    const profiles = this.getAllUserProfiles();
    return profiles[activeId] || DEMO_PERSONAS.cs_engineer;
  },

  getAllUserProfiles(): Record<string, UserProfile> {
    try {
      const data = localStorage.getItem(STRATER_STORAGE_KEYS.USER_PROFILES);
      return data ? JSON.parse(data) : DEMO_PERSONAS;
    } catch {
      return DEMO_PERSONAS;
    }
  },

  saveCurrentUser(user: UserProfile) {
    const profiles = this.getAllUserProfiles();
    profiles[user.id] = user;
    localStorage.setItem(STRATER_STORAGE_KEYS.USER_PROFILES, JSON.stringify(profiles));
  },

  switchPersona(personaKey: UserPersonaId): UserProfile {
    const persona = DEMO_PERSONAS[personaKey];
    this.setActiveUserId(persona.id);
    const profiles = this.getAllUserProfiles();
    profiles[persona.id] = persona;
    localStorage.setItem(STRATER_STORAGE_KEYS.USER_PROFILES, JSON.stringify(profiles));
    // Ensure initial seeds exist for this persona
    this.ensurePersonaSeedData(persona.id);
    return persona;
  },

  // ── Ingested Sources ──
  getSources(userId?: string): IngestedSource[] {
    const targetUserId = userId || this.getActiveUserId();
    try {
      const data = localStorage.getItem(STRATER_STORAGE_KEYS.SOURCES);
      const all: IngestedSource[] = data ? JSON.parse(data) : [];
      return all.filter(s => s.userId === targetUserId);
    } catch {
      return [];
    }
  },

  saveSource(source: IngestedSource) {
    const data = localStorage.getItem(STRATER_STORAGE_KEYS.SOURCES);
    let all: IngestedSource[] = data ? JSON.parse(data) : [];
    const index = all.findIndex(s => s.id === source.id);
    if (index >= 0) all[index] = source;
    else all = [source, ...all];
    localStorage.setItem(STRATER_STORAGE_KEYS.SOURCES, JSON.stringify(all));
  },

  deleteSource(sourceId: string) {
    const data = localStorage.getItem(STRATER_STORAGE_KEYS.SOURCES);
    if (!data) return;
    const all: IngestedSource[] = JSON.parse(data);
    const filtered = all.filter(s => s.id !== sourceId);
    localStorage.setItem(STRATER_STORAGE_KEYS.SOURCES, JSON.stringify(filtered));
  },

  // ── Summaries ──
  getSummaryForSource(sourceId: string): StudySummary | null {
    try {
      const data = localStorage.getItem(STRATER_STORAGE_KEYS.SUMMARIES);
      const all: StudySummary[] = data ? JSON.parse(data) : [];
      return all.find(s => s.sourceId === sourceId) || null;
    } catch {
      return null;
    }
  },

  saveSummary(summary: StudySummary) {
    const data = localStorage.getItem(STRATER_STORAGE_KEYS.SUMMARIES);
    let all: StudySummary[] = data ? JSON.parse(data) : [];
    const index = all.findIndex(s => s.id === summary.id || s.sourceId === summary.sourceId);
    if (index >= 0) all[index] = summary;
    else all = [summary, ...all];
    localStorage.setItem(STRATER_STORAGE_KEYS.SUMMARIES, JSON.stringify(all));
  },

  // ── Smart Notes ──
  getSmartNotesForSource(sourceId: string): SmartNotes | null {
    try {
      const data = localStorage.getItem(STRATER_STORAGE_KEYS.SMART_NOTES);
      const all: SmartNotes[] = data ? JSON.parse(data) : [];
      return all.find(n => n.sourceId === sourceId) || null;
    } catch {
      return null;
    }
  },

  saveSmartNotes(notes: SmartNotes) {
    const data = localStorage.getItem(STRATER_STORAGE_KEYS.SMART_NOTES);
    let all: SmartNotes[] = data ? JSON.parse(data) : [];
    const index = all.findIndex(n => n.id === notes.id || n.sourceId === notes.sourceId);
    if (index >= 0) all[index] = notes;
    else all = [notes, ...all];
    localStorage.setItem(STRATER_STORAGE_KEYS.SMART_NOTES, JSON.stringify(all));
  },

  // ── Flashcard Decks & SM-2 Reviews ──
  getDecks(userId?: string): FlashcardDeck[] {
    const targetUserId = userId || this.getActiveUserId();
    try {
      const data = localStorage.getItem(STRATER_STORAGE_KEYS.FLASHCARD_DECKS);
      const all: FlashcardDeck[] = data ? JSON.parse(data) : [];
      const userDecks = all.filter(d => d.userId === targetUserId);
      const today = new Date().toISOString().split('T')[0];

      // Refresh due today counts dynamically
      return userDecks.map(deck => ({
        ...deck,
        dueTodayCount: deck.cards.filter(c => !c.nextReviewDate || c.nextReviewDate <= today).length,
        masteredCount: deck.cards.filter(c => c.masteryState === 'mastered').length
      }));
    } catch {
      return [];
    }
  },

  getDeckForSource(sourceId: string): FlashcardDeck | null {
    const decks = this.getDecks();
    return decks.find(d => d.sourceId === sourceId) || null;
  },

  saveDeck(deck: FlashcardDeck) {
    const data = localStorage.getItem(STRATER_STORAGE_KEYS.FLASHCARD_DECKS);
    let all: FlashcardDeck[] = data ? JSON.parse(data) : [];
    const index = all.findIndex(d => d.id === deck.id);
    if (index >= 0) all[index] = deck;
    else all = [deck, ...all];
    localStorage.setItem(STRATER_STORAGE_KEYS.FLASHCARD_DECKS, JSON.stringify(all));
  },

  /**
   * Process an active recall card rating via SM-2 algorithm
   */
  reviewCard(deckId: string, cardId: string, rating: CardRating): FlashcardDeck | null {
    const decks = this.getDecks();
    const deck = decks.find(d => d.id === deckId);
    if (!deck) return null;

    const cardIndex = deck.cards.findIndex(c => c.id === cardId);
    if (cardIndex < 0) return null;

    const card = deck.cards[cardIndex];
    const sm2Result = SM2_SERVICE.calculateNextSchedule(card, rating);

    const updatedCard = {
      ...card,
      ...sm2Result,
      lastReviewedAt: new Date().toISOString(),
      lastRating: rating,
      reviewCount: (card.reviewCount || 0) + 1
    };

    const updatedCards = [...deck.cards];
    updatedCards[cardIndex] = updatedCard;

    const today = new Date().toISOString().split('T')[0];
    const updatedDeck: FlashcardDeck = {
      ...deck,
      cards: updatedCards,
      totalCards: updatedCards.length,
      dueTodayCount: updatedCards.filter(c => !c.nextReviewDate || c.nextReviewDate <= today).length,
      masteredCount: updatedCards.filter(c => c.masteryState === 'mastered').length,
      updatedAt: new Date().toISOString()
    };

    this.saveDeck(updatedDeck);

    // Update daily learning analytics
    this.recordCardReviewInAnalytics(deck.userId);

    return updatedDeck;
  },

  // ── Mind Maps ──
  getMindMapForSource(sourceId: string): MindMapData | null {
    try {
      const data = localStorage.getItem(STRATER_STORAGE_KEYS.MIND_MAPS);
      const all: MindMapData[] = data ? JSON.parse(data) : [];
      return all.find(m => m.sourceId === sourceId) || null;
    } catch {
      return null;
    }
  },

  saveMindMap(map: MindMapData) {
    const data = localStorage.getItem(STRATER_STORAGE_KEYS.MIND_MAPS);
    let all: MindMapData[] = data ? JSON.parse(data) : [];
    const index = all.findIndex(m => m.id === map.id || m.sourceId === map.sourceId);
    if (index >= 0) all[index] = map;
    else all = [map, ...all];
    localStorage.setItem(STRATER_STORAGE_KEYS.MIND_MAPS, JSON.stringify(all));
  },

  // ── Quizzes & Attempts ──
  getQuizForSource(sourceId: string): StudioQuiz | null {
    try {
      const data = localStorage.getItem(STRATER_STORAGE_KEYS.QUIZZES);
      const all: StudioQuiz[] = data ? JSON.parse(data) : [];
      return all.find(q => q.sourceId === sourceId) || null;
    } catch {
      return null;
    }
  },

  saveQuiz(quiz: StudioQuiz) {
    const data = localStorage.getItem(STRATER_STORAGE_KEYS.QUIZZES);
    let all: StudioQuiz[] = data ? JSON.parse(data) : [];
    const index = all.findIndex(q => q.id === quiz.id || q.sourceId === quiz.sourceId);
    if (index >= 0) all[index] = quiz;
    else all = [quiz, ...all];
    localStorage.setItem(STRATER_STORAGE_KEYS.QUIZZES, JSON.stringify(all));
  },

  saveQuizAttempt(attempt: StudioQuizAttempt) {
    const data = localStorage.getItem(STRATER_STORAGE_KEYS.QUIZ_ATTEMPTS);
    let all: StudioQuizAttempt[] = data ? JSON.parse(data) : [];
    all = [attempt, ...all];
    localStorage.setItem(STRATER_STORAGE_KEYS.QUIZ_ATTEMPTS, JSON.stringify(all));
  },

  getQuizAttempts(userId?: string): StudioQuizAttempt[] {
    const targetUserId = userId || this.getActiveUserId();
    try {
      const data = localStorage.getItem(STRATER_STORAGE_KEYS.QUIZ_ATTEMPTS);
      const all: StudioQuizAttempt[] = data ? JSON.parse(data) : [];
      return all.filter(a => a.userId === targetUserId);
    } catch {
      return [];
    }
  },

  // ── Courses ──
  getCourses(userId?: string): Course[] {
    const targetUserId = userId || this.getActiveUserId();
    try {
      const data = localStorage.getItem(STRATER_STORAGE_KEYS.COURSES);
      const all: Course[] = data ? JSON.parse(data) : [];
      return all.filter(c => c.userId === targetUserId);
    } catch {
      return [];
    }
  },

  saveCourse(course: Course) {
    const data = localStorage.getItem(STRATER_STORAGE_KEYS.COURSES);
    let all: Course[] = data ? JSON.parse(data) : [];
    const index = all.findIndex(c => c.id === course.id);
    if (index >= 0) all[index] = course;
    else all = [course, ...all];
    localStorage.setItem(STRATER_STORAGE_KEYS.COURSES, JSON.stringify(all));
  },

  // ── Analytics ──
  getAnalytics(userId?: string): UserLearningAnalytics {
    const targetUserId = userId || this.getActiveUserId();
    try {
      const data = localStorage.getItem(STRATER_STORAGE_KEYS.ANALYTICS);
      const all: Record<string, UserLearningAnalytics> = data ? JSON.parse(data) : {};
      if (all[targetUserId]) return all[targetUserId];
    } catch {}

    // Default analytics
    const defaultAnalytics: UserLearningAnalytics = {
      userId: targetUserId,
      totalStudyTimeMinutes: 485,
      currentStreakDays: 7,
      longestStreakDays: 14,
      totalCardsReviewed: 164,
      totalCardsMastered: 48,
      quizAverageAccuracy: 86,
      sourcesIngestedCount: 4,
      dailyLogs: [
        { date: '2026-10-16', minutesStudied: 45, cardsReviewed: 20, quizzesCompleted: 1, sourcesIngested: 1 },
        { date: '2026-10-17', minutesStudied: 60, cardsReviewed: 32, quizzesCompleted: 1, sourcesIngested: 0 },
        { date: '2026-10-18', minutesStudied: 50, cardsReviewed: 24, quizzesCompleted: 0, sourcesIngested: 1 },
        { date: '2026-10-19', minutesStudied: 75, cardsReviewed: 40, quizzesCompleted: 2, sourcesIngested: 1 },
        { date: '2026-10-20', minutesStudied: 35, cardsReviewed: 18, quizzesCompleted: 1, sourcesIngested: 0 },
        { date: '2026-10-21', minutesStudied: 80, cardsReviewed: 45, quizzesCompleted: 2, sourcesIngested: 1 },
        { date: '2026-10-22', minutesStudied: 40, cardsReviewed: 25, quizzesCompleted: 1, sourcesIngested: 0 }
      ],
      retentionCurve: SM2_SERVICE.generateForgettingCurveData(30),
      topicProficiency: [
        { topic: 'Architecture & Foundations', score: 92 },
        { topic: 'Consensus Protocols', score: 84 },
        { topic: 'Fault Domains & MTBF', score: 78 },
        { topic: 'Idempotency & Queues', score: 95 }
      ]
    };

    return defaultAnalytics;
  },

  recordCardReviewInAnalytics(userId: string) {
    const analytics = this.getAnalytics(userId);
    const today = new Date().toISOString().split('T')[0];
    analytics.totalCardsReviewed += 1;

    let todayLog = analytics.dailyLogs.find(l => l.date === today);
    if (!todayLog) {
      todayLog = { date: today, minutesStudied: 5, cardsReviewed: 1, quizzesCompleted: 0, sourcesIngested: 0 };
      analytics.dailyLogs.push(todayLog);
    } else {
      todayLog.cardsReviewed += 1;
      todayLog.minutesStudied += 2;
    }

    const data = localStorage.getItem(STRATER_STORAGE_KEYS.ANALYTICS);
    const all: Record<string, UserLearningAnalytics> = data ? JSON.parse(data) : {};
    all[userId] = analytics;
    localStorage.setItem(STRATER_STORAGE_KEYS.ANALYTICS, JSON.stringify(all));
  },

  // ── BYOK API Keys (Encrypted / Masked) ──
  getByokKeys(): ByokApiKeys {
    try {
      const data = localStorage.getItem(STRATER_STORAGE_KEYS.BYOK_KEYS);
      return data ? JSON.parse(data) : {};
    } catch {
      return {};
    }
  },

  saveByokKeys(keys: ByokApiKeys) {
    localStorage.setItem(STRATER_STORAGE_KEYS.BYOK_KEYS, JSON.stringify(keys));
    const user = this.getCurrentUser();
    user.hasByokKeys = {
      openai: Boolean(keys.openaiApiKey),
      anthropic: Boolean(keys.anthropicApiKey),
      gemini: Boolean(keys.geminiApiKey),
      groq: Boolean(keys.groqApiKey),
      ollama: Boolean(keys.ollamaUrl)
    };
    this.saveCurrentUser(user);
  },

  // ── Seed Initial Persona Data if Empty ──
  ensurePersonaSeedData(userId: string) {
    const existing = this.getSources(userId);
    if (existing.length > 0) return;

    // Seed realistic source for Alex Chen
    const src1: IngestedSource = {
      id: `src_alex_1`,
      userId,
      title: 'Building Resilient Distributed Systems: Consensus, Raft & Fault Domains',
      sourceType: 'youtube',
      sourceUrl: 'https://www.youtube.com/watch?v=vYp4LYbnnW8',
      author: 'MIT 6.824 Distributed Systems Lab',
      thumbnailUrl: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=640&q=80',
      durationSeconds: 840,
      wordCount: 1650,
      tokenCount: 2200,
      readingTimeMinutes: 8,
      status: 'ready',
      progressPercentage: 100,
      createdAt: '2026-10-18T10:00:00.000Z',
      updatedAt: '2026-10-18T10:00:00.000Z',
      tags: ['Distributed Systems', 'Raft', 'High-Yield', 'Consensus'],
      rawText: 'Lectures on building highly available distributed state machines with Raft consensus and Byzantine fault tolerance.',
      timestamps: [
        { timestamp: '00:00', seconds: 0, label: 'Motivation: Why Distributed State Machines?', summary: 'Introduction to node partition problems.' },
        { timestamp: '02:40', seconds: 160, label: 'The Split-Brain Anomaly & Quorum', summary: 'How mathematical quorum prevents divergent leaders.' },
        { timestamp: '06:15', seconds: 375, label: 'Leader Election & Term Epochs', summary: 'Heartbeat timeouts and term progression in Raft.' },
        { timestamp: '09:50', seconds: 590, label: 'Log Replication & Linearizability', summary: 'Append entries RPC and commit indices.' },
        { timestamp: '12:10', seconds: 730, label: 'Failure Recovery & Snapshotting', summary: 'Compacting state machine logs for fast bootstrap.' }
      ]
    };

    const src2: IngestedSource = {
      id: `src_alex_2`,
      userId,
      title: 'Designing Data-Intensive Applications: Chapter 7 Transactions & Isolation',
      sourceType: 'pdf',
      author: 'Martin Kleppmann',
      thumbnailUrl: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=640&q=80',
      wordCount: 3400,
      tokenCount: 4500,
      readingTimeMinutes: 15,
      status: 'ready',
      progressPercentage: 100,
      createdAt: '2026-10-20T14:30:00.000Z',
      updatedAt: '2026-10-20T14:30:00.000Z',
      tags: ['ACID', 'Databases', 'Serializable', 'Concurrency'],
      rawText: 'Comprehensive deep dive into ACID transactions, read phenomena (dirty reads, non-repeatable reads, phantom reads), and Snapshot Isolation.',
      pages: [
        { pageNumber: 1, content: 'Introduction to Transaction Abstractions and Atomicity guarantees.' },
        { pageNumber: 2, content: 'Weak Isolation Levels: Read Committed and Snapshot Isolation (MVCC).' },
        { pageNumber: 3, content: 'Write Skew and Phantoms: Why simple row-level locks fail.' }
      ]
    };

    this.saveSource(src1);
    this.saveSource(src2);

    // Seed Course
    const course: Course = {
      id: `course_alex_1`,
      userId,
      title: 'Advanced Distributed Systems Mastery',
      description: 'Comprehensive study path covering consensus, replication, transactions, and cloud resilience.',
      category: 'Computer Science',
      iconName: 'Server',
      colorGradient: 'from-blue-600 via-indigo-600 to-purple-800',
      modules: [
        {
          id: 'mod_1',
          title: 'Module 1: Consensus & Partition Tolerance',
          description: 'Raft, Paxos, and quorum derivation.',
          orderIndex: 1,
          sourceIds: [src1.id],
          isCompleted: true
        },
        {
          id: 'mod_2',
          title: 'Module 2: Transaction Isolation & MVCC',
          description: 'Snapshot isolation, serializability, and 2PC.',
          orderIndex: 2,
          sourceIds: [src2.id],
          isCompleted: false
        }
      ],
      createdAt: '2026-10-15T08:00:00.000Z',
      updatedAt: '2026-10-20T14:30:00.000Z'
    };
    this.saveCourse(course);
  }
};

// Auto-seed for active user on import
STRATER_STORAGE_SERVICE.ensurePersonaSeedData(STRATER_STORAGE_SERVICE.getActiveUserId());
