import {
  ImageProvider,
  ImageGenerationInput,
  GenerationResult,
  ProviderCapability,
  ProviderConfig,
} from "./types";

export class GeminiProvider implements ImageProvider {
  readonly id = "gemini";
  readonly name = "Gemini Nano Banana";
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

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp-image-generation:generateContent?key=${this.apiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: input.prompt }] }],
          generationConfig: {
            responseModalities: ["TEXT", "IMAGE"],
          },
        }),
      }
    );

    if (!response.ok) {
      throw new Error(
        `Gemini API error: ${response.status} ${await response.text()}`
      );
    }

    const data = await response.json();
    const images: Array<{ data: Buffer; mimeType: string }> = [];

    for (const part of data.candidates?.[0]?.content?.parts ?? []) {
      if (part.inlineData) {
        images.push({
          data: Buffer.from(part.inlineData.data, "base64"),
          mimeType: part.inlineData.mimeType ?? "image/png",
        });
      }
    }

    return {
      images,
      metadata: {
        provider: this.id,
        model: "gemini-2.0-flash-exp-image-generation",
        durationMs: Date.now() - startTime,
      },
    };
  }
}
