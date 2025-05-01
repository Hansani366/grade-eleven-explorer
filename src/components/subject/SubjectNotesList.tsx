
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Note } from '@/hooks/useSubjectNotes';

interface Props {
  notes: Note[];
}

const SubjectNotesList = ({ notes }: Props) => {
  if (notes.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        No notes yet. Click "Add Note" to create one.
      </div>
    );
  }

  return (
    <div className="grid gap-4">
      {notes.map((note) => (
        <Card key={note.id}>
          <CardHeader>
            <CardTitle>{note.Title}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="whitespace-pre-wrap">{note.Content}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default SubjectNotesList;
