import { useState, useEffect } from "react";


function App() {
  const [activeTab, setActiveTab] = useState("home");
  const [portfolios, setPortfolios] = useState([]);
  const [currentPortfolio, setCurrentPortfolio] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [search, setSearch] = useState("");
  const [sortOrder, setSortOrder] = useState("desc");
  const [darkMode, setDarkMode] = useState(false);
  const [exportData, setExportData] = useState("");
  const [importData, setImportData] = useState("");

  const [formData, setFormData] = useState({
    name: "",
    profession: "",
    about: "",
    email: "",
    phone: "",
    photo: "",
    skills: [],
    projects: [],
  });

  const [newSkill, setNewSkill] = useState("");
  const [newProject, setNewProject] = useState({ title: "", description: "" });

  useEffect(() => {
    const savedPortfolios = localStorage.getItem("portfolios");
    const savedDarkMode = localStorage.getItem("darkMode");
    if (savedPortfolios) {
      setPortfolios(JSON.parse(savedPortfolios));
    }
    if (savedDarkMode) {
      setDarkMode(JSON.parse(savedDarkMode));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("portfolios", JSON.stringify(portfolios));
    localStorage.setItem("darkMode", JSON.stringify(darkMode));
  }, [portfolios, darkMode]);

  useEffect(() => {
    if (darkMode) {
      document.body.classList.add("dark-mode");
    } else {
      document.body.classList.remove("dark-mode");
    }
  }, [darkMode]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const addSkill = () => {
    if (newSkill.trim() && !formData.skills.includes(newSkill.trim())) {
      setFormData((prev) => ({
        ...prev,
        skills: [...prev.skills, newSkill.trim()],
      }));
      setNewSkill("");
    }
  };

  const removeSkill = (skillToRemove) => {
    setFormData((prev) => ({
      ...prev,
      skills: prev.skills.filter((skill) => skill !== skillToRemove),
    }));
  };

  const addProject = () => {
    if (newProject.title.trim() && newProject.description.trim()) {
      setFormData((prev) => ({
        ...prev,
        projects: [...prev.projects, { ...newProject, id: Date.now() }],
      }));
      setNewProject({ title: "", description: "" });
    }
  };

  const removeProject = (projectId) => {
    setFormData((prev) => ({
      ...prev,
      projects: prev.projects.filter((project) => project.id !== projectId),
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (editMode) {
      setPortfolios((prev) =>
        prev.map((p) =>
          p.id === currentPortfolio.id ? { ...p, ...formData } : p
        )
      );
      setEditMode(false);
      alert("Портфолио обновлено!");
    } else {
      const newPortfolio = {
        id: Date.now(),
        ...formData,
        createdAt: new Date().toISOString(),
      };
      setPortfolios((prev) => [...prev, newPortfolio]);
      alert("Портфолио успешно создано!");
    }

    setFormData({
      name: "",
      profession: "",
      about: "",
      email: "",
      phone: "",
      photo: "",
      skills: [],
      projects: [],
    });
    setActiveTab("list");
  };

  const viewPortfolio = (portfolio) => {
    setCurrentPortfolio(portfolio);
    setActiveTab("view");
  };

  const deletePortfolio = (portfolioId) => {
    if (confirm("Вы уверены, что хотите удалить это портфолио?")) {
      setPortfolios((prev) => prev.filter((p) => p.id !== portfolioId));
      if (currentPortfolio && currentPortfolio.id === portfolioId) {
        setCurrentPortfolio(null);
      }
    }
  };

  const editPortfolio = (portfolio) => {
    setFormData(portfolio);
    setEditMode(true);
    setCurrentPortfolio(portfolio);
    setActiveTab("create");
  };

  const exportPortfolios = () => {
    const data = JSON.stringify(portfolios, null, 2);
    setExportData(data);
    
    const blob = new Blob([data], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "portfolios.json";
    a.click();
    URL.revokeObjectURL(url);
  };

  const importPortfolios = () => {
    try {
      const parsedData = JSON.parse(importData);
      if (Array.isArray(parsedData)) {
        setPortfolios(parsedData);
        setImportData("");
        alert("Портфолио успешно импортированы!");
      } else {
        alert("Неверный формат данных");
      }
    } catch (error) {
      alert("Ошибка при импорте данных");
    }
  };

  const duplicatePortfolio = (portfolio) => {
    const duplicated = {
      ...portfolio,
      id: Date.now(),
      name: `${portfolio.name} (копия)`,
      createdAt: new Date().toISOString(),
    };
    setPortfolios((prev) => [...prev, duplicated]);
    alert("Портфолио дублировано!");
  };

  const filteredPortfolios = portfolios
    .filter(
      (p) =>
        p.name.toLowerCase().includes(search.toLowerCase()) ||
        p.profession.toLowerCase().includes(search.toLowerCase()) ||
        p.skills.some(skill => skill.toLowerCase().includes(search.toLowerCase()))
    )
    .sort((a, b) =>
      sortOrder === "desc"
        ? new Date(b.createdAt) - new Date(a.createdAt)
        : new Date(a.createdAt) - new Date(b.createdAt)
    );

  return (
    <div className={`app ${darkMode ? "dark" : "light"}`}>
      <header className="header">
        <div className="container">
          <nav className="nav">
            <div className="logo">
              <span className="logo-icon">🌐</span>
              PortfolioHub
            </div>
            <ul className="nav-links">
              <li className={activeTab === "home" ? "active" : ""}>
                <a href="#" onClick={() => setActiveTab("home")}>
                  Главная
                </a>
              </li>
              <li className={activeTab === "list" ? "active" : ""}>
                <a href="#" onClick={() => setActiveTab("list")}>
                  Все портфолио ({portfolios.length})
                </a>
              </li>
              <li className={activeTab === "create" ? "active" : ""}>
                <a href="#" onClick={() => { setActiveTab("create"); setEditMode(false); setFormData({
                  name: "", profession: "", about: "", email: "", phone: "", photo: "", skills: [], projects: []
                }); }}>
                  Создать
                </a>
              </li>
            </ul>
            <button 
              className="theme-toggle"
              onClick={() => setDarkMode(!darkMode)}
            >
              {darkMode ? "☀️" : "🌙"}
            </button>
          </nav>
        </div>
      </header>

      <div className="main-content container">
        {activeTab === "home" && (
          <div className="hero-section">
            <div className="hero-content">
              <h1>Создайте впечатляющее портфолио</h1>
              <p>Покажите свои навыки и проекты работодателям в профессиональном формате</p>
              <div className="hero-stats">
                <div className="stat">
                  <h3>{portfolios.length}</h3>
                  <p>Созданных портфолио</p>
                </div>
                <div className="stat">
                  <h3>{portfolios.reduce((acc, p) => acc + p.projects.length, 0)}</h3>
                  <p>Реализованных проектов</p>
                </div>
                <div className="stat">
                  <h3>{[...new Set(portfolios.flatMap(p => p.skills))].length}</h3>
                  <p>Уникальных навыков</p>
                </div>
              </div>
              <div className="hero-actions">
                <button 
                  className="btn btn-primary btn-large"
                  onClick={() => setActiveTab("create")}
                >
                  Создать портфолио
                </button>
                <button 
                  className="btn btn-outline btn-large"
                  onClick={() => setActiveTab("list")}
                >
                  Посмотреть примеры
                </button>
              </div>
            </div>
          </div>
        )}

        {activeTab === "list" && (
          <div className="list-section">
            <div className="list-header">
              <h2>Все портфолио</h2>
              <div className="list-controls">
                <div className="search-box">
                  <input
                    type="text"
                    placeholder="🔍 Поиск по имени, профессии или навыкам..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                  />
                </div>
                <select
                  value={sortOrder}
                  onChange={(e) => setSortOrder(e.target.value)}
                  className="sort-select"
                >
                  <option value="desc">Новые сверху</option>
                  <option value="asc">Старые сверху</option>
                  <option value="name">По имени (А-Я)</option>
                </select>
                <button 
                  className="btn btn-outline"
                  onClick={exportPortfolios}
                >
                  📤 Экспорт
                </button>
              </div>
            </div>

            <div className="import-section">
              <textarea
                placeholder="Вставьте JSON данные для импорта..."
                value={importData}
                onChange={(e) => setImportData(e.target.value)}
                rows={3}
              />
              <button 
                className="btn btn-secondary"
                onClick={importPortfolios}
              >
                📥 Импорт
              </button>
            </div>

            {filteredPortfolios.length === 0 ? (
              <div className="empty-state">
                <h3>Портфолио не найдены</h3>
                <p>Попробуйте изменить параметры поиска или создайте новое портфолио</p>
              </div>
            ) : (
              <div className="portfolio-grid">
                {filteredPortfolios.map((p) => (
                  <div key={p.id} className="portfolio-card">
                    <div className="card-header">
                      {p.photo && (
                        <img
                          src={p.photo}
                          alt="Фото"
                          className="portfolio-photo"
                        />
                      )}
                      <div className="portfolio-info">
                        <h3>{p.name}</h3>
                        <p className="profession">{p.profession}</p>
                        <span className="date">
                          {new Date(p.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                    
                    <p className="portfolio-about">{p.about.substring(0, 100)}...</p>
                    
                    <div className="skills-preview">
                      {p.skills.slice(0, 3).map((s, i) => (
                        <span key={i} className="skill-tag mini">
                          {s}
                        </span>
                      ))}
                      {p.skills.length > 3 && (
                        <span className="skill-tag more">+{p.skills.length - 3}</span>
                      )}
                    </div>

                    <div className="portfolio-actions">
                      <button
                        onClick={() => viewPortfolio(p)}
                        className="btn btn-primary"
                      >
                        👁️ Просмотр
                      </button>
                      <button
                        onClick={() => editPortfolio(p)}
                        className="btn btn-outline"
                      >
                        ✏️ Редактировать
                      </button>
                      <button
                        onClick={() => duplicatePortfolio(p)}
                        className="btn btn-outline"
                      >
                        📋 Копировать
                      </button>
                      <button
                        onClick={() => deletePortfolio(p.id)}
                        className="btn btn-danger"
                      >
                        🗑️
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === "view" && currentPortfolio && (
          <div className="view-section">
            <div className="portfolio-view">
              <div className="view-header">
                <button 
                  className="btn btn-outline back-btn"
                  onClick={() => setActiveTab("list")}
                >
                  ← Назад
                </button>
                <div className="header-actions">
                  <button
                    onClick={() => editPortfolio(currentPortfolio)}
                    className="btn btn-primary"
                  >
                    ✏️ Редактировать
                  </button>
                  <button
                    onClick={() => duplicatePortfolio(currentPortfolio)}
                    className="btn btn-outline"
                  >
                    📋 Копировать
                  </button>
                </div>
              </div>

              <div className="portfolio-hero">
                {currentPortfolio.photo && (
                  <img
                    src={currentPortfolio.photo}
                    alt="Фото"
                    className="hero-photo"
                  />
                )}
                <div className="hero-info">
                  <h1>{currentPortfolio.name}</h1>
                  <p className="hero-profession">{currentPortfolio.profession}</p>
                  <div className="contact-info">
                    <span>📧 {currentPortfolio.email}</span>
                    <span>📞 {currentPortfolio.phone}</span>
                  </div>
                </div>
              </div>

              <div className="section">
                <h3>Обо мне</h3>
                <p className="about-text">{currentPortfolio.about}</p>
              </div>

              <div className="section">
                <h3>Навыки</h3>
                <div className="skills-grid">
                  {currentPortfolio.skills.map((s, i) => (
                    <span key={i} className="skill-tag large">
                      {s}
                    </span>
                  ))}
                </div>
              </div>

              <div className="section">
                <h3>Проекты ({currentPortfolio.projects.length})</h3>
                {currentPortfolio.projects.length > 0 ? (
                  <div className="projects-grid">
                    {currentPortfolio.projects.map((proj) => (
                      <div key={proj.id} className="project-card">
                        <h4>{proj.title}</h4>
                        <p>{proj.description}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="no-projects">Проекты не добавлены</p>
                )}
              </div>
            </div>
          </div>
        )}

        {activeTab === "create" && (
          <div className="create-section">
            <form onSubmit={handleSubmit} className="portfolio-form">
              <h2>{editMode ? "Редактировать портфолио" : "Создать новое портфолио"}</h2>
              
              <div className="form-grid">
                <div className="form-group">
                  <label>Имя и фамилия *</label>
                  <input
                    type="text"
                    name="name"
                    placeholder="Нурали Алымбеков"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Профессия *</label>
                  <input
                    type="text"
                    name="profession"
                    placeholder="CyberSecurity Specialist"
                    value={formData.profession}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div className="form-group full-width">
                  <label>Обо мне *</label>
                  <textarea
                    name="about"
                    placeholder="Расскажите о себе, своем опыте и целях..."
                    value={formData.about}
                    onChange={handleInputChange}
                    required
                    rows={4}
                  />
                </div>

                <div className="form-group">
                  <label>Email *</label>
                  <input
                    type="email"
                    name="email"
                    placeholder="alymbekov@example.com"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Телефон</label>
                  <input
                    type="tel"
                    name="phone"
                    placeholder="+996 (999) 79-77-75"
                    value={formData.phone}
                    onChange={handleInputChange}
                  />
                </div>

                <div className="form-group full-width">
                  <label>Ссылка на фото</label>
                  <input
                    type="url"
                    name="photo"
                    placeholder="https://example.com/photo.jpg"
                    value={formData.photo}
                    onChange={handleInputChange}
                  />
                </div>
              </div>

              <div className="form-section">
                <h4>Навыки</h4>
                <div className="skill-input">
                  <input
                    type="text"
                    value={newSkill}
                    onChange={(e) => setNewSkill(e.target.value)}
                    placeholder="Введите навык"
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addSkill())}
                  />
                  <button type="button" onClick={addSkill} className="btn btn-primary">
                    Добавить
                  </button>
                </div>
                <div className="skills-list">
                  {formData.skills.map((s, i) => (
                    <span key={i} className="skill-tag">
                      {s}
                      <button
                        type="button"
                        onClick={() => removeSkill(s)}
                        className="remove-skill"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
              </div>

              <div className="form-section">
                <h4>Проекты</h4>
                <div className="project-input">
                  <input
                    type="text"
                    placeholder="Название проекта"
                    value={newProject.title}
                    onChange={(e) =>
                      setNewProject((prev) => ({ ...prev, title: e.target.value }))
                    }
                  />
                  <textarea
                    placeholder="Описание проекта"
                    value={newProject.description}
                    onChange={(e) =>
                      setNewProject((prev) => ({
                        ...prev,
                        description: e.target.value,
                      }))
                    }
                    rows={3}
                  />
                  <button type="button" onClick={addProject} className="btn btn-primary">
                    Добавить проект
                  </button>
                </div>

                <div className="projects-list">
                  {formData.projects.map((proj) => (
                    <div key={proj.id} className="project-item">
                      <div className="project-content">
                        <h5>{proj.title}</h5>
                        <p>{proj.description}</p>
                      </div>
                      <button
                        type="button"
                        onClick={() => removeProject(proj.id)}
                        className="btn btn-danger"
                      >
                        Удалить
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              <div className="form-actions">
                <button type="submit" className="btn btn-primary btn-large">
                  {editMode ? "💾 Сохранить изменения" : "🚀 Создать портфолио"}
                </button>
                <button 
                  type="button" 
                  className="btn btn-outline"
                  onClick={() => setActiveTab("list")}
                >
                  Отмена
                </button>
              </div>
            </form>
          </div>
        )}
      </div>

      <footer className="footer">
        <div className="container">
          <p>© 2024 PortfolioHub. Все права защищены.</p>
        </div>
      </footer>
    </div>
  );
}

export default App;
