import { ImageProvider, ProviderConfig, ProviderCapability } from "./types";
import { GeminiProvider } from "./gemini";
import { GPTImageProvider } from "./gpt-image";
import { QwenProvider } from "./qwen";
import { StableDiffusionProvider } from "./stable-diffusion";
import { SeedreamProvider } from "./seedream";

type ProviderConstructor = new (config: ProviderConfig) => ImageProvider;

const providerMap: Record<string, ProviderConstructor> = {
  gemini: GeminiProvider,
  gpt_image: GPTImageProvider,
  qwen: QwenProvider,
  stable_diffusion: StableDiffusionProvider,
  seedream: SeedreamProvider,
};

export function getProvider(id: string, apiKey: string): ImageProvider {
  const Ctor = providerMap[id];
  if (!Ctor) throw new Error(`Unknown provider: ${id}`);
  return new Ctor({ apiKey });
}

export function getAvailableProviders(): Array<{
  id: string;
  name: string;
  capabilities: ProviderCapability;
  creditCost: number;
}> {
  return [
    {
      id: "gemini",
      name: "Gemini Nano Banana",
      capabilities: {
        textToImage: true,
        imageToImage: true,
        imageEdit: true,
        removeBackground: false,
      },
      creditCost: 2,
    },
    {
      id: "gpt_image",
      name: "GPT Image",
      capabilities: {
        textToImage: true,
        imageToImage: true,
        imageEdit: true,
        removeBackground: false,
      },
      creditCost: 5,
    },
    {
      id: "qwen",
      name: "Qwen Image",
      capabilities: {
        textToImage: true,
        imageToImage: true,
        imageEdit: false,
        removeBackground: false,
      },
      creditCost: 3,
    },
    {
      id: "stable_diffusion",
      name: "Stable Diffusion",
      capabilities: {
        textToImage: true,
        imageToImage: true,
        imageEdit: true,
        removeBackground: false,
      },
      creditCost: 2,
    },
    {
      id: "seedream",
      name: "Seedream",
      capabilities: {
        textToImage: true,
        imageToImage: false,
        imageEdit: false,
        removeBackground: false,
      },
      creditCost: 3,
    },
  ];
}
