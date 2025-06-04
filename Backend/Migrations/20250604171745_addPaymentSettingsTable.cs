using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Backend.Migrations
{
    /// <inheritdoc />
    public partial class addPaymentSettingsTable : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_StudentQuestionOptions_StudentQuestionAnswers_StudentQuestionAnswerId",
                table: "StudentQuestionOptions");

            migrationBuilder.CreateTable(
                name: "PaymentSettings",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    VodafoneCashNumber = table.Column<string>(type: "nvarchar(max)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_PaymentSettings", x => x.Id);
                });

            migrationBuilder.AddForeignKey(
                name: "FK_StudentQuestionOptions_StudentQuestionAnswers_StudentQuestionAnswerId",
                table: "StudentQuestionOptions",
                column: "StudentQuestionAnswerId",
                principalTable: "StudentQuestionAnswers",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_StudentQuestionOptions_StudentQuestionAnswers_StudentQuestionAnswerId",
                table: "StudentQuestionOptions");

            migrationBuilder.DropTable(
                name: "PaymentSettings");

            migrationBuilder.AddForeignKey(
                name: "FK_StudentQuestionOptions_StudentQuestionAnswers_StudentQuestionAnswerId",
                table: "StudentQuestionOptions",
                column: "StudentQuestionAnswerId",
                principalTable: "StudentQuestionAnswers",
                principalColumn: "Id");
        }
    }
}
