"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { 
  SiAdobephotoshop, 
  SiAdobeillustrator, 
  SiAdobepremierepro, 
  SiAdobelightroom,
  SiFigma,
  SiSketch,
  SiBlender,
  SiUnity,
  SiUnrealengine,
  SiVisualstudiocode as SiVscode,
  SiIntellijidea,
  SiPycharm,
  SiWebstorm,
  SiAndroidstudio,
  SiXcode,
  SiMysql,
  SiPostgresql,
  SiMongodb,
  SiRedis,
  SiDocker,
  SiKubernetes,
  SiAmazon as SiAws,
  SiGooglecloud,
  SiMicrosoftoffice as SiAzure,
  SiSteam,
  SiEpicgames,
  SiOrigin,
  SiBattledotnet as SiBattleNet,
  SiDiscord,
  SiSlack,
  SiZoom,
  SiMicrosoftoffice as SiTeams,
  SiNotion,
  SiTrello,
  SiJira,
  SiConfluence,
  SiWordpress,
  SiShopify,
  SiWoocommerce as SiWoo,
  SiMagento,
  SiOpencart as SiOpencartIcon,
  SiPrestashop
} from "react-icons/si"
import { 
  FaLaptop,
  FaDesktop,
  FaGamepad,
  FaCode,
  FaPalette,
  FaVideo,
  FaDatabase,
  FaCloud,
  FaGamepad as FaGamepadIcon
} from "react-icons/fa"
import { Laptop } from "@/types/productTypes"

interface Software {
  id: string
  name: string
  icon: React.ComponentType<{ className?: string }>
  category: string
  requirements: {
    ram: number
    storage: number
    gpu: string
    cpu: string
  }
}

