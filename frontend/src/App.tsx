import { useState, useEffect } from "react";
import "./App.css";

interface Article {
  id: number;
  title: string;
  content: string;
}

function App() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [searchKeyword, setSearchKeyword] = useState("");
  const [searchResults, setSearchResults] = useState<Article[]>([]);

  const fetchArticles = async () => {
    try {
      const response = await fetch("http://localhost:3000");
      const data = await response.json();
      setArticles(data);
    } catch (error) {
      console.error("Error fetching articles:", error);
    }
  };

  useEffect(() => {
    fetchArticles();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const newArticle = {
      id: articles.length > 0 ? Math.max(...articles.map((a) => a.id)) + 1 : 1,
      title,
      content,
    };
    try {
      await fetch("http://localhost:3000", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newArticle),
      });
      setTitle("");
      setContent("");
      fetchArticles(); // Refresh the list after adding an article
    } catch (error) {
      console.error("Error creating article:", error);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await fetch(`http://localhost:3000/${id}`, {
        method: "DELETE",
      });
      fetchArticles(); // Refresh the list after deleting an article
    } catch (error) {
      console.error("Error deleting article:", error);
    }
  };

  const handleSearch = async () => {
    try {
      const response = await fetch(
        `http://localhost:3000/search/${searchKeyword}`
      );
      const data = await response.json();
      setSearchResults(data);
    } catch (error) {
      console.error("Error searching articles:", error);
    }
  };

  return (
    <div className="App">
      <div>
        {/* Article Form and List Section */}
        <h2>Articles</h2>
        <form onSubmit={handleSubmit}>
          <div>
            <label htmlFor="title">Title</label>
            <input
              type="text"
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>
          <div>
            <label htmlFor="content">Content</label>
            <textarea
              id="content"
              rows={4}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              required
            ></textarea>
          </div>
          <button type="submit">Add Article</button>
        </form>
        <div>
          {articles.map((article) => (
            <div key={article.id}>
              <h3>ID: {article.id}</h3>
              <h3>Title: {article.title}</h3>
              <p>Content: {article.content}</p>
              <button onClick={() => handleDelete(article.id)}>Delete</button>
            </div>
          ))}
        </div>
      </div>
      <div>
        {/* Search Section */}
        <h2>Search Articles</h2>
        <div>
          <div>
            <label htmlFor="search">Search Keyword</label>
            <input
              type="text"
              id="search"
              value={searchKeyword}
              onChange={(e) => setSearchKeyword(e.target.value)}
            />
          </div>
          <button onClick={handleSearch}>Search</button>
        </div>
        <div>
          <h3>Search Results</h3>
          {searchResults.length === 0 && <p>No search results found.</p>}
          <div>
            {searchResults.map((article) => (
              <div key={article.id}>
                <h3>ID: {article.id}</h3>
                <h3>Title: {article.title}</h3>
                <p>Content: {article.content}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
