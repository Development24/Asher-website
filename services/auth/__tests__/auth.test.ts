import { registerUser, IRegisterPayload } from '../auth';
import axios from 'axios';

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('auth service', () => {
  it('registerUser returns user data on success', async () => {
    const payload: IRegisterPayload = {
      email: 'test@example.com',
      password: 'password',
      firstName: 'Test',
      lastName: 'User',
      phone: '1234567890',
    };
    const mockResponse = {
      data: {
        message: 'User registered',
        user: {
          id: '1',
          email: payload.email,
          isVerified: false,
          createdAt: '',
          updatedAt: '',
          role: [],
          profileId: '',
          stripeCustomerId: null,
          profile: {},
          landlords: {},
        },
      },
    };
    mockedAxios.post.mockResolvedValueOnce(mockResponse as any);
    const result = await registerUser(payload);
    expect(result).toEqual(mockResponse.data);
    expect(mockedAxios.post).toHaveBeenCalledWith(
      expect.stringContaining('/register'),
      payload
    );
  });
}); 