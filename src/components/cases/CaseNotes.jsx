import React, { useState } from 'react';

const CaseNotes = ({ notes = [], onAddNote, loading = false }) => {
  const [newNote, setNewNote] = useState('');
  const handleSubmit = (e) => { e.preventDefault(); if (!newNote.trim()) return; onAddNote(newNote.trim()); setNewNote(''); };

  return (
    <div className="space-y-4">
      <form onSubmit={handleSubmit} className="space-y-2">
        <textarea value={newNote} onChange={(e) => setNewNote(e.target.value)} placeholder="Add a note..." rows={3} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm resize-none" />
        <div className="flex justify-end"><button type="submit" disabled={!newNote.trim() || loading} className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:opacity-50">{loading ? 'Adding...' : 'Add Note'}</button></div>
      </form>
      <div className="space-y-3">
        {notes.length === 0 ? <p className="text-center text-gray-500 text-sm py-4">No notes yet</p> :
          notes.map((note, i) => (<div key={note._id || i} className="bg-gray-50 border rounded-lg p-3">
            <div className="flex items-center justify-between mb-2"><span className="text-xs font-medium text-gray-600">{note.createdBy?.name || note.author || 'Unknown'}</span><span className="text-xs text-gray-400">{new Date(note.createdAt || note.timestamp).toLocaleString()}</span></div>
            <p className="text-sm text-gray-800 whitespace-pre-wrap">{note.content || note.text}</p></div>))}
      </div>
    </div>
  );
};

export default CaseNotes;
