import React, { useEffect, useState } from 'react';
import reportService from '../../services/reportService';

const summaryCards = [
  { key: 'totalUsers', label: 'Total Users', color: 'bg-blue-600', icon: '👥' },
  { key: 'totalStudents', label: 'Students', color: 'bg-green-600', icon: '🎓' },
  { key: 'totalTeachers', label: 'Teachers', color: 'bg-yellow-500', icon: '🧑‍🏫' },
  { key: 'totalCourses', label: 'Courses', color: 'bg-purple-600', icon: '📚' },
  { key: 'newUsersLast7Days', label: 'New Users (7d)', color: 'bg-pink-600', icon: '🆕' },
  { key: 'revenueThisMonth', label: 'Revenue (This Month)', color: 'bg-indigo-600', icon: '💰', isCurrency: true },
  { key: 'totalPayments', label: 'Total Payments', color: 'bg-orange-600', icon: '💳' },
];

const SectionDivider = ({ icon }) => (
  <div className="flex items-center my-10">
    <div className="flex-1 border-t border-gray-300"></div>
    <span className="mx-4 text-2xl text-gray-400">{icon}</span>
    <div className="flex-1 border-t border-gray-300"></div>
  </div>
);

const SectionTitle = ({ icon, children }) => (
  <h2 className="text-2xl font-bold flex items-center gap-2 mb-4 mt-10 text-gray-800">
    <span className="text-xl">{icon}</span> {children}
  </h2>
);

const EmptyState = ({ message }) => (
  <div className="flex flex-col items-center justify-center py-8 text-gray-400">
    <span className="text-4xl mb-2">📭</span>
    <span>{message}</span>
  </div>
);

const Card = ({ children }) => (
  <div className="bg-white rounded-2xl shadow-xl p-6 mb-10 overflow-x-auto">{children}</div>
);

