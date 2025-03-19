"use client"

import { useState } from "react"
import { usePathname, useRouter } from "next/navigation"
import { Menu, Globe, User, LogIn, Plus, Shield, Upload } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { useLanguage } from "@/components/language-provider"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"
import { cn } from "@/lib/utils"
import { useAuth } from "@/lib/auth"
import LoginDialog from "@/components/login-dialog"

export default function Header() {
  const pathname = usePathname()
  const router = useRouter()
  const { language, setLanguage, t } = useLanguage()
  const { user, isAuthenticated, isAdmin, logout } = useAuth()
  const [showLoginDialog, setShowLoginDialog] = useState(false)

  const languages = [
    { code: "en", name: "English" },
    { code: "zh", name: "中文" },
    { code: "es", name: "Español" },
    { code: "fr", name: "Français" },
    { code: "ja", name: "日本語" },
    { code: "de", name: "Deutsch" },
  ]

  const navItems = [
    { href: "/", label: t("home") },
    { href: "/categories", label: t("categories") },
    { href: "/popular", label: t("popular") },
    { href: "/new", label: t("new") },
  ]

  const handleNavigation = (href: string) => {
    router.push(href)
  }

  const handleLogout = () => {
    logout()
    router.push("/")
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-2">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden">
                <Menu className="h-5 w-5" />
                <span className="sr-only">{t("open_menu")}</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left">
              <div className="flex flex-col gap-4 py-4">
                {navItems.map((item) => (
                  <button
                    key={item.href}
                    onClick={() => handleNavigation(item.href)}
                    className={cn(
                      "text-left text-lg font-medium transition-colors hover:text-primary",
                      pathname === item.href ? "text-primary" : "text-muted-foreground",
                    )}
                  >
                    {item.label}
                  </button>
                ))}
                <button
                  onClick={() => handleNavigation("/submit")}
                  className={cn(
                    "text-left text-lg font-medium transition-colors hover:text-primary",
                    pathname === "/submit" ? "text-primary" : "text-muted-foreground",
                  )}
                >
                  {t("submit")}
                </button>
              </div>
            </SheetContent>
          </Sheet>

          <Button variant="ghost" className="flex items-center gap-2 px-2" onClick={() => handleNavigation("/")}>
            <span className="text-xl font-bold">AI NavHub</span>
          </Button>

          <nav className="hidden md:flex items-center gap-6 ml-6">
            {navItems.map((item) => (
              <Button
                key={item.href}
                variant="ghost"
                className={cn(
                  "text-sm font-medium transition-colors hover:text-primary hover:bg-accent",
                  pathname === item.href ? "text-primary bg-accent/50" : "text-muted-foreground",
                )}
                onClick={() => handleNavigation(item.href)}
              >
                {item.label}
              </Button>
            ))}
            <Button
              variant="outline"
              size="sm"
              className={cn(
                "flex items-center gap-1",
                pathname === "/submit" && "bg-primary text-primary-foreground hover:bg-primary/90",
              )}
              onClick={() => handleNavigation("/submit")}
            >
              <Plus className="h-4 w-4" />
              {t("submit")}
            </Button>
          </nav>
        </div>

        <div className="flex items-center gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="hover:bg-accent">
                <Globe className="h-5 w-5" />
                <span className="sr-only">{t("change_language")}</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {languages.map((lang) => (
                <DropdownMenuItem
                  key={lang.code}
                  onClick={() => setLanguage(lang.code)}
                  className={cn("cursor-pointer", language === lang.code && "font-bold text-primary bg-accent/50")}
                >
                  {lang.name}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          {isAuthenticated ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="hover:bg-accent">
                  {isAdmin ? (
                    <div className="relative">
                      <User className="h-5 w-5" />
                      <Shield className="h-3 w-3 absolute -top-1 -right-1 text-primary" />
                    </div>
                  ) : (
                    <User className="h-5 w-5" />
                  )}
                  <span className="sr-only">{t("user_menu")}</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem 
                  className="cursor-pointer"
                  onClick={() => handleNavigation("/profile")}
                >
                  {t("profile")}
                </DropdownMenuItem>
                <DropdownMenuItem 
                  className="cursor-pointer"
                  onClick={() => handleNavigation("/favorites")}
                >
                  {t("favorites")}
                </DropdownMenuItem>
                <DropdownMenuItem 
                  className="cursor-pointer"
                  onClick={() => handleNavigation("/settings")}
                >
                  {t("settings")}
                </DropdownMenuItem>
                
                {isAdmin && (
                  <>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem 
                      className="cursor-pointer text-primary font-medium"
                      onClick={() => handleNavigation("/admin/submissions")}
                    >
                      <Shield className="h-4 w-4 mr-2" />
                      {t("admin_submissions") || "Manage Submissions"}
                    </DropdownMenuItem>
                    <DropdownMenuItem 
                      className="cursor-pointer text-primary"
                      onClick={() => handleNavigation("/admin/import")}
                    >
                      <Upload className="h-4 w-4 mr-2" />
                      {t("bulk_import") || "Bulk Import"}
                    </DropdownMenuItem>
                  </>
                )}
                
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  className="cursor-pointer text-destructive focus:text-destructive"
                  onClick={handleLogout}
                >
                  {t("logout")}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Button 
              variant="default" 
              size="sm" 
              onClick={() => setShowLoginDialog(true)}
              className="hover:bg-primary/90 active:scale-95 transition-transform"
            >
              <LogIn className="h-4 w-4 mr-2" />
              {t("login")}
            </Button>
          )}
        </div>
      </div>
      <LoginDialog open={showLoginDialog} onOpenChange={setShowLoginDialog} />
    </header>
  )
}

