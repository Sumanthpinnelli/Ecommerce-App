﻿namespace EcommerceBackend.DTOs
{
	public class ResetPasswordDto
	{
		public string NewPassword { get; set; }
		public string ConfirmPassword { get; set; }
		public string Token { get; set; }
	}
}
