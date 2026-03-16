import React, { useState } from 'react';
import ProfileInfo from '../Cards/ProfileInfo';
import { useNavigate } from 'react-router-dom';
import SearchBar from '../SearchBar/SearchBar';
import { HiOutlineBars3 } from "react-icons/hi2";

const NavBar = ({ userInfo, onSearchNote, handleClearSearch, onToggleSideBar }) => {
  const [searchQuery, setSearchQuery] = useState("");

  const navigate = useNavigate();

  const onLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  const handleSearch = () => {
    if(onSearchNote) {
      onSearchNote(searchQuery);
    }
  };

  const onClearSearch = () => {
    setSearchQuery("");
    handleClearSearch();
  };

  return (
    <div className="bg-white/85 backdrop-blur border-b border-slate-200 shadow-sm flex items-center justify-between px-6 h-14 sticky top-0 z-50">
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onToggleSideBar}
          className="p-2 -ml-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors"
          aria-label="Toggle sidebar"
        >
          <HiOutlineBars3 className="text-xl" />
        </button>

        <h2 className="text-xl font-semibold text-slate-900 tracking-tight">
          <span className="text-primary">Zig</span>Note
        </h2>
      </div>

      <SearchBar 
        value={searchQuery}
        onChange={({ target }) => {
          setSearchQuery(target.value);
        }} 
        handleSearch={handleSearch}
        onClearSearch={onClearSearch}
      />

      <ProfileInfo userInfo = {userInfo} onLogout={onLogout} />
    </div>
  );
};

export default NavBar;