using EcommerceBackend.Enumes;

namespace EcommerceBackend.Entities
{
	public class Order
	{
		public string Id { get; set; } = Guid.NewGuid().ToString();
		public string UserId { get; set; }
		public DateTime OrderDate { get; set; }
		public decimal TotalAmount { get; set; }
		public string StripSessionId { get; set; }
		public User User { get; set; }
		public List<OrderItem> Items { get; set; }
		public Status Status { get; set; }
		public string PaymentMethod { get; set; }
	}
}
