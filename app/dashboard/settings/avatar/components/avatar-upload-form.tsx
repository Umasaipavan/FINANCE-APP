'use client'
import AlertError from "@/components/alert-error"
import AlertSuccess from "@/components/alert-success"
import Input from "@/components/input"
import SubmitButton from "@/components/submit-button"
import { uploadAvatar } from "@/lib/actions"
import { useFormState } from 'react-dom'
import { useState, useRef } from 'react'

const initialState = {
  message: '',
  error: false
}

// Image compression utility
const compressImage = (file: File, maxWidth: number = 400, quality: number = 0.8): Promise<File> => {
  return new Promise((resolve) => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();
    
    img.onload = () => {
      // Calculate new dimensions
      let { width, height } = img;
      if (width > height) {
        if (width > maxWidth) {
          height = (height * maxWidth) / width;
          width = maxWidth;
        }
      } else {
        if (height > maxWidth) {
          width = (width * maxWidth) / height;
          height = maxWidth;
        }
      }
      
      canvas.width = width;
      canvas.height = height;
      
      // Draw and compress
      ctx?.drawImage(img, 0, 0, width, height);
      canvas.toBlob((blob) => {
        if (blob) {
          const compressedFile = new File([blob], file.name, {
            type: file.type,
            lastModified: Date.now()
          });
          resolve(compressedFile);
        } else {
          resolve(file);
        }
      }, file.type, quality);
    };
    
    img.src = URL.createObjectURL(file);
  });
};

export default function AvatarUploadForm() {
  const [state, formAction] = useFormState(uploadAvatar, initialState)
  const [isCompressing, setIsCompressing] = useState(false)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  
  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) {
      setPreviewUrl(null);
      return;
    }
    
    // Show preview
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);
    
    // Auto-compress if file is large
    if (file.size > 2 * 1024 * 1024) { // If larger than 2MB
      setIsCompressing(true);
      try {
        const compressedFile = await compressImage(file, 400, 0.8);
        
        // Create a new file input with the compressed file
        const dt = new DataTransfer();
        dt.items.add(compressedFile);
        
        if (fileInputRef.current) {
          fileInputRef.current.files = dt.files;
        }
        
        // Update preview with compressed image
        const compressedUrl = URL.createObjectURL(compressedFile);
        setPreviewUrl(compressedUrl);
        URL.revokeObjectURL(url); // Clean up original URL
      } catch (error) {
        console.error('Compression failed:', error);
      } finally {
        setIsCompressing(false);
      }
    }
  };
  
  return (
    <div className="space-y-4">
      <form className="space-y-4" action={formAction}>
        {state?.error && <AlertError>{state?.message}</AlertError>}
        {!state?.error && state?.message.length > 0 && <AlertSuccess>{state?.message}</AlertSuccess>}
        
        <div>
          <label htmlFor="file" className="block text-sm font-medium mb-2">
            Choose new avatar image
          </label>
          <Input 
            ref={fileInputRef}
            type="file" 
            name="file" 
            id="file" 
            accept="image/jpeg,image/jpg,image/png,image/gif,image/webp"
            required
            onChange={handleFileChange}
          />
          <p className="text-sm text-gray-500 mt-1">
            Supported formats: JPEG, PNG, GIF, WebP. Max size: 10MB.
            {isCompressing && <span className="text-blue-600"> Compressing image...</span>}
          </p>
          <p className="text-xs text-gray-400 mt-1">
            Large images will be automatically resized to 400px and compressed for faster upload.
          </p>
        </div>
        
        {previewUrl && (
          <div className="mt-4">
            <label className="block text-sm font-medium mb-2">Preview:</label>
            <div className="w-32 h-32 rounded-full overflow-hidden bg-gray-100 dark:bg-gray-800">
              <img 
                src={previewUrl} 
                alt="Avatar preview" 
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        )}
        
        <SubmitButton disabled={isCompressing}>
          {isCompressing ? 'Compressing...' : 'Upload Avatar'}
        </SubmitButton>
      </form>
    </div>
  )
}