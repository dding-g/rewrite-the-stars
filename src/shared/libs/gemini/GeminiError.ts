export class GeminiError extends Error {
  constructor(message: string, public status?: number, public details?: any) {
    super(message);
    this.name = "GeminiError";
  }
}
