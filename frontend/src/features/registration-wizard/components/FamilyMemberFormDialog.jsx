import { useEffect, useRef, useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { Camera, ImagePlus, Trash2, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Progress } from '@/components/ui/progress';
import { WizardField } from './WizardField';
import { familyMemberSchema, familyMemberDefaults } from '@/validators/familyMember.schema';
import { RELATIONSHIP_OPTIONS } from '@/utils/relationshipOptions';
import { ImageCropDialog } from '@/features/documents/components/ImageCropDialog';
import { validateDocumentFile } from '@/validators/document.schema';
import { useUploadDocument } from '@/features/documents/hooks/useUploadDocument';

export const FamilyMemberFormDialog = ({ open, onOpenChange, initialData, onSubmit, isSaving }) => {
  const inputRef = useRef(null);
  const cameraInputRef = useRef(null);

  const [cropSrc, setCropSrc] = useState(null);
  const [cropOpen, setCropOpen] = useState(false);
  const [submittedAttempt, setSubmittedAttempt] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const uploadMutation = useUploadDocument();

  const form = useForm({
    resolver: zodResolver(familyMemberSchema),
    defaultValues: { ...familyMemberDefaults, ...initialData },
  });

  // Modal reset & state isolation on dialog open / initialData change
  useEffect(() => {
    if (open) {
      setSubmittedAttempt(false);
      setCropSrc(null);
      setCropOpen(false);
      setUploadProgress(0);
      form.reset({ ...familyMemberDefaults, ...initialData });
      if (inputRef.current) inputRef.current.value = '';
      if (cameraInputRef.current) cameraInputRef.current.value = '';
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, initialData]);

  const photoUrl = form.watch('photoUrl');
  const isUploadingPhoto = uploadMutation.isPending;

  const handleFileSelected = (event) => {
    const file = event.target.files?.[0];
    event.target.value = '';
    if (!file) return;

    const validationError = validateDocumentFile(file);
    if (validationError) {
      toast.error(validationError);
      return;
    }

    setCropSrc(URL.createObjectURL(file));
    setCropOpen(true);
  };

  const handleCropped = async (blob) => {
    const uniqueFileName = `family-photo-${Date.now()}.jpg`;
    const file = new File([blob], uniqueFileName, { type: 'image/jpeg' });
    setUploadProgress(0);

    try {
      // Primary attempt with type: 'familyMemberPhoto'
      let docResult;
      try {
        docResult = await uploadMutation.mutateAsync({
          file,
          type: 'familyMemberPhoto',
          onProgress: setUploadProgress,
        });
      } catch (err) {
        // Fallback to 'other' if backend hasn't reloaded familyMemberPhoto enum
        docResult = await uploadMutation.mutateAsync({
          file,
          type: 'other',
          onProgress: setUploadProgress,
        });
      }

      const finalUrl = docResult?.url || docResult?.data?.url;
      if (finalUrl) {
        form.setValue('photoUrl', finalUrl, { shouldValidate: true, shouldDirty: true });
        toast.success('Photo uploaded successfully');
      } else {
        toast.error('Could not retrieve photo URL after upload.');
      }
    } catch (error) {
      toast.error(error.message || 'Photo upload failed.');
    }
  };

  const handleRemovePhoto = () => {
    form.setValue('photoUrl', '', { shouldValidate: true, shouldDirty: true });
    if (inputRef.current) inputRef.current.value = '';
    if (cameraInputRef.current) cameraInputRef.current.value = '';
  };

  const handleSubmit = form.handleSubmit(
    async (values) => {
      const success = await onSubmit(values);
      if (success) {
        setSubmittedAttempt(false);
        setCropSrc(null);
        setCropOpen(false);
        setUploadProgress(0);
        form.reset(familyMemberDefaults);
        onOpenChange(false);
      }
    },
    () => {
      setSubmittedAttempt(true);
    }
  );

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{initialData ? 'Edit Family Member' : 'Add Family Member'}</DialogTitle>
          <DialogDescription>
            Add details and photo for a family member travelling with you.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {/* ── Photo Upload Section ── */}
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-semibold text-foreground">Profile Photo *</label>
            <div className="glass-card flex w-full flex-col gap-2 rounded-xl border border-border p-3">
              <div className="flex items-center gap-3">
                <span className="flex size-14 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-primary/15 text-primary">
                  {isUploadingPhoto ? (
                    <Loader2 className="size-6 animate-spin" />
                  ) : photoUrl ? (
                    <img src={photoUrl} alt="Family Member" className="size-full object-cover" />
                  ) : (
                    <Camera className="size-6" />
                  )}
                </span>
                <div className="flex flex-1 flex-col justify-center gap-0.5">
                  <p className="text-sm font-semibold text-foreground">
                    {isUploadingPhoto ? 'Uploading photo...' : 'Photo'}
                  </p>
                  <p className="text-xs text-muted-foreground">PNG/JPG • Max 2 MB</p>
                  {isUploadingPhoto && (
                    <div className="mt-1 flex items-center gap-2">
                      <Progress value={uploadProgress} className="h-1" />
                      <span className="text-xs text-muted-foreground">{uploadProgress}%</span>
                    </div>
                  )}
                </div>
              </div>

              <input
                ref={cameraInputRef}
                type="file"
                accept="image/*"
                capture="environment"
                className="hidden"
                onChange={handleFileSelected}
              />
              <input
                ref={inputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleFileSelected}
              />

              {!isUploadingPhoto && (
                <div className="grid grid-cols-2 gap-2 mt-1">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => cameraInputRef.current?.click()}
                    className="h-9 w-full justify-center gap-1 text-xs"
                  >
                    <Camera className="size-3.5" /> {photoUrl ? 'Retake' : 'Take Photo'}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => inputRef.current?.click()}
                    className="h-9 w-full justify-center gap-1 text-xs"
                  >
                    <ImagePlus className="size-3.5" /> {photoUrl ? 'Change' : 'Upload'}
                  </Button>
                </div>
              )}

              {photoUrl && !isUploadingPhoto && (
                <button
                  type="button"
                  onClick={handleRemovePhoto}
                  className="flex items-center gap-1 text-xs font-medium text-destructive hover:underline mt-1"
                >
                  <Trash2 className="size-3" /> Remove Photo
                </button>
              )}
            </div>

            {!photoUrl && (submittedAttempt || form.formState.errors.photoUrl) && (
              <p className="text-xs text-[#FF7262] animate-in fade-in duration-200">
                {form.formState.errors.photoUrl?.message || 'Profile photo is required.'}
              </p>
            )}
          </div>

          <WizardField label="Full Name *" error={form.formState.errors.fullName?.message}>
            <Input className="h-14 px-4" {...form.register('fullName')} placeholder="Full name" />
          </WizardField>

          <WizardField label="Relationship *" error={form.formState.errors.relationship?.message}>
            <Select
              value={form.watch('relationship')}
              onValueChange={(value) =>
                form.setValue('relationship', value, { shouldValidate: true, shouldDirty: true })
              }
            >
              <SelectTrigger className="h-14 w-full px-4">
                <SelectValue placeholder="Select relationship" />
              </SelectTrigger>
              <SelectContent>
                {RELATIONSHIP_OPTIONS.map((option) => (
                  <SelectItem key={option} value={option}>
                    {option}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </WizardField>

          <WizardField label="Age *" error={form.formState.errors.age?.message}>
            <Input
              className="h-14 px-4"
              type="number"
              min="0"
              max="120"
              {...form.register('age')}
              placeholder="0 to 120"
            />
          </WizardField>

          <WizardField label="Aadhaar Card Number *" error={form.formState.errors.aadhaarNumber?.message}>
            <Input
              className="h-14 px-4"
              {...form.register('aadhaarNumber')}
              inputMode="numeric"
              maxLength={12}
              placeholder="12-digit Aadhaar number"
            />
          </WizardField>

          <WizardField label="Gender *" error={form.formState.errors.gender?.message}>
            <Select
              value={form.watch('gender')}
              onValueChange={(value) =>
                form.setValue('gender', value, { shouldValidate: true, shouldDirty: true })
              }
            >
              <SelectTrigger className="h-14 w-full px-4">
                <SelectValue placeholder="Select gender" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="male">Male</SelectItem>
                <SelectItem value="female">Female</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
          </WizardField>

          <DialogFooter className="mt-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSaving || isUploadingPhoto}
              className="hover:bg-[var(--w-accent-hover)]"
            >
              {initialData ? 'Save Changes' : 'Add Member'}
            </Button>
          </DialogFooter>
        </form>

        <ImageCropDialog
          open={cropOpen}
          onOpenChange={setCropOpen}
          imageSrc={cropSrc}
          onCropped={handleCropped}
        />
      </DialogContent>
    </Dialog>
  );
};

export default FamilyMemberFormDialog;
