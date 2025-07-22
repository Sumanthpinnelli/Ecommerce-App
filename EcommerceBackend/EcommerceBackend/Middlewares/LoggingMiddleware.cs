namespace EcommerceBackend.Middlewares
{
	public class LoggingMiddleware
	{
		private readonly RequestDelegate _next;
		private readonly ILogger<LoggingMiddleware> _logger;
		public LoggingMiddleware(RequestDelegate next, ILogger<LoggingMiddleware> logger)
		{
			_next = next;
			_logger = logger;
		}
		public async Task InvokeAsync(HttpContext context)
		{
			var requestId = Guid.NewGuid().ToString();
			context.Request.Headers.Add("X-Request-ID", requestId);
			_logger.LogInformation("Request ID: {RequestId}, Method: {Method}, Path: {Path}, Query: {Query}", 
				requestId, context.Request.Method, context.Request.Path, context.Request.QueryString);
			_next(context);
			_logger.LogInformation("Response Status Code: {StatusCode}", context.Response.StatusCode);

		}
	}
}
