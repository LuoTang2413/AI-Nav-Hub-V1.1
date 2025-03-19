"use client"

import { cn } from "@/lib/utils"
import { useState, useEffect } from "react"
import { Heart } from "lucide-react"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useLanguage } from "@/components/language-provider"
import { useAuth } from "@/lib/auth"
import { mockTools } from "@/lib/mock-data"

interface ToolGridProps {
  activeCategory: string
}

export default function ToolGrid({ activeCategory }: ToolGridProps) {
  const { t, language } = useLanguage()
  const { isAuthenticated } = useAuth()
  const [tools, setTools] = useState(mockTools)
  const [filteredTools, setFilteredTools] = useState(mockTools)
  const [favorites, setFavorites] = useState<string[]>([])

  useEffect(() => {
    // In a real app, you would fetch tools from an API
    setTools(mockTools)
  }, [language])

  useEffect(() => {
    // Filter tools based on active category
    if (activeCategory === "all") {
      setFilteredTools(tools)
    } else {
      const filtered = tools.filter((tool) => {
        // Convert category to lowercase for case-insensitive comparison
        const normalizedToolCategory = tool.category.toLowerCase().replace(/\s+/g, "_")
        const normalizedActiveCategory = activeCategory.toLowerCase()

        // Special case for "Image Generation" category
        if (
          normalizedActiveCategory === "image_generation" &&
          (normalizedToolCategory === "image_generation" || tool.category === "Image Generation")
        ) {
          return true
        }

        return normalizedToolCategory === normalizedActiveCategory
      })

      setFilteredTools(filtered)
      console.log(`Filtered to ${filtered.length} tools for category: ${activeCategory}`)
    }
  }, [activeCategory, tools])

  const toggleFavorite = (id: string) => {
    if (!isAuthenticated) {
      // Show login prompt
      return
    }

    setFavorites((prev) => (prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]))
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-8">
      {filteredTools.length === 0 ? (
        <div className="col-span-full text-center py-10 text-muted-foreground">{t("no_tools_found")}</div>
      ) : (
        filteredTools.map((tool) => (
          <Card key={tool.id} className="overflow-hidden hover:shadow-md transition-shadow">
            <CardHeader className="p-4">
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-3">
                  <div className="h-12 w-12 rounded-lg overflow-hidden flex items-center justify-center bg-primary/5">
                    {tool.icon}
                  </div>
                  <CardTitle className="text-lg">{tool.name}</CardTitle>
                </div>
                <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => toggleFavorite(tool.id)}>
                  <Heart
                    className={cn(
                      "h-4 w-4",
                      favorites.includes(tool.id) ? "fill-primary text-primary" : "text-muted-foreground",
                    )}
                  />
                  <span className="sr-only">Toggle favorite</span>
                </Button>
              </div>
            </CardHeader>
            <CardContent className="p-4 pt-0">
              <p className="text-sm text-muted-foreground line-clamp-3">{tool.description}</p>
            </CardContent>
            <CardFooter className="p-4 pt-0 flex items-center justify-between">
              <Badge variant="secondary">{tool.category}</Badge>
              <Button variant="outline" size="sm" asChild>
                <a href={tool.url} target="_blank" rel="noopener noreferrer">
                  Visit
                </a>
              </Button>
            </CardFooter>
          </Card>
        ))
      )}
    </div>
  )
}

