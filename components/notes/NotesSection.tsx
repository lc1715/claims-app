'use client'
import { useState, useEffect } from "react";
import AddNoteForm from "./AddNoteForm";
import NotesList from "./NotesList";

export interface Note {
    id: string;
    claimId: string;
    userId: string;
    content: string;
    createdAt: string;
    updatedAt: string;
}

interface NotesSectionProps {
    claimId: string;
    userId: string;
}

function NotesSection({ claimId, userId }: NotesSectionProps) {
    const [notes, setNotes] = useState<Note[]>([]);
    const [loading, setLoading] = useState(true);

    // Fetch all notes for the claim
    async function fetchNotes() {
        try {
            const res = await fetch(`/api/claims/${claimId}/notes`);

            if (!res.ok) {
                throw new Error('Failed to load notes');
            }

            const data = await res.json();
            console.log('fetched notes', data);
            setNotes(data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    }

    // Load notes when the component mounts or when the claim changes
    useEffect(() => {
        fetchNotes();
    }, [claimId]);

    return (
        <section className="bg-white border rounded-2xl p-6 shadow-sm">
            <h2 className="text-xl font-semibold mb-4">
                Notes
            </h2>

            <AddNoteForm claimId={claimId} userId={userId} fetchNotes={fetchNotes} />

            <div>
                {loading ?
                    (<p>Loading notes...</p>)
                    :
                    (<NotesList notes={notes} fetchNotes={fetchNotes} />)
                }
            </div>
        </section>
    )

}

export default NotesSection;