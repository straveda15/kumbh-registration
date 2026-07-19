import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';

export const DocumentPreviewDialog = ({ open, onOpenChange, document }) => {
  if (!document) return null;
  const isPdf = document.mimeType === 'application/pdf';

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>{document.originalName || 'Document preview'}</DialogTitle>
        </DialogHeader>
        {isPdf ? (
          <iframe
            src={document.url}
            title="Document preview"
            className="h-[70vh] w-full rounded-lg bg-white"
          />
        ) : (
          <img
            src={document.url}
            alt={document.originalName || 'Document preview'}
            className="max-h-[70vh] w-full rounded-lg object-contain"
          />
        )}
      </DialogContent>
    </Dialog>
  );
};

export default DocumentPreviewDialog;
