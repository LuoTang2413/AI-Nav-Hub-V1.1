"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Moon, Sun, Monitor } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { useLanguage } from "@/components/language-provider"
import { useAuth } from "@/lib/auth"
import { useTheme } from "@/components/theme-provider"

export default function SettingsPage() {
  const { t, language, setLanguage } = useLanguage()
  const { isAuthenticated } = useAuth()
  const router = useRouter()
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/login")
    }
    setMounted(true)
  }, [isAuthenticated, router])

  // Prevent hydration mismatch
  if (!mounted) {
    return null
  }

  if (!isAuthenticated) {
    return null
  }

  const languages = [
    { code: "en", name: "English" },
    { code: "zh", name: "中文" },
    { code: "es", name: "Español" },
    { code: "fr", name: "Français" },
    { code: "ja", name: "日本語" },
    { code: "de", name: "Deutsch" },
  ]

  return (
    <div className="container max-w-2xl py-10">
      <h1 className="text-3xl font-bold tracking-tight mb-6">{t("settings") || "Settings"}</h1>

      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>{t("appearance") || "Appearance"}</CardTitle>
            <CardDescription>
              {t("appearance_description") || "Customize how the application looks on your device."}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <RadioGroup value={theme} onValueChange={setTheme} className="grid grid-cols-3 gap-4">
              <div>
                <RadioGroupItem value="light" id="light" className="sr-only" />
                <Label
                  htmlFor="light"
                  className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground cursor-pointer"
                  data-state={theme === "light" ? "checked" : "unchecked"}
                >
                  <Sun className="h-6 w-6 mb-2" />
                  <span className="text-sm font-medium">{t("light") || "Light"}</span>
                </Label>
              </div>
              <div>
                <RadioGroupItem value="dark" id="dark" className="sr-only" />
                <Label
                  htmlFor="dark"
                  className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground cursor-pointer"
                  data-state={theme === "dark" ? "checked" : "unchecked"}
                >
                  <Moon className="h-6 w-6 mb-2" />
                  <span className="text-sm font-medium">{t("dark") || "Dark"}</span>
                </Label>
              </div>
              <div>
                <RadioGroupItem value="system" id="system" className="sr-only" />
                <Label
                  htmlFor="system"
                  className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground cursor-pointer"
                  data-state={theme === "system" ? "checked" : "unchecked"}
                >
                  <Monitor className="h-6 w-6 mb-2" />
                  <span className="text-sm font-medium">{t("system") || "System"}</span>
                </Label>
              </div>
            </RadioGroup>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>{t("language") || "Language"}</CardTitle>
            <CardDescription>
              {t("language_description") || "Choose your preferred language for the application."}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <RadioGroup value={language} onValueChange={setLanguage} className="grid grid-cols-2 gap-4">
              {languages.map((lang) => (
                <div key={lang.code}>
                  <RadioGroupItem value={lang.code} id={lang.code} className="sr-only" />
                  <Label
                    htmlFor={lang.code}
                    className="flex items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground cursor-pointer"
                    data-state={language === lang.code ? "checked" : "unchecked"}
                  >
                    <span className="text-sm font-medium">{lang.name}</span>
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

