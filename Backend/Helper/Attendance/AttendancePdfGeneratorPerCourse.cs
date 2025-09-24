using QuestPDF.Fluent;
using QuestPDF.Helpers;
using QuestPDF.Infrastructure;

namespace Backend.Helper.Attendance;

public class AttendancePdfGeneratorPerCourse
{
    public static byte[] Generate(GetCourseRecoredAttendanceDto dto)
    {
        QuestPDF.Settings.License = LicenseType.Community;

        var document = Document.Create(container =>
        {
            container.Page(page =>
            {
                page.Margin(30);
                page.Size(PageSizes.A4);
                page.DefaultTextStyle(x => x.FontSize(11).FontFamily("Arial"));

                // ---- Header ----
                page.Header().Element(ComposeHeader);

                page.Content().Column(col =>
                {
                    col.Spacing(15);

                    // --- Course Summary ---
                    col.Item().Element(c => ComposeCourseSummary(c, dto));

                    // --- Overall Statistics ---
                    col.Item().Element(c => ComposeOverallStats(c, dto));

                    // --- Students Attendance ---
                    col.Item().Element(c => ComposeStudentsAttendance(c, dto));
                });

                // ---- Footer ----
                page.Footer().AlignCenter().Text(text =>
                {
                    text.Span("Page ").FontSize(10);
                    text.CurrentPageNumber().FontSize(10);
                    text.Span(" of ").FontSize(10);
                    text.TotalPages().FontSize(10);
                    text.Span($" | Generated on {DateTime.Now:yyyy-MM-dd HH:mm}").FontSize(10);
                });
            });
        });

        return document.GeneratePdf();
    }

    private static void ComposeHeader(IContainer container)
    {
        container.Column(col =>
        {
            col.Item().AlignCenter().Text("Course Attendance Report")
                .Bold().FontSize(24).FontColor(Colors.Blue.Darken3);

            col.Item().AlignCenter().Text("Detailed Attendance Summary")
                .SemiBold().FontSize(14).FontColor(Colors.Grey.Medium);

            col.Item().PaddingTop(5).LineHorizontal(1).LineColor(Colors.Blue.Lighten1);
        });
    }

    private static void ComposeCourseSummary(IContainer container, GetCourseRecoredAttendanceDto dto)
    {
        container.Background(Colors.Grey.Lighten5)
            .Padding(15)
            .Border(1)
            .BorderColor(Colors.Grey.Lighten2)
            .Column(col =>
            {
                col.Item().Text("Course Information").Bold().FontSize(16).FontColor(Colors.Blue.Darken2);
                col.Item().PaddingVertical(5);

                col.Item().Grid(grid =>
                {
                    grid.Columns(3);
                    grid.Spacing(10);

                    ComposeInfoCard(grid, "Description", dto.Description ?? "N/A", Colors.Blue.Lighten5);
                    ComposeInfoCard(grid, "Level", dto.CourseLevel ?? "N/A", Colors.Green.Lighten5);
                    ComposeInfoCard(grid, "Students", dto.NumberOfStudents.ToString(), Colors.Orange.Lighten5);
                    ComposeInfoCard(grid, "Start Date", dto.StartDate?.ToString("MMM dd, yyyy") ?? "N/A", Colors.Purple.Lighten5);
                    ComposeInfoCard(grid, "End Date", dto.EndDate?.ToString("MMM dd, yyyy") ?? "N/A", Colors.Purple.Lighten5);
                    ComposeInfoCard(grid, "Price", dto.Price?.ToString("C") ?? "N/A", Colors.Teal.Lighten5);
                });
            });
    }

