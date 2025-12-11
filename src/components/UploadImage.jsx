import React, { useState } from "react";

const UploadImage = ({ onUpload, onLoadingChange, acceptTypes = "image/*,video/*,.pdf,.doc,.docx" }) => {
  const [fileUrl, setFileUrl] = useState(null);
  const [loading, setLoading] = useState(false);
  const [fileType, setFileType] = useState(null);

  const cloudName = import.meta.env.VITE_CLOUD_NAME;
  const uploadPreset = import.meta.env.VITE_UPLOAD_PRESET;

  // Detect file type
  const detectFileType = (file) => {
    const type = file.type;
    if (type.startsWith('image/')) return 'image';
    if (type.startsWith('video/')) return 'video';
    return 'document';
  };

  const handleUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const detectedType = detectFileType(file);
    setFileType(detectedType);
    setLoading(true);
    if (onLoadingChange) onLoadingChange(true);

    const data = new FormData();
    data.append("file", file);
    data.append("upload_preset", uploadPreset);

    try {
      // Use appropriate Cloudinary endpoint based on file type
      let uploadEndpoint = `https://api.cloudinary.com/v1_1/${cloudName}/`;
      if (detectedType === 'video') {
        uploadEndpoint += 'video/upload';
      } else if (detectedType === 'image') {
        uploadEndpoint += 'image/upload';
      } else {
        uploadEndpoint += 'raw/upload'; // For documents
      }

      const res = await fetch(uploadEndpoint, {
        method: "POST",
        body: data,
      });

      const uploaded = await res.json();
      setFileUrl(uploaded.secure_url);
      setLoading(false);
      if (onLoadingChange) onLoadingChange(false);

      if (onUpload) {
        onUpload(uploaded.secure_url, detectedType);
      }
    } catch (error) {
      console.error("Upload failed", error);
      setLoading(false);
      if (onLoadingChange) onLoadingChange(false);
    }
  };

  return (
    <div className="flex flex-col gap-2">
      <input
        type="file"
        accept={acceptTypes}
        onChange={handleUpload}
        className="block w-full text-sm text-gray-500
          file:mr-4 file:py-2 file:px-4
          file:rounded-full file:border-0
          file:text-sm file:font-semibold
          file:bg-orange-50 file:text-[#FF8211]
          hover:file:bg-orange-100
        "
      />

      {loading && <p className="text-sm text-gray-500">Uploading...</p>}

      {fileUrl && (
        <div className="mt-2">
          <p className="text-xs text-green-600 mb-1">Upload completed!</p>
          {fileType === 'image' && (
            <img src={fileUrl} alt="Uploaded" className="h-20 w-auto rounded-md border border-gray-200 object-cover" />
          )}
          {fileType === 'video' && (
            <video src={fileUrl} className="h-20 w-auto rounded-md border border-gray-200" controls />
          )}
          {fileType === 'document' && (
            <a href={fileUrl} target="_blank" rel="noopener noreferrer" className="text-xs text-blue-600 hover:underline">
              View Document
            </a>
          )}
        </div>
      )}
    </div>
  );
};

export default UploadImage;
