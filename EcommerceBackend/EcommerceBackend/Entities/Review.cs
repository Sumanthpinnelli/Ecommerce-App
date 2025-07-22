namespace EcommerceBackend.Entities
{
	public class Review
	{
		public string Id { get; set; } = Guid.NewGuid().ToString();
		public string UserId { get; set; }
		public User User { get; set; }
		public string Comment { get; set; }
		public decimal Rating { get; set; }
		public string ProductId { get; set; }
		public Product Product { get; set; }
		public string? ImageUrl { get; set; }
		public DateTime CreatedAt { get; set; }
	}
}
