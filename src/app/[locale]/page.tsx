import { setRequestLocale } from "next-intl/server";
import { BoatExplorer } from "@/components/boat/BoatExplorer";
import { getBoat } from "@/lib/boats";
import type { AppLocale } from "@/i18n/routing";

type Props = {
  params: Promise<{ locale: string }>;
};

export default async function HomePage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale as AppLocale);
  const boat = getBoat();
  return <BoatExplorer boat={boat} />;
}
