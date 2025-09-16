using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Backend.Migrations
{
    /// <inheritdoc />
    public partial class splitFilePath : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "DisableDownloadedUrl",
                table: "VedioesDetails",
                newName: "DisableDownloadedFolder");

            migrationBuilder.AlterColumn<int>(
                name: "VedioFor",
                table: "VedioesDetails",
                type: "int",
                nullable: true,
                oldClrType: typeof(int),
                oldType: "int");

            migrationBuilder.AddColumn<string>(
                name: "DisableDownloadedFile",
                table: "VedioesDetails",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "DisableDownloadedFile",
                table: "VedioesDetails");

            migrationBuilder.RenameColumn(
                name: "DisableDownloadedFolder",
                table: "VedioesDetails",
                newName: "DisableDownloadedUrl");

            migrationBuilder.AlterColumn<int>(
                name: "VedioFor",
                table: "VedioesDetails",
                type: "int",
                nullable: false,
                defaultValue: 0,
                oldClrType: typeof(int),
                oldType: "int",
                oldNullable: true);
        }
    }
}
