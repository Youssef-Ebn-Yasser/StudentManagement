import React, { useEffect, useState } from 'react';
import reportService from '../../services/reportService';
import { useTranslation } from 'react-i18next'




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
  const { t } = useTranslation();

  const [summary, setSummary] = useState(null);
  const [averageScores, setAverageScores] = useState([]);
  const [courseEnrollments, setCourseEnrollments] = useState([]);
  const [weeklyNewStudents, setWeeklyNewStudents] = useState([]);
  const [courseRevenues, setCourseRevenues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const summaryCards = [
  { key: 'totalUsers', label: t("total-users"), color: 'bg-blue-600', icon: '👥' },
  { key: 'totalStudents', label: t('Students'), color: 'bg-green-600', icon: '🎓' },
  { key: 'totalTeachers', label: t('Teachers'), color: 'bg-yellow-500', icon: '🧑‍🏫' },
  { key: 'totalCourses', label: t('Courses'), color: 'bg-purple-600', icon: '📚' },
  { key: 'newUsersLast7Days', label: t("new-users-7d"), color: 'bg-pink-600', icon: '🆕' },
  { key: 'revenueThisMonth', label: t("revenue-this-month"), color: 'bg-indigo-600', icon: '💰', isCurrency: true },
  { key: 'totalPayments', label: t("total-payments"), color: 'bg-orange-600', icon: '💳' },
];

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
            <span>📊</span> {t("admin-reports")}
          </h1>
          <p className="text-gray-500 mt-2 text-lg">{t("platform-analytics-description")}</p>
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
      <SectionTitle icon="📈">{t("average-student-scores")}</SectionTitle>
      <Card>
        <EnhancedTable
          columns={[
            { key: 'studentId', label: t("student-id"), icon: '🆔' },
            { key: 'studentName', label: t("student-name"), icon: '👤' },
            { key: 'averageScore', label: t("average-score"), icon: '📊' },
          ]}
          data={averageScores}
          rowKey="studentId"
          emptyMessage={t("no-student-score-data")}
          ariaLabel="Average Student Scores Table"
          highlightKey="averageScore"
        />
      </Card>

      <SectionDivider icon="📝" />
      <SectionTitle icon="📝">{t("course-enrollments")}</SectionTitle>
      <Card>
        <EnhancedTable
          columns={[
            { key: 'courseId', label: t("course-id"), icon: '🆔' },
            { key: 'courseName', label: t("course-name"), icon: '📚' },
            { key: 'studentsCount', label: t("students-count"), icon: '👥' },
          ]}
          data={courseEnrollments}
          rowKey="courseId"
          emptyMessage={t("no-course-enrollment-data")}
          ariaLabel="Course Enrollments Table"
          highlightKey="studentsCount"
        />
      </Card>

      <SectionDivider icon="📅" />
      <SectionTitle icon="📅">{t("weekly-new-students")}</SectionTitle>
      <Card>
        <EnhancedTable
          columns={[
            { key: 'week', label: t("week"), icon: '📆' },
            { key: 'studentCount', label: t("student-count"), icon: '👨‍🎓' },
          ]}
          data={weeklyNewStudents}
          rowKey="week"
          emptyMessage={t("no-weekly-student-data")}
          ariaLabel="Weekly New Students Table"
          highlightKey="studentCount"
        />
      </Card>

      <SectionDivider icon="💵" />
      <SectionTitle icon="💵">{t("course-revenues")} </SectionTitle>
      <Card>
        <EnhancedTable
          columns={[
            { key: 'courseId', label: t("course-id"), icon: '🆔' },
            { key: 'courseName', label: t("course-name"), icon: '📚' },
            { key: 'revenue', label: t("revenue"), icon: '💰' },
          ]}
          data={courseRevenues}
          rowKey="courseId"
          emptyMessage={t("no-course-revenue-data")}
          ariaLabel="Course Revenues Table"
          highlightKey="revenue"
        />
      </Card>
    </div>
  );
};

export default Report;
