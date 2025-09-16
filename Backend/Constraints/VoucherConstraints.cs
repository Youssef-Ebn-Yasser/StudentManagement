namespace Backend.Constraints;

public static class VoucherEntityConfiguration
{
    public static void ConfigureVoucher(this ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Voucher>(entity =>
        {
            // CreatedBy → keep cascade
            entity.HasOne(v => v.User)
                .WithMany()
                .HasForeignKey(v => v.CreatedById)
                .OnDelete(DeleteBehavior.Cascade);

            // isUsedBy → disable cascade
            entity.HasOne(v => v.Student)
                .WithMany()
                .HasForeignKey(v => v.isUsedById)
                .OnDelete(DeleteBehavior.NoAction);
            // or .OnDelete(DeleteBehavior.NoAction);
        });
    }
}