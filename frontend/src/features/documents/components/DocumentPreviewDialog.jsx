import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';

export const DocumentPreviewDialog = ({ open, onOpenChange, document }) => {
  if (!document) return null;
  const isPdf = document.mimeType === 'application/pdf';

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle className="break-words">{document.originalName || 'Document preview'}</DialogTitle>
        </DialogHeader>
        {isPdf ? (
          <iframe
            src={document.url}
            title="Document preview"
            className="h-[55vh] w-full rounded-lg bg-white sm:h-[70vh]"
          />
        ) : (
          <img
            src={document.url}
            alt={document.originalName || 'Document preview'}
            className="max-h-[55vh] w-full rounded-lg object-contain sm:max-h-[70vh]"
          />
        )}
      </DialogContent>
    </Dialog>
  );
};

export default DocumentPreviewDialog;
