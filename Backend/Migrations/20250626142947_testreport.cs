using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Backend.Migrations
{
    /// <inheritdoc />
    public partial class testreport : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Name",
                table: "AspNetUsers");

            migrationBuilder.DropColumn(
                name: "UserTypeAr",
                table: "AspNetUsers");

            migrationBuilder.DropColumn(
                name: "UserTypeEn",
                table: "AspNetUsers");

            migrationBuilder.RenameColumn(
                name: "Name",
                table: "StudentAssignments",
                newName: "NameEn");

            migrationBuilder.RenameColumn(
                name: "Content",
                table: "Materials",
                newName: "ContentAr");

            migrationBuilder.RenameColumn(
                name: "RejectionReason",
                table: "ManualPayments",
                newName: "RejectionReasonAr");

            migrationBuilder.RenameColumn(
                name: "Title",
                table: "Lessons",
                newName: "TitleAr");

            migrationBuilder.RenameColumn(
                name: "Description",
                table: "Lessons",
                newName: "DescriptionAr");

            migrationBuilder.RenameColumn(
                name: "Title",
                table: "Courses",
                newName: "TitleAr");

            migrationBuilder.RenameColumn(
                name: "Level",
                table: "Courses",
                newName: "LevelAr");

            migrationBuilder.RenameColumn(
                name: "Description",
                table: "Courses",
                newName: "DescriptionAr");

            migrationBuilder.RenameColumn(
                name: "Title",
                table: "Comment",
                newName: "TitleAr");

            migrationBuilder.RenameColumn(
                name: "Content",
                table: "Comment",
                newName: "ContentAr");

            migrationBuilder.AddColumn<string>(
                name: "NameAr",
                table: "StudentAssignments",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "AddressAr",
                table: "AspNetUsers",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "AddressEn",
                table: "AspNetUsers",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Admin_NationalId",
                table: "AspNetUsers",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "GovernmentAr",
                table: "AspNetUsers",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "GovernmentEn",
                table: "AspNetUsers",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "NameAr",
                table: "AspNetUsers",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "NameEn",
                table: "AspNetUsers",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<long>(
                name: "RandomCode",
                table: "AspNetUsers",
                type: "bigint",
                nullable: true);

            migrationBuilder.CreateTable(
                name: "StudentAttendances",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    StudentId = table.Column<int>(type: "int", nullable: false),
                    MeetingId = table.Column<int>(type: "int", nullable: false),
                    Status = table.Column<int>(type: "int", nullable: false),
                    Note = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Date = table.Column<DateTime>(type: "datetime2", nullable: false),
                    MeetingId1 = table.Column<string>(type: "nvarchar(450)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_StudentAttendances", x => x.Id);
                    table.ForeignKey(
                        name: "FK_StudentAttendances_AspNetUsers_StudentId",
                        column: x => x.StudentId,
                        principalTable: "AspNetUsers",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_StudentAttendances_Meetings_MeetingId1",
                        column: x => x.MeetingId1,
                        principalTable: "Meetings",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_StudentAttendances_MeetingId1",
                table: "StudentAttendances",
                column: "MeetingId1");

            migrationBuilder.CreateIndex(
                name: "IX_StudentAttendances_StudentId",
                table: "StudentAttendances",
                column: "StudentId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "StudentAttendances");

            migrationBuilder.DropColumn(
                name: "NameAr",
                table: "StudentAssignments");

            migrationBuilder.DropColumn(
                name: "AddressAr",
                table: "AspNetUsers");

            migrationBuilder.DropColumn(
                name: "AddressEn",
                table: "AspNetUsers");

            migrationBuilder.DropColumn(
                name: "Admin_NationalId",
                table: "AspNetUsers");

            migrationBuilder.DropColumn(
                name: "GovernmentAr",
                table: "AspNetUsers");

            migrationBuilder.DropColumn(
                name: "GovernmentEn",
                table: "AspNetUsers");

            migrationBuilder.DropColumn(
                name: "NameAr",
                table: "AspNetUsers");

            migrationBuilder.DropColumn(
                name: "NameEn",
                table: "AspNetUsers");

            migrationBuilder.DropColumn(
                name: "RandomCode",
                table: "AspNetUsers");

            migrationBuilder.RenameColumn(
                name: "NameEn",
                table: "StudentAssignments",
                newName: "Name");

            migrationBuilder.RenameColumn(
                name: "ContentAr",
                table: "Materials",
                newName: "Content");

            migrationBuilder.RenameColumn(
                name: "RejectionReasonAr",
                table: "ManualPayments",
                newName: "RejectionReason");

            migrationBuilder.RenameColumn(
                name: "TitleAr",
                table: "Lessons",
                newName: "Title");

            migrationBuilder.RenameColumn(
                name: "DescriptionAr",
                table: "Lessons",
                newName: "Description");

            migrationBuilder.RenameColumn(
                name: "TitleAr",
                table: "Courses",
                newName: "Title");

            migrationBuilder.RenameColumn(
                name: "LevelAr",
                table: "Courses",
                newName: "Level");

            migrationBuilder.RenameColumn(
                name: "DescriptionAr",
                table: "Courses",
                newName: "Description");

            migrationBuilder.RenameColumn(
                name: "TitleAr",
                table: "Comment",
                newName: "Title");

            migrationBuilder.RenameColumn(
                name: "ContentAr",
                table: "Comment",
                newName: "Content");

            migrationBuilder.AddColumn<string>(
                name: "Name",
                table: "AspNetUsers",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "UserTypeAr",
                table: "AspNetUsers",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "UserTypeEn",
                table: "AspNetUsers",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");
        }
    }
}
