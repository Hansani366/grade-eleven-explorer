
import React from 'react';
import { useParams } from 'react-router-dom';
import { useSubjectNotes } from '@/hooks/useSubjectNotes';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import SubjectNotesList from '@/components/subject/SubjectNotesList';
import CreateNoteDialog from '@/components/subject/CreateNoteDialog';

const SubjectDetails = () => {
  const { subjectId } = useParams();
  const { notes, isLoading } = useSubjectNotes(Number(subjectId));
  const [showCreateDialog, setShowCreateDialog] = React.useState(false);

  if (isLoading) {
    return <div className="p-8">Loading...</div>;
  }

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Subject Notes</h1>
        <Button onClick={() => setShowCreateDialog(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Add Note
        </Button>
      </div>

      <SubjectNotesList notes={notes} />
      
      <CreateNoteDialog 
        open={showCreateDialog}
        onOpenChange={setShowCreateDialog}
        subjectId={Number(subjectId)}
      />
    </div>
  );
};

export default SubjectDetails;
