using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Backend.Migrations
{
    /// <inheritdoc />
    public partial class FixForignKey : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Assignments_Courses_CourseId1",
                table: "Assignments");

            migrationBuilder.DropForeignKey(
                name: "FK_Materials_Courses_CourseId1",
                table: "Materials");

            migrationBuilder.DropForeignKey(
                name: "FK_Payments_students_StudentId1",
                table: "Payments");

            migrationBuilder.DropForeignKey(
                name: "FK_studentCourses_Courses_CourseId1",
                table: "studentCourses");

            migrationBuilder.DropForeignKey(
                name: "FK_studentCourses_students_StudentId1",
                table: "studentCourses");

            migrationBuilder.DropIndex(
                name: "IX_studentCourses_CourseId1",
                table: "studentCourses");

            migrationBuilder.DropIndex(
                name: "IX_studentCourses_StudentId1",
                table: "studentCourses");

            migrationBuilder.DropIndex(
                name: "IX_Payments_StudentId1",
                table: "Payments");

            migrationBuilder.DropIndex(
                name: "IX_Materials_CourseId1",
                table: "Materials");

            migrationBuilder.DropIndex(
                name: "IX_Assignments_CourseId1",
                table: "Assignments");

            migrationBuilder.DropColumn(
                name: "CourseId1",
                table: "studentCourses");

            migrationBuilder.DropColumn(
                name: "StudentId1",
                table: "studentCourses");

            migrationBuilder.DropColumn(
                name: "StudentId1",
                table: "Payments");

            migrationBuilder.DropColumn(
                name: "CourseId1",
                table: "Materials");

            migrationBuilder.DropColumn(
                name: "CourseId1",
                table: "Assignments");

            migrationBuilder.AlterColumn<string>(
                name: "StudentId",
                table: "studentCourses",
                type: "nvarchar(450)",
                nullable: false,
                oldClrType: typeof(int),
                oldType: "int");

            migrationBuilder.AlterColumn<string>(
                name: "CourseId",
                table: "studentCourses",
                type: "nvarchar(450)",
                nullable: false,
                oldClrType: typeof(int),
                oldType: "int");

            migrationBuilder.AlterColumn<string>(
                name: "StudentId",
                table: "Payments",
                type: "nvarchar(450)",
                nullable: false,
                oldClrType: typeof(int),
                oldType: "int");

            migrationBuilder.AlterColumn<string>(
                name: "CourseId",
                table: "Materials",
                type: "nvarchar(450)",
                nullable: false,
                oldClrType: typeof(int),
                oldType: "int");

            migrationBuilder.AlterColumn<string>(
                name: "CourseId",
                table: "Assignments",
                type: "nvarchar(450)",
                nullable: false,
                oldClrType: typeof(int),
                oldType: "int");

            migrationBuilder.CreateIndex(
                name: "IX_studentCourses_CourseId",
                table: "studentCourses",
                column: "CourseId");

            migrationBuilder.CreateIndex(
                name: "IX_studentCourses_StudentId",
                table: "studentCourses",
                column: "StudentId");

            migrationBuilder.CreateIndex(
                name: "IX_Payments_StudentId",
                table: "Payments",
                column: "StudentId");

            migrationBuilder.CreateIndex(
                name: "IX_Materials_CourseId",
                table: "Materials",
                column: "CourseId");

            migrationBuilder.CreateIndex(
                name: "IX_Assignments_CourseId",
                table: "Assignments",
                column: "CourseId");

            migrationBuilder.AddForeignKey(
                name: "FK_Assignments_Courses_CourseId",
                table: "Assignments",
                column: "CourseId",
                principalTable: "Courses",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_Materials_Courses_CourseId",
                table: "Materials",
                column: "CourseId",
                principalTable: "Courses",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_Payments_students_StudentId",
                table: "Payments",
                column: "StudentId",
                principalTable: "students",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_studentCourses_Courses_CourseId",
                table: "studentCourses",
                column: "CourseId",
                principalTable: "Courses",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_studentCourses_students_StudentId",
                table: "studentCourses",
                column: "StudentId",
                principalTable: "students",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Assignments_Courses_CourseId",
                table: "Assignments");

            migrationBuilder.DropForeignKey(
                name: "FK_Materials_Courses_CourseId",
                table: "Materials");

            migrationBuilder.DropForeignKey(
                name: "FK_Payments_students_StudentId",
                table: "Payments");

            migrationBuilder.DropForeignKey(
                name: "FK_studentCourses_Courses_CourseId",
                table: "studentCourses");

            migrationBuilder.DropForeignKey(
                name: "FK_studentCourses_students_StudentId",
                table: "studentCourses");

            migrationBuilder.DropIndex(
                name: "IX_studentCourses_CourseId",
                table: "studentCourses");

            migrationBuilder.DropIndex(
                name: "IX_studentCourses_StudentId",
                table: "studentCourses");

            migrationBuilder.DropIndex(
                name: "IX_Payments_StudentId",
                table: "Payments");

            migrationBuilder.DropIndex(
                name: "IX_Materials_CourseId",
                table: "Materials");

            migrationBuilder.DropIndex(
                name: "IX_Assignments_CourseId",
                table: "Assignments");

            migrationBuilder.AlterColumn<int>(
                name: "StudentId",
                table: "studentCourses",
                type: "int",
                nullable: false,
                oldClrType: typeof(string),
                oldType: "nvarchar(450)");

            migrationBuilder.AlterColumn<int>(
                name: "CourseId",
                table: "studentCourses",
                type: "int",
                nullable: false,
                oldClrType: typeof(string),
                oldType: "nvarchar(450)");

            migrationBuilder.AddColumn<string>(
                name: "CourseId1",
                table: "studentCourses",
                type: "nvarchar(450)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "StudentId1",
                table: "studentCourses",
                type: "nvarchar(450)",
                nullable: true);

            migrationBuilder.AlterColumn<int>(
                name: "StudentId",
                table: "Payments",
                type: "int",
                nullable: false,
                oldClrType: typeof(string),
                oldType: "nvarchar(450)");

            migrationBuilder.AddColumn<string>(
                name: "StudentId1",
                table: "Payments",
                type: "nvarchar(450)",
                nullable: true);

            migrationBuilder.AlterColumn<int>(
                name: "CourseId",
                table: "Materials",
                type: "int",
                nullable: false,
                oldClrType: typeof(string),
                oldType: "nvarchar(450)");

            migrationBuilder.AddColumn<string>(
                name: "CourseId1",
                table: "Materials",
                type: "nvarchar(450)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AlterColumn<int>(
                name: "CourseId",
                table: "Assignments",
                type: "int",
                nullable: false,
                oldClrType: typeof(string),
                oldType: "nvarchar(450)");

            migrationBuilder.AddColumn<string>(
                name: "CourseId1",
                table: "Assignments",
                type: "nvarchar(450)",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_studentCourses_CourseId1",
                table: "studentCourses",
                column: "CourseId1");

            migrationBuilder.CreateIndex(
                name: "IX_studentCourses_StudentId1",
                table: "studentCourses",
                column: "StudentId1");

            migrationBuilder.CreateIndex(
                name: "IX_Payments_StudentId1",
                table: "Payments",
                column: "StudentId1");

            migrationBuilder.CreateIndex(
                name: "IX_Materials_CourseId1",
                table: "Materials",
                column: "CourseId1");

            migrationBuilder.CreateIndex(
                name: "IX_Assignments_CourseId1",
                table: "Assignments",
                column: "CourseId1");

            migrationBuilder.AddForeignKey(
                name: "FK_Assignments_Courses_CourseId1",
                table: "Assignments",
                column: "CourseId1",
                principalTable: "Courses",
                principalColumn: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_Materials_Courses_CourseId1",
                table: "Materials",
                column: "CourseId1",
                principalTable: "Courses",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_Payments_students_StudentId1",
                table: "Payments",
                column: "StudentId1",
                principalTable: "students",
                principalColumn: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_studentCourses_Courses_CourseId1",
                table: "studentCourses",
                column: "CourseId1",
                principalTable: "Courses",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_studentCourses_students_StudentId1",
                table: "studentCourses",
                column: "StudentId1",
                principalTable: "students",
                principalColumn: "Id");
        }
    }
}
