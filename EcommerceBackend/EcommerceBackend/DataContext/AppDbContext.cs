using EcommerceBackend.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion;

namespace EcommerceBackend.DataContext
{
	public class AppDbContext:DbContext
	{
		public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }
		public DbSet<User> Users { get; set; }
		public DbSet<Product> Products { get; set; }
		public DbSet<CartItem> CartItems { get; set; }
		public DbSet<Order> Orders { get; set; }
		public DbSet<OrderItem> OrderItems { get; set; }
		public DbSet<Review> Reviews { get; set; }
		public DbSet<ProductImage> ProductImages { get; set; }
		public DbSet<Address> Address { get; set; }
		public DbSet<Wishlist> Wishlists { get; set; }

		public DbSet<Coupon> Coupons { get; set; }

		protected override void OnModelCreating(ModelBuilder modelBuilder)
		{
			base.OnModelCreating(modelBuilder);
			

			modelBuilder.Entity<Order>().HasMany(o => o.Items).WithOne().HasForeignKey(oi => oi.OrderId);
			modelBuilder.Entity<CartItem>().HasOne(c=>c.User).WithMany().HasForeignKey(c=>c.UserId);
			modelBuilder.Entity<CartItem>().HasOne(c => c.Product).WithMany().HasForeignKey(c => c.ProductId);
			modelBuilder.Entity<ProductImage>().HasOne(pi => pi.Product).WithMany(p => p.Images).HasForeignKey(pi => pi.ProductId);
			modelBuilder.Entity<Review>().HasOne(r=>r.Product).WithMany(p=>p.Reviews).HasForeignKey(r => r.ProductId);
			modelBuilder.Entity<Review>().HasOne(r => r.User).WithMany(u => u.Reviews).HasForeignKey(r => r.UserId);
			modelBuilder.Entity<Wishlist>().HasOne(w=>w.User).WithMany().HasForeignKey(w => w.UserId);
			modelBuilder.Entity<Wishlist>().HasOne(w => w.Product).WithMany().HasForeignKey(w => w.ProductId);

		}
	}
}
