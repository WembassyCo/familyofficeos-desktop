import { create } from 'zustand'
import { devtools } from 'zustand/middleware'
import { getDirectoryApi } from '../services/api'

export interface Course {
  id: string
  title: string
  description: string
  category: 'financial_literacy' | 'leadership' | 'estate_planning' | 'philanthropy' | 'investing' | 'business' | 'personal_development' | 'other'
  difficulty: 'beginner' | 'intermediate' | 'advanced'
  durationMinutes: number
  modules: Module[]
  thumbnail?: string
  instructor?: string
  tags: string[]
  enrolledCount: number
  completionRate: number
  averageRating: number
  status: 'draft' | 'published' | 'archived'
  prerequisites: string[]
  createdAt: string
  updatedAt: string
}

export interface Module {
  id: string
  courseId: string
  title: string
  description?: string
  order: number
  lessons: Lesson[]
  durationMinutes: number
}

export interface Lesson {
  id: string
  moduleId: string
  title: string
  content: string
  type: 'video' | 'text' | 'quiz' | 'interactive' | 'assignment'
  durationMinutes: number
  videoUrl?: string
  attachments: Attachment[]
  order: number
  isCompleted: boolean
  completedAt?: string
}

export interface Attachment {
  id: string
  name: string
  url: string
  type: string
  size: number
}

export interface Enrollment {
  id: string
  courseId: string
  courseTitle?: string
  userId: string
  userName?: string
  status: 'enrolled' | 'in_progress' | 'completed' | 'dropped'
  progress: number
  startedAt: string
  completedAt?: string
  lastAccessedAt: string
  modulesCompleted: string[]
  lessonsCompleted: string[]
  quizScores: QuizScore[]
}

export interface QuizScore {
  lessonId: string
  score: number
  maxScore: number
  completedAt: string
}

export interface Skill {
  id: string
  name: string
  description: string
  category: 'technical' | 'leadership' | 'financial' | 'communication' | 'strategic' | 'operational'
  level: 'novice' | 'developing' | 'proficient' | 'expert' | 'master'
  progress: number
  evidence: SkillEvidence[]
  targetLevel?: 'proficient' | 'expert' | 'master'
  targetDate?: string
  createdAt: string
  updatedAt: string
}

export interface SkillEvidence {
  id: string
  skillId: string
  type: 'course_completion' | 'project' | 'certification' | 'assessment' | 'peer_review' | 'mentorship'
  description: string
  proofUrl?: string
  verifiedBy?: string
  verifiedAt?: string
  createdAt: string
}

export interface AIGeneratedContent {
  id: string
  type: 'course_outline' | 'lesson_content' | 'quiz_questions' | 'case_study' | 'discussion_prompt'
  prompt: string
  generatedContent: string
  model: string
  tokensUsed: number
  approved: boolean
  approvedBy?: string
  approvedAt?: string
  createdAt: string
}

interface EducationState {
  courses: Course[]
  enrollments: Enrollment[]
  skills: Skill[]
  aiGeneratedContent: AIGeneratedContent[]
  selectedCourse: Course | null
  selectedEnrollment: Enrollment | null
  selectedSkill: Skill | null
  isLoading: boolean
  error: string | null
  
  // Filters
  categoryFilter: string | null
  difficultyFilter: string | null
  statusFilter: string | null
  
  // Actions
  fetchCourses: () => Promise<void>
  fetchCourse: (id: string) => Promise<void>
  fetchEnrollments: () => Promise<void>
  fetchSkills: () => Promise<void>
  
  createCourse: (course: Omit<Course, 'id' | 'createdAt' | 'updatedAt' | 'enrolledCount' | 'completionRate' | 'averageRating'>) => Promise<void>
  updateCourse: (id: string, updates: Partial<Course>) => Promise<void>
  deleteCourse: (id: string) => Promise<void>
  publishCourse: (id: string) => Promise<void>
  archiveCourse: (id: string) => Promise<void>
  
  enrollInCourse: (courseId: string) => Promise<void>
  updateProgress: (enrollmentId: string, lessonId: string, completed: boolean) => Promise<void>
  completeLesson: (enrollmentId: string, lessonId: string) => Promise<void>
  submitQuiz: (enrollmentId: string, lessonId: string, score: number, maxScore: number) => Promise<void>
  
