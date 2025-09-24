using QuestPDF.Fluent;
using QuestPDF.Helpers;
using QuestPDF.Infrastructure;

namespace Backend.Helper.Attendance;

public class AttendancePdfGeneratorForStudent
{
    public static byte[] Generate(GetStudentRecoredAttendanceDto dto)
    {
        QuestPDF.Settings.License = LicenseType.Community;
        // Enable debugging to get more detailed error information
        QuestPDF.Settings.EnableDebugging = true;

        var document = Document.Create(container =>
        {
            container.Page(page =>
            {
                page.Margin(20); // Reduced margin for more space
                page.Size(PageSizes.A4);
                page.DefaultTextStyle(x => x.FontSize(10).FontFamily("Arial")); // Smaller base font

                // ---- Header ----
                page.Header().Element(ComposeHeader);

                page.Content().Column(col =>
                {
                    col.Spacing(10); // Reduced spacing

                    // --- Student Overview Card ---
                    col.Item().Element(c => ComposeStudentOverview(c, dto));

                    // --- Attendance Statistics ---
                    col.Item().Element(c => ComposeAttendanceStats(c, dto));

                    // --- Lesson Details ---
                    col.Item().Element(c => ComposeLessonDetails(c, dto));
                });

                // ---- Footer ----
                page.Footer().AlignCenter().Text(text =>
                {
                    text.Span("Page ").FontSize(8);
                    text.CurrentPageNumber().FontSize(8);
                    text.Span(" of ").FontSize(8);
                    text.TotalPages().FontSize(8);
                    text.Span($" | Generated on {DateTime.Now:yyyy-MM-dd HH:mm}").FontSize(8);
                });
            });
        });

        return document.GeneratePdf();
    }

    private static void ComposeHeader(IContainer container)
    {
        container.Column(col =>
        {
            col.Item().AlignCenter().Text("Student Attendance Report")
                .Bold().FontSize(18).FontColor(Colors.Blue.Darken3); // Smaller font

            col.Item().AlignCenter().Text("Individual Student Performance Summary")
                .SemiBold().FontSize(10).FontColor(Colors.Grey.Medium); // Smaller font

            col.Item().PaddingTop(3).LineHorizontal(0.5f).LineColor(Colors.Blue.Lighten1);
        });
    }

    private static void ComposeStudentOverview(IContainer container, GetStudentRecoredAttendanceDto dto)
    {
        container.Background(Colors.Grey.Lighten5)
            .Padding(10) // Reduced padding
            .Border(1)
            .BorderColor(Colors.Grey.Lighten2)
            .Column(col =>
            {
                col.Item().Text("Student Overview").Bold().FontSize(14).FontColor(Colors.Blue.Darken2);
                col.Item().PaddingVertical(5);

                col.Item().Grid(grid =>
                {
                    grid.Columns(3);
                    grid.Spacing(5); // Reduced spacing
                    grid.VerticalSpacing(5);

                    ComposeInfoCard(grid, "Student Name", dto.StudentName, Colors.Blue.Lighten5);
                    ComposeInfoCard(grid, "Student ID", dto.StudentId.ToString(), Colors.Green.Lighten5);
                    ComposeInfoCard(grid, "Course", dto.CoursetName, Colors.Orange.Lighten5);
                });
            });
    }

