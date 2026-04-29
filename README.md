# SM Portfolio Website

Static one-page portfolio website. No server is required.

## Structure

```text
index.html
assets/css/styles.css
assets/js/main.js
assets/projects/business-landing.svg
assets/projects/corporate-website.svg
assets/projects/personal-portfolio.svg
assets/projects/service-booking.svg
```

## How to open

Open `index.html` directly in a browser or upload the whole folder to any static hosting.

## Project screenshots

Temporary SVG previews are placed here:

```text
assets/projects/business-landing.svg
assets/projects/corporate-website.svg
assets/projects/personal-portfolio.svg
assets/projects/service-booking.svg
```

Replace these files with real screenshots later. Recommended image size: `900x560 px`.
You can use `.jpg`, `.png`, `.webp` or `.svg`; just update the `src` paths in `index.html`.

## Contact form

The form sends a POST request to:

```text
https://liftlink.link/
```

The request parameters are sent as `application/x-www-form-urlencoded`:

```text
name
email
phone
projectType
message
source
sentAt
```

The form does not redirect the visitor. After 2-3 seconds, it shows a success modal.
