import { useState, useEffect } from 'react'

function App() {
  const [activeTab, setActiveTab] = useState('view')
  const [portfolios, setPortfolios] = useState([])
  const [currentPortfolio, setCurrentPortfolio] = useState(null)

  const [formData, setFormData] = useState({
    name: '',
    profession: '',
    about: '',
    email: '',
    phone: '',
    skills: [],
    projects: []
  })

  const [newSkill, setNewSkill] = useState('')
  const [newProject, setNewProject] = useState({ title: '', description: '' })

  useEffect(() => {
    const savedPortfolios = localStorage.getItem('portfolios')
    if (savedPortfolios) {
      setPortfolios(JSON.parse(savedPortfolios))
    }
  }, [])

  useEffect(() => {
    localStorage.setItem('portfolios', JSON.stringify(portfolios))
  }, [portfolios])

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const addSkill = () => {
    if (newSkill.trim() && !formData.skills.includes(newSkill.trim())) {
      setFormData(prev => ({
        ...prev,
        skills: [...prev.skills, newSkill.trim()]
      }))
      setNewSkill('')
    }
  }

  const removeSkill = (skillToRemove) => {
    setFormData(prev => ({
      ...prev,
      skills: prev.skills.filter(skill => skill !== skillToRemove)
    }))
  }

  const addProject = () => {
    if (newProject.title.trim() && newProject.description.trim()) {
      setFormData(prev => ({
        ...prev,
        projects: [...prev.projects, { ...newProject, id: Date.now() }]
      }))
      setNewProject({ title: '', description: '' })
    }
  }

  const removeProject = (projectId) => {
    setFormData(prev => ({
      ...prev,
      projects: prev.projects.filter(project => project.id !== projectId)
    }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    const newPortfolio = {
      id: Date.now(),
      ...formData,
      createdAt: new Date().toISOString()
    }
    
    setPortfolios(prev => [...prev, newPortfolio])
    setFormData({
      name: '',
      profession: '',
      about: '',
      email: '',
      phone: '',
      skills: [],
      projects: []
    })
    alert('Портфолио успешно создано!')
  }

  const viewPortfolio = (portfolio) => {
    setCurrentPortfolio(portfolio)
    setActiveTab('view')
  }

  const deletePortfolio = (portfolioId) => {
    if (confirm('Вы уверены, что хотите удалить это портфолио?')) {
      setPortfolios(prev => prev.filter(p => p.id !== portfolioId))
      if (currentPortfolio && currentPortfolio.id === portfolioId) {
        setCurrentPortfolio(null)
      }
    }
  }

  return (
    <div>
      {/* Header */}
      <header>
        <div className="container">
          <nav>
            <div className="logo">Portfolio</div>
            <ul className="nav-links">
              <li><a href="#" onClick={() => setActiveTab('list')}>Все портфолио</a></li>
              <li><a href="#" onClick={() => setActiveTab('view')}>Просмотр</a></li>
              <li><a href="#" onClick={() => setActiveTab('create')}>Создать</a></li>
            </ul>
          </nav>
        </div>
      </header>

      <div className="main-content container">
        {/* Tabs */}
        <div className="tabs">
           <button 
            className={`tab ${activeTab === 'list' ? 'active' : ''}`}
            onClick={() => setActiveTab('list')}
          >
            Все портфолио ({portfolios.length})
          </button>
          <button 
            className={`tab ${activeTab === 'view' ? 'active' : ''}`}
            onClick={() => setActiveTab('view')}
          >
            Просмотр
          </button>
          <button 
            className={`tab ${activeTab === 'create' ? 'active' : ''}`}
            onClick={() => setActiveTab('create')}
          >
            Создать портфолио
          </button>
         
        </div>

        {/* View Portfolio Tab */}
        <div className={`tab-content ${activeTab === 'view' ? 'active' : ''}`}>
          {currentPortfolio ? (
            <div className="portfolio-view">
              <div className="portfolio-hero">
                <h1>{currentPortfolio.name}</h1>
                <p>{currentPortfolio.profession}</p>
              </div>
              
              <div className="portfolio-content">
                <div className="portfolio-sidebar">
                  <div className="section">
                    <h2>Контакты</h2>
                    <p>📧 {currentPortfolio.email}</p>
                    <p>📞 {currentPortfolio.phone}</p>
                  </div>
                  
                  <div className="section">
                    <h2>Навыки</h2>
                    <div className="portfolio-skills">
                      {currentPortfolio.skills.map((skill, index) => (
                        <span key={index} className="skill-tag">{skill}</span>
                      ))}
                    </div>
                  </div>
                </div>
                
                <div className="portfolio-main">
                  <div className="section">
                    <h2>Обо мне</h2>
                    <p>{currentPortfolio.about}</p>
                  </div>
                  
                  <div className="section">
                    <h2>Проекты</h2>
                    <div className="projects-grid">
                      {currentPortfolio.projects.map(project => (
                        <div key={project.id} className="project-card">
                          <h3>{project.title}</h3>
                          <p>{project.description}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="portfolio-view">
              <div className="portfolio-hero">
                <h1>Добро пожаловать!</h1>
                <p>Выберите портфолио для просмотра или создайте новое</p>
              </div>
            </div>
          )}
        </div>

        {/* Create Portfolio Tab */}
        <div className={`tab-content ${activeTab === 'create' ? 'active' : ''}`}>
          <div className="admin-panel">
            <h2>Создать новое портфолио</h2>
            
            <form onSubmit={handleSubmit}>
              <div className="form-grid">
                <div className="form-group">
                  <label>Имя и Фамилия *</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="form-control"
                    required
                  />
                </div>
                
                <div className="form-group">
                  <label>Профессия *</label>
                  <input
                    type="text"
                    name="profession"
                    value={formData.profession}
                    onChange={handleInputChange}
                    className="form-control"
                    required
                  />
                </div>
                
                <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                  <label>Обо мне *</label>
                  <textarea
                    name="about"
                    value={formData.about}
                    onChange={handleInputChange}
                    className="form-control"
                    required
                  />
                </div>
                
                <div className="form-group">
                  <label>Email *</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="form-control"
                    required
                  />
                </div>
                
                <div className="form-group">
                  <label>Телефон</label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="form-control"
                  />
                </div>
                
                <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                  <label>Навыки</label>
                  <div className="skills-input">
                    <input
                      type="text"
                      value={newSkill}
                      onChange={(e) => setNewSkill(e.target.value)}
                      className="form-control"
                      placeholder="Добавить навык"
                    />
                    <button type="button" onClick={addSkill} className="btn btn-outline">
                      Добавить
                    </button>
                  </div>
                  <div className="portfolio-skills" style={{ marginTop: '1rem' }}>
                    {formData.skills.map((skill, index) => (
                      <span key={index} className="skill-tag">
                        {skill}
                        <button 
                          type="button"
                          onClick={() => removeSkill(skill)}
                          style={{ marginLeft: '0.5rem', background: 'none', border: 'none', color: 'white', cursor: 'pointer' }}
                        >
                          ×
                        </button>
                      </span>
                    ))}
                  </div>
                </div>
                
                <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                  <label>Проекты</label>
                  <div style={{ marginBottom: '1rem' }}>
                    <input
                      type="text"
                      value={newProject.title}
                      onChange={(e) => setNewProject(prev => ({ ...prev, title: e.target.value }))}
                      className="form-control"
                      placeholder="Название проекта"
                      style={{ marginBottom: '0.5rem' }}
                    />
                    <textarea
                      value={newProject.description}
                      onChange={(e) => setNewProject(prev => ({ ...prev, description: e.target.value }))}
                      className="form-control"
                      placeholder="Описание проекта"
                    />
                    <button type="button" onClick={addProject} className="btn btn-outline" style={{ marginTop: '0.5rem' }}>
                      Добавить проект
                    </button>
                  </div>
                  
                  <div className="projects-grid">
                    {formData.projects.map(project => (
                      <div key={project.id} className="project-card">
                        <h4>{project.title}</h4>
                        <p>{project.description}</p>
                        <button 
                          type="button"
                          onClick={() => removeProject(project.id)}
                          className="btn btn-outline"
                          style={{ marginTop: '0.5rem', padding: '0.25rem 0.5rem', fontSize: '0.8rem' }}
                        >
                          Удалить
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              
              <button type="submit" className="btn btn-primary">
                Создать портфолио
              </button>
            </form>
          </div>
        </div>

        {/* Portfolio List Tab */}
        <div className={`tab-content ${activeTab === 'list' ? 'active' : ''}`}>
          <h2>Все портфолио ({portfolios.length})</h2>
          
          {portfolios.length === 0 ? (
            <p>Портфолио пока нет. Создайте первое!</p>
          ) : (
            <div className="portfolio-list">
              {portfolios.map(portfolio => (
                <div key={portfolio.id} className="portfolio-card">
                  <div className="portfolio-header">
                    <div className="portfolio-info">
                      <h3>{portfolio.name}</h3>
                      <p>{portfolio.profession}</p>
                      <small>{new Date(portfolio.createdAt).toLocaleDateString()}</small>
                    </div>
                  </div>
                  
                  <p style={{ marginBottom: '1rem', fontSize: '0.9rem' }}>
                    {portfolio.about.substring(0, 100)}...
                  </p>
                  
                  <div className="portfolio-skills">
                    {portfolio.skills.slice(0, 3).map((skill, index) => (
                      <span key={index} className="skill-tag">{skill}</span>
                    ))}
                    {portfolio.skills.length > 3 && (
                      <span className="skill-tag">+{portfolio.skills.length - 3}</span>
                    )}
                  </div>
                  
                  <div className="portfolio-actions">
                    <button 
                      onClick={() => viewPortfolio(portfolio)}
                      className="btn btn-primary"
                      style={{ flex: 1 }}
                    >
                      Просмотр
                    </button>
                    <button 
                      onClick={() => deletePortfolio(portfolio.id)}
                      className="btn btn-outline"
                    >
                      Удалить
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default App    