import { useState } from "react";

const NotificationsSection = ({ onSave }) => {
  const [notifications, setNotifications] = useState({
    buyCourse: false,
    writeReview: true,
    commentedOnLecture: false,
    downloadLectureNotes: true,
    repliedOnComment: true,
    dailyVisits: false,
    downloadLectureAttach: true,
  });

  const handleCheckboxChange = (e) => {
    const { name, checked } = e.target;
    setNotifications({
      ...notifications,
      [name]: checked,
    });
  };

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Notifications</h2>
      
      <form className="space-y-4">
        <div className="flex items-center">
          <input
            type="checkbox"
            id="buyCourse"
            name="buyCourse"
            checked={notifications.buyCourse}
            onChange={handleCheckboxChange}
            className="w-5 h-5 text-orange-500 rounded focus:ring-0 focus:ring-offset-0"
          />
          <label htmlFor="buyCourse" className="ml-3 text-sm text-gray-700">
            I want to know who buy my course.
          </label>
        </div>

        <div className="flex items-center">
          <input
            type="checkbox"
            id="writeReview"
            name="writeReview"
            checked={notifications.writeReview}
            onChange={handleCheckboxChange}
            className="w-5 h-5 text-orange-500 rounded focus:ring-0 focus:ring-offset-0"
          />
          <label htmlFor="writeReview" className="ml-3 text-sm text-gray-700">
            I want to know who write a review on my course.
          </label>
        </div>

        <div className="flex items-center">
          <input
            type="checkbox"
            id="commentedOnLecture"
            name="commentedOnLecture"
            checked={notifications.commentedOnLecture}
            onChange={handleCheckboxChange}
            className="w-5 h-5 text-orange-500 rounded focus:ring-0 focus:ring-offset-0"
          />
          <label htmlFor="commentedOnLecture" className="ml-3 text-sm text-gray-700">
            I want to know who commented on my lecture.
          </label>
        </div>

        <div className="flex items-center">
          <input
            type="checkbox"
            id="downloadLectureNotes"
            name="downloadLectureNotes"
            checked={notifications.downloadLectureNotes}
            onChange={handleCheckboxChange}
            className="w-5 h-5 text-orange-500 rounded focus:ring-0 focus:ring-offset-0"
          />
          <label htmlFor="downloadLectureNotes" className="ml-3 text-sm text-gray-700">
            I want to know who download my lecture notes.
          </label>
        </div>

        <div className="flex items-center">
          <input
            type="checkbox"
            id="repliedOnComment"
            name="repliedOnComment"
            checked={notifications.repliedOnComment}
            onChange={handleCheckboxChange}
            className="w-5 h-5 text-orange-500 rounded focus:ring-0 focus:ring-offset-0"
          />
          <label htmlFor="repliedOnComment" className="ml-3 text-sm text-gray-700">
            I want to know who replied on my comment.
          </label>
        </div>

        <div className="flex items-center">
          <input
            type="checkbox"
            id="dailyVisits"
            name="dailyVisits"
            checked={notifications.dailyVisits}
            onChange={handleCheckboxChange}
            className="w-5 h-5 text-orange-500 rounded focus:ring-0 focus:ring-offset-0"
          />
          <label htmlFor="dailyVisits" className="ml-3 text-sm text-gray-700">
            I want to know daily how many people visited my profile.
          </label>
        </div>

        <div className="flex items-center">
          <input
            type="checkbox"
            id="downloadLectureAttach"
            name="downloadLectureAttach"
            checked={notifications.downloadLectureAttach}
            onChange={handleCheckboxChange}
            className="w-5 h-5 text-orange-500 rounded focus:ring-0 focus:ring-offset-0"
          />
          <label htmlFor="downloadLectureAttach" className="ml-3 text-sm text-gray-700">
            I want to know who download my lecture attach file.
          </label>
        </div>

        <div className="pt-4">
          <button
            onClick={onSave}
            className="px-6 py-2 bg-[#4F39F6] hover:bg-[#432DD7] cursor-pointer text-white font-medium rounded-md transition-colors"
          >
            Save Changes
          </button>
        </div>
      </form>
    </div>
  );
};

export default NotificationsSection;