    private static void ComposeOverallStats(IContainer container, GetCourseRecoredAttendanceDto dto)
    {
        container.Background(Colors.Grey.Lighten5)
            .Padding(15)
            .Border(1)
            .BorderColor(Colors.Grey.Lighten2)
            .Column(col =>
            {
                col.Item().Text("Overall Attendance Statistics").Bold().FontSize(16).FontColor(Colors.Green.Darken2);
                col.Item().PaddingVertical(5);

                col.Item().Grid(grid =>
                {
                    grid.Columns(2);
                    grid.Spacing(10);

                    // Total Attendance Card
                    grid.Item().Background(GetPercentageColor(dto.TotalPercentageOfAttendance))
                        .Padding(15)
                        .Border(1)
                        .BorderColor(Colors.Grey.Lighten1)
                        .Column(card =>
                        {
                            card.Item().AlignCenter().Text("Total Attendance").SemiBold().FontSize(12);
                            card.Item().AlignCenter().Text($"{dto.TotalPercentageOfAttendance:F1}%")
                                .Bold().FontSize(24).FontColor(Colors.White);
                        });

                    // Students Summary Card
                    grid.Item().Background(Colors.Blue.Lighten3)
                        .Padding(15)
                        .Border(1)
                        .BorderColor(Colors.Grey.Lighten1)
                        .Column(card =>
                        {
                            card.Item().AlignCenter().Text("Active Students").SemiBold().FontSize(12).FontColor(Colors.White);
                            card.Item().AlignCenter().Text(dto.NumberOfStudents.ToString())
                                .Bold().FontSize(24).FontColor(Colors.White);
                        });
                });
            });
    }

    private static void ComposeStudentsAttendance(IContainer container, GetCourseRecoredAttendanceDto dto)
    {
        container.Column(col =>
        {
            col.Item().Text("Students Attendance Details").Bold().FontSize(16).FontColor(Colors.Red.Darken2);
            col.Item().PaddingBottom(10);

            int studentIndex = 0;
            foreach (var student in dto.StudentsAttendance.Where(s => s != null))
            {
                var studentDto = student!;
                var backgroundColor = studentIndex % 2 == 0 ? Colors.White : Colors.Grey.Lighten5;

                col.Item().Element(c => ComposeStudentCard(c, studentDto, backgroundColor, studentIndex));
                col.Item().PaddingBottom(10);

                studentIndex++;
            }
        });
    }

