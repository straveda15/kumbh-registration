import { useRef, useState } from 'react';
import { Upload, Eye, Download, Trash2, FileText, RotateCcw } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { ImageCropDialog } from './ImageCropDialog';
import { DocumentPreviewDialog } from './DocumentPreviewDialog';
import { useDocuments } from '../hooks/useDocuments';
import { useUploadDocument } from '../hooks/useUploadDocument';
import { useDeleteDocument } from '../hooks/useDeleteDocument';
import { validateDocumentFile, DOCUMENT_TYPE_META } from '@/validators/document.schema';

const formatSize = (bytes) => `${Math.max(1, Math.round(bytes / 1024))} KB`;

export const DocumentUploadCard = ({ type }) => {
  const meta = DOCUMENT_TYPE_META[type];
  const { data: allDocuments } = useDocuments();
  const uploadMutation = useUploadDocument();
  const deleteMutation = useDeleteDocument();
  const inputRef = useRef(null);

  const [progress, setProgress] = useState(0);
  const [pendingFile, setPendingFile] = useState(null);
  const [cropSrc, setCropSrc] = useState(null);
  const [cropOpen, setCropOpen] = useState(false);
  const [previewDoc, setPreviewDoc] = useState(null);

  const documents = (allDocuments || []).filter((doc) => doc.type === type);
  const canAddMore = meta.multiple || documents.length === 0;

  const startUpload = (file) => {
    setPendingFile(file);
    setProgress(0);
    uploadMutation.mutate(
      { file, type, onProgress: setProgress },
      {
        onSuccess: () => {
          toast.success(`${meta.label} uploaded`);
          setPendingFile(null);
        },
        onError: (error) => {
          toast.error(error.message || 'Upload failed');
        },
      }
    );
  };

  const handleFileSelected = (event) => {
    const file = event.target.files?.[0];
    event.target.value = '';
    if (!file) return;

    const validationError = validateDocumentFile(file);
    if (validationError) {
      toast.error(validationError);
      return;
    }

    if (type === 'profilePhoto') {
      setCropSrc(URL.createObjectURL(file));
      setCropOpen(true);
      return;
    }

    startUpload(file);
  };

  const handleCropped = (blob) => {
    const file = new File([blob], 'profile-photo.jpg', { type: 'image/jpeg' });
    startUpload(file);
  };

  const handleRetry = () => {
    if (pendingFile) startUpload(pendingFile);
  };

  const handleDelete = async (id) => {
    try {
      await deleteMutation.mutateAsync(id);
      toast.success('Document removed');
    } catch (error) {
      toast.error(error.message || 'Could not remove document');
    }
  };

  const isUploading = uploadMutation.isPending;

  return (
    <Card className="glass-card border-none">
      <CardHeader>
        <CardTitle className="text-sm">{meta.label}</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-3">
        {documents.map((doc) => (
          <div key={doc._id} className="flex items-center gap-3 rounded-xl bg-white/5 p-3">
            {doc.mimeType?.startsWith('image/') ? (
              <img
                src={doc.url}
                alt={doc.originalName || meta.label}
                className="size-12 shrink-0 rounded-lg object-cover"
              />
            ) : (
              <FileText className="size-8 shrink-0 text-muted-foreground" />
            )}
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm text-foreground">{doc.originalName || meta.label}</p>
              <p className="text-xs text-muted-foreground">{formatSize(doc.sizeBytes)}</p>
            </div>
            <div className="flex shrink-0 gap-1">
              <Button
                size="icon-sm"
                variant="ghost"
                onClick={() => setPreviewDoc(doc)}
                aria-label="Preview document"
              >
                <Eye className="size-3.5" />
              </Button>
              <Button size="icon-sm" variant="ghost" asChild aria-label="Download document">
                <a href={doc.url} target="_blank" rel="noreferrer" download>
                  <Download className="size-3.5" />
                </a>
              </Button>
              <Button
                size="icon-sm"
                variant="ghost"
                onClick={() => handleDelete(doc._id)}
                aria-label="Delete document"
              >
                <Trash2 className="size-3.5" />
              </Button>
            </div>
          </div>
        ))}

        {documents.length === 0 && !isUploading && (
          <p className="text-xs text-muted-foreground">No {meta.label.toLowerCase()} uploaded yet.</p>
        )}

        {isUploading && (
          <div className="flex flex-col gap-1.5">
            <Progress value={progress} />
            <span className="text-xs text-muted-foreground">Uploading… {progress}%</span>
          </div>
        )}

        {uploadMutation.isError && !isUploading && (
          <Button variant="outline" size="sm" onClick={handleRetry} className="w-fit gap-1.5">
            <RotateCcw className="size-3.5" /> Retry upload
          </Button>
        )}

        {canAddMore && !isUploading && (
          <>
            <input
              ref={inputRef}
              type="file"
              accept={meta.accept}
              className="hidden"
              onChange={handleFileSelected}
            />
            <Button
              variant="outline"
              size="sm"
              onClick={() => inputRef.current?.click()}
              className="w-fit gap-1.5"
            >
              <Upload className="size-3.5" />
              {documents.length > 0 && !meta.multiple ? 'Replace' : 'Upload'}
            </Button>
          </>
        )}
      </CardContent>

      <ImageCropDialog
        open={cropOpen}
        onOpenChange={setCropOpen}
        imageSrc={cropSrc}
        onCropped={handleCropped}
      />
      <DocumentPreviewDialog
        open={Boolean(previewDoc)}
        onOpenChange={(open) => !open && setPreviewDoc(null)}
        document={previewDoc}
      />
    </Card>
  );
};

export default DocumentUploadCard;