    private static void ComposeAttendanceStats(IContainer container, GetStudentRecoredAttendanceDto dto)
    {
        container.Column(col =>
        {
            col.Item().Text("Attendance Statistics").Bold().FontSize(14).FontColor(Colors.Green.Darken2);
            col.Item().PaddingVertical(3);

            // Main Statistics Grid - Simplified layout
            col.Item().Grid(grid =>
            {
                grid.Columns(2); // Changed from 4 to 2 columns for better spacing
                grid.Spacing(5);
                grid.VerticalSpacing(5);

                ComposeStatCard(grid, "Total Lessons", dto.NumberOfLession.ToString(), Colors.Blue.Lighten4);
                ComposeStatCard(grid, "Taken Sessions", dto.NumberOfTakenSession.ToString(), Colors.Green.Lighten4);
                ComposeStatCard(grid, "Resumed Sessions", dto.NumberOfResumeSession.ToString(), Colors.Orange.Lighten4);
                ComposeStatCard(grid, "Max Attended", dto.MuximumNumberOfAttendedSession.ToString(), Colors.Purple.Lighten4);
            });

            col.Item().PaddingVertical(5);

            // Percentage Cards - Simplified
            col.Item().Grid(grid =>
            {
                grid.Columns(2);
                grid.Spacing(5);

                // Current Attendance Percentage
                grid.Item().Background(GetPercentageColor(dto.PercentageOfAttendance))
                    .Padding(8) // Reduced padding
                    .Border(1)
                    .BorderColor(Colors.Grey.Lighten1)
                    .Column(card =>
                    {
                        card.Item().AlignCenter().Text("Current Attendance").SemiBold().FontSize(10).FontColor(Colors.White);
                        card.Item().AlignCenter().Text($"{dto.PercentageOfAttendance:F1}%")
                            .Bold().FontSize(16).FontColor(Colors.White); // Smaller font
                    });

                // Predicted Maximum Percentage
                grid.Item().Background(GetPredictedPercentageColor(dto.MaxPredictedPrecentageOfAttendance))
                    .Padding(8) // Reduced padding
                    .Border(1)
                    .BorderColor(Colors.Grey.Lighten1)
                    .Column(card =>
                    {
                        card.Item().AlignCenter().Text("Max Predicted").SemiBold().FontSize(10).FontColor(Colors.White);
                        card.Item().AlignCenter().Text($"{dto.MaxPredictedPrecentageOfAttendance:F1}%")
                            .Bold().FontSize(16).FontColor(Colors.White); // Smaller font
                    });
            });

            // Simplified Progress Comparison - Removed complex visualization
            col.Item().PaddingVertical(3).Element(c => ComposeSimpleProgress(c, dto));
        });
    }

    private static void ComposeSimpleProgress(IContainer container, GetStudentRecoredAttendanceDto dto)
    {
        container.Background(Colors.Grey.Lighten5)
            .Padding(5) // Reduced padding
            .Border(1)
            .BorderColor(Colors.Grey.Lighten2)
            .Column(col =>
            {
                col.Item().Text("Progress Summary").SemiBold().FontSize(10);

                col.Item().PaddingVertical(2).Row(row =>
                {
                    row.RelativeItem().Text($"Current Attendance: {dto.PercentageOfAttendance:F1}%")
                        .FontSize(9).FontColor(Colors.Green.Darken2).SemiBold();
                });

                col.Item().Row(row =>
                {
                    row.RelativeItem().Text($"Potential Maximum: {dto.MaxPredictedPrecentageOfAttendance:F1}%")
                        .FontSize(9).FontColor(Colors.Blue.Darken2).SemiBold();
                });

                col.Item().Row(row =>
                {
                    var improvement = dto.MaxPredictedPrecentageOfAttendance - dto.PercentageOfAttendance;
                    row.RelativeItem().Text($"Potential Improvement: {improvement:F1}%")
                        .FontSize(9).FontColor(improvement > 0 ? Colors.Orange.Darken2 : Colors.Grey.Darken2);
                });
            });
    }

