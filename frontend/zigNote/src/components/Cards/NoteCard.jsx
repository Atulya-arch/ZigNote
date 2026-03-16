import React from 'react';
import moment from 'moment';
import { MdOutlinePushPin } from 'react-icons/md';
import { MdCreate, MdDelete } from 'react-icons/md';

const NoteCard = ({
  title, 
  date, 
  content, 
  tags, 
  isPinned, 
  onOpen,
  onEdit, 
  onDelete, 
  onPinNote
}) => {
  return (
    <div
      role="button"
      tabIndex={0}
      onClick={onOpen}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") onOpen?.();
      }}
      className="border border-slate-200 rounded-2xl p-4 bg-white hover:border-slate-300 hover:-translate-y-0.5 transition-all ease-in-out cursor-pointer shadow-sm hover:shadow-md"
    >
      <div className="flex items-center justify-between">
        <div className="flex-1 min-w-0">
          <h6 className="text-sm font-medium text-slate-900 truncate">{title}</h6>
          <span className="text-xs text-slate-500">{moment(date).format("Do MMM YYYY")}</span>
        </div>

        <MdOutlinePushPin
          className={`icon-btn ${isPinned ? "text-primary" : "text-slate-300"}`}
          onClick={(e) => {
            e.stopPropagation();
            onPinNote?.();
          }}
        />
      </div>

      <p className="text-xs text-slate-600 mt-2">{content?.slice(0, 60)}</p>

      <div className="flex items-center justify-between mt-2">
        <div className="text-xs text-slate-500">{tags.map((item)=> `#${item} `)}</div>

        <div className="flex items-center gap-2">
          <MdCreate
            className="icon-btn hover:text-emerald-400"
            onClick={(e) => {
              e.stopPropagation();
              onEdit?.();
            }}
          />
          <MdDelete
            className="icon-btn hover:text-red-400"
            onClick={(e) => {
              e.stopPropagation();
              onDelete?.();
            }}
          />
        </div>

        </div>
    </div>
  );
};

export default NoteCard;