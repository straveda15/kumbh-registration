import { Link } from 'react-router-dom';
import { FolderOpen } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { DocumentUploadCard } from '@/features/documents/components/DocumentUploadCard';
import { DOCUMENT_TYPE_META } from '@/validators/document.schema';
import { useHasCitizenSession } from '@/hooks/useHasCitizenSession';

// One simple card per document type, stacked vertically — no tabs to
// switch between on a phone, just scroll. Each card already shows its own
// upload/replace/remove affordances and a real Uploaded/Not Uploaded
// status (see DocumentUploadCard).
export const DocumentCenterPage = () => {
  const hasSession = useHasCitizenSession();

  if (!hasSession) {
    return (
      <div className="mx-auto flex min-h-[70vh] w-full max-w-xl flex-col items-center justify-center gap-4 px-4 text-center">
        <FolderOpen className="size-10 text-muted-foreground" />
        <p className="text-sm text-muted-foreground">No registration found in this browser.</p>
        <Button asChild variant="outline">
          <Link to="/">Back to home</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="mx-auto flex w-full max-w-md flex-col gap-4 px-4 py-6">
      <div>
        <h1 className="text-lg font-semibold text-foreground">Documents</h1>
        <p className="text-sm text-muted-foreground">
          Upload and manage your profile photo and supporting documents.
        </p>
      </div>

      {Object.keys(DOCUMENT_TYPE_META).map((type) => (
        <DocumentUploadCard key={type} type={type} />
      ))}
    </div>
  );
};

export default DocumentCenterPage;
