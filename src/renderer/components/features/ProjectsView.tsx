import React, { useEffect, useState } from 'react'
import { useProjectStore, Project, Task } from '../../stores/projectStore'
import { Folder, CheckCircle, Clock, Calendar, Users, Plus, MoreHorizontal, Play, Pause } from 'lucide-react'
import { formatCurrency, formatDate } from '../../utils/formatters'

type ProjectsTab = 'projects' | 'tasks' | 'time'

const STATUS_CONFIG = {
  planning: { color: 'info', label: 'Planning' },
  active: { color: 'success', label: 'Active' },
  on_hold: { color: 'warning', label: 'On Hold' },
  completed: { color: 'default', label: 'Completed' },
  cancelled: { color: 'error', label: 'Cancelled' },
}

const TASK_STATUS_COLUMNS = [
  { id: 'todo', label: 'To Do', color: '#8b949e' },
  { id: 'in_progress', label: 'In Progress', color: '#3b82f6' },
  { id: 'review', label: 'Review', color: '#f59e0b' },
  { id: 'done', label: 'Done', color: '#10b981' },
]

export const ProjectsView: React.FC = () => {
  const [activeTab, setActiveTab] = useState<ProjectsTab>('projects')
  const {
    projects,
    tasks,
    timeEntries,
    selectedProject,
    isLoading,
    fetchProjects,
    fetchTasks,
    fetchTimeEntries,
    selectProject,
    moveTask,
  } = useProjectStore()

  const [activeTimer, setActiveTimer] = useState<string | null>(null)

  useEffect(() => {
    fetchProjects()
  }, [fetchProjects])

  useEffect(() => {
    if (selectedProject) {
      fetchTasks(selectedProject.id)
      fetchTimeEntries({ projectId: selectedProject.id })
    }
  }, [selectedProject, fetchTasks, fetchTimeEntries])

  const getProjectStats = () => {
    const totalBudget = projects.reduce((sum, p) => sum + (p.budget || 0), 0)
    const totalSpent = projects.reduce((sum, p) => sum + (p.spent || 0), 0)
    const avgProgress = projects.length > 0
      ? Math.round(projects.reduce((sum, p) => sum + p.progress, 0) / projects.length)
      : 0
    const activeProjects = projects.filter(p => p.status === 'active').length

    return { totalBudget, totalSpent, avgProgress, activeProjects }
  }

  const stats = getProjectStats()

  const getTasksByStatus = (status: string) => {
    return tasks.filter((t) => t.status === status)
  }

  const handleDragStart = (e: React.DragEvent, task: Task) => {
    e.dataTransfer.setData('taskId', task.id)
  }

  const handleDrop = async (e: React.DragEvent, newStatus: Task['status']) => {
    e.preventDefault()
    const taskId = e.dataTransfer.getData('taskId')
    if (taskId) {
      await moveTask(taskId, newStatus)
    }
  }

  const renderProjectsList = () => (
    <div className="fox-projects-list">
      <div className="fox-list-toolbar">
        <div className="fox-search-wrapper">
          <input type="text" placeholder="Search projects..." className="fox-input" />
        </div>
        <button className="fox-btn fox-btn-primary">
          <Plus size={16} />
          New Project
        </button>
      </div>

      <div className="fox-table-wrapper">
        <table className="fox-table fox-projects-table">
          <thead>
            <tr>
              <th>Project</th>
              <th>Status</th>
              <th>Progress</th>
              <th>Due Date</th>
              <th>Budget</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {projects.map((project: Project) => {
              const statusConfig = STATUS_CONFIG[project.status]
              return (
                <tr key={project.id} onClick={() => selectProject(project)}>
                  <td>
                    <div className="fox-project-name">
                      <Folder size={16} />
                      <span>{project.name}</span>
                    </div>
                    {project.clientName && (
                      <div className="fox-project-client">{project.clientName}</div>
                    )}
                  </td>
                  <td>
                    <span className={`fox-badge fox-badge-${statusConfig.color}`}>
                      {statusConfig.label}
                    </span>
                  </td>
                  <td>
                    <div className="fox-progress-bar-container">
                      <div
                        className="fox-progress-bar"
                        style={{ width: `${project.progress}%` }}
                      />
                      <span>{project.progress}%</span>
                    </div>
                  </td>
                  <td>{project.dueDate ? formatDate(project.dueDate) : '—'}</td>
                  <td>
                    {project.budget
                      ? `${formatCurrency(project.spent || 0)} / ${formatCurrency(project.budget)}`
                      : '—'}
                  </td>
                  <td>
                    <button className="fox-btn fox-btn-ghost fox-btn-sm">
                      <MoreHorizontal size={14} />
                    </button>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )

  const renderTasksBoard = () => {
    if (!selectedProject) {
      return (
        <div className="fox-empty">
          <div className="fox-empty-icon">📋</div>
          <div className="fox-empty-title">Select a Project</div>
          <div className="fox-empty-description">
            Choose a project from the Projects tab to view and manage tasks.
          </div>
        </div>
      )
    }

    return (
      <div className="fox-tasks-board">
        <div className="fox-tasks-header">
          <h3>{selectedProject.name}</h3>
          <button className="fox-btn fox-btn-primary fox-btn-sm">
            <Plus size={14} />
            Add Task
          </button>
        </div>

        <div className="fox-kanban">
          {TASK_STATUS_COLUMNS.map((column) => {
            const columnTasks = getTasksByStatus(column.id)
            return (
              <div
                key={column.id}
                className="fox-kanban-column"
                onDragOver={(e) => e.preventDefault()}
                onDrop={(e) => handleDrop(e, column.id as Task['status'])}
              >
                <div className="fox-kanban-header" style={{ borderTopColor: column.color }}>
                  <span className="fox-kanban-title">
                    <span
                      className="fox-kanban-dot"
                      style={{ backgroundColor: column.color }}
                    />
                    {column.label}
                  </span>
                  <span className="fox-badge">{columnTasks.length}</span>
                </div>

                <div className="fox-kanban-cards">
                  {columnTasks.map((task: Task) => (
                    <div
                      key={task.id}
                      className="fox-kanban-card"
                      draggable
                      onDragStart={(e) => handleDragStart(e, task)}
                    >
                      <h4>{task.name}</h4>
                      {task.assignedToName && (
                        <div className="fox-task-assignee">
                          <Users size={12} />
                          {task.assignedToName}
                        </div>
                      )}
                      {task.estimatedHours && (
                        <div className="fox-task-hours">
                          <Clock size={12} />
                          {task.actualHours}h / {task.estimatedHours}h
                        </div>
                      )}
                      {task.dueDate && (
                        <div className="fox-task-due">
                          <Calendar size={12} />
                          {formatDate(task.dueDate)}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )
          })}
        </div>
      </div>
    )
  }

  const renderTimeTracking = () => (
    <div className="fox-time-tracking">
      <div className="fox-list-toolbar">
        <h3>Time Entries</h3>
        <button className="fox-btn fox-btn-primary">
          <Plus size={16} />
          Log Time
        </button>
      </div>

      <div className="fox-table-wrapper">
        <table className="fox-table">
          <thead>
            <tr>
              <th>Project</th>
              <th>Task</th>
              <th>Description</th>
              <th>Duration</th>
              <th>Billable</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {timeEntries.map((entry) => (
              <tr key={entry.id}>
                <td>{entry.projectName}</td>
                <td>{entry.taskName}</td>
                <td>{entry.description || '—'}</td>
                <td>{Math.round(entry.duration / 60 * 10) / 10}h</td>
                <td>
                  {entry.billable ? (
                    <span className="fox-badge fox-badge-success">Billable</span>
                  ) : (
                    <span className="fox-badge fox-badge-default">Non-billable</span>
                  )}
                </td>
                <td>
                  <button className="fox-btn fox-btn-ghost fox-btn-sm">
                    <MoreHorizontal size={14} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )

  return (
    <div className="fox-projects-view">
      <div className="fox-projects-header">
        <div className="fox-projects-title">
          <h2>Projects</h2>
        </div>
        <div className="fox-projects-stats">
          <div className="fox-stat-card">
            <Folder size={16} />
            <span>{stats.activeProjects} Active</span>
          </div>
          <div className="fox-stat-card">
            <CheckCircle size={16} />
            <span>{stats.avgProgress}% Avg Progress</span>
          </div>
          <div className="fox-stat-card">
            <Clock size={16} />
            <span>
              {formatCurrency(stats.totalSpent)} / {formatCurrency(stats.totalBudget)}
            </span>
          </div>
        </div>
      </div>

      <div className="fox-directory-tabs">
        <button
          className={`fox-tab ${activeTab === 'projects' ? 'active' : ''}`}
          onClick={() => setActiveTab('projects')}
        >
          <Folder size={18} />
          Projects
        </button>
        <button
          className={`fox-tab ${activeTab === 'tasks' ? 'active' : ''}`}
          onClick={() => setActiveTab('tasks')}
        >
          <CheckCircle size={18} />
          Tasks
        </button>
        <button
          className={`fox-tab ${activeTab === 'time' ? 'active' : ''}`}
          onClick={() => setActiveTab('time')}
        >
          <Clock size={18} />
          Time
        </button>
      </div>

      <div className="fox-projects-content">
        {isLoading ? (
          <div className="fox-loading">Loading...</div>
        ) : (
          <>
            {activeTab === 'projects' && renderProjectsList()}
            {activeTab === 'tasks' && renderTasksBoard()}
            {activeTab === 'time' && renderTimeTracking()}
          </>
        )}
      </div>
    </div>
  )
}