const softwareList: Software[] = [
  // Design & Creative
  { id: "photoshop", name: "Adobe Photoshop", icon: SiAdobephotoshop, category: "Design", requirements: { ram: 16, storage: 512, gpu: "dedicated", cpu: "modern" } },
  { id: "illustrator", name: "Adobe Illustrator", icon: SiAdobeillustrator, category: "Design", requirements: { ram: 16, storage: 512, gpu: "dedicated", cpu: "modern" } },
  { id: "premiere", name: "Adobe Premiere Pro", icon: SiAdobepremierepro, category: "Video", requirements: { ram: 32, storage: 1000, gpu: "dedicated", cpu: "high-end" } },
  { id: "lightroom", name: "Adobe Lightroom", icon: SiAdobelightroom, category: "Photo", requirements: { ram: 16, storage: 512, gpu: "dedicated", cpu: "modern" } },
  { id: "figma", name: "Figma", icon: SiFigma, category: "Design", requirements: { ram: 8, storage: 256, gpu: "integrated", cpu: "modern" } },
  { id: "sketch", name: "Sketch", icon: SiSketch, category: "Design", requirements: { ram: 8, storage: 256, gpu: "integrated", cpu: "modern" } },
  { id: "blender", name: "Blender", icon: SiBlender, category: "3D", requirements: { ram: 32, storage: 1000, gpu: "dedicated", cpu: "high-end" } },

  // Development
  { id: "vscode", name: "Visual Studio Code", icon: SiVisualstudiocode, category: "Development", requirements: { ram: 8, storage: 256, gpu: "integrated", cpu: "modern" } },
  { id: "intellij", name: "IntelliJ IDEA", icon: SiIntellijidea, category: "Development", requirements: { ram: 16, storage: 512, gpu: "integrated", cpu: "modern" } },
  { id: "pycharm", name: "PyCharm", icon: SiPycharm, category: "Development", requirements: { ram: 16, storage: 512, gpu: "integrated", cpu: "modern" } },
  { id: "webstorm", name: "WebStorm", icon: SiWebstorm, category: "Development", requirements: { ram: 16, storage: 512, gpu: "integrated", cpu: "modern" } },
  { id: "androidstudio", name: "Android Studio", icon: SiAndroidstudio, category: "Development", requirements: { ram: 16, storage: 512, gpu: "integrated", cpu: "modern" } },
  { id: "xcode", name: "Xcode", icon: SiXcode, category: "Development", requirements: { ram: 16, storage: 512, gpu: "integrated", cpu: "modern" } },

  // Database & Cloud
  { id: "mysql", name: "MySQL", icon: SiMysql, category: "Database", requirements: { ram: 8, storage: 256, gpu: "integrated", cpu: "modern" } },
  { id: "postgresql", name: "PostgreSQL", icon: SiPostgresql, category: "Database", requirements: { ram: 8, storage: 256, gpu: "integrated", cpu: "modern" } },
  { id: "mongodb", name: "MongoDB", icon: SiMongodb, category: "Database", requirements: { ram: 8, storage: 256, gpu: "integrated", cpu: "modern" } },
  { id: "redis", name: "Redis", icon: SiRedis, category: "Database", requirements: { ram: 8, storage: 256, gpu: "integrated", cpu: "modern" } },
  { id: "docker", name: "Docker", icon: SiDocker, category: "DevOps", requirements: { ram: 8, storage: 256, gpu: "integrated", cpu: "modern" } },
  { id: "kubernetes", name: "Kubernetes", icon: SiKubernetes, category: "DevOps", requirements: { ram: 16, storage: 512, gpu: "integrated", cpu: "modern" } },
  { id: "aws", name: "AWS", icon: SiAws, category: "Cloud", requirements: { ram: 8, storage: 256, gpu: "integrated", cpu: "modern" } },
  { id: "gcp", name: "Google Cloud", icon: SiGooglecloud, category: "Cloud", requirements: { ram: 8, storage: 256, gpu: "integrated", cpu: "modern" } },
  { id: "azure", name: "Microsoft Azure", icon: SiMicrosoftazure, category: "Cloud", requirements: { ram: 8, storage: 256, gpu: "integrated", cpu: "modern" } },

  // Gaming
  { id: "steam", name: "Steam", icon: SiSteam, category: "Gaming", requirements: { ram: 16, storage: 1000, gpu: "dedicated", cpu: "modern" } },
  { id: "epic", name: "Epic Games", icon: SiEpicgames, category: "Gaming", requirements: { ram: 16, storage: 1000, gpu: "dedicated", cpu: "modern" } },
  { id: "origin", name: "Origin", icon: SiOrigin, category: "Gaming", requirements: { ram: 16, storage: 1000, gpu: "dedicated", cpu: "modern" } },
  { id: "battlenet", name: "Battle.net", icon: SiBattleNet, category: "Gaming", requirements: { ram: 16, storage: 1000, gpu: "dedicated", cpu: "modern" } },

  // Communication & Productivity
  { id: "discord", name: "Discord", icon: SiDiscord, category: "Communication", requirements: { ram: 4, storage: 128, gpu: "integrated", cpu: "basic" } },
  { id: "slack", name: "Slack", icon: SiSlack, category: "Communication", requirements: { ram: 4, storage: 128, gpu: "integrated", cpu: "basic" } },
  { id: "zoom", name: "Zoom", icon: SiZoom, category: "Communication", requirements: { ram: 4, storage: 128, gpu: "integrated", cpu: "basic" } },
  { id: "teams", name: "Microsoft Teams", icon: SiTeams, category: "Communication", requirements: { ram: 4, storage: 128, gpu: "integrated", cpu: "basic" } },
  { id: "notion", name: "Notion", icon: SiNotion, category: "Productivity", requirements: { ram: 4, storage: 128, gpu: "integrated", cpu: "basic" } },
  { id: "trello", name: "Trello", icon: SiTrello, category: "Productivity", requirements: { ram: 4, storage: 128, gpu: "integrated", cpu: "basic" } },
  { id: "jira", name: "Jira", icon: SiJira, category: "Productivity", requirements: { ram: 8, storage: 256, gpu: "integrated", cpu: "modern" } },
  { id: "confluence", name: "Confluence", icon: SiConfluence, category: "Productivity", requirements: { ram: 8, storage: 256, gpu: "integrated", cpu: "modern" } },

  // E-commerce
  { id: "wordpress", name: "WordPress", icon: SiWordpress, category: "E-commerce", requirements: { ram: 8, storage: 256, gpu: "integrated", cpu: "modern" } },
  { id: "shopify", name: "Shopify", icon: SiShopify, category: "E-commerce", requirements: { ram: 8, storage: 256, gpu: "integrated", cpu: "modern" } },
  { id: "woo", name: "WooCommerce", icon: SiWoo, category: "E-commerce", requirements: { ram: 8, storage: 256, gpu: "integrated", cpu: "modern" } },
  { id: "magento", name: "Magento", icon: SiMagento, category: "E-commerce", requirements: { ram: 16, storage: 512, gpu: "integrated", cpu: "modern" } },
  { id: "opencart", name: "OpenCart", icon: SiOpencartIcon, category: "E-commerce", requirements: { ram: 8, storage: 256, gpu: "integrated", cpu: "modern" } },
  { id: "prestashop", name: "PrestaShop", icon: SiPrestashop, category: "E-commerce", requirements: { ram: 8, storage: 256, gpu: "integrated", cpu: "modern" } },
]

