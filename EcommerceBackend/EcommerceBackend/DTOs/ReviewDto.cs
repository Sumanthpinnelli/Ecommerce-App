namespace EcommerceBackend.DTOs
{
	public class ReviewDto
	{
		public string Comment {  get; set; }
		public int Rating { get; set; }
		public IFormFile? Image { get; set; }
	}
}
