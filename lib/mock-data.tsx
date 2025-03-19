import type React from "react"
import {
  MessageSquare,
  LineChart,
  Bot,
  Sparkles,
  Palette,
  Film,
  Headphones,
  PenTool,
  Terminal,
  BookOpen,
  BarChart,
  Search,
} from "lucide-react"

// 创建一个函数来生成带有背景色的图标容器
const IconWrapper = ({ children, color }: { children: React.ReactNode; color: string }) => (
  <div className={`h-full w-full flex items-center justify-center rounded-md ${color}`}>{children}</div>
)

export const mockTools = [
  {
    id: "1",
    name: "ChatGPT",
    description:
      "OpenAI's GPT-4 based conversational AI assistant. Helps with writing, answering questions, and creative tasks.",
    category: "Chatbots",
    url: "https://chat.openai.com",
    icon: (
      <IconWrapper color="bg-green-100">
        <Bot className="h-6 w-6 text-green-600" />
      </IconWrapper>
    ),
    logoUrl: "/placeholder.svg?height=40&width=40",
  },
  {
    id: "2",
    name: "DALL-E 3",
    description: "Create realistic images and art from natural language descriptions. Developed by OpenAI.",
    category: "Image Generation",
    url: "https://openai.com/dall-e-3",
    icon: (
      <IconWrapper color="bg-purple-100">
        <Sparkles className="h-6 w-6 text-purple-600" />
      </IconWrapper>
    ),
    logoUrl: "/placeholder.svg?height=40&width=40",
  },
  {
    id: "3",
    name: "Midjourney",
    description: "AI image generation tool that creates stunning artwork from text descriptions.",
    category: "Image Generation",
    url: "https://www.midjourney.com",
    icon: (
      <IconWrapper color="bg-indigo-100">
        <Palette className="h-6 w-6 text-indigo-600" />
      </IconWrapper>
    ),
    logoUrl: "/placeholder.svg?height=40&width=40",
  },
  {
    id: "4",
    name: "Runway",
    description: "Create, edit and extend videos with AI. Transform your ideas into videos.",
    category: "Video",
    url: "https://runwayml.com",
    icon: (
      <IconWrapper color="bg-red-100">
        <Film className="h-6 w-6 text-red-600" />
      </IconWrapper>
    ),
    logoUrl: "/placeholder.svg?height=40&width=40",
  },
  {
    id: "5",
    name: "Mubert",
    description: "AI-generated royalty-free music for content creators, businesses, and developers.",
    category: "Audio",
    url: "https://mubert.com",
    icon: (
      <IconWrapper color="bg-blue-100">
        <Headphones className="h-6 w-6 text-blue-600" />
      </IconWrapper>
    ),
    logoUrl: "/placeholder.svg?height=40&width=40",
  },
  {
    id: "6",
    name: "Notion AI",
    description: "AI writing assistant integrated with Notion. Helps with drafting, editing, and summarizing content.",
    category: "Productivity",
    url: "https://notion.so",
    icon: (
      <IconWrapper color="bg-gray-100">
        <PenTool className="h-6 w-6 text-gray-600" />
      </IconWrapper>
    ),
    logoUrl: "/placeholder.svg?height=40&width=40",
  },
  {
    id: "7",
    name: "GitHub Copilot",
    description: "AI pair programmer that helps you write code faster with less work.",
    category: "Development",
    url: "https://github.com/features/copilot",
    icon: (
      <IconWrapper color="bg-yellow-100">
        <Terminal className="h-6 w-6 text-yellow-600" />
      </IconWrapper>
    ),
    logoUrl: "/placeholder.svg?height=40&width=40",
  },
  {
    id: "8",
    name: "Duolingo Max",
    description: "AI-powered language learning with advanced features like conversation practice.",
    category: "Education",
    url: "https://duolingo.com",
    icon: (
      <IconWrapper color="bg-green-100">
        <BookOpen className="h-6 w-6 text-green-600" />
      </IconWrapper>
    ),
    logoUrl: "/placeholder.svg?height=40&width=40",
  },
  {
    id: "9",
    name: "Copy.ai",
    description: "AI-powered copywriting tool for marketing content, emails, and social media.",
    category: "Marketing",
    url: "https://copy.ai",
    icon: (
      <IconWrapper color="bg-orange-100">
        <BarChart className="h-6 w-6 text-orange-600" />
      </IconWrapper>
    ),
    logoUrl: "/placeholder.svg?height=40&width=40",
  },
  {
    id: "10",
    name: "Claude",
    description: "Anthropic's AI assistant designed to be helpful, harmless, and honest.",
    category: "Chatbots",
    url: "https://claude.ai",
    icon: (
      <IconWrapper color="bg-violet-100">
        <MessageSquare className="h-6 w-6 text-violet-600" />
      </IconWrapper>
    ),
    logoUrl: "/placeholder.svg?height=40&width=40",
  },
  {
    id: "11",
    name: "Jasper",
    description: "AI content platform for marketing teams to create content that drives business results.",
    category: "Marketing",
    url: "https://jasper.ai",
    icon: (
      <IconWrapper color="bg-pink-100">
        <LineChart className="h-6 w-6 text-pink-600" />
      </IconWrapper>
    ),
    logoUrl: "/placeholder.svg?height=40&width=40",
  },
  {
    id: "12",
    name: "Perplexity AI",
    description: "AI search engine that provides answers with cited sources.",
    category: "Productivity",
    url: "https://perplexity.ai",
    icon: (
      <IconWrapper color="bg-teal-100">
        <Search className="h-6 w-6 text-teal-600" />
      </IconWrapper>
    ),
    logoUrl: "/placeholder.svg?height=40&width=40",
  },
]

