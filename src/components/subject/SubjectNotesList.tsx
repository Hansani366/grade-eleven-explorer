
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface Note {
  id: string;
  title: string;
  content: string;
  created_at: string;
}

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
            <CardTitle>{note.title}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="whitespace-pre-wrap">{note.content}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default SubjectNotesList;
