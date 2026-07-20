import { Link } from 'react-router-dom';
import { ArrowLeft, FolderOpen } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { DocumentUploadCard } from '@/features/documents/components/DocumentUploadCard';
import { DOCUMENT_TYPE_META } from '@/validators/document.schema';
import { useHasCitizenSession } from '@/hooks/useHasCitizenSession';

export const DocumentCenterPage = () => {
  const hasSession = useHasCitizenSession();

  if (!hasSession) {
    return (
      <div className="mx-auto flex min-h-screen w-full max-w-xl flex-col items-center justify-center gap-4 px-4 text-center">
        <FolderOpen className="size-10 text-muted-foreground" />
        <p className="text-sm text-muted-foreground">No registration found in this browser.</p>
        <Button asChild variant="outline">
          <Link to="/">Back to home</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="mx-auto flex w-full max-w-3xl flex-col gap-5 px-4 py-10 sm:px-6">
      <Button asChild variant="ghost" size="sm" className="w-fit gap-1.5">
        <Link to="/dashboard">
          <ArrowLeft className="size-4" /> Back to Dashboard
        </Link>
      </Button>

      <div>
        <h1 className="text-2xl font-semibold text-foreground">Document Center</h1>
        <p className="text-sm text-muted-foreground">
          Upload and manage your profile photo, government ID, and supporting documents.
        </p>
      </div>

      <Tabs defaultValue="profilePhoto">
        <div className="overflow-x-auto">
          <TabsList className="w-max sm:w-fit">
            {Object.entries(DOCUMENT_TYPE_META).map(([type, meta]) => (
              <TabsTrigger key={type} value={type} className="flex-none">
                {meta.label}
              </TabsTrigger>
            ))}
          </TabsList>
        </div>
        {Object.keys(DOCUMENT_TYPE_META).map((type) => (
          <TabsContent key={type} value={type} className="mt-4">
            <DocumentUploadCard type={type} />
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
};

export default DocumentCenterPage;
