# Wendarca

**Live application:** [https://wendarca.app/](https://wendarca.app/)

Wendarca is a privacy-first, browser-based file conversion web app built with Next.js, React, TypeScript, and Tailwind CSS. It converts images, videos, PDFs, and presentations locally in the user’s browser without uploading files to a server.

The product is designed as a polished utility for fast, practical file preparation: smaller web-ready images, WebM video output, PDF creation, PDF page extraction, PDF merging, PPTX-to-PDF export, and ZIP-based batch downloads.

## Release History

### v1.0.0 - Initial Local Converter Release

The first production release established Wendarca as a privacy-first browser conversion workspace.

- Launched the core Next.js App Router application
- Added bilingual English and Turkish dictionaries
- Added local image conversion from `PNG`, `JPG`, and `JPEG` to `WebP`
- Added browser-based video conversion to `WebM` with ffmpeg.wasm
- Added multi-file drag-and-drop, queue management, progress states, and ZIP export
- Added local-first privacy messaging, FAQ, and production metadata
- Added the MIT License and open-source project documentation

### v1.0.1 - Brand, README, and Live Deployment Polish

This release refined the public project presentation and brand foundation.

- Added the live application link to the top of the README
- Added the Wendarca brand logo as an optimized local WebP asset
- Updated footer and navigation links for the open-source project flow
- Improved README coverage for the purpose, benefits, technology stack, privacy model, and deployment notes

### v1.1.0 - PDF Tools Expansion

This release expanded Wendarca beyond image and video conversion into document workflows.

- Added dedicated PDF tools section
- Added image-to-PDF conversion for `PNG` and `JPEG`
- Added PDF-to-`PNG` and PDF-to-`JPEG` page rendering
- Added multi-PDF merge workflow
- Added compression quality controls for PDF outputs
- Improved merged PDF size reduction through rasterized, quality-controlled PDF generation
- Preserved local browser execution with `pdf-lib`, `pdfjs-dist`, canvas, and Blob URLs

### v1.2.0 - PPTX to PDF Conversion

This release added presentation conversion for a common productivity workflow.

- Added a dedicated `PPTX to PDF` converter section
- Added high-fidelity browser-side PPTX-to-PDF conversion through a local LibreOffice WebAssembly engine
- Added separate PDF output for each presentation
- Added one merged PDF output from multiple PPTX files
- Added ZIP download for separately converted presentation PDFs
- Added a postinstall asset preparation script so large LibreOffice browser assets are generated from the npm dependency instead of being stored directly in git

### v1.3.0 - Premium Interface Redesign

This release redesigned the full product interface while preserving the existing conversion logic.

- Added a premium floating glass navbar with active section tracking
- Added a stronger hero system with local conversion pipeline visual
- Added mouse-follow glow background and subtle dot-grid texture
- Rebuilt the converter workspace as a polished app-shell card
- Improved dropzone, tabs, queue, empty states, progress display, and batch output presentation
- Added supported formats and open-source/local-first sections
- Refined the mobile hamburger menu, outside-tap closing behavior, language switcher readability, and responsive layout
- Updated the visual system around black, flame orange, medium gray, and light gray brand colors

### v1.4.0 - Expanded File Tools

This release added more everyday file workflows while keeping Wendarca focused on the browser-based local converter experience.

- Added JPG/PNG format conversion
- Added HEIC/HEIF to PNG/JPEG conversion
- Added Word/Excel structured data conversion workflows
- Added dedicated Word to PDF and Excel to PDF sections powered by the local LibreOffice WebAssembly engine
- Added clearer UI copy explaining that Word/Excel conversion focuses on structured text and table data

## What Wendarca Does

Wendarca helps users convert common file types directly on their own device:

- Convert `PNG`, `JPG`, and `JPEG` images to `WebP`
- Convert `JPG` to `PNG`
- Convert `PNG` and `JPG` to `JPEG`
- Convert `HEIC` and `HEIF` photos to `PNG` or `JPEG`
- Compress images with quality control and optional target file size
- Convert common video files such as `MP4`, `MOV`, `AVI`, `MKV`, and `M4V` to `WebM`
- Convert `PNG` and `JPEG` images into PDF documents
- Convert PDF pages to `PNG` or `JPEG`
- Merge multiple PDFs into one PDF
- Convert `PPTX` presentations to individual PDFs or one merged PDF
- Convert `DOCX` files to PDF
- Convert `XLS` and `XLSX` files to PDF
- Convert structured Word table/text content to `XLSX`
- Convert spreadsheet rows to `DOCX`
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

### Presentation Conversion

- Converts `PPTX` presentations to PDF
- Uses a local LibreOffice WebAssembly engine for high-fidelity export
- Supports separate PDF output per presentation
- Supports one merged PDF from multiple PPTX files
- Supports ZIP download for separately converted presentation PDFs
- Keeps conversion local in the browser after the WASM engine loads

### Office Conversion

- Converts `DOCX` to PDF through the local LibreOffice WebAssembly engine
- Converts `XLS` and `XLSX` to PDF through the local LibreOffice WebAssembly engine
- Converts structured Word tables and text into `XLSX`
- Converts spreadsheet rows and sheets into `DOCX`
- Clearly communicates that Word/Excel conversion focuses on structured text and table data, not guaranteed one-to-one layout preservation
- Keeps Office conversion local in the browser after the LibreOffice WASM engine loads

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
- LibreOffice WebAssembly for PPTX, Word-to-PDF, Excel-to-PDF, and Office conversion assistance
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
- **@matbee/libreoffice-converter**: LibreOffice WebAssembly engine for high-fidelity PPTX-to-PDF conversion
- **heic2any**: browser-side HEIC/HEIF image decoding and conversion
- **xlsx**: spreadsheet generation and workbook handling
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
    HeroVisual.tsx
    MouseGlowBackground.tsx
    SectionHeader.tsx
    FeatureCard.tsx
    ConverterPanel.tsx
    Dropzone.tsx
    FileQueue.tsx
    FileItem.tsx
    QualityControls.tsx
    PrivacySection.tsx
    HowItWorks.tsx
    SupportedFormats.tsx
    OpenSourceSection.tsx
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
    pptxConverter.ts
    zipUtils.ts
  types/
    conversion.ts

scripts/
  prepare-libreoffice-assets.mjs

public/
  brand/
    wendarca-logo.webp
  ffmpeg-core/
    ffmpeg-core.js
    ffmpeg-core.wasm
  wasm/
    soffice.js
    soffice.wasm
    soffice.data
    soffice.worker.js
  libreoffice/
    browser.worker.global.js
```

`public/wasm` and `public/libreoffice` are generated by `npm install` through `scripts/prepare-libreoffice-assets.mjs`. They are intentionally ignored by git because the LibreOffice WebAssembly engine contains very large browser runtime files.

## Main Components

- `Header`: brand, navigation, language switcher, GitHub link
- `Hero`: product headline, call-to-action, and conversion illustration
- `ConverterPanel`: main conversion state and workflow orchestration
- `Dropzone`: drag-and-drop and file picker input
- `QualityControls`: image, video, and PDF-specific settings
- `FileQueue`: queue container for selected files
- `FileItem`: individual file status, metadata, progress, and actions
- `MouseGlowBackground`: lightweight cursor-following visual glow
- `HeroVisual`: custom product diagram for the local conversion pipeline
- `SupportedFormats`: capability grid for supported workflows
- `OpenSourceSection`: local-first and open-source project note
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
- `mergePdfsCompressed()`: renders pages into a quality-controlled merged PDF for smaller output
- `convertPdfToImageZip()`: renders each PDF page to PNG or JPEG and packages the result as ZIP

### Presentation Pipeline

Presentation workflows are implemented in `src/lib/pptxConverter.ts`.

The pipeline:

1. Prepare LibreOffice browser assets from the installed npm package
2. Lazy-load the local LibreOffice WebAssembly worker when PPTX conversion is requested
3. Convert each selected `PPTX` file to PDF
4. Return individual PDF blobs or merge multiple converted PDFs into one document
5. Package separate presentation PDFs as ZIP when requested

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

`npm install` also prepares the LibreOffice browser assets required for local PPTX conversion.

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
| PPTX | PDF | LibreOffice WASM presentation export |
| Multiple PPTX files | PDF or ZIP | Merged PDF or separate PDFs |
| MP4/MOV/AVI/MKV/M4V | WebM | ffmpeg.wasm video conversion |

## Design Direction

The UI is intentionally modern, bold, and utility-focused:

- Light gray product background
- White surfaces
- Black primary text
- Flame orange accent system
- Medium gray secondary text
- Floating glass navigation
- Subtle neutral borders
- Soft shadows
- Rounded cards
- Large whitespace
- No heavy decorative gradients
- No external stock imagery
- Local custom illustration and brand asset

The interface is structured around dedicated tool sections:

- Images
- Videos to WebM
- PDF tools
- PPTX to PDF
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
- LibreOffice WASM powers PPTX conversion and requires a large first-time browser download that is cached afterward
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
- PPTX conversion fidelity depends on LibreOffice WebAssembly and available fonts
- Video conversion speed depends heavily on CPU performance
- WebM output may not always be smaller if the source video is already highly compressed
- Canvas-based image conversion may strip some metadata such as EXIF data and color profile details

## Deployment Notes

The app does not require a backend service. It can be deployed as a standard Next.js application.

When deploying, make sure:

- `public/ffmpeg-core/ffmpeg-core.js` is served correctly
- `public/ffmpeg-core/ffmpeg-core.wasm` is served correctly
- `public/wasm/soffice.js`, `public/wasm/soffice.wasm`, `public/wasm/soffice.data`, and `public/wasm/soffice.worker.js` are served correctly
- `public/libreoffice/browser.worker.global.js` is served correctly
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

Wendarca is developed as open-source software by Mutlu Kurt and released under the MIT License.

See [LICENSE](LICENSE) for details.
