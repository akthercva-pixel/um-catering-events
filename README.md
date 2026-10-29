# UM Catering & Events — Website Prototype

## Included
- `index.html`: luxury-style client enquiry website and service selection form.
- `admin.html`: separate admin dashboard prototype with order list, estimate pricing, print/save-to-PDF, and WhatsApp message preparation.
- `styles.css`, `app.js`, `admin.js`: styles and functionality.

## Run locally
Open `index.html` in a browser. Open `admin.html` separately for the demo dashboard.
Demo admin password: `UMdemo2026!`

## Important limitations before going live
This is a front-end prototype. Orders are stored in the browser's `localStorage`, so the dashboard only sees orders created in the same browser/device. This is NOT a secure production system and the demo password is not real authentication.

For a live website where customers submit orders from their phones and the team sees them on another device, connect:
1. A secure backend/API and shared database (e.g. Supabase/Firebase/custom server).
2. Server-side admin authentication and role permissions.
3. Server-side order validation and protected estimate data.
4. Hosting and domain.
5. Optional WhatsApp Business Platform integration if messages should be sent automatically. `wa.me` links only open a prefilled message; the customer/team must press Send. A PDF cannot be silently attached through a normal WhatsApp link. In this prototype, the admin can print/save a PDF and then attach it in WhatsApp manually.

## Logo watermark
The estimate PDF print layout currently uses a simple “UM” text watermark placeholder. Replace it with the user's transparent PNG/SVG logo when supplied. The logo file has not been provided yet.

## Food quantity
Client pages do not ask for food quantity. The dashboard estimate allows the admin to set prices; a production version should add admin-only quantity/weight fields per food item, with the 1 kg ≈ 6 guests planning guide.
