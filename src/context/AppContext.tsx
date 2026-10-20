import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  Course,
  LearningMaterial,
  StudyCard,
  StudyTask,
  WorkspaceAppearance,
  StudyProfile,
  CoachMessage,
} from '../types';
import {
  INITIAL_COURSES,
  INITIAL_MATERIALS,
  INITIAL_CARDS,
  INITIAL_TASKS,
  INITIAL_APPEARANCE,
  DEFAULT_PROFILE,
  BACKGROUND_PRESETS,
} from '../data/initialData';

export type AppView = 'landing' | 'platform' | 'login' | 'onboarding' | 'architecture';
export type PlatformTab =
  | 'today'
  | 'courses'
  | 'revision'
  | 'planning'
  | 'coach'
  | 'appearance'
  | 'privacy';

interface AppContextType {
  // Navigation & session
  currentView: AppView;
  setCurrentView: (view: AppView) => void;
  currentTab: PlatformTab;
  setCurrentTab: (tab: PlatformTab) => void;
  isAuthenticated: boolean;
  setIsAuthenticated: (val: boolean) => void;
  isGuestDemo: boolean;
  setIsGuestDemo: (val: boolean) => void;
  userEmail: string;
  setUserEmail: (email: string) => void;

  // Onboarding & Profile
  profile: StudyProfile;
  updateProfile: (partial: Partial<StudyProfile>) => void;
  showOnboardingModal: boolean;
  setShowOnboardingModal: (show: boolean) => void;
  showAuthModal: boolean;
  setShowAuthModal: (show: boolean) => void;
  authModalMode: 'login' | 'register' | 'forgot';
  setAuthModalMode: (mode: 'login' | 'register' | 'forgot') => void;
  showArchitectureModal: boolean;
  setShowArchitectureModal: (show: boolean) => void;

  // Appearance & Background
  appearance: WorkspaceAppearance;
  updateAppearance: (partial: Partial<WorkspaceAppearance>) => void;
  resetAppearance: () => void;

  // Domain data
  courses: Course[];
  addCourse: (course: Omit<Course, 'id' | 'createdAt'>) => void;
  removeCourse: (courseId: string) => void;

  materials: LearningMaterial[];
  addMaterial: (
    courseId: string,
    displayName: string,
    textContent: string,
    pageCount?: number
  ) => LearningMaterial;
  removeMaterial: (materialId: string) => void;

  cards: StudyCard[];
  addCard: (card: Omit<StudyCard, 'id' | 'createdAt' | 'reviewCount'>) => void;
  updateCard: (id: string, updates: Partial<StudyCard>) => void;
  removeCard: (id: string) => void;
  recordPracticeAttempt: (
    cardId: string,
    rating: 'revoir' | 'hesitant' | 'acquis'
  ) => void;

  tasks: StudyTask[];
  addTask: (task: Omit<StudyTask, 'id'>) => void;
  toggleTask: (id: string) => void;
  removeTask: (id: string) => void;

  // Coach Messages
  coachMessages: CoachMessage[];
  sendCoachQuestion: (questionText: string, selectedCourseId?: string) => void;
  requestNextHint: (messageId: string) => void;
  reportCoachMessage: (messageId: string, reason: string) => void;
  clearCoachChat: () => void;

  // Global Toast
  toastMessage: string | null;
  showToast: (msg: string) => void;

  // Privacy export & erase
  exportUserData: () => void;
  wipeAllData: () => void;
}

const AppContext = createContext<AppContextType | null>(null);

