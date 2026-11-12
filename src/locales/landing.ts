export type LanguageCode = 'en' | 'hi' | 'mr';

export interface LandingTranslations {
  nav: {
    howItWorks: string;
    features: string;
    showcase: string;
    privacy: string;
    faq: string;
    openWorkspace: string;
    startCreating: string;
  };
  hero: {
    badge: string;
    titleLine1: string;
    titleHighlight: string;
    titleLine2: string;
    subheadline: string;
    ctaPrimary: string;
    ctaSecondary: string;
    trustBadge: string;
    mockup: {
      examTitle: string;
      classSubject: string;
      timeMarks: string;
      sectionA: string;
      sectionB: string;
      q1Text: string;
      q2Text: string;
      verifiedLocally: string;
      printReady: string;
    };
  };
  howItWorks: {
    tag: string;
    title: string;
    subtitle: string;
    step1Title: string;
    step1Desc: string;
    step2Title: string;
    step2Desc: string;
    step3Title: string;
    step3Desc: string;
  };
  features: {
    tag: string;
    title: string;
    subtitle: string;
    items: {
      title: string;
      desc: string;
    }[];
  };
  showcase: {
    tag: string;
    title: string;
    subtitle: string;
    tab1Label: string;
    tab2Label: string;
    tab3Label: string;
    tab1Title: string;
    tab1Desc: string;
    tab2Title: string;
    tab2Desc: string;
    tab3Title: string;
    tab3Desc: string;
  };
  privacy: {
    tag: string;
    title: string;
    subtitle: string;
    point1Title: string;
    point1Desc: string;
    point2Title: string;
    point2Desc: string;
    point3Title: string;
    point3Desc: string;
  };
  useCases: {
    tag: string;
    title: string;
    subtitle: string;
    cases: {
      title: string;
      target: string;
      desc: string;
      badge: string;
    }[];
  };
  faq: {
    tag: string;
    title: string;
    subtitle: string;
    items: {
      q: string;
      a: string;
    }[];
  };
  ctaBand: {
    title: string;
    subtitle: string;
    button: string;
    note: string;
  };
  footer: {
    desc: string;
    product: string;
    trust: string;
    community: string;
    allRightsReserved: string;
    privacyNote: string;
  };
}

