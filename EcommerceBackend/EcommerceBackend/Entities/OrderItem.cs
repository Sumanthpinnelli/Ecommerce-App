namespace EcommerceBackend.Entities
{
	public class OrderItem
	{
		public string Id { get; set; } = Guid.NewGuid().ToString();
		public string OrderId { get; set; }
		public string ProductId { get; set; }
		public int Quantity { get; set; }
		public decimal Price { get; set; }

		public Product Product { get; set; }
	}
}
