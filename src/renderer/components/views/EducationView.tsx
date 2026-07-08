import React, { useState } from 'react'

export const EducationView: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'courses' | 'skills' | 'resources'>('courses')

  const courses = [
    { id: '1', title: 'Family Office Fundamentals', progress: 75, total: 12, completed: 9, thumbnail: '📚' },
    { id: '2', title: 'Investment Basics for Next Gen', progress: 30, total: 8, completed: 2, thumbnail: '💹' },
    { id: '3', title: 'Governance & Decision Making', progress: 0, total: 10, completed: 0, thumbnail: '⚖️' },
  ]

  return (
    <div className="view education-view">
      <div className="view-header">
        <h1>Education</h1>
        <p>Family education, courses, and skill development</p>
      </div>

      <div className="view-toolbar">
        <div className="view-tabs">
          <button className={activeTab === 'courses' ? 'active' : ''} onClick={() => setActiveTab('courses')}>Courses</button>
          <button className={activeTab === 'skills' ? 'active' : ''} onClick={() => setActiveTab('skills')}>Skills</button>
          <button className={activeTab === 'resources' ? 'active' : ''} onClick={() => setActiveTab('resources')}>Resources</button>
        </div>
        <button className="btn-primary">
          <span>🤖</span> AI Generate Course
        </button>
      </div>

      <div className="view-content">
        {activeTab === 'courses' && (
          <div className="courses-grid">
            {courses.map((course) => (
              <div key={course.id} className="course-card">
                <div className="course-thumbnail">{course.thumbnail}</div>
                <div className="course-info">
                  <h4>{course.title}</h4>
                  <div className="course-progress">
                    <div className="progress-bar">
                      <div className="progress-fill" style={{ width: `${course.progress}%` }} />
                    </div>
                    <span>{course.progress}% • {course.completed}/{course.total} lessons</span>
                  </div>
                </div>
                <button className="btn-secondary">
                  {course.progress === 0 ? 'Start' : 'Continue'}
                </button>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'skills' && (
          <div className="placeholder-content">
            <div className="placeholder-icon">🎯</div>
            <h3>Skills Tracking</h3>
            <p>Family member skill assessments and development paths</p>
          </div>
        )}

        {activeTab === 'resources' && (
          <div className="placeholder-content">
            <div className="placeholder-icon">📖</div>
            <h3>Resource Library</h3>
            <p>Articles, videos, and educational materials</p>
          </div>
        )}
      </div>
    </div>
  )
}
