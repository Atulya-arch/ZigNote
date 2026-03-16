import React from "react";
import { MdOutlineNotes, MdOutlinePushPin } from "react-icons/md";
import { HiOutlineTag } from "react-icons/hi2";

const SideBar = ({
  isOpen,
  onClose,
  activeView,
  selectedTag,
  tags,
  onSelectView,
  onSelectTag,
}) => {
  return (
    <>
      <div
        className={`fixed inset-0 bg-black/25 z-30 transition-opacity md:hidden ${
          isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        onClick={onClose}
      />

      <aside
        className={`fixed left-0 top-14 h-[calc(100vh-3.5rem)] w-72 bg-[#FFFCF7] border-r border-slate-200 z-40 transform transition-transform duration-300 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="h-full p-3">
          <div className="mb-3 px-3 py-3 rounded-xl border border-slate-200 bg-white shadow-sm">
            <p className="text-sm font-semibold text-slate-900">Browse</p>
            <p className="text-xs text-slate-500 mt-0.5">Filter your notes quickly</p>
          </div>

          <div className="space-y-1">
            <button
              type="button"
              onClick={() => onSelectView("all")}
              className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors ${
                activeView === "all"
                  ? "bg-primary/10 text-slate-900 border border-primary/20 shadow-sm"
                  : "text-slate-700 hover:bg-slate-100 hover:text-slate-900"
              }`}
            >
              <MdOutlineNotes className="text-lg" />
              <span>All Notes</span>
            </button>

            <button
              type="button"
              onClick={() => onSelectView("pinned")}
              className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors ${
                activeView === "pinned"
                  ? "bg-amber-100/70 text-slate-900 border border-amber-200 shadow-sm"
                  : "text-slate-700 hover:bg-slate-100 hover:text-slate-900"
              }`}
            >
              <MdOutlinePushPin className="text-lg" />
              <span>Pinned Notes</span>
            </button>
          </div>

          <div className="mt-4 pt-4 border-t border-slate-200">
            <div className="flex items-center gap-2 px-3 text-xs uppercase tracking-wider text-slate-500">
              <HiOutlineTag className="text-base" />
              <span>Tags</span>
            </div>

            <div className="mt-2 space-y-1 max-h-[calc(100vh-14rem)] overflow-auto pr-1">
              {tags.length === 0 ? (
                <p className="px-3 py-2 text-sm text-slate-500">No tags yet</p>
              ) : (
                tags.map((tag) => {
                  const isActive = activeView === "tag" && selectedTag === tag;
                  return (
                    <button
                      key={tag}
                      type="button"
                      onClick={() => onSelectTag(tag)}
                      className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                        isActive
                          ? "bg-primary/10 text-slate-900 border border-primary/20"
                          : "text-slate-700 hover:bg-slate-100 hover:text-slate-900"
                      }`}
                      title={`Filter by #${tag}`}
                    >
                      <span className="text-slate-400">#</span>
                      <span className="ml-1">{tag}</span>
                    </button>
                  );
                })
              )}
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};

export default SideBar;

