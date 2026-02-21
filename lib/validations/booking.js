import { z } from 'zod';

const bookingTypes = ['Flight', 'Hotel', 'Tour', 'Package', 'Bus', 'Cruise', 'Car', 'Visa'];

export const createBookingSchema = z.object({
  type: z.enum(bookingTypes),
  item: z.record(z.unknown()).optional().default({}),
  subtotal: z.number().min(0),
  tax: z.number().min(0).default(0),
  total: z.number().min(0),
  currency: z.string().length(3).optional().default('INR'),
});