const categories = [
  { id: "design", name: "Design & Creative", icon: FaPalette },
  { id: "development", name: "Development", icon: FaCode },
  { id: "video", name: "Video Editing", icon: FaVideo },
  { id: "database", name: "Database", icon: FaDatabase },
  { id: "cloud", name: "Cloud & DevOps", icon: FaCloud },
  { id: "gaming", name: "Gaming", icon: FaGamepad },
  { id: "communication", name: "Communication", icon: FaDesktop },
  { id: "productivity", name: "Productivity", icon: FaLaptop },
  { id: "ecommerce", name: "E-commerce", icon: FaDesktop },
]

export default function FinderPage() {
  const [selectedSoftware, setSelectedSoftware] = useState<string[]>([])
  const [selectedCategory, setSelectedCategory] = useState<string>("all")
  const [recommendations, setRecommendations] = useState<Laptop[]>([])
  const [isLoading, setIsLoading] = useState(false)

  const toggleSoftware = (softwareId: string) => {
    setSelectedSoftware(prev => 
      prev.includes(softwareId) 
        ? prev.filter(id => id !== softwareId)
        : [...prev, softwareId]
    )
  }

  const getFilteredSoftware = () => {
    if (selectedCategory === "all") {
      return softwareList
    }
    return softwareList.filter(software => software.category.toLowerCase() === selectedCategory)
  }

  const getRequirements = () => {
    if (selectedSoftware.length === 0) return null

    const selectedSoftwareData = softwareList.filter(sw => selectedSoftware.includes(sw.id))
    
    const maxRam = Math.max(...selectedSoftwareData.map(sw => sw.requirements.ram))
    const maxStorage = Math.max(...selectedSoftwareData.map(sw => sw.requirements.storage))
    const needsDedicatedGPU = selectedSoftwareData.some(sw => sw.requirements.gpu === "dedicated")
    const needsHighEndCPU = selectedSoftwareData.some(sw => sw.requirements.cpu === "high-end")

    return {
      ram: maxRam,
      storage: maxStorage,
      gpu: needsDedicatedGPU ? "dedicated" : "integrated",
      cpu: needsHighEndCPU ? "high-end" : "modern"
    }
  }

  const generateRecommendations = async () => {
    if (selectedSoftware.length === 0) return

    setIsLoading(true)
    
    try {
      const requirements = getRequirements()
      if (!requirements) return

      // In a real app, you would make an API call here
      // For now, we'll simulate the recommendation logic
      const response = await fetch('/api/finder/recommendations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          software: selectedSoftware,
          requirements
        })
      })

      if (response.ok) {
        const data = await response.json()
        setRecommendations(data.recommendations)
      }
    } catch (error) {
      console.error('Error generating recommendations:', error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold mb-4">Лаптоп Хайгч</h1>
        <p className="text-xl text-muted-foreground">
          Таны ашигладаг программ хангамжууд дээр үндэслэн хамгийн тохирсон лаптопуудыг санал болгоё
        </p>
      </div>

      {/* Category Filter */}
      <div className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Ангилал сонгох</h2>
        <div className="flex flex-wrap gap-2">
          <Button
            variant={selectedCategory === "all" ? "default" : "outline"}
            onClick={() => setSelectedCategory("all")}
            className="flex items-center gap-2"
          >
            <FaLaptop className="h-4 w-4" />
            Бүгд
          </Button>
          {categories.map((category) => (
            <Button
              key={category.id}
              variant={selectedCategory === category.id ? "default" : "outline"}
              onClick={() => setSelectedCategory(category.id)}
              className="flex items-center gap-2"
            >
              <category.icon className="h-4 w-4" />
              {category.name}
            </Button>
          ))}
        </div>
      </div>

      {/* Software Selection */}
      <div className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Программ хангамж сонгох</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
          {getFilteredSoftware().map((software) => (
            <Card
              key={software.id}
              className={`cursor-pointer transition-all hover:shadow-lg ${
                selectedSoftware.includes(software.id)
                  ? "ring-2 ring-primary bg-primary/5"
                  : ""
              }`}
              onClick={() => toggleSoftware(software.id)}
            >
              <CardContent className="p-4 text-center">
                <software.icon className="h-8 w-8 mx-auto mb-2" />
                <p className="text-sm font-medium">{software.name}</p>
                <Badge variant="secondary" className="mt-2 text-xs">
                  {software.category}
                </Badge>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Selected Software */}
      {selectedSoftware.length > 0 && (
        <div className="mb-8">
          <h3 className="text-xl font-semibold mb-4">Сонгосон программ хангамжууд</h3>
          <div className="flex flex-wrap gap-2">
            {selectedSoftware.map((softwareId) => {
              const software = softwareList.find(sw => sw.id === softwareId)
              if (!software) return null
              return (
                <Badge key={softwareId} variant="default" className="flex items-center gap-2">
                  <software.icon className="h-4 w-4" />
                  {software.name}
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      toggleSoftware(softwareId)
                    }}
                    className="ml-2 hover:bg-destructive/20 rounded-full p-1"
                  >
                    ×
                  </button>
                </Badge>
              )
            })}
          </div>
        </div>
      )}

      {/* Requirements Summary */}
      {selectedSoftware.length > 0 && (
        <div className="mb-8">
          <Card>
            <CardHeader>
              <CardTitle>Хэрэгцээний дүн</CardTitle>
              <CardDescription>
                Сонгосон программ хангамжуудын шаардлага
              </CardDescription>
            </CardHeader>
            <CardContent>
              {(() => {
                const requirements = getRequirements()
                if (!requirements) return null
                return (
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="text-center">
                      <p className="text-2xl font-bold text-primary">{requirements.ram}GB</p>
                      <p className="text-sm text-muted-foreground">RAM</p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-bold text-primary">{requirements.storage}GB</p>
                      <p className="text-sm text-muted-foreground">Хадгалах зай</p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-bold text-primary">
                        {requirements.gpu === "dedicated" ? "Тусдаа" : "Нэгдсэн"}
                      </p>
                      <p className="text-sm text-muted-foreground">График карт</p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-bold text-primary">
                        {requirements.cpu === "high-end" ? "Өндөр" : "Орчин үе"}
                      </p>
                      <p className="text-sm text-muted-foreground">Процессор</p>
                    </div>
                  </div>
                )
              })()}
            </CardContent>
          </Card>
        </div>
      )}

      {/* Generate Recommendations Button */}
      {selectedSoftware.length > 0 && (
        <div className="text-center mb-8">
          <Button
            size="lg"
            onClick={generateRecommendations}
            disabled={isLoading}
            className="px-8 py-4 text-lg"
          >
            {isLoading ? "Хайж байна..." : "Миний лаптопыг сонго"}
          </Button>
        </div>
      )}

      {/* Recommendations */}
      {recommendations.length > 0 && (
        <div className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Санал болгох лаптопууд</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {recommendations.map((laptop) => (
              <Card key={laptop.id} className="overflow-hidden">
                {laptop.images.length > 0 && (
                  <div className="aspect-video relative overflow-hidden">
                    <img
                      src={laptop.images[0].url}
                      alt={laptop.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
                <CardHeader>
                  <CardTitle className="line-clamp-2">{laptop.title}</CardTitle>
                  <CardDescription className="line-clamp-3">
                    {laptop.description}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-2xl font-bold text-primary">
                        {laptop.price.toLocaleString()}₮
                      </p>
                      {laptop.originalPrice > laptop.price && (
                        <p className="text-sm text-muted-foreground line-through">
                          {laptop.originalPrice.toLocaleString()}₮
                        </p>
                      )}
                    </div>
                    <Button>Дэлгэрэнгүй</Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Empty State */}
      {selectedSoftware.length === 0 && (
        <div className="text-center py-12">
          <FaLaptop className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
          <h3 className="text-xl font-semibold mb-2">Программ хангамж сонгоно уу</h3>
          <p className="text-muted-foreground">
            Таны ашигладаг программ хангамжуудыг сонгоод, хамгийн тохирсон лаптопуудыг олъё
          </p>
        </div>
      )}
    </div>
  )
}