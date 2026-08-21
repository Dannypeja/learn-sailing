import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { SailStudio } from "@/components/sail/SailStudio";
import type { AppLocale } from "@/i18n/routing";

type Props = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({
    locale: locale as AppLocale,
    namespace: "sail.meta",
  });
  return {
    title: t("title"),
    description: t("description"),
  };
}

export default async function SailPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale as AppLocale);
  return <SailStudio />;
}
