using EcommerceBackend.DataContext;
using EcommerceBackend.DTOs;
using EcommerceBackend.Entities;
using EcommerceBackend.Enumes;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Stripe;
using Stripe.Checkout;
using System.Security.Claims;

namespace EcommerceBackend.Controllers
{
	[ApiController]
	[Route("api/[controller]")]
	[Authorize]
	public class OrdersController:ControllerBase
	{
		private readonly AppDbContext _context;
		private readonly IConfiguration _configuration;

		public OrdersController(AppDbContext context, IConfiguration configuration)
		{
			_context = context;
			_configuration = configuration;
		}
		private string GetUserId() => User.FindFirstValue(ClaimTypes.NameIdentifier)!;
		//Post: api/orders/checkout
		[HttpPost("checkout")]
		public async Task<IActionResult> Checkout()
		{
			var userId = GetUserId();
			var cartItems = await _context.CartItems.Where(c=>c.UserId == userId).Include(c=>c.Product).ToListAsync();
			if (cartItems.Count == 0)
				return BadRequest("Cart is empty");
			foreach(var item in cartItems)
			{
				if (item.Quantity > item.Product.Stock)
					return BadRequest($"Not enoughstock for product {item.Product.Title} ");

			}
			var options = new SessionCreateOptions
			{
				PaymentMethodTypes = new List<string> { "card" },
				LineItems = cartItems.Select(item => new SessionLineItemOptions
				{
					PriceData = new SessionLineItemPriceDataOptions
					{
						UnitAmount = (long?)((item.Product.Price)*100),
						Currency = "usd",
						ProductData = new SessionLineItemPriceDataProductDataOptions
						{
							Name = item.Product.Title
						}
					},
					Quantity = item.Quantity
				}).ToList(),
				Mode = "payment",
				SuccessUrl = _configuration["Stripe:SuccessUrl"],
				CancelUrl = _configuration["Stripe:CancelUrl"]
			};
			var service = new SessionService();
			var session = service.Create(options);
			var order = new Order
			{
				UserId = userId,
				TotalAmount = cartItems.Sum(i => i.Product.Price * i.Quantity),
				Items = cartItems.Select(i => new OrderItem
				{
					ProductId = i.ProductId,
					Quantity = i.Quantity,
					Price = i.Product.Price
				}).ToList(),
				StripSessionId = session.Id,
				OrderDate = DateTime.UtcNow,
				Status = Enumes.Status.Processing,
				PaymentMethod = "card"
				
			};
			_context.Orders.Add(order);
			foreach(var item in cartItems)
			{
				item.Product.Stock -= item.Quantity;
				if (item.Product.Stock < 0)
					return BadRequest($"Insufficient stock for product {item.Product.Title} ");
				_context.Products.Update(item.Product);
			}
			_context.CartItems.RemoveRange(cartItems);
			_context.SaveChanges();

			return Ok(new { url = session.Url });
		}

		//GET : api/orders
		[HttpGet]
		public async Task<IActionResult> GetUserOrders()
		{
			var userId = GetUserId();
			var orders = await _context.Orders.Where(o=>o.UserId == userId).Include(o => o.User).ThenInclude(u => u.Address).Include(o=>o.Items)
				.ThenInclude(oi=>oi.Product).OrderByDescending(o=>o.OrderDate).Select(o=>new
				{
					o.Id,
					o.OrderDate,
					o.TotalAmount,
					o.Status,
					o.PaymentMethod,
					User = new
					{
						o.User.Id,
						o.User.Name,
						o.User.Email,
						o.User.Bio,
						Address = new
						{
							o.User.Address.Street,
							o.User.Address.Country,
							o.User.Address.City,
							o.User.Address.State,
							o.User.Address.ZipCode
						}
					},
					Items = o.Items

				}).ToListAsync();	
			return Ok(orders);
		}

		//GET :api/Order
		[Authorize(Roles ="Admin")]
		[HttpGet("admin")]
		public async Task<IActionResult> GetAllOrders()
		{
			var orders = await _context.Orders.Include(o => o.Items)
				.ThenInclude(oi => oi.Product).OrderByDescending(o => o.OrderDate).ToListAsync();
			return Ok(orders);
		}

		[Authorize(Roles = "Admin")]
		[HttpPut("{id}")]
		public async Task<IActionResult> UpdateOrder(string id, [FromBody]OrderDto orderDto)
		{
			var order = await _context.Orders.FirstOrDefaultAsync(o=>o.Id == id);
			if (order is null) return NotFound();
			order.Status = Enum.Parse<Status>(orderDto.Status, ignoreCase: true);
			await _context.SaveChangesAsync();
			return NoContent();
		}
	}
}
