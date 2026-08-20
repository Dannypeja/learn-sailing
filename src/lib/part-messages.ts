import type { useTranslations } from "next-intl";

type PartsTranslator = ReturnType<typeof useTranslations<"parts">>;

export function partName(t: PartsTranslator, id: string) {
  return t(`${id}.name` as "hull.name");
}

export function partDescription(t: PartsTranslator, id: string) {
  return t(`${id}.description` as "hull.description");
}
