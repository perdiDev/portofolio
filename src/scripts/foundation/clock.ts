// Local time in the rail. Time zone and label come from data attributes on #clock.
import { $ } from './dom';

const clock = $<HTMLTimeElement>('#clock');

if (clock) {
  const zone = clock.dataset.tz ?? 'UTC';
  const label = clock.dataset.tzLabel ?? '';
  const tf = new Intl.DateTimeFormat('en-GB', {
    hour: '2-digit',
    minute: '2-digit',
    timeZone: zone,
  });
  const tick = () => {
    const now = new Date();
    clock.textContent = label ? `${tf.format(now)} ${label}` : tf.format(now);
    clock.dateTime = now.toISOString();
  };
  tick();
  setInterval(tick, 15000);
}
