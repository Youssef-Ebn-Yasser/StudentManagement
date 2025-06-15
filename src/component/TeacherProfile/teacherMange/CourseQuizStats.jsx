import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
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
  Divider,
  useTheme,
  Button
} from '@mui/material';
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from 'recharts';

const COLORS = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEEAD'];

const CourseQuizStats = () => {
  const { courseId } = useParams();
  const [stats, setStats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const theme = useTheme();

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        const response = await quizService.getCourseQuizStats(courseId);
        if (response.data?.data && Array.isArray(response.data.data)) {
          setStats(response.data.data);
        } else {
          console.error('Invalid response format:', response);
          setError('Invalid data format received from server');
          setStats([]);
        }
        setError(null);
      } catch (err) {
        setError('Failed to load quiz statistics. Please try again later.');
        console.error('Error fetching quiz stats:', err);
        setStats([]);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [courseId]);

  // Add this new useEffect to log stats changes
  useEffect(() => {
    console.log('Stats array updated:', stats);
  }, [stats]);

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

  if (!Array.isArray(stats) || stats.length === 0) {
    return (
      <Box p={3}>
        <Alert severity="info" sx={{ fontSize: '1.1rem' }}>No quiz statistics available for this course.</Alert>
      </Box>
    );
  }

  // Calculate total statistics
  const totalStats = stats.reduce((acc, lesson) => {
    if (!lesson || typeof lesson !== 'object') return acc;
    
    acc.totalQuizzes += lesson.numberOfQuizzes || 0;
    const lessonSubmissions = (lesson.quizzes || []).reduce((sum, quiz) => sum + (quiz.numberOfStudentSubmit || 0), 0);
    acc.totalSubmissions += lessonSubmissions;
    const lessonUnder50 = (lesson.quizzes || []).reduce((sum, quiz) => sum + (quiz.numberOfStudentUnder50 || 0), 0);
    acc.totalStudentsUnder50 += lessonUnder50;
    const lessonOver70 = (lesson.quizzes || []).reduce((sum, quiz) => sum + (quiz.numberOfStudentOver70 || 0), 0);
    acc.totalStudentsOver70 += lessonOver70;
    const lessonWith100 = (lesson.quizzes || []).reduce((sum, quiz) => sum + (quiz.numberOfStudentWith100 || 0), 0);
    acc.totalStudentsWith100 += lessonWith100;
    return acc;
  }, {
    totalQuizzes: 0,
    totalSubmissions: 0,
    totalStudentsUnder50: 0,
    totalStudentsOver70: 0,
    totalStudentsWith100: 0
  });

  // Prepare data for the pie chart
  const performanceData = [
    { name: 'Under 50%', value: totalStats.totalStudentsUnder50 },
    { name: 'Over 70%', value: totalStats.totalStudentsOver70 },
    { name: 'Perfect Score', value: totalStats.totalStudentsWith100 }
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
          {title}
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
        Course Quiz Statistics
      </Typography>

      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={4} lg={2.4}>
          <StatCard 
            title="Total Quizzes" 
            value={totalStats.totalQuizzes}
            color={COLORS[0]}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4} lg={2.4}>
          <StatCard 
            title="Total Submissions" 
            value={totalStats.totalSubmissions}
            color={COLORS[1]}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4} lg={2.4}>
          <StatCard 
            title="Students Under 50%" 
            value={totalStats.totalStudentsUnder50}
            color={COLORS[2]}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4} lg={2.4}>
          <StatCard 
            title="Students Over 70%" 
            value={totalStats.totalStudentsOver70}
            color={COLORS[3]}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4} lg={2.4}>
          <StatCard 
            title="Perfect Scores" 
            value={totalStats.totalStudentsWith100}
            color={COLORS[4]}
          />
        </Grid>
      </Grid>

      <Paper elevation={3} sx={{ p: 4, mb: 4, borderRadius: 2 }}>
        <Typography variant="h5" gutterBottom sx={{ color: theme.palette.primary.main, mb: 3 }}>
          Performance Distribution
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

      {stats.map((lesson, lessonIndex) => {
        console.log('Lesson object in CourseQuizStats:', lesson);
        console.log('Lesson ID before Link:', lesson.id);
        return (
          <Paper 
            key={lessonIndex} 
            elevation={3} 
            sx={{ 
              p: 4, 
              mb: 4, 
              borderRadius: 2,
              backgroundColor: '#ffffff'
            }}
          >
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
              <Typography variant="h5" gutterBottom sx={{ 
                color: theme.palette.primary.main,
                mb: 0
              }}>
                {lesson.lessonName}
              </Typography>
            </Box>
            <Typography variant="subtitle1" color="text.secondary" gutterBottom sx={{ mb: 3 }}>
              Number of Quizzes: {lesson.numberOfQuizzes} ({lesson.percentageOfAllQuizzes?.toFixed(1) || 0}% of total)
            </Typography>
            
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 'bold', backgroundColor: theme.palette.primary.light, color: 'white' }}>Quiz Name</TableCell>
                    <TableCell align="right" sx={{ fontWeight: 'bold', backgroundColor: theme.palette.primary.light, color: 'white' }}>Submissions</TableCell>
                    <TableCell align="right" sx={{ fontWeight: 'bold', backgroundColor: theme.palette.primary.light, color: 'white' }}>Submission Rate</TableCell>
                    <TableCell align="right" sx={{ fontWeight: 'bold', backgroundColor: theme.palette.primary.light, color: 'white' }}>Under 50%</TableCell>
                    <TableCell align="right" sx={{ fontWeight: 'bold', backgroundColor: theme.palette.primary.light, color: 'white' }}>Over 70%</TableCell>
                    <TableCell align="right" sx={{ fontWeight: 'bold', backgroundColor: theme.palette.primary.light, color: 'white' }}>Perfect Scores</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {(lesson.quizzes || []).map((quiz, quizIndex) => (
                    <TableRow 
                      key={quizIndex}
                      sx={{ 
                        '&:nth-of-type(odd)': { backgroundColor: '#f5f5f5' },
                        '&:hover': { backgroundColor: '#e3f2fd' }
                      }}
                    >
                      <TableCell>{quiz.quizName}</TableCell>
                      <TableCell align="right">{quiz.numberOfStudentSubmit || 0}</TableCell>
                      <TableCell align="right">{(quiz.percentageOfSubmit || 0).toFixed(1)}%</TableCell>
                      <TableCell align="right">{quiz.numberOfStudentUnder50 || 0}</TableCell>
                      <TableCell align="right">{quiz.numberOfStudentOver70 || 0}</TableCell>
                      <TableCell align="right">{quiz.numberOfStudentWith100 || 0}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        );
      })}
    </Box>
  );
};

export default CourseQuizStats; 