  createSkill: (skill: Omit<Skill, 'id' | 'createdAt' | 'updatedAt' | 'progress' | 'evidence'>) => Promise<void>
  updateSkill: (id: string, updates: Partial<Skill>) => Promise<void>
  deleteSkill: (id: string) => Promise<void>
  addSkillEvidence: (skillId: string, evidence: Omit<SkillEvidence, 'id' | 'skillId' | 'createdAt'>) => Promise<void>
  verifySkillEvidence: (skillId: string, evidenceId: string, verifiedBy: string) => Promise<void>
  
  generateAICourse: (prompt: string, category: string, difficulty: string) => Promise<void>
  generateAILesson: (courseId: string, moduleId: string, topic: string) => Promise<void>
  approveAIGenerated: (contentId: string) => Promise<void>
  
  selectCourse: (course: Course | null) => void
  selectEnrollment: (enrollment: Enrollment | null) => void
  selectSkill: (skill: Skill | null) => void
  
  setCategoryFilter: (category: string | null) => void
  setDifficultyFilter: (difficulty: string | null) => void
  setStatusFilter: (status: string | null) => void
  clearFilters: () => void
}

export const useEducationStore = create<EducationState>()(
  devtools(
    (set, get) => ({
      courses: [],
      enrollments: [],
      skills: [],
      aiGeneratedContent: [],
      selectedCourse: null,
      selectedEnrollment: null,
      selectedSkill: null,
      isLoading: false,
      error: null,
      categoryFilter: null,
      difficultyFilter: null,
      statusFilter: null,

      fetchCourses: async () => {
        set({ isLoading: true, error: null })
        try {
          const api = getDirectoryApi()
          const courses = await api.getCourses()
          set({ courses, isLoading: false })
        } catch (error) {
          set({ error: (error as Error).message, isLoading: false })
        }
      },

      fetchCourse: async (id) => {
        try {
          const api = getDirectoryApi()
          const course = await api.getCourse(id)
          set((state) => ({
            courses: state.courses.map((c) => (c.id === id ? course : c)),
            selectedCourse: state.selectedCourse?.id === id ? course : state.selectedCourse
          }))
        } catch (error) {
          set({ error: (error as Error).message })
        }
      },

      fetchEnrollments: async () => {
        set({ isLoading: true, error: null })
        try {
          const api = getDirectoryApi()
          const enrollments = await api.getEnrollments()
          set({ enrollments, isLoading: false })
        } catch (error) {
          set({ error: (error as Error).message, isLoading: false })
        }
      },

      fetchSkills: async () => {
        set({ isLoading: true, error: null })
        try {
          const api = getDirectoryApi()
          const skills = await api.getSkills()
          set({ skills, isLoading: false })
        } catch (error) {
          set({ error: (error as Error).message, isLoading: false })
        }
      },

      createCourse: async (course) => {
        set({ isLoading: true, error: null })
        try {
          const api = getDirectoryApi()
          const newCourse = await api.createCourse(course)
          set((state) => ({
            courses: [newCourse, ...state.courses],
            isLoading: false
          }))
        } catch (error) {
          set({ error: (error as Error).message, isLoading: false })
        }
      },

      updateCourse: async (id, updates) => {
        try {
          const api = getDirectoryApi()
          const updated = await api.updateCourse(id, updates)
          set((state) => ({
            courses: state.courses.map((c) => (c.id === id ? updated : c)),
            selectedCourse: state.selectedCourse?.id === id ? updated : state.selectedCourse
          }))
        } catch (error) {
          set({ error: (error as Error).message })
        }
      },

      deleteCourse: async (id) => {
        try {
          const api = getDirectoryApi()
          await api.deleteCourse(id)
          set((state) => ({
            courses: state.courses.filter((c) => c.id !== id),
            selectedCourse: state.selectedCourse?.id === id ? null : state.selectedCourse
          }))
        } catch (error) {
          set({ error: (error as Error).message })
        }
      },

      publishCourse: async (id) => {
        await get().updateCourse(id, { status: 'published' })
      },

      archiveCourse: async (id) => {
        await get().updateCourse(id, { status: 'archived' })
      },

      enrollInCourse: async (courseId) => {
        set({ isLoading: true, error: null })
        try {
          const api = getDirectoryApi()
          const enrollment = await api.enrollInCourse(courseId)
          set((state) => ({
            enrollments: [enrollment, ...state.enrollments],
            isLoading: false
          }))
        } catch (error) {
          set({ error: (error as Error).message, isLoading: false })
        }
      },

      updateProgress: async (enrollmentId, lessonId, completed) => {
        try {
          const api = getDirectoryApi()
          const updated = await api.updateProgress(enrollmentId, lessonId, completed)
          set((state) => ({
            enrollments: state.enrollments.map((e) => (e.id === enrollmentId ? updated : e)),
            selectedEnrollment: state.selectedEnrollment?.id === enrollmentId ? updated : state.selectedEnrollment
          }))
        } catch (error) {
          set({ error: (error as Error).message })
        }
      },

      completeLesson: async (enrollmentId, lessonId) => {
        await get().updateProgress(enrollmentId, lessonId, true)
      },

      submitQuiz: async (enrollmentId, lessonId, score, maxScore) => {
        try {
          const api = getDirectoryApi()
          await api.submitQuiz(enrollmentId, lessonId, { score, maxScore })
          await get().fetchEnrollments()
        } catch (error) {
          set({ error: (error as Error).message })
        }
      },

      createSkill: async (skill) => {
        set({ isLoading: true, error: null })
        try {
          const api = getDirectoryApi()
          const newSkill = await api.createSkill(skill)
          set((state) => ({
            skills: [newSkill, ...state.skills],
            isLoading: false
          }))
        } catch (error) {
          set({ error: (error as Error).message, isLoading: false })
        }
      },

      updateSkill: async (id, updates) => {
        try {
          const api = getDirectoryApi()
          const updated = await api.updateSkill(id, updates)
          set((state) => ({
            skills: state.skills.map((s) => (s.id === id ? updated : s)),
            selectedSkill: state.selectedSkill?.id === id ? updated : state.selectedSkill
          }))
        } catch (error) {
          set({ error: (error as Error).message })
        }
      },

      deleteSkill: async (id) => {
        try {
          const api = getDirectoryApi()
          await api.deleteSkill(id)
          set((state) => ({
            skills: state.skills.filter((s) => s.id !== id),
            selectedSkill: state.selectedSkill?.id === id ? null : state.selectedSkill
          }))
        } catch (error) {
          set({ error: (error as Error).message })
        }
      },

      addSkillEvidence: async (skillId, evidence) => {
        try {
          const api = getDirectoryApi()
          await api.addSkillEvidence(skillId, evidence)
          await get().fetchSkills()
        } catch (error) {
          set({ error: (error as Error).message })
        }
      },

      verifySkillEvidence: async (skillId, evidenceId, verifiedBy) => {
        try {
          const api = getDirectoryApi()
          await api.verifySkillEvidence(skillId, evidenceId, { verifiedBy })
          await get().fetchSkills()
        } catch (error) {
          set({ error: (error as Error).message })
        }
      },

      generateAICourse: async (prompt, category, difficulty) => {
        set({ isLoading: true, error: null })
        try {
          const api = getDirectoryApi()
          const content = await api.generateAICourse({ prompt, category, difficulty })
          set((state) => ({
            aiGeneratedContent: [content, ...state.aiGeneratedContent],
            isLoading: false
          }))
        } catch (error) {
          set({ error: (error as Error).message, isLoading: false })
        }
      },

      generateAILesson: async (courseId, moduleId, topic) => {
        set({ isLoading: true, error: null })
        try {
          const api = getDirectoryApi()
          const content = await api.generateAILesson({ courseId, moduleId, topic })
          set((state) => ({
            aiGeneratedContent: [content, ...state.aiGeneratedContent],
            isLoading: false
          }))
        } catch (error) {
          set({ error: (error as Error).message, isLoading: false })
        }
      },

      approveAIGenerated: async (contentId) => {
        try {
          const api = getDirectoryApi()
          await api.approveAIGenerated(contentId)
          set((state) => ({
            aiGeneratedContent: state.aiGeneratedContent.map((c) =>
              c.id === contentId ? { ...c, approved: true } : c
            )
          }))
        } catch (error) {
          set({ error: (error as Error).message })
        }
      },

      selectCourse: (course) => set({ selectedCourse: course }),
      selectEnrollment: (enrollment) => set({ selectedEnrollment: enrollment }),
      selectSkill: (skill) => set({ selectedSkill: skill }),

      setCategoryFilter: (category) => set({ categoryFilter: category }),
      setDifficultyFilter: (difficulty) => set({ difficultyFilter: difficulty }),
      setStatusFilter: (status) => set({ statusFilter: status }),
      clearFilters: () => set({
        categoryFilter: null,
        difficultyFilter: null,
        statusFilter: null
      })
    }),
    { name: 'education-store' }
  )
)