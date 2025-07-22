namespace EcommerceBackend.Entities
{
	public class Wishlist
	{
		public string Id { get; set; } = Guid.NewGuid().ToString();
		public string UserId { get; set; }
		public User User { get; set; }
		public string ProductId { get; set; }
		public Product Product { get; set; }
		public DateTime AddedAt { get; set; }
	}
}
