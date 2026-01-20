import { useState, useEffect, useRef } from 'react'
import Papa from 'papaparse'
import * as XLSX from 'xlsx'

const ACCESS_CODE = 'Bijoux2024'

// API helpers
const API_URL = '/api/data'

async function loadData() {
  try {
    const res = await fetch(API_URL)
    if (res.ok) {
      return await res.json()
    }
  } catch (e) {
    console.log('No existing data')
  }
  return { salons: [], responses: {} }
}

async function saveData(data) {
  try {
    await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    })
  } catch (e) {
    console.error('Save failed:', e)
  }
}

// Icons
const SearchIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="11" cy="11" r="8"/>
    <path d="m21 21-4.35-4.35"/>
  </svg>
)

const UploadIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
    <polyline points="17 8 12 3 7 8"/>
    <line x1="12" y1="3" x2="12" y2="15"/>
  </svg>
)

const DownloadIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
    <polyline points="7 10 12 15 17 10"/>
    <line x1="12" y1="15" x2="12" y2="3"/>
  </svg>
)

const CheckIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
    <polyline points="20 6 9 17 4 12"/>
  </svg>
)

// Login Component
function Login({ onLogin }) {
  const [code, setCode] = useState('')
  const [error, setError] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    if (code === ACCESS_CODE) {
      localStorage.setItem('bijoux_auth', 'true')
      onLogin()
    } else {
      setError('Code incorrect')
      setCode('')
    }
  }

  return (
    <div className="login-container">
      <form className="login-card" onSubmit={handleSubmit}>
        <div className="login-logo">Bijoux</div>
        <div className="login-subtitle">Préférences Salons</div>
        <input
          type="password"
          className="login-input"
          placeholder="Code d'accès"
          value={code}
          onChange={(e) => setCode(e.target.value)}
          autoFocus
        />
        <button type="submit" className="login-button">
          Accéder
        </button>
        {error && <div className="login-error">{error}</div>}
      </form>
    </div>
  )
}

// Option Button Component
function OptionButton({ label, selected, onClick }) {
  return (
    <button
      type="button"
      className={`option-btn ${selected ? 'selected' : ''}`}
      onClick={onClick}
    >
      {label}
    </button>
  )
}

// Form Component
function SalonForm({ salon, existingData, onSave, onCancel }) {
  const [formData, setFormData] = useState({
    taille: existingData?.taille || '',
    couleurs: existingData?.couleurs || '',
    ratio: existingData?.ratio || '',
    rotation: existingData?.rotation || '',
    prenom: existingData?.prenom || '',
    telephone: existingData?.telephone || ''
  })

  const isComplete = formData.taille && formData.couleurs && formData.ratio && formData.rotation

  const handleOptionSelect = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleSave = () => {
    onSave(salon.id, { ...formData, completed: true, completedAt: new Date().toISOString() })
  }

  return (
    <div className="form-card">
      <div className="form-header">
        <div className="form-salon-name">{salon.nom}</div>
        <div className="form-salon-city">{salon.ville} - {salon.cp}</div>
      </div>
      
      <div className="form-body">
        <div className="form-section">
          <label className="form-label">Taille des bijoux</label>
          <div className="options-grid">
            <OptionButton
              label="Volumineux"
              selected={formData.taille === 'volumineux'}
              onClick={() => handleOptionSelect('taille', 'volumineux')}
            />
            <OptionButton
              label="Fin"
              selected={formData.taille === 'fin'}
              onClick={() => handleOptionSelect('taille', 'fin')}
            />
            <OptionButton
              label="Mixte"
              selected={formData.taille === 'mixte'}
              onClick={() => handleOptionSelect('taille', 'mixte')}
            />
          </div>
        </div>

        <div className="form-section">
          <label className="form-label">Couleur des bijoux</label>
          <div className="options-grid">
            <OptionButton
              label="Colorés"
              selected={formData.couleurs === 'colores'}
              onClick={() => handleOptionSelect('couleurs', 'colores')}
            />
            <OptionButton
              label="Neutres"
              selected={formData.couleurs === 'neutres'}
              onClick={() => handleOptionSelect('couleurs', 'neutres')}
            />
            <OptionButton
              label="Mixte"
              selected={formData.couleurs === 'mixte'}
              onClick={() => handleOptionSelect('couleurs', 'mixte')}
            />
          </div>
        </div>

        <div className="form-section">
          <label className="form-label">Ratio Argent / Doré</label>
          <div className="options-grid">
            <OptionButton
              label="50% / 50%"
              selected={formData.ratio === '50-50'}
              onClick={() => handleOptionSelect('ratio', '50-50')}
            />
            <OptionButton
              label="30% / 70%"
              selected={formData.ratio === '30-70'}
              onClick={() => handleOptionSelect('ratio', '30-70')}
            />
            <OptionButton
              label="10% / 90%"
              selected={formData.ratio === '10-90'}
              onClick={() => handleOptionSelect('ratio', '10-90')}
            />
          </div>
        </div>

        <div className="form-section">
          <label className="form-label">Rotation observée</label>
          <div className="options-grid">
            <OptionButton
              label="30 jours"
              selected={formData.rotation === '30'}
              onClick={() => handleOptionSelect('rotation', '30')}
            />
            <OptionButton
              label="45 jours"
              selected={formData.rotation === '45'}
              onClick={() => handleOptionSelect('rotation', '45')}
            />
            <OptionButton
              label="60 jours"
              selected={formData.rotation === '60'}
              onClick={() => handleOptionSelect('rotation', '60')}
            />
          </div>
        </div>

        <div className="form-section">
          <label className="form-label">Prénom de la gérante</label>
          <input
            type="text"
            className="text-input"
            placeholder="Ex: Marie"
            value={formData.prenom}
            onChange={(e) => setFormData(prev => ({ ...prev, prenom: e.target.value }))}
          />
        </div>

        <div className="form-section">
          <label className="form-label">Téléphone</label>
          <input
            type="tel"
            className="text-input"
            placeholder="Ex: 06 12 34 56 78"
            value={formData.telephone}
            onChange={(e) => setFormData(prev => ({ ...prev, telephone: e.target.value }))}
          />
        </div>
      </div>

      <div className="form-actions">
        <button type="button" className="btn btn-secondary" onClick={onCancel}>
          Annuler
        </button>
        <button
          type="button"
          className="btn btn-primary"
          onClick={handleSave}
          disabled={!isComplete}
        >
          Enregistrer
        </button>
      </div>
    </div>
  )
}

