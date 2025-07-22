using MailKit.Security;
using MailKit.Net.Smtp;
using MimeKit;
using System.Net;
using static System.Net.WebRequestMethods;

namespace EcommerceBackend.Services
{
	public class EmailService
	{
		private readonly IConfiguration _config;
		public EmailService(IConfiguration config) 
		{ 
			_config = config;
		}
		public async Task SendVerificationEmailAsync(string email,string token)
		{
			var verifyUrl = $"http://localhost:5173/verify-email?token={token}";
			var Email = new MimeMessage();
			Email.From.Add(MailboxAddress.Parse(_config["Smtp:Email"]));
			Email.To.Add(MailboxAddress.Parse(email));
			Email.Subject = "Email Confirmation";
			Email.Body = new TextPart("html")
			{
				Text = $"<p>Click <a href='{verifyUrl}'>here</a> to verify your account.</p>"
			};
			using var smtp = new SmtpClient();
			smtp.ServerCertificateValidationCallback = (s, c, h, e) => true;
			await smtp.ConnectAsync(_config["Smtp:Host"], 587, SecureSocketOptions.StartTls);
			await smtp.AuthenticateAsync(_config["Smtp:Email"], _config["Smtp:Password"]);
			await smtp.SendAsync(Email);
			await smtp.DisconnectAsync(true);
			//var smtp = new SmtpClient(_config["Smtp:Host"])
			//{
			//	Port = 587,
			//	Credentials = new NetworkCredential(_config["Smtp:Email"], _config["Smtp:Password"]),
			//	EnableSsl = true,
			//};
			//var mail = new MailMessage
			//{
			//	From = new MailAddress(_config["Smtp:Email"]),
			//	Subject = "Verify Your Email",
			//	Body = $"<p>Click <a href='{verifyUrl}'>here</a> to verify your account.</p>",
			//	IsBodyHtml = true,
			//};
			//mail.To.Add(email);
			//await smtp.SendMailAsync(mail);

		}

		public async Task SendResetPasswordEmailAsync(string email, string token)
		{
			var resetUrl = $"http://localhost:5173/reset-password?token={token}";
			var Email = new MimeMessage();
			Email.From.Add(MailboxAddress.Parse(_config["Smtp:Email"]));
			Email.To.Add(MailboxAddress.Parse(email));
			Email.Subject = "Reset Password";
			Email.Body = new TextPart("html")
			{
				Text = $"<p>Click <a href='{resetUrl}'>here</a> to reset your password.</p>"
			};
			using var smtp = new SmtpClient();
			smtp.ServerCertificateValidationCallback = (s, c, h, e) => true;
			await smtp.ConnectAsync(_config["Smtp:Host"], 587, SecureSocketOptions.StartTls);
			await smtp.AuthenticateAsync(_config["Smtp:Email"], _config["Smtp:Password"]);
			await smtp.SendAsync(Email);
			await smtp.DisconnectAsync(true);
		}
	}
}
