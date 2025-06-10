import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';
import { API_BASE_URL } from './api';

const OMDB_API_KEY = '86a7816a';

function App() {
  const [addedMessage, setAddedMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [movies, setMovies] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [activeTab, setActiveTab] = useState('search');
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    const savedTab = localStorage.getItem('activeTab');
    if (savedTab) setActiveTab(savedTab);
  }, []);

  useEffect(() => {
    localStorage.setItem('activeTab', activeTab);
  }, [activeTab]);

  useEffect(() => {
    fetchMovies();
  }, []);

  const fetchMovies = async () => {
    setLoading(true);
    const res = await axios.get(`${API_BASE_URL}/movies`);
    setMovies(res.data);
    setLoading(false);
  };

  const toggleWatched = async (id) => {
    setLoading(true);
    await axios.put(`${API_BASE_URL}/movies/${id}`);
    fetchMovies();
  };

  const deleteMovie = async (id) => {
    setLoading(true);
    await axios.delete(`${API_BASE_URL}/movies/${id}`);
    fetchMovies();
  };

  const searchMovies = async () => {
    if (!searchQuery) return;
    setLoading(true);
    try {
      const res = await axios.get(`https://www.omdbapi.com/?s=${searchQuery}&apikey=${OMDB_API_KEY}`);
      setSearchResults(res.data.Search || []);
    } catch (error) {
      console.error('Error searching movies:', error);
    }
    setLoading(false);
  };

  const clearSearch = () => {
    setSearchQuery('');
    setSearchResults([]);
  };

  const addMovieFromSearch = async (movie) => {
    const alreadyExists = movies.some(m => m.title === movie.Title);
    if (alreadyExists) {
      setAddedMessage(`⚠️ "${movie.Title}" is already in your watchlist`);
      setTimeout(() => setAddedMessage(''), 3000);
      return;
    }

    try {
      await axios.post(`${API_BASE_URL}/movies`, {
        title: movie.Title,
        poster_url: movie.Poster
      });
      fetchMovies();
      setAddedMessage(`✅ "${movie.Title}" added to watchlist`);
      setTimeout(() => setAddedMessage(''), 3000);
    } catch (error) {
      console.error('❌ Failed to add movie:', error);
    }
  };

  const sortedMovies = [...movies].sort((a, b) => a.title.localeCompare(b.title));
  const filteredMovies = sortedMovies.filter(movie => {
    if (filter === 'watched') return movie.watched;
    if (filter === 'not-watched') return !movie.watched;
    return true;
  });

  return (
    <div className="App">
      <div className="stars"></div>
      <div className="shooting-star"></div>
      <div className="shooting-star"></div>
      <div className="shooting-star"></div>
      {addedMessage && <div className="toast-notification">{addedMessage}</div>}

      <header className="app-header">
        <div className="header-content">
        <div className="app-header-left">
          <span className="logo">🍿</span>
          <div className="title-wrapper">
            <h1 className="site-title">Movie Watchlist</h1>
            <p className="site-subtitle">by Rob Burns</p>
          </div>
        </div>
        <div className="nav-tabs">
          {activeTab !== 'search' && (
            <button onClick={() => setActiveTab('search')}>Search Movies</button>
          )}
          {activeTab !== 'watchlist' && (
            <button onClick={() => setActiveTab('watchlist')}>My Watchlist</button>
          )}
        </div>
        </div>
      </header>



      {activeTab === 'search' && (
        <>
          <h2 className="section-title">🔍 Search Movies</h2>
          <div className="search-bar">
            <input
              type="text"
              placeholder="Search title..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
            />
            <button onClick={searchMovies}>Search</button>
            <button className="clear-btn" onClick={clearSearch}>Clear</button>
          </div>

          <div className={`movie-grid ${searchResults.length ? 'fade-in' : ''}`}>
            {searchResults.map(movie => (
              <div key={movie.imdbID} className="movie-card">
                <div className="movie-image-wrapper">
                  <img src={movie.Poster} alt={movie.Title} />
                  <div className="overlay">
                    <p className="overlay-title">{movie.Title}</p>
                    <button onClick={() => addMovieFromSearch(movie)}>Add Movie</button>
                  </div>
                </div>
                <div className="movie-info">
                  <strong>{movie.Title}</strong>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {activeTab === 'watchlist' && (
        <>
          <h2 className="section-title">✅ My Watchlist</h2>
          <div className="centered-summary">
            <p><strong>🎞️ Total:</strong> {movies.length}</p>
            <p><strong>✅ Watched:</strong> {movies.filter(m => m.watched).length}</p>
            <p><strong>❌ Not Watched:</strong> {movies.filter(m => !m.watched).length}</p>
          </div>
          <div className="filter-buttons">
            <button className={filter === 'all' ? 'active' : ''} onClick={() => setFilter('all')}>All</button>
            <button className={filter === 'watched' ? 'active' : ''} onClick={() => setFilter('watched')}>Watched</button>
            <button className={filter === 'not-watched' ? 'active' : ''} onClick={() => setFilter('not-watched')}>Not Watched</button>
          </div>
          {movies.length === 0 ? (
            <p className="empty-message">🎉 Your watchlist is empty — you're all caught up!</p>
          ) : (
            <div className={`movie-grid ${filteredMovies.length ? 'fade-in' : ''}`}>
              {filteredMovies.map(movie => (
                <div key={movie.id} className="movie-card">
                  <div className="movie-image-wrapper">
                    <img src={movie.poster_url} alt={movie.title} />
                    <div className="overlay">
                      <p className="overlay-title">{movie.title}</p>
                      <button onClick={() => toggleWatched(movie.id)}>
                        {movie.watched ? 'Not Watched' : 'Watch'}
                      </button>
                      <button onClick={() => deleteMovie(movie.id)}>Remove</button>
                    </div>
                  </div>
                  <div className="movie-info">
                    <strong>{movie.title}</strong>
                    <span className={`status-badge ${movie.watched ? 'watched' : 'not-watched'}`}>{movie.watched ? '✅ Watched' : '❌ Not Watched'}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default App;
