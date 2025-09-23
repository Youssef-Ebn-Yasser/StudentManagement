using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Backend.Migrations
{
    /// <inheritdoc />
    public partial class UpdateCourseBrochures : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_CourseBrochures_AspNetUsers_UserUploadedId",
                table: "CourseBrochures");

            migrationBuilder.DropIndex(
                name: "IX_CourseBrochures_UserUploadedId",
                table: "CourseBrochures");

            migrationBuilder.DropColumn(
                name: "UserUploadedId",
                table: "CourseBrochures");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "UserUploadedId",
                table: "CourseBrochures",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.CreateIndex(
                name: "IX_CourseBrochures_UserUploadedId",
                table: "CourseBrochures",
                column: "UserUploadedId");

            migrationBuilder.AddForeignKey(
                name: "FK_CourseBrochures_AspNetUsers_UserUploadedId",
                table: "CourseBrochures",
                column: "UserUploadedId",
                principalTable: "AspNetUsers",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
