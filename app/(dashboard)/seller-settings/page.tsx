'use client';

import { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth/AuthProvider';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { createClient } from '@/lib/supabase-browser';
import { TopNav } from '@/app/components/layout/TopNav';
import { SidebarNav } from '@/app/components/layout/SidebarNav';
import { BottomNavMobile } from '@/app/components/layout/BottomNavMobile';
import { FloatingChatButton } from '@/app/components/layout/FloatingChatButton';

export default function SellerSettingsPage() {
  const { session, user } = useAuth();
  const router = useRouter();
  const supabase = createClient();

  const [username, setUsername] = useState('');
  const [bio, setBio] = useState('');
  const [country, setCountry] = useState('');
  const [age, setAge] = useState('');
  const [gender, setGender] = useState('');
  const [ethnicity, setEthnicity] = useState('');
  const [bodySize, setBodySize] = useState('');
  const [shoeSize, setShoeSize] = useState('');
  const [willShowFace, setWillShowFace] = useState(false);
  const [occupation, setOccupation] = useState('');
  const [whatIOffer, setWhatIOffer] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isPrivate, setIsPrivate] = useState(false);

  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!session || user?.user_metadata?.role !== 'SELLER') {
      router.push('/signin');
    }
  }, [session, user, router]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setAvatarFile(file);
      setAvatarPreview(URL.createObjectURL(file));
    }
  };

  const handleDeleteAccount = async () => {
    const confirmed = confirm(
      'Are you sure you want to permanently delete your account?'
    );
    if (!confirmed) return;

    await supabase.auth.signOut();
    await supabase.functions.invoke('delete-user-data');
  };

  const handleUpdateSettings = async () => {
    let avatarUrl = avatarPreview;
    if (avatarFile) {
      const filePath = `avatars/${Date.now()}-${avatarFile.name}`;
      const { error } = await supabase.storage
        .from('avatars')
        .upload(filePath, avatarFile);
      if (!error) {
        const { data: publicUrl } = supabase.storage
          .from('avatars')
          .getPublicUrl(filePath);
        avatarUrl = publicUrl.publicUrl;
      }
    }

    const userId = user?.id;
    await supabase
      .from('users')
      .update({
        username,
        avatar_url: avatarUrl,
        bio,
        country,
        age,
        gender,
        ethnicity,
        body_size: bodySize,
        shoe_size: shoeSize,
        will_show_face: willShowFace,
        occupation,
        what_i_offer: whatIOffer,
        private: isPrivate,
      })
      .eq('id', userId);
  };

  if (!session || user?.user_metadata?.role !== 'SELLER') return null;

  return (
    <div className='min-h-screen bg-gradient-to-t from-purple-900 to-black bg-fixed text-white'>
      <TopNav />

      <main className='max-w-7xl mx-auto flex pt-6 px-4 pb-20'>
        <SidebarNav />
        <div className='max-w-2xl mx-auto py-12 px-4 text-white'>
          <h2 className='text-3xl font-bold mb-8'>Edit Your Seller Profile</h2>

          <div className='space-y-6 mb-10'>
            <Label>Username</Label>
            <Input
              className='bg-gray-800 text-white border-gray-700'
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />

            <Label>Profile Image</Label>
            <div className='flex items-center gap-4'>
              {avatarPreview && (
                <img
                  src={avatarPreview}
                  alt='Preview'
                  className='h-16 w-16 rounded-full object-cover'
                />
              )}
              <Input
                type='file'
                ref={fileRef}
                accept='image/*'
                onChange={handleImageChange}
                className='bg-gray-800 border-gray-700 text-white'
              />
            </div>

            <Label>Bio</Label>
            <Textarea
              className='bg-gray-800 text-white border-gray-700'
              value={bio}
              onChange={(e) => setBio(e.target.value)}
            />

            <Label>Country</Label>
            <select
              className='bg-gray-800 text-white border border-gray-700 w-full rounded-md p-2'
              value={country}
              onChange={(e) => setCountry(e.target.value)}>
              <option value=''>Select Country</option>
              <option value='USA'>USA</option>
              <option value='UK'>UK</option>
              <option value='CA'>Canada</option>
            </select>

            <Label>Age</Label>
            <select
              className='bg-gray-800 text-white border border-gray-700 w-full rounded-md p-2'
              value={age}
              onChange={(e) => setAge(e.target.value)}>
              <option value=''>Select Age</option>
              {Array.from({ length: 83 }, (_, i) => (
                <option
                  key={i}
                  value={i + 18}>
                  {i + 18}
                </option>
              ))}
            </select>

            <Label>Gender</Label>
            <select
              className='bg-gray-800 text-white border border-gray-700 w-full rounded-md p-2'
              value={gender}
              onChange={(e) => setGender(e.target.value)}>
              <option value=''>Select Gender</option>
              <option value='female'>Female</option>
              <option value='male'>Male</option>
              <option value='nonbinary'>Non-Binary</option>
              <option value='other'>Other</option>
            </select>

            <Label>Ethnicity</Label>
            <Input
              className='bg-gray-800 text-white border-gray-700'
              value={ethnicity}
              onChange={(e) => setEthnicity(e.target.value)}
            />

            <Label>Body Size</Label>
            <Input
              className='bg-gray-800 text-white border-gray-700'
              value={bodySize}
              onChange={(e) => setBodySize(e.target.value)}
            />

            <Label>Shoe Size</Label>
            <Input
              className='bg-gray-800 text-white border-gray-700'
              value={shoeSize}
              onChange={(e) => setShoeSize(e.target.value)}
            />

            <div className='flex items-center gap-4'>
              <Label>Will Show Face</Label>
              <Switch
                checked={willShowFace}
                onCheckedChange={setWillShowFace}
              />
            </div>

            <Label>Occupation</Label>
            <Input
              className='bg-gray-800 text-white border-gray-700'
              value={occupation}
              onChange={(e) => setOccupation(e.target.value)}
            />

            <Label>What I Offer</Label>
            <Textarea
              className='bg-gray-800 text-white border-gray-700'
              value={whatIOffer}
              onChange={(e) => setWhatIOffer(e.target.value)}
            />

            <Label>Email</Label>
            <Input
              type='email'
              className='bg-gray-800 text-white border-gray-700'
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            <Label>Password</Label>
            <Input
              type='password'
              className='bg-gray-800 text-white border-gray-700'
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            <div className='flex items-center gap-4'>
              <Label>Set Profile to Private</Label>
              <Switch
                checked={isPrivate}
                onCheckedChange={setIsPrivate}
              />
            </div>
          </div>

          <Button
            onClick={handleUpdateSettings}
            className='w-full mb-8 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700'>
            Update Settings
          </Button>

          <div className='border border-red-500 rounded-lg p-6 bg-gray-900/50'>
            <h3 className='text-lg font-semibold text-red-400 mb-2'>
              Delete Your Account
            </h3>
            <p className='text-sm text-gray-300 mb-4'>
              Permanently deleting your account will remove all your data on
              Taboo Toybox. However, we will still hold data privately to assist
              with any disputes should they be reported.
            </p>
            <Button
              variant='destructive'
              className='bg-red-600 hover:bg-red-700'
              onClick={handleDeleteAccount}>
              DELETE ACCOUNT
            </Button>
          </div>
        </div>
      </main>

      <BottomNavMobile />
      <FloatingChatButton />
    </div>
  );
}
