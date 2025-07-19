import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import axios from 'axios';

export default function AdminsClaims() {
  const location = useLocation();
  const adminClaims = location.state?.adminClaims;

  const [claims, setClaims] = useState(
    adminClaims?.userClaims?.map((claim) => ({
      ...claim,
      value: Boolean(claim.value),
    })) || []
  );
  const [saving, setSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  if (!adminClaims) {
    return (
      <div className="min-h-screen flex items-center justify-center text-xl text-red-600">
        No claims data found.
      </div>
    );
  }

  const handleToggle = (idx) => {
    setClaims((prev) =>
      prev.map((c, i) => (i === idx ? { ...c, value: !c.value } : c))
    );
  };

  const handleSave = async () => {
    setSaving(true);
    setSuccessMsg('');
    setErrorMsg('');
    try {
      const res = await axios.put('https://e-learn-v1.runasp.net/api/Authorize', {
        userId: adminClaims.userId,
        userClaims: claims.map((c) => ({
          type: c.type,
          value: c.value,
        })),
      });
      if (res.data && res.data.succeeded) {
        setSuccessMsg('Claims updated successfully!');
      } else {
        setErrorMsg('Failed to update claims.');
      }
    } catch (err) {
      setErrorMsg('Failed to update claims.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-blue-100 flex flex-col items-center py-10 px-4">
      <div className="bg-white rounded-2xl shadow-lg p-8 w-full max-w-lg">
        <h2 className="text-2xl font-bold text-indigo-700 mb-6 text-center">
          Admin Claims (ID: {adminClaims.userId})
        </h2>
        <div className="space-y-4">
          {claims.map((claim, idx) => (
            <div
              key={claim.type}
              className="flex items-center justify-between bg-indigo-50 rounded-lg px-4 py-3"
            >
              <span className="font-semibold text-indigo-700">{claim.type}</span>
              <button
                className={`w-16 py-1 rounded-full font-bold transition ${
                  claim.value
                    ? 'bg-green-500 text-white'
                    : 'bg-gray-300 text-gray-700'
                }`}
                onClick={() => handleToggle(idx)}
                disabled={saving}
              >
                {claim.value ? 'True' : 'False'}
              </button>
            </div>
          ))}
        </div>
        <button
          className={`w-full mt-8 py-2 rounded-lg font-bold text-white bg-indigo-600 hover:bg-indigo-700 transition ${
            saving ? 'opacity-60 cursor-not-allowed' : ''
          }`}
          onClick={handleSave}
          disabled={saving}
        >
          {saving ? 'Saving...' : 'Save Changes'}
        </button>
        {successMsg && (
          <div className="mt-4 text-green-600 font-semibold text-center">{successMsg}</div>
        )}
        {errorMsg && (
          <div className="mt-4 text-red-600 font-semibold text-center">{errorMsg}</div>
        )}
      </div>
    </div>
  );
}