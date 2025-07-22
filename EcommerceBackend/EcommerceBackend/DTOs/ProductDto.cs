using EcommerceBackend.Enumes;

namespace EcommerceBackend.DTOs
{
	public class ProductDto
	{
		public string Title { get; set; }
		public string Description { get; set; }
		public List<IFormFile>? Images { get; set; }
		public string Category { get; set; }
		public decimal Price { get; set; }
		public int Stock { get; set; }
		public bool Featured { get; set; }
	}
}
