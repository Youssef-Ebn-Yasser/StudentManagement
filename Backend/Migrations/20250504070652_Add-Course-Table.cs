using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Backend.Migrations
{
    /// <inheritdoc />
    public partial class AddCourseTable : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Lesson_Courses_CourseId",
                table: "Lesson");

            migrationBuilder.DropForeignKey(
                name: "FK_Materials_Lesson_LessonId",
                table: "Materials");

            migrationBuilder.DropForeignKey(
                name: "FK_StudentAssignments_Lesson_LessonId",
                table: "StudentAssignments");

            migrationBuilder.DropPrimaryKey(
                name: "PK_Lesson",
                table: "Lesson");

            migrationBuilder.RenameTable(
                name: "Lesson",
                newName: "Lessons");

            migrationBuilder.RenameIndex(
                name: "IX_Lesson_CourseId",
                table: "Lessons",
                newName: "IX_Lessons_CourseId");

            migrationBuilder.AddPrimaryKey(
                name: "PK_Lessons",
                table: "Lessons",
                column: "Id");

            migrationBuilder.CreateTable(
                name: "Comment",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Content = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false),
                    IsDeleted = table.Column<bool>(type: "bit", nullable: false),
                    StudentId = table.Column<int>(type: "int", nullable: true),
                    Title = table.Column<string>(type: "nvarchar(max)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Comment", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Comment_AspNetUsers_StudentId",
                        column: x => x.StudentId,
                        principalTable: "AspNetUsers",
                        principalColumn: "Id");
                });

            migrationBuilder.CreateIndex(
                name: "IX_Comment_StudentId",
                table: "Comment",
                column: "StudentId");

            migrationBuilder.AddForeignKey(
                name: "FK_Lessons_Courses_CourseId",
                table: "Lessons",
                column: "CourseId",
                principalTable: "Courses",
                principalColumn: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_Materials_Lessons_LessonId",
                table: "Materials",
                column: "LessonId",
                principalTable: "Lessons",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_StudentAssignments_Lessons_LessonId",
                table: "StudentAssignments",
                column: "LessonId",
                principalTable: "Lessons",
                principalColumn: "Id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Lessons_Courses_CourseId",
                table: "Lessons");

            migrationBuilder.DropForeignKey(
                name: "FK_Materials_Lessons_LessonId",
                table: "Materials");

            migrationBuilder.DropForeignKey(
                name: "FK_StudentAssignments_Lessons_LessonId",
                table: "StudentAssignments");

            migrationBuilder.DropTable(
                name: "Comment");

            migrationBuilder.DropPrimaryKey(
                name: "PK_Lessons",
                table: "Lessons");

            migrationBuilder.RenameTable(
                name: "Lessons",
                newName: "Lesson");

            migrationBuilder.RenameIndex(
                name: "IX_Lessons_CourseId",
                table: "Lesson",
                newName: "IX_Lesson_CourseId");

            migrationBuilder.AddPrimaryKey(
                name: "PK_Lesson",
                table: "Lesson",
                column: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_Lesson_Courses_CourseId",
                table: "Lesson",
                column: "CourseId",
                principalTable: "Courses",
                principalColumn: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_Materials_Lesson_LessonId",
                table: "Materials",
                column: "LessonId",
                principalTable: "Lesson",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_StudentAssignments_Lesson_LessonId",
                table: "StudentAssignments",
                column: "LessonId",
                principalTable: "Lesson",
                principalColumn: "Id");
        }
    }
}
