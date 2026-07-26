class ApiResponse {
  static success(data = null, message = null) {
    return {
      success: true,
      data,
      message,
    };
  }

  static error(error, message = 'An unexpected error occurred') {
    return {
      success: false,
      error,
      message,
    };
  }
}

module.exports = ApiResponse;
