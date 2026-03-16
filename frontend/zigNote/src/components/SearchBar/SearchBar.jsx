import React from 'react';
import { FaMagnifyingGlass } from "react-icons/fa6";
import { IoMdClose } from "react-icons/io";

const SearchBar = ({ value, onChange, handleSearch, onClearSearch }) => {
  return (
    <div className="w-80 flex items-center px-4 bg-white border border-slate-300 rounded-xl shadow-sm">
        <input
            type = "text"
            placeholder = "Search Notes"
            className="w-full text-xs bg-transparent py-[11px] outline-none text-slate-900 placeholder:text-slate-400"
            value = {value}
            onChange = {onChange}
        />

        {value && (
            <IoMdClose 
              className="text-xl text-slate-500 cursor-pointer hover:text-slate-900 mr-3" 
              onClick={onClearSearch} 
            />
        )}

        <FaMagnifyingGlass className="text-slate-400 cursor-pointer hover:text-slate-900" onClick={handleSearch} />
    </div>
  );
};

export default SearchBar;