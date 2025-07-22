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
	[Route("api/[Controller]")]
	public class ReviewController:ControllerBase
	{
		private readonly AppDbContext _context;
		private readonly IWebHostEnvironment _env;

		public ReviewController(AppDbContext context, IWebHostEnvironment env)
		{
			_context = context;
			_env = env;
		}
		[HttpGet("{id}")]
		public async Task<IActionResult> GetReviews(string id)
		{
			//var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
			//if (userId == null)
			//	return Unauthorized("User not authenticated");
			var product = await _context.Products.FindAsync(id);
			if (product == null)
				return NotFound("Product not found");
			var reviews = await _context.Reviews.Where(r=>r.ProductId == id).OrderByDescending(r=>r.CreatedAt).ToListAsync();
			foreach (var review in reviews)
			{
				var user = await _context.Users.FindAsync(review.UserId);
				review.User = user;
			}
			return Ok(reviews);
		}

		[HttpPost("{productId}")]
		[Authorize]
		public async Task<IActionResult> AddReview(string productId, [FromForm] ReviewDto model)
		{
			var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
			if (userId == null)
				return Unauthorized("User not authenticated");

			var product = await _context.Products.FindAsync(productId);
			if (product == null)
				return NotFound("Product not found");

			string imagePath = null;

			if (model.Image != null && model.Image.Length > 0)
			{
				var uploadsFolder = Path.Combine(_env.WebRootPath, "uploads");
				Directory.CreateDirectory(uploadsFolder);

				var fileName = Guid.NewGuid().ToString() + Path.GetExtension(model.Image.FileName);
				var fullPath = Path.Combine(uploadsFolder, fileName);

				using (var stream = new FileStream(fullPath, FileMode.Create))
				{
					await model.Image.CopyToAsync(stream);
				}

				imagePath = $"/uploads/{fileName}";
			}

			var review = new Review
			{
				ProductId = productId,
				UserId = userId,
				Comment = model.Comment,
				Rating = model.Rating,
				ImageUrl = imagePath,
				CreatedAt = DateTime.UtcNow
			};

			_context.Reviews.Add(review);
			await _context.SaveChangesAsync();

			var reviews = await _context.Reviews.Where(r => r.ProductId == productId).ToListAsync();
			if (reviews.Count >0)
			{
				product.RatingCount = reviews.Count;
				var totalRatingSum = product.Reviews.Sum(r => r.Rating);
				product.Rating = (totalRatingSum / product?.RatingCount);
				_context.Products.Update(product);
				await _context.SaveChangesAsync();
			}
			return Ok(review);
		}
	}
}
