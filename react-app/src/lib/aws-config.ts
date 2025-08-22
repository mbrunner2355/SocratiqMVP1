// src/lib/aws-config.ts
import { CognitoIdentityProviderClient, InitiateAuthCommand, AuthFlowType } from "@aws-sdk/client-cognito-identity-provider";

// Your Cognito configuration based on your app client
const COGNITO_CONFIG = {
  region: 'us-east-1',
  userPoolId: 'us-east-1_FBeAewbir',
  clientId: '2Qin1ee6Gj5jql9pfcv3avbn2a', // From your screenshot
};

export class CognitoAuthService {
  private client: CognitoIdentityProviderClient;

  constructor() {
    this.client = new CognitoIdentityProviderClient({
      region: COGNITO_CONFIG.region,
    });
  }

  async signIn(username: string, password: string) {
    try {
      const command = new InitiateAuthCommand({
        AuthFlow: AuthFlowType.USER_PASSWORD_AUTH,
        ClientId: COGNITO_CONFIG.clientId,
        AuthParameters: {
          USERNAME: username,
          PASSWORD: password,
        },
      });

      const response = await this.client.send(command);

      if (response.AuthenticationResult) {
        return {
          accessToken: response.AuthenticationResult.AccessToken,
          idToken: response.AuthenticationResult.IdToken,
          refreshToken: response.AuthenticationResult.RefreshToken,
          user: {
            email: username,
            // You can decode the ID token to get more user info
          }
        };
      }

      throw new Error('Authentication failed');
    } catch (error: any) {
      console.error('Cognito sign in error:', error);
      
      // Handle specific Cognito errors
      switch (error.name) {
        case 'NotAuthorizedException':
          throw new Error('Incorrect username or password');
        case 'UserNotConfirmedException':
          throw new Error('User account not confirmed. Please check your email.');
        case 'TooManyRequestsException':
          throw new Error('Too many requests. Please try again later.');
        default:
          throw new Error('Login failed. Please try again.');
      }
    }
  }

  async signOut() {
    // Clear local storage
    localStorage.removeItem('cognito_access_token');
    localStorage.removeItem('cognito_id_token');
    localStorage.removeItem('cognito_refresh_token');
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('user');
  }

  async refreshToken(refreshToken: string) {
    try {
      const command = new InitiateAuthCommand({
        AuthFlow: AuthFlowType.REFRESH_TOKEN_AUTH,
        ClientId: COGNITO_CONFIG.clientId,
        AuthParameters: {
          REFRESH_TOKEN: refreshToken,
        },
      });

      const response = await this.client.send(command);
      
      if (response.AuthenticationResult) {
        return {
          accessToken: response.AuthenticationResult.AccessToken,
          idToken: response.AuthenticationResult.IdToken,
        };
      }

      throw new Error('Token refresh failed');
    } catch (error) {
      console.error('Token refresh error:', error);
      throw error;
    }
  }

  isAuthenticated(): boolean {
    return localStorage.getItem('isAuthenticated') === 'true' && 
           !!localStorage.getItem('cognito_access_token');
  }

  getAccessToken(): string | null {
    return localStorage.getItem('cognito_access_token');
  }
}