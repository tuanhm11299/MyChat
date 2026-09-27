/**
 * Shape of every error response returned by the API.
 * `code` is stable and meant for programs; `message` is for humans.
 */
export interface ApiErrorResponse {
  statusCode: number;
  code: string;
  message: string;
}
