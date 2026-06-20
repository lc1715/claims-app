'use client'
import { useState } from "react";
import { Note } from "./NotesSection";


interface NoteItemProps {
    note: Note;
    fetchNotes: () => void;
}

function NoteItem({ note, fetchNotes }: NoteItemProps) {
    const [isEditing, setIsEditing] = useState(false);
    const [editedContent, setEditedContent] = useState(note.content);

    // Deletes the selected note
    async function handleDelete() {
        const confirmed = window.confirm('Are you sure you want to delete this note?');

        if (!confirmed) return;

        try {
            await fetch(`/api/claims/${note.claimId}/notes/${note.id}`, {
                method: 'DELETE'
            })

            fetchNotes();
        } catch (err) {
            console.error(err);
        }
    }

    // Updates an existing note in the database
    async function handleSave() {
        try {
            await fetch(`/api/claims/${note.claimId}/notes/${note.id}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    content: editedContent
                }),
            });
            setIsEditing(false);
            fetchNotes();
        } catch (err) {
            console.error(err);
        }
    }

    return (
        <div className="border rounded-xl p-4">
            {isEditing ? (
                <>
                    <textarea
                        value={editedContent}
                        onChange={(evt) => setEditedContent(evt.target.value)}
                        rows={3}
                        className="w-full border p-2"
                    />

                    < button onClick={handleSave} className="bg-black text-white px-3 py-1 rounded" >
                        Save
                    </button>

                    <button onClick={() => { setEditedContent(note.content); setIsEditing(false) }} className="border px-3 py-1 rounded">
                        Cancel
                    </button>
                </>
            )
                : (
                    <>
                        <p>{note.content}</p>

                        <div>
                            <button onClick={() => setIsEditing(true)} className="border px-3 py-1 rounded">
                                Edit
                            </button>

                            <button onClick={handleDelete} className="border px-3 py-1 rounded">
                                Delete
                            </button>
                        </div>
                    </>
                )}
        </div >
    );
}

export default NoteItem;