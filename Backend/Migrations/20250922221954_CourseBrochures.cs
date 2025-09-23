using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Backend.Migrations
{
    /// <inheritdoc />
    public partial class CourseBrochures : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "CourseBrochures",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false),
                    Link = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    SavedIn = table.Column<int>(type: "int", nullable: false),
                    CourseId = table.Column<int>(type: "int", nullable: true),
                    UserUploadedId = table.Column<int>(type: "int", nullable: false),
                    IsDeleted = table.Column<bool>(type: "bit", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_CourseBrochures", x => x.Id);
                    table.ForeignKey(
                        name: "FK_CourseBrochures_AspNetUsers_UserUploadedId",
                        column: x => x.UserUploadedId,
                        principalTable: "AspNetUsers",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_CourseBrochures_Courses_CourseId",
                        column: x => x.CourseId,
                        principalTable: "Courses",
                        principalColumn: "Id");
                });

            migrationBuilder.CreateIndex(
                name: "IX_CourseBrochures_CourseId",
                table: "CourseBrochures",
                column: "CourseId");

            migrationBuilder.CreateIndex(
                name: "IX_CourseBrochures_UserUploadedId",
                table: "CourseBrochures",
                column: "UserUploadedId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "CourseBrochures");
        }
    }
}
