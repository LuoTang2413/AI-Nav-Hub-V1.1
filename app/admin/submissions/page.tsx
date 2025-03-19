"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { CheckCircle, XCircle, Eye, Shield, Upload } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/hooks/use-toast"
import { useLanguage } from "@/components/language-provider"
import { useAuth } from "@/lib/auth"
import { getSubmissions, updateSubmissionStatus, type AIToolSubmission } from "@/lib/actions"

export default function AdminSubmissionsPage() {
  const { isAuthenticated, isAdmin } = useAuth()
  const router = useRouter()
  const { toast } = useToast()
  const { language } = useLanguage()
  const [submissions, setSubmissions] = useState<AIToolSubmission[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [activeTab, setActiveTab] = useState("pending")
  const [selectedSubmission, setSelectedSubmission] = useState<AIToolSubmission | null>(null)
  const [reviewNotes, setReviewNotes] = useState("")
  const [showReviewDialog, setShowReviewDialog] = useState(false)
  const [reviewAction, setReviewAction] = useState<"approve" | "reject" | null>(null)

  // Translations for admin page
  const translations = {
    admin_title: {
      en: "Submission Review",
      zh: "提交审核",
      es: "Revisión de Envíos",
      fr: "Examen des Soumissions",
      ja: "提出物の審査",
      de: "Überprüfung der Einreichungen",
    },
    admin_description: {
      en: "Review and manage AI tool submissions",
      zh: "审核和管理AI工具提交",
      es: "Revisar y gestionar envíos de herramientas de IA",
      fr: "Examiner et gérer les soumissions d'outils d'IA",
      ja: "AIツールの提出物を審査・管理する",
      de: "Überprüfen und verwalten Sie KI-Tool-Einreichungen",
    },
    pending: {
      en: "Pending",
      zh: "待审核",
      es: "Pendiente",
      fr: "En attente",
      ja: "保留中",
      de: "Ausstehend",
    },
    approved: {
      en: "Approved",
      zh: "已批准",
      es: "Aprobado",
      fr: "Approuvé",
      ja: "承認済み",
      de: "Genehmigt",
    },
    rejected: {
      en: "Rejected",
      zh: "已拒绝",
      es: "Rechazado",
      fr: "Rejeté",
      ja: "拒否済み",
      de: "Abgelehnt",
    },
    no_submissions: {
      en: "No submissions found",
      zh: "未找到提交",
      es: "No se encontraron envíos",
      fr: "Aucune soumission trouvée",
      ja: "提出物が見つかりません",
      de: "Keine Einreichungen gefunden",
    },
    view_details: {
      en: "View Details",
      zh: "查看详情",
      es: "Ver Detalles",
      fr: "Voir les Détails",
      ja: "詳細を見る",
      de: "Details anzeigen",
    },
    approve: {
      en: "Approve",
      zh: "批准",
      es: "Aprobar",
      fr: "Approuver",
      ja: "承認",
      de: "Genehmigen",
    },
    reject: {
      en: "Reject",
      zh: "拒绝",
      es: "Rechazar",
      fr: "Rejeter",
      ja: "拒否",
      de: "Ablehnen",
    },
    confirm_approve: {
      en: "Confirm Approval",
      zh: "确认批准",
      es: "Confirmar Aprobación",
      fr: "Confirmer l'Approbation",
      ja: "承認を確認",
      de: "Genehmigung bestätigen",
    },
    confirm_reject: {
      en: "Confirm Rejection",
      zh: "确认拒绝",
      es: "Confirmar Rechazo",
      fr: "Confirmer le Rejet",
      ja: "拒否を確認",
      de: "Ablehnung bestätigen",
    },
    review_notes: {
      en: "Review Notes (optional)",
      zh: "审核备注（可选）",
      es: "Notas de Revisión (opcional)",
      fr: "Notes d'Examen (optionnel)",
      ja: "審査メモ（任意）",
      de: "Überprüfungsnotizen (optional)",
    },
    cancel: {
      en: "Cancel",
      zh: "取消",
      es: "Cancelar",
      fr: "Annuler",
      ja: "キャンセル",
      de: "Abbrechen",
    },
    confirm: {
      en: "Confirm",
      zh: "确认",
      es: "Confirmar",
      fr: "Confirmer",
      ja: "確認",
      de: "Bestätigen",
    },
    unauthorized: {
      en: "You are not authorized to view this page",
      zh: "您无权查看此页面",
      es: "No está autorizado para ver esta página",
      fr: "Vous n'êtes pas autorisé à voir cette page",
      ja: "このページを表示する権限がありません",
      de: "Sie sind nicht berechtigt, diese Seite anzusehen",
    },
    submitted_by: {
      en: "Submitted by",
      zh: "提交者",
      es: "Enviado por",
      fr: "Soumis par",
      ja: "提出者",
      de: "Eingereicht von",
    },
    submitted_on: {
      en: "Submitted on",
      zh: "提交日期",
      es: "Enviado el",
      fr: "Soumis le",
      ja: "提出日",
      de: "Eingereicht am",
    },
    admin_only: {
      en: "This page is only accessible to administrators.",
      zh: "此页面仅供管理员访问。",
      es: "Esta página solo es accesible para administradores.",
      fr: "Cette page est uniquement accessible aux administrateurs.",
      ja: "このページは管理者のみがアクセスできます。",
      de: "Diese Seite ist nur für Administratoren zugänglich.",
    },
    back_home: {
      en: "Back to Home",
      zh: "返回首页",
      es: "Volver a la página principal",
      fr: "Retour à l'accueil",
      ja: "ホームページに戻る",
      de: "Zurück zur Startseite",
    },
    bulk_import: {
      en: "Bulk Import",
      zh: "批量导入",
      es: "Importación Masiva",
      fr: "Importation en Masse",
      ja: "一括インポート",
      de: "Massenimport",
    },
  }

  // Helper function to get translation
  const getTranslation = (key: keyof typeof translations) => {
    const lang = language as keyof (typeof translations)[typeof key]
    return translations[key][lang] || translations[key].en
  }

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/login")
      return
    }

    if (!isAdmin) {
      toast({
        title: getTranslation("unauthorized"),
        variant: "destructive",
      })
      router.push("/")
      return
    }

    async function loadSubmissions() {
      setIsLoading(true)
      try {
        const status = activeTab as "pending" | "approved" | "rejected"
        const data = await getSubmissions(status)
        setSubmissions(data)
      } catch (error) {
        console.error("Error loading submissions:", error)
        toast({
          title: "Error loading submissions",
          description: error instanceof Error ? error.message : "Unknown error",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    loadSubmissions()
  }, [isAuthenticated, isAdmin, activeTab, router, toast])

  const handleViewDetails = (submission: AIToolSubmission) => {
    setSelectedSubmission(submission)
  }

  const handleApprove = (submission: AIToolSubmission) => {
    setSelectedSubmission(submission)
    setReviewAction("approve")
    setReviewNotes("")
    setShowReviewDialog(true)
  }

  const handleReject = (submission: AIToolSubmission) => {
    setSelectedSubmission(submission)
    setReviewAction("reject")
    setReviewNotes("")
    setShowReviewDialog(true)
  }

  const handleConfirmReview = async () => {
    if (!selectedSubmission || !reviewAction) return

    try {
      await updateSubmissionStatus(selectedSubmission.submittedAt, reviewAction, reviewNotes)

      toast({
        title: reviewAction === "approve" ? "Submission approved" : "Submission rejected",
        description: selectedSubmission.name,
      })

      // Refresh the submissions list
      const data = await getSubmissions(activeTab as "pending" | "approved" | "rejected")
      setSubmissions(data)
    } catch (error) {
      console.error("Error updating submission:", error)
      toast({
        title: "Error updating submission",
        description: error instanceof Error ? error.message : "Unknown error",
        variant: "destructive",
      })
    } finally {
      setShowReviewDialog(false)
      setSelectedSubmission(null)
      setReviewAction(null)
    }
  }

  if (!isAuthenticated || !isAdmin) {
    return (
      <div className="container py-20 text-center">
        <Shield className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
        <h1 className="text-2xl font-bold mb-2">{getTranslation("unauthorized")}</h1>
        <p className="text-muted-foreground mb-6">
          {getTranslation("admin_only") || "This page is only accessible to administrators."}
        </p>
        <Button onClick={() => router.push("/")}>{getTranslation("back_home") || "Back to Home"}</Button>
      </div>
    )
  }

  return (
    <div className="container py-10">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{getTranslation("admin_title")}</h1>
          <p className="text-muted-foreground mt-1">{getTranslation("admin_description")}</p>
        </div>
        <Button variant="outline" className="flex items-center gap-2" onClick={() => router.push("/admin/import")}>
          <Upload className="h-4 w-4" />
          {getTranslation("bulk_import")}
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{getTranslation("admin_title")}</CardTitle>
          <CardDescription>{getTranslation("admin_description")}</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="mb-6">
              <TabsTrigger value="pending">
                {getTranslation("pending")}
                {submissions.length > 0 && activeTab === "pending" && (
                  <Badge variant="destructive" className="ml-2">
                    {submissions.length}
                  </Badge>
                )}
              </TabsTrigger>
              <TabsTrigger value="approved">{getTranslation("approved")}</TabsTrigger>
              <TabsTrigger value="rejected">{getTranslation("rejected")}</TabsTrigger>
            </TabsList>

            {["pending", "approved", "rejected"].map((tab) => (
              <TabsContent key={tab} value={tab} className="space-y-4">
                {isLoading ? (
                  <div className="text-center py-10">Loading...</div>
                ) : submissions.length === 0 ? (
                  <div className="text-center py-10 text-muted-foreground">{getTranslation("no_submissions")}</div>
                ) : (
                  submissions.map((submission) => (
                    <Card key={submission.submittedAt}>
                      <CardHeader className="pb-2">
                        <div className="flex justify-between items-start">
                          <div>
                            <CardTitle>{submission.name}</CardTitle>
                            <CardDescription className="mt-1">
                              {submission.description.substring(0, 100)}
                              {submission.description.length > 100 ? "..." : ""}
                            </CardDescription>
                          </div>
                          <Badge>{submission.category}</Badge>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="flex flex-col space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">{getTranslation("submitted_by")}:</span>
                            <span>{submission.submitterName}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">{getTranslation("submitted_on")}:</span>
                            <span>{new Date(submission.submittedAt).toLocaleDateString()}</span>
                          </div>
                        </div>

                        <div className="flex justify-end space-x-2 mt-4">
                          <Button variant="outline" size="sm" onClick={() => handleViewDetails(submission)}>
                            <Eye className="mr-2 h-4 w-4" />
                            {getTranslation("view_details")}
                          </Button>

                          {activeTab === "pending" && (
                            <>
                              <Button variant="default" size="sm" onClick={() => handleApprove(submission)}>
                                <CheckCircle className="mr-2 h-4 w-4" />
                                {getTranslation("approve")}
                              </Button>
                              <Button variant="destructive" size="sm" onClick={() => handleReject(submission)}>
                                <XCircle className="mr-2 h-4 w-4" />
                                {getTranslation("reject")}
                              </Button>
                            </>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  ))
                )}
              </TabsContent>
            ))}
          </Tabs>
        </CardContent>
      </Card>

      {/* Review Dialog */}
      <Dialog open={showReviewDialog} onOpenChange={setShowReviewDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {reviewAction === "approve" ? getTranslation("confirm_approve") : getTranslation("confirm_reject")}
            </DialogTitle>
            <DialogDescription>{selectedSubmission?.name}</DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div>
              <label className="text-sm font-medium">{getTranslation("review_notes")}</label>
              <Textarea
                value={reviewNotes}
                onChange={(e) => setReviewNotes(e.target.value)}
                placeholder="Add any notes about this review decision..."
                className="mt-1"
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowReviewDialog(false)}>
              {getTranslation("cancel")}
            </Button>
            <Button variant={reviewAction === "approve" ? "default" : "destructive"} onClick={handleConfirmReview}>
              {getTranslation("confirm")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

