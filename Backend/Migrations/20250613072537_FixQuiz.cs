using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Backend.Migrations
{
    /// <inheritdoc />
    public partial class FixQuiz : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "IX_StudentQuestionAnswers_studentQuizeAnswerId",
                table: "StudentQuestionAnswers");

            migrationBuilder.DropColumn(
                name: "GradingRating",
                table: "Quizzes");

            migrationBuilder.CreateIndex(
                name: "IX_StudentQuestionAnswers_studentQuizeAnswerId",
                table: "StudentQuestionAnswers",
                column: "studentQuizeAnswerId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "IX_StudentQuestionAnswers_studentQuizeAnswerId",
                table: "StudentQuestionAnswers");

            migrationBuilder.AddColumn<decimal>(
                name: "GradingRating",
                table: "Quizzes",
                type: "decimal(18,2)",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_StudentQuestionAnswers_studentQuizeAnswerId",
                table: "StudentQuestionAnswers",
                column: "studentQuizeAnswerId",
                unique: true);
        }
    }
}
