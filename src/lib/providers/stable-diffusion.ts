import {
  ImageProvider,
  ImageGenerationInput,
  GenerationResult,
  ProviderCapability,
  ProviderConfig,
} from "./types";

export class StableDiffusionProvider implements ImageProvider {
  readonly id = "stable_diffusion";
  readonly name = "Stable Diffusion";
  readonly creditCost = 2;
  readonly capabilities: ProviderCapability = {
    textToImage: true,
    imageToImage: true,
    imageEdit: true,
    removeBackground: false,
  };

  private apiKey: string;

  constructor(config: ProviderConfig) {
    this.apiKey = config.apiKey;
  }

  async generate(input: ImageGenerationInput): Promise<GenerationResult> {
    const startTime = Date.now();

    const fd = new FormData();
    fd.append("prompt", input.prompt);
    if (input.negativePrompt) fd.append("negative_prompt", input.negativePrompt);
    fd.append("aspect_ratio", input.aspectRatio ?? "1:1");
    fd.append("output_format", "png");

    const response = await fetch(
      "https://api.stability.ai/v2beta/stable-image/generate/core",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${this.apiKey}`,
        },
        body: fd,
      }
    );

    if (!response.ok) {
      throw new Error(
        `Stability API error: ${response.status} ${await response.text()}`
      );
    }

    const buffer = Buffer.from(await response.arrayBuffer());

    return {
      images: [{ data: buffer, mimeType: "image/png" }],
      metadata: {
        provider: this.id,
        model: "stable-image-core",
        durationMs: Date.now() - startTime,
      },
    };
  }
}
