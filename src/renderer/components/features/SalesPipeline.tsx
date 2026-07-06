import React, { useEffect, useState } from 'react'
import { useSalesStore, Opportunity } from '../../stores/salesStore'
import { Plus, MoreHorizontal, TrendingUp, DollarSign, Calendar, User } from 'lucide-react'
import { formatDistanceToNow, formatCurrency } from '../../utils/formatters'

const PIPELINE_STAGES = [
  { id: 'discovery', label: 'Discovery', color: '#3b82f6' },
  { id: 'proposal', label: 'Proposal', color: '#8b5cf6' },
  { id: 'negotiation', label: 'Negotiation', color: '#f59e0b' },
  { id: 'closed_won', label: 'Closed Won', color: '#10b981' },
  { id: 'closed_lost', label: 'Closed Lost', color: '#ef4444' },
] as const

export const SalesPipeline: React.FC = () => {
  const {
    opportunities,
    isLoading,
    fetchOpportunities,
    moveOpportunity,
    selectOpportunity,
    stageFilter
  } = useSalesStore()

  const [draggedOpp, setDraggedOpp] = useState<Opportunity | null>(null)
  const [dragOverStage, setDragOverStage] = useState<string | null>(null)

  useEffect(() => {
    fetchOpportunities()
  }, [fetchOpportunities])

  const getOpportunitiesByStage = (stage: string) => {
    return opportunities.filter((opp) => opp.stage === stage)
  }

  const handleDragStart = (e: React.DragEvent, opp: Opportunity) => {
    setDraggedOpp(opp)
    e.dataTransfer.effectAllowed = 'move'
  }

  const handleDragOver = (e: React.DragEvent, stageId: string) => {
    e.preventDefault()
    setDragOverStage(stageId)
  }

  const handleDragLeave = () => {
    setDragOverStage(null)
  }

  const handleDrop = async (e: React.DragEvent, stageId: string) => {
    e.preventDefault()
    setDragOverStage(null)
    
    if (draggedOpp && draggedOpp.stage !== stageId) {
      await moveOpportunity(draggedOpp.id, stageId as Opportunity['stage'])
    }
    setDraggedOpp(null)
  }

  const totalPipelineValue = opportunities
    .filter((o) => o.stage !== 'closed_lost')
    .reduce((sum, o) => sum + o.value, 0)

  const weightedPipelineValue = opportunities
    .filter((o) => o.stage !== 'closed_lost' && o.stage !== 'closed_won')
    .reduce((sum, o) => sum + (o.value * (o.probability / 100)), 0)

  const wonValue = opportunities
    .filter((o) => o.stage === 'closed_won')
    .reduce((sum, o) => sum + o.value, 0)

  return (
    <div className="fox-pipeline">
      {/* Header */}
      <div className="fox-pipeline-header">
        <div className="fox-pipeline-title">
          <h2>Sales Pipeline</h2>
          <span className="fox-count">{opportunities.length} opportunities</span>
        </div>
        <div className="fox-pipeline-stats">
          <div className="fox-stat-card">
            <TrendingUp size={16} />
            <div>
              <span className="fox-stat-label">Pipeline Value</span>
              <span className="fox-stat-value">{formatCurrency(totalPipelineValue)}</span>
            </div>
          </div>
          <div className="fox-stat-card">
            <DollarSign size={16} />
            <div>
              <span className="fox-stat-label">Weighted</span>
              <span className="fox-stat-value">{formatCurrency(weightedPipelineValue)}</span>
            </div>
          </div>
          <div className="fox-stat-card success">
            <DollarSign size={16} />
            <div>
              <span className="fox-stat-label">Closed Won</span>
              <span className="fox-stat-value">{formatCurrency(wonValue)}</span>
            </div>
          </div>
        </div>
        
        <button className="fox-btn fox-btn-primary">
          <Plus size={16} />
          Add Opportunity
        </button>
      </div>

      {/* Kanban Board */}
      <div className="fox-kanban">
        {PIPELINE_STAGES.map((stage) => {
          const stageOpps = getOpportunitiesByStage(stage.id)
          const stageValue = stageOpps.reduce((sum, o) => sum + o.value, 0)
          const isDropTarget = dragOverStage === stage.id

          return (
            <div
              key={stage.id}
              className={`fox-kanban-column ${isDropTarget ? 'drag-over' : ''}`}
              onDragOver={(e) => handleDragOver(e, stage.id)}
              onDragLeave={handleDragLeave}
              onDrop={(e) => handleDrop(e, stage.id)}
            >
              <div className="fox-kanban-header" style={{ borderTopColor: stage.color }}>
                <div className="fox-kanban-title">
                  <span 
                    className="fox-kanban-dot" 
                    style={{ backgroundColor: stage.color }}
                  />
                  {stage.label}
                </div>
                <div className="fox-kanban-meta">
                  <span className="fox-badge">{stageOpps.length}</span>
                  <span className="fox-kanban-value">{formatCurrency(stageValue)}</span>
                </div>
              </div>

              <div className="fox-kanban-cards">
                {stageOpps.map((opp) => (
                  <div
                    key={opp.id}
                    className="fox-kanban-card"
                    draggable
                    onDragStart={(e) => handleDragStart(e, opp)}
                    onClick={() => selectOpportunity(opp)}
                  >
                    <div className="fox-kanban-card-header">
                      <h4>{opp.name}</h4>
                      <button className="fox-btn fox-btn-ghost fox-btn-sm">
                        <MoreHorizontal size={14} />
                      </button>
                    </div>

                    <div className="fox-kanban-card-meta">
                      <div className="fox-kanban-card-contact">
                        <User size={14} />
                        {opp.contactName || 'No contact'}
                      </div>
                      
                      {opp.organizationName && (
                        <div className="fox-kanban-card-org">
                          {opp.organizationName}
                        </div>
                      )}
                    </div>

                    <div className="fox-kanban-card-footer">
                      <div className="fox-kanban-card-value">
                        {formatCurrency(opp.value)}
                      </div>
                      
                      {opp.expectedCloseDate && (
                        <div className="fox-kanban-card-date">
                          <Calendar size={12} />
                          {formatDistanceToNow(opp.expectedCloseDate)}
                        </div>
                      )}
                    </div>

                    {opp.probability > 0 && opp.stage !== 'closed_won' && opp.stage !== 'closed_lost' && (
                      <div className="fox-kanban-card-probability">
                        <div 
                          className="fox-probability-bar" 
                          style={{ width: `${opp.probability}%` }}
                        />
                        <span>{opp.probability}%</span>
                      </div>
                    )}
                  </div>
                ))}

                {stageOpps.length === 0 && (
                  <div className="fox-kanban-empty">
                    Drop opportunities here
                  </div>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}