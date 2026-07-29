import { useRef, useState } from 'react';
import { Upload, Eye, Download, Trash2, FileText, RotateCcw, Camera, ImagePlus } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { ImageCropDialog } from './ImageCropDialog';
import { DocumentPreviewDialog } from './DocumentPreviewDialog';
import { WebcamCaptureDialog } from './WebcamCaptureDialog';
import { useDocuments } from '../hooks/useDocuments';
import { useUploadDocument } from '../hooks/useUploadDocument';
import { useDeleteDocument } from '../hooks/useDeleteDocument';
import { validateDocumentFile, DOCUMENT_TYPE_META } from '@/validators/document.schema';
import { useRegistrationSnapshot } from '@/features/registration-wizard/hooks/useRegistrationSnapshot';

const formatSize = (bytes) => `${Math.max(1, Math.round(bytes / 1024))} KB`;

export const DocumentUploadCard = ({ type, variant = 'default' }) => {
  const meta = DOCUMENT_TYPE_META[type] || { label: type, multiple: false };
  const { data: allDocuments } = useDocuments();
  const { data: snapshot } = useRegistrationSnapshot();
  const uploadMutation = useUploadDocument();
  const deleteMutation = useDeleteDocument();
  const inputRef = useRef(null);
  const cameraInputRef = useRef(null);

  const [progress, setProgress] = useState(0);
  const [pendingFile, setPendingFile] = useState(null);
  const [cropSrc, setCropSrc] = useState(null);
  const [cropOpen, setCropOpen] = useState(false);
  const [webcamOpen, setWebcamOpen] = useState(false);
  const [previewDoc, setPreviewDoc] = useState(null);

  const isMobileDevice = typeof window !== 'undefined' && /Mobi|Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

  const handleTakePhoto = () => {
    if (isMobileDevice) {
      cameraInputRef.current?.click();
    } else {
      setWebcamOpen(true);
    }
  };

  const familyMembers = snapshot?.familyMembers || [];
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

  // Dedicated layout for Family Member Photos card
  if (type === 'familyMemberPhoto') {
    const familyPhotos = familyMembers.filter((m) => Boolean((m.data || m).photoUrl));
    const familyDocs = documents;
    const totalCount = Math.max(familyPhotos.length, familyDocs.length);
    const hasPhotos = totalCount > 0;

    return (
      <Card className="glass-card border-none">
        <CardHeader className="flex flex-row items-center justify-between gap-2 space-y-0">
          <CardTitle className="text-sm">Family Member Photos</CardTitle>
          <Badge variant={hasPhotos ? 'default' : 'outline'} className="shrink-0">
            {hasPhotos ? `Uploaded (${totalCount})` : 'Not Uploaded'}
          </Badge>
        </CardHeader>
        <CardContent className="flex flex-col gap-3">
          {!hasPhotos ? (
            <p className="text-xs text-muted-foreground">No family member photos uploaded yet.</p>
          ) : (
            familyPhotos.map((m) => {
              const mData = m.data || m;
              const docObj = familyDocs.find((d) => d.url === mData.photoUrl) || {
                url: mData.photoUrl,
                originalName: `${mData.fullName} - Photo`,
                mimeType: 'image/jpeg',
              };

              return (
                <div key={m._id || mData.fullName} className="flex items-center gap-3 rounded-xl bg-muted p-3">
                  <img
                    src={mData.photoUrl}
                    alt={mData.fullName}
                    className="size-12 shrink-0 rounded-lg object-cover border border-border"
                  />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold text-foreground">{mData.fullName}</p>
                    <p className="text-xs text-muted-foreground">{mData.relationship} • Photo Uploaded</p>
                  </div>
                  <div className="flex shrink-0 gap-1">
                    <Button
                      size="icon-sm"
                      variant="ghost"
                      onClick={() => setPreviewDoc(docObj)}
                      aria-label="Preview document"
                    >
                      <Eye className="size-3.5" />
                    </Button>
                    <Button size="icon-sm" variant="ghost" asChild aria-label="Download document">
                      <a href={mData.photoUrl} target="_blank" rel="noreferrer" download>
                        <Download className="size-3.5" />
                      </a>
                    </Button>
                    {docObj._id && (
                      <Button
                        size="icon-sm"
                        variant="ghost"
                        onClick={() => handleDelete(docObj._id)}
                        aria-label="Delete document"
                      >
                        <Trash2 className="size-3.5" />
                      </Button>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </CardContent>

        <DocumentPreviewDialog
          open={Boolean(previewDoc)}
          onOpenChange={(open) => !open && setPreviewDoc(null)}
          document={previewDoc}
        />
      </Card>
    );
  }

  // Compact single-row layout for Personal Information step
  if (variant === 'compact') {
    const existingDoc = documents[0];

    return (
      <div className="glass-card flex w-full flex-col gap-1.5 rounded-xl border border-border px-3 py-2">
        <div className="flex items-center gap-2.5">
          <span className="flex size-12 shrink-0 items-center justify-center self-center overflow-hidden rounded-lg bg-primary/15 text-primary sm:size-14">
            {existingDoc?.mimeType?.startsWith('image/') ? (
              <img src={existingDoc.url} alt={meta.label} className="size-full object-cover" />
            ) : (
              <Camera className="size-5" />
            )}
          </span>
          <div className="flex min-w-0 flex-1 flex-col justify-center gap-0.5">
            <p className="text-base leading-tight font-semibold text-foreground">
              Profile Photo <span className="text-destructive font-medium ml-0.5">*</span>
            </p>
            <p className="text-[13px] leading-tight text-muted-foreground">PNG/JPG • Max 2 MB</p>
            {isUploading && (
              <div className="mt-1 flex items-center gap-2">
                <Progress value={progress} className="h-1" />
                <span className="text-xs text-muted-foreground">{progress}%</span>
              </div>
            )}
          </div>
        </div>

        <input
          ref={cameraInputRef}
          type="file"
          accept={meta.accept}
          capture="environment"
          className="hidden"
          onChange={handleFileSelected}
        />
        <input ref={inputRef} type="file" accept={meta.accept} className="hidden" onChange={handleFileSelected} />

        {uploadMutation.isError && !isUploading ? (
          <Button variant="outline" onClick={handleRetry} className="h-9 gap-1.5 rounded-lg text-xs sm:h-10 sm:text-sm">
            <RotateCcw className="size-3.5" /> Retry
          </Button>
        ) : (
          !isUploading && (
            <div className="grid grid-cols-2 gap-2">
              <Button
                variant="outline"
                onClick={handleTakePhoto}
                className="h-9 w-full justify-center gap-1 rounded-lg text-xs sm:h-10 sm:text-sm"
              >
                <Camera className="size-3.5" /> {existingDoc ? 'Retake' : 'Take Photo'}
              </Button>
              <Button
                variant="outline"
                onClick={() => inputRef.current?.click()}
                className="h-9 w-full justify-center gap-1 rounded-lg text-xs sm:h-10 sm:text-sm"
              >
                <ImagePlus className="size-3.5" /> {existingDoc ? 'Change' : 'Upload'}
              </Button>
            </div>
          )
        )}

        {existingDoc && !isUploading && (
          <button
            type="button"
            onClick={() => handleDelete(existingDoc._id)}
            disabled={deleteMutation.isPending}
            className="flex w-fit items-center gap-1 self-start text-[13px] font-medium text-destructive/80 hover:text-destructive hover:underline disabled:opacity-50"
          >
            <Trash2 className="size-3" /> Remove Photo
          </button>
        )}

        <ImageCropDialog open={cropOpen} onOpenChange={setCropOpen} imageSrc={cropSrc} onCropped={handleCropped} />
        <WebcamCaptureDialog
          open={webcamOpen}
          onOpenChange={setWebcamOpen}
          onCaptured={(blob) => {
            if (type === 'profilePhoto') {
              setCropSrc(URL.createObjectURL(blob));
              setCropOpen(true);
            } else {
              const file = new File([blob], 'photo.jpg', { type: 'image/jpeg' });
              startUpload(file);
            }
          }}
        />
        <DocumentPreviewDialog
          open={Boolean(previewDoc)}
          onOpenChange={(open) => !open && setPreviewDoc(null)}
          document={previewDoc}
        />
      </div>
    );
  }

  return (
    <Card className="glass-card border-none">
      <CardHeader className="flex flex-row items-center justify-between gap-2 space-y-0">
        <CardTitle className="text-sm">{meta.label}</CardTitle>
        <Badge variant={documents.length > 0 ? 'default' : 'outline'} className="shrink-0">
          {documents.length > 0 ? 'Uploaded' : 'Not Uploaded'}
        </Badge>
      </CardHeader>
      <CardContent className="flex flex-col gap-3">
        {documents.map((doc) => (
          <div key={doc._id} className="flex items-center gap-3 rounded-xl bg-muted p-3">
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
