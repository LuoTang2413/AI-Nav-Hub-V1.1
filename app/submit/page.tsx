"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { ArrowLeft, Upload } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"
import { useLanguage } from "@/components/language-provider"
import { useAuth } from "@/lib/auth"
import { submitAITool } from "@/lib/actions"

const submitSchema = z.object({
  name: z.string().min(2, {
    message: "Name must be at least 2 characters.",
  }),
  description: z.string().min(10, {
    message: "Description must be at least 10 characters.",
  }),
  url: z.string().url({
    message: "Please enter a valid URL.",
  }),
  category: z.string({
    required_error: "Please select a category.",
  }),
  logoUrl: z
    .string()
    .url({
      message: "Please enter a valid logo URL.",
    })
    .optional(),
  tags: z.string().optional(),
  contactEmail: z.string().email({
    message: "Please enter a valid email address.",
  }),
})

type SubmitFormValues = z.infer<typeof submitSchema>

export default function SubmitPage() {
  const { t, language } = useLanguage()
  const { isAuthenticated, user } = useAuth()
  const router = useRouter()
  const { toast } = useToast()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [previewLogo, setPreviewLogo] = useState<string | null>(null)

  // Add translations for the submit page
  const translations = {
    submit_tool: {
      en: "Submit AI Tool",
      zh: "提交AI工具",
      es: "Enviar Herramienta de IA",
      fr: "Soumettre un Outil d'IA",
      ja: "AIツールを提出",
      de: "KI-Tool einreichen",
    },
    submit_description: {
      en: "Submit a new AI tool for review. Our team will review your submission and add it to the directory if approved.",
      zh: "提交新的AI工具进行审核。我们的团队将审核您的提交，如果批准，将其添加到目录中。",
      es: "Envíe una nueva herramienta de IA para su revisión. Nuestro equipo revisará su envío y lo agregará al directorio si es aprobado.",
      fr: "Soumettez un nouvel outil d'IA pour examen. Notre équipe examinera votre soumission et l'ajoutera au répertoire si elle est approuvée.",
      ja: "新しいAIツールを審査のために提出してください。私たちのチームがあなたの提出物を確認し、承認された場合はディレクトリに追加します。",
      de: "Reichen Sie ein neues KI-Tool zur Überprüfung ein. Unser Team wird Ihre Einreichung prüfen und bei Genehmigung zum Verzeichnis hinzufügen.",
    },
    tool_name: {
      en: "Tool Name",
      zh: "工具名称",
      es: "Nombre de la Herramienta",
      fr: "Nom de l'Outil",
      ja: "ツール名",
      de: "Tool-Name",
    },
    tool_description: {
      en: "Description",
      zh: "描述",
      es: "Descripción",
      fr: "Description",
      ja: "説明",
      de: "Beschreibung",
    },
    tool_url: {
      en: "Website URL",
      zh: "网站链接",
      es: "URL del Sitio Web",
      fr: "URL du Site Web",
      ja: "ウェブサイトURL",
      de: "Website-URL",
    },
    tool_category: {
      en: "Category",
      zh: "分类",
      es: "Categoría",
      fr: "Catégorie",
      ja: "カテゴリー",
      de: "Kategorie",
    },
    tool_logo: {
      en: "Logo URL (optional)",
      zh: "Logo链接（可选）",
      es: "URL del Logo (opcional)",
      fr: "URL du Logo (optionnel)",
      ja: "ロゴURL（任意）",
      de: "Logo-URL (optional)",
    },
    tool_tags: {
      en: "Tags (comma separated, optional)",
      zh: "标签（逗号分隔，可选）",
      es: "Etiquetas (separadas por comas, opcional)",
      fr: "Tags (séparés par des virgules, optionnel)",
      ja: "タグ（カンマ区切り、任意）",
      de: "Tags (durch Kommas getrennt, optional)",
    },
    contact_email: {
      en: "Contact Email",
      zh: "联系邮箱",
      es: "Correo Electrónico de Contacto",
      fr: "Email de Contact",
      ja: "連絡先メール",
      de: "Kontakt-E-Mail",
    },
    submit_button: {
      en: "Submit for Review",
      zh: "提交审核",
      es: "Enviar para Revisión",
      fr: "Soumettre pour Examen",
      ja: "審査のために提出",
      de: "Zur Überprüfung einreichen",
    },
    cancel: {
      en: "Cancel",
      zh: "取消",
      es: "Cancelar",
      fr: "Annuler",
      ja: "キャンセル",
      de: "Abbrechen",
    },
    login_required: {
      en: "You need to be logged in to submit a tool",
      zh: "您需要登录才能提交工具",
      es: "Debe iniciar sesión para enviar una herramienta",
      fr: "Vous devez être connecté pour soumettre un outil",
      ja: "ツールを提出するにはログインが必要です",
      de: "Sie müssen angemeldet sein, um ein Tool einzureichen",
    },
    submission_success: {
      en: "Your AI tool has been submitted for review",
      zh: "您的AI工具已提交审核",
      es: "Su herramienta de IA ha sido enviada para revisión",
      fr: "Votre outil d'IA a été soumis pour examen",
      ja: "あなたのAIツールは審査のために提出されました",
      de: "Ihr KI-Tool wurde zur Überprüfung eingereicht",
    },
    submission_error: {
      en: "There was an error submitting your tool",
      zh: "提交工具时出错",
      es: "Hubo un error al enviar su herramienta",
      fr: "Une erreur s'est produite lors de la soumission de votre outil",
      ja: "ツールの提出中にエラーが発生しました",
      de: "Beim Einreichen Ihres Tools ist ein Fehler aufgetreten",
    },
    preview_logo: {
      en: "Preview Logo",
      zh: "预览Logo",
      es: "Vista Previa del Logo",
      fr: "Aperçu du Logo",
      ja: "ロゴのプレビュー",
      de: "Logo-Vorschau",
    },
  }

  // Helper function to get translation
  const getTranslation = (key: keyof typeof translations) => {
    const lang = language as keyof (typeof translations)[typeof key]
    return translations[key][lang] || translations[key].en
  }

  const form = useForm<SubmitFormValues>({
    resolver: zodResolver(submitSchema),
    defaultValues: {
      name: "",
      description: "",
      url: "",
      category: "",
      logoUrl: "",
      tags: "",
      contactEmail: user?.email || "",
    },
  })

  // Watch for changes to the logoUrl field
  const logoUrl = form.watch("logoUrl")

  // Update the preview when logoUrl changes
  useEffect(() => {
    if (logoUrl && logoUrl.trim() !== "") {
      setPreviewLogo(logoUrl)
    } else {
      setPreviewLogo(null)
    }
  }, [logoUrl])

  const onSubmit = async (data: SubmitFormValues) => {
    if (!isAuthenticated) {
      toast({
        title: getTranslation("login_required"),
        variant: "destructive",
      })
      return
    }

    setIsSubmitting(true)
    try {
      await submitAITool({
        ...data,
        submittedBy: user?.id || "",
        submitterName: user?.name || "",
        status: "pending",
        submittedAt: new Date().toISOString(),
      })

      toast({
        title: getTranslation("submission_success"),
        description: data.name,
      })

      // Redirect to success page or home
      router.push("/submit/success")
    } catch (error) {
      console.error("Submission error:", error)
      toast({
        title: getTranslation("submission_error"),
        description: error instanceof Error ? error.message : "Unknown error",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const categories = [
    { value: "chatbots", label: t("chatbots") },
    { value: "image_generation", label: t("image_generation") },
    { value: "video", label: t("video") },
    { value: "audio", label: t("audio") },
    { value: "productivity", label: t("productivity") },
    { value: "development", label: t("development") },
    { value: "business", label: t("business") },
    { value: "education", label: t("education") },
    { value: "marketing", label: t("marketing") },
  ]

  return (
    <div className="container max-w-3xl py-10">
      <Button variant="ghost" className="mb-6" onClick={() => router.back()}>
        <ArrowLeft className="mr-2 h-4 w-4" />
        {getTranslation("cancel")}
      </Button>

      <Card>
        <CardHeader>
          <CardTitle>{getTranslation("submit_tool")}</CardTitle>
          <CardDescription>{getTranslation("submit_description")}</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{getTranslation("tool_name")}</FormLabel>
                    <FormControl>
                      <Input placeholder="ChatGPT" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{getTranslation("tool_description")}</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="A brief description of the AI tool and its capabilities..."
                        className="min-h-[120px]"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="url"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{getTranslation("tool_url")}</FormLabel>
                    <FormControl>
                      <Input placeholder="https://example.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="category"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{getTranslation("tool_category")}</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a category" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {categories.map((category) => (
                          <SelectItem key={category.value} value={category.value}>
                            {category.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="logoUrl"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{getTranslation("tool_logo")}</FormLabel>
                    <FormControl>
                      <div className="flex space-x-2">
                        <Input placeholder="https://example.com/logo.png" {...field} />
                        {previewLogo && (
                          <div className="flex-shrink-0 h-10 w-10 rounded-md overflow-hidden border">
                            <img
                              src={previewLogo || "/placeholder.svg"}
                              alt="Logo preview"
                              className="h-full w-full object-contain"
                              onError={() => setPreviewLogo(null)}
                            />
                          </div>
                        )}
                      </div>
                    </FormControl>
                    <FormDescription>URL to the tool's logo image (PNG or SVG preferred)</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="tags"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{getTranslation("tool_tags")}</FormLabel>
                    <FormControl>
                      <Input placeholder="ai, chatbot, productivity" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="contactEmail"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{getTranslation("contact_email")}</FormLabel>
                    <FormControl>
                      <Input placeholder="your@email.com" {...field} />
                    </FormControl>
                    <FormDescription>We'll contact you if we need more information</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button type="submit" className="w-full" disabled={isSubmitting || !isAuthenticated}>
                {isSubmitting ? (
                  <>
                    <Upload className="mr-2 h-4 w-4 animate-spin" />
                    {getTranslation("submit_button")}...
                  </>
                ) : (
                  getTranslation("submit_button")
                )}
              </Button>

              {!isAuthenticated && (
                <p className="text-center text-sm text-destructive mt-2">{getTranslation("login_required")}</p>
              )}
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  )
}

