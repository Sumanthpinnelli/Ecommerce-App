

namespace EcommerceBackend.Entities
{
	public class User
	{
		public string Id { get; set; } = Guid.NewGuid().ToString();
		public string Name { get; set; }
		public string Email { get; set; }
		public string PasswordHash { get; set; }
		public string Role { get; set; } = "User";
		public bool IsEmailConfirmed { get; set; }
		public string Phone { get; set; }
		public string Bio { get; set; }
		public Address Address { get; set; }
		public ICollection<Review> Reviews { get; set; }
	}
}
