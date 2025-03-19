"use client"

import { useState } from "react"
import Hero from "@/components/hero"
import CategoryTabs from "@/components/category-tabs"
import ToolGrid from "@/components/tool-grid"
import SearchBar from "@/components/search-bar"
import { Skeleton } from "@/components/ui/skeleton"

export default function Home() {
  const [activeCategory, setActiveCategory] = useState("all")

  return (
    <div className="container mx-auto px-4 py-8">
      <Hero />
      <div className="my-8">
        <SearchBar />
      </div>
      <CategoryTabs activeCategory={activeCategory} setActiveCategory={setActiveCategory} />
      <ToolGridWithFallback activeCategory={activeCategory} />
    </div>
  )
}

function ToolGridWithFallback({ activeCategory }: { activeCategory: string }) {
  return (
    <div>
      <ToolGrid activeCategory={activeCategory} />
    </div>
  )
}

function ToolGridSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-8">
      {Array(12)
        .fill(0)
        .map((_, i) => (
          <div key={i} className="border rounded-lg p-4">
            <Skeleton className="h-12 w-12 rounded-lg mb-4" />
            <Skeleton className="h-6 w-3/4 mb-2" />
            <Skeleton className="h-4 w-full mb-1" />
            <Skeleton className="h-4 w-full mb-1" />
            <Skeleton className="h-4 w-2/3" />
          </div>
        ))}
    </div>
  )
}