    private static void ComposeLessonDetails(IContainer container, GetStudentRecoredAttendanceDto dto)
    {
        container.Column(col =>
        {
            col.Item().Text("Lesson Attendance Details").Bold().FontSize(14).FontColor(Colors.Red.Darken2);
            col.Item().PaddingBottom(3).Text($"{dto.lessionAttendanceRecoreds?.Count ?? 0} lessons recorded")
                .FontSize(9).FontColor(Colors.Grey.Darken1);

            if (dto.lessionAttendanceRecoreds?.Any() == true)
            {
                // Use minimal table styling to avoid constraints
                col.Item().Table(table =>
                {
                    // Simplified column definitions
                    table.ColumnsDefinition(columns =>
                    {
                        columns.ConstantColumn(50);  // Lesson ID - Smaller
                        columns.RelativeColumn(2);   // Lesson Name
                        columns.ConstantColumn(70);  // Attend Type - Smaller
                        columns.ConstantColumn(80);  // Date - Smaller
                        columns.RelativeColumn(2);   // Note
                    });

                    // Table Header - Minimal styling
                    table.Header(header =>
                    {
                        header.Cell().Padding(3).Background(Colors.Grey.Darken3).Text("ID").Bold().FontSize(8).FontColor(Colors.White);
                        header.Cell().Padding(3).Background(Colors.Grey.Darken3).Text("Lesson Name").Bold().FontSize(8).FontColor(Colors.White);
                        header.Cell().Padding(3).Background(Colors.Grey.Darken3).Text("Status").Bold().FontSize(8).FontColor(Colors.White);
                        header.Cell().Padding(3).Background(Colors.Grey.Darken3).Text("Date").Bold().FontSize(8).FontColor(Colors.White);
                        header.Cell().Padding(3).Background(Colors.Grey.Darken3).Text("Notes").Bold().FontSize(8).FontColor(Colors.White);
                    });

                    // Table Rows - Minimal styling
                    int index = 0;
                    foreach (var lesson in dto.lessionAttendanceRecoreds)
                    {
                        var backgroundColor = index % 2 == 0 ? Colors.White : Colors.Grey.Lighten5;
                        var statusColor = GetStatusColor(lesson.AttendType);

                        table.Cell().Padding(3).Background(backgroundColor).Text(lesson.LessionId.ToString()).FontSize(8);
                        table.Cell().Padding(3).Background(backgroundColor).Text(lesson.LessionName).FontSize(8);
                        table.Cell().Padding(3).Background(backgroundColor).Text(GetAttendTypeDisplay(lesson.AttendType)).FontSize(8).FontColor(statusColor);
                        table.Cell().Padding(3).Background(backgroundColor).Text(lesson.TakenAt.ToString("MM/dd/yy\nHH:mm")).FontSize(7); // Smaller date format
                        table.Cell().Padding(3).Background(backgroundColor).Text(lesson.Note ?? "-").FontSize(8);

                        index++;
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
        grid.Item().Background(color).Padding(15).Border(1).Column(col => // Reduced padding
        {
            col.Item().Text(title).Bold().FontSize(8).FontColor(Colors.Grey.Darken3); // Smaller font
            col.Item().Padding(10).Text(value).SemiBold().FontSize(10); // Smaller font
        });
    }

    private static void ComposeStatCard(GridDescriptor grid, string title, string value, Color color)
    {
        grid.Item().Background(color).Padding(15).Border(1).Column(col => // Reduced padding
        {
            col.Item().Text(title).Bold().FontSize(8); // Smaller font
            col.Item().AlignCenter().Text(value).SemiBold().FontSize(12); // Smaller font
        });
    }

    private static Color GetPercentageColor(decimal percentage)
    {
        return percentage switch
        {
            >= 90 => Colors.Green.Darken1,
            >= 80 => Colors.Green.Lighten1,
            >= 70 => Colors.Orange.Lighten1,
            >= 60 => Colors.Orange.Darken1,
            _ => Colors.Red.Lighten1
        };
    }

    private static Color GetPredictedPercentageColor(decimal percentage)
    {
        return Colors.Blue.Darken1;
    }

    private static Color GetStatusColor(enAttendType? attendType)
    {
        return attendType?.ToString()?.ToLower() switch
        {
            "present" or "attended" => Colors.Green.Darken2,
            "absent" or "missed" => Colors.Red.Darken2,
            "late" => Colors.Orange.Darken2,
            "excused" => Colors.Purple.Darken2,
            _ => Colors.Grey.Darken1
        };
    }

    private static string GetAttendTypeDisplay(enAttendType? attendType)
    {
        if (attendType == null) return "Not Recorded";

        return attendType switch
        {
            enAttendType.Attend => "Present",
            enAttendType.Absent => "Absent",
            enAttendType.HalfDay => "Late",
            enAttendType.Sorry => "Excused",
            _ => attendType.ToString()?.Replace("_", " ") ?? "Unknown"
        };
    }
}