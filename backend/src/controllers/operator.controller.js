import * as operatorService from '../services/operator.service.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { ApiResponse } from '../utils/ApiResponse.js';

export const verifyPass = asyncHandler(async (req, res) => {
  const result = await operatorService.verifyPass(req.body.code);
  return new ApiResponse(200, result, 'Pass verified').send(res);
});

export const logScan = asyncHandler(async (req, res) => {
  const scanLog = await operatorService.logScan({
    ...req.body,
    operatorId: req.admin._id,
    userAgent: req.get('user-agent'),
    ipAddress: req.ip,
  });
  return new ApiResponse(201, scanLog, 'Scan logged').send(res);
});

export const listScanHistory = asyncHandler(async (req, res) => {
  const result = await operatorService.listScanHistory(req.query);
  return new ApiResponse(200, result, 'Scan history fetched successfully').send(res);
});

export const getOperatorDashboard = asyncHandler(async (req, res) => {
  const dashboard = await operatorService.getOperatorDashboard();
  return new ApiResponse(200, dashboard, 'Operator dashboard fetched successfully').send(res);
});
