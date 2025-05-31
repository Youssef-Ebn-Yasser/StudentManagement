import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

const API_BASE_URL = "https://e-learn-v1.runasp.net/api/zoom";

export default function MeetingSdata() {
  const { courseId } = useParams();
  const [meetings, setMeetings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchMeetings = async () => {
      setLoading(true);
      setError("");
      try {
        const response = await fetch(`${API_BASE_URL}/meetings?courseId=${courseId}`);
        const result = await response.json();
        if (result.succeeded && Array.isArray(result.data)) {
          setMeetings(result.data);
        } else {
          setMeetings([]);
        }
      } catch (err) {
        setError("Failed to load meetings.");
      } finally {
        setLoading(false);
      }
    };
    fetchMeetings();
  }, [courseId]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-blue-100 to-purple-100 p-6">
      <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-2xl p-8">
        <h1 className="text-3xl font-extrabold text-center text-indigo-700 mb-8">
          Course Meetings
        </h1>
        {loading ? (
          <div className="text-center text-lg text-indigo-600 font-semibold">Loading meetings...</div>
        ) : error ? (
          <div className="text-center text-red-600 font-semibold">{error}</div>
        ) : meetings.length === 0 ? (
          <div className="text-center text-gray-500 text-lg font-semibold">No meetings yet</div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2">
            {meetings.map((meeting) => (
              <div
                key={meeting.zoomMeetingId}
                className="bg-gradient-to-tr from-indigo-50 via-blue-50 to-purple-50 border border-indigo-200 rounded-lg shadow-lg p-6 hover:shadow-2xl transition"
              >
                <h2 className="text-xl font-bold text-indigo-800 mb-2">{meeting.topic}</h2>
                <p className="mb-1">
                  <span className="font-semibold text-gray-700">Meeting ID:</span>{" "}
                  <span className="text-gray-900">{meeting.zoomMeetingId}</span>
                </p>
                <p className="mb-1">
                  <span className="font-semibold text-gray-700">Type:</span>{" "}
                  <span className="text-blue-700">
                    {meeting.type === 1
                      ? "Instant"
                      : meeting.type === 2
                      ? "Scheduled"
                      : meeting.type === 8
                      ? "Recurring"
                      : "Unknown"}
                  </span>
                </p>
                {meeting.startTime && (
                  <p className="mb-1">
                    <span className="font-semibold text-gray-700">Start Time:</span>{" "}
                    <span className="text-gray-900">
                      {new Date(meeting.startTime).toLocaleString()}
                    </span>
                  </p>
                )}
                <p className="mb-1">
                  <span className="font-semibold text-gray-700">Duration:</span>{" "}
                  <span className="text-gray-900">{meeting.duration} min</span>
                </p>
                {meeting.password && (
                  <p className="mb-1">
                    <span className="font-semibold text-gray-700">Password:</span>{" "}
                    <span className="text-gray-900">{meeting.password}</span>
                  </p>
                )}
                <div className="mt-4 flex justify-between items-center">
                  <a
                    href={meeting.joinUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block px-5 py-2 bg-indigo-600 text-white font-bold rounded-full shadow hover:bg-indigo-700 transition"
                  >
                    Join Meeting
                  </a>
                  <span className="text-xs text-gray-400">
                    {meeting.type === 8 ? "Recurring" : ""}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}