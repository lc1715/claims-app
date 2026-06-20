import { Note } from "./NotesSection";
import NoteItem from "./NoteItem";


interface NotesListProps {
    notes: Note[];
    fetchNotes: () => void;
}

/**
 * Displays all notes associated with a claim.
 */
function NotesList({ notes, fetchNotes }: NotesListProps) {
    return (
        <div className="space-y-3">
            {notes.map((note) => (
                <NoteItem key={note.id} note={note} fetchNotes={fetchNotes} />
            ))}
        </div>
    )
}

export default NotesList;