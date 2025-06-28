import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { quizService } from '@/services/quizService';
import { 
  Box, 
  Typography, 
  Paper, 
  CircularProgress, 
  Alert, 
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TableRow,
  Grid,
  Card,
  CardContent,
  useTheme
} from '@mui/material';
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from 'recharts';
import { useTranslation } from 'react-i18next';

const COLORS = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEEAD'];

const LessonQuizStats = () => {
  const params = useParams();
  const { lessonId } = params;
  console.log('useParams() output:', params);
  console.log('Lesson ID from useParams:', lessonId);
  console.log('Current URL Pathname:', window.location.pathname);
  console.log('Current Full URL:', window.location.href);

  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const theme = useTheme();
  const { t } = useTranslation();

  useEffect(() => {
    const fetchStats = async () => {
      if (!lessonId) {
        setError('Lesson ID is missing from URL. Please ensure you clicked a valid lesson link.');
        setLoading(false);
        return;
      }
      try {
        setLoading(true);
        const response = await quizService.getLessonQuizStats(lessonId);
        console.log('Full API Response:', response);
        console.log('Response Data:', response.data);
        console.log('Stats Data:', response.data?.data);
        
        if (response.data?.data) {
          console.log('Response Structure:', {
            data: response.data,
            dataData: response.data.data,
            keys: Object.keys(response.data.data)
          });

          const data = {
            ...response.data.data,
            studentSubmissions: response.data.data.studentSubmissions || []
          };

          console.log('Processed Data:', data);
          setStats(data);
        } else {
          console.error('Invalid response format:', response);
          setError('Invalid data format received from server');
          setStats(null);
        }
        setError(null);
      } catch (err) {
        console.error('Error fetching quiz stats:', err);
        setError('Failed to load quiz statistics. Please try again later.');
        setStats(null);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [lessonId]);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress size={60} thickness={4} />
      </Box>
    );
  }

  if (error) {
    return (
      <Box p={3}>
        <Alert severity="error" sx={{ fontSize: '1.1rem' }}>{error}</Alert>
      </Box>
    );
  }

  if (!stats) {
    return (
      <Box p={3}>
        <Alert severity="info" sx={{ fontSize: '1.1rem' }}>{t('no-quiz-stats-lesson')}</Alert>
      </Box>
    );
  }

  // Calculate total statistics
  const totalStats = {
    totalQuizzes: stats.numberOfQuizzes || 0,
    totalSubmissions: stats.quizzes?.reduce((sum, quiz) => sum + (quiz.numberOfStudentSubmit || 0), 0) || 0,
    totalStudentsUnder50: stats.quizzes?.reduce((sum, quiz) => sum + (quiz.numberOfStudentUnder50 || 0), 0) || 0,
    totalStudentsOver70: stats.quizzes?.reduce((sum, quiz) => sum + (quiz.numberOfStudentOver70 || 0), 0) || 0,
    totalStudentsWith100: stats.quizzes?.reduce((sum, quiz) => sum + (quiz.numberOfStudentWith100 || 0), 0) || 0
  };

  // Prepare data for the pie chart
  const performanceData = [
    { name: t('under-50'), value: totalStats.totalStudentsUnder50 },
    { name: t('over-70'), value: totalStats.totalStudentsOver70 },
    { name: t('perfect-score'), value: totalStats.totalStudentsWith100 }
  ];

  const StatCard = ({ title, value, color }) => (
    <Card elevation={3} sx={{ 
      height: '100%',
      transition: 'transform 0.2s',
      '&:hover': {
        transform: 'translateY(-5px)',
        boxShadow: theme.shadows[8]
      }
    }}>
      <CardContent>
        <Typography variant="h6" color="text.secondary" gutterBottom>
          {t(title)}
        </Typography>
        <Typography variant="h3" component="div" sx={{ color: color || theme.palette.primary.main }}>
          {value}
        </Typography>
      </CardContent>
    </Card>
  );

  return (
    <Box p={4} sx={{ backgroundColor: '#f5f5f5', minHeight: '100vh' }}>
      <Typography variant="h3" gutterBottom sx={{ 
        color: theme.palette.primary.main,
        fontWeight: 'bold',
        mb: 4,
        textAlign: 'center'
      }}>
        {stats.lessonName} - {t("quiz-statistics")}
      </Typography>

      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={4} lg={2.4}>
          <StatCard 
            title="total-quizzes" 
            value={totalStats.totalQuizzes}
            color={COLORS[0]}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4} lg={2.4}>
          <StatCard 
            title="total-submissions" 
            value={totalStats.totalSubmissions}
            color={COLORS[1]}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4} lg={2.4}>
          <StatCard 
            title="students-under-50" 
            value={totalStats.totalStudentsUnder50}
            color={COLORS[2]}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4} lg={2.4}>
          <StatCard 
            title="students-over-70" 
            value={totalStats.totalStudentsOver70}
            color={COLORS[3]}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4} lg={2.4}>
          <StatCard 
            title="students-perfect-score" 
            value={totalStats.totalStudentsWith100}
            color={COLORS[4]}
          />
        </Grid>
      </Grid>

      <Paper elevation={3} sx={{ p: 4, mb: 4, borderRadius: 2 }}>
        <Typography variant="h5" gutterBottom sx={{ color: theme.palette.primary.main, mb: 3 }}>
          {t("performance-distribution")}
        </Typography>
        <Box height={400}>
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={performanceData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                outerRadius={150}
                fill="#8884d8"
                dataKey="value"
              >
                {performanceData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </Box>
      </Paper>

      {/* Quiz Details Section */}
      <Paper elevation={3} sx={{ p: 4, mb: 4, borderRadius: 2, backgroundColor: '#ffffff' }}>
        <Typography variant="h5" gutterBottom sx={{ 
          color: theme.palette.primary.main,
          mb: 3
        }}>
          {t("quiz-details")}
        </Typography>
        
        {(stats.quizzes || []).map((quiz, quizIndex) => (
          <Box key={quizIndex} sx={{ mb: 4 }}>
            {/* Quiz Summary */}
            <Box sx={{ mb: 2, p: 2, backgroundColor: '#f8f9fa', borderRadius: 1 }}>
              <Typography variant="h6" sx={{ color: theme.palette.primary.main, mb: 1 }}>
                {quiz.quizName}
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={6} sm={4} md={2}>
                  <Typography variant="subtitle2" color="text.secondary">{t("submissions")}</Typography>
                  <Typography variant="h6">{quiz.numberOfStudentSubmit || 0}</Typography>
                </Grid>
                <Grid item xs={6} sm={4} md={2}>
                  <Typography variant="subtitle2" color="text.secondary">{t("submission-rate")}</Typography>
                  <Typography variant="h6">{(quiz.percentageOfSubmit || 0).toFixed(1)}%</Typography>
                </Grid>
                <Grid item xs={6} sm={4} md={2}>
                  <Typography variant="subtitle2" color="text.secondary">{t("under-50")}</Typography>
                  <Typography variant="h6">{quiz.numberOfStudentUnder50 || 0}</Typography>
                </Grid>
                <Grid item xs={6} sm={4} md={2}>
                  <Typography variant="subtitle2" color="text.secondary">{t("over-70")}</Typography>
                  <Typography variant="h6">{quiz.numberOfStudentOver70 || 0}</Typography>
                </Grid>
                <Grid item xs={6} sm={4} md={2}>
                  <Typography variant="subtitle2" color="text.secondary">{t("perfect-scores")}</Typography>
                  <Typography variant="h6">{quiz.numberOfStudentWith100 || 0}</Typography>
                </Grid>
              </Grid>
            </Box>

            {/* Student Submissions for this Quiz */}
            <Box sx={{ mt: 2 }}>
              <Typography variant="subtitle1" sx={{ mb: 2, color: theme.palette.text.secondary }}>
                {t("student-submissions")}
              </Typography>
              <TableContainer>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell sx={{ fontWeight: 'bold', backgroundColor: theme.palette.primary.light, color: 'white' }}>{t("student-name")}</TableCell>
                      <TableCell align="right" sx={{ fontWeight: 'bold', backgroundColor: theme.palette.primary.light, color: 'white' }}>{t("score")}</TableCell>
                      <TableCell align="right" sx={{ fontWeight: 'bold', backgroundColor: theme.palette.primary.light, color: 'white' }}>{t("questions-submitted")}</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {Array.isArray(quiz.studentSubmissions) && quiz.studentSubmissions.length > 0 ? (
                      quiz.studentSubmissions.map((submission, subIndex) => (
                        <TableRow 
                          key={subIndex}
                          sx={{ 
                            '&:nth-of-type(odd)': { backgroundColor: '#f5f5f5' },
                            '&:hover': { backgroundColor: '#e3f2fd' }
                          }}
                        >
                          <TableCell>{submission.studentName || 'N/A'}</TableCell>
                          <TableCell align="right">{submission.studentDegree || 0}</TableCell>
                          <TableCell align="right">{submission.numberOfSubmittedQuestions || 0}</TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={3} align="center" sx={{ py: 3 }}>
                          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1 }}>
                            <Typography variant="body1" color="text.secondary">
                              {t("no-submissions")}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              {t("quiz-not-taken")}
                            </Typography>
                          </Box>
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
            </Box>
          </Box>
        ))}
      </Paper>
    </Box>
  );
};

export default LessonQuizStats; 