    private static void ComposeStudentCard(IContainer container, GetStudentRecoredAttendanceDto student,
        Color backgroundColor, int index)
    {
        container.Background(backgroundColor)
            .Padding(15)
            .Border(1)
            .BorderColor(Colors.Grey.Lighten2)
            .Column(col =>
            {
                // Student Header
                col.Item().Row(row =>
                {
                    row.RelativeItem().Column(studentCol =>
                    {
                        studentCol.Item().Text($"{student.StudentName} (ID: {student.StudentId})")
                            .Bold().FontSize(14).FontColor(Colors.Blue.Darken3);
                        studentCol.Item().Text($"Course: {student.CoursetName}")
                            .SemiBold().FontSize(12).FontColor(Colors.Grey.Darken1);
                    });

                    row.ConstantItem(150).AlignRight().Background(GetPercentageColor(student.PercentageOfAttendance))
                        .Padding(5)
                        .Column(statsCol =>
                        {
                            statsCol.Item().AlignCenter().Text("Attendance").SemiBold().FontSize(10).FontColor(Colors.White);
                            statsCol.Item().AlignCenter().Text($"{student.PercentageOfAttendance:F1}%")
                                .Bold().FontSize(16).FontColor(Colors.White);
                        });
                });

                col.Item().PaddingVertical(5);

                // Student Statistics
                col.Item().Grid(grid =>
                {
                    grid.Columns(4);
                    grid.Spacing(5);

                    ComposeStatCard(grid, "Lessons", student.NumberOfLession.ToString(), Colors.Blue.Lighten4);
                    ComposeStatCard(grid, "Taken", student.NumberOfTakenSession.ToString(), Colors.Green.Lighten4);
                    ComposeStatCard(grid, "Resumed", student.NumberOfResumeSession.ToString(), Colors.Orange.Lighten4);
                    ComposeStatCard(grid, "Max Attended", student.MuximumNumberOfAttendedSession.ToString(), Colors.Purple.Lighten4);
                });

                col.Item().PaddingVertical(5);

                // Lessons Details (if any)
                if (student.lessionAttendanceRecoreds?.Any() == true)
                {
                    col.Item().Text("Lesson Attendance").Bold().FontSize(12).FontColor(Colors.Grey.Darken2);
                    col.Item().PaddingTop(5).Table(table =>
                    {
                        table.ColumnsDefinition(columns =>
                        {
                            columns.RelativeColumn(1); // Lesson ID
                            columns.RelativeColumn(3); // Lesson Name
                            columns.RelativeColumn(2); // Attend Type
                            columns.RelativeColumn(2); // Date
                            columns.RelativeColumn(3); // Note
                        });

                        // Table Header
                        table.Header(header =>
                        {
                            header.Cell().Background(Colors.Grey.Lighten3).Padding(5).Text("ID").Bold().FontSize(9);
                            header.Cell().Background(Colors.Grey.Lighten3).Padding(5).Text("Lesson Name").Bold().FontSize(9);
                            header.Cell().Background(Colors.Grey.Lighten3).Padding(5).Text("Type").Bold().FontSize(9);
                            header.Cell().Background(Colors.Grey.Lighten3).Padding(5).Text("Date").Bold().FontSize(9);
                            header.Cell().Background(Colors.Grey.Lighten3).Padding(5).Text("Note").Bold().FontSize(9);
                        });

                        // Table Rows
                        int lessonIndex = 0;
                        foreach (var lesson in student.lessionAttendanceRecoreds)
                        {
                            var lessonBgColor = lessonIndex % 2 == 0 ? Colors.White : Colors.Grey.Lighten5;

                            table.Cell().Background(lessonBgColor).Padding(5).Text(lesson.LessionId.ToString()).FontSize(9);
                            table.Cell().Background(lessonBgColor).Padding(5).Text(lesson.LessionName).FontSize(9);
                            table.Cell().Background(lessonBgColor).Padding(5).Text(GetAttendTypeDisplay(lesson.AttendType)).FontSize(9);
                            table.Cell().Background(lessonBgColor).Padding(5).Text(lesson.TakenAt.ToString("MMM dd, yyyy")).FontSize(9);
                            table.Cell().Background(lessonBgColor).Padding(5).Text(lesson.Note ?? "-").FontSize(9);

                            lessonIndex++;
                        }
                    });
                }
                else
                {
                    col.Item().AlignCenter().Padding(10).Text("No lesson attendance records available")
                        .Italic().FontSize(10).FontColor(Colors.Grey.Medium);
                }
            });
    }

    private static void ComposeInfoCard(GridDescriptor grid, string title, string value, Color color)
    {
        grid.Item().Background(color).Padding(10).Border(1).Column(col =>
        {
            col.Item().Text(title).Bold().FontSize(10).FontColor(Colors.Grey.Darken3);
            col.Item().Text(value).SemiBold().FontSize(12);
        });
    }

    private static void ComposeStatCard(GridDescriptor grid, string title, string value, Color color)
    {
        grid.Item().Background(color).Padding(8).Border(1).Column(col =>
        {
            col.Item().AlignCenter().Text(title).Bold().FontSize(9);
            col.Item().AlignCenter().Text(value).SemiBold().FontSize(11);
        });
    }

    private static Color GetPercentageColor(decimal percentage)
    {
        return percentage switch
        {
            >= 90 => Colors.Green.Darken1,    // Excellent - Dark Green
            >= 80 => Colors.Green.Lighten1,   // Good - Green
            >= 70 => Colors.Orange.Lighten1,  // Average - Orange
            >= 60 => Colors.Orange.Darken1,   // Below Average - Dark Orange
            _ => Colors.Red.Lighten1          // Poor - Red
        };
    }

    private static string GetAttendTypeDisplay(enAttendType? attendType)
    {
        return attendType?.ToString()?.Replace("_", " ") ?? "Not Recorded";
    }
}