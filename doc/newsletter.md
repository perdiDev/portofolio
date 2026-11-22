# Newsletter (Buttondown)

A subscribe form is shown at the end of every post. It posts to Buttondown's embed endpoint and opens the confirmation page in a new tab. There is no script and no backend on this site.

Code: `src/components/views/Post.astro`. Copy (heading, text, privacy line): `NEWSLETTER` in `src/config/site.ts`.

## Activate

1. Create an account at [buttondown.com](https://buttondown.com).
2. Pick a **username** in Buttondown settings. This is the part in `buttondown.com/<username>`.
3. Set the variable:

   ```bash
   PUBLIC_BUTTONDOWN_USERNAME=your-username
   ```

   Locally in `.env`, and in the Cloudflare **Build, Variables** for production.

4. Redeploy. The form appears on every post page.

## Check it works

1. Open any post and scroll to the bottom.
2. Submit a test address. A Buttondown tab opens and asks to confirm.
3. Confirm from the email. The address appears in the Buttondown **Subscribers** list.

If the variable is empty, the form is not rendered at all.

## Change the wording

Edit `NEWSLETTER` in `src/config/site.ts`:

```ts
export const NEWSLETTER = {
  privacy: 'No spam. Unsubscribe anytime.',
  heading: 'Get new posts by email',
  text: 'One short email when a new article is published. Nothing else.',
} as const;
```

## Sending posts

Subscribers only get an email when you send one. Two options:

- Write each email by hand in Buttondown.
- Use Buttondown's RSS automation and point it at `https://<your-domain>/rss.xml`.

## Privacy

Buttondown stores the addresses, not this site. If you add a privacy page later, link it from the `privacy` line.
