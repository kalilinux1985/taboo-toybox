'use client'

import { CreatePostCard } from "./CreatePostCard"
import { PostCard } from "./PostCard"
import { usePostFeed } from "@/lib/realtime/usePostFeed"
import { TopNav } from "../components/layout/TopNav"
import { SidebarNav } from "../components/layout/SidebarNav"
import { BottomNavMobile } from "../components/layout/BottomNavMobile"
import { FloatingChatButton } from "../components/layout/FloatingChatButton"

export default function FeedPage() {
  const posts = usePostFeed()

  return (
    <div className="min-h-screen bg-gradient-to-t from-purple-900 to-black text-white">
      <TopNav />

      <main className="max-w-7xl mx-auto flex pt-6 px-4 pb-20">
        <SidebarNav />

        <div className="flex-1 space-y-4">
          <CreatePostCard />

          {posts.map((post) => (
            <PostCard
              key={post.id}
              userName="Unknown User"
              userAvatar="https://readdy.ai/api/search-image?seq=avatar1&orientation=squarish"
              timePosted={new Date(post.created_at).toLocaleString()}
              content={post.content}
              mediaUrl={post.media_url ?? undefined}
              shopButton
            />
          ))}
        </div>
      </main>

      <BottomNavMobile />
      <FloatingChatButton />
    </div>
  )
}
