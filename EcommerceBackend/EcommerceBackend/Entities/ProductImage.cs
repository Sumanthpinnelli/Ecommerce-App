using System.Text.Json.Serialization;

namespace EcommerceBackend.Entities
{
	public class ProductImage
	{
		public string Id { get; set; } = Guid.NewGuid().ToString();
		public string ImageUrl { get; set; }
		public string ProductId { get; set; }
		[JsonIgnore]
		public Product Product { get; set; }
	}
}
