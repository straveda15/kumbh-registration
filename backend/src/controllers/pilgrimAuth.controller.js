import * as pilgrimAuthService from '../services/pilgrimAuth.service.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { ApiResponse } from '../utils/ApiResponse.js';

export const login = asyncHandler(async (req, res) => {
  const { user, accessToken } = await pilgrimAuthService.login(req.body);
  return new ApiResponse(200, { user, accessToken }, 'Login successful').send(res);
});

export default { login };
