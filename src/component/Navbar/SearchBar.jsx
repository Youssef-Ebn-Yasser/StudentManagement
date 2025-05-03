import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function SearchBar({ onSearch }) {
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    if (onSearch) {
      onSearch(searchQuery);
    }
    // If we're not on the courses page, navigate to it
    if (!window.location.pathname.includes('/courses')) {
      navigate('/courses');
    }
  };

  return (
    <div className="relative">
      <form onSubmit={handleSearch}>
        <input
          type="text"
          placeholder="Search..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-[260px] h-[36px] pl-[34px] pr-[12px] text-sm font-normal bg-neutral-200 rounded-md border-0 outline-none hover:bg-white hover:text-black focus:bg-white focus:text-black transition-all duration-300 ease-in-out"
        />
        <span>
          <i className="fa-solid fa-magnifying-glass absolute top-[10px] left-[12px] text-neutral-900"></i>
        </span>
      </form>
    </div>
  );
}

export default SearchBar; 