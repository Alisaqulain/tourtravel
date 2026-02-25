import { redirect } from 'next/navigation';

export const metadata = {
  title: 'Contact Us | Trips To Travels',
  description: 'Get in touch with Trips To Travels - support, bookings, and feedback.',
};

export default function ContactUsPage() {
  redirect('/contact');
}