const Badge = ({ value, type }) => {
  let color = 'bg-gray-200 text-gray-700';
  if (type === 'revenue') color = value > 0 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-600';
  if (type === 'score') color = value >= 90 ? 'bg-indigo-100 text-indigo-700' : 'bg-gray-100 text-gray-700';
  if (type === 'count') color = value === 0 ? 'bg-red-100 text-red-600' : 'bg-blue-100 text-blue-700';
  return <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${color}`}>{value}</span>;
};

const EnhancedTable = ({ columns, data, rowKey, emptyMessage, ariaLabel, highlightKey }) => {
  // Find the highest value for highlightKey (if provided)
  let maxValue = null;
  if (highlightKey && data.length > 0) {
    maxValue = Math.max(...data.map(row => Number(row[highlightKey]) || 0));
  }
  return (
    <div className="overflow-x-auto rounded-2xl border border-gray-200 shadow-lg">
      <table className="min-w-full text-left text-sm font-sans font-medium">
        <thead>
          <tr className="bg-gray-100">
            {columns.map((col, idx) => (
              <th
                key={col.key}
                className={`px-4 py-3 whitespace-nowrap font-semibold text-gray-700 ${idx === 0 ? 'rounded-tl-2xl' : ''} ${idx === columns.length - 1 ? 'rounded-tr-2xl' : ''}`}
                title={col.tooltip || col.label}
                aria-label={col.ariaLabel || col.label}
              >
                {col.icon && <span className="mr-1">{col.icon}</span>}
                {col.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.length === 0 ? (
            <tr>
              <td colSpan={columns.length} className="text-center py-8 text-gray-400">
                <span className="text-4xl mb-2">📭</span>
                <div>{emptyMessage}</div>
              </td>
            </tr>
          ) : (
            data.map((row, idx) => (
              <tr
                key={row[rowKey] || idx}
                className={`${idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'} border-b border-gray-200`}
              >
                {columns.map((col, cidx) => {
                  let cell = row[col.key];
                  let badgeType = undefined;
                  let badge = null;
                  if (col.key === 'revenue') badgeType = 'revenue';
                  if (col.key === 'averageScore') badgeType = 'score';
                  if (col.key === 'studentsCount' || col.key === 'studentCount') badgeType = 'count';
                  // No highlight or animation
                  badge = badgeType ? <Badge value={cell} type={badgeType} /> : cell;
                  return (
                    <td
                      key={col.key}
                      className={`border px-4 py-3 max-w-xs truncate ${cidx === 0 ? 'rounded-bl-2xl' : ''} ${cidx === columns.length - 1 ? 'rounded-br-2xl' : ''}`}
                      title={cell}
                    >
                      {badge}
                    </td>
                  );
                })}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

const Report = () => {
  const [summary, setSummary] = useState(null);
  const [averageScores, setAverageScores] = useState([]);
  const [courseEnrollments, setCourseEnrollments] = useState([]);
  const [weeklyNewStudents, setWeeklyNewStudents] = useState([]);
  const [courseRevenues, setCourseRevenues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const [summaryData, scoresData, enrollmentsData, weeklyData, revenuesData] = await Promise.all([
          reportService.getSummary(),
          reportService.getAverageStudentScores(),
          reportService.getCourseEnrollments(),
          reportService.getWeeklyNewStudents(),
          reportService.getCourseRevenues(),
        ]);
        setSummary(summaryData);
        setAverageScores(scoresData);
        setCourseEnrollments(enrollmentsData);
        setWeeklyNewStudents(weeklyData);
        setCourseRevenues(revenuesData);
      } catch (err) {
        setError('Failed to fetch report data.');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) return <div className="flex justify-center items-center h-64 text-xl">Loading report...</div>;
  if (error) return <div className="text-red-600 text-center py-8">{error}</div>;

  return (
    <div className="p-4 sm:p-8 max-w-6xl mx-auto bg-gray-100 min-h-screen">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-center justify-between mb-8 gap-4">
        <div>
          <h1 className="text-4xl font-extrabold text-indigo-700 flex items-center gap-3">
            <span>📊</span> Admin Reports
          </h1>
          <p className="text-gray-500 mt-2 text-lg">Platform analytics and insights for administrators</p>
        </div>
      </div>

      {/* Summary Cards */}
      {summary && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mb-10">
          {summaryCards.map((card) => (
            <div
              key={card.key}
              className={`rounded-2xl shadow-xl flex flex-col items-center p-6 ${card.color} text-white`}
            >
              <span className="text-4xl mb-2 drop-shadow-lg">{card.icon}</span>
              <div className="text-lg font-semibold mb-1 drop-shadow-sm">{card.label}</div>
              <div className="text-3xl font-extrabold drop-shadow-lg">
                {card.isCurrency ? `$${summary[card.key]}` : summary[card.key]}
              </div>
            </div>
          ))}
        </div>
      )}

      <SectionDivider icon="📈" />
      <SectionTitle icon="📈">Average Student Scores</SectionTitle>
      <Card>
        <EnhancedTable
          columns={[
            { key: 'studentId', label: 'Student ID', icon: '🆔' },
            { key: 'studentName', label: 'Student Name', icon: '👤' },
            { key: 'averageScore', label: 'Average Score', icon: '📊' },
          ]}
          data={averageScores}
          rowKey="studentId"
          emptyMessage="No student score data available."
          ariaLabel="Average Student Scores Table"
          highlightKey="averageScore"
        />
      </Card>

      <SectionDivider icon="📝" />
      <SectionTitle icon="📝">Course Enrollments</SectionTitle>
      <Card>
        <EnhancedTable
          columns={[
            { key: 'courseId', label: 'Course ID', icon: '🆔' },
            { key: 'courseName', label: 'Course Name', icon: '📚' },
            { key: 'studentsCount', label: 'Students Count', icon: '👥' },
          ]}
          data={courseEnrollments}
          rowKey="courseId"
          emptyMessage="No course enrollment data available."
          ariaLabel="Course Enrollments Table"
          highlightKey="studentsCount"
        />
      </Card>

      <SectionDivider icon="📅" />
      <SectionTitle icon="📅">Weekly New Students</SectionTitle>
      <Card>
        <EnhancedTable
          columns={[
            { key: 'week', label: 'Week', icon: '📆' },
            { key: 'studentCount', label: 'Student Count', icon: '👨‍🎓' },
          ]}
          data={weeklyNewStudents}
          rowKey="week"
          emptyMessage="No weekly new student data available."
          ariaLabel="Weekly New Students Table"
          highlightKey="studentCount"
        />
      </Card>

      <SectionDivider icon="💵" />
      <SectionTitle icon="💵">Course Revenues</SectionTitle>
      <Card>
        <EnhancedTable
          columns={[
            { key: 'courseId', label: 'Course ID', icon: '🆔' },
            { key: 'courseName', label: 'Course Name', icon: '📚' },
            { key: 'revenue', label: 'Revenue', icon: '💰' },
          ]}
          data={courseRevenues}
          rowKey="courseId"
          emptyMessage="No course revenue data available."
          ariaLabel="Course Revenues Table"
          highlightKey="revenue"
        />
      </Card>
    </div>
  );
};

export default Report;
