"use client"

import { useLanguage } from "@/components/language-provider"

export default function Hero() {
  const { t } = useLanguage()

  return (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">{t("hero_title")} 2025</h1>
      <p className="mt-4 text-lg text-muted-foreground max-w-2xl">{t("hero_subtitle")}</p>
    </div>
  )
}

