import React, { useState, useEffect } from 'react'
import { useGovernanceStore, Decision, Meeting } from '../../stores/governanceStore'
import { Vote } from '../../stores/governanceStore'
import { Scale, Calendar, Users, Plus, MoreHorizontal, Clock, CheckCircle, AlertCircle, ChevronRight, MessageSquare, Paperclip } from 'lucide-react'
import { formatDate, formatCurrency } from '../../utils/formatters'

type GovernanceTab = 'decisions' | 'meetings'

const DECISION_STATUS_CONFIG = {
  draft: { color: 'default', label: 'Draft' },
  open: { color: 'info', label: 'Open' },
  voting: { color: 'warning', label: 'Voting' },
  closed: { color: 'default', label: 'Closed' },
  implemented: { color: 'success', label: 'Implemented' },
  rejected: { color: 'error', label: 'Rejected' },
}

const MEETING_STATUS_CONFIG = {
  scheduled: { color: 'info', label: 'Scheduled' },
  in_progress: { color: 'warning', label: 'In Progress' },
  completed: { color: 'success', label: 'Completed' },
  cancelled: { color: 'error', label: 'Cancelled' },
}

export const GovernanceView: React.FC = () => {
  const [activeTab, setActiveTab] = useState<GovernanceTab>('decisions')
  const {
    decisions,
    meetings,
    selectedDecision,
    isLoading,
    fetchDecisions,
    fetchMeetings,
    selectDecision,
    castVote,
  } = useGovernanceStore()

  useEffect(() => {
    fetchDecisions()
    fetchMeetings()
  }, [fetchDecisions, fetchMeetings])

  const getStats = () => {
    const activeDecisions = decisions.filter(d => ['open', 'voting'].includes(d.status)).length
    const pendingVotes = decisions.filter(d => d.status === 'voting').length
    const upcomingMeetings = meetings.filter(m => m.status === 'scheduled').length
    const implemented = decisions.filter(d => d.status === 'implemented').length

    return { activeDecisions, pendingVotes, upcomingMeetings, implemented }
  }

  const stats = getStats()

  const renderVotingProgress = (decision: Decision) => {
    const { for: forVotes, against, abstain, totalVoters, quorumMet } = decision.voteSummary
    const total = forVotes + against + abstain || 1
    const forPercent = (forVotes / total) * 100
    const againstPercent = (against / total) * 100
    const abstainPercent = (abstain / total) * 100

    return (
      <div className="fox-voting-progress">
        <div className="fox-voting-bars">
          <div
            className="fox-voting-bar fox-voting-for"
            style={{ width: `${forPercent}%` }}
            title={`For: ${forVotes}`}
          />
          <div
            className="fox-voting-bar fox-voting-against"
            style={{ width: `${againstPercent}%` }}
            title={`Against: ${against}`}
          />
          <div
            className="fox-voting-bar fox-voting-abstain"
            style={{ width: `${abstainPercent}%` }}
            title={`Abstain: ${abstain}`}
          />
        </div>
        <div className="fox-voting-legend">
          <span className="fox-voting-for">{forVotes} For</span>
          <span className="fox-voting-against">{against} Against</span>
          <span className="fox-voting-abstain">{abstain} Abstain</span>
          <span className={quorumMet ? 'fox-quorum-met' : 'fox-quorum-pending'}>
            {quorumMet ? '✓ Quorum Met' : 'Quorum Pending'}
          </span>
        </div>
      </div>
    )
  }

  const renderDecisionsList = () => (
    <div className="fox-governance-list">
      <div className="fox-list-toolbar">
        <div className="fox-search-wrapper">
          <input type="text" placeholder="Search decisions..." className="fox-input" />
        </div>
        <button className="fox-btn fox-btn-primary">
          <Plus size={16} />
          New Decision
        </button>
      </div>

      <div className="fox-table-wrapper">
        <table className="fox-table fox-governance-table">
          <thead>
            <tr>
              <th>Decision</th>
              <th>Category</th>
              <th>Status</th>
              <th>Voting</th>
              <th>Deadline</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {decisions.map((decision: Decision) => {
              const statusConfig = DECISION_STATUS_CONFIG[decision.status]
              return (
                <tr key={decision.id} onClick={() => selectDecision(decision)}>
                  <td>
                    <div className="fox-decision-title">
                      <Scale size={16} />
                      <span>{decision.title}</span>
                    </div>
                    <div className="fox-decision-meta">
                      Proposed by {decision.proposedByName} • {decision.comments.length} comments
                    </div>
                  </td>
                  <td>
                    <span className="fox-badge fox-badge-default">
                      {decision.category}
                    </span>
                  </td>
                  <td>
                    <span className={`fox-badge fox-badge-${statusConfig.color}`}>
                      {statusConfig.label}
                    </span>
                  </td>
                  <td className="fox-cell-voting">
                    {decision.status === 'voting' && renderVotingProgress(decision)}
                  </td>
                  <td className="fox-cell-date">
                    {decision.votingDeadline ? formatDate(decision.votingDeadline) : '—'}
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

  const renderMeetingsList = () => (
    <div className="fox-governance-list">
      <div className="fox-list-toolbar">
        <div className="fox-search-wrapper">
          <input type="text" placeholder="Search meetings..." className="fox-input" />
        </div>
        <button className="fox-btn fox-btn-primary">
          <Plus size={16} />
          Schedule Meeting
        </button>
      </div>

      <div className="fox-table-wrapper">
        <table className="fox-table fox-governance-table">
          <thead>
            <tr>
              <th>Meeting</th>
              <th>Type</th>
              <th>Status</th>
              <th>Date & Time</th>
              <th>Attendees</th>
              <th>Decisions</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {meetings.map((meeting: Meeting) => {
              const statusConfig = MEETING_STATUS_CONFIG[meeting.status]
              const confirmedCount = meeting.attendees.filter(a => a.status === 'confirmed').length
              const totalAttendees = meeting.attendees.length
              return (
                <tr key={meeting.id}>
                  <td>
                    <div className="fox-meeting-title">
                      <Calendar size={16} />
                      <span>{meeting.title}</span>
                    </div>
                    <div className="fox-meeting-meta">
                      {meeting.duration} min • {meeting.location || 'Virtual'}
                    </div>
                  </td>
                  <td>
                    <span className="fox-badge fox-badge-default">
                      {meeting.type}
                    </span>
                  </td>
                  <td>
                    <span className={`fox-badge fox-badge-${statusConfig.color}`}>
                      {statusConfig.label}
                    </span>
                  </td>
                  <td className="fox-cell-date">
                    {formatDate(meeting.scheduledAt)}
                  </td>
                  <td>
                    <div className="fox-attendees-count">
                      <Users size={12} />
                      {confirmedCount}/{totalAttendees} confirmed
                    </div>
                  </td>
                  <td>
                    {meeting.decisions.length > 0 && (
                      <span className="fox-badge fox-badge-info">
                        {meeting.decisions.length} decisions
                      </span>
                    )}
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

  return (
    <div className="fox-governance-view">
      <div className="fox-governance-header">
        <div className="fox-governance-title">
          <h2>Governance</h2>
        </div>
        <div className="fox-governance-stats">
          <div className="fox-stat-card">
            <Scale size={16} />
            <span>{stats.activeDecisions} Active Decisions</span>
          </div>
          <div className="fox-stat-card">
            <AlertCircle size={16} />
            <span>{stats.pendingVotes} Pending Votes</span>
          </div>
          <div className="fox-stat-card">
            <Calendar size={16} />
            <span>{stats.upcomingMeetings} Upcoming Meetings</span>
          </div>
          <div className="fox-stat-card">
            <CheckCircle size={16} />
            <span>{stats.implemented} Implemented</span>
          </div>
        </div>
      </div>

      <div className="fox-directory-tabs">
        <button
          className={`fox-tab ${activeTab === 'decisions' ? 'active' : ''}`}
          onClick={() => setActiveTab('decisions')}
        >
          <Scale size={18} />
          Decisions
        </button>
        <button
          className={`fox-tab ${activeTab === 'meetings' ? 'active' : ''}`}
          onClick={() => setActiveTab('meetings')}
        >
          <Calendar size={18} />
          Meetings
        </button>
      </div>

      <div className="fox-governance-content">
        {isLoading ? (
          <div className="fox-loading">Loading...</div>
        ) : (
          <>
            {activeTab === 'decisions' && renderDecisionsList()}
            {activeTab === 'meetings' && renderMeetingsList()}
          </>
        )}
      </div>
    </div>
  )
}
