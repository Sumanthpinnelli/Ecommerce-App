namespace EcommerceBackend.DTOs
{
	public class CouponDto
	{
		public string Code { get; set; }
		public decimal DiscountAmount { get; set; }
		public decimal MinimumOrderAmount { get; set; }
		public DateTime ExpiryDate { get; set; }
	}
}
