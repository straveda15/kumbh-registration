import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

// datetime-local inputs show/accept local wall-clock time with no UTC offset.
// Reading/writing must go through the Date object's local getters/setters —
// toISOString()/parsing the raw string directly would silently shift the
// value by the browser's UTC offset (and by a different amount than the
// server's, once the string round-trips through JSON with no offset info).
const toInputDate = (value) => {
  if (!value) return '';
  const date = new Date(value);
  const pad = (n) => String(n).padStart(2, '0');
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
};
const toISOFromInput = (value) => (value ? new Date(value).toISOString() : undefined);
const blank = { name: '', description: '', startDate: '', endDate: '', registrationStartDate: '', registrationEndDate: '', capacity: '', venue: { name: '', address: '' }, status: 'active' };

export const EventForm = ({ initialEvent, onSubmit, isSubmitting, submitLabel = 'Save Event' }) => {
  const [form, setForm] = useState(blank);
  useEffect(() => {
    if (initialEvent) setForm({ ...blank, ...initialEvent, startDate: toInputDate(initialEvent.startDate), endDate: toInputDate(initialEvent.endDate), registrationStartDate: toInputDate(initialEvent.registrationStartDate), registrationEndDate: toInputDate(initialEvent.registrationEndDate), capacity: initialEvent.capacity || '', venue: { ...blank.venue, ...initialEvent.venue } });
  }, [initialEvent]);
  const change = (key, value) => setForm((current) => ({ ...current, [key]: value }));
  const submit = (event) => {
    event.preventDefault();
    onSubmit({
      ...form,
      capacity: form.capacity ? Number(form.capacity) : undefined,
      startDate: toISOFromInput(form.startDate),
      endDate: toISOFromInput(form.endDate),
      registrationStartDate: toISOFromInput(form.registrationStartDate),
      registrationEndDate: toISOFromInput(form.registrationEndDate),
    });
  };
  return <form onSubmit={submit} className="glass-card grid gap-5 rounded-2xl p-6 md:grid-cols-2">
    <div className="md:col-span-2"><Label htmlFor="event-name">Event name</Label><Input id="event-name" value={form.name} onChange={(e) => change('name', e.target.value)} required /></div>
    <div className="md:col-span-2"><Label htmlFor="event-description">Description</Label><Textarea id="event-description" value={form.description} onChange={(e) => change('description', e.target.value)} /></div>
    <div><Label>Event starts</Label><Input type="datetime-local" value={form.startDate} onChange={(e) => change('startDate', e.target.value)} required /></div>
    <div><Label>Event ends</Label><Input type="datetime-local" value={form.endDate} onChange={(e) => change('endDate', e.target.value)} required /></div>
    <div><Label>Registration opens</Label><Input type="datetime-local" value={form.registrationStartDate} onChange={(e) => change('registrationStartDate', e.target.value)} /></div>
    <div><Label>Registration closes</Label><Input type="datetime-local" value={form.registrationEndDate} onChange={(e) => change('registrationEndDate', e.target.value)} /></div>
    <div><Label>Capacity</Label><Input type="number" min="1" value={form.capacity} onChange={(e) => change('capacity', e.target.value)} placeholder="Unlimited" /></div>
    <div><Label>Status</Label><Select value={form.status} onValueChange={(value) => change('status', value)}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent><SelectItem value="draft">Draft</SelectItem><SelectItem value="upcoming">Unpublished / Upcoming</SelectItem><SelectItem value="active">Published / Active</SelectItem><SelectItem value="completed">Completed</SelectItem><SelectItem value="cancelled">Cancelled</SelectItem></SelectContent></Select></div>
    <div><Label>Venue name</Label><Input value={form.venue.name} onChange={(e) => setForm((current) => ({ ...current, venue: { ...current.venue, name: e.target.value } }))} /></div>
    <div><Label>Venue address</Label><Input value={form.venue.address} onChange={(e) => setForm((current) => ({ ...current, venue: { ...current.venue, address: e.target.value } }))} /></div>
    <div className="md:col-span-2 flex justify-end"><Button type="submit" disabled={isSubmitting}>{isSubmitting ? 'Saving…' : submitLabel}</Button></div>
  </form>;
};

export default EventForm;
