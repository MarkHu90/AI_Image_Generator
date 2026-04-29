import {
  ImageProvider,
  ImageGenerationInput,
  GenerationResult,
  ProviderCapability,
  ProviderConfig,
} from "./types";

export class QwenProvider implements ImageProvider {
  readonly id = "qwen";
  readonly name = "Qwen Image";
  readonly creditCost = 3;
  readonly capabilities: ProviderCapability = {
    textToImage: true,
    imageToImage: true,
    imageEdit: false,
    removeBackground: false,
  };

  private apiKey: string;

  constructor(config: ProviderConfig) {
    this.apiKey = config.apiKey;
  }

  async generate(input: ImageGenerationInput): Promise<GenerationResult> {
    const startTime = Date.now();
    const size =
      input.aspectRatio === "16:9"
        ? "1792*1024"
        : input.aspectRatio === "9:16"
          ? "1024*1792"
          : "1024*1024";

    const response = await fetch(
      "https://dashscope.aliyuncs.com/api/v1/services/aigc/text2image/image-synthesis",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${this.apiKey}`,
        },
        body: JSON.stringify({
          model: "qwen-max-image-generation",
          input: {
            prompt: input.prompt,
            negative_prompt: input.negativePrompt,
          },
          parameters: {
            size,
            n: input.imageCount ?? 1,
          },
        }),
      }
    );

    if (!response.ok) {
      throw new Error(
        `Qwen API error: ${response.status} ${await response.text()}`
      );
    }

    const data = await response.json();
    const images = await Promise.all(
      data.output.results.map(async (img: { url: string }) => {
        const imgRes = await fetch(img.url);
        const buffer = Buffer.from(await imgRes.arrayBuffer());
        return { data: buffer, mimeType: "image/png" };
      })
    );

    return {
      images,
      metadata: {
        provider: this.id,
        model: "qwen-max-image-generation",
        durationMs: Date.now() - startTime,
      },
    };
  }
}