const STORAGE_KEYS = {
  PROFILE: 'noria_profile_v1',
  APPEARANCE: 'noria_appearance_v1',
  COURSES: 'noria_courses_v1',
  MATERIALS: 'noria_materials_v1',
  CARDS: 'noria_cards_v1',
  TASKS: 'noria_tasks_v1',
  IS_AUTH: 'noria_is_auth_v1',
  USER_EMAIL: 'noria_user_email_v1',
};

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentView, setCurrentView] = useState<AppView>('landing');
  const [currentTab, setCurrentTab] = useState<PlatformTab>('today');
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return localStorage.getItem(STORAGE_KEYS.IS_AUTH) === 'true';
  });
  const [isGuestDemo, setIsGuestDemo] = useState<boolean>(true);
  const [userEmail, setUserEmail] = useState<string>(() => {
    return localStorage.getItem(STORAGE_KEYS.USER_EMAIL) || 'etudiant.demo@lycee.fr';
  });

  const [showOnboardingModal, setShowOnboardingModal] = useState<boolean>(false);
  const [showAuthModal, setShowAuthModal] = useState<boolean>(false);
  const [authModalMode, setAuthModalMode] = useState<'login' | 'register' | 'forgot'>('login');
  const [showArchitectureModal, setShowArchitectureModal] = useState<boolean>(false);

  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage((prev) => (prev === msg ? null : prev));
    }, 3200);
  };

  // State with LocalStorage fallbacks
  const [profile, setProfile] = useState<StudyProfile>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.PROFILE);
    return saved ? JSON.parse(saved) : DEFAULT_PROFILE;
  });

  const [appearance, setAppearance] = useState<WorkspaceAppearance>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.APPEARANCE);
    return saved ? JSON.parse(saved) : INITIAL_APPEARANCE;
  });

  const [courses, setCourses] = useState<Course[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.COURSES);
    return saved ? JSON.parse(saved) : INITIAL_COURSES;
  });

  const [materials, setMaterials] = useState<LearningMaterial[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.MATERIALS);
    return saved ? JSON.parse(saved) : INITIAL_MATERIALS;
  });

  const [cards, setCards] = useState<StudyCard[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.CARDS);
    return saved ? JSON.parse(saved) : INITIAL_CARDS;
  });

  const [tasks, setTasks] = useState<StudyTask[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.TASKS);
    return saved ? JSON.parse(saved) : INITIAL_TASKS;
  });

  // Persist
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.PROFILE, JSON.stringify(profile));
  }, [profile]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.APPEARANCE, JSON.stringify(appearance));
  }, [appearance]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.COURSES, JSON.stringify(courses));
  }, [courses]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.MATERIALS, JSON.stringify(materials));
  }, [materials]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.CARDS, JSON.stringify(cards));
  }, [cards]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.TASKS, JSON.stringify(tasks));
  }, [tasks]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.IS_AUTH, String(isAuthenticated));
    localStorage.setItem(STORAGE_KEYS.USER_EMAIL, userEmail);
  }, [isAuthenticated, userEmail]);

  // Initial Coach Seed Messages
  const [coachMessages, setCoachMessages] = useState<CoachMessage[]>([
    {
      id: 'msg_welcome',
      sender: 'coach',
      text: 'Bonjour ! Je suis ton coach d’étude Noria. Je suis une intelligence artificielle conçue pour t’aider à comprendre tes cours par étapes et indices, sans faire les devoirs à ta place. Mes explications s’appuient directement sur tes supports importés.',
      timestamp: '10:30',
    },
    {
      id: 'msg_demo_q',
      sender: 'student',
      text: 'Je ne comprends pas bien pourquoi Sartre dit que l’inconscient freudien est de la « mauvaise foi ». Peux-tu m’aider ?',
      timestamp: '10:31',
    },
    {
      id: 'msg_demo_a',
      sender: 'coach',
      text: 'Excellente question de dissertation ! Décomposons cela ensemble avant d’écrire la réponse.',
      hints: [
        'Indice 1 : Réfléchis à ce que représente l’inconscient chez Freud : une force qui agit en nous sans que nous puissions la contrôler.',
        'Indice 2 : Pour Sartre, si nous disons « c’est mon inconscient qui a parlé », nous déchargeons notre responsabilité sur une force extérieure. C’est ce refus d’assumer notre liberté qu’il appelle « mauvaise foi ».',
        'Explication complète : Dans L’Être et le Néant, Sartre affirme que « l’homme est condamné à être libre ». Invoquer un inconscient psychique revient à se réfugier derrière un déterminisme confortable pour fuir l’angoisse de sa liberté totale.',
      ],
      activeHintIndex: 0,
      sources: [
        {
          courseName: 'Philosophie',
          materialName: 'Chapitre 2 — Conscience et Inconscient (Notes de cours).pdf',
          pageNumber: 5,
          quote: 'Pour Sartre, « l’homme est condamné à être libre » et la conscience est transparente à elle-même. Invoquer un inconscient revient à fuir sa responsabilité absolue.',
        },
      ],
      timestamp: '10:31',
    },
  ]);

  const updateProfile = (partial: Partial<StudyProfile>) => {
    setProfile((prev) => ({ ...prev, ...partial }));
    showToast('Profil mis à jour');
  };

  const updateAppearance = (partial: Partial<WorkspaceAppearance>) => {
    setAppearance((prev) => ({ ...prev, ...partial }));
    showToast('Apparence de ton espace enregistrée');
  };

  const resetAppearance = () => {
    setAppearance(INITIAL_APPEARANCE);
    showToast('Fond Noria par défaut restauré');
  };

  const addCourse = (newCourse: Omit<Course, 'id' | 'createdAt'>) => {
    const course: Course = {
      ...newCourse,
      id: `crs_${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    setCourses((prev) => [...prev, course]);
    showToast(`Matière « ${course.name} » créée`);
  };

  const removeCourse = (courseId: string) => {
    const course = courses.find((c) => c.id === courseId);
    setCourses((prev) => prev.filter((c) => c.id !== courseId));
    // Cascade delete related materials, cards, tasks
    setMaterials((prev) => prev.filter((m) => m.courseId !== courseId));
    setCards((prev) => prev.filter((cd) => cd.courseId !== courseId));
    setTasks((prev) => prev.filter((t) => t.courseId !== courseId));
    showToast(`Matière « ${course?.name || ''} » et ses dérivés supprimés`);
  };

  const addMaterial = (
    courseId: string,
    displayName: string,
    textContent: string,
    pageCount: number = 1
  ): LearningMaterial => {
    const matId = `mat_${Date.now()}`;
    // Split into paragraphs / logical chunks
    const paragraphs = textContent
      .split(/\n\s*\n/)
      .map((p) => p.trim())
      .filter((p) => p.length > 20);

    const chunks = (paragraphs.length > 0 ? paragraphs : [textContent]).map((p, idx) => ({
      id: `chk_${matId}_${idx}`,
      materialId: matId,
      pageNumber: Math.min(pageCount, idx + 1),
      sectionLabel: `Extrait ${idx + 1}`,
      chunkIndex: idx,
      textContent: p,
      contentHash: `hash_${idx}_${Date.now()}`,
    }));

    const newMat: LearningMaterial = {
      id: matId,
      courseId,
      displayName,
      mimeType: 'text/plain',
      sizeBytes: textContent.length * 2,
      processingStatus: 'ready',
      pageCount: Math.max(1, pageCount),
      chunks,
      createdAt: new Date().toISOString(),
    };

    setMaterials((prev) => [newMat, ...prev]);
    showToast(`Support « ${displayName} » analysé (${chunks.length} extraits identifiés)`);
    return newMat;
  };

  const removeMaterial = (materialId: string) => {
    const mat = materials.find((m) => m.id === materialId);
    setMaterials((prev) => prev.filter((m) => m.id !== materialId));
    // Remove cards linked to this material
    setCards((prev) => prev.filter((c) => c.materialId !== materialId));
    showToast(`Support « ${mat?.displayName || ''} » et ses dérivés supprimés`);
  };

  const addCard = (cardData: Omit<StudyCard, 'id' | 'createdAt' | 'reviewCount'>) => {
    const card: StudyCard = {
      ...cardData,
      id: `crd_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      reviewCount: 0,
      createdAt: new Date().toISOString(),
    };
    setCards((prev) => [card, ...prev]);
    showToast('Carte de révision ajoutée à ton espace');
  };

  const updateCard = (id: string, updates: Partial<StudyCard>) => {
    setCards((prev) => prev.map((c) => (c.id === id ? { ...c, ...updates } : c)));
    showToast('Carte mise à jour');
  };

  const removeCard = (id: string) => {
    setCards((prev) => prev.filter((c) => c.id !== id));
    showToast('Carte supprimée');
  };

  const recordPracticeAttempt = (
    cardId: string,
    rating: 'revoir' | 'hesitant' | 'acquis'
  ) => {
    setCards((prev) =>
      prev.map((c) => {
        if (c.id !== cardId) return c;
        // Spaced repetition interval in hours/days based on rating
        const now = new Date();
        let addDays = 1;
        if (rating === 'acquis') {
          addDays = Math.max(3, (c.reviewCount + 1) * 3);
        } else if (rating === 'hesitant') {
          addDays = 1;
        } else {
          addDays = 0.5; // Re-check today/tomorrow
        }
        const nextDate = new Date(now.getTime() + addDays * 24 * 60 * 60 * 1000);
        return {
          ...c,
          reviewCount: c.reviewCount + 1,
          lastRating: rating,
          nextReviewAt: nextDate.toISOString(),
        };
      })
    );
  };

  const addTask = (taskData: Omit<StudyTask, 'id'>) => {
    const newTask: StudyTask = {
      ...taskData,
      id: `tsk_${Date.now()}`,
    };
    setTasks((prev) => [newTask, ...prev]);
    showToast(`Échéance « ${newTask.title} » ajoutée`);
  };

  const toggleTask = (id: string) => {
    setTasks((prev) =>
      prev.map((t) => {
        if (t.id === id) {
          const nextStatus = t.status === 'todo' ? 'done' : 'todo';
          return { ...t, status: nextStatus };
        }
        return t;
      })
    );
  };

  const removeTask = (id: string) => {
    setTasks((prev) => prev.filter((t) => t.id !== id));
    showToast('Tâche retirée');
  };

  // Coach logic: search student materials for relevant keywords to provide grounded hints + quotes!
  const sendCoachQuestion = (questionText: string, selectedCourseId?: string) => {
    const userMsg: CoachMessage = {
      id: `usr_${Date.now()}`,
      sender: 'student',
      text: questionText,
      timestamp: new Date().toLocaleTimeString('fr-FR', {
        hour: '2-digit',
        minute: '2-digit',
      }),
    };

    setCoachMessages((prev) => [...prev, userMsg]);

    // Simulate Socratic reasoning & grounding
    setTimeout(() => {
      const qLower = questionText.toLowerCase();

      // Find matching chunks across materials
      let relevantChunks: { chunk: any; material: LearningMaterial; course: Course }[] = [];
      const searchMaterials = selectedCourseId
        ? materials.filter((m) => m.courseId === selectedCourseId)
        : materials;

      for (const m of searchMaterials) {
        const c = courses.find((co) => co.id === m.courseId);
        if (!c) continue;
        for (const ch of m.chunks) {
          const chLower = ch.textContent.toLowerCase();
          const words = qLower.split(/\s+/).filter((w) => w.length > 3);
          const matchCount = words.filter((w) => chLower.includes(w)).length;
          if (matchCount > 0) {
            relevantChunks.push({ chunk: ch, material: m, course: c });
          }
        }
      }

      let responseMsg: CoachMessage;

      if (relevantChunks.length > 0) {
        // Grounded response using student's course!
        const topMatch = relevantChunks[0];
        responseMsg = {
          id: `bot_${Date.now()}`,
          sender: 'coach',
          text: `J’ai trouvé un passage pertinent dans ton cours de **${topMatch.course.name}** (*${topMatch.material.displayName}*). Commençons par un indice pour te guider sans faire l'exercice à ta place :`,
          hints: [
            `Indice 1 : Regarde bien l'extrait cité ci-dessous. Quelle notion clé y est définie en premier ?`,
            `Indice 2 : En t'appuyant sur cette définition (« ${topMatch.chunk.textContent.slice(0, 80)}... »), essaie de reformuler avec tes propres mots comment cela s'applique à ta question.`,
            `Explication détaillée : D'après ton document, l'élément central à retenir est le suivant : ${topMatch.chunk.textContent}`,
          ],
          activeHintIndex: 0,
          sources: [
            {
              courseName: topMatch.course.name,
              materialName: topMatch.material.displayName,
              pageNumber: topMatch.chunk.pageNumber,
              quote: topMatch.chunk.textContent,
            },
          ],
          timestamp: new Date().toLocaleTimeString('fr-FR', {
            hour: '2-digit',
            minute: '2-digit',
          }),
        };
      } else {
        // Transparent fallback: no matching course excerpt found
        responseMsg = {
          id: `bot_${Date.now()}`,
          sender: 'coach',
          text: `Je ne trouve pas de passage suffisamment clair dans tes cours importés pour répondre avec certitude. Comme prévu par la charte Noria, voici une explication générale théorique, clairement séparée de tes notes personnelles :`,
          hints: [
            `Indice 1 : Dans le programme général, cette notion se résout souvent en isolant les définitions de départ avant de passer à l'application.`,
            `Indice 2 : Tu peux importer ton cours écrit ou tes notes de TD dans l'onglet « Mes cours » pour que je puisse m'appuyer sur la méthode exacte demandée par ton professeur.`,
            `Synthèse générale : Concernant « ${questionText.slice(0, 60)} », la méthode académique standard consiste à poser les hypothèses, identifier la règle théorique fondamentale, puis formuler la conclusion étape par étape.`,
          ],
          activeHintIndex: 0,
          isGeneralExplanation: true,
          timestamp: new Date().toLocaleTimeString('fr-FR', {
            hour: '2-digit',
            minute: '2-digit',
          }),
        };
      }

      setCoachMessages((prev) => [...prev, responseMsg]);
    }, 700);
  };

  const requestNextHint = (messageId: string) => {
    setCoachMessages((prev) =>
      prev.map((msg) => {
        if (msg.id === messageId && msg.hints) {
          const currentIdx = msg.activeHintIndex ?? 0;
          if (currentIdx < msg.hints.length - 1) {
            return { ...msg, activeHintIndex: currentIdx + 1 };
          }
        }
        return msg;
      })
    );
  };

  const reportCoachMessage = (messageId: string, reason: string) => {
    setCoachMessages((prev) =>
      prev.map((msg) => (msg.id === messageId ? { ...msg, reported: true } : msg))
    );
    showToast(`Signalement enregistré : « ${reason} ». Merci pour ton retour !`);
  };

  const clearCoachChat = () => {
    setCoachMessages([
      {
        id: `msg_${Date.now()}`,
        sender: 'coach',
        text: 'Historique de conversation réinitialisé. Pose-moi une question sur l’un de tes cours !',
        timestamp: new Date().toLocaleTimeString('fr-FR', {
          hour: '2-digit',
          minute: '2-digit',
        }),
      },
    ]);
    showToast('Historique de conversation effacé');
  };

  const exportUserData = () => {
    const payload = {
      exportDate: new Date().toISOString(),
      user: { email: userEmail, isAuthenticated, profile },
      courses,
      materials: materials.map((m) => ({
        id: m.id,
        courseId: m.courseId,
        displayName: m.displayName,
        pageCount: m.pageCount,
        chunkCount: m.chunks.length,
      })),
      cards,
      tasks,
      appearance,
    };

    const blob = new Blob([JSON.stringify(payload, null, 2)], {
      type: 'application/json',
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `noria-export-${new Date().toISOString().slice(0, 10)}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    showToast('Export JSON téléchargé avec succès');
  };

  const wipeAllData = () => {
    localStorage.clear();
    setProfile(DEFAULT_PROFILE);
    setAppearance(INITIAL_APPEARANCE);
    setCourses([]);
    setMaterials([]);
    setCards([]);
    setTasks([]);
    setIsAuthenticated(false);
    setIsGuestDemo(true);
    setCurrentView('landing');
    showToast('Toutes tes données locales ont été définitivement effacées');
  };

  return (
    <AppContext.Provider
      value={{
        currentView,
        setCurrentView,
        currentTab,
        setCurrentTab,
        isAuthenticated,
        setIsAuthenticated,
        isGuestDemo,
        setIsGuestDemo,
        userEmail,
        setUserEmail,
        profile,
        updateProfile,
        showOnboardingModal,
        setShowOnboardingModal,
        showAuthModal,
        setShowAuthModal,
        authModalMode,
        setAuthModalMode,
        showArchitectureModal,
        setShowArchitectureModal,
        appearance,
        updateAppearance,
        resetAppearance,
        courses,
        addCourse,
        removeCourse,
        materials,
        addMaterial,
        removeMaterial,
        cards,
        addCard,
        updateCard,
        removeCard,
        recordPracticeAttempt,
        tasks,
        addTask,
        toggleTask,
        removeTask,
        coachMessages,
        sendCoachQuestion,
        requestNextHint,
        reportCoachMessage,
        clearCoachChat,
        toastMessage,
        showToast,
        exportUserData,
        wipeAllData,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
};
