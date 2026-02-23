import React, { useEffect, useState } from "react";

const App = () => {
  const [title, setTitle] = useState("");
  const [details, setDetails] = useState("");
  const [task, setTask] = useState([]);
  const [search, setSearch] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [selectedNote, setSelectedNote] = useState(null); // ⭐ modal state

  // load
  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("notes"));
    if (saved) setTask(saved);
  }, []);

  // save
  useEffect(() => {
    localStorage.setItem("notes", JSON.stringify(task));
  }, [task]);

  const SubmitHandler = (e) => {
    e.preventDefault();
    if (!title.trim() || !details.trim()) return;

    if (editingId) {
      setTask((prev) =>
        prev.map((note) =>
          note.id === editingId ? { ...note, title, details } : note
        )
      );
      setEditingId(null);
    } else {
      const newNote = {
        id: Date.now(),
        title,
        details,
        createdAt: new Date().toLocaleString(),
      };
      setTask((prev) => [...prev, newNote]);
    }

    setTitle("");
    setDetails("");
  };

  const deleteNote = (id) => {
    setTask((prev) => prev.filter((n) => n.id !== id));
  };

  const editNote = (note) => {
    setTitle(note.title);
    setDetails(note.details);
    setEditingId(note.id);
  };

  const filteredNotes = task.filter(
    (note) =>
      note.title.toLowerCase().includes(search.toLowerCase()) ||
      note.details.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="relative min-h-screen flex items-center justify-center p-4 text-white bg-gradient-to-br from-zinc-950 via-slate-950 to-black overflow-hidden">
      
      {/* glow */}
      <div className="pointer-events-none absolute -top-32 -left-32 w-96 h-96 bg-indigo-600/30 rounded-full blur-3xl"></div>
      <div className="pointer-events-none absolute -bottom-32 -right-32 w-96 h-96 bg-purple-600/30 rounded-full blur-3xl"></div>

      <div className="w-full max-w-7xl lg:flex rounded-3xl overflow-hidden shadow-2xl border border-white/10 bg-white/5 backdrop-blur-xl">
        
        {/* LEFT */}
        <form
          onSubmit={SubmitHandler}
          className="flex flex-col gap-6 lg:w-1/2 w-full p-10"
        >
          <h1 className="text-4xl font-bold">
            {editingId ? (
              <span className="text-yellow-400">Edit Note</span>
            ) : (
              <>
                Add <span className="text-indigo-400">Notes</span>
              </>
            )}
          </h1>

          <input
            type="text"
            placeholder="Enter note heading"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="px-5 py-3 bg-white/5 border border-white/10 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500 placeholder:text-white/40"
          />

          <textarea
            placeholder="Write details here..."
            value={details}
            onChange={(e) => setDetails(e.target.value)}
            className="px-5 py-3 h-32 bg-white/5 border border-white/10 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500 resize-none placeholder:text-white/40"
          />

          <button
            type="submit"
            className="bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 font-semibold py-3 rounded-xl transition active:scale-95"
          >
            {editingId ? "Update Note" : "Add Note"}
          </button>
        </form>

        {/* RIGHT */}
        <div className="lg:w-1/2 w-full p-10 border-t lg:border-t-0 lg:border-l border-white/10 bg-white/5 backdrop-blur-xl">
          <h1 className="text-4xl font-bold">
            Recent <span className="text-indigo-400">Notes</span>
          </h1>

          <input
            type="text"
            placeholder="Search notes..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="mt-5 w-full px-4 py-2 bg-white/5 border border-white/10 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500 placeholder:text-white/40"
          />

          <div className="flex flex-wrap gap-6 mt-8">
            {filteredNotes.length === 0 && (
              <p className="text-white/40">No matching notes.</p>
            )}

            {filteredNotes.map((note) => (
              <div
                key={note.id}
                onClick={() => setSelectedNote(note)} // ⭐ open modal
                className="cursor-pointer h-64 w-52 rounded-2xl p-5
                bg-gradient-to-br from-white/10 to-white/5
                border border-white/10 backdrop-blur-xl
                flex flex-col justify-between
                hover:-translate-y-2 hover:shadow-2xl
                hover:shadow-indigo-500/10 transition-all duration-300"
              >
                <div>
                  <h3 className="text-lg font-bold break-all">
                    {note.title}
                  </h3>

                  <p className="mt-2 text-sm text-white/70 line-clamp-3">
                    {note.details}
                  </p>

                  <p className="mt-3 text-xs text-white/40">
                    {note.createdAt}
                  </p>
                </div>

                <div
                  className="flex gap-2 mt-4"
                  onClick={(e) => e.stopPropagation()} // ⭐ prevent modal
                >
                  <button
                    onClick={() => editNote(note)}
                    className="flex-1 text-sm py-1.5 rounded-lg bg-yellow-500/90 hover:bg-yellow-500 transition"
                  >
                    Edit
                  </button>

                  <button
                    onClick={() => deleteNote(note.id)}
                    className="flex-1 text-sm py-1.5 rounded-lg bg-red-500/90 hover:bg-red-500 transition"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ⭐ MODAL */}
      {selectedNote && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50"
          onClick={() => setSelectedNote(null)}
        >
          <div
            className="w-full max-w-lg rounded-2xl bg-zinc-900 border border-white/10 p-6 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-start">
              <h2 className="text-2xl font-bold">
                {selectedNote.title}
              </h2>
              <button
                onClick={() => setSelectedNote(null)}
                className="text-white/60 hover:text-white text-xl"
              >
                ✕
              </button>
            </div>

            <p className="mt-4 text-white/80 whitespace-pre-wrap">
              {selectedNote.details}
            </p>

            <p className="mt-6 text-xs text-white/40">
              {selectedNote.createdAt}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;