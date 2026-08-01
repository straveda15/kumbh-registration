import * as eventService from '../services/event.service.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { getOriginFromRequest } from '../utils/origin.helper.js';

export const createEvent = asyncHandler(async (req, res) => {
  const origin = getOriginFromRequest(req);
  const event = await eventService.createEvent(req.body, req.admin._id, origin);
  return new ApiResponse(201, { event }, 'Event created successfully').send(res);
});

export const listEvents = asyncHandler(async (req, res) => {
  const { events, meta } = await eventService.listEvents(req.query);
  return new ApiResponse(200, { events, meta }, 'Events fetched successfully').send(res);
});

export const getEvent = asyncHandler(async (req, res) => {
  const event = await eventService.getEventById(req.params.id);
  return new ApiResponse(200, { event }, 'Event fetched successfully').send(res);
});

export const updateEvent = asyncHandler(async (req, res) => {
  const event = await eventService.updateEvent(req.params.id, req.body);
  return new ApiResponse(200, { event }, 'Event updated successfully').send(res);
});

export const deleteEvent = asyncHandler(async (req, res) => {
  await eventService.deleteEvent(req.params.id);
  return new ApiResponse(200, {}, 'Event deleted successfully').send(res);
});

export default { createEvent, listEvents, getEvent, updateEvent, deleteEvent };
