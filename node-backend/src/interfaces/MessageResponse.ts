export interface MessageResponse {
  message: string;
}

export interface AuthenticatedResponse {
    authenticated: boolean;
    user?: Express.User;
}
