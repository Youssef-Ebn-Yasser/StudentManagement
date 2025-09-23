using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Backend.Migrations
{
    /// <inheritdoc />
    public partial class fixErrorInStudentCourse : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_studentCourses_AspNetUsers_StudentId",
                table: "studentCourses");

            migrationBuilder.AlterColumn<int>(
                name: "StudentId",
                table: "studentCourses",
                type: "int",
                nullable: false,
                defaultValue: 0,
                oldClrType: typeof(int),
                oldType: "int",
                oldNullable: true);

            migrationBuilder.CreateTable(
                name: "depend",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: true),
                    Name = table.Column<string>(type: "nvarchar(max)", nullable: true)
                },
                constraints: table =>
                {
                });

            migrationBuilder.AddForeignKey(
                name: "FK_studentCourses_AspNetUsers_StudentId",
                table: "studentCourses",
                column: "StudentId",
                principalTable: "AspNetUsers",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_studentCourses_AspNetUsers_StudentId",
                table: "studentCourses");

            migrationBuilder.DropTable(
                name: "depend");

            migrationBuilder.AlterColumn<int>(
                name: "StudentId",
                table: "studentCourses",
                type: "int",
                nullable: true,
                oldClrType: typeof(int),
                oldType: "int");

            migrationBuilder.AddForeignKey(
                name: "FK_studentCourses_AspNetUsers_StudentId",
                table: "studentCourses",
                column: "StudentId",
                principalTable: "AspNetUsers",
                principalColumn: "Id");
        }
    }
}
