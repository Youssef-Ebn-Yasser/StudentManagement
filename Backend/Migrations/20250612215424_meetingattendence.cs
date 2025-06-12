using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Backend.Migrations
{
    /// <inheritdoc />
    public partial class meetingattendence : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "IX_StudentQuestionAnswers_studentQuizeAnswerId",
                table: "StudentQuestionAnswers");

            migrationBuilder.AddColumn<string>(
                name: "StudentAnswerText",
                table: "StudentQuestionAnswers",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AlterColumn<byte>(
                name: "DegreePercentage",
                table: "StudentAssignments",
                type: "tinyint",
                nullable: false,
                oldClrType: typeof(int),
                oldType: "int");

            migrationBuilder.AddColumn<decimal>(
                name: "GradingRating",
                table: "Quizzes",
                type: "decimal(18,2)",
                nullable: true);

            migrationBuilder.CreateTable(
                name: "MeetingAttendances",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    StudentId = table.Column<int>(type: "int", nullable: false),
                    MeetingId = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    Attended = table.Column<bool>(type: "bit", nullable: false),
                    AttendanceDate = table.Column<DateTime>(type: "datetime2", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_MeetingAttendances", x => x.Id);
                    table.ForeignKey(
                        name: "FK_MeetingAttendances_AspNetUsers_StudentId",
                        column: x => x.StudentId,
                        principalTable: "AspNetUsers",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_MeetingAttendances_Meetings_MeetingId",
                        column: x => x.MeetingId,
                        principalTable: "Meetings",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "ZoomParticipants",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Name = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Email = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    JoinTime = table.Column<DateTime>(type: "datetime2", nullable: false),
                    LeaveTime = table.Column<DateTime>(type: "datetime2", nullable: false),
                    Duration = table.Column<int>(type: "int", nullable: false),
                    MeetingId = table.Column<int>(type: "int", nullable: false),
                    MeetingId1 = table.Column<string>(type: "nvarchar(450)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ZoomParticipants", x => x.Id);
                    table.ForeignKey(
                        name: "FK_ZoomParticipants_Meetings_MeetingId1",
                        column: x => x.MeetingId1,
                        principalTable: "Meetings",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_StudentQuestionAnswers_studentQuizeAnswerId",
                table: "StudentQuestionAnswers",
                column: "studentQuizeAnswerId",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_MeetingAttendances_MeetingId",
                table: "MeetingAttendances",
                column: "MeetingId");

            migrationBuilder.CreateIndex(
                name: "IX_MeetingAttendances_StudentId",
                table: "MeetingAttendances",
                column: "StudentId");

            migrationBuilder.CreateIndex(
                name: "IX_ZoomParticipants_MeetingId1",
                table: "ZoomParticipants",
                column: "MeetingId1");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "MeetingAttendances");

            migrationBuilder.DropTable(
                name: "ZoomParticipants");

            migrationBuilder.DropIndex(
                name: "IX_StudentQuestionAnswers_studentQuizeAnswerId",
                table: "StudentQuestionAnswers");

            migrationBuilder.DropColumn(
                name: "StudentAnswerText",
                table: "StudentQuestionAnswers");

            migrationBuilder.DropColumn(
                name: "GradingRating",
                table: "Quizzes");

            migrationBuilder.AlterColumn<int>(
                name: "DegreePercentage",
                table: "StudentAssignments",
                type: "int",
                nullable: false,
                oldClrType: typeof(byte),
                oldType: "tinyint");

            migrationBuilder.CreateIndex(
                name: "IX_StudentQuestionAnswers_studentQuizeAnswerId",
                table: "StudentQuestionAnswers",
                column: "studentQuizeAnswerId");
        }
    }
}
