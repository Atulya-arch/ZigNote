import React, { useEffect, useState } from 'react'
import NavBar from '../../components/NavBar/NavBar';
import NoteCard from '../../components/Cards/NoteCard';
import axiosInstance from '../../utils/axiosInstance';
import { MdAdd } from 'react-icons/md';
import AddEditNotes from './AddEditNotes';
import { useNavigate } from 'react-router-dom';
import Modal from 'react-modal';
import Toast from '../../components/ToastMessage/Toast';
import EmptyCard from '../../components/EmptyCard/EmptyCard';
import AddNotesImg from "../../assets/images/add-note1.svg";
import noDataImg from "../../assets/images/no-data1.svg";
import SideBar from "../../components/SideBar/SideBar";
import moment from "moment";
import { MdClose } from "react-icons/md";
const Home = () => {
  const [openAddEditModal, setOpenAddEditModal] = useState({
    isShown: false,
    type: "add",
    data: null,
  });

  const [showToastMsg, setShowToastMsg] = useState({
    isShown: false,
    message: "",
    type: "add",
  });

  const [allNotes, setAllNotes] = useState([]);
  const [userInfo, setUserInfo] = useState(null);

  const [isSearch, setIsSearch] = useState(false);
  const [activeView, setActiveView] = useState("all"); // all | pinned | tag
  const [selectedTag, setSelectedTag] = useState(null);
  const [isSideBarOpen, setIsSideBarOpen] = useState(true);
  const [openViewModal, setOpenViewModal] = useState({
    isShown: false,
    data: null,
  });

  const navigate = useNavigate();

  const handleEdit = (noteDetails) => {
    setOpenAddEditModal({
      isShown: true,
      type: "edit",
      data: noteDetails,
    });
  };

  const handleOpenNote = (noteDetails) => {
    setOpenViewModal({
      isShown: true,
      data: noteDetails,
    });
  };

  const showToastMessage = (message, type) => {
    setShowToastMsg({
      isShown: true,
      message,
      type,
    });
  };

  const handleCloseToast = () => {
    setShowToastMsg({
      isShown: false,
      message: "",
    });
  };

  // Get User Info
  const getUserInfo = async () => {
    try {
      const response = await axiosInstance.get("/get-user");
      if (response.data && response.data.user) {
        setUserInfo(response.data.user);
      }
    } catch (error) {
      if (error.response?.status === 401) {
        localStorage.clear();
        navigate("/login");
      }
    }
  };

  // Get All notes
  const getAllNotes = async () => {
    try {
      const response = await axiosInstance.get("/get-all-notes");

      if (response.data && response.data.notes) {
        setAllNotes(response.data.notes);
      }
    } catch (error) {
      console.error("An unexpected error occured. Please try again");
    }
  };

  // Delete Note
  const deleteNote = async (data) => {
    const noteId = data._id;

    try {
      const response = await axiosInstance.delete("/delete-note/" + noteId);

      if (response.data && !response.data.error) {
        showToastMessage("Note Deleted Successfully", "delete");
        getAllNotes();
      }
    } catch (error) {
      if (error.response && error.response.data && error.response.data.message) {
        console.log("An unexpected error occured. Please try again");
      }
    }
  };

  // Search for a Note
  const onSearchNote = async (query) => {
    try {
      const response = await axiosInstance.get("/search-notes", {
        params: { query },
      });

      if (response.data && response.data.notes) {
        setIsSearch(true);
        setActiveView("all");
        setSelectedTag(null);
        setAllNotes(response.data.notes);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const updateIsPinned = async (noteData) => {
    const noteId = noteData._id;

    try {
      const response = await axiosInstance.put("/update-note-pinned/" + noteId, {
        isPinned: !noteData.isPinned,
      });

      if (response.data && response.data.note) {
        showToastMessage("Note pinned Successfully");
        getAllNotes();
      }

    } catch (error) {
      console.log(error);
    }
  };

  const handleClearSearch = async () => {
    setIsSearch(false);
    setActiveView("all");
    setSelectedTag(null);
    getAllNotes();
  };

  const availableTags = Array.from(
    new Set(
      (allNotes || [])
        .flatMap((n) => n?.tags || [])
        .map((t) => String(t).trim())
        .filter(Boolean)
    )
  ).sort((a, b) => a.localeCompare(b));

  const filteredNotes =
    activeView === "pinned"
      ? allNotes.filter((n) => n?.isPinned)
      : activeView === "tag" && selectedTag
        ? allNotes.filter((n) => (n?.tags || []).includes(selectedTag))
        : allNotes;

  const handleSelectView = (view) => {
    setActiveView(view);
    if (view !== "tag") setSelectedTag(null);
  };

  const handleSelectTag = (tag) => {
    setActiveView("tag");
    setSelectedTag(tag);
  };

  useEffect(() => {
    getAllNotes();
    getUserInfo();
    return () => { };
  }, []);

  return (
    <>
      <NavBar
        userInfo={userInfo}
        onSearchNote={onSearchNote}
        handleClearSearch={handleClearSearch}
        onToggleSideBar={() => setIsSideBarOpen((v) => !v)}
      />

      <SideBar
        isOpen={isSideBarOpen}
        onClose={() => setIsSideBarOpen(false)}
        activeView={activeView}
        selectedTag={selectedTag}
        tags={availableTags}
        onSelectView={handleSelectView}
        onSelectTag={handleSelectTag}
      />

      <div
        className={`max-w-6xl mx-auto px-4 mt-6 transition-[padding] duration-300 ${isSideBarOpen ? "md:pl-72" : "md:pl-4"
          }`}
      >
        <main className="flex-1">
          {filteredNotes.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredNotes.map((item) => (
                <NoteCard
                  key={item._id}
                  title={item.title}
                  date={item.createdOn}
                  content={item.content}
                  tags={item.tags}
                  isPinned={item.isPinned}
                  onOpen={() => handleOpenNote(item)}
                  onEdit={() => handleEdit(item)}
                  onDelete={() => { deleteNote(item) }}
                  onPinNote={() => { updateIsPinned(item) }}
                />
              ))}
            </div>
          ) : (
            <EmptyCard
              imgSrc={isSearch ? noDataImg : AddNotesImg}
              message={isSearch
                ? `No notes found matching your search.`
                : `Start creating your first note! Click the 'Add' button to jot down your thoughts, ideas, and reminders. Let's get started!`}
            />
          )}
        </main>
      </div>

      <button
        className="w-14 h-14 flex items-center justify-center rounded-2xl bg-primary hover:bg-blue-700 fixed right-10 bottom-24 shadow-lg shadow-blue-900/40 transition-transform hover:scale-105"
        onClick={() => {
          setOpenAddEditModal({ isShown: true, type: "add", data: null });
        }}
      >
        <MdAdd className='text-[32px] text-white' />
      </button>

      <Modal
        isOpen={openAddEditModal.isShown}
        onRequestClose={() => setOpenAddEditModal({ isShown: false, type: "add", data: null })}
        style={{
          overlay: {
            backgroundColor: "rgba(0, 0, 0, 0.2)",
            display: "flex",
            alignItems: "flex-start",
            justifyContent: "center",
            paddingTop: "4.5rem",
            paddingBottom: "2rem",
          },
        }}
        contentLabel=""
        className="w-[40%] max-h-3/4 bg-white rounded-md mx-auto mt-0 p-5 overflow-scroll"
      >

        <AddEditNotes
          type={openAddEditModal.type}
          noteData={openAddEditModal.data}
          onClose={() => {
            setOpenAddEditModal({ isShown: false, type: "add", data: null });
          }}
          getAllNotes={getAllNotes}
          showToastMessage={showToastMessage}
        />
      </Modal>

      <Modal
        isOpen={openViewModal.isShown}
        onRequestClose={() => setOpenViewModal({ isShown: false, data: null })}
        style={{
          overlay: {
            backgroundColor: "rgba(0, 0, 0, 0.35)",
            display: "flex",
            alignItems: "flex-start",
            justifyContent: "center",
            paddingTop: "4.5rem",
            paddingBottom: "2rem",
          },
        }}
        contentLabel=""
        className="w-[92%] md:w-[60%] max-h-[80vh] bg-white border border-slate-200 rounded-xl mx-auto mt-0 p-5 overflow-scroll"
      >
        <div className="relative">
          <button
            type="button"
            className="w-10 h-10 rounded-full flex items-center justify-center absolute -top-3 -right-3 hover:bg-slate-100"
            onClick={() => setOpenViewModal({ isShown: false, data: null })}
            aria-label="Close note"
          >
            <MdClose className="text-xl text-slate-400" />
          </button>

          <div className="pr-10">
            <h3 className="text-xl font-semibold text-slate-900">
              {openViewModal.data?.title}
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              {openViewModal.data?.createdOn
                ? moment(openViewModal.data.createdOn).format("Do MMM YYYY")
                : ""}
            </p>

            <div className="mt-4 whitespace-pre-wrap text-sm text-slate-700 leading-6">
              {openViewModal.data?.content}
            </div>

            {openViewModal.data?.tags?.length > 0 && (
              <div className="mt-5 flex flex-wrap gap-2">
                {openViewModal.data.tags.map((t) => (
                  <span
                    key={t}
                    className="text-xs text-slate-700 bg-slate-50 border border-slate-200 px-3 py-1 rounded-full"
                  >
                    #{t}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>
      </Modal>

      <Toast
        isShown={showToastMsg.isShown}
        message={showToastMsg.message}
        type={showToastMsg.type}
        onClose={handleCloseToast}
      />
    </>
  );
};

export default Home;