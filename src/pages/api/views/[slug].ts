import { Redis } from '@upstash/redis';
import type { APIContext, APIRoute } from 'astro';
import { getEntry } from 'astro:content';
import {
  KV_REST_API_TOKEN,
  KV_REST_API_URL,
  UPSTASH_REDIS_REST_TOKEN,
  UPSTASH_REDIS_REST_URL,
} from 'astro:env/server';
import { VIEWS } from '../../../config';

/** The only on-demand route of the site. Everything else is prerendered. */
export const prerender = false;

const BOT_PATTERN =
  /bot|crawl|spider|slurp|archiver|facebookexternalhit|preview|headless|lighthouse|pagespeed|gtmetrix|curl|wget|python-requests|httpclient|go-http|node-fetch|axios|monitor|uptime|checker|scanner/i;

let client: Redis | null | undefined;

/** Lazily create the Redis client. `null` means "not configured": the feature stays off. */
function getRedis(): Redis | null {
  if (client !== undefined) return client;
  const url = UPSTASH_REDIS_REST_URL || KV_REST_API_URL;
  const token = UPSTASH_REDIS_REST_TOKEN || KV_REST_API_TOKEN;
  client = url && token ? new Redis({ url, token }) : null;
  return client;
}

const json = (body: unknown, status = 200): Response =>
  new Response(JSON.stringify(body), {
    status,
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      'Cache-Control': 'no-store',
      'X-Robots-Tag': 'noindex',
    },
  });

async function sha256(input: string): Promise<string> {
  const digest = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(input));
  return [...new Uint8Array(digest)]
    .slice(0, 16)
    .map((byte) => byte.toString(16).padStart(2, '0'))
    .join('');
}

function visitorAddress(context: APIContext): string {
  const forwarded = context.request.headers.get('x-forwarded-for')?.split(',')[0]?.trim();
  if (forwarded) return forwarded;
  try {
    return context.clientAddress;
  } catch {
    return 'unknown';
  }
}

/** Unknown slugs (and drafts, in production) are a 404. */
async function isKnownPost(slug: string | undefined): Promise<boolean> {
  if (!slug) return false;
  const entry = await getEntry('blog', slug);
  return Boolean(entry) && (import.meta.env.DEV || !entry?.data.draft);
}

const keyFor = (slug: string) => `${VIEWS.keyPrefix}:${slug}`;

export const GET: APIRoute = async (context) => {
  const { slug } = context.params;
  if (!(await isKnownPost(slug))) return json({ error: 'Not found' }, 404);
  const redis = getRedis();
  if (!redis) return json({ enabled: false, views: null });

  try {
    const views = (await redis.get<number>(keyFor(slug!))) ?? 0;
    return json({ views });
  } catch {
    return json({ error: 'Upstream error' }, 502);
  }
};

export const POST: APIRoute = async (context) => {
  const { slug } = context.params;
  if (!(await isKnownPost(slug))) return json({ error: 'Not found' }, 404);
  const redis = getRedis();
  if (!redis) return json({ enabled: false, views: null });

  // Same-origin only: the script on the site is the only legitimate caller.
  const origin = context.request.headers.get('origin');
  if (origin && new URL(origin).host !== context.url.host) return json({ error: 'Forbidden' }, 403);

  const userAgent = context.request.headers.get('user-agent') ?? '';
  const isBot = userAgent.length === 0 || BOT_PATTERN.test(userAgent);

  try {
    const key = keyFor(slug!);
    let counted = false;

    if (!isBot) {
      // One count per visitor (IP + user agent, hashed) per post every 24 hours.
      const visitor = await sha256(`${visitorAddress(context)}|${userAgent}`);
      const first = await redis.set(`${key}:seen:${visitor}`, 1, {
        nx: true,
        ex: VIEWS.dedupeSeconds,
      });
      if (first === 'OK') {
        const views = await redis.incr(key);
        counted = true;
        return json({ views, counted });
      }
    }

    const views = (await redis.get<number>(key)) ?? 0;
    return json({ views, counted });
  } catch {
    return json({ error: 'Upstream error' }, 502);
  }
};
