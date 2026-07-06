import React, { useEffect, useState } from 'react'
import { useEducationStore, Course, Enrollment, Skill } from '../../stores/educationStore'
import { BookOpen, Award, Sparkles, Plus, Play, Clock, Users, Star, TrendingUp, CheckCircle } from 'lucide-react'
import { formatCurrency } from '../../utils/formatters'

type EducationTab = 'courses' | 'my-learning' | 'skills' | 'ai-generator'

const CATEGORY_CONFIG: Record<string, { icon: string; label: string; color: string }> = {
  financial_literacy: { icon: '💰', label: 'Financial Literacy', color: '#10b981' },
  leadership: { icon: '👑', label: 'Leadership', color: '#8b5cf6' },
  estate_planning: { icon: '📋', label: 'Estate Planning', color: '#3b82f6' },
  philanthropy: { icon: '🤝', label: 'Philanthropy', color: '#f59e0b' },
  investing: { icon: '📈', label: 'Investing', color: '#10b981' },
  business: { icon: '💼', label: 'Business', color: '#6366f1' },
  personal_development: { icon: '🌱', label: 'Personal Development', color: '#ec4899' },
  other: { icon: '📚', label: 'Other', color: '#6b7280' },
}

const DIFFICULTY_LABELS: Record<string, string> = {
  beginner: 'Beginner',
  intermediate: 'Intermediate',
  advanced: 'Advanced',
}

