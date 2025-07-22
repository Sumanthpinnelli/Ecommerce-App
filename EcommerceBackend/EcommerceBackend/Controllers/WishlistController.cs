using EcommerceBackend.DataContext;
using EcommerceBackend.DTOs;
using EcommerceBackend.Entities;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;

namespace EcommerceBackend.Controllers
{
	[ApiController]
	[Authorize]
	[Route("api/[Controller]")]
	public class WishlistController:ControllerBase
	{
		private readonly AppDbContext _context;
		public WishlistController(AppDbContext context)
		{
			_context = context;
		}
		private string GetUserId() => User.FindFirstValue(ClaimTypes.NameIdentifier);
		[HttpGet()]
		public async Task<IActionResult> GetByUser()
		{
			var userId = GetUserId();
			var wishlist = await _context.Wishlists.Where(w=>w.UserId == userId).Include(w=>w.Product).ThenInclude(p=>p.Images).ToListAsync();
			return Ok(wishlist);
		}

		[HttpPost]
		public async Task<IActionResult> CreateWishlist([FromBody] WishlistDto wishlistDto)
		{
			var userId = GetUserId();
			var exists = await _context.Wishlists.AnyAsync(w => w.UserId == userId && w.ProductId == wishlistDto.ProductId);
			if (exists)
			{
				return Conflict("Product already in wishlist");
			}
			var wishlist = new Wishlist
			{
				UserId = userId,
				ProductId = wishlistDto.ProductId,
			};
			_context.Wishlists.Add(wishlist);
			await _context.SaveChangesAsync();
			return Ok(wishlist);
		}

		[HttpDelete("{id}")]
		public async Task<IActionResult> DeleteWishlist(string id)
		{
			var wishlist = _context.Wishlists.FirstOrDefault(w=>w.Id == id);
			if (wishlist == null)
				return NotFound();
			_context.Wishlists.Remove(wishlist);
			await _context.SaveChangesAsync();
			return NoContent();
		}
	}
}
