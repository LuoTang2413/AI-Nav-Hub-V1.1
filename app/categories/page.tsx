"use client"

import { useState } from "react"
import { Grid3X3, List } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useLanguage } from "@/components/language-provider"
import { mockTools } from "@/lib/mock-data"

export default function CategoriesPage() {
  const { t } = useLanguage()
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")

  // Get unique categories from tools
  const categories = Array.from(new Set(mockTools.map((tool) => tool.category)))
    .sort()
    .map((category) => ({
      name: category,
      count: mockTools.filter((tool) => tool.category === category).length,
      // Get a representative tool icon for the category
      icon: mockTools.find((tool) => tool.category === category)?.icon,
    }))

  return (
    <div className="container py-10">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{t("categories")}</h1>
          <p className="text-muted-foreground mt-1">
            {t("browse_categories_description") || "Browse AI tools by category"}
          </p>
        </div>
        <div className="flex space-x-2">
          <Button variant={viewMode === "grid" ? "default" : "outline"} size="icon" onClick={() => setViewMode("grid")}>
            <Grid3X3 className="h-4 w-4" />
            <span className="sr-only">Grid view</span>
          </Button>
          <Button variant={viewMode === "list" ? "default" : "outline"} size="icon" onClick={() => setViewMode("list")}>
            <List className="h-4 w-4" />
            <span className="sr-only">List view</span>
          </Button>
        </div>
      </div>

      {viewMode === "grid" ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {categories.map((category) => (
            <Card key={category.name} className="hover:shadow-md transition-shadow cursor-pointer">
              <CardHeader className="pb-2">
                <div className="flex items-center space-x-3">
                  <div className="h-10 w-10 rounded-lg overflow-hidden flex items-center justify-center bg-primary/5">
                    {category.icon}
                  </div>
                  <CardTitle>{category.name}</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  {category.count} {category.count === 1 ? t("tool") : t("tools")}
                </CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="space-y-2">
          {categories.map((category) => (
            <Card key={category.name} className="hover:bg-accent/50 transition-colors cursor-pointer">
              <div className="flex items-center justify-between p-4">
                <div className="flex items-center space-x-3">
                  <div className="h-8 w-8 rounded-lg overflow-hidden flex items-center justify-center bg-primary/5">
                    {category.icon}
                  </div>
                  <div>
                    <h3 className="font-medium">{category.name}</h3>
                    <p className="text-sm text-muted-foreground">
                      {category.count} {category.count === 1 ? t("tool") : t("tools")}
                    </p>
                  </div>
                </div>
                <Button variant="ghost" size="sm">
                  {t("view") || "View"}
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}

