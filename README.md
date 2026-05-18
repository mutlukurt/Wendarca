# Wendarca

Wendarca is a privacy-first, browser-based file conversion web app built with Next.js, React, TypeScript, and Tailwind CSS. It converts images, videos, and PDFs locally in the user’s browser without uploading files to a server.

The product is designed as a polished utility for fast, practical file preparation: smaller web-ready images, WebM video output, PDF creation, PDF page extraction, PDF merging, and ZIP-based batch downloads.

## What Wendarca Does

Wendarca helps users convert common file types directly on their own device:

- Convert `PNG`, `JPG`, and `JPEG` images to `WebP`
- Compress images with quality control and optional target file size
- Convert common video files such as `MP4`, `MOV`, `AVI`, `MKV`, and `M4V` to `WebM`
- Convert `PNG` and `JPEG` images into PDF documents
- Convert PDF pages to `PNG` or `JPEG`
- Merge multiple PDFs into one PDF
- Download converted files individually
- Download multiple outputs as a ZIP archive
- Use the app in English or Turkish

## Why This Exists

Many conversion tools require uploading private files to a remote service. That is unnecessary for many everyday workflows, especially image compression, WebP export, PDF merging, and lightweight video conversion.

Wendarca keeps conversion local whenever the browser can handle it. This provides several benefits:

- **Privacy:** files remain on the user’s device
- **Speed for small and medium files:** no upload or server round trip
- **Lower infrastructure complexity:** no backend, database, file storage, or authentication
- **Practical batch workflow:** users can process many files and download results as ZIP
- **Web-ready outputs:** images and videos can be reduced for publishing, sharing, or upload limits

## Core Features

### Image Conversion

- Converts `PNG`, `JPG`, and `JPEG` to `WebP`
- Uses browser-native decoding through `createImageBitmap` when available
- Falls back to `Image` decoding where needed
- Renders images to canvas and exports with `canvas.toBlob("image/webp")`
- Includes a WebP quality slider
- Includes optional target image size in KB
- Reduces quality first, then dimensions when a target size is requested
- Avoids upscaling source images
- Shows original size, converted size, compression ratio, status, and download action

### Video Conversion

- Converts `MP4`, `MOV`, `AVI`, `MKV`, and `M4V` to `WebM`
- Uses `@ffmpeg/ffmpeg` and `@ffmpeg/core` through WebAssembly
- Lazy-loads the video engine only when video conversion is needed
- Uses local ffmpeg core assets from `public/ffmpeg-core`
- Avoids CDN-based ffmpeg loading to reduce CORS and reliability issues
- Supports quality profiles:
  - Balanced
  - Smaller file
  - Higher quality
- Supports maximum width options:
  - Original
  - 1080p
  - 720p
  - 480p
- Defaults to a web-friendly `720p` maximum width
- Uses a fallback smaller profile if the first output is not meaningfully smaller
- Displays conversion progress where ffmpeg progress events are available

### PDF Tools

- Merge multiple PDF files into one PDF
- Convert PDF pages to PNG
- Convert PDF pages to JPEG
- Convert images into a PDF document
- Uses `pdf-lib` for PDF creation and merging
- Uses `pdfjs-dist` for rendering PDF pages to canvas
- Uses quality control for image-based PDF outputs and PDF page rendering
- Exports multi-page PDF-to-image results as ZIP files

### Batch Workflow

- Drag and drop multiple files
- Click to select multiple files
- Queue files with per-file status
- Remove individual files
- Clear the full queue
- Convert all files in the active section
- Download single converted files
- Download all converted files and batch outputs as one ZIP archive

### Internationalization

The app supports exactly two languages:

- English
- Turkish

Dictionaries are kept in:

- `src/i18n/en.ts`
- `src/i18n/tr.ts`

The UI includes a language switcher and all visible product text is localized through the dictionary structure.

## Privacy Model

Wendarca has no backend file upload flow.

Files are processed in the browser using:

- Canvas APIs for image conversion
- WebAssembly ffmpeg for video conversion
- PDF rendering and generation libraries for PDF workflows
- Blob URLs for local downloads
- JSZip for local ZIP generation

