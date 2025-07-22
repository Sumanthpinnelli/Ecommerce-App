using EcommerceBackend.DataContext;
using EcommerceBackend.DTOs;
using EcommerceBackend.Entities;
using EcommerceBackend.Enumes;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace EcommerceBackend.Controllers
{
	//[ApiController]
	[Route("api/[Controller]")]
	public class ProductController : ControllerBase
	{
		private readonly AppDbContext _context;
		private readonly IWebHostEnvironment _env;
		public ProductController(AppDbContext context, IWebHostEnvironment env)
		{
			_context = context;
			_env = env;
		}
		[HttpGet]
		public async Task<IActionResult> GetProducts()
		{
			var products = await _context.Products.Include(p=>p.Images).Include(p=>p.Reviews).ToListAsync();
			return Ok(products);
		}
		[HttpGet("{id}")]
		public async Task<IActionResult> GetProduct(string id)
		{
			var product = await _context.Products.Include(p=>p.Reviews).Include(p=>p.Images).FirstOrDefaultAsync(p=>p.Id == id);
			if (product is null) return NotFound();
			return Ok(product);
		}
		[HttpPost]
		[Authorize(Roles = "Admin")]
		public async Task<IActionResult> CreateProduct([FromForm] ProductDto productDto)
		{
			if(!ModelState.IsValid)
			{
				var errors = ModelState.Values.SelectMany(v => v.Errors).Select(e => e.ErrorMessage);
				return BadRequest(ModelState);
			}
			var product = new Product
			{
				Title = productDto.Title,
				Description = productDto.Description,
				Price = productDto.Price,
				Stock = productDto.Stock,
				Category = Enum.Parse<PickleCategory>(productDto.Category, ignoreCase: true),
				Images = new List<ProductImage>()
			};
			await _context.SaveChangesAsync();

			if (productDto.Images != null && productDto.Images.Any())
			{
				var folder = Path.Combine(_env.WebRootPath, "uploads");
				if (!Directory.Exists(folder)) Directory.CreateDirectory(folder);

				foreach(var formFile in productDto.Images)
				{
					var fileName = $"{Guid.NewGuid()}{Path.GetExtension(formFile.FileName)}";
					var filePath = Path.Combine(folder, fileName);
					using var stream = System.IO.File.Create(filePath);
					await formFile.CopyToAsync(stream);
					var url = $"{Request.Scheme}://{Request.Host}/uploads/{fileName}";
					product.Images.Add(new ProductImage
					{
						ImageUrl = url,
						ProductId = product.Id
					});
					
				}
			}
			_context.Products.Add(product);
			await _context.SaveChangesAsync();
			var created = await _context.Products.Include(p=>p.Images).FirstOrDefaultAsync(p=>p.Id == product.Id);
			return CreatedAtAction(nameof(CreateProduct), new { id = product.Id }, created);
		}
		[HttpPut("{id}")]
		[Authorize(Roles = "Admin")]
		public async Task<IActionResult> UpdateProduct(string id,[FromForm] ProductDto UpdateProduct)
		{
			var product = await _context.Products.Include(p => p.Images).FirstOrDefaultAsync(p=>p.Id == id);
			if (product is null) return NotFound();
			product.Title = UpdateProduct.Title;
			product.Description = UpdateProduct.Description;
			product.Price = UpdateProduct.Price;
			product.Category = Enum.Parse<PickleCategory>(UpdateProduct.Category, ignoreCase: true);
			product.Stock = UpdateProduct.Stock;
			product.Featured = UpdateProduct.Featured;

			var existingImagesFromClient = new List<string>();
			if(Request.Form.TryGetValue("existingImages",out var existingImagesJson))
			{
				existingImagesFromClient = System.Text.Json.JsonSerializer.Deserialize<List<string>>(existingImagesJson!);
			}
			var currentImagesInDb = product.Images.ToList();
			foreach(var image in currentImagesInDb)
			{
				if(existingImagesFromClient is not null && existingImagesFromClient.Contains(image.ImageUrl))
				{
					var fullPath = Path.Combine(_env.WebRootPath, "uploads", Path.GetFileName(image.ImageUrl));
					if(System.IO.File.Exists(fullPath))
					{
						System.IO.File.Delete(fullPath);
					}
					_context.ProductImages.Remove(image);
				}
			}
			if (UpdateProduct.Images != null && UpdateProduct.Images.Any())
			{
				var folder = Path.Combine(_env.WebRootPath, "uploads");
				if (!Directory.Exists(folder)) Directory.CreateDirectory(folder);

				foreach (var formFile in UpdateProduct.Images)
				{
					var fileName = $"{Guid.NewGuid()}{Path.GetExtension(formFile.FileName)}";
					var filePath = Path.Combine(folder, fileName);
					using var stream = System.IO.File.Create(filePath);
					await formFile.CopyToAsync(stream);
					var url = $"{Request.Scheme}://{Request.Host}/uploads/{fileName}";
					var image = new ProductImage
					{
						ImageUrl = url,
						ProductId = product.Id
					};
					_context.ProductImages.Add(image);
				}
			}

			await _context.SaveChangesAsync();
			var updated = await _context.Products.Include(p => p.Images).FirstOrDefaultAsync(p => p.Id == id);
			return Ok(updated);
		}

		[HttpDelete("{id}")]
		[Authorize(Roles = "Admin")]
		public async Task<IActionResult> DeleteProduct(string id)
		{
			var product = await _context.Products.FindAsync(id);
			if (product is null) return NotFound();

			foreach (var image in product.Images)
			{
				var fullPath = Path.Combine(_env.WebRootPath, image.ImageUrl.TrimStart('/'));
				if (System.IO.File.Exists(fullPath))
				{
					System.IO.File.Delete(fullPath);
				}
			}
			_context.Products.Remove(product);
			await _context.SaveChangesAsync();
			return NoContent();
		}

	}
}
