namespace EcommerceBackend.Entities
{
	public class Address
	{
		public string Id { get; set; } = Guid.NewGuid().ToString();
		public string Street { get; set; }
		public string City { get; set; }
		public string State { get; set; }
		public string ZipCode { get; set; }
		public string Country { get; set; }
		public bool IsDefault { get; set; }
		public string UserId { get; set; }
		public User User { get; set; }
	}
}
