import { db } from "@/lib/db";
import { getAvailableProviders } from "@/lib/providers/registry";

export async function checkCredits(
  userId: string,
  providerId: string
): Promise<boolean> {
  const user = await db.user.findUnique({ where: { id: userId } });
  if (!user) return false;
  const providers = getAvailableProviders();
  const provider = providers.find((p) => p.id === providerId);
  if (!provider) return false;
  return user.credits >= provider.creditCost;
}

export async function deductCredits(
  userId: string,
  providerId: string
): Promise<number> {
  const providers = getAvailableProviders();
  const provider = providers.find((p) => p.id === providerId);
  if (!provider) throw new Error(`Unknown provider: ${providerId}`);

  const user = await db.user.update({
    where: { id: userId },
    data: { credits: { decrement: provider.creditCost } },
  });
  return user.credits;
}
