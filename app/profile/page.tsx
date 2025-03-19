"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { User, Mail, Shield, LogOut } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { useLanguage } from "@/components/language-provider"
import { useAuth } from "@/lib/auth"

export default function ProfilePage() {
  const { t } = useLanguage()
  const { user, isAuthenticated, isAdmin, logout } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/login")
    }
  }, [isAuthenticated, router])

  const handleLogout = () => {
    logout()
    router.push("/")
  }

  if (!isAuthenticated || !user) {
    return null
  }

  return (
    <div className="container max-w-md py-10">
      <Card>
        <CardHeader className="text-center">
          <div className="w-20 h-20 mx-auto bg-primary/10 rounded-full flex items-center justify-center mb-4">
            <User className="h-10 w-10 text-primary" />
          </div>
          <CardTitle className="text-2xl flex items-center justify-center gap-2">
            {user.name}
            {isAdmin && <Shield className="h-5 w-5 text-primary" />}
          </CardTitle>
          <CardDescription className="flex items-center justify-center gap-1">
            <Mail className="h-3 w-3" />
            {user.email}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <Card>
              <CardHeader className="p-4 pb-2">
                <CardTitle className="text-sm font-medium">{t("role") || "Role"}</CardTitle>
              </CardHeader>
              <CardContent className="p-4 pt-0">
                <p className="text-sm">
                  {isAdmin ? (
                    <span className="text-primary font-medium">{t("admin") || "Administrator"}</span>
                  ) : (
                    t("user") || "Regular User"
                  )}
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="p-4 pb-2">
                <CardTitle className="text-sm font-medium">{t("account_id") || "Account ID"}</CardTitle>
              </CardHeader>
              <CardContent className="p-4 pt-0">
                <p className="text-sm text-muted-foreground">{user.id}</p>
              </CardContent>
            </Card>
          </div>

          {isAdmin && (
            <Button
              variant="outline"
              className="w-full flex items-center justify-center gap-2"
              onClick={() => router.push("/admin/submissions")}
            >
              <Shield className="h-4 w-4" />
              {t("admin_submissions") || "Manage Submissions"}
            </Button>
          )}
        </CardContent>
        <CardFooter>
          <Button variant="destructive" className="w-full" onClick={handleLogout}>
            <LogOut className="h-4 w-4 mr-2" />
            {t("logout")}
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}

