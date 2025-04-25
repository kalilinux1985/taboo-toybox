// app/components/feed/TabsContainer.tsx
'use client'

import { ReactNode, useState } from "react"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"


interface TabsContainerProps {
  feed: ReactNode
  marketplace: ReactNode
  messages: ReactNode
}

export const TabsContainer = ({ feed, marketplace, messages }: TabsContainerProps) => {
  const [activeTab, setActiveTab] = useState("feed")

  return (
    <Tabs value={activeTab} onValueChange={setActiveTab}>
      {/* Tab Switcher */}
      <TabsList className="bg-gray-900/60 mb-6">
        <TabsTrigger value="feed" className="data-[state=active]:bg-purple-900/50">
          Feed
        </TabsTrigger>
        <TabsTrigger value="marketplace" className="data-[state=active]:bg-purple-900/50">
          Marketplace
        </TabsTrigger>
        <TabsTrigger value="messages" className="data-[state=active]:bg-purple-900/50">
          Messages
        </TabsTrigger>
      </TabsList>

      {/* Tab Content */}
      <TabsContent value="feed" className="space-y-6">{feed}</TabsContent>
      <TabsContent value="marketplace" className="space-y-6">{marketplace}</TabsContent>
      <TabsContent value="messages" className="space-y-6">{messages}</TabsContent>
    </Tabs>
  )
}

