'use client';

import { useRef, useState } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { toast } from '@/lib/toast';

/**
 * URL field + file upload (server storage; fills URL).
 */
export function ListingImageField({
  id = 'listing-image-url',
  label = 'Image',
  value,
  onChange,
  disabled = false,
  className = '',
}) {
  const fileRef = useRef(null);
  const [uploading, setUploading] = useState(false);

  const uploadFile = async (fileList) => {
    const file = fileList?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const fd = new FormData();
      fd.append('file', file);
      const res = await fetch('/api/admin/listings/upload', { method: 'POST', credentials: 'include', body: fd });
      const json = await res.json();
      if (!json?.success || !json?.data?.url) throw new Error(json?.message || 'Upload failed');
      onChange(json.data.url);
      toast.success('Image uploaded');
      if (fileRef.current) fileRef.current.value = '';
    } catch (e) {
      toast.error(e.message || 'Upload failed');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className={className}>
      <Label htmlFor={id}>{label}</Label>
      <Input
        id={id}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="mt-1 rounded-xl"
        placeholder="Paste URL or use upload"
        disabled={disabled || uploading}
      />
      <input
        ref={fileRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/gif"
        className="sr-only"
        tabIndex={-1}
        disabled={disabled || uploading}
        onChange={(e) => uploadFile(Array.from(e.target.files || []))}
      />
      <div className="mt-2">
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="rounded-xl"
          disabled={disabled || uploading}
          onClick={() => fileRef.current?.click()}
        >
          {uploading ? 'Uploading…' : 'Upload image file'}
        </Button>
      </div>
      <p className="text-xs text-muted-foreground mt-1">JPEG, PNG, WebP or GIF · max 5MB · stored on your server</p>
    </div>
  );
}
