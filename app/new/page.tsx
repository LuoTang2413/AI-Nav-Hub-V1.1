"use client"
import { Calendar } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useLanguage } from "@/components/language-provider"
import { mockTools } from "@/lib/mock-data"

export default function NewPage() {
  const { t } = useLanguage()

  // For demo purposes, we'll just use the first 6 tools and pretend they're new
  const newTools = mockTools.slice(0, 6).map((tool, index) => ({
    ...tool,
    addedDate: new Date(Date.now() - index * 24 * 60 * 60 * 1000), // Each tool added a day apart
  }))

  return (
    <div className="container py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">{t("new")}</h1>
        <p className="text-muted-foreground mt-1">{t("new_description") || "Recently added AI tools"}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {newTools.map((tool) => (
          <Card key={tool.id} className="overflow-hidden hover:shadow-md transition-shadow">
            <CardHeader className="p-4">
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-3">
                  <div className="h-12 w-12 rounded-lg overflow-hidden flex items-center justify-center bg-primary/5">
                    {tool.icon}
                  </div>
                  <CardTitle className="text-lg">{tool.name}</CardTitle>
                </div>
                <Badge variant="outline" className="flex items-center gap-1">
                  <Calendar className="h-3 w-3" />
                  {tool.addedDate.toLocaleDateString()}
                </Badge>
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

