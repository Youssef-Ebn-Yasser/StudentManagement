using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Backend.Migrations
{
    /// <inheritdoc />
    public partial class InitialCreate : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            //migrationBuilder.DropForeignKey(
            //    name: "FK_Comments_Payments_StudentId",
            //    table: "Comments");

            migrationBuilder.DropForeignKey(
                name: "FK_Lessons_Courses_CourseId",
                table: "Lessons");

            migrationBuilder.DropForeignKey(
                name: "FK_Materials_Lessons_LessonId",
                table: "Materials");

            //migrationBuilder.DropForeignKey(
            //    name: "FK_Payments_Payments_StudentId",
            //    table: "Payments");

            migrationBuilder.DropForeignKey(
                name: "FK_StudentAssignments_Lessons_LessonId",
                table: "StudentAssignments");

            //migrationBuilder.DropForeignKey(
            //    name: "FK_StudentAssignments_Payments_StudentId",
            //    table: "StudentAssignments");

            //migrationBuilder.DropForeignKey(
            //    name: "FK_StudentCourses_Courses_CourseId",
            //    table: "StudentCourses");

            //migrationBuilder.DropForeignKey(
            //    name: "FK_StudentCourses_Payments_StudentId",
            //    table: "StudentCourses");

            migrationBuilder.DropPrimaryKey(
                name: "PK_StudentCourses",
                table: "StudentCourses");

            //migrationBuilder.DropPrimaryKey(
            //    name: "PK_Lessons",
            //    table: "Lessons");

            //migrationBuilder.DropPrimaryKey(
            //    name: "PK_Comments",
            //    table: "Comments");

            //migrationBuilder.RenameTable(
            //    name: "StudentCourses",
            //    newName: "studentCourses");

            //migrationBuilder.RenameTable(
            //    name: "Lessons",
            //    newName: "Lesson");

            //migrationBuilder.RenameTable(
            //    name: "Comments",
            //    newName: "Comment");

            //migrationBuilder.RenameIndex(
            //    name: "IX_StudentCourses_StudentId",
            //    table: "studentCourses",
            //    newName: "IX_studentCourses_StudentId");

            //migrationBuilder.RenameIndex(
            //    name: "IX_StudentCourses_CourseId",
            //    table: "studentCourses",
            //    newName: "IX_studentCourses_CourseId");

            //migrationBuilder.RenameIndex(
            //    name: "IX_Lessons_CourseId",
            //    table: "Lesson",
            //    newName: "IX_Lesson_CourseId");

            //migrationBuilder.RenameIndex(
            //    name: "IX_Comments_StudentId",
            //    table: "Comment",
            //    newName: "IX_Comment_StudentId");

            //migrationBuilder.AlterColumn<string>(
            //    name: "NationalId",
            //    table: "User",
            //    type: "nvarchar(max)",
            //    nullable: true,
            //    oldClrType: typeof(string),
            //    oldType: "nvarchar(14)",
            //    oldMaxLength: 14,
            //    oldNullable: true);

            //migrationBuilder.AlterColumn<int>(
            //    name: "StudentId",
            //    table: "Payments",
            //    type: "int",
            //    nullable: true,
            //    oldClrType: typeof(int),
            //    oldType: "int");

            //migrationBuilder.AlterColumn<string>(
            //    name: "Path",
            //    table: "Materials",
            //    type: "nvarchar(max)",
            //    nullable: true,
            //    oldClrType: typeof(string),
            //    oldType: "nvarchar(250)",
            //    oldMaxLength: 250);

            //migrationBuilder.AlterColumn<string>(
            //    name: "Content",
            //    table: "Materials",
            //    type: "nvarchar(max)",
            //    nullable: true,
            //    oldClrType: typeof(string),
            //    oldType: "nvarchar(500)",
            //    oldMaxLength: 500);

            //migrationBuilder.AlterColumn<string>(
            //    name: "ImagePath",
            //    table: "Courses",
            //    type: "nvarchar(max)",
            //    nullable: true,
            //    oldClrType: typeof(string),
            //    oldType: "nvarchar(250)",
            //    oldMaxLength: 250,
            //    oldNullable: true);

            //migrationBuilder.AlterColumn<string>(
            //    name: "Description",
            //    table: "Courses",
            //    type: "nvarchar(max)",
            //    nullable: true,
            //    oldClrType: typeof(string),
            //    oldType: "nvarchar(250)",
            //    oldMaxLength: 250,
            //    oldNullable: true);

            //migrationBuilder.AddPrimaryKey(
            //    name: "PK_studentCourses",
            //    table: "studentCourses",
            //    column: "Id");

            //migrationBuilder.AddPrimaryKey(
            //    name: "PK_Lesson",
            //    table: "Lesson",
            //    column: "Id");

            //migrationBuilder.AddPrimaryKey(
            //    name: "PK_Comment",
            //    table: "Comment",
            //    column: "Id");

            //migrationBuilder.AddForeignKey(
            //    name: "FK_Comment_User_StudentId",
            //    table: "Comment",
            //    column: "StudentId",
            //    principalTable: "User",
            //    principalColumn: "Id");

            //migrationBuilder.AddForeignKey(
            //    name: "FK_Lesson_Courses_CourseId",
            //    table: "Lesson",
            //    column: "CourseId",
            //    principalTable: "Courses",
            //    principalColumn: "Id");

            //migrationBuilder.AddForeignKey(
            //    name: "FK_Materials_Lesson_LessonId",
            //    table: "Materials",
            //    column: "LessonId",
            //    principalTable: "Lesson",
            //    principalColumn: "Id",
            //    onDelete: ReferentialAction.Cascade);

            //migrationBuilder.AddForeignKey(
            //    name: "FK_Payments_User_StudentId",
            //    table: "Payments",
            //    column: "StudentId",
            //    principalTable: "User",
            //    principalColumn: "Id",
            //    onDelete: ReferentialAction.Restrict);

            //migrationBuilder.AddForeignKey(
            //    name: "FK_StudentAssignments_Lesson_LessonId",
            //    table: "StudentAssignments",
            //    column: "LessonId",
            //    principalTable: "Lesson",
            //    principalColumn: "Id");

            //migrationBuilder.AddForeignKey(
            //    name: "FK_StudentAssignments_User_StudentId",
            //    table: "StudentAssignments",
            //    column: "StudentId",
            //    principalTable: "User",
            //    principalColumn: "Id",
            //    onDelete: ReferentialAction.Cascade);

            //migrationBuilder.AddForeignKey(
            //    name: "FK_studentCourses_Courses_CourseId",
            //    table: "studentCourses",
            //    column: "CourseId",
            //    principalTable: "Courses",
            //    principalColumn: "Id",
            //    onDelete: ReferentialAction.Restrict);

            //migrationBuilder.AddForeignKey(
            //    name: "FK_studentCourses_User_StudentId",
            //    table: "studentCourses",
            //    column: "StudentId",
            //    principalTable: "User",
            //    principalColumn: "Id",
            //    onDelete: ReferentialAction.Restrict);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Comment_User_StudentId",
                table: "Comment");

            migrationBuilder.DropForeignKey(
                name: "FK_Lesson_Courses_CourseId",
                table: "Lesson");

            migrationBuilder.DropForeignKey(
                name: "FK_Materials_Lesson_LessonId",
                table: "Materials");

            migrationBuilder.DropForeignKey(
                name: "FK_Payments_User_StudentId",
                table: "Payments");

            migrationBuilder.DropForeignKey(
                name: "FK_StudentAssignments_Lesson_LessonId",
                table: "StudentAssignments");

            migrationBuilder.DropForeignKey(
                name: "FK_StudentAssignments_User_StudentId",
                table: "StudentAssignments");

            migrationBuilder.DropForeignKey(
                name: "FK_studentCourses_Courses_CourseId",
                table: "studentCourses");

            migrationBuilder.DropForeignKey(
                name: "FK_studentCourses_User_StudentId",
                table: "studentCourses");

            migrationBuilder.DropPrimaryKey(
                name: "PK_studentCourses",
                table: "studentCourses");

            migrationBuilder.DropPrimaryKey(
                name: "PK_Lesson",
                table: "Lesson");

            migrationBuilder.DropPrimaryKey(
                name: "PK_Comment",
                table: "Comment");

            migrationBuilder.RenameTable(
                name: "studentCourses",
                newName: "StudentCourses");

            migrationBuilder.RenameTable(
                name: "Lesson",
                newName: "Lessons");

            migrationBuilder.RenameTable(
                name: "Comment",
                newName: "Comments");

            migrationBuilder.RenameIndex(
                name: "IX_studentCourses_StudentId",
                table: "StudentCourses",
                newName: "IX_StudentCourses_StudentId");

            migrationBuilder.RenameIndex(
                name: "IX_studentCourses_CourseId",
                table: "StudentCourses",
                newName: "IX_StudentCourses_CourseId");

            migrationBuilder.RenameIndex(
                name: "IX_Lesson_CourseId",
                table: "Lessons",
                newName: "IX_Lessons_CourseId");

            migrationBuilder.RenameIndex(
                name: "IX_Comment_StudentId",
                table: "Comments",
                newName: "IX_Comments_StudentId");

            migrationBuilder.AlterColumn<string>(
                name: "NationalId",
                table: "User",
                type: "nvarchar(14)",
                maxLength: 14,
                nullable: true,
                oldClrType: typeof(string),
                oldType: "nvarchar(max)",
                oldNullable: true);

            migrationBuilder.AlterColumn<int>(
                name: "StudentId",
                table: "Payments",
                type: "int",
                nullable: false,
                defaultValue: 0,
                oldClrType: typeof(int),
                oldType: "int",
                oldNullable: true);

            migrationBuilder.AlterColumn<string>(
                name: "Path",
                table: "Materials",
                type: "nvarchar(250)",
                maxLength: 250,
                nullable: false,
                defaultValue: "",
                oldClrType: typeof(string),
                oldType: "nvarchar(max)",
                oldNullable: true);

            migrationBuilder.AlterColumn<string>(
                name: "Content",
                table: "Materials",
                type: "nvarchar(500)",
                maxLength: 500,
                nullable: false,
                defaultValue: "",
                oldClrType: typeof(string),
                oldType: "nvarchar(max)",
                oldNullable: true);

            migrationBuilder.AlterColumn<string>(
                name: "ImagePath",
                table: "Courses",
                type: "nvarchar(250)",
                maxLength: 250,
                nullable: true,
                oldClrType: typeof(string),
                oldType: "nvarchar(max)",
                oldNullable: true);

            migrationBuilder.AlterColumn<string>(
                name: "Description",
                table: "Courses",
                type: "nvarchar(250)",
                maxLength: 250,
                nullable: true,
                oldClrType: typeof(string),
                oldType: "nvarchar(max)",
                oldNullable: true);

            migrationBuilder.AddPrimaryKey(
                name: "PK_StudentCourses",
                table: "StudentCourses",
                column: "Id");

            migrationBuilder.AddPrimaryKey(
                name: "PK_Lessons",
                table: "Lessons",
                column: "Id");

            migrationBuilder.AddPrimaryKey(
                name: "PK_Comments",
                table: "Comments",
                column: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_Comments_Payments_StudentId",
                table: "Comments",
                column: "StudentId",
                principalTable: "Payments",
                principalColumn: "Id");

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
                name: "FK_Payments_Payments_StudentId",
                table: "Payments",
                column: "StudentId",
                principalTable: "Payments",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_StudentAssignments_Lessons_LessonId",
                table: "StudentAssignments",
                column: "LessonId",
                principalTable: "Lessons",
                principalColumn: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_StudentAssignments_Payments_StudentId",
                table: "StudentAssignments",
                column: "StudentId",
                principalTable: "Payments",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_StudentCourses_Courses_CourseId",
                table: "StudentCourses",
                column: "CourseId",
                principalTable: "Courses",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_StudentCourses_Payments_StudentId",
                table: "StudentCourses",
                column: "StudentId",
                principalTable: "Payments",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);
        }
    }
}
