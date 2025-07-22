using EcommerceBackend.DataContext;
using EcommerceBackend.DTOs;
using EcommerceBackend.Entities;
using EcommerceBackend.Services;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Authentication.Google;
using Microsoft.AspNetCore.Authentication.MicrosoftAccount;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;

namespace EcommerceBackend.Controllers
{
	[ApiController]
	[Route("api/[controller]")]
	public class AuthController : Controller
	{
		private readonly AppDbContext _context;
		private readonly JwtService _jwtService;
		private readonly EmailService _emailService;

		public AuthController(AppDbContext context, JwtService jwtService, EmailService emailService)
		{
			_context = context;
			_jwtService = jwtService;
			_emailService = emailService;
		}
		[HttpPost("register")]
		public async Task<IActionResult> Register([FromBody] RegisterDto dto)
		{
			if (dto.Password != dto.ConfirmPassword)
			{
				return BadRequest("Passwords doesn't match");
			}
			if ( await _context.Users.AnyAsync(u=>u.Email == dto.Email))
			{
				return BadRequest("Username already exists");
			}
			var user = new User
			{
				Name = dto.Name,
				Email = dto.Email,
				PasswordHash = BCrypt.Net.BCrypt.HashPassword(dto.Password),
				Role ="User",
				IsEmailConfirmed = false
			};
			_context.Users.Add(user);
			await _context.SaveChangesAsync();
			//var token = _jwtService.GenerateToken(user);
			//await _emailService.SendVerificationEmailAsync(user.Email, token);
			return Ok(new { message = "Registration successful! Please check your email to verify your account."});
		}
		[HttpGet("verify-email")]
		public async Task<IActionResult> VerifyEmail([FromQuery] string token)
		{
			try
			{
				var principal = _jwtService.ValidateToken(token);
				var email = principal.Claims.FirstOrDefault(c => c.Type == ClaimTypes.Email)?.Value;
				var user = await _context.Users.FirstOrDefaultAsync(u => u.Email == email);
				if (user is null) return NotFound("User not found");
				user.IsEmailConfirmed = true;
				await _context.SaveChangesAsync();
				return Ok("Email verified successfully.");
			}
			catch
			{
				return BadRequest("Invalid or expired token");
			}
		}
		[HttpPost("login")]
		public async Task<IActionResult> Login([FromBody] LoginDto dto)
		{
			var user = await _context.Users.FirstOrDefaultAsync(u => u.Email == dto.Email);
			if (user == null || !BCrypt.Net.BCrypt.Verify(dto.Password, user.PasswordHash))
			{
				return Unauthorized("Invalid Credentials");
			}
			var token = _jwtService.GenerateToken(user);
			return Ok(new { token });
		}
		[HttpGet("profile")]
		[Authorize]
		public async Task<IActionResult> Profile()
		{
			var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
			var user = await _context.Users.Where(u => u.Id == userId).Include(u=>u.Address).Select(u => new
			{
				u.Id,
				u.Email,
				u.Role,
				u.Name,
				u.IsEmailConfirmed,
				u.Phone,
				u.Bio
			}).FirstOrDefaultAsync();
			if (user is null)
				return NotFound("User not found");
			return Ok(user);
		}
		[HttpPut("profile")]
		[Authorize]
		public async Task<IActionResult> Profile(UpdateProfileDto updateProfileDto)
		{
			var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
			var user = await _context.Users.FindAsync(userId);
			if (user is null) return NotFound();
			user.Name = updateProfileDto.Name;
			user.Email = updateProfileDto.Email;
			user.Phone = updateProfileDto.Phone;
			user.Bio = updateProfileDto.Bio;
			await _context.SaveChangesAsync();
			return Ok(user);
		}
		[HttpPut("address")]
		[Authorize]
		public async Task<IActionResult> Address(UpdateAddressDto updateAddressDto)
		{
			var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
			var user = await _context.Users.Include(u=>u.Address).FirstOrDefaultAsync(u=>u.Id == userId);
			if (user is null) return NotFound();
			if (user.Address is null)
				user.Address = new Address { UserId = userId };
			user.Address.Street = updateAddressDto.Street;
			user.Address.City = updateAddressDto.City;
			user.Address.State = updateAddressDto.State;
			user.Address.ZipCode = updateAddressDto.ZipCode;
			user.Address.Country = updateAddressDto.Country;
			user.Address.IsDefault = updateAddressDto.IsDefault;
			await _context.SaveChangesAsync();
			return Ok(user);
		}
		[HttpPut("password")]
		[Authorize]
		public async Task<IActionResult> Password(UpdatePasswordDto updatePasswordDto)
		{
			var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
			var user = await _context.Users.FindAsync(userId);
			if (user is null) return NotFound();
			if (!BCrypt.Net.BCrypt.Verify(updatePasswordDto.CurrentPassword, user.PasswordHash))
			{
				return BadRequest("Current Password is incorrect");
			}
			user.PasswordHash = BCrypt.Net.BCrypt.HashPassword(updatePasswordDto.NewPassword);
			await _context.SaveChangesAsync();
			return Ok(user);
		}
		[HttpGet("google-login")]
		public IActionResult GoogleLogin()
		{
			var properties = new AuthenticationProperties
			{
				RedirectUri = Url.Action("ExternalLoginCallback", "Auth")
			};

			return Challenge(properties,GoogleDefaults.AuthenticationScheme);
		}

