using EcommerceBackend.Enumes;

namespace EcommerceBackend.Entities
{
	public class Product
	{
		public string Id { get; set; } = Guid.NewGuid().ToString();
		public string Title { get; set; }
		public string Description { get; set; }
		public decimal Price { get; set; }
		public int Stock { get; set; }
		public decimal? Rating { get; set; }
		public int RatingCount { get; set; }
		public bool Featured { get; set; } = false;
		public PickleCategory Category { get; set; }
		public ICollection<Review> Reviews { get; set; }
		public ICollection<ProductImage> Images { get; set; } = new List<ProductImage>();
	}
}
