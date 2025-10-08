using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Backend.Migrations
{
    /// <inheritdoc />
    public partial class ActivityLog : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            //migrationBuilder.AddColumn<string>(
            //    name: "City",
            //    table: "SystemLogs",
            //    type: "nvarchar(max)",
            //    nullable: true);

            //migrationBuilder.AddColumn<string>(
            //    name: "Country",
            //    table: "SystemLogs",
            //    type: "nvarchar(max)",
            //    nullable: true);

            //migrationBuilder.AddColumn<string>(
            //    name: "IPAddress",
            //    table: "SystemLogs",
            //    type: "nvarchar(max)",
            //    nullable: true);

            //migrationBuilder.AddColumn<string>(
            //    name: "Location",
            //    table: "SystemLogs",
            //    type: "nvarchar(max)",
            //    nullable: true);

            //migrationBuilder.AddColumn<int>(
            //    name: "LogHappenIn",
            //    table: "SystemLogs",
            //    type: "int",
            //    nullable: true);

            //migrationBuilder.AddColumn<int>(
            //    name: "LogHappenInId",
            //    table: "SystemLogs",
            //    type: "int",
            //    nullable: true);

            //migrationBuilder.AddColumn<string>(
            //    name: "Method",
            //    table: "SystemLogs",
            //    type: "nvarchar(max)",
            //    nullable: true);

            //migrationBuilder.AddColumn<string>(
            //    name: "Organization",
            //    table: "SystemLogs",
            //    type: "nvarchar(max)",
            //    nullable: true);

            //migrationBuilder.AddColumn<string>(
            //    name: "Path",
            //    table: "SystemLogs",
            //    type: "nvarchar(max)",
            //    nullable: true);

            //migrationBuilder.AddColumn<string>(
            //    name: "Region",
            //    table: "SystemLogs",
            //    type: "nvarchar(max)",
            //    nullable: true);

            //migrationBuilder.AlterColumn<bool>(
            //    name: "IsDeleted",
            //    table: "Courses",
            //    type: "bit",
            //    nullable: false,
            //    defaultValue: false,
            //    oldClrType: typeof(bool),
            //    oldType: "bit",
            //    oldNullable: true);

            migrationBuilder.CreateTable(
                name: "ActivityLogs",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    UserId = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    ActionType = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Description = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Url = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    IpAddress = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    UserAgent = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Timestamp = table.Column<DateTime>(type: "datetime2", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ActivityLogs", x => x.Id);
                });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "ActivityLogs");

            migrationBuilder.DropColumn(
                name: "City",
                table: "SystemLogs");

            migrationBuilder.DropColumn(
                name: "Country",
                table: "SystemLogs");

            migrationBuilder.DropColumn(
                name: "IPAddress",
                table: "SystemLogs");

            migrationBuilder.DropColumn(
                name: "Location",
                table: "SystemLogs");

            migrationBuilder.DropColumn(
                name: "LogHappenIn",
                table: "SystemLogs");

            migrationBuilder.DropColumn(
                name: "LogHappenInId",
                table: "SystemLogs");

            migrationBuilder.DropColumn(
                name: "Method",
                table: "SystemLogs");

            migrationBuilder.DropColumn(
                name: "Organization",
                table: "SystemLogs");

            migrationBuilder.DropColumn(
                name: "Path",
                table: "SystemLogs");

            migrationBuilder.DropColumn(
                name: "Region",
                table: "SystemLogs");

            migrationBuilder.AlterColumn<bool>(
                name: "IsDeleted",
                table: "Courses",
                type: "bit",
                nullable: true,
                oldClrType: typeof(bool),
                oldType: "bit");
        }
    }
}