		[HttpGet("microsoft-login")]
		public IActionResult MicrosoftLogin()
		{
			var properties = new AuthenticationProperties
			{
				RedirectUri = Url.Action("ExternalLoginCallback", "Auth")
			};

			return Challenge(properties, MicrosoftAccountDefaults.AuthenticationScheme);
		}
		[HttpGet("external-login-callback")]
		public async Task<IActionResult> ExternalLoginCallback()
		{
			var result = await HttpContext.AuthenticateAsync(IdentityConstants.ExternalScheme);
			if (!result.Succeeded)
				return BadRequest("External authentication failed.");
			var email = result.Principal.FindFirst(ClaimTypes.Email)?.Value;
			var name = result.Principal.FindFirst(ClaimTypes.Name)?.Value;
			var user = _context.Users.FirstOrDefault(u=>u.Email == email);
			if(user is null)
			{
				user = new User
				{
					Email = email,
					PasswordHash = null,
					Role = "User"
				};
				_context.Users.Add(user);
				await _context.SaveChangesAsync();
			}
			var jwtToken = _jwtService.GenerateToken(user);

			return Redirect($"http://localhost:5173/social-success?token={jwtToken}");
		}


		[HttpPost("forgot-password")]
		public async Task<IActionResult> ForgotPassword([FromBody] ForgotPasswordDto dto)
		{
			var user = await _context.Users.FirstOrDefaultAsync(u => u.Email == dto.Email);
			if (user == null)
				return Ok(new { message = "If an account with that email exists, a reset link has been sent." });

			var token = _jwtService.GenerateToken(user);
			await _emailService.SendResetPasswordEmailAsync(user.Email, token);
			return Ok(new { message = "Reset password email sent." });
		}

		[HttpPost("reset-password")]
		public async Task<IActionResult> ResetPassword([FromBody] ResetPasswordDto dto)
		{
			if (dto.NewPassword != dto.ConfirmPassword)
				return BadRequest("Passwords do not match.");

			try
			{
				var principal = _jwtService.ValidateToken(dto.Token);
				var email = principal.Claims.FirstOrDefault(c => c.Type == ClaimTypes.Email)?.Value;

				var user = await _context.Users.FirstOrDefaultAsync(u => u.Email == email);
				if (user == null)
					return NotFound("User not found.");

				user.PasswordHash = BCrypt.Net.BCrypt.HashPassword(dto.NewPassword);
				await _context.SaveChangesAsync();

				return Ok(new { message = "Password reset successfully." });
			}
			catch
			{
				return BadRequest("Invalid or expired token.");
			}
		}
	}
}
