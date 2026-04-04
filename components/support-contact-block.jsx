import { Mail, Phone, MapPin } from 'lucide-react';
import {
  SITE_EMAIL,
  SITE_ADDRESS,
  SITE_MOBILE_DISPLAY,
  SITE_LANDLINE_DISPLAY,
  SITE_MOBILE_TEL_HREF,
  SITE_LANDLINE_TEL_HREF,
} from '@/lib/siteContact';

/**
 * Email, mobile + landline, optional registered address — use on legal / about pages.
 */
export function SupportContactBlock({ showAddress = false, className = '' }) {
  return (
    <ul className={`list-none space-y-2 ${className}`}>
      <li className="flex items-start gap-2">
        <Mail className="h-4 w-4 text-primary shrink-0 mt-0.5" aria-hidden />
        <a href={`mailto:${SITE_EMAIL}`} className="text-primary hover:underline break-all">
          {SITE_EMAIL}
        </a>
      </li>
      <li className="flex items-start gap-2">
        <Phone className="h-4 w-4 text-primary shrink-0 mt-0.5" aria-hidden />
        <div className="flex flex-col gap-1.5 text-sm">
          <a href={SITE_MOBILE_TEL_HREF} className="text-primary hover:underline">
            <span className="text-muted-foreground">Mobile · </span>
            {SITE_MOBILE_DISPLAY}
          </a>
          <a href={SITE_LANDLINE_TEL_HREF} className="text-primary hover:underline">
            <span className="text-muted-foreground">Landline · </span>
            {SITE_LANDLINE_DISPLAY}
          </a>
        </div>
      </li>
      {showAddress && (
        <li className="flex items-start gap-2">
          <MapPin className="h-4 w-4 text-primary shrink-0 mt-0.5" aria-hidden />
          <span className="text-foreground/90">{SITE_ADDRESS}</span>
        </li>
      )}
    </ul>
  );
}
