using Stripe;

namespace EcommerceBackend.Services
{
	public class StripeService
	{
		private readonly IConfiguration _config;
		public StripeService(IConfiguration config)
		{
			_config = config;
			StripeConfiguration.ApiKey = _config["Stripe:SecretKey"];
		}
		public PaymentIntent CreatePaymentIntent(decimal amount)
		{
			var options = new PaymentIntentCreateOptions
			{
				Amount = (long)(amount * 1000),
				Currency = "usd",
				PaymentMethodTypes = new List<string> { "card" }
			};

			var service = new PaymentIntentService();
			return service.Create(options);
		}
	}
}
