import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useState, useEffect, useRef } from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import TopNavbar from '@/components/TopNavbar';
import { Check, Upload } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Separator } from '@/components/ui/separator';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

const SellerSettings = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user) return;
    
    // Check file size (8MB limit)
    if (file.size > 8 * 1024 * 1024) {
      toast({
        title: 'File too large',
        description: 'Please upload an image smaller than 8MB.',
        variant: 'destructive',
      });
      return;
    }
    
    try {
      setLoading(true);
      
      // Upload image to Supabase Storage
      const fileExt = file.name.split('.').pop();
      const fileName = `${user.id}-${Math.random().toString(36).substring(2)}.${fileExt}`;
      const filePath = `avatars/${fileName}`;
      
      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, file);
        
      if (uploadError) throw uploadError;
      
      // Get public URL
      const { data: publicUrlData } = supabase.storage
        .from('avatars')
        .getPublicUrl(filePath);
        
      const avatarUrl = publicUrlData.publicUrl;
      
      // Update user profile with new avatar URL
      const { error: updateError } = await supabase
        .from('users')
        .update({ avatar_url: avatarUrl })
        .eq('id', user.id);
        
      if (updateError) throw updateError;
      
      // Update local state
      setProfileData(prev => ({
        ...prev,
        avatar_url: avatarUrl
      }));
      
      toast({
        title: 'Profile image updated',
        description: 'Your profile image has been updated successfully.'
      });
      
    } catch (error: any) {
      console.error('Error uploading image:', error);
      toast({
        title: 'Upload failed',
        description: error.message || 'An error occurred while uploading your image',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };
  
  const [profileData, setProfileData] = useState({
    username: 'Caliborn85',
    avatar_url: null,
    bio: '',
    country: 'US',
    age: '30',
    gender: 'F',
    ethnicity: 'C',
    body_size: 'C',
    shoe_size: '',
    show_face: '0',
    occupation: '',
    accepted_payments: [],
    niche: [],
    email: user?.email || '',
    password: '',
  });

  // Fetch user data on component mount
  useEffect(() => {
    const fetchUserData = async () => {
      if (!user) return;
      
      try {
        const { data, error } = await supabase
          .from('users')
          .select('*')
          .eq('id', user.id)
          .single();
          
        if (error) {
          console.error('Error fetching user data:', error);
          return;
        }
        
        if (data) {
          setProfileData(prev => ({
            ...prev,
            username: data.username || prev.username,
            avatar_url: data.avatar_url || prev.avatar_url,
            bio: data.bio || '',
            country: data.country || prev.country,
            age: data.age ? String(data.age) : prev.age,
            gender: data.gender || prev.gender,
            ethnicity: data.ethnicity || prev.ethnicity,
            body_size: data.body_size || prev.body_size,
            shoe_size: data.shoe_size || '',
            show_face: data.will_show_face ? '1' : '0',
            occupation: data.occupation || '',
            accepted_payments: data.accepted_payments_list ? JSON.parse(data.accepted_payments_list) : [],
            niche: data.what_i_offer ? JSON.parse(data.what_i_offer) : [],
            email: data.email || user.email || '',
          }));
        }
      } catch (error) {
        console.error('Error parsing user data:', error);
      }
    };
    
    fetchUserData();
  }, [user]);

  const handleChange = (field: string, value: string | string[]) => {
    setProfileData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      toast({
        title: 'Authentication error',
        description: 'You must be logged in to update your settings.',
        variant: 'destructive',
      });
      return;
    }
    
    setLoading(true);
    
    try {
      // Prepare data for Supabase update
      const userData = {
        username: profileData.username,
        bio: profileData.bio,
        country: profileData.country,
        age: parseInt(profileData.age),
        gender: profileData.gender,
        ethnicity: profileData.ethnicity,
        body_size: profileData.body_size,
        shoe_size: profileData.shoe_size,
        will_show_face: profileData.show_face === '1',
        occupation: profileData.occupation,
        accepted_payments: JSON.stringify(profileData.accepted_payments),
        what_i_offer: JSON.stringify(profileData.niche),
        updated_at: new Date().toISOString(),
      };
      
      // Update user data in Supabase
      const { error } = await supabase
        .from('users')
        .update(userData)
        .eq('id', user.id);
      
      if (error) throw error;
      
      // Handle password change if provided
      if (profileData.password && profileData.password.length >= 6) {
        const { error: passwordError } = await supabase.auth.updateUser({
          password: profileData.password,
        });
        
        if (passwordError) throw passwordError;
      }
      
      // Handle email change if it differs from current email
      if (profileData.email && profileData.email !== user.email) {
        const { error: emailError } = await supabase.auth.updateUser({
          email: profileData.email,
        });
        
        if (emailError) throw emailError;
        
        toast({
          title: 'Email verification required',
          description: 'Please check your inbox to verify your new email address.',
        });
      }
      
      toast({
        title: 'Settings updated successfully!',
        description: 'Your profile information has been saved.',
      });
      
      // Reset password field after successful update
      setProfileData(prev => ({ ...prev, password: '' }));
      
    } catch (error: any) {
      console.error('Error updating settings:', error);
      toast({
        title: 'Update failed',
        description: error.message || 'An error occurred while updating your settings',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  // Payment methods options
  const paymentOptions = [
    { value: '1', label: 'PayPal' },
    { value: '2', label: 'Venmo' },
    { value: '3', label: 'CashApp' },
    { value: '4', label: 'Amazon Gift Card' },
    { value: '10', label: 'Amazon WishList' },
    { value: '5', label: 'Bank Transfer' },
    { value: '6', label: 'Stripe' },
    { value: '7', label: 'Google Pay' },
    { value: '8', label: 'Cryptocurrency' },
    { value: '9', label: 'Buy Me A Coffee' },
    { value: '12', label: 'Wishlist' },
    { value: '13', label: 'Revolut' },
  ];

  // What I offer options
  const offerOptions = [
    { value: '5', label: 'Panties', group: 'Underwear' },
    { value: '6', label: 'Thongs', group: 'Underwear' },
    { value: '7', label: 'Lingerie', group: 'Underwear' },
    { value: '8', label: 'Bras', group: 'Underwear' },
    { value: '10', label: 'High Heels', group: 'Shoes' },
    { value: '11', label: 'Flat Shoes', group: 'Shoes' },
    { value: '12', label: 'Sneakers', group: 'Shoes' },
    { value: '13', label: 'Slippers', group: 'Shoes' },
    { value: '14', label: 'Uniform Shoes', group: 'Shoes' },
    { value: '22', label: 'Boots', group: 'Shoes' },
    { value: '16', label: 'Socks', group: 'Hosiery' },
    { value: '17', label: 'Pantyhose', group: 'Hosiery' },
    { value: '18', label: 'Stockings', group: 'Hosiery' },
    { value: '526', label: 'Buy Feet Pics', group: 'Hosiery' },
    { value: '527', label: 'Sell Feet Pics', group: 'Hosiery' },
    { value: '30', label: 'Skirts', group: 'Clothing' },
    { value: '31', label: 'Dresses', group: 'Clothing' },
    { value: '33', label: 'Tops', group: 'Clothing' },
    { value: '34', label: 'Gym Clothes', group: 'Clothing' },
    { value: '36', label: 'Other Clothing', group: 'Clothing' },
    { value: '43', label: 'Swimwear', group: 'Clothing' },
    { value: '4', label: 'Accessories', group: 'Naughty Extras' },
    { value: '24', label: 'Photo Sets', group: 'Naughty Extras' },
    { value: '25', label: 'Video Clips', group: 'Naughty Extras' },
    { value: '26', label: 'Experiences', group: 'Naughty Extras' },
    { value: '47', label: 'Dick Ratings', group: 'Naughty Extras' },
    { value: '48', label: 'Sex Toys', group: 'Naughty Extras' },
    { value: '49', label: 'Sexting', group: 'Naughty Extras' },
    {
      value: '50',
      label: 'Girlfriend Experience - GFE',
      group: 'Naughty Extras',
    },
    { value: '41', label: 'Instant Pics', group: 'Instant Content' },
    { value: '44', label: 'Instant Vids', group: 'Instant Content' },
  ];

  return (
    <div className='min-h-screen bg-slate-950'>
      <TopNavbar />
      <div className='container mt-28 py-8 max-w-4xl'>
        <div className='flex items-center justify-between mb-6'>
          <h1 className='text-3xl font-bold'>Seller Settings</h1>
          <Button
            onClick={() => navigate('/SellerProfile')}
            variant='outline'>
            View Profile
          </Button>
        </div>
        <Separator className='mb-6' />

        <form onSubmit={handleSubmit}>
          <Card className='mb-6'>
            <CardHeader>
              <CardTitle>Profile Information</CardTitle>
            </CardHeader>
            <CardContent className='space-y-4'>
              <div className='flex items-center space-x-4 mb-6'>
                <Avatar className='h-20 w-20'>
                  <AvatarImage
                    src={profileData.avatar_url || '/placeholder.svg'}
                    alt='Profile'
                  />
                  <AvatarFallback>{profileData.username?.substring(0, 2).toUpperCase() || 'SP'}</AvatarFallback>
                </Avatar>
                <div>
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    accept="image/*"
                    style={{ display: 'none' }}
                  />
                  <Button
                    variant='outline'
                    size='sm'
                    className='flex items-center'
                    onClick={handleUploadClick}
                    disabled={loading}
                  >
                    <Upload className='mr-2 h-4 w-4' />
                    {loading ? 'Uploading...' : 'Upload Image'}
                  </Button>
                  <p className='text-sm text-muted-foreground mt-1'>
                    Max size: 8MB. No nudity allowed.
                  </p>
                </div>
              </div>

              <div className='space-y-2'>
                <Label htmlFor='username'>Username</Label>
                <Input
                  id='username'
                  value={profileData.username}
                  onChange={(e) => handleChange('username', e.target.value)}
                />
                <p className='text-sm text-muted-foreground'>
                  This will be your alias on the platform and protect your
                  identity.
                </p>
              </div>

              <div className='space-y-2'>
                <Label htmlFor='bio'>Bio</Label>
                <Textarea
                  id='bio'
                  value={profileData.bio}
                  onChange={(e) => handleChange('bio', e.target.value)}
                  className='min-h-[120px]'
                />
                <p className='text-sm text-muted-foreground'>
                  Tell our community a little more about you!
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className='mb-6'>
            <CardHeader>
              <CardTitle>More About You</CardTitle>
            </CardHeader>
            <CardContent className='space-y-4'>
              <div className='space-y-2'>
                <Label htmlFor='country'>Country</Label>
                <Select 
                  value={profileData.country} 
                  onValueChange={(value) => handleChange('country', value)}
                >
                  <SelectTrigger className='w-full'>
                    <SelectValue placeholder='Select country' />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value='US'>United States</SelectItem>
                    <SelectItem value='CA'>Canada</SelectItem>
                    <SelectItem value='GB'>United Kingdom</SelectItem>
                    <SelectItem value='AU'>Australia</SelectItem>
                    <SelectItem value='DE'>Germany</SelectItem>
                    <SelectItem value='FR'>France</SelectItem>
                    <SelectItem value='ES'>Spain</SelectItem>
                    <SelectItem value='IT'>Italy</SelectItem>
                    <SelectItem value='JP'>Japan</SelectItem>
                    <SelectItem value='CN'>China</SelectItem>
                    <SelectItem value='IN'>India</SelectItem>
                    <SelectItem value='BR'>Brazil</SelectItem>
                    <SelectItem value='MX'>Mexico</SelectItem>
                    <SelectItem value='AR'>Argentina</SelectItem>
                    <SelectItem value='CO'>Colombia</SelectItem>
                    <SelectItem value='PT'>Portugal</SelectItem>
                    <SelectItem value='NL'>Netherlands</SelectItem>
                    <SelectItem value='BE'>Belgium</SelectItem>
                    <SelectItem value='SE'>Sweden</SelectItem>
                    <SelectItem value='NO'>Norway</SelectItem>
                    <SelectItem value='DK'>Denmark</SelectItem>
                    <SelectItem value='FI'>Finland</SelectItem>
                    <SelectItem value='IE'>Ireland</SelectItem>
                    <SelectItem value='NZ'>New Zealand</SelectItem>
                    <SelectItem value='SG'>Singapore</SelectItem>
                    <SelectItem value='HK'>Hong Kong</SelectItem>
                    <SelectItem value='AE'>United Arab Emirates</SelectItem>
                    <SelectItem value='SA'>Saudi Arabia</SelectItem>
                    <SelectItem value='ZA'>South Africa</SelectItem>
                    <SelectItem value='NG'>Nigeria</SelectItem>
                    <SelectItem value='KE'>Kenya</SelectItem>
                    <SelectItem value='GH'>Ghana</SelectItem>
                    <SelectItem value='EG'>Egypt</SelectItem>
                    <SelectItem value='MA'>Morocco</SelectItem>
                    <SelectItem value='IL'>Israel</SelectItem>
                    <SelectItem value='TR'>Turkey</SelectItem>
                    <SelectItem value='RU'>Russia</SelectItem>
                    <SelectItem value='UA'>Ukraine</SelectItem>
                    <SelectItem value='PL'>Poland</SelectItem>
                    <SelectItem value='RO'>Romania</SelectItem>
                    <SelectItem value='CZ'>Czech Republic</SelectItem>
                    <SelectItem value='HU'>Hungary</SelectItem>
                    <SelectItem value='GR'>Greece</SelectItem>
                    <SelectItem value='AT'>Austria</SelectItem>
                    <SelectItem value='CH'>Switzerland</SelectItem>
                    <SelectItem value='TH'>Thailand</SelectItem>
                    <SelectItem value='VN'>Vietnam</SelectItem>
                    <SelectItem value='ID'>Indonesia</SelectItem>
                    <SelectItem value='MY'>Malaysia</SelectItem>
                    <SelectItem value='PH'>Philippines</SelectItem>
                    <SelectItem value='KR'>South Korea</SelectItem>
                    <SelectItem value='TW'>Taiwan</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className='space-y-2'>
                <Label htmlFor='age'>Age</Label>
                <Select 
                  value={profileData.age} 
                  onValueChange={(value) => handleChange('age', value)}
                >
                  <SelectTrigger className='w-full'>
                    <SelectValue placeholder='Select age' />
                  </SelectTrigger>
                  <SelectContent>
                    {Array.from({ length: 82 }, (_, i) => i + 18).map((age) => (
                      <SelectItem key={age} value={age.toString()}>
                        {age}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className='space-y-2'>
                <Label htmlFor='gender'>Gender</Label>
                <Select 
                  value={profileData.gender} 
                  onValueChange={(value) => handleChange('gender', value)}
                >
                  <SelectTrigger className='w-full'>
                    <SelectValue placeholder='Select gender' />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value='F'>Female</SelectItem>
                    <SelectItem value='M'>Male</SelectItem>
                    <SelectItem value='O'>Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className='space-y-2'>
                <Label htmlFor='ethnicity'>Ethnicity</Label>
                <Select 
                  value={profileData.ethnicity} 
                  onValueChange={(value) => handleChange('ethnicity', value)}
                >
                  <SelectTrigger className='w-full'>
                    <SelectValue placeholder='Select ethnicity' />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value='C'>Caucasian</SelectItem>
                    <SelectItem value='B'>Black</SelectItem>
                    <SelectItem value='H'>Hispanic</SelectItem>
                    <SelectItem value='A'>Asian</SelectItem>
                    <SelectItem value='M'>Middle Eastern</SelectItem>
                    <SelectItem value='I'>Indian</SelectItem>
                    <SelectItem value='X'>Mixed</SelectItem>
                    <SelectItem value='O'>Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className='space-y-2'>
                <Label htmlFor='body_size'>Body Size</Label>
                <Select 
                  value={profileData.body_size} 
                  onValueChange={(value) => handleChange('body_size', value)}
                >
                  <SelectTrigger className='w-full'>
                    <SelectValue placeholder='Select body size' />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value='S'>Slim</SelectItem>
                    <SelectItem value='A'>Athletic</SelectItem>
                    <SelectItem value='C'>Curvy</SelectItem>
                    <SelectItem value='T'>Thick</SelectItem>
                    <SelectItem value='B'>BBW</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className='space-y-2'>
                <Label htmlFor='shoe_size'>Shoe Size</Label>
                <Select 
                  value={profileData.shoe_size} 
                  onValueChange={(value) => handleChange('shoe_size', value)}
                >
                  <SelectTrigger className='w-full'>
                    <SelectValue placeholder='Select shoe size' />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value='4'>US 4 / EU 35</SelectItem>
                    <SelectItem value='5'>US 5 / EU 36</SelectItem>
                    <SelectItem value='6'>US 6 / EU 37</SelectItem>
                    <SelectItem value='7'>US 7 / EU 38</SelectItem>
                    <SelectItem value='8'>US 8 / EU 39</SelectItem>
                    <SelectItem value='9'>US 9 / EU 40</SelectItem>
                    <SelectItem value='10'>US 10 / EU 41</SelectItem>
                    <SelectItem value='11'>US 11 / EU 42</SelectItem>
                    <SelectItem value='12'>US 12 / EU 43</SelectItem>
                    <SelectItem value='13'>US 13 / EU 44</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className='space-y-2'>
                <Label htmlFor='show_face'>Will Show Face</Label>
                <Select 
                  value={profileData.show_face} 
                  onValueChange={(value) => handleChange('show_face', value)}
                >
                  <SelectTrigger className='w-full'>
                    <SelectValue placeholder='Select option' />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value='1'>Yes</SelectItem>
                    <SelectItem value='0'>No</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className='space-y-2'>
                <Label htmlFor='occupation'>Occupation</Label>
                <Select 
                  value={profileData.occupation} 
                  onValueChange={(value) => handleChange('occupation', value)}
                >
                  <SelectTrigger className='w-full'>
                    <SelectValue placeholder='Select occupation' />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value='C'>Cabin Crew</SelectItem>
                    <SelectItem value='N'>Nurse / Healthcare Worker</SelectItem>
                    <SelectItem value='M'>Model</SelectItem>
                    <SelectItem value='F'>Fitness Pro</SelectItem>
                    <SelectItem value='E'>Entrepreneur</SelectItem>
                    <SelectItem value='T'>Teacher</SelectItem>
                    <SelectItem value='P'>Stay At Home Parent</SelectItem>
                    <SelectItem value='A'>Military / Police</SelectItem>
                    <SelectItem value='S'>Student</SelectItem>
                    <SelectItem value='O'>Office Worker</SelectItem>
                    <SelectItem value='B'>Blue Collar Worker</SelectItem>
                    <SelectItem value='D'>Digital Nomad / Tech Guru</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className='space-y-2'>
                <Label>Payment Methods</Label>
                <div className='border rounded-md p-4'>
                  {paymentOptions.map(option => (
                    <div key={option.value} className='flex items-center space-x-2 mb-2'>
                      <input 
                        type='checkbox'
                        id={`payment-${option.value}`}
                        checked={profileData.accepted_payments.includes(option.value)}
                        onChange={(e) => {
                          const newPayments = e.target.checked 
                            ? [...profileData.accepted_payments, option.value]
                            : profileData.accepted_payments.filter(v => v !== option.value);
                          handleChange('accepted_payments', newPayments);
                        }}
                        className='h-4 w-4 rounded border-gray-300 text-violet-600 focus:ring-violet-600'
                      />
                      <Label htmlFor={`payment-${option.value}`} className='text-sm font-normal'>
                        {option.label}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className='space-y-2'>
                <Label>What I Offer</Label>
                <div className='border rounded-md p-4'>
                  {['Underwear', 'Shoes', 'Hosiery', 'Clothing', 'Naughty Extras', 'Instant Content'].map(group => (
                    <div key={group} className='mb-4'>
                      <h4 className='text-sm font-medium mb-2'>{group}</h4>
                      <div className='pl-4'>
                        {offerOptions
                          .filter(option => option.group === group)
                          .map(option => (
                            <div key={option.value} className='flex items-center space-x-2 mb-2'>
                              <input 
                                type='checkbox'
                                id={`offer-${option.value}`}
                                checked={profileData.niche.includes(option.value)}
                                onChange={(e) => {
                                  const newNiche = e.target.checked 
                                    ? [...profileData.niche, option.value]
                                    : profileData.niche.filter(v => v !== option.value);
                                  handleChange('niche', newNiche);
                                }}
                                className='h-4 w-4 rounded border-gray-300 text-violet-600 focus:ring-violet-600'
                              />
                              <Label htmlFor={`offer-${option.value}`} className='text-sm font-normal'>
                                {option.label}
                              </Label>
                            </div>
                          ))}
                      </div>
                    </div>
                  ))}
                </div>
                <p className='text-sm text-muted-foreground'>
                  To increase your visibility, please select what you offer.
                </p>
              </div>
            </CardContent>
          </Card>
          
          <Card className='mb-6'>
            <CardHeader>
              <CardTitle>Login Credentials</CardTitle>
            </CardHeader>
            <CardContent className='space-y-4'>
              <div className='space-y-2'>
                <Label htmlFor='email'>Email</Label>
                <Input
                  id='email'
                  type='email'
                  value={profileData.email}
                  onChange={(e) => handleChange('email', e.target.value)}
                />
                <p className='text-sm text-muted-foreground'>
                  Updating your email address will require you to re-verify your
                  email address.
                </p>
              </div>
              
              <div className='space-y-2'>
                <Label htmlFor='password'>Password</Label>
                <Input
                  id='password'
                  type='password'
                  value={profileData.password}
                  onChange={(e) => handleChange('password', e.target.value)}
                />
                <p className='text-sm text-muted-foreground'>
                  Please leave blank if you do not wish to change. Use a minimum
                  of 6 characters.
                </p>
              </div>
            </CardContent>
          </Card>
          
          <div className='flex justify-end space-x-4 mb-6'>
            <Button
              type='button'
              variant='outline'>
              Cancel
            </Button>
            <Button
              type='submit'
              className='bg-violet-600 hover:bg-violet-700'>
              Update Settings
            </Button>
          </div>
        </form>
        
        <Separator className='my-6' />

        <Card className='mb-6'>
          <CardHeader>
            <CardTitle>Delete Your Account</CardTitle>
          </CardHeader>
          <CardContent>
            <div className='bg-red-50 border border-red-200 rounded-md p-4 text-red-800'>
              <p className='mb-2'>
                Before deleting your account why not read our guide on how to
                become a successful seller?
              </p>
              <hr className='my-2 border-red-200' />
              <p className='text-sm'>
                Permanently deleting your account will remove all your data.
                However, please be aware that we will still hold data privately
                to assist with any disputes should any be reported.
              </p>
              <Button
                variant='destructive'
                size='sm'
                className='mt-4'>
                Delete Account
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SellerSettings;