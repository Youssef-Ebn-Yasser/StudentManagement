using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Backend.Migrations
{
    /// <inheritdoc />
    public partial class VedioDeleteProp : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<bool>(
                name: "IsDeleted",
                table: "VedioesDetails",
                type: "bit",
                nullable: false,
                defaultValue: false);

            //migrationBuilder.CreateTable(
            //    name: "SystemLogs",
            //    columns: table => new
            //    {
            //        Id = table.Column<int>(type: "int", nullable: false)
            //            .Annotation("SqlServer:Identity", "1, 1"),
            //        Email = table.Column<string>(type: "nvarchar(max)", nullable: true),
            //        Message = table.Column<string>(type: "nvarchar(max)", nullable: true),
            //        MessageTemplate = table.Column<string>(type: "nvarchar(max)", nullable: true),
            //        UserName = table.Column<string>(type: "nvarchar(max)", nullable: true),
            //        UserRole = table.Column<string>(type: "nvarchar(max)", nullable: true),
            //        Properties = table.Column<string>(type: "nvarchar(max)", nullable: true),
            //        Exception = table.Column<string>(type: "nvarchar(max)", nullable: true),
            //        Timestamp = table.Column<DateTime>(type: "datetime2", nullable: true),
            //        LogType = table.Column<int>(type: "int", nullable: true),
            //        Level = table.Column<string>(type: "nvarchar(max)", nullable: true)
            //    },
            //    constraints: table =>
            //    {
            //        table.PrimaryKey("PK_SystemLogs", x => x.Id);
            //    });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "SystemLogs");

            migrationBuilder.DropColumn(
                name: "IsDeleted",
                table: "VedioesDetails");
        }
    }
}
