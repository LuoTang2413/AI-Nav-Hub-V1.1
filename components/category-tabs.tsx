"use client"

import { useLanguage } from "@/components/language-provider"
import { cn } from "@/lib/utils"
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area"

interface CategoryTabsProps {
  activeCategory: string
  setActiveCategory: (category: string) => void
}

export default function CategoryTabs({ activeCategory, setActiveCategory }: CategoryTabsProps) {
  const { t } = useLanguage()

  const categories = [
    { id: "all", label: t("all") },
    { id: "chatbots", label: t("chatbots") },
    { id: "image_generation", label: t("image_generation") },
    { id: "video", label: t("video") },
    { id: "audio", label: t("audio") },
    { id: "productivity", label: t("productivity") },
    { id: "development", label: t("development") },
    { id: "business", label: t("business") },
    { id: "education", label: t("education") },
    { id: "marketing", label: t("marketing") },
  ]

  return (
    <div className="relative">
      <ScrollArea className="w-full whitespace-nowrap">
        <div className="flex w-max space-x-2 p-1">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => setActiveCategory(category.id)}
              className={cn(
                "inline-flex items-center justify-center whitespace-nowrap rounded-md px-4 py-2 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring",
                activeCategory === category.id
                  ? "bg-primary text-primary-foreground shadow"
                  : "bg-background text-muted-foreground hover:bg-accent hover:text-accent-foreground",
              )}
            >
              {category.label}
            </button>
          ))}
        </div>
        <ScrollBar orientation="horizontal" className="h-2" />
      </ScrollArea>
    </div>
  )
}

