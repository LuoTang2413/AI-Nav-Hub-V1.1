"use client"

import type React from "react"

import { useState } from "react"
import { Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useLanguage } from "@/components/language-provider"

export default function SearchBar() {
  const [query, setQuery] = useState("")
  const { t } = useLanguage()

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    // Handle search logic
    console.log("Searching for:", query)
  }

  return (
    <form onSubmit={handleSearch} className="relative flex w-full max-w-3xl mx-auto">
      <Input
        type="text"
        placeholder={t("search_placeholder")}
        className="pr-10 rounded-full h-12"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />
      <Button type="submit" size="icon" variant="ghost" className="absolute right-0 top-0 h-12 w-12 rounded-full">
        <Search className="h-5 w-5" />
        <span className="sr-only">{t("search")}</span>
      </Button>
    </form>
  )
}