export const EducationView: React.FC = () => {
  const [activeTab, setActiveTab] = useState<EducationTab>('courses')
  const {
    courses,
    enrollments,
    skills,
    selectedCourse,
    isLoading,
    fetchCourses,
    fetchEnrollments,
    fetchSkills,
    selectCourse,
    enrollInCourse,
    generateAICourse,
  } = useEducationStore()

  useEffect(() => {
    fetchCourses()
    fetchEnrollments()
    fetchSkills()
  }, [fetchCourses, fetchEnrollments, fetchSkills])

  const getStats = () => {
    const totalCourses = courses.length
    const publishedCourses = courses.filter(c => c.status === 'published').length
    const myEnrollments = enrollments.length
    const completedEnrollments = enrollments.filter(e => e.status === 'completed').length
    const totalSkills = skills.length
    const inProgressSkills = skills.filter(s => s.level === 'developing' || s.level === 'proficient').length

    return { totalCourses, publishedCourses, myEnrollments, completedEnrollments, totalSkills, inProgressSkills }
  }

  const stats = getStats()

  const renderCoursesList = () => (
    <div className="fox-education-list">
      <div className="fox-list-toolbar">
        <div className="fox-search-wrapper">
          <input type="text" placeholder="Search courses..." className="fox-input" />
        </div>
        <div className="fox-education-actions">
          <button className="fox-btn fox-btn-secondary">
            <Award size={16} />
            My Certificates
          </button>
          <button className="fox-btn fox-btn-primary">
            <Plus size={16} />
            Create Course
          </button>
        </div>
      </div>

      <div className="fox-courses-grid">
        {courses.filter(c => c.status === 'published').map((course: Course) => (
          <div key={course.id} className="fox-course-card" onClick={() => selectCourse(course)}>
            <div className="fox-course-thumbnail">
              {course.thumbnail ? (
                <img src={course.thumbnail} alt={course.title} />
              ) : (
                <div className="fox-course-placeholder">
                  <span>{CATEGORY_CONFIG[course.category]?.icon || '📚'}</span>
                </div>
              )}
              <span className="fox-course-difficulty">{DIFFICULTY_LABELS[course.difficulty]}</span>
            </div>
            <div className="fox-course-content">
              <h4>{course.title}</h4>
              <p className="fox-course-description">{course.description}</p>
              <div className="fox-course-meta">
                <span className="fox-course-category">
                  {CATEGORY_CONFIG[course.category]?.icon} {CATEGORY_CONFIG[course.category]?.label}
                </span>
                <span className="fox-course-duration">
                  <Clock size={12} /> {Math.floor(course.durationMinutes / 60)}h {course.durationMinutes % 60}m
                </span>
              </div>
              <div className="fox-course-stats">
                <span><Users size={12} /> {course.enrolledCount} enrolled</span>
                <span><Star size={12} /> {course.averageRating.toFixed(1)}</span>
                <span>{course.completionRate}% completion</span>
              </div>
              <div className="fox-course-footer">
                <button 
                  className="fox-btn fox-btn-primary fox-btn-sm"
                  onClick={(e) => {
                    e.stopPropagation()
                    enrollInCourse(course.id)
                  }}
                >
                  <Play size={14} />
                  Enroll
                </button>
                {course.instructor && (
                  <span className="fox-course-instructor">by {course.instructor}</span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )

  const renderMyLearning = () => (
    <div className="fox-my-learning">
      <div className="fox-learning-header">
        <h3>My Learning Progress</h3>
        <div className="fox-learning-stats">
          <div className="fox-stat-box">
            <span className="fox-stat-number">{enrollments.length}</span>
            <span className="fox-stat-label">Enrolled</span>
          </div>
          <div className="fox-stat-box">
            <span className="fox-stat-number">{enrollments.filter(e => e.status === 'completed').length}</span>
            <span className="fox-stat-label">Completed</span>
          </div>
          <div className="fox-stat-box">
            <span className="fox-stat-number">{enrollments.filter(e => e.status === 'in_progress').length}</span>
            <span className="fox-stat-label">In Progress</span>
          </div>
        </div>
      </div>

      <div className="fox-enrollments-list">
        {enrollments.map((enrollment: Enrollment) => {
          const course = courses.find(c => c.id === enrollment.courseId)
          return (
            <div key={enrollment.id} className="fox-enrollment-card">
              <div className="fox-enrollment-info">
                <h4>{course?.title || 'Unknown Course'}</h4>
                <div className="fox-enrollment-meta">
                  <span className={`fox-enrollment-status fox-status-${enrollment.status}`}>
                    {enrollment.status.replace('_', ' ')}
                  </span>
                  <span>Started {new Date(enrollment.startedAt).toLocaleDateString()}</span>
                </div>
              </div>
              <div className="fox-enrollment-progress">
                <div className="fox-progress-bar-container">
                  <div className="fox-progress-bar" style={{ width: `${enrollment.progress}%` }} />
                  <span>{enrollment.progress}%</span>
                </div>
                {enrollment.status === 'in_progress' && (
                  <button className="fox-btn fox-btn-primary fox-btn-sm">
                    <Play size={14} />
                    Continue
                  </button>
                )}
                {enrollment.status === 'completed' && (
                  <span className="fox-completed-badge">
                    <CheckCircle size={14} />
                    Completed
                  </span>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )

  const renderSkills = () => (
    <div className="fox-skills-view">
      <div className="fox-list-toolbar">
        <h3>Skills Tracking</h3>
        <button className="fox-btn fox-btn-primary">
          <Plus size={16} />
          Add Skill
        </button>
      </div>

      <div className="fox-skills-grid">
        {skills.map((skill: Skill) => (
          <div key={skill.id} className="fox-skill-card">
            <div className="fox-skill-header">
              <h4>{skill.name}</h4>
              <span className={`fox-skill-level fox-level-${skill.level}`}>
                {skill.level}
              </span>
            </div>
            <p className="fox-skill-description">{skill.description}</p>
            <div className="fox-skill-progress">
              <div className="fox-progress-bar-container">
                <div className="fox-progress-bar" style={{ width: `${skill.progress}%` }} />
              </div>
              <span>{skill.progress}%</span>
            </div>
            <div className="fox-skill-evidence">
              <span>{skill.evidence.length} evidence items</span>
              {skill.targetLevel && (
                <span className="fox-skill-target">
                  Target: {skill.targetLevel}
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )

  const renderAIGenerator = () => (
    <div className="fox-ai-generator">
      <div className="fox-ai-header">
        <Sparkles size={32} className="fox-ai-icon" />
        <h3>AI Course Generator</h3>
        <p>Generate comprehensive courses using AI. Describe what you want to learn, and we'll create a structured course for you.</p>
      </div>

      <div className="fox-ai-form">
        <div className="fox-form-group">
          <label>What topic would you like to learn?</label>
          <textarea 
            className="fox-textarea" 
            placeholder="e.g., 'Introduction to Impact Investing for Family Offices' or 'How to evaluate private equity opportunities'"
            rows={4}
          />
        </div>

        <div className="fox-form-row">
          <div className="fox-form-group">
            <label>Category</label>
            <select className="fox-select">
              <option value="">Select category...</option>
              {Object.entries(CATEGORY_CONFIG).map(([key, config]) => (
                <option key={key} value={key}>{config.label}</option>
              ))}
            </select>
          </div>
          <div className="fox-form-group">
            <label>Difficulty</label>
            <select className="fox-select">
              <option value="beginner">Beginner</option>
              <option value="intermediate">Intermediate</option>
              <option value="advanced">Advanced</option>
            </select>
          </div>
        </div>

        <button 
          className="fox-btn fox-btn-primary fox-btn-lg"
          onClick={() => generateAICourse('test', 'financial_literacy', 'intermediate')}
          disabled={isLoading}
        >
          <Sparkles size={18} />
          {isLoading ? 'Generating...' : 'Generate Course'}
        </button>
      </div>

      <div className="fox-ai-features">
        <div className="fox-feature-card">
          <h4>🎯 Research-Based</h4>
          <p>AI researches the topic thoroughly before creating content</p>
        </div>
        <div className="fox-feature-card">
          <h4>📚 Structured Learning</h4>
          <p>Generates modules, lessons, and assessments automatically</p>
        </div>
        <div className="fox-feature-card">
          <h4>✏️ Editable</h4>
          <p>Review and customize before publishing to your family</p>
        </div>
      </div>
    </div>
  )

  return (
    <div className="fox-education-view">
      <div className="fox-education-header">
        <div className="fox-education-title">
          <h2>Family Education</h2>
        </div>
        <div className="fox-education-stats">
          <div className="fox-stat-card">
            <BookOpen size={16} />
            <span>{stats.publishedCourses} Courses</span>
          </div>
          <div className="fox-stat-card">
            <Award size={16} />
            <span>{stats.completedEnrollments} Certificates</span>
          </div>
          <div className="fox-stat-card">
            <TrendingUp size={16} />
            <span>{stats.totalSkills} Skills Tracked</span>
          </div>
        </div>
      </div>

      <div className="fox-directory-tabs">
        <button
          className={`fox-tab ${activeTab === 'courses' ? 'active' : ''}`}
          onClick={() => setActiveTab('courses')}
        >
          <BookOpen size={18} />
          Courses
        </button>
        <button
          className={`fox-tab ${activeTab === 'my-learning' ? 'active' : ''}`}
          onClick={() => setActiveTab('my-learning')}
        >
          <Play size={18} />
          My Learning
        </button>
        <button
          className={`fox-tab ${activeTab === 'skills' ? 'active' : ''}`}
          onClick={() => setActiveTab('skills')}
        >
          <TrendingUp size={18} />
          Skills
        </button>
        <button
          className={`fox-tab ${activeTab === 'ai-generator' ? 'active' : ''}`}
          onClick={() => setActiveTab('ai-generator')}
        >
          <Sparkles size={18} />
          AI Generator
        </button>
      </div>

      <div className="fox-education-content">
        {isLoading ? (
          <div className="fox-loading">Loading...</div>
        ) : (
          <>
            {activeTab === 'courses' && renderCoursesList()}
            {activeTab === 'my-learning' && renderMyLearning()}
            {activeTab === 'skills' && renderSkills()}
            {activeTab === 'ai-generator' && renderAIGenerator()}
          </>
        )}
      </div>
    </div>
  )
}
