using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Backend.Migrations
{
    /// <inheritdoc />
    public partial class AddPropertyArEn : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "Name",
                table: "ZoomParticipants",
                newName: "NameEn");

            migrationBuilder.RenameColumn(
                name: "Title",
                table: "StudentAssignments",
                newName: "TitleEn");

            migrationBuilder.RenameColumn(
                name: "Title",
                table: "Quizzes",
                newName: "TitleEn");

            migrationBuilder.RenameColumn(
                name: "Description",
                table: "Quizzes",
                newName: "DescriptionEn");

            migrationBuilder.RenameColumn(
                name: "Status",
                table: "Payments",
                newName: "StatusEn");

            migrationBuilder.RenameColumn(
                name: "Topic",
                table: "Meetings",
                newName: "TopicEn");

            migrationBuilder.RenameColumn(
                name: "Title",
                table: "Materials",
                newName: "TitleEn");

            migrationBuilder.RenameColumn(
                name: "Content",
                table: "Materials",
                newName: "ContentEn");

            migrationBuilder.RenameColumn(
                name: "RejectionReason",
                table: "ManualPayments",
                newName: "RejectionReasonEn");

            migrationBuilder.RenameColumn(
                name: "Title",
                table: "Lessons",
                newName: "TitleEn");

            migrationBuilder.RenameColumn(
                name: "Description",
                table: "Lessons",
                newName: "TitleAr");

            migrationBuilder.RenameColumn(
                name: "Title",
                table: "Courses",
                newName: "TitleEn");

            migrationBuilder.RenameColumn(
                name: "Level",
                table: "Courses",
                newName: "LevelEn");

            migrationBuilder.RenameColumn(
                name: "Description",
                table: "Courses",
                newName: "LevelAr");

            migrationBuilder.RenameColumn(
                name: "Title",
                table: "Comment",
                newName: "TitleEn");

            migrationBuilder.RenameColumn(
                name: "Content",
                table: "Comment",
                newName: "ContentEn");

            migrationBuilder.RenameColumn(
                name: "Content",
                table: "ChatMessages",
                newName: "ContentEn");

            migrationBuilder.RenameColumn(
                name: "CategoryName",
                table: "Categories",
                newName: "CategoryNameEn");

            migrationBuilder.RenameColumn(
                name: "Specialization",
                table: "AspNetUsers",
                newName: "SpecializationEn");

            migrationBuilder.RenameColumn(
                name: "Name",
                table: "AspNetUsers",
                newName: "UserTypeEn");

            migrationBuilder.RenameColumn(
                name: "AdditionalInfo",
                table: "AspNetUsers",
                newName: "SpecializationAr");

            migrationBuilder.AddColumn<string>(
                name: "NameAr",
                table: "ZoomParticipants",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "Name",
                table: "StudentAssignments",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "TitleAr",
                table: "StudentAssignments",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "DescriptionAr",
                table: "Quizzes",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "TitleAr",
                table: "Quizzes",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "StatusAr",
                table: "Payments",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "TopicAr",
                table: "Meetings",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "ContentAr",
                table: "Materials",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "TitleAr",
                table: "Materials",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "RejectionReasonAr",
                table: "ManualPayments",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "DescriptionAr",
                table: "Lessons",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "DescriptionEn",
                table: "Lessons",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "DescriptionAr",
                table: "Courses",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "DescriptionEn",
                table: "Courses",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "TitleAr",
                table: "Courses",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "ContentAr",
                table: "Comment",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "TitleAr",
                table: "Comment",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "ContentAr",
                table: "ChatMessages",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "CategoryNameAr",
                table: "Categories",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "AdditionalInfoAr",
                table: "AspNetUsers",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "AdditionalInfoEn",
                table: "AspNetUsers",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "NameAr",
                table: "AspNetUsers",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "NameEn",
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
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "NameAr",
                table: "ZoomParticipants");

            migrationBuilder.DropColumn(
                name: "Name",
                table: "StudentAssignments");

            migrationBuilder.DropColumn(
                name: "TitleAr",
                table: "StudentAssignments");

            migrationBuilder.DropColumn(
                name: "DescriptionAr",
                table: "Quizzes");

            migrationBuilder.DropColumn(
                name: "TitleAr",
                table: "Quizzes");

            migrationBuilder.DropColumn(
                name: "StatusAr",
                table: "Payments");

            migrationBuilder.DropColumn(
                name: "TopicAr",
                table: "Meetings");

            migrationBuilder.DropColumn(
                name: "ContentAr",
                table: "Materials");

            migrationBuilder.DropColumn(
                name: "TitleAr",
                table: "Materials");

            migrationBuilder.DropColumn(
                name: "RejectionReasonAr",
                table: "ManualPayments");

            migrationBuilder.DropColumn(
                name: "DescriptionAr",
                table: "Lessons");

            migrationBuilder.DropColumn(
                name: "DescriptionEn",
                table: "Lessons");

            migrationBuilder.DropColumn(
                name: "DescriptionAr",
                table: "Courses");

            migrationBuilder.DropColumn(
                name: "DescriptionEn",
                table: "Courses");

            migrationBuilder.DropColumn(
                name: "TitleAr",
                table: "Courses");

            migrationBuilder.DropColumn(
                name: "ContentAr",
                table: "Comment");

            migrationBuilder.DropColumn(
                name: "TitleAr",
                table: "Comment");

            migrationBuilder.DropColumn(
                name: "ContentAr",
                table: "ChatMessages");

            migrationBuilder.DropColumn(
                name: "CategoryNameAr",
                table: "Categories");

            migrationBuilder.DropColumn(
                name: "AdditionalInfoAr",
                table: "AspNetUsers");

            migrationBuilder.DropColumn(
                name: "AdditionalInfoEn",
                table: "AspNetUsers");

            migrationBuilder.DropColumn(
                name: "NameAr",
                table: "AspNetUsers");

            migrationBuilder.DropColumn(
                name: "NameEn",
                table: "AspNetUsers");

            migrationBuilder.DropColumn(
                name: "UserTypeAr",
                table: "AspNetUsers");

            migrationBuilder.RenameColumn(
                name: "NameEn",
                table: "ZoomParticipants",
                newName: "Name");

            migrationBuilder.RenameColumn(
                name: "TitleEn",
                table: "StudentAssignments",
                newName: "Title");

            migrationBuilder.RenameColumn(
                name: "TitleEn",
                table: "Quizzes",
                newName: "Title");

            migrationBuilder.RenameColumn(
                name: "DescriptionEn",
                table: "Quizzes",
                newName: "Description");

            migrationBuilder.RenameColumn(
                name: "StatusEn",
                table: "Payments",
                newName: "Status");

            migrationBuilder.RenameColumn(
                name: "TopicEn",
                table: "Meetings",
                newName: "Topic");

            migrationBuilder.RenameColumn(
                name: "TitleEn",
                table: "Materials",
                newName: "Title");

            migrationBuilder.RenameColumn(
                name: "ContentEn",
                table: "Materials",
                newName: "Content");

            migrationBuilder.RenameColumn(
                name: "RejectionReasonEn",
                table: "ManualPayments",
                newName: "RejectionReason");

            migrationBuilder.RenameColumn(
                name: "TitleEn",
                table: "Lessons",
                newName: "Title");

            migrationBuilder.RenameColumn(
                name: "TitleAr",
                table: "Lessons",
                newName: "Description");

            migrationBuilder.RenameColumn(
                name: "TitleEn",
                table: "Courses",
                newName: "Title");

            migrationBuilder.RenameColumn(
                name: "LevelEn",
                table: "Courses",
                newName: "Level");

            migrationBuilder.RenameColumn(
                name: "LevelAr",
                table: "Courses",
                newName: "Description");

            migrationBuilder.RenameColumn(
                name: "TitleEn",
                table: "Comment",
                newName: "Title");

            migrationBuilder.RenameColumn(
                name: "ContentEn",
                table: "Comment",
                newName: "Content");

            migrationBuilder.RenameColumn(
                name: "ContentEn",
                table: "ChatMessages",
                newName: "Content");

            migrationBuilder.RenameColumn(
                name: "CategoryNameEn",
                table: "Categories",
                newName: "CategoryName");

            migrationBuilder.RenameColumn(
                name: "UserTypeEn",
                table: "AspNetUsers",
                newName: "Name");

            migrationBuilder.RenameColumn(
                name: "SpecializationEn",
                table: "AspNetUsers",
                newName: "Specialization");

            migrationBuilder.RenameColumn(
                name: "SpecializationAr",
                table: "AspNetUsers",
                newName: "AdditionalInfo");
        }
    }
}
