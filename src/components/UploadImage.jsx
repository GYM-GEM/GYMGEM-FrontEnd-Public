import React, { useState } from "react";

const UploadImage = ({ onUpload, onLoadingChange }) => {
  const [imageUrl, setImageUrl] = useState(null);
  const [loading, setLoading] = useState(false);

  const cloudName = import.meta.env.VITE_CLOUD_NAME;
  const uploadPreset = import.meta.env.VITE_UPLOAD_PRESET;

  const handleUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setLoading(true);
    if (onLoadingChange) onLoadingChange(true);

    const data = new FormData();
    data.append("file", file);
    data.append("upload_preset", uploadPreset);

    try {
      const res = await fetch(
        `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
        {
          method: "POST",
          body: data,
        }
      );

      const uploaded = await res.json();
      setImageUrl(uploaded.secure_url);
      setLoading(false);
      if (onLoadingChange) onLoadingChange(false);

      if (onUpload) {
        onUpload(uploaded.secure_url);
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

      {imageUrl && (
        <div className="mt-2">
          <p className="text-xs text-green-600 mb-1">Upload completed!</p>
          <img src={imageUrl} alt="Uploaded" className="h-20 w-auto rounded-md border border-gray-200 object-cover" />
        </div>
      )}
    </div>
  );
};

export default UploadImage;
