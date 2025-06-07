'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/Authcontexts/AuthContext'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { useRouter } from 'next/navigation'
import { 
  LayoutDashboard, 
  ListFilter, 
  MessageSquare, 
  Settings, 
  User as UserIcon,
  Image as ImageIcon,
  Video,
  Heart,
  MessageCircle,
  Share2,
  LogOut
} from 'lucide-react'
import { createClient } from '@/lib/supabase/client'

interface UserProfile {
  id: string
  username: string
  name: string
  bio?: string
  occupation?: string
  avatar_url?: string
  followers_count?: number
  following_count?: number
  badges_count?: number
}

export default function ActivityFeedPage() {
  const { user, userRole, loading, signOut } = useAuth()
  const router = useRouter()
  const [postContent, setPostContent] = useState('')
  const [commentContent, setCommentContent] = useState('')
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null)
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null)
  const [profileLoading, setProfileLoading] = useState(true)
  
  const supabase = createClient()

  useEffect(() => {
    async function fetchUserProfile() {
      if (!user?.id) return

      try {
        // Fetch user profile data from public.users table
        const { data: profileData, error: profileError } = await supabase
          .from('users')
          .select('*')
          .eq('id', user.id)
          .single()

        if (profileError) {
          console.error('Error fetching user profile:', profileError)
          return
        }

        if (profileData) {
          setUserProfile({
            id: profileData.id,
            username: profileData.username || 'User',
            name: profileData.name || profileData.username || 'User',
            bio: profileData.bio || 'No bio available',
            occupation: profileData.occupation || 'Seller',
            avatar_url: profileData.avatar_url,
            followers_count: profileData.followers_count || 0,
            following_count: profileData.following_count || 0,
            badges_count: profileData.badges?.length || 0
          })

          // If avatar_url exists in the profile, handle different formats
          if (profileData.avatar_url) {
            // Check if it's already a full URL
            if (profileData.avatar_url.startsWith('http')) {
              setAvatarUrl(profileData.avatar_url)
              console.log('Using direct avatar URL:', profileData.avatar_url)
            } else {
              // Otherwise treat it as a path in the avatars bucket
              try {
                const { data: avatarData } = await supabase
                  .storage
                  .from('avatars')
                  .getPublicUrl(profileData.avatar_url)
                
                console.log('Generated avatar URL:', avatarData.publicUrl)
                setAvatarUrl(avatarData.publicUrl)
              } catch (storageError) {
                console.error('Error getting avatar URL:', storageError)
              }
            }
          } else {
            console.log('No avatar_url found in profile data')
          }
        }
      } catch (error) {
        console.error('Error in profile fetch:', error)
      } finally {
        setProfileLoading(false)
      }
    }

    fetchUserProfile()
  }, [user?.id])

  // Redirect non-sellers or handle loading state
  if (loading || profileLoading) {
    return <div className="flex min-h-screen items-center justify-center">Loading...</div>
  }
  
  if (!user || userRole !== 'SELLER') {
    // Redirect non-sellers
    router.push('/login')
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p>This page is only available to sellers. Redirecting to login...</p>
      </div>
    )
  }

  const handlePost = async () => {
    if (!postContent.trim() || !user) return

    try {
      // Insert post into posts table
      const { error } = await supabase
        .from('posts')
        .insert({
          user_id: user.id,
          content: postContent,
          created_at: new Date().toISOString()
        })

      if (error) throw error
      
      // Clear post content on success
      setPostContent('')
      
      // You could add logic here to refresh the feed
    } catch (error) {
      console.error('Error creating post:', error)
    }
  }

  const handleComment = async () => {
    if (!commentContent.trim() || !user) return

    try {
      // Insert comment into comments table
      const { error } = await supabase
        .from('comments')
        .insert({
          user_id: user.id,
          post_id: '1', // This would be the actual post ID in a real implementation
          content: commentContent,
          created_at: new Date().toISOString()
        })

      if (error) throw error
      
      // Clear comment content on success
      setCommentContent('')
      
    } catch (error) {
      console.error('Error creating comment:', error)
    }
  }

  const handleSignOut = async () => {
    await signOut()
    router.push('/login')
  }

  return (
    <div className="activity-main flex max-h-full">
      {/* Left Sidebar - Profile and Navigation */}
      <div className="seller-sidebar w-64 bg-slate-900 border border-violet-600/30 p-4 max-h-full">
        <div className="relative mb-6">
          <div className="h-24 w-full rounded-md bg-gradient-to-r from-violet-600 to-indigo-600"></div>
          <div className="absolute -bottom-10 left-4">
            <div className="h-20 w-20 rounded-sm overflow-hidden">
              {avatarUrl ? (
                <img 
                  src={avatarUrl} 
                  alt="Profile" 
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="h-full w-full flex items-center justify-center bg-violet-700 text-white text-xl">
                  {userProfile?.username?.charAt(0).toUpperCase() || user?.email?.charAt(0).toUpperCase() || 'U'}
                </div>
              )}
            </div>
          </div>
        </div>
        
        <div className="mt-12 mb-6">
          <h2 className="text-xl font-semibold text-white">{userProfile?.username || 'Loading...'}</h2>
          <p className="text-sm text-violet-400">{userProfile?.occupation || 'Seller'}</p>
          
          <div className="mt-4 text-sm text-gray-300">
            <p>{userProfile?.bio || 'No bio available'}</p>
          </div>
        </div>
        
        <div className="mt-6 flex justify-between text-center">
          <div>
            <p className="font-semibold text-white">{userProfile?.badges_count || 0}</p>
            <p className="text-xs text-violet-400">Badges</p>
          </div>
          <div>
            <p className="font-semibold text-white">{userProfile?.followers_count || 0}</p>
            <p className="text-xs text-violet-400">Followers</p>
          </div>
          <div>
            <p className="font-semibold text-white">{userProfile?.following_count || 0}</p>
            <p className="text-xs text-violet-400">Following</p>
          </div>
        </div>
        
        <nav className="mt-8 space-y-2">
          <Button variant="ghost" className="w-full justify-start text-slate-200 hover:bg-slate-950/35 hover:text-slate-200">
            <LayoutDashboard className="mr-2 h-5 w-5" />
            Dashboard
          </Button>
          <Button variant="ghost" className="w-full justify-start text-slate-200 hover:bg-slate-950/35 hover:text-slate-200">
            <ListFilter className="mr-2 h-5 w-5" />
            Listings
          </Button>
          <Button variant="ghost" className="w-full justify-start text-slate-200 hover:bg-slate-950/35 hover:text-slate-200">
            <MessageSquare className="mr-2 h-5 w-5" />
            Messages
          </Button>
          <Button variant="ghost" className="w-full justify-start text-slate-200 hover:bg-slate-950/35 hover:text-slate-200">
            <Settings className="mr-2 h-5 w-5" />
            Settings
          </Button>
          <Button variant="ghost" className="w-full justify-start text-slate-200 hover:bg-slate-950/35 hover:text-slate-200">
            <UserIcon className="mr-2 h-5 w-5" />
            Profile
          </Button>
          <Button 
            variant="ghost" 
            className="w-full justify-start text-red-400 hover:text-red-300 hover:bg-[#1a1a1a] mt-8"
            onClick={handleSignOut}
          >
            <LogOut className="mr-2 h-5 w-5" />
            Logout
          </Button>
        </nav>
      </div>
      
      {/* Main Content - Feed */}
      <div className="flex-1 overflow-auto p-4">
        {/* Post Creation */}
        <Card className="mb-6 bg-slate-900 border-violet-600/50">
          <div className="p-4">
            <div className="flex items-center gap-3 mb-3">
              <div className="h-10 w-10 rounded-full overflow-hidden">
                {avatarUrl ? (
                  <img 
                    src={avatarUrl} 
                    alt="Profile" 
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="h-full w-full flex items-center justify-center bg-violet-700 text-white">
                    {userProfile?.username?.charAt(0).toUpperCase() || user?.email?.charAt(0).toUpperCase() || 'U'}
                  </div>
                )}
              </div>
              <Input 
                placeholder="Share your thoughts..." 
                className="bg-slate-950 border-violet-600/50 text-white focus:border-violet-500" 
                value={postContent}
                onChange={(e) => setPostContent(e.target.value)}
              />
            </div>
            <div className="flex justify-between items-center">
              <div className="flex gap-2">
                <Button variant="ghost" size="sm" className="text-slate-200 bg-slate-950 hover:bg-slate-950/35 hover:text-slate-200">
                  <ImageIcon className="h-5 w-5 mr-1" /> Photo
                </Button>
                <Button variant="ghost" size="sm" className="text-slate-200 bg-slate-950 hover:bg-slate-950/35 hover:text-slate-200">
                  <Video className="h-5 w-5 mr-1" /> Video
                </Button>
              </div>
              <Button 
                onClick={handlePost} 
                disabled={!postContent.trim()}
                className="bg-violet-600 hover:bg-violet-700 text-white"
              >
                Post
              </Button>
            </div>
          </div>
        </Card>
        
        {/* Feed Posts */}
        <Card className="mb-6 bg-slate-900 border-violet-600/50">
          <div className="mx-5">
            <div className="flex items-center gap-3 mb-3">
              <div className="h-10 w-10 rounded-full overflow-hidden">
                {avatarUrl ? (
                  <img 
                    src={avatarUrl} 
                    alt="Profile" 
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="h-full w-full flex items-center justify-center bg-violet-700 text-white">
                    {userProfile?.username?.charAt(0).toUpperCase() || 'U'}
                  </div>
                )}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-white">{userProfile?.username || 'Username'}</span>
                  <Badge variant="outline" className="text-xs bg-transparent border-violet-500 text-violet-400">Premium Seller</Badge>
                  <span className="text-xs text-gray-400">· 2h</span>
                </div>
              </div>
            </div>
            
            <p className="text-gray-200 mb-4">This is a sample post content. Your actual posts will appear here.</p>
            
            <div className="rounded-lg overflow-hidden mb-3">
              <img 
                src="https://images.unsplash.com/photo-1506744038136-46273834b3fb" 
                alt="Post image" 
                className="w-full h-auto object-cover"
              />
            </div>
            
            <div className="flex justify-between text-gray-400 pt-2 border-t border-[#2a2a2a]">
              <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white">
                <Heart className="h-4 w-4 mr-1" /> Liked (0)
              </Button>
              <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white">
                <MessageCircle className="h-4 w-4 mr-1" /> Comments (0)
              </Button>
              <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white">
                <Share2 className="h-4 w-4 mr-1" /> Share (0)
              </Button>
            </div>
            
            {/* Comment section */}
            <div className="mt-4 pt-3 border-t border-[#2a2a2a]">
              <div className="flex items-center gap-2">
                <div className="h-8 w-8 rounded-full bg-gray-300 overflow-hidden flex-shrink-0">
                  {avatarUrl ? (
                    <img 
                      src={avatarUrl} 
                      alt="Profile" 
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="h-full w-full flex items-center justify-center bg-violet-700 text-white text-sm">
                      {userProfile?.username?.charAt(0).toUpperCase() || 'U'}
                    </div>
                  )}
                </div>
                <div className="flex-1 flex items-center gap-2">
                  <Input 
                    placeholder="Leave a comment..." 
                    className="bg-[#1a1a1a] border-[#2a2a2a] text-white focus:border-violet-500 h-9" 
                    value={commentContent}
                    onChange={(e) => setCommentContent(e.target.value)}
                  />
                  <Button 
                    onClick={handleComment} 
                    disabled={!commentContent.trim()}
                    size="sm"
                    className="bg-violet-600 hover:bg-violet-700 text-white h-9"
                  >
                    Comment
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </Card>
      </div>
      
      {/* Right Sidebar - Top Sellers */}
      <div className="w-64 border border-violet-600/50 bg-slate-900 p-4 mt-4 rounded-sm">
        <h2 className="font-semibold text-lg text-white mb-4">TOP SELLERS</h2>
        
        <div className="space-y-4">
          {/* We would map through top sellers here */}
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full overflow-hidden">
                <img 
                  src={`https://via.placeholder.com/40?text=S${i}`} 
                  alt={`Seller ${i}`} 
                  className="h-full w-full object-cover"
                />
              </div>
              <div>
                <p className="font-medium text-white">Top Seller {i}</p>
                <p className="text-xs text-violet-400">$1,{i}00+ sales</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}