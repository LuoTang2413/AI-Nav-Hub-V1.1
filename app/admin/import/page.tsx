"use client"

import type React from "react"

import { useState, useRef } from "react"
import { useRouter } from "next/navigation"
import { Upload, FileUp, Download, CheckCircle, AlertCircle, Shield, Table, FileText, Info } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Progress } from "@/components/ui/progress"
import { useToast } from "@/hooks/use-toast"
import { useLanguage } from "@/components/language-provider"
import { useAuth } from "@/lib/auth"
import { importTools } from "@/lib/actions"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"

// Define the template structure
const CSV_TEMPLATE = `name,description,category,url,logoUrl,tags
"ChatGPT","OpenAI's GPT-4 based conversational AI assistant.","Chatbots","https://chat.openai.com","https://example.com/logo.png","ai,chatbot,nlp"
"DALL-E 3","Create realistic images and art from natural language descriptions.","Image Generation","https://openai.com/dall-e-3","https://example.com/dalle.png","ai,image,art"`

const JSON_TEMPLATE = `[
  {
    "name": "ChatGPT",
    "description": "OpenAI's GPT-4 based conversational AI assistant.",
    "category": "Chatbots",
    "url": "https://chat.openai.com",
    "logoUrl": "https://example.com/logo.png",
    "tags": "ai,chatbot,nlp"
  },
  {
    "name": "DALL-E 3",
    "description": "Create realistic images and art from natural language descriptions.",
    "category": "Image Generation",
    "url": "https://openai.com/dall-e-3",
    "logoUrl": "https://example.com/dalle.png",
    "tags": "ai,image,art"
  }
]`

