# Wanas project notes

## Browser automation rule (CRITICAL)
When automating the user's Brave/Chrome via AppleScript, NEVER bring it to the foreground.
- No `activate` calls.
- `make new window` MUST immediately set `miniaturized of theWindow to true` (macOS pops new windows to front by default).
- Reuse an existing background tab instead of making a new window when possible.
- User is usually multitasking; a foreground browser window interrupts his work. (He complained twice about the browser opening in front of him.)

## Site facts
- Location: ~/Desktop/Wanas/index.html (no-backend, AR/EN RTL+LTR, LocalStorage admin panel)
- LIVE: https://seddiqrahma-pixel.github.io/wanas/
- GH repo: seddiqrahma-pixel/wanas (branch main)
- Payments: Vodafone/InstaPay/WhatsApp 01020306395, email ahmed.alghoraib@gmail.com, NBE IBAN EG900003041450006160803000150
- Logo: logo.png (transparent), logo-icon.png (candle icon)

## Facebook findings (wanas_وَنَس, id 100089019817213)
- Page is a brand/community page, NOT a product catalog. No written category names, no prices in posts/timeline/albums.
- Extracted product categories from photos:
  - شموع (candles): soy candles with dried fruit/spices, rose-shaped (red/pink), cloud-shaped
  - ورود/هدايا (flowers/gifts): bouquets (soap/wax/paper flowers) in pink wrap + ribbon, gift boxes
  - عطور/روائح منزلية ("عطور تملأ منزلك")
- Tagline: شُمُوعٌ تَمنَحُكَ دِفءَ الشَمس 🕯️🧡
- Service: "أنسٌ منك" free gift-note service
- 58 photos downloaded to ~/Desktop/Wanas/fb_photos/ (fbcdn URLs expire in hours)
- NAMES + PRICES are NOT on Facebook — must come from the user or another source (Instagram/WhatsApp Business).
