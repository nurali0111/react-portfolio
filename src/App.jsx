import { useState, useEffect } from "react";

function App() {
  const [activeTab, setActiveTab] = useState("view");
  const [portfolios, setPortfolios] = useState([]);
  const [currentPortfolio, setCurrentPortfolio] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [search, setSearch] = useState("");
  const [sortOrder, setSortOrder] = useState("desc");

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
    if (savedPortfolios) {
      setPortfolios(JSON.parse(savedPortfolios));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("portfolios", JSON.stringify(portfolios));
  }, [portfolios]);

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

  const filteredPortfolios = portfolios
    .filter(
      (p) =>
        p.name.toLowerCase().includes(search.toLowerCase()) ||
        p.profession.toLowerCase().includes(search.toLowerCase())
    )
    .sort((a, b) =>
      sortOrder === "desc"
        ? new Date(b.createdAt) - new Date(a.createdAt)
        : new Date(a.createdAt) - new Date(b.createdAt)
    );

  return (
    <div>
      <header>
        <div className="container">
          <nav>
            <div className="logo">🌐 Портфолио для работадателей</div>
            <ul className="nav-links">
              <li>
                <a href="#" onClick={() => setActiveTab("list")}>
                  Все портфолио
                </a>
              </li>
              <li>
                <a href="#" onClick={() => setActiveTab("view")}>
                  Просмотр
                </a>
              </li>
              <li>
                <a href="#" onClick={() => setActiveTab("create")}>
                  {editMode ? "Редактировать" : "Создать"}
                </a>
              </li>
            </ul>
          </nav>
        </div>
      </header>

      <div className="main-content container">
        {activeTab === "list" && (
          <div style={{ marginBottom: "1rem" }}>
            <input
              type="text"
              placeholder="Поиск по имени или профессии..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{
                padding: "0.5rem",
                width: "60%",
                marginRight: "1rem",
                borderRadius: "6px",
              }}
            />
            <select
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value)}
              style={{ padding: "0.5rem", borderRadius: "6px" }}
            >
              <option value="desc">Новые сверху</option>
              <option value="asc">Старые сверху</option>
            </select>
          </div>
        )}

        {activeTab === "list" && (
          <div>
            <h2>Все портфолио ({filteredPortfolios.length})</h2>
            {filteredPortfolios.length === 0 ? (
              <p>Портфолио не найдено.</p>
            ) : (
              <div className="portfolio-list">
                {filteredPortfolios.map((p) => (
                  <div key={p.id} className="portfolio-card">
                    <div style={{ display: "flex", alignItems: "center" }}>
                      {p.photo && (
                        <img
                          src={p.photo}
                          alt="Фото"
                          style={{
                            width: "60px",
                            height: "60px",
                            borderRadius: "50%",
                            marginRight: "10px",
                            objectFit: "cover",
                          }}
                        />
                      )}
                      <div>
                        <h3>{p.name}</h3>
                        <p>{p.profession}</p>
                      </div>
                    </div>

                    <p>{p.about.substring(0, 80)}...</p>
                    <div className="portfolio-actions">
                      <button
                        onClick={() => viewPortfolio(p)}
                        className="btn btn-primary"
                      >
                        Просмотр
                      </button>
                      <button
                        onClick={() => editPortfolio(p)}
                        className="btn btn-outline"
                      >
                        ✏ Редактировать
                      </button>
                      <button
                        onClick={() => deletePortfolio(p.id)}
                        className="btn btn-outline"
                      >
                        🗑 Удалить
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === "view" && currentPortfolio && (
          <div>
            <div className="portfolio-view">
              <div style={{ display: "flex", alignItems: "center", gap: "1rem", marginBottom: "1rem" }}>
                {currentPortfolio.photo && (
                  <img
                    src={currentPortfolio.photo}
                    alt="Фото"
                    style={{
                      width: "100px",
                      height: "100px",
                      borderRadius: "50%",
                      objectFit: "cover",
                    }}
                  />
                )}
                <div>
                  <h1>{currentPortfolio.name}</h1>
                  <p style={{ fontSize: "1.2rem", fontWeight: "bold", color: "#555" }}>
                    {currentPortfolio.profession}
                  </p>
                </div>
              </div>

              <div style={{ marginBottom: "1.5rem" }}>
                <h3>Обо мне:</h3>
                <p>{currentPortfolio.about}</p>
              </div>

              <div style={{ marginBottom: "1.5rem" }}>
                <h3>Контактная информация:</h3>
                <p><strong>Email:</strong> {currentPortfolio.email}</p>
                <p><strong>Телефон:</strong> {currentPortfolio.phone}</p>
              </div>

              <div style={{ marginBottom: "1.5rem" }}>
                <h3>Навыки:</h3>
                <div>
                  {currentPortfolio.skills.map((s, i) => (
                    <span key={i} className="skill-tag">
                      {s}
                    </span>
                  ))}
                </div>
              </div>

              <div style={{ marginBottom: "1.5rem" }}>
                <h3>Проекты:</h3>
                {currentPortfolio.projects.length > 0 ? (
                  currentPortfolio.projects.map((proj) => (
                    <div key={proj.id} className="project-card">
                      <h4>{proj.title}</h4>
                      <p>{proj.description}</p>
                    </div>
                  ))
                ) : (
                  <p>Проекты не добавлены</p>
                )}
              </div>
            </div>
          </div>
        )}

        {activeTab === "create" && (
          <form onSubmit={handleSubmit}>
            <h2>{editMode ? "Редактировать портфолио" : "Создать портфолио"}</h2>

            <input
              type="text"
              name="name"
              placeholder="Имя и фамилия"
              value={formData.name}
              onChange={handleInputChange}
              required
            />
            <input
              type="text"
              name="profession"
              placeholder="Профессия"
              value={formData.profession}
              onChange={handleInputChange}
              required
            />
            <textarea
              name="about"
              placeholder="Обо мне"
              value={formData.about}
              onChange={handleInputChange}
              required
            />
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleInputChange}
              required
            />
            <input
              type="tel"
              name="phone"
              placeholder="Телефон"
              value={formData.phone}
              onChange={handleInputChange}
            />
            <input
              type="url"
              name="photo"
              placeholder="Ссылка на фото (опционально)"
              value={formData.photo}
              onChange={handleInputChange}
            />

            <h4>Навыки:</h4>
            <div>
              <input
                type="text"
                value={newSkill}
                onChange={(e) => setNewSkill(e.target.value)}
                placeholder="Добавить навык"
              />
              <button type="button" onClick={addSkill}>
                Добавить
              </button>
            </div>
            <div>
              {formData.skills.map((s, i) => (
                <span key={i} className="skill-tag">
                  {s}{" "}
                  <button
                    type="button"
                    onClick={() => removeSkill(s)}
                    style={{ background: "none", border: "none", color: "red" }}
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>

            <h4>Проекты:</h4>
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
            />
            <button type="button" onClick={addProject}>
              Добавить проект
            </button>

            <div>
              {formData.projects.map((proj) => (
                <div key={proj.id}>
                  <h4>{proj.title}</h4>
                  <p>{proj.description}</p>
                  <button
                    type="button"
                    onClick={() => removeProject(proj.id)}
                    style={{ color: "red" }}
                  >
                    Удалить
                  </button>
                </div>
              ))}
            </div>

            <button type="submit" className="btn btn-primary">
              {editMode ? "Сохранить изменения" : "Создать"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}

export default App;
