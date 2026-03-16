import React, { useState } from 'react'
import { MdAdd, MdClose } from 'react-icons/md';

const TagInput = ({ tags, setTags }) => {

    const [inputValue, setInputValue] = useState("");

    const handleInputChange = (e) => {
        setInputValue(e.target.value);
    };

    const addNewTag = () => {
        if (inputValue.trim() !== "") {
            setTags([...tags, inputValue.trim()]);
            setInputValue("");
        }
    };

    const handleKeyDown = (e) => {
        if (e.key === "Enter") {
        e.preventDefault();
            addNewTag();
        }
    };

    const handleRemoveTag = (tagToRemove) => {
        setTags(tags.filter((tag) => tag !== tagToRemove));
    };

  return (
    <div>
        {tags?.length > 0 && (
            <div className="flex items-center gap-2 flex-wrap mt-2">
              {tags.map((tag, index) => (
                <span key={index} className="flex items-center gap-2 text-sm text-slate-800 bg-slate-50 px-3 py-1 rounded-full border border-slate-200 shadow-sm">
                    # {tag}
                    <button 
                      onClick={() => {
                        handleRemoveTag(tag);
                      }}
                    >
                        <MdClose />
                    </button>
                </span>
              ))}
           </div>
       )}

        <div className='flex items-center gap-4 mt-3'>
            <input
              type="text" 
              value={inputValue}
              className="text-sm bg-white border border-slate-300 text-slate-900 px-3 py-2 rounded-xl outline-none placeholder:text-slate-400 focus:border-primary focus:ring-2 focus:ring-primary/20 shadow-sm" 
              placeholder="Add tags"
              onChange={handleInputChange} 
              onKeyDown={handleKeyDown}
            />

            <button 
              className="w-9 h-9 flex items-center justify-center rounded-xl bg-primary text-white shadow-sm hover:shadow-md hover:bg-blue-700 transition-all"
              onClick={() => {
                addNewTag();
              }}
            >
                <MdAdd className="text-2xl text-white" />
            </button>

        </div>
    </div>
  );
};

export default TagInput;