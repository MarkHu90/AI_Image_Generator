import {
  ImageProvider,
  ImageGenerationInput,
  GenerationResult,
  ProviderCapability,
  ProviderConfig,
} from "./types";
import OpenAI from "openai";

export class GPTImageProvider implements ImageProvider {
  readonly id = "gpt_image";
  readonly name = "GPT Image";
  readonly creditCost = 5;
  readonly capabilities: ProviderCapability = {
    textToImage: true,
    imageToImage: true,
    imageEdit: true,
    removeBackground: false,
  };

  private client: OpenAI;

  constructor(config: ProviderConfig) {
    this.client = new OpenAI({ apiKey: config.apiKey });
  }

  async generate(input: ImageGenerationInput): Promise<GenerationResult> {
    const startTime = Date.now();
    const size =
      input.aspectRatio === "16:9"
        ? "1792x1024"
        : input.aspectRatio === "9:16"
          ? "1024x1792"
          : "1024x1024";

    const response = await this.client.images.generate({
      model: "dall-e-3",
      prompt: input.prompt,
      n: input.imageCount ?? 1,
      size,
      quality: "standard",
      response_format: "b64_json",
    });

    const images = (response.data ?? []).map((img) => ({
      data: Buffer.from(img.b64_json!, "base64"),
      mimeType: "image/png",
    }));

    return {
      images,
      metadata: {
        provider: this.id,
        model: "dall-e-3",
        durationMs: Date.now() - startTime,
        revisedPrompt: response.data?.[0]?.revised_prompt,
      },
    };
  }
}