// Main App Component
function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [salons, setSalons] = useState([])
  const [responses, setResponses] = useState({})
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedSalon, setSelectedSalon] = useState(null)
  const [showResults, setShowResults] = useState(false)
  const [toast, setToast] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const fileInputRef = useRef(null)
  const searchRef = useRef(null)

  // Check auth on mount
  useEffect(() => {
    const auth = localStorage.getItem('bijoux_auth')
    if (auth === 'true') {
      setIsAuthenticated(true)
    }
  }, [])

  // Load data on mount
  useEffect(() => {
    if (isAuthenticated) {
      loadData().then(data => {
        setSalons(data.salons || [])
        setResponses(data.responses || {})
        setIsLoading(false)
      })
    }
  }, [isAuthenticated])

  // Click outside to close search
  useEffect(() => {
    function handleClickOutside(e) {
      if (searchRef.current && !searchRef.current.contains(e.target)) {
        setShowResults(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const showToast = (message, type = 'default') => {
    setToast({ message, type })
    setTimeout(() => setToast(null), 3000)
  }

  // Import CSV
  const handleFileImport = (e) => {
    const file = e.target.files[0]
    if (!file) return

    Papa.parse(file, {
      header: true,
      delimiter: ';',
      skipEmptyLines: true,
      complete: async (results) => {
        const importedSalons = results.data
          .filter(row => row['Nom du salon'] && row['Nom du salon'].trim())
          .map((row, index) => ({
            id: `salon_${index}`,
            nom: row['Nom du salon']?.trim() || '',
            ville: row['Ville']?.trim() || '',
            cp: row['Code postal']?.trim() || ''
          }))
        
        setSalons(importedSalons)
        await saveData({ salons: importedSalons, responses })
        showToast(`${importedSalons.length} salons importés`, 'success')
      },
      error: (error) => {
        showToast('Erreur lors de l\'import', 'error')
        console.error(error)
      }
    })

    e.target.value = ''
  }

  // Save response
  const handleSaveResponse = async (salonId, data) => {
    const newResponses = { ...responses, [salonId]: data }
    setResponses(newResponses)
    await saveData({ salons, responses: newResponses })
    setSelectedSalon(null)
    showToast('Préférences enregistrées', 'success')
  }

  // Export to Excel
  const handleExport = () => {
    const exportData = salons.map(salon => {
      const resp = responses[salon.id] || {}
      return {
        'Nom du salon': salon.nom,
        'Ville': salon.ville,
        'Code postal': salon.cp,
        'Taille': resp.taille || '',
        'Couleurs': resp.couleurs || '',
        'Ratio Argent/Doré': resp.ratio || '',
        'Rotation (jours)': resp.rotation || '',
        'Prénom gérante': resp.prenom || '',
        'Téléphone': resp.telephone || '',
        'Statut': resp.completed ? 'Complété' : 'En attente',
        'Date complétion': resp.completedAt ? new Date(resp.completedAt).toLocaleDateString('fr-FR') : ''
      }
    })

    const ws = XLSX.utils.json_to_sheet(exportData)
    const wb = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(wb, ws, 'Préférences Salons')
    XLSX.writeFile(wb, `preferences_salons_${new Date().toISOString().split('T')[0]}.xlsx`)
    showToast('Export Excel téléchargé', 'success')
  }

  // Filter salons
  const filteredSalons = salons.filter(salon => {
    const query = searchQuery.toLowerCase()
    return salon.nom.toLowerCase().includes(query) ||
           salon.ville.toLowerCase().includes(query)
  })

  // Stats
  const totalSalons = salons.length
  const completedCount = Object.values(responses).filter(r => r.completed).length
  const pendingCount = totalSalons - completedCount
  const progressPercent = totalSalons > 0 ? (completedCount / totalSalons) * 100 : 0

  if (!isAuthenticated) {
    return <Login onLogin={() => setIsAuthenticated(true)} />
  }

  if (isLoading) {
    return (
      <div className="login-container">
        <div className="login-card">
          <div className="login-logo">Bijoux</div>
          <div className="login-subtitle">Chargement...</div>
        </div>
      </div>
    )
  }

  return (
    <div className="app-container">
      <header className="header">
        <div className="header-content">
          <div className="header-logo">Bijoux</div>
          <div className="header-actions">
            {salons.length > 0 && (
              <button className="header-btn primary" onClick={handleExport}>
                <DownloadIcon />
                <span>Export</span>
              </button>
            )}
          </div>
        </div>
      </header>

      {salons.length > 0 && (
        <div className="stats-bar">
          <div className="stats-content">
            <div className="stat-item">
              <div className="stat-value">{totalSalons}</div>
              <div className="stat-label">Total</div>
            </div>
            <div className="stat-item">
              <div className="stat-value success">{completedCount}</div>
              <div className="stat-label">Complétés</div>
            </div>
            <div className="stat-item">
              <div className="stat-value warning">{pendingCount}</div>
              <div className="stat-label">En attente</div>
            </div>
          </div>
          <div className="progress-container">
            <div className="progress-bar">
              <div className="progress-fill" style={{ width: `${progressPercent}%` }} />
            </div>
          </div>
        </div>
      )}

      <main className="main-content">
        {salons.length === 0 ? (
          <div className="import-section">
            <div className="import-icon">💎</div>
            <div className="import-title">Importer vos salons</div>
            <div className="import-subtitle">
              Uploadez votre fichier CSV contenant<br />la liste de vos salons partenaires
            </div>
            <button className="import-btn" onClick={() => fileInputRef.current?.click()}>
              <UploadIcon />
              Importer CSV
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept=".csv"
              className="file-input"
              onChange={handleFileImport}
            />
          </div>
        ) : selectedSalon ? (
          <SalonForm
            salon={selectedSalon}
            existingData={responses[selectedSalon.id]}
            onSave={handleSaveResponse}
            onCancel={() => setSelectedSalon(null)}
          />
        ) : (
          <div className="search-section" ref={searchRef}>
            <div className="search-container">
              <span className="search-icon"><SearchIcon /></span>
              <input
                type="text"
                className="search-input"
                placeholder="Rechercher un salon..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => setShowResults(true)}
              />
              {showResults && searchQuery && (
                <div className="search-results">
                  {filteredSalons.length > 0 ? (
                    filteredSalons.slice(0, 20).map(salon => {
                      const isCompleted = responses[salon.id]?.completed
                      return (
                        <div
                          key={salon.id}
                          className={`search-result-item ${isCompleted ? 'completed' : ''}`}
                          onClick={() => {
                            setSelectedSalon(salon)
                            setShowResults(false)
                            setSearchQuery('')
                          }}
                        >
                          <div className="search-result-name">
                            {salon.nom}
                            {isCompleted && <span className="check"><CheckIcon /></span>}
                          </div>
                          <div className="search-result-city">{salon.ville} - {salon.cp}</div>
                        </div>
                      )
                    })
                  ) : (
                    <div className="no-results">Aucun salon trouvé</div>
                  )}
                </div>
              )}
            </div>
          </div>
        )}

        {salons.length > 0 && !selectedSalon && !searchQuery && (
          <div className="empty-state">
            <div className="empty-state-icon">🔍</div>
            <div className="empty-state-text">
              Recherchez un salon pour<br />remplir ses préférences
            </div>
          </div>
        )}
      </main>

      {toast && (
        <div className={`toast ${toast.type}`}>
          {toast.message}
        </div>
      )}
    </div>
  )
}

export default App