No database, authentication, external upload API, or server-side file storage is used.

## Tech Stack

### Application Framework

- **Next.js App Router**: application routing, metadata, build pipeline, and production-ready React setup
- **React**: UI rendering and component state
- **TypeScript**: strict typing for conversion state, file metadata, options, and reusable utilities
- **Tailwind CSS**: responsive utility-first styling

### UI and Icons

- **lucide-react**: interface icons for actions, navigation, status, and utility controls
- **simple-icons**: professional brand/file/tool icon support where relevant
- **Custom React SVG illustration**: local conversion visual in the hero section
- **Local WebP brand asset**: optimized logo stored in `public/brand/wendarca-logo.webp`

### Conversion Libraries

- **@ffmpeg/ffmpeg**: browser wrapper for ffmpeg.wasm
- **@ffmpeg/core**: local WebAssembly ffmpeg core
- **@ffmpeg/util**: file loading helpers for ffmpeg.wasm
- **pdf-lib**: PDF creation and PDF merging
- **pdfjs-dist**: PDF page rendering for PDF-to-image conversion
- **jszip**: ZIP generation for batch downloads

### Tooling

- **ESLint**: code quality checks
- **TypeScript**: type checking
- **Playwright**: browser-level verification during development
- **sharp**: development-time image preparation and optimization

## Project Structure

```txt
src/
  app/
    layout.tsx
    page.tsx
    globals.css
  components/
    Header.tsx
    Hero.tsx
    ConverterPanel.tsx
    Dropzone.tsx
    FileQueue.tsx
    FileItem.tsx
    QualityControls.tsx
    PrivacySection.tsx
    HowItWorks.tsx
    FAQ.tsx
    Footer.tsx
    LanguageSwitcher.tsx
    Logo.tsx
    ConversionIllustration.tsx
  i18n/
    en.ts
    tr.ts
    index.ts
  lib/
    cn.ts
    constants.ts
    fileUtils.ts
    imageConverter.ts
    videoConverter.ts
    pdfConverter.ts
    zipUtils.ts
  types/
    conversion.ts

public/
  brand/
    wendarca-logo.webp
  ffmpeg-core/
    ffmpeg-core.js
    ffmpeg-core.wasm
```

## Main Components

- `Header`: brand, navigation, language switcher, GitHub link
- `Hero`: product headline, call-to-action, and conversion illustration
- `ConverterPanel`: main conversion state and workflow orchestration
- `Dropzone`: drag-and-drop and file picker input
- `QualityControls`: image, video, and PDF-specific settings
- `FileQueue`: queue container for selected files
- `FileItem`: individual file status, metadata, progress, and actions
- `PrivacySection`: local-processing privacy explanation
- `HowItWorks`: three-step workflow
- `FAQ`: localized frequently asked questions
- `Footer`: brand and language-aware footer links

## Conversion Architecture

### File Detection

File type detection is handled through utility functions in `src/lib/fileUtils.ts`:

- `formatBytes()`
- `getFileExtension()`
- `isImageFile()`
- `isVideoFile()`
- `isPdfFile()`
- `replaceExtension()`
- `calculateCompression()`
- `createConversionId()`

These utilities keep the conversion UI predictable and prevent unsupported files from crashing the workflow.

### Image Pipeline

Image conversion is implemented in `src/lib/imageConverter.ts`.

The pipeline:

1. Decode the source image
2. Draw it to a canvas
3. Export it as WebP
4. Optionally search for a better quality/size balance
5. Optionally downscale dimensions when target size cannot be reached by quality reduction alone
6. Return a local `Blob` for download

### Video Pipeline

Video conversion is implemented in `src/lib/videoConverter.ts`.

The pipeline:

1. Lazy-load `@ffmpeg/ffmpeg`
2. Load local ffmpeg core assets from `public/ffmpeg-core`
3. Write the selected file into ffmpeg’s in-memory filesystem
4. Encode to WebM with VP8 video and Opus audio
5. Apply selected quality and width options
6. Retry with a smaller profile if the output is not sufficiently reduced
7. Return a local `video/webm` `Blob`
8. Clean up temporary ffmpeg filesystem entries