export const LANDING_TRANSLATIONS: Record<LanguageCode, LandingTranslations> = {
  en: {
    nav: {
      howItWorks: 'How It Works',
      features: 'Features',
      showcase: 'Product Tour',
      privacy: 'Local-First Privacy',
      faq: 'FAQ',
      openWorkspace: 'Open Workspace',
      startCreating: 'Start Creating Papers',
    },
    hero: {
      badge: '100% Local-First • Zero Cloud Database • Indian Board Standards',
      titleLine1: 'Turn your textbooks into',
      titleHighlight: 'exam-ready papers',
      titleLine2: 'in minutes.',
      subheadline: 'Upload syllabus textbooks and question banks, set your board blueprint, and export print-ready Word and PDF exam papers with synchronized answer keys.',
      ctaPrimary: 'Start Creating Papers',
      ctaSecondary: 'See How It Works',
      trustBadge: 'Free & private · Your files never leave your device',
      mockup: {
        examTitle: 'DELHI PUBLIC SCHOOL — MID TERM EXAMINATION',
        classSubject: 'Class X • General Science (Physics & Chemistry)',
        timeMarks: 'Time: 3 Hours • Max Marks: 80',
        sectionA: 'SECTION A: Multiple Choice Questions (1 Mark Each)',
        sectionB: 'SECTION B: Short Answer Questions (2 Marks Each)',
        q1Text: 'Which of the following phenomena is responsible for the twinkling of stars?',
        q2Text: 'Differentiate between combination and decomposition reactions with balanced equations.',
        verifiedLocally: 'Blueprint Verified (80/80 Marks)',
        printReady: 'A4 Print Ready',
      },
    },
    howItWorks: {
      tag: 'SIMPLE 3-STEP WORKFLOW',
      title: 'Crafted for busy school teachers',
      subtitle: 'From a dense 300-page textbook PDF to a board-compliant examination paper in three straightforward steps.',
      step1Title: '1. Ingest Textbooks & PYQs',
      step1Desc: 'Upload PDF, DOCX, or scanned textbook chapters. Our in-browser worker extracts pages, detects chapters, and runs OCR client-side without lagging your laptop.',
      step2Title: '2. Set Board Blueprint',
      step2Desc: 'Define section layouts (MCQ, Short, Long, Case Study), marks distributions, and chapter weightages. Live arithmetic balance prevents marks miscalculations.',
      step3Title: '3. Permute & Export',
      step3Desc: 'Review questions in the split-canvas editor, generate synchronized Set A, B, and C permutations, and export editable Word (.docx) or print-accurate PDF files.',
    },
    features: {
      tag: 'CORE CAPABILITIES',
      title: 'Everything you need to set examination papers',
      subtitle: 'Built specifically for the workflow and requirements of teachers in Indian schools.',
      items: [
        {
          title: 'Textbook & PYQ Bank Ingestion',
          desc: 'Client-side PDF and DOCX parser with background Web Worker extraction and built-in Tesseract OCR for scanned school question papers.',
        },
        {
          title: 'CBSE, ICSE & State Board Blueprints',
          desc: 'Ready-to-use blueprint structures matching 20 marks class tests, 40 marks periodic assessments, and 80 marks annual board patterns.',
        },
        {
          title: 'Grounded Question Synthesis',
          desc: 'Questions are retrieved from your question bank or generated strictly from textbook snippets to guarantee syllabus fidelity.',
        },
        {
          title: 'English, Hindi & Marathi Support',
          desc: 'Full Devanagari Unicode support with embedded Noto Sans Devanagari font rendering in both browser preview and exported PDFs.',
        },
        {
          title: 'Print-Ready PDF & Editable Word (DOCX)',
          desc: 'Download clean, board-standard papers formatted for school letterheads, or editable Microsoft Word files for departmental reviews.',
        },
        {
          title: 'Aligned Model Answer Keys',
          desc: 'Generate complete step-by-step marking schemes and solution keys perfectly synchronized with question numbers across all sets.',
        },
      ],
    },
    showcase: {
      tag: 'INTERFACE SHOWCASE',
      title: 'Designed like modern SaaS, built for everyday use',
      subtitle: 'Fast, uncluttered, and responsive. Works smoothly on mid-range laptops and tablets.',
      tab1Label: 'Library & Extraction',
      tab2Label: 'Live Blueprint Balancing',
      tab3Label: 'Split-Screen Editor',
      tab1Title: 'In-Browser Textbook Ingestion',
      tab1Desc: 'Upload textbooks without uploading to a cloud server. Preview detected chapter boundaries, exercise questions, and storage quotas directly on device.',
      tab2Title: 'Deterministic Blueprint Builder',
      tab2Desc: 'Real-time arithmetic calculation ensures section marks and question counts balance to 100% before generation begins.',
      tab3Title: 'Split Canvas: Edit & A4 Preview',
      tab3Desc: 'Edit question wording, swap questions from your bank, and view a live 1:1 print sheet preview that matches the exported PDF identically.',
    },
    privacy: {
      tag: 'LOCAL-FIRST ARCHITECTURE',
      title: 'Your books and questions stay on your computer',
      subtitle: 'We believe educational materials, teacher question banks, and confidential student papers belong strictly on the teacher’s own device.',
      point1Title: '100% On-Device IndexedDB Storage',
      point1Desc: 'All uploaded textbook files, parsed chapters, questions, and drafts are stored in your browser’s IndexedDB database. There is no cloud database or account tracking.',
      point2Title: 'Optional Local Directory Sync',
      point2Desc: 'On Chrome and Edge, link an "EduPulse Library" folder on your hard drive via the File System Access API to auto-mirror your books and exports.',
      point3Title: 'Strict Minimal Context for AI',
      point3Desc: 'When you choose to generate new questions via AI, only the specific 2-3 paragraph textbook excerpt needed for that question is sent to your configured API key.',
    },
    useCases: {
      tag: 'DESIGNED FOR TEACHERS',
      title: 'One platform for every testing occasion',
      subtitle: 'From weekly 15-minute diagnostic quizzes to annual board mock examinations.',
      cases: [
        {
          title: 'Classroom Unit Tests',
          target: 'Weekly / Bi-weekly',
          desc: 'Quick 20-25 marks single-chapter tests focusing on foundational understanding and rapid grading.',
          badge: 'Quick Setup',
        },
        {
          title: 'Term & Half-Yearly Exams',
          target: 'Summative Assessment',
          desc: 'Comprehensive multi-section papers (80 marks, 3 hours) balancing MCQ, short, long, and case study questions.',
          badge: 'Board Blueprint',
        },
        {
          title: 'Practice & Remedial Worksheets',
          target: 'Daily Homework',
          desc: 'Targeted drill sheets curated from past exercise problems and specific Bloom cognitive levels.',
          badge: 'Targeted Review',
        },
        {
          title: 'Multi-Set Permutations (A / B / C)',
          target: 'Anti-Copying',
          desc: 'Shuffle question sequences and options across 3 synchronized sets with corresponding answer keys.',
          badge: 'Exam Integrity',
        },
      ],
    },
    faq: {
      tag: 'FREQUENTLY ASKED QUESTIONS',
      title: 'Answers to common questions',
      subtitle: 'Everything you need to know about EduPulse AI and local-first exam generation.',
      items: [
        {
          q: 'What file formats can I upload as textbooks or question banks?',
          a: 'EduPulse AI supports standard PDF documents, Microsoft Word (.docx), plain text (.txt), and EPUB files. The in-browser parser handles complex chapter structures and multi-column school book layouts.',
        },
        {
          q: 'How does it handle scanned photocopied question papers?',
          a: 'If an uploaded PDF has low selectable text, the system automatically runs client-side Tesseract OCR in a dedicated Web Worker, recognizing English, Hindi, and Marathi characters page by page without freezing your browser.',
        },
        {
          q: 'Do I need an AI API key to use EduPulse AI?',
          a: 'No. You can use EduPulse AI completely offline to create blueprints and compile papers from your Question Bank. If you want AI to generate fresh questions grounded in textbook paragraphs, you can bring your own free Gemini or OpenAI API key.',
        },
        {
          q: 'Is EduPulse AI free to use?',
          a: 'Yes. EduPulse AI is free, open-source software. There are no subscriptions, paywalls, or hidden server fees because it runs directly on your own hardware.',
        },
        {
          q: 'What happens if I clear my browser cache or cookies?',
          a: 'Since data is stored in browser IndexedDB, clearing browser storage can reset local data. To prevent accidental loss, EduPulse AI provides a 1-click "Backup to ZIP" tool and supports persistent folder linkage via the Chrome/Edge File System Access API.',
        },
        {
          q: 'Can I use copyrighted school textbooks?',
          a: 'Yes, under educational fair use provisions for creating classroom examination assessments. Because all textbook files remain on your device and are never published to any cloud server, your usage is private and compliant.',
        },
        {
          q: 'Which educational boards are supported out of the box?',
          a: 'EduPulse AI includes pre-configured blueprint templates for CBSE (Class 9-12), ICSE / CISCE, and Maharashtra State Board (SSC/HSC), and allows you to customize blueprints for any curriculum.',
        },
      ],
    },
    ctaBand: {
      title: 'Ready to create your next exam paper?',
      subtitle: 'Upload a chapter, configure your section blueprint, and download print-ready Word and PDF papers in minutes.',
      button: 'Start Creating Papers — It’s Free',
      note: 'No sign-up required • Stored 100% on your device',
    },
    footer: {
      desc: 'Local-first teacher examination paper studio for CBSE, ICSE, and Indian State Boards.',
      product: 'Product',
      trust: 'Trust & Privacy',
      community: 'Community',
      allRightsReserved: 'EduPulse AI. All rights reserved.',
      privacyNote: '100% Local-First. Textbooks and papers remain strictly on your device.',
    },
  },
  hi: {
    nav: {
      howItWorks: 'यह कैसे काम करता है',
      features: 'विशेषताएँ',
      showcase: 'उत्पाद टूर',
      privacy: 'स्थानीय गोपनीयता',
      faq: 'सामान्य प्रश्न',
      openWorkspace: 'वर्कस्पेस खोलें',
      startCreating: 'प्रश्न पत्र बनाना शुरू करें',
    },
    hero: {
      badge: '100% लोकल-फर्स्ट • शून्य क्लाउड डेटाबेस • भारतीय बोर्ड मानक',
      titleLine1: 'अपनी पाठ्यपुस्तकों को',
      titleHighlight: 'परीक्षा के लिए तैयार प्रश्न पत्रों',
      titleLine2: 'में बदलें मिनटों में।',
      subheadline: 'पाठ्यपुस्तकों और प्रश्न बैंकों को अपलोड करें, अपने बोर्ड का ब्लूप्रिंट सेट करें, और उत्तर कुंजी के साथ प्रिंट-योग्य वर्ड और पीडीएफ पेपर निर्यात करें।',
      ctaPrimary: 'प्रश्न पत्र बनाना शुरू करें',
      ctaSecondary: 'देखें यह कैसे काम करता है',
      trustBadge: 'मुफ्त और सुरक्षित · आपकी फ़ाइलें कभी आपके डिवाइस से बाहर नहीं जातीं',
      mockup: {
        examTitle: 'दिल्ली पब्लिक स्कूल — मध्यावधि परीक्षा',
        classSubject: 'कक्षा 10वीं • सामान्य विज्ञान (भौतिकी और रसायन)',
        timeMarks: 'समय: 3 घंटे • पूर्णांक: 80',
        sectionA: 'खंड क: बहुविकल्पीय प्रश्न (प्रत्येक 1 अंक)',
        sectionB: 'खंड ख: लघु उत्तरीय प्रश्न (प्रत्येक 2 अंक)',
        q1Text: 'निम्नलिखित में से कौन सी परिघटना तारों के टिमटिमाने के लिए जिम्मेदार है?',
        q2Text: 'संतुलित समीकरणों के साथ संयोजन और वियोजन अभिक्रियाओं में अंतर स्पष्ट कीजिए।',
        verifiedLocally: 'ब्लूप्रिंट सत्यापित (80/80 अंक)',
        printReady: 'A4 प्रिंट योग्य',
      },
    },
    howItWorks: {
      tag: 'सरल 3-चरणीय प्रक्रिया',
      title: 'व्यस्त शिक्षकों के लिए विशेष रूप से निर्मित',
      subtitle: '300 पन्नों की पाठ्यपुस्तक पीडीएफ से बोर्ड-मानक परीक्षा पत्र तक केवल तीन आसान चरणों में।',
      step1Title: '1. पुस्तकें और प्रश्न बैंक अपलोड करें',
      step1Desc: 'पीडीएफ या वर्ड फ़ाइलें जोड़ें। इन-ब्राउज़र वर्कर आपके कंप्यूटर को धीमा किए बिना टेक्स्ट और स्कैन किए गए पृष्ठों का ओसीआर करता है।',
      step2Title: '2. बोर्ड ब्लूप्रिंट सेट करें',
      step2Desc: 'खंडवार अंक, प्रश्नों के प्रकार (बहुविकल्पीय, लघु, दीर्घ) और अध्याय भार निर्धारित करें। रीयल-टाइम अंक संतुलन सुनिश्चित करता है।',
      step3Title: '3. सेट बनाएं और निर्यात करें',
      step3Desc: 'सेट A, B, और C तैयार करें और सटीक उत्तर कुंजी के साथ माइक्रोसॉफ्ट वर्ड (.docx) या पीडीएफ में डाउनलोड करें।',
    },
    features: {
      tag: 'प्रमुख क्षमताएं',
      title: 'परीक्षा पत्र तैयार करने के लिए आवश्यक सभी सुविधाएं',
      subtitle: 'भारतीय स्कूलों के शिक्षकों की वास्तविक आवश्यकताओं के अनुसार विकसित।',
      items: [
        {
          title: 'पाठ्यपुस्तक व प्रश्न बैंक अंतर्ग्रहण',
          desc: 'स्कैन किए गए प्रश्न पत्रों के लिए अंतर्निहित टेसरेक्ट ओसीआर के साथ तेज इन-ब्राउज़र निष्कर्षण।',
        },
        {
          title: 'सीबीएसई, आईसीएसई और राज्य बोर्ड ब्लूप्रिंट',
          desc: 'कक्षा परीक्षाओं, आवधिक मूल्यांकन और वार्षिक बोर्ड पैटर्न के लिए तैयार टेम्पलेट्स।',
        },
        {
          title: 'सटीक और सिलेबस-आधारित प्रश्न निर्माण',
          desc: 'प्रश्न आपकी पाठ्यपुस्तक सामग्री के आधार पर तैयार किए जाते हैं, ताकि पाठ्यक्रम की सटीकता बनी रहे।',
        },
        {
          title: 'अंग्रेजी, हिंदी और मराठी का पूर्ण समर्थन',
          desc: 'देवनागरी फोंट (Noto Sans Devanagari) के साथ शुद्ध हिंदी और मराठी प्रश्न पत्र मुद्रण।',
        },
        {
          title: 'प्रिंट-तैयार पीडीएफ और संपादन-योग्य वर्ड (DOCX)',
          desc: 'स्कूल लेटरहेड के लिए तैयार पीडीएफ या शिक्षकों द्वारा संपादन के लिए वर्ड फाइल निर्यात करें।',
        },
        {
          title: 'मॉडल उत्तर कुंजी और अंकन योजना',
          desc: 'सभी प्रश्न सेटों के लिए समकालिक विस्तृत उत्तर कुंजी और चरणबद्ध अंकन योजना।',
        },
      ],
    },
    showcase: {
      tag: 'इंटरफ़ेस पूर्वावलोकन',
      title: 'आधुनिक और सहज शिक्षक वर्कस्पेस',
      subtitle: 'लैपटॉप और टैबलेट पर बेहद तेज और सरल अनुभव।',
      tab1Label: 'लाइब्रेरी व निष्कर्षण',
      tab2Label: 'ब्लूप्रिंट संतुलन',
      tab3Label: 'स्प्लिट-स्क्रीन संपादक',
      tab1Title: 'स्थानीय पाठ्यपुस्तक लाइब्रेरी',
      tab1Desc: 'क्लाउड पर अपलोड किए बिना पाठ्यपुस्तकों को प्रबंधित करें। अध्यायों और पृष्ठों की सीमाएं आसानी से तय करें।',
      tab2Title: 'सटीक ब्लूप्रिंट निर्माता',
      tab2Desc: 'अंकों का कुल योग हमेशा 100% सही रहता है। किसी भी गणितीय त्रुटि की संभावना नहीं।',
      tab3Title: 'स्प्लिट कैनवास: प्रश्न और A4 प्रिंट पूर्वावलोकन',
      tab3Desc: 'प्रश्नों को तुरंत संपादित करें या बैंक से बदलें, और साथ में वास्तविक A4 प्रिंट शीट का लाइव दृश्य देखें।',
    },
    privacy: {
      tag: 'लोकल-फर्स्ट गोपनीयता',
      title: 'आपकी पुस्तकें और प्रश्न आपके ही डिवाइस पर सुरक्षित हैं',
      subtitle: 'शिक्षकों की सामग्री और गोपनीय परीक्षा पत्र केवल शिक्षक के कंप्यूटर पर रहने चाहिए।',
      point1Title: '100% ऑन-डिवाइस IndexedDB स्टोरेज',
      point1Desc: 'कोई क्लाउड डेटाबेस नहीं, कोई यूजर ट्रैकिंग नहीं। सब कुछ आपके ब्राउज़र स्टोरेज में सुरक्षित रहता है।',
      point2Title: 'लोकल फोल्डर सिंक (वैकल्पिक)',
      point2Desc: 'क्रोम और एज पर अपने कंप्यूटर के "EduPulse Library" फोल्डर से सीधे लिंक करें।',
      point3Title: 'एआई के लिए केवल आवश्यक संदर्भ',
      point3Desc: 'एआई प्रश्न निर्माण के समय केवल संबंधित पैराग्राफ का छोटा हिस्सा ही आपके चुने हुए प्रदाता को भेजा जाता है।',
    },
    useCases: {
      tag: 'शिक्षकों के लिए',
      title: 'हर प्रकार के मूल्यांकन के लिए उपयुक्त',
      subtitle: 'साप्ताहिक टेस्ट से लेकर वार्षिक बोर्ड परीक्षा तक।',
      cases: [
        {
          title: 'कक्षा इकाई परीक्षाएं (Unit Tests)',
          target: 'साप्ताहिक टेस्ट',
          desc: '20-25 अंकों के त्वरित अध्याय परीक्षण जो बुनियादी समझ की जांच करते हैं।',
          badge: 'त्वरित सेटअप',
        },
        {
          title: 'सत्रांत एवं अर्धवार्षिक परीक्षाएं',
          target: 'सत्रांत मूल्यांकन',
          desc: '80 अंकों के विस्तृत प्रश्न पत्र जिनमें सभी प्रकार के प्रश्न शामिल होते हैं।',
          badge: 'बोर्ड पैटर्न',
        },
        {
          title: 'अभ्यास कार्यपत्रक (Worksheets)',
          target: 'दैनिक गृहकार्य',
          desc: 'ब्लूम टैक्सोनॉमी स्तरों के अनुसार लक्षित अभ्यास पत्रक।',
          badge: 'लक्षित अभ्यास',
        },
        {
          title: 'मल्टी-सेट पेपर (सेट A / B / C)',
          target: 'नकल रोकथाम',
          desc: 'समान कठिनाई वाले 3 अलग-अलग प्रश्न सेट और उनके संबंधित समाधान।',
          badge: 'परीक्षा अखंडता',
        },
      ],
    },
    faq: {
      tag: 'अक्सर पूछे जाने वाले प्रश्न',
      title: 'सामान्य प्रश्नों के उत्तर',
      subtitle: 'EduPulse AI के बारे में सब कुछ जानें।',
      items: [
        {
          q: 'मैं किस प्रकार की फ़ाइलें अपलोड कर सकता हूँ?',
          a: 'आप पीडीएफ (PDF), वर्ड (.docx), और टेक्स्ट (.txt) फ़ाइलें अपलोड कर सकते हैं।',
        },
        {
          q: 'क्या यह फोटोकॉपी या स्कैन किए गए पेपर पर काम करता है?',
          a: 'हाँ, इन-बिल्ट टेसरेक्ट ओसीआर स्कैन किए गए दस्तावेज़ों से भी हिंदी, मराठी और अंग्रेजी टेक्स्ट पहचानता है।',
        },
        {
          q: 'क्या मुझे एआई कुंजी (API Key) की आवश्यकता है?',
          a: 'नहीं। आप अपने प्रश्न बैंक से बिना किसी एआई कुंजी के पूरी तरह ऑफलाइन काम कर सकते हैं। नए प्रश्नों के निर्माण के लिए आप अपनी मुफ्त जेमिनी कुंजी जोड़ सकते हैं।',
        },
        {
          q: 'क्या EduPulse AI उपयोग के लिए पूरी तरह मुफ़्त है?',
          a: 'हाँ, यह एक मुफ़्त और ओपन-सोर्स सॉफ्टवेयर है।',
        },
        {
          q: 'यदि ब्राउज़र डेटा साफ़ हो जाए तो क्या होगा?',
          a: 'डेटा हानि से बचने के लिए आप "बैकअप ज़िप" डाउनलोड कर सकते हैं या कंप्यूटर फ़ोल्डर लिंक कर सकते हैं।',
        },
        {
          q: 'क्या मैं अपनी स्कूल की पाठ्यपुस्तकों का उपयोग कर सकता हूँ?',
          a: 'हाँ, शैक्षणिक उपयोग (Educational Fair Use) के तहत आप परीक्षा प्रश्न पत्र बनाने के लिए इनका उपयोग कर सकते हैं।',
        },
        {
          q: 'कौन से शिक्षा बोर्ड समर्थित हैं?',
          a: 'सीबीएसई, आईसीएसई, और महाराष्ट्र स्टेट बोर्ड के मानक ब्लूप्रिंट पहले से शामिल हैं।',
        },
      ],
    },
    ctaBand: {
      title: 'क्या आप अपना अगला परीक्षा पत्र तैयार करने के लिए तैयार हैं?',
      subtitle: 'पाठ्यपुस्तक अपलोड करें, ब्लूप्रिंट सेट करें और मिनटों में प्रिंट-तैयार पेपर प्राप्त करें।',
      button: 'मुफ़्त में प्रश्न पत्र बनाना शुरू करें',
      note: 'किसी साइन-अप की आवश्यकता नहीं • डेटा 100% आपके डिवाइस पर रहता है',
    },
    footer: {
      desc: 'सीबीएसई, आईसीएसई और राज्य बोर्डों के लिए लोकल-फर्स्ट शिक्षक परीक्षा स्टूडियो।',
      product: 'उत्पाद',
      trust: 'विश्वास एवं गोपनीयता',
      community: 'समुदाय',
      allRightsReserved: 'EduPulse AI. सर्वाधिकार सुरक्षित।',
      privacyNote: '100% लोकल-फर्स्ट। सभी फ़ाइलें आपके कंप्यूटर पर ही रहती हैं।',
    },
  },
  mr: {
    nav: {
      howItWorks: 'हे कसे कार्य करते',
      features: 'वैशिष्ट्ये',
      showcase: 'उत्पादन फेरफटका',
      privacy: 'स्थानिक गोपनीयता',
      faq: 'वारंवार विचारले जाणारे प्रश्न',
      openWorkspace: 'वर्कस्पेस उघडा',
      startCreating: 'प्रश्नपत्रिका तयार करा',
    },
    hero: {
      badge: '100% लोकल-फर्स्ट • शून्य क्लाउड डेटाबेस • भारतीय बोर्ड मानके',
      titleLine1: 'तुमची पाठ्यपुस्तके बदला',
      titleHighlight: 'परीक्षेसाठी सज्ज प्रश्नपत्रिकांमध्ये',
      titleLine2: 'काही मिनिटांत.',
      subheadline: 'पाठ्यपुस्तके व प्रश्नसंच अपलोड करा, बोर्ड आराखडा निवडा आणि उत्तर तालिकेसह वर्ड व पीडीएफ प्रश्नपत्रिका त्वरित तयार करा.',
      ctaPrimary: 'प्रश्नपत्रिका तयार करणे सुरू करा',
      ctaSecondary: 'कार्यपद्धती पहा',
      trustBadge: 'विनामूल्य आणि खाजगी · तुमच्या फाईल्स तुमच्या डिव्हाइसवरच सुरक्षित राहतात',
      mockup: {
        examTitle: 'आदर्श हायस्कूल — सत्र परीक्षा',
        classSubject: 'इयत्ता १० वी • सामान्य विज्ञान (भाग १ व २)',
        timeMarks: 'वेळ: ३ तास • एकूण गुण: ८०',
        sectionA: 'विभाग अ: बहुपर्यायी प्रश्न (प्रत्येकी १ गुण)',
        sectionB: 'विभाग ब: संक्षिप्त उत्तरे (प्रत्येकी २ गुण)',
        q1Text: 'खालीलपैकी कोणती घटना ताऱ्यांच्या लुकलुकण्यास कारणीभूत आहे?',
        q2Text: 'संयोग आणि अपघटन अभिक्रिया यांमधील फरक संतुलित समीकरणांसह स्पष्ट करा.',
        verifiedLocally: 'आराखडा सत्यापित (८०/८० गुण)',
        printReady: 'A4 प्रिंटसाठी तयार',
      },
    },
    howItWorks: {
      tag: 'सोपी ३-टप्प्यांची पद्धत',
      title: 'व्यस्त शिक्षकांसाठी अत्यंत सोयीस्कर',
      subtitle: '३०० पानांच्या पाठ्यपुस्तकापासून ते बोर्ड-मानक प्रश्नपत्रिकेपर्यंत फक्त तीन सोप्या टप्प्यांत.',
      step1Title: '१. पुस्तके आणि जुन्या प्रश्नपत्रिका जोडा',
      step1Desc: 'पीडीएफ किंवा वर्ड फाईल्स अपलोड करा. इन-ब्राउझर वर्कर संगणक संथ न करता मजकूर आणि स्कॅन केलेल्या पानांचे ओसीआर करतो.',
      step2Title: '२. बोर्ड आराखडा (ब्लूप्रिंट) निश्चित करा',
      step2Desc: 'विभागवार गुण, प्रश्नांचे स्वरूप आणि धड्यांचे भारांकन ठरवा. रीयल-टाइम संतुलन गुणांची अचूकता राखते.',
      step3Title: '३. सेट तयार करा आणि डाउनलोड करा',
      step3Desc: 'सेट A, B, आणि C तयार करून अचूक उत्तर तालिकेसह मायक्रोसॉफ्ट वर्ड किंवा पीडीएफमध्ये निर्यात करा.',
    },
    features: {
      tag: 'प्रमुख वैशिष्ट्ये',
      title: 'प्रश्नपत्रिका तयार करण्यासाठी आवश्यक सर्व साधने',
      subtitle: 'भारतीय शाळांमधील शिक्षकांच्या दैनंदिन गरजेनुसार विकसित.',
      items: [
        {
          title: 'पाठ्यपुस्तक व प्रश्नसंच अंतर्ग्रहण',
          desc: 'स्कॅन केलेल्या जुन्या प्रश्नपत्रिकांसाठी इन-बिल्ट टेसरेक्ट ओसीआर तंत्रज्ञान.',
        },
        {
          title: 'सीबीएसई, आयसीएसई आणि महाराष्ट्र राज्य मंडळ',
          desc: 'घटक चाचणी, सत्र परीक्षा आणि वार्षिक बोर्ड परीक्षांसाठी तयार आराखडे.',
        },
        {
          title: 'अभ्यासक्रमावर आधारित प्रश्न निर्मिती',
          desc: 'प्रश्न थेट पाठ्यपुस्तकातील संकल्पनांवर आधारित असल्याने अभ्यासक्रमाची अचूकता राखली जाते.',
        },
        {
          title: 'मराठी, हिंदी आणि इंग्रजी भाषा समर्थन',
          desc: 'देवनागरी फॉन्टसह (Noto Sans Devanagari) शुद्ध मराठी आणि हिंदी प्रश्नपत्रिका छपाई.',
        },
        {
          title: 'प्रिंट-योग्य पीडीएफ आणि वर्ड (DOCX) फॉरमॅट',
          desc: 'शाळेच्या लेटरहेडवर थेट छापण्यासाठी सुबक पीडीएफ किंवा संपादनक्षम वर्ड फाईल डाउनलोड करा.',
        },
        {
          title: 'अचूक उत्तर तालिका व गुणदान योजना',
          desc: 'प्रत्येक संचासाठी प्रश्नांनुसार तयार केलेली सविस्तर उत्तर तालिका व मॉडेल आन्सर की.',
        },
      ],
    },
    showcase: {
      tag: 'इंटरफेस सादरीकरण',
      title: 'शिक्षकांसाठी गतिमान व सुलभ व्यासपीठ',
      subtitle: 'लॅपटॉप आणि टॅब्लेटवर जलद आणि सोपा अनुभव.',
      tab1Label: 'पुस्तकालय व ओसीआर',
      tab2Label: 'आराखडा संतुलन',
      tab3Label: 'स्प्लिट-स्क्रीन संपादक',
      tab1Title: 'स्थानिक पाठ्यपुस्तक व्यवस्थापन',
      tab1Desc: 'क्लाउडवर अपलोड न करता पुस्तके व्यवस्थापित करा. प्रकरणांच्या सीमा सहजपणे तपासा.',
      tab2Title: 'अचूक आराखडा निर्माता',
      tab2Desc: 'गुणांची बेरीज नेहमी अचूक राहते. कोणत्याही मानवी गणिताच्या चुकांची शक्यता नाही.',
      tab3Title: 'स्प्लिट कॅनव्हास: संपादन आणि A4 पूर्वावलोकन',
      tab3Desc: 'प्रश्न संपादित करा आणि बाजूलाच प्रत्यक्ष छापल्या जाणाऱ्या A4 पानाचे थेट दृश्य पहा.',
    },
    privacy: {
      tag: 'लोकल-फर्स्ट गोपनीयता',
      title: 'तुमची पुस्तके आणि प्रश्न तुमच्याच संगणकावर सुरक्षित',
      subtitle: 'शालेय शैक्षणिक साहित्य आणि गोपनीय प्रश्नपत्रिका शिक्षकांच्या स्वतःच्या डिव्हाइसवरच राहिल्या पाहिजेत.',
      point1Title: '१००% ऑन-डिव्हाइस IndexedDB स्टोरेज',
      point1Desc: 'कोणताही क्लाउड सर्व्हर किंवा युझर ट्रॅकिंग नाही. सर्व माहिती तुमच्या ब्राउझरमध्येच साठवली जाते.',
      point2Title: 'स्थानिक फोल्डर जोडणी',
      point2Desc: 'क्रोम किंवा एज ब्राउझरवर तुमच्या हार्ड ड्राईव्हमधील फोल्डर थेट जोडून बॅकअप घ्या.',
      point3Title: 'एआयसाठी मर्यादित संदर्भ',
      point3Desc: 'एआयद्वारे प्रश्न तयार करताना फक्त आवश्यक तेवढाच धड्यातील छोटा परिच्छेद वापरला जातो.',
    },
    useCases: {
      tag: 'शिक्षकांसाठी',
      title: 'प्रत्येक प्रकारच्या परीक्षेसाठी उपयुक्त',
      subtitle: 'साप्ताहिक घटक चाचणीपासून ते वार्षिक बोर्ड मॉक परीक्षेपर्यंत.',
      cases: [
        {
          title: 'घटक चाचण्या (Unit Tests)',
          target: 'साप्ताहिक चाचणी',
          desc: '२०-२५ गुणांच्या छोट्या चाचण्या ज्या विद्यार्थ्यांच्या संकल्पनांची तपासणी करतात.',
          badge: 'जलद सेटअप',
        },
        {
          title: 'सत्र आणि अंतिम परीक्षा',
          target: 'सत्र परीक्षा',
          desc: '८० गुणांच्या सर्वसमावेशक प्रश्नपत्रिका ज्यामध्ये सर्व प्रश्नप्रकार असतात.',
          badge: 'बोर्ड आराखडा',
        },
        {
          title: 'सराव स्वाध्याय आणि वर्कशीट',
          target: 'दैनंदिन गृहपाठ',
          desc: 'विशिष्ट धड्यांवर आधारित सराव प्रश्नपत्रिका.',
          badge: 'सराव स्वाध्याय',
        },
        {
          title: 'मल्टी-सेट प्रश्नपत्रिका (A / B / C)',
          target: 'नकल प्रतिबंध',
          desc: 'समान काठिण्य पातळीचे ३ वेगवेगळे प्रश्नसंच आणि उत्तर तालिका.',
          badge: 'परीक्षा अखंडता',
        },
      ],
    },
    faq: {
      tag: 'नेहमी विचारले जाणारे प्रश्न',
      title: 'महत्त्वाच्या प्रश्नांची उत्तरे',
      subtitle: 'EduPulse AI बद्दल सर्व माहिती जाणून घ्या.',
      items: [
        {
          q: 'मी कोणत्या फॉरमॅटमधील फाईल्स जोडू शकतो?',
          a: 'तुम्ही पीडीएफ (PDF), वर्ड (.docx), आणि टेक्स्ट (.txt) फाईल्स वापरू शकता.',
        },
        {
          q: 'स्कॅन केलेल्या जुन्या प्रश्नपत्रिकांवर हे कार्य करते का?',
          a: 'होय, अंतर्भूत टेसरेक्ट ओसीआर तंत्रज्ञान स्कॅन केलेल्या कागदपत्रांमधूनही मराठी व इंग्रजी मजकूर अचूक वाचते.',
        },
        {
          q: 'मला एआय की (API Key) ची गरज आहे का?',
          a: 'नाही. तुम्ही स्वतःच्या प्रश्नसंचातून पूर्णपणे ऑफलाइन काम करू शकता. नवीन प्रश्नांसाठी हवी असल्यास मोफत जेमिनी की वापरू शकता.',
        },
        {
          q: 'हे सॉफ्टवेअर वापरण्यासाठी पूर्णपणे विनामूल्य आहे का?',
          a: 'होय, हे पूर्णपणे मोफत आणि ओपन-सोर्स सॉफ्टवेअर आहे.',
        },
        {
          q: 'ब्राउझरचा डेटा क्लिअर झाला तर काय होईल?',
          a: 'डेटा गमावणे टाळण्यासाठी तुम्ही एका क्लिकवर "बॅकअप झिप" डाऊनलोड करू शकता किंवा संगणकाचा फोल्डर लिंक करू शकता.',
        },
        {
          q: 'मी शाळेच्या पाठ्यपुस्तकांचा वापर करू शकतो का?',
          a: 'होय, शैक्षणिक मूल्यमापनासाठी (Educational Fair Use) तुम्ही प्रश्नपत्रिका बनवण्यासाठी ही पुस्तके सुरक्षितपणे वापरू शकता.',
        },
        {
          q: 'कोणती शैक्षणिक मंडळे समर्थित आहेत?',
          a: 'महाराष्ट्र राज्य मंडळ (SSC/HSC), सीबीएसई (CBSE) आणि आयसीएसई (ICSE) चे आराखडे आधीच उपलब्ध आहेत.',
        },
      ],
    },
    ctaBand: {
      title: 'तुमची पुढची प्रश्नपत्रिका तयार करण्यास तयार आहात?',
      subtitle: 'पुस्तक जोडा, आराखडा निवडा आणि काही मिनिटांत प्रिंट-योग्य प्रश्नपत्रिका मिळवा.',
      button: 'विनामूल्य प्रश्नपत्रिका तयार करा',
      note: 'लॉगिनची आवश्यकता नाही • माहिती १००% तुमच्या संगणकावर सुरक्षित',
    },
    footer: {
      desc: 'महाराष्ट्र राज्य मंडळ, सीबीएसई व आयसीएसईसाठी लोकल-फर्स्ट शिक्षक परीक्षा स्टुडिओ.',
      product: 'उत्पादने',
      trust: 'विश्वास आणि गोपनीयता',
      community: 'समुदाय',
      allRightsReserved: 'EduPulse AI. सर्व हक्क राखीव.',
      privacyNote: '१००% लोकल-फर्स्ट. सर्व माहिती तुमच्या संगणकावरच सुरक्षित राहते.',
    },
  },
};
