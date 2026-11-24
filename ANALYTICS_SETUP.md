# GTM and GA4 setup

The application initializes one `window.dataLayer` and loads Google Tag Manager only after analytics consent is granted. GA4 should be configured inside GTM; do not also install `gtag.js` directly.

## Application setup

Copy `.env.example` to `.env.local`, then add the GTM web container ID:

```text
NEXT_PUBLIC_GTM_ID=GTM-XXXXXXX
NEXT_PUBLIC_GA4_MEASUREMENT_ID=G-XXXXXXXXXX
NEXT_PUBLIC_ANALYTICS_DEBUG=true
```

Restart `npm run dev` after changing a `NEXT_PUBLIC_` value. The GA4 ID is displayed by the local debugger; GA4 itself is still configured inside GTM.

## Data layer events

- `virtual_page_view`: emitted after each Next.js route change with `page_path`.
- `ad_simulator_click`: emitted before entering the funnel from a simulated ad.
- `availability_check`: emitted before the address request, without the address.
- `availability_result`: emitted after the address endpoint succeeds or fails.
- `view_item_list`: emitted when the package list is displayed.
- `select_item`: emitted when a package is selected.
- `form_start`: emitted on the first interaction with the lead form.
- `form_submit`: emitted immediately before the lead request begins.
- `generate_lead`: emitted only after `/api/leads` accepts the lead.
- `lead_submission_error`: emitted when lead delivery fails.
- `lead_receipt_view`: emitted when a valid receipt is displayed.

No name, email, phone number, or street address is pushed to the data layer.

## GTM workspace

1. Create a GA4 property and web data stream for this practice project.
2. Create a Google tag in GTM using the GA4 measurement ID. Set `send_page_view` to `false` because the app emits its own route-aware page-view event.
3. Fire the Google tag on Initialization - All Pages.
4. Create a Custom Event trigger named `virtual_page_view` and send a GA4 event named `page_view`. Map `page_location`, `page_path`, and `page_title` from data layer variables.
5. Create allowlisted Custom Event triggers for the remaining events. Do not use an unrestricted catch-all trigger.
6. Map safe parameters such as `event_id`, `lead_id`, `package_id`, `availability_status`, and the ecommerce `items` array.
7. Mark `generate_lead` as a key event in GA4.
8. Publish the GTM container only after Preview mode and GA4 DebugView show the expected event order.

The app uses a basic consent gate: GTM is not requested until the visitor allows analytics. Advertising storage stays disabled in this exercise.

## Testing

Open `/analytics-debug` to inspect queued data-layer messages. It can intentionally send a valid debug event, two identical `generate_lead` events, or an incomplete `generate_lead` payload. Use a dedicated test property because these events can appear in GA4.

For normal funnel testing, expect this order:

1. `virtual_page_view`
2. `ad_simulator_click`
3. `availability_check` and `availability_result`
4. `view_item_list` and `select_item`
5. `form_start` and `form_submit`
6. `generate_lead` only after the lead API returns `201`
7. `lead_receipt_view`

Compare the browser Network panel, GTM Preview, GA4 DebugView, and the `/api/leads` response when investigating discrepancies.

Avoid enabling a second automatic page-view implementation alongside `virtual_page_view`, or page views may be counted twice.
