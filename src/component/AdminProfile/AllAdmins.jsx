import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'

export default function AllAdmins() {
  const [admins, setAdmins] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [gettingId, setGettingId] = useState(null)
  const navigate = useNavigate()

  useEffect(() => {
    const fetchAdmins = async () => {
      try {
        setLoading(true)
        const res = await axios.get('https://e-learn-v1.runasp.net/api/Authorize/admins')
        setAdmins(res.data?.data || [])
      } catch (err) {
        setError('Failed to fetch admins.')
      } finally {
        setLoading(false)
      }
    }
    fetchAdmins()
  }, [])

  // Handler for the "Get" button
  const handleGetClaims = async (adminId) => {
    setGettingId(adminId)
    try {
      const res = await axios.get(`https://e-learn-v1.runasp.net/api/Authorize?userId=${adminId}`)
      if (res.data && res.data.succeeded) {
        // Pass the data to the next page using state
        navigate('/admin-claims', { state: { adminClaims: res.data.data } })
      } else {
        alert('Failed to get admin claims.')
      }
    } catch (err) {
      alert('Failed to get admin claims.')
    } finally {
      setGettingId(null)
    }
  }

  return (
    <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-lg p-8 mt-12 mb-12">
      <h2 className="text-3xl font-bold text-center text-violet-700 mb-8">All Admins</h2>
      {loading ? (
        <div className="flex justify-center py-10">
          <span className="text-violet-600 text-lg font-semibold">Loading...</span>
        </div>
      ) : error ? (
        <div className="text-center text-red-500 py-6">{error}</div>
      ) : admins.length === 0 ? (
        <div className="text-center text-gray-500 py-6">No Admins Found</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full border border-gray-200 rounded-xl overflow-hidden">
            <thead className="bg-violet-100">
              <tr>
                <th className="py-3 px-6 text-left text-violet-700 font-semibold">#</th>
                <th className="py-3 px-6 text-left text-violet-700 font-semibold">Admin Name</th>
                <th className="py-3 px-6 text-left text-violet-700 font-semibold">Admin ID</th>
                <th className="py-3 px-6 text-left text-violet-700 font-semibold"></th>
              </tr>
            </thead>
            <tbody>
              {admins.map((admin, idx) => (
                <tr key={admin.id} className="hover:bg-violet-50 transition">
                  <td className="py-3 px-6">{idx + 1}</td>
                  <td className="py-3 px-6 font-medium text-gray-800">{admin.name}</td>
                  <td className="py-3 px-6 text-violet-600">{admin.id}</td>
                  <td className="py-3 px-6">
                    <button
                      className={`px-4 py-1 rounded-lg bg-violet-600 text-white font-semibold hover:bg-violet-700 transition ${gettingId === admin.id ? 'opacity-60 cursor-not-allowed' : ''}`}
                      disabled={gettingId === admin.id}
                      onClick={() => handleGetClaims(admin.id)}
                    >
                      {gettingId === admin.id ? 'Loading...' : 'Get'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}