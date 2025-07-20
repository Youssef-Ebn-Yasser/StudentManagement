using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Backend.Migrations
{
    /// <inheritdoc />
    public partial class FixAttendance : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_MeetingAttendances_Meetings_MeetingId",
                table: "MeetingAttendances");

            migrationBuilder.DropIndex(
                name: "IX_MeetingAttendances_MeetingId",
                table: "MeetingAttendances");

            migrationBuilder.DropColumn(
                name: "MeetingId",
                table: "MeetingAttendances");

            migrationBuilder.AddColumn<int>(
                name: "CourseId",
                table: "MeetingAttendances",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<bool>(
                name: "IsTaken",
                table: "MeetingAttendances",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<int>(
                name: "LessionId",
                table: "MeetingAttendances",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<string>(
                name: "Note",
                table: "MeetingAttendances",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "enAttendType",
                table: "MeetingAttendances",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.CreateIndex(
                name: "IX_MeetingAttendances_CourseId",
                table: "MeetingAttendances",
                column: "CourseId");

            migrationBuilder.CreateIndex(
                name: "IX_MeetingAttendances_LessionId",
                table: "MeetingAttendances",
                column: "LessionId");

            migrationBuilder.AddForeignKey(
                name: "FK_MeetingAttendances_Courses_CourseId",
                table: "MeetingAttendances",
                column: "CourseId",
                principalTable: "Courses",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_MeetingAttendances_Lessons_LessionId",
                table: "MeetingAttendances",
                column: "LessionId",
                principalTable: "Lessons",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_MeetingAttendances_Courses_CourseId",
                table: "MeetingAttendances");

            migrationBuilder.DropForeignKey(
                name: "FK_MeetingAttendances_Lessons_LessionId",
                table: "MeetingAttendances");

            migrationBuilder.DropIndex(
                name: "IX_MeetingAttendances_CourseId",
                table: "MeetingAttendances");

            migrationBuilder.DropIndex(
                name: "IX_MeetingAttendances_LessionId",
                table: "MeetingAttendances");

            migrationBuilder.DropColumn(
                name: "CourseId",
                table: "MeetingAttendances");

            migrationBuilder.DropColumn(
                name: "IsTaken",
                table: "MeetingAttendances");

            migrationBuilder.DropColumn(
                name: "LessionId",
                table: "MeetingAttendances");

            migrationBuilder.DropColumn(
                name: "Note",
                table: "MeetingAttendances");

            migrationBuilder.DropColumn(
                name: "enAttendType",
                table: "MeetingAttendances");

            migrationBuilder.AddColumn<string>(
                name: "MeetingId",
                table: "MeetingAttendances",
                type: "nvarchar(450)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.CreateIndex(
                name: "IX_MeetingAttendances_MeetingId",
                table: "MeetingAttendances",
                column: "MeetingId");

            migrationBuilder.AddForeignKey(
                name: "FK_MeetingAttendances_Meetings_MeetingId",
                table: "MeetingAttendances",
                column: "MeetingId",
                principalTable: "Meetings",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
