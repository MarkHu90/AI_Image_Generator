import {
  ImageProvider,
  ImageGenerationInput,
  GenerationResult,
  ProviderCapability,
  ProviderConfig,
} from "./types";

export class SeedreamProvider implements ImageProvider {
  readonly id = "seedream";
  readonly name = "Seedream";
  readonly creditCost = 3;
  readonly capabilities: ProviderCapability = {
    textToImage: true,
    imageToImage: false,
    imageEdit: false,
    removeBackground: false,
  };

  private apiKey: string;

  constructor(config: ProviderConfig) {
    this.apiKey = config.apiKey;
  }

  async generate(input: ImageGenerationInput): Promise<GenerationResult> {
    const startTime = Date.now();

    const response = await fetch("https://api.seedream.example/v1/generate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${this.apiKey}`,
      },
      body: JSON.stringify({
        prompt: input.prompt,
        negative_prompt: input.negativePrompt,
        aspect_ratio: input.aspectRatio ?? "1:1",
        num_images: input.imageCount ?? 1,
      }),
    });

    if (!response.ok) {
      throw new Error(`Seedream API error: ${response.status}`);
    }

    const data = await response.json();
    const images = await Promise.all(
      (data.images ?? []).map(async (img: { url: string }) => {
        const imgRes = await fetch(img.url);
        const buffer = Buffer.from(await imgRes.arrayBuffer());
        return { data: buffer, mimeType: "image/png" };
      })
    );

    return {
      images,
      metadata: {
        provider: this.id,
        model: "seedream",
        durationMs: Date.now() - startTime,
      },
    };
  }
}
