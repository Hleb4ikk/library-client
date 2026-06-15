class ApiError extends Error {
  status: number;
  message: string;
  description: string | object | undefined;

  constructor(status: number, message: string, description?: string | object) {
    super();
    this.status = status;
    this.message = message;
    this.description = description;
  }
}

export default ApiError;
