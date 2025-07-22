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
	[Route("api/[controller]")]
	[Authorize]
	public class CartController:ControllerBase
	{
		private readonly AppDbContext _context;
		public CartController(AppDbContext context)
		{
			_context = context;
		}
		private string GetUserId() => User.FindFirstValue(ClaimTypes.NameIdentifier);
		//Get : api/cart
		[HttpGet]
		public async Task<IActionResult> GetCart()
		{
			var userId = GetUserId();
			var cartItems = await _context.CartItems.Where(c=>c.UserId == userId).Include(c=>c.Product).Include(c=>c.Product.Images).ToListAsync();
			return Ok(cartItems);
		}
		//Post: api/cart
		[HttpPost]
		public async Task<IActionResult> AddToCart([FromBody] AddToCartDto dto)
		{
			var userId = GetUserId();
			var product = await _context.Products.FindAsync(dto.ProductId);
			if (product is null) return NotFound("Product not found");

			var cartItem = await _context.CartItems.FirstOrDefaultAsync(c=>c.ProductId == dto.ProductId && c.UserId == userId);
			if (cartItem is null)
			{
				cartItem = new CartItem
				{
					UserId = userId,
					ProductId = dto.ProductId,
					Quantity = dto.Quantity
				};
				_context.CartItems.Add(cartItem);
				cartItem.Product = await  _context.Products.Include(p => p.Images).FirstOrDefaultAsync(p=>p.Id == dto.ProductId);
			}
			else
			{
				if(cartItem.Product.Stock>= cartItem.Quantity+dto.Quantity)
					cartItem.Quantity += dto.Quantity;
			}
			await _context.SaveChangesAsync();
			return Ok(cartItem);
		}

		//Delete: api/cart/{productId}
		[HttpDelete("{id}")]
		public async Task<IActionResult> RemoveFromCart(string id)
		{
			var userId = GetUserId();
			var cartItem = await _context.CartItems.FirstOrDefaultAsync(c=>c.Id==id);
			if (cartItem is null) return NotFound();

			_context.CartItems.Remove(cartItem);
			await _context.SaveChangesAsync();
			return NoContent();
		}
		[HttpDelete()]
		public async Task<IActionResult> RemoveCart()
		{
			var userId = GetUserId();
			if (userId is null)
				return Unauthorized();
			var cartItems = await _context.CartItems.Where(c => c.UserId == userId).ToListAsync();

			_context.CartItems.RemoveRange(cartItems);
			await _context.SaveChangesAsync();
			return NoContent();
		}

	}
}
