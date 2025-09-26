# ClipCraft AI - Automated Short-Form Video Generation

An AI-powered SaaS platform that automatically transforms text into engaging, ready-to-share short-form videos with voiceovers, captions, and music.

[![Deploy to Cloudflare](https://deploy.workers.cloudflare.com/button)](https://deploy.workers.cloudflare.com/?url=https://github.com/matsos10/generated-app-20250926-090709)

## About The Project

ClipCraft AI is a sophisticated, open-source SaaS platform designed to automate the creation of engaging short-form video content. The application empowers users to transform simple text scripts into dynamic videos complete with AI-generated voiceovers, automatic captions, relevant background footage, and mood-based music.

The core workflow involves users creating a sequence of 'scenes', each containing a piece of text for narration and search terms to source background videos from the Pexels API. The backend processes this input by converting text-to-speech (Kokoro TTS), generating precise captions (Whisper), fetching stock videos, and composing all elements into a polished final product using Remotion.

## Key Features

- **Text-to-Video:** Convert simple text scripts into complete short-form videos.
- **AI Voiceovers:** Utilize high-quality Text-to-Speech (TTS) for narration.
- **Automatic Captions:** Generate perfectly timed captions for your videos.
- **Stock Footage Integration:** Automatically sources relevant background videos from Pexels.
- **Background Music:** Select music based on mood to enhance your video's impact.
- **Customizable Configuration:** Fine-tune video orientation, caption styles, voice, and more.
- **Modern UI:** A sleek, intuitive, and responsive interface for a seamless creation experience.

## Technology Stack

- **Frontend:** React, Vite, TypeScript, Tailwind CSS, shadcn/ui, Zustand, Framer Motion
- **Video Generation:** Remotion
- **Backend & Deployment:** Cloudflare Workers
- **Captions:** Whisper
- **Text-to-Speech:** Kokoro TTS

## Getting Started

Follow these instructions to get a local copy up and running for development and testing purposes.

### Prerequisites

- [Bun](https://bun.sh/) installed on your machine.
- A free API key from [Pexels](https://www.pexels.com/api/).

### Installation

1.  **Clone the repository:**
    ```sh
    git clone https://github.com/gyoridavid/short-video-maker.git
    ```
2.  **Navigate to the project directory:**
    ```sh
    cd short-video-maker
    ```
3.  **Install dependencies:**
    ```sh
    bun install
    ```
4.  **Set up environment variables:**
    Create a `.env` file in the root of the project by copying the example file:
    ```sh
    cp .env.example .env
    ```
    Open the `.env` file and add your Pexels API key:
    ```
    PEXELS_API_KEY=YOUR_PEXELS_API_KEY
    ```

## Development

To run the development server, which includes both the frontend and the backend server, use the following command:

```sh
bun dev
```

The application will be available at `http://localhost:3123`.

### Previewing Videos with Remotion Studio

You can use Remotion Studio to preview and debug the video rendering process.

```sh
npx remotion studio
```

## Deployment

This project is configured for easy deployment to Cloudflare Workers.

1.  **Login to Wrangler:**
    ```sh
    bunx wrangler login
    ```
2.  **Deploy the application:**
    ```sh
    bunx wrangler deploy
    ```
    This command will build the project and deploy it to your Cloudflare account.

[![Deploy to Cloudflare](https://deploy.workers.cloudflare.com/button)](https://deploy.workers.cloudflare.com/?url=https://github.com/matsos10/generated-app-20250926-090709)

## Configuration

The application is configured via environment variables. The most important one is `PEXELS_API_KEY`, which is required for the video generation to work.

| Variable         | Description                                   | Default |
| ---------------- | --------------------------------------------- | ------- |
| `PEXELS_API_KEY` | Your free Pexels API key.                     |         |
| `PORT`           | The port the server will listen on.           | `3123`  |
| `LOG_LEVEL`      | The log level for the server (`pino` levels). | `info`  |

## Contributing

Contributions are what make the open-source community such an amazing place to learn, inspire, and create. Any contributions you make are **greatly appreciated**.

Please see the `CONTRIBUTING.md` file for instructions on setting up a local development environment and our contribution guidelines.

## License

Distributed under the MIT License. See `LICENSE` for more information.