'use client'
import { useState } from "react";

interface AddNoteFormProps {
    claimId: string;
    userId: string;
    fetchNotes: () => void;
}

function AddNoteForm({ claimId, userId, fetchNotes }: AddNoteFormProps) {
    const [content, setContent] = useState('');
    const [saving, setSaving] = useState(false);

    // Handles form submission to create a new note
    async function handleSubmit(evt: React.SubmitEvent<HTMLFormElement>) {
        evt.preventDefault();

        if (!content.trim()) return;

        try {
            setSaving(true);

            const res = await fetch(`/api/claims/${claimId}/notes`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    userId,
                    content
                })
            })

            if (!res.ok) {
                throw new Error('Failed to create note');
            }

            setContent('');
            fetchNotes();
        } catch (err) {
            console.error(err);
        } finally {
            setSaving(false);
        }
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-3">
            <textarea
                value={content}
                onChange={(evt) => setContent(evt.target.value)}
                placeholder="Add a note about this claim..."
                rows={3}
                className="w-full rounded-lg border p-3"
            />

            <button type="submit" disabled={saving} className="rounded-lg bg-black text-white px-4 py-2 disabled:opacity-50">
                {saving ? 'Saving...' : 'Add Note'}
            </button>
        </form>
    )
}

export default AddNoteForm;