import { authenticateJWT } from '../../middleware/authMiddleware';
import { verifyToken } from '../../utils/jwt';
import { AuthenticatedRequest } from '../../interface/userInterface';
import { Response, NextFunction } from 'express';

jest.mock('../../utils/jwt', () => ({
  verifyToken: jest.fn(),
}));

describe('authenticateJWT middleware', () => {
  const mockRes = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn(),
  } as unknown as Response;

  const mockNext = jest.fn() as NextFunction;

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should call next if token is valid', () => {
    const token = 'validtoken';
    (verifyToken as jest.Mock).mockReturnValue({ id: 123 });

    const mockReq = {
      get: (headerName: string) =>
        headerName === 'Authorization' ? `Bearer ${token}` : undefined,
      headers: {
        authorization: `Bearer ${token}`,
      },
    } as unknown as AuthenticatedRequest;

    authenticateJWT(mockReq, mockRes, mockNext);

    expect(verifyToken).toHaveBeenCalledWith(token);
    expect(mockReq.user).toEqual({ id: 123 });
    expect(mockNext).toHaveBeenCalled();
  });

  it('should return 401 if token is missing', () => {
    const mockReq = {
      get: () => undefined,
      headers: {},
    } as unknown as AuthenticatedRequest;

    authenticateJWT(mockReq, mockRes, mockNext);

    expect(mockRes.status).toHaveBeenCalledWith(401);
    expect(mockRes.json).toHaveBeenCalledWith({
      error: 'Authorization token missing or malformed',
    });
    expect(mockNext).not.toHaveBeenCalled();
  });

  it('should return 401 if token is invalid', () => {
    const token = 'invalidtoken';
    (verifyToken as jest.Mock).mockImplementation(() => {
      throw new Error('Invalid token');
    });

    const mockReq = {
      get: () => `Bearer ${token}`,
      headers: {
        authorization: `Bearer ${token}`,
      },
    } as unknown as AuthenticatedRequest;

    authenticateJWT(mockReq, mockRes, mockNext);

    expect(mockRes.status).toHaveBeenCalledWith(401);
    expect(mockRes.json).toHaveBeenCalledWith({
      error: 'Invalid or expired token',
    });
    expect(mockNext).not.toHaveBeenCalled();
  });
});
