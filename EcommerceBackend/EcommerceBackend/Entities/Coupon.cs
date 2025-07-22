namespace EcommerceBackend.Entities
{
	public class Coupon
	{
		public string Id { get; set; } = Guid.NewGuid().ToString();
		public string Code { get; set; }
		public decimal DiscountAmount { get; set; }
		public decimal MinimumOrderAmount { get; set; }
		public DateTime ExpiryDate { get; set; }
		public bool IsActive { get; set; } = false;

	}
}