### PDF Pipeline

PDF workflows are implemented in `src/lib/pdfConverter.ts`.

Supported workflows:

- `convertImagesToPdf()`: converts images to JPEG-backed PDF pages
- `mergePdfs()`: copies pages from multiple PDFs into one PDF
- `convertPdfToImageZip()`: renders each PDF page to PNG or JPEG and packages the result as ZIP

## Browser Security Headers

`next.config.ts` sets:

```txt
Cross-Origin-Opener-Policy: same-origin
Cross-Origin-Embedder-Policy: require-corp
```

These headers are useful for WebAssembly-heavy browser workloads and improve compatibility with advanced browser isolation requirements.

## Getting Started

### Requirements

- Node.js 20 or newer recommended
- npm

### Install Dependencies

```bash
npm install
```

### Start Development Server

```bash
npm run dev
```

Open:

```txt
http://localhost:3000
```

### Build for Production

```bash
npm run build
```

### Start Production Server

```bash
npm run start
```

### Run Lint

```bash
npm run lint
```

## Available Scripts

```txt
npm run dev      Start the Next.js development server with Turbopack
npm run build    Create an optimized production build
npm run start    Start the production server
npm run lint     Run ESLint
```

## Supported Formats

| Input | Output | Notes |
| --- | --- | --- |
| PNG | WebP | Browser canvas conversion |
| JPG/JPEG | WebP | Browser canvas conversion |
| PNG/JPEG | PDF | Image pages embedded into a PDF |
| PDF | PNG ZIP | One image per PDF page |
| PDF | JPEG ZIP | One image per PDF page |
| Multiple PDFs | PDF | Merged PDF output |
| MP4/MOV/AVI/MKV/M4V | WebM | ffmpeg.wasm video conversion |

## Design Direction

The UI is intentionally calm and utility-focused:

- Warm off-white background
- White surfaces
- Deep charcoal text
- Subtle borders
- Soft shadows
- Rounded cards
- Large whitespace
- No flashy gradients
- No external stock imagery
- Local custom illustration and brand asset

The interface is structured around dedicated tool sections:

- Images
- Videos to WebM
- PDF tools
- All files

Dedicated tabs keep advanced settings scoped to the relevant workflow and prevent the UI from becoming crowded.

## Accessibility

The app uses:

- Semantic sections
- Accessible button labels
- Keyboard-friendly controls
- Native form inputs
- Visible status text
- Progress bars
- Color plus text-based status indicators
- Sufficient contrast for the visual system

## Performance Notes

- ffmpeg.wasm is lazy-loaded only when video conversion is requested
- Image and PDF conversion libraries are loaded only where needed
- Object URLs are revoked when files are removed or the component unmounts
- Batch ZIP generation happens locally in the browser
- Large videos and large PDFs may require more memory and processing time depending on the device

## Known Limitations

Browser-based conversion is powerful, but it is still limited by the user’s device and browser memory.

Important limitations:

- Very large videos may be slow or fail in memory-constrained browsers
- Some unusual or damaged media files may not decode correctly
- Encrypted PDFs may fail or behave inconsistently
- Video conversion speed depends heavily on CPU performance
- WebM output may not always be smaller if the source video is already highly compressed
- Canvas-based image conversion may strip some metadata such as EXIF data and color profile details

## Deployment Notes

The app does not require a backend service. It can be deployed as a standard Next.js application.

When deploying, make sure:

- `public/ffmpeg-core/ffmpeg-core.js` is served correctly
- `public/ffmpeg-core/ffmpeg-core.wasm` is served correctly
- COOP/COEP headers from `next.config.ts` are preserved
- The deployment platform serves `.wasm` files with a valid WebAssembly MIME type

## Verification

The project has been verified with:

- ESLint
- Next.js production build
- Browser-level conversion checks for image, video, PDF, mixed-file, and ZIP workflows

Recent browser checks confirmed:

- PNG to WebP conversion
- MP4 to WebM conversion with size reduction
- PDF merge output
- Mixed “All files” conversion
- ZIP download containing individual and batch outputs

## License

This project is currently private. Add a license before publishing or distributing the source code.

