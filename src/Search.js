import React from 'react';

const Search = ({ onSearch, backgroundColor }) => {
  const [query, setQuery] = React.useState('');

  const handleChange = (e) => {
    setQuery(e.target.value);
    onSearch(e.target.value);
  };
  const gradientBackground = `linear-gradient(135deg, ${backgroundColor} 0%, rgba(0, 0, 0, 0.5) 100%)`;
  return (
    <div className="search-container">
      <img
        src="https://cdn-icons-png.flaticon.com/512/622/622669.png"
        alt="Search Icon"
        className="search-icon"
      />
      <input
        type="text"
        placeholder="Search Song, Artist"
        value={query}
        onChange={handleChange}
        className="search-input"
      />
    </div>
  );
};
export default Search;
