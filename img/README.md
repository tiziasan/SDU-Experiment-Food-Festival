# Product photos (optional)

Name each file after the product id from `js/catalog.js`:

    img/v01.jpg   Potatoes
    img/m01.jpg   Minced beef 8-12%
    img/d03.jpg   Free-range eggs
    ...

Then set `USE_PHOTOS: true` in `js/config.js`. Any product without a matching
file falls back to its emoji tile, so the shop works whether you add none,
some, or all 81. Leaving `USE_PHOTOS` off (the default) skips the image
requests entirely and renders emoji tiles. Roughly 400×300 px, JPEG,
under ~60 kB each keeps the grid quick on festival wifi.

Use photos you have the right to use — supermarket product shots are generally
not licensed for reuse. Plain photos taken yourself on a neutral background are
the safest option, and keeping the style uniform avoids making some products
look more appealing than others, which would be its own nudge.
