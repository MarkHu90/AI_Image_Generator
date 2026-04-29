export type TaskType = "text_to_image" | "image_to_image" | "edit" | "remove_bg";

export interface ProviderCapability {
  textToImage: boolean;
  imageToImage: boolean;
  imageEdit: boolean;
  removeBackground: boolean;
}

export interface ImageGenerationInput {
  prompt: string;
  negativePrompt?: string;
  aspectRatio?: "1:1" | "4:3" | "16:9" | "9:16";
  referenceImage?: string;
  strength?: number;
  imageCount?: number;
  seed?: number;
}

export interface ImageEditInput {
  image: string;
  prompt: string;
  mask?: string;
}

export interface RemoveBgInput {
  image: string;
  format?: "png" | "webp";
}

export interface GenerationResult {
  images: Array<{ data: Buffer; mimeType: string }>;
  metadata: {
    provider: string;
    model: string;
    durationMs: number;
    revisedPrompt?: string;
  };
}

export interface ImageProvider {
  readonly id: string;
  readonly name: string;
  readonly capabilities: ProviderCapability;
  readonly creditCost: number;
  generate(params: ImageGenerationInput): Promise<GenerationResult>;
  edit?(params: ImageEditInput): Promise<GenerationResult>;
  removeBackground?(params: RemoveBgInput): Promise<GenerationResult>;
}

export interface ProviderConfig {
  apiKey: string;
}
