"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Heart, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/hooks/use-toast"
import { useLanguage } from "@/components/language-provider"
import { useAuth } from "@/lib/auth"
import { mockTools } from "@/lib/mock-data"

export default function FavoritesPage() {
  const { t } = useLanguage()
  const { isAuthenticated } = useAuth()
  const router = useRouter()
  const { toast } = useToast()
  const [favorites, setFavorites] = useState<string[]>([])
  const [favoritedTools, setFavoritedTools] = useState(mockTools.slice(0, 4))

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/login")
    }

    // In a real app, you would fetch the user's favorites from an API
    // For demo purposes, we'll just use a few random tools
    const storedFavorites = localStorage.getItem("favorites")
    if (storedFavorites) {
      const parsedFavorites = JSON.parse(storedFavorites)
      setFavorites(parsedFavorites)

      // Filter tools based on favorites
      const tools = mockTools.filter((tool) => parsedFavorites.includes(tool.id))
      if (tools.length > 0) {
        setFavoritedTools(tools)
      }
    } else {
      // Set some default favorites for demo
      const defaultFavorites = mockTools.slice(0, 4).map((t) => t.id)
      setFavorites(defaultFavorites)
      localStorage.setItem("favorites", JSON.stringify(defaultFavorites))
    }
  }, [isAuthenticated, router])

  const removeFavorite = (id: string) => {
    const newFavorites = favorites.filter((fav) => fav !== id)
    setFavorites(newFavorites)
    localStorage.setItem("favorites", JSON.stringify(newFavorites))

    // Update the displayed tools
    setFavoritedTools((prevTools) => prevTools.filter((tool) => tool.id !== id))

    toast({
      title: t("removed_from_favorites") || "Removed from favorites",
      description: mockTools.find((t) => t.id === id)?.name,
    })
  }

  if (!isAuthenticated) {
    return null
  }

  return (
    <div className="container py-10">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{t("favorites") || "Favorites"}</h1>
          <p className="text-muted-foreground mt-1">{t("favorites_description") || "Your saved AI tools"}</p>
        </div>
      </div>

      {favoritedTools.length === 0 ? (
        <div className="text-center py-20">
          <Heart className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
          <h2 className="text-xl font-medium mb-2">{t("no_favorites") || "No favorites yet"}</h2>
          <p className="text-muted-foreground mb-6">
            {t("no_favorites_description") || "You haven't added any tools to your favorites yet."}
          </p>
          <Button onClick={() => router.push("/")}>{t("browse_tools") || "Browse Tools"}</Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {favoritedTools.map((tool) => (
            <Card key={tool.id} className="overflow-hidden hover:shadow-md transition-shadow">
              <CardHeader className="p-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="h-12 w-12 rounded-lg overflow-hidden flex items-center justify-center bg-primary/5">
                      {tool.icon}
                    </div>
                    <CardTitle className="text-lg">{tool.name}</CardTitle>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-destructive hover:text-destructive"
                    onClick={() => removeFavorite(tool.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                    <span className="sr-only">Remove from favorites</span>
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
                    {t("visit") || "Visit"}
                  </a>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}

