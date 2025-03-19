"use client"

import { useState } from "react"
import { Heart, Clock } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useLanguage } from "@/components/language-provider"
import { mockTools } from "@/lib/mock-data"

export default function PopularPage() {
  const { t } = useLanguage()
  const [sortBy, setSortBy] = useState<"popular" | "newest">("popular")

  // Simulate popularity by using the ID as a "popularity score"
  const sortedTools = [...mockTools].sort((a, b) => {
    if (sortBy === "popular") {
      // Sort by ID in reverse (higher ID = more popular for this demo)
      return Number.parseInt(b.id) - Number.parseInt(a.id)
    } else {
      // Sort by ID (lower ID = older for this demo)
      return Number.parseInt(a.id) - Number.parseInt(b.id)
    }
  })

  return (
    <div className="container py-10">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{t("popular")}</h1>
          <p className="text-muted-foreground mt-1">
            {t("popular_description") || "Discover the most popular AI tools"}
          </p>
        </div>
        <div className="flex space-x-2">
          <Button
            variant={sortBy === "popular" ? "default" : "outline"}
            size="sm"
            onClick={() => setSortBy("popular")}
            className="flex items-center"
          >
            <Heart className="h-4 w-4 mr-2" />
            {t("most_popular") || "Most Popular"}
          </Button>
          <Button
            variant={sortBy === "newest" ? "default" : "outline"}
            size="sm"
            onClick={() => setSortBy("newest")}
            className="flex items-center"
          >
            <Clock className="h-4 w-4 mr-2" />
            {t("newest") || "Newest"}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {sortedTools.map((tool) => (
          <Card key={tool.id} className="overflow-hidden hover:shadow-md transition-shadow">
            <CardHeader className="p-4">
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-3">
                  <div className="h-12 w-12 rounded-lg overflow-hidden flex items-center justify-center bg-primary/5">
                    {tool.icon}
                  </div>
                  <CardTitle className="text-lg">{tool.name}</CardTitle>
                </div>
                <Badge variant="outline">#{sortBy === "popular" ? 13 - Number.parseInt(tool.id) : tool.id}</Badge>
              </div>
            </CardHeader>
            <CardContent className="p-4 pt-0">
              <p className="text-sm text-muted-foreground line-clamp-3">{tool.description}</p>
            </CardContent>
            <CardFooter className="p-4 pt-0 flex items-center justify-between">
              <Badge variant="secondary">{tool.category}</Badge>
              <Button variant="outline" size="sm" asChild>
                <a href={tool.url} target="_blank" rel="noopener noreferrer">
                  {t("visit") || "Visit"}
                </a>
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  )
}

