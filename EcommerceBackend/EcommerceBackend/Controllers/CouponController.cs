using EcommerceBackend.DataContext;
using EcommerceBackend.DTOs;
using EcommerceBackend.Entities;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
namespace EcommerceBackend.Controllers
{
	[Authorize]
	[ApiController]
	[Route("api/[Controller]")]
	public class CouponController : ControllerBase
	{
		private readonly AppDbContext _context;
		public CouponController(AppDbContext context)
		{
			_context = context;
		}
		[HttpPost]
		[Authorize(Roles = "Admin")]
		public async Task<IActionResult> CreateCoupon([FromForm] CouponDto couponDto)
		{
			var isActive = couponDto.ExpiryDate > DateTime.Now;
			var coupon = new Coupon
			{
				ExpiryDate = couponDto.ExpiryDate,
				Code = couponDto.Code,
				DiscountAmount = couponDto.DiscountAmount,
				MinimumOrderAmount = couponDto.MinimumOrderAmount,
				IsActive = isActive,
			};
			_context.Coupons.Add(coupon);
			await _context.SaveChangesAsync();
			return Ok(coupon);
		}
		[HttpGet]
		public async Task<IActionResult> GetAll()
		{
			var coupons = await _context.Coupons.Where(x => x.IsActive).ToListAsync();
			return Ok(coupons);
		}
		[HttpGet("{id}")]
		public async Task<IActionResult> GetCoupon(string id)
		{
			var coupon = await _context.Coupons.FirstOrDefaultAsync(x => x.Id == id && x.IsActive);
			if (coupon is null) return NotFound();
			return Ok(coupon);
		}
		[HttpPut("{id}")]
		[Authorize(Roles = "Admin")]
		public async Task<IActionResult> UpdateCoupon(string id, [FromForm]CouponDto couponDto)
		{
			var coupon = await _context.Coupons.FirstOrDefaultAsync(x => x.Id == id && x.IsActive);
			if (coupon is null) return NotFound();
			coupon.Code = couponDto.Code;
			coupon.MinimumOrderAmount = couponDto.MinimumOrderAmount;
			coupon.DiscountAmount = couponDto.DiscountAmount;
			coupon.ExpiryDate = couponDto.ExpiryDate;
			coupon.IsActive = couponDto.ExpiryDate > DateTime.Now;

			await _context.SaveChangesAsync();
			return Ok(coupon);
		}

		[HttpDelete("{id}")]
		[Authorize(Roles = "Admin")]
		public async Task<IActionResult> DeleteCoupon(string id)
		{
			var coupon = await _context.Coupons.FirstOrDefaultAsync(x => x.Id == id && x.IsActive);
			if (coupon is null) return NotFound();
			_context.Coupons.Remove(coupon);
			await _context.SaveChangesAsync();
			return NoContent();
		}
	}
}