export default function ImportPage() {
  const { isAuthenticated, isAdmin } = useAuth()
  const router = useRouter()
  const { toast } = useToast()
  const { t } = useLanguage()
  const [activeTab, setActiveTab] = useState<"csv" | "json">("csv")
  const [isImporting, setIsImporting] = useState(false)
  const [importProgress, setImportProgress] = useState(0)
  const [importResults, setImportResults] = useState<{
    total: number
    success: number
    failed: number
    errors: string[]
  } | null>(null)
  const [jsonData, setJsonData] = useState("")
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Handle file upload
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Check file type
    if (activeTab === "csv" && !file.name.endsWith(".csv")) {
      toast({
        title: t("invalid_file_type") || "Invalid file type",
        description: t("please_upload_csv") || "Please upload a CSV file",
        variant: "destructive",
      })
      return
    }

    if (activeTab === "json" && !file.name.endsWith(".json")) {
      toast({
        title: t("invalid_file_type") || "Invalid file type",
        description: t("please_upload_json") || "Please upload a JSON file",
        variant: "destructive",
      })
      return
    }

    // Read file
    const reader = new FileReader()
    reader.onload = async (event) => {
      const content = event.target?.result as string

      if (activeTab === "json") {
        setJsonData(content)
      } else {
        // For CSV, we'll process it directly
        await processImport(content)
      }
    }

    if (activeTab === "csv") {
      reader.readAsText(file)
    } else {
      reader.readAsText(file)
    }
  }

  // Process the import
  const processImport = async (data: string) => {
    setIsImporting(true)
    setImportProgress(0)
    setImportResults(null)

    try {
      // Simulate progress
      const progressInterval = setInterval(() => {
        setImportProgress((prev) => {
          if (prev >= 90) {
            clearInterval(progressInterval)
            return 90
          }
          return prev + 10
        })
      }, 300)

      // In a real app, you would call an API to process the import
      // For demo purposes, we'll simulate the import process
      const result = await importTools(data, activeTab)

      clearInterval(progressInterval)
      setImportProgress(100)

      setImportResults({
        total: result.total,
        success: result.success,
        failed: result.failed,
        errors: result.errors,
      })

      toast({
        title: t("import_complete") || "Import complete",
        description: `${result.success} ${t("tools_imported")} ${result.failed > 0 ? `(${result.failed} ${t("failed")})` : ""}`,
        variant: result.failed > 0 ? "destructive" : "default",
      })
    } catch (error) {
      toast({
        title: t("import_failed") || "Import failed",
        description: error instanceof Error ? error.message : "Unknown error",
        variant: "destructive",
      })
    } finally {
      setIsImporting(false)
    }
  }

  // Handle JSON import
  const handleJsonImport = async () => {
    if (!jsonData.trim()) {
      toast({
        title: t("no_data") || "No data",
        description: t("please_enter_json_data") || "Please enter JSON data to import",
        variant: "destructive",
      })
      return
    }

    await processImport(jsonData)
  }

  // Download template
  const downloadTemplate = () => {
    const template = activeTab === "csv" ? CSV_TEMPLATE : JSON_TEMPLATE
    const blob = new Blob([template], { type: activeTab === "csv" ? "text/csv" : "application/json" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = activeTab === "csv" ? "ai-tools-template.csv" : "ai-tools-template.json"
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  // If not admin, show unauthorized message
  if (!isAuthenticated || !isAdmin) {
    return (
      <div className="container py-20 text-center">
        <Shield className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
        <h1 className="text-2xl font-bold mb-2">{t("unauthorized") || "Unauthorized"}</h1>
        <p className="text-muted-foreground mb-6">
          {t("admin_only") || "This page is only accessible to administrators."}
        </p>
        <Button onClick={() => router.push("/")}>{t("back_home") || "Back to Home"}</Button>
      </div>
    )
  }

  return (
    <div className="container py-10">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{t("bulk_import") || "Bulk Import"}</h1>
          <p className="text-muted-foreground mt-1">
            {t("bulk_import_description") || "Import multiple AI tools at once using CSV or JSON format."}
          </p>
        </div>
        <Button variant="outline" onClick={() => router.push("/admin/submissions")}>
          {t("back_to_submissions") || "Back to Submissions"}
        </Button>
      </div>

      <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as "csv" | "json")}>
        <TabsList className="mb-6">
          <TabsTrigger value="csv" className="flex items-center gap-2">
            <Table className="h-4 w-4" />
            CSV
          </TabsTrigger>
          <TabsTrigger value="json" className="flex items-center gap-2">
            <FileText className="h-4 w-4" />
            JSON
          </TabsTrigger>
        </TabsList>

        <Card>
          <CardHeader>
            <CardTitle>{t("import_tools") || "Import AI Tools"}</CardTitle>
            <CardDescription>
              {activeTab === "csv"
                ? t("import_csv_description") || "Upload a CSV file with AI tools data."
                : t("import_json_description") || "Upload or paste JSON data with AI tools information."}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Alert className="mb-6">
              <Info className="h-4 w-4" />
              <AlertTitle>{t("template_format") || "Template Format"}</AlertTitle>
              <AlertDescription>
                {t("download_template_description") ||
                  "Download the template to see the required format for importing AI tools."}
                <Button variant="link" className="p-0 h-auto text-primary" onClick={downloadTemplate}>
                  {t("download_template") || "Download Template"}
                </Button>
              </AlertDescription>
            </Alert>

            <TabsContent value="csv" className="mt-0">
              <div className="space-y-4">
                <div className="grid w-full max-w-sm items-center gap-1.5">
                  <Label htmlFor="csv-file">{t("csv_file") || "CSV File"}</Label>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      onClick={() => fileInputRef.current?.click()}
                      disabled={isImporting}
                      className="w-full"
                    >
                      <FileUp className="mr-2 h-4 w-4" />
                      {t("choose_file") || "Choose File"}
                    </Button>
                    <input
                      ref={fileInputRef}
                      type="file"
                      id="csv-file"
                      accept=".csv"
                      className="hidden"
                      onChange={handleFileUpload}
                      disabled={isImporting}
                    />
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="json" className="mt-0">
              <div className="space-y-4">
                <div className="grid w-full items-center gap-1.5">
                  <Label htmlFor="json-data">{t("json_data") || "JSON Data"}</Label>
                  <Textarea
                    id="json-data"
                    placeholder={t("paste_json_here") || "Paste JSON data here..."}
                    value={jsonData}
                    onChange={(e) => setJsonData(e.target.value)}
                    className="min-h-[200px] font-mono text-sm"
                    disabled={isImporting}
                  />
                </div>
                <div className="flex justify-between items-center">
                  <Button variant="outline" onClick={() => fileInputRef.current?.click()} disabled={isImporting}>
                    <FileUp className="mr-2 h-4 w-4" />
                    {t("upload_json_file") || "Upload JSON File"}
                  </Button>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".json"
                    className="hidden"
                    onChange={handleFileUpload}
                    disabled={isImporting}
                  />
                  <Button onClick={handleJsonImport} disabled={isImporting || !jsonData.trim()}>
                    <Upload className="mr-2 h-4 w-4" />
                    {t("import_json") || "Import JSON"}
                  </Button>
                </div>
              </div>
            </TabsContent>

            {isImporting && (
              <div className="mt-6 space-y-2">
                <div className="flex justify-between text-sm">
                  <span>{t("importing") || "Importing..."}</span>
                  <span>{importProgress}%</span>
                </div>
                <Progress value={importProgress} className="h-2" />
              </div>
            )}

            {importResults && (
              <div className="mt-6 space-y-4">
                <Separator />
                <div className="space-y-2">
                  <h3 className="text-lg font-medium">{t("import_results") || "Import Results"}</h3>
                  <div className="flex gap-4">
                    <div className="flex items-center gap-2">
                      <Badge variant="outline">{importResults.total}</Badge>
                      <span className="text-sm">{t("total") || "Total"}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge
                        variant="outline"
                        className="bg-green-50 text-green-700 hover:bg-green-100 hover:text-green-800"
                      >
                        {importResults.success}
                      </Badge>
                      <span className="text-sm">{t("successful") || "Successful"}</span>
                    </div>
                    {importResults.failed > 0 && (
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="bg-red-50 text-red-700 hover:bg-red-100 hover:text-red-800">
                          {importResults.failed}
                        </Badge>
                        <span className="text-sm">{t("failed") || "Failed"}</span>
                      </div>
                    )}
                  </div>
                </div>

                {importResults.errors.length > 0 && (
                  <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertTitle>{t("import_errors") || "Import Errors"}</AlertTitle>
                    <AlertDescription>
                      <ul className="list-disc pl-5 mt-2 space-y-1">
                        {importResults.errors.map((error, index) => (
                          <li key={index} className="text-sm">
                            {error}
                          </li>
                        ))}
                      </ul>
                    </AlertDescription>
                  </Alert>
                )}

                {importResults.success > 0 && (
                  <Alert className="bg-green-50 text-green-700 border-green-200">
                    <CheckCircle className="h-4 w-4" />
                    <AlertTitle>{t("success") || "Success"}</AlertTitle>
                    <AlertDescription>
                      {importResults.success} {t("tools_imported_successfully") || "tools were imported successfully."}
                    </AlertDescription>
                  </Alert>
                )}
              </div>
            )}
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="outline" onClick={downloadTemplate}>
              <Download className="mr-2 h-4 w-4" />
              {t("download_template") || "Download Template"}
            </Button>
            {activeTab === "csv" && (
              <Button onClick={() => fileInputRef.current?.click()} disabled={isImporting}>
                <Upload className="mr-2 h-4 w-4" />
                {t("import_csv") || "Import CSV"}
              </Button>
            )}
          </CardFooter>
        </Card>
      </Tabs>
    </div>
  )
}

