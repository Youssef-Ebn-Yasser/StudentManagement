using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Backend.Migrations
{
    /// <inheritdoc />
    public partial class addVedioDetails : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "VedioesDetails",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false),
                    EnableDownloadedUrl = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    DisableDownloadedUrl = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    VedioPermision = table.Column<int>(type: "int", nullable: false),
                    RelatedById = table.Column<int>(type: "int", nullable: false),
                    UploadedById = table.Column<int>(type: "int", nullable: false),
                    VedioUploadedBy = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_VedioesDetails", x => x.Id);
                });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "VedioesDetails");
        }
    }
}
