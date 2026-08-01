import { Event } from '../models/event.model.js';
import { Registration } from '../models/registration.model.js';
import { ApiError } from '../utils/ApiError.js';
import { getPagination, buildPaginationMeta } from '../helpers/pagination.helper.js';
import * as qrService from './qr.service.js';

export const createEvent = async (payload, createdBy, origin) => {
  const event = await Event.create({ ...payload, createdBy });
  const qr = await qrService.generateQR({ eventId: event._id, origin }, createdBy);
  event.qrCode = qr._id;
  await event.populate('qrCode');
  return event;
};

export const listEvents = async (query) => {
  const { page, limit, skip } = getPagination(query);
  const filter = {};

  if (query.status) filter.status = query.status;
  if (query.search) filter.name = { $regex: query.search, $options: 'i' };

  const [events, total] = await Promise.all([
    Event.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit),
    Event.countDocuments(filter),
  ]);

  return { events, meta: buildPaginationMeta({ page, limit, total }) };
};

export const getEventById = async (id) => {
  const event = await Event.findById(id).populate('qrCode');

  if (!event) {
    throw ApiError.notFound('Event not found');
  }

  return event;
};

export const updateEvent = async (id, payload) => {
  const event = await Event.findByIdAndUpdate(id, payload, {
    new: true,
    runValidators: true,
  });

  if (!event) {
    throw ApiError.notFound('Event not found');
  }

  return event;
};

export const setEventPublication = async (id, status) => {
  const event = await Event.findById(id);
  if (!event) throw ApiError.notFound('Event not found');
  event.status = status;
  await event.save();
  return event;
};

export const deleteEvent = async (id) => {
  const hasRegistrations = await Registration.exists({ eventId: id });

  if (hasRegistrations) {
    throw ApiError.conflict('Cannot delete an event that already has registrations');
  }

  const event = await Event.findByIdAndDelete(id);

  if (!event) {
    throw ApiError.notFound('Event not found');
  }

  return event;
};

export default { createEvent, listEvents, getEventById, updateEvent, setEventPublication, deleteEvent };
