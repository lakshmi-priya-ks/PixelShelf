# PixelShelf

A privacy-focused Virtualized Photo Browser built with React.

PixelShelf lets users browse photographs stored on their local devices through a responsive, virtualized grid. Images are processed entirely in the browser and are never uploaded to a server.

## Features

- Select and browse local folders.
- Responsive photo grid.
- Virtualized rendering using `react-window`.
- Full-screen photo viewer.
- Previous and next photo navigation.
- Keyboard navigation using arrow keys.
- Close viewer using Escape.
- Image metadata including dimensions, file size, format, and modified date.
- Search photos by filename.
- Sort by name, newest, and file size.
- Filter out non-image files.
- Local image processing with no server uploads.

## Virtualization

PixelShelf uses `FixedSizeGrid` from `react-window` to efficiently display large photo collections.

Instead of rendering every photo simultaneously, it renders the visible grid cells along with an overscan buffer. As users scroll, the rendered cells update dynamically.

This helps reduce the number of DOM elements and improves browsing performance.

## Tech Stack

- React
- Vite
- JavaScript
- react-window
- Lucide React
- CSS

## Getting Started

Clone the repository:

```bash
git clone https://github.com/lakshmi-priya-ks/PixelShelf.git
```

Navigate to the project directory:

```bash
cd PixelShelf
```

Install dependencies:

```bash
npm install
```

Start the development server:

```bash
npm run dev
```

Build for production:

```bash
npm run build
```

## Privacy

All selected photographs remain on the user's device. PixelShelf does not upload images to an external server.

## Limitations

- Folder selection depends on browser support.
- Large original images may consume browser memory.
- Image decoding and browser caching can affect performance.
- Users must select their local folders each time they use the application.
