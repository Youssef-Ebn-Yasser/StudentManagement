using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Backend.Migrations
{
    /// <inheritdoc />
    public partial class FixComment : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "CourseId",
                table: "Comment",
                type: "int",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "LessonId",
                table: "Comment",
                type: "int",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_Comment_CourseId",
                table: "Comment",
                column: "CourseId");

            migrationBuilder.CreateIndex(
                name: "IX_Comment_LessonId",
                table: "Comment",
                column: "LessonId");

            migrationBuilder.AddForeignKey(
                name: "FK_Comment_Courses_CourseId",
                table: "Comment",
                column: "CourseId",
                principalTable: "Courses",
                principalColumn: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_Comment_Lessons_LessonId",
                table: "Comment",
                column: "LessonId",
                principalTable: "Lessons",
                principalColumn: "Id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Comment_Courses_CourseId",
                table: "Comment");

            migrationBuilder.DropForeignKey(
                name: "FK_Comment_Lessons_LessonId",
                table: "Comment");

            migrationBuilder.DropIndex(
                name: "IX_Comment_CourseId",
                table: "Comment");

            migrationBuilder.DropIndex(
                name: "IX_Comment_LessonId",
                table: "Comment");

            migrationBuilder.DropColumn(
                name: "CourseId",
                table: "Comment");

            migrationBuilder.DropColumn(
                name: "LessonId",
                table: "Comment");
        }
    }
}
