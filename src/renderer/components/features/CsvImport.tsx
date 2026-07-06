import React, { useState, useCallback } from 'react'
import { useDropzone } from 'react-dropzone'
import { Upload, FileText, AlertCircle, Check, X, ArrowRight } from 'lucide-react'
import Papa from 'papaparse'

interface CsvColumn {
  name: string
  mappedTo: string | null
  sample: string
}

interface ImportPreview {
  totalRows: number
  validRows: number
  errorRows: number
  duplicates: number
}

const FIELD_MAPPINGS = [
  { value: 'firstName', label: 'First Name', required: true },
  { value: 'lastName', label: 'Last Name', required: true },
  { value: 'email', label: 'Email', required: true },
  { value: 'phone', label: 'Phone', required: false },
  { value: 'organization', label: 'Organization', required: false },
  { value: 'tags', label: 'Tags', required: false },
]

export const CsvImport: React.FC = () => {
  const [file, setFile] = useState<File | null>(null)
  const [columns, setColumns] = useState<CsvColumn[]>([])
  const [preview, setPreview] = useState<ImportPreview | null>(null)
  const [step, setStep] = useState<'upload' | 'mapping' | 'preview' | 'importing'>('upload')
  const [progress, setProgress] = useState(0)
  const [error, setError] = useState<string | null>(null)

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0]
    if (!file) return

    setFile(file)
    setError(null)

    // Parse file to detect columns
    Papa.parse(file, {
      preview: 2,
      header: true,
      complete: (results) => {
        if (results.meta.fields) {
          const detectedColumns = results.meta.fields.map((field) => ({
            name: field,
            mappedTo: autoMapField(field),
            sample: results.data[0]?.[field] || '',
          }))
          setColumns(detectedColumns)
          setStep('mapping')
        }
      },
      error: (err) => {
        setError(`Failed to parse CSV: ${err.message}`)
      },
    })
  }, [])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'text/csv': ['.csv'],
      'application/vnd.ms-excel': ['.csv'],
    },
    maxFiles: 1,
  })

  const autoMapField = (columnName: string): string | null => {
    const lower = columnName.toLowerCase()
    
    if (lower.includes('first') || lower === 'fname' || lower === 'fn') return 'firstName'
    if (lower.includes('last') || lower === 'lname' || lower === 'ln') return 'lastName'
    if (lower.includes('email') || lower === 'e-mail') return 'email'
    if (lower.includes('phone') || lower === 'tel' || lower === 'mobile') return 'phone'
    if (lower.includes('org') || lower.includes('company')) return 'organization'
    if (lower.includes('tag') || lower.includes('label')) return 'tags'
    
    return null
  }

  const handleMappingChange = (columnName: string, mappedTo: string) => {
    setColumns(columns.map(col => 
      col.name === columnName ? { ...col, mappedTo: mappedTo || null } : col
    ))
  }

  const getRequiredMappings = () => {
    return FIELD_MAPPINGS.filter(f => f.required)
      .map(f => f.value)
      .filter(req => !columns.some(col => col.mappedTo === req))
  }

  const handleContinue = () => {
    const missing = getRequiredMappings()
    if (missing.length > 0) {
      setError(`Please map required fields: ${missing.map(m => FIELD_MAPPINGS.find(f => f.value === m)?.label).join(', ')}`)
      return
    }

    // Generate preview
    if (file) {
      Papa.parse(file, {
        header: true,
        complete: (results) => {
          const totalRows = results.data.length
          // Simulate validation
          setPreview({
            totalRows,
            validRows: Math.floor(totalRows * 0.9),
            errorRows: Math.floor(totalRows * 0.08),
            duplicates: Math.floor(totalRows * 0.02),
          })
          setStep('preview')
        },
      })
    }
  }

  const handleImport = async () => {
    setStep('importing')
    setProgress(0)

    // Simulate import progress
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval)
          return 100
        }
        return prev + 10
      })
    }, 500)
  }

  const reset = () => {
    setFile(null)
    setColumns([])
    setPreview(null)
    setStep('upload')
    setProgress(0)
    setError(null)
  }

  return (
    <div className="fox-csv-import">
      <div className="fox-panel-header">
        <h2>Import Contacts</h2>
        {step !== 'upload' && (
          <button className="fox-btn fox-btn-ghost" onClick={reset}>
            <X size={16} />
            Cancel
          </button>
        )}
      </div>

      {step === 'upload' && (
        <div className="fox-upload-step">
          <div
            {...getRootProps()}
            className={`fox-dropzone ${isDragActive ? 'active' : ''}`}
          >
            <input {...getInputProps()} />
            <Upload size={48} className="fox-dropzone-icon" />
            <p>Drag & drop a CSV file here, or click to browse</p>
            <span className="fox-muted">Supports .csv files up to 10MB</span>
          </div>

          {error && (
            <div className="fox-error-message">
              <AlertCircle size={16} />
              {error}
            </div>
          )}
        </div>
      )}

      {step === 'mapping' && file && (
        <div className="fox-mapping-step">
          <div className="fox-file-info">
            <FileText size={20} />
            <span>{file.name}</span>
            <span className="fox-muted">({(file.size / 1024).toFixed(1)} KB)</span>
          </div>

          <div className="fox-mapping-table">
            <div className="fox-mapping-header">
              <span>CSV Column</span>
              <span>Sample Data</span>
              <span>Maps To</span>
            </div>

            {columns.map((col) => (
              <div key={col.name} className="fox-mapping-row">
                <span className="fox-column-name">{col.name}</span>
                <span className="fox-sample-data">{col.sample || <span className="fox-muted">—</span>}</span>
                <select
                  className="fox-input fox-mapping-select"
                  value={col.mappedTo || ''}
                  onChange={(e) => handleMappingChange(col.name, e.target.value)}
                >
                  <option value="">— Skip —</option>
                  {FIELD_MAPPINGS.map((field) => (
                    <option 
                      key={field.value} 
                      value={field.value}
                      disabled={columns.some(c => c.mappedTo === field.value && c.name !== col.name)}
                    >
                      {field.label} {field.required && '*'}
                    </option>
                  ))}
                </select>
              </div>
            ))}
          </div>

          {error && (
            <div className="fox-error-message">
              <AlertCircle size={16} />
              {error}
            </div>
          )}

          <div className="fox-mapping-footer">
            <span className="fox-muted">* Required fields</span>
            <button className="fox-btn fox-btn-primary" onClick={handleContinue}>
              Continue
              <ArrowRight size={16} />
            </button>
          </div>
        </div>
      )}

      {step === 'preview' && preview && (
        <div className="fox-preview-step">
          <h3>Import Preview</h3>
          
          <div className="fox-preview-stats">
            <div className="fox-stat-card">
              <span className="fox-stat-value">{preview.totalRows}</span>
              <span className="fox-stat-label">Total Rows</span>
            </div>
            <div className="fox-stat-card success">
              <span className="fox-stat-value">{preview.validRows}</span>
              <span className="fox-stat-label">Ready to Import</span>
            </div>
            <div className="fox-stat-card warning">
              <span className="fox-stat-value">{preview.errorRows}</span>
              <span className="fox-stat-label">Has Errors</span>
            </div>
            <div className="fox-stat-card info">
              <span className="fox-stat-value">{preview.duplicates}</span>
              <span className="fox-stat-label">Duplicates</span>
            </div>
          </div>

          <div className="fox-preview-actions">
            <button className="fox-btn fox-btn-secondary" onClick={() => setStep('mapping')}>
              Back
            </button>
            <button className="fox-btn fox-btn-primary" onClick={handleImport}>
              <Check size={16} />
              Import {preview.validRows} Contacts
            </button>
          </div>
        </div>
      )}

      {step === 'importing' && (
        <div className="fox-importing-step">
          <div className="fox-progress-ring">
            <div 
              className="fox-progress-circle"
              style={{ '--progress': `${progress}%` } as React.CSSProperties}
            >
              <span>{progress}%</span>
            </div>
          </div>
          <p>Importing contacts... Please don't close the app.</p>
        </div>
      )}
    </div>
  )
}