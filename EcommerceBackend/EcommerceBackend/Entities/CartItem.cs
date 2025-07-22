namespace EcommerceBackend.Entities
{
	public class CartItem
	{
		public string Id { get; set; } = Guid.NewGuid().ToString();
		public string UserId { get; set; }
		public string ProductId { get; set; }
		public int Quantity { get; set; }
		public User User { get; set; }
		public Product Product { get; set; }
	}
}
