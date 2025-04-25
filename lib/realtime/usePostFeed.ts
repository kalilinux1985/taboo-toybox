// lib/realtime/usePostFeed.ts
'use client'

import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase-browser"

export interface Post {
  id: string
  user_id: string
  content: string
  media_url?: string
  created_at: string
}

export const usePostFeed = () => {
  const [posts, setPosts] = useState<Post[]>([])
  const supabase = createClient()

  useEffect(() => {
    const fetchInitialPosts = async () => {
      const { data } = await supabase
        .from("posts")
        .select("*")
        .order("created_at", { ascending: false })

      if (data) setPosts(data)
    }

    fetchInitialPosts()

    const channel = supabase
      .channel("realtime:posts")
      .on("postgres_changes", { event: "INSERT", schema: "public", table: "posts" }, (payload) => {
        setPosts((prev) => [payload.new as Post, ...prev])
      })
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [])

  return posts
}
