"use client"

import Link from "next/link"
import { CheckCircle, Home, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { useLanguage } from "@/components/language-provider"

export default function SubmitSuccessPage() {
  const { language } = useLanguage()

  // Translations for success page
  const translations = {
    success_title: {
      en: "Submission Successful!",
      zh: "提交成功！",
      es: "¡Envío Exitoso!",
      fr: "Soumission Réussie !",
      ja: "提出成功！",
      de: "Einreichung Erfolgreich!",
    },
    success_description: {
      en: "Thank you for submitting your AI tool. Our team will review your submission and add it to the directory if approved.",
      zh: "感谢您提交AI工具。我们的团队将审核您的提交，如果批准，将其添加到目录中。",
      es: "Gracias por enviar su herramienta de IA. Nuestro equipo revisará su envío y lo agregará al directorio si es aprobado.",
      fr: "Merci d'avoir soumis votre outil d'IA. Notre équipe examinera votre soumission et l'ajoutera au répertoire si elle est approuvée.",
      ja: "AIツールを提出していただきありがとうございます。私たちのチームがあなたの提出物を確認し、承認された場合はディレクトリに追加します。",
      de: "Vielen Dank für die Einreichung Ihres KI-Tools. Unser Team wird Ihre Einreichung prüfen und bei Genehmigung zum Verzeichnis hinzufügen.",
    },
    review_process: {
      en: "The review process typically takes 1-3 business days. We'll notify you by email once the review is complete.",
      zh: "审核过程通常需要1-3个工作日。审核完成后，我们会通过电子邮件通知您。",
      es: "El proceso de revisión generalmente toma de 1 a 3 días hábiles. Le notificaremos por correo electrónico una vez que se complete la revisión.",
      fr: "Le processus d'examen prend généralement 1 à 3 jours ouvrables. Nous vous informerons par e-mail une fois l'examen terminé.",
      ja: "審査プロセスは通常1〜3営業日かかります。審査が完了次第、メールでお知らせします。",
      de: "Der Überprüfungsprozess dauert in der Regel 1-3 Werktage. Wir werden Sie per E-Mail benachrichtigen, sobald die Überprüfung abgeschlossen ist.",
    },
    back_home: {
      en: "Back to Home",
      zh: "返回首页",
      es: "Volver al Inicio",
      fr: "Retour à l'Accueil",
      ja: "ホームに戻る",
      de: "Zurück zur Startseite",
    },
    submit_another: {
      en: "Submit Another Tool",
      zh: "提交另一个工具",
      es: "Enviar Otra Herramienta",
      fr: "Soumettre un Autre Outil",
      ja: "別のツールを提出",
      de: "Ein weiteres Tool einreichen",
    },
  }

  // Helper function to get translation
  const getTranslation = (key: keyof typeof translations) => {
    const lang = language as keyof (typeof translations)[typeof key]
    return translations[key][lang] || translations[key].en
  }

  return (
    <div className="container max-w-md py-20">
      <Card className="text-center">
        <CardHeader>
          <div className="flex justify-center mb-4">
            <CheckCircle className="h-16 w-16 text-primary" />
          </div>
          <CardTitle className="text-2xl">{getTranslation("success_title")}</CardTitle>
          <CardDescription>{getTranslation("success_description")}</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">{getTranslation("review_process")}</p>
        </CardContent>
        <CardFooter className="flex flex-col space-y-2">
          <Button asChild className="w-full">
            <Link href="/">
              <Home className="mr-2 h-4 w-4" />
              {getTranslation("back_home")}
            </Link>
          </Button>
          <Button asChild variant="outline" className="w-full">
            <Link href="/submit">
              <Plus className="mr-2 h-4 w-4" />
              {getTranslation("submit_another")}
            </Link>
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}

