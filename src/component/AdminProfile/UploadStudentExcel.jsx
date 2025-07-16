import React, { useState } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';

const UploadStudentExcel = () => {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    if (!file) {
      toast.error('Please select an Excel file to upload.');
      setErrorMsg('Please select an Excel file to upload.');
      return;
    }
    const formData = new FormData();
    formData.append('file', file);
    setUploading(true);
    try {
      const token = localStorage.getItem('token') || localStorage.getItem('JWTToken');
      const response = await axios.post(
        'https://e-learn-v1.runasp.net/api/Student/UploadExcel/upload',
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
        }
      );
      toast.success('Students uploaded successfully!');
      setFile(null);
      setErrorMsg('');
    } catch (error) {
      const msg = error.response?.data?.message || 'Failed to upload students. Please check your file.';
      toast.error(msg);
      setErrorMsg(msg);
    } finally {
      setUploading(false);
    }
  };

  const handleDownloadSample = async () => {
    try {
      const token = localStorage.getItem('token') || localStorage.getItem('JWTToken');
      const response = await axios.get(
        'https://e-learn-v1.runasp.net/api/Student/DownloadExcel/download/sample',
        {
          responseType: 'blob',
          headers: {
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
        }
      );
      // Create a link to download the file
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'students-sample.xlsx');
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      toast.error('Failed to download sample file.');
    }
  };

  return (
    <>
      <form onSubmit={handleUpload} className="flex flex-col sm:flex-row items-center gap-4 bg-white p-4 rounded shadow mb-2">
        <input
          type="file"
          accept=".xlsx,.xls"
          onChange={handleFileChange}
          disabled={uploading}
          className="form-input border border-gray-300 rounded p-2"
        />
        <button
          type="submit"
          disabled={uploading || !file}
          className="bg-violet-600 text-white px-4 py-2 rounded hover:bg-violet-700 transition disabled:opacity-50"
        >
          {uploading ? 'Uploading...' : 'Upload Excel'}
        </button>
      </form>
      {errorMsg && (
        <div className="text-red-600 bg-red-100 border border-red-300 rounded px-4 py-2 mb-2">
          {errorMsg}
        </div>
      )}
      <button
        type="button"
        onClick={handleDownloadSample}
        className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition mb-4"
      >
        Download Sample Excel
      </button>
    </>
  );
};

export default UploadStudentExcel; 