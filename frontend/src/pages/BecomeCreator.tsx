import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCreateCreatorProfile } from '../hooks/useCreator';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Textarea } from '../components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';

export default function BecomeCreator() {
  const [bio, setBio] = useState('');
  const [platformLinks, setPlatformLinks] = useState('');
  const [audienceSize, setAudienceSize] = useState('');
  const [category, setCategory] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const createProfile = useCreateCreatorProfile();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      await createProfile.mutateAsync({
        bio: bio || undefined,
        platformLinks: platformLinks || undefined,
        audienceSize: audienceSize ? parseInt(audienceSize) : undefined,
        category: category || undefined,
      });
      navigate('/creator/dashboard');
    } catch (err: any) {
      setError(err.message || 'Failed to create creator profile');
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <Card>
        <CardHeader>
          <CardTitle>Become a Creator</CardTitle>
          <CardDescription>
            Fill out your creator profile to start sharing content on Twinkle
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="p-3 text-sm text-red-600 bg-red-50 rounded-md">{error}</div>
            )}
            <div className="space-y-2">
              <Label htmlFor="bio">Bio</Label>
              <Textarea
                id="bio"
                placeholder="Tell us about yourself..."
                value={bio}
                onChange={(e) => setBio(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="platformLinks">Platform Links (comma-separated)</Label>
              <Input
                id="platformLinks"
                placeholder="https://youtube.com/..., https://instagram.com/..."
                value={platformLinks}
                onChange={(e) => setPlatformLinks(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="audienceSize">Audience Size</Label>
              <Input
                id="audienceSize"
                type="number"
                placeholder="10000"
                value={audienceSize}
                onChange={(e) => setAudienceSize(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <Input
                id="category"
                placeholder="e.g., Technology, Lifestyle, Education"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              />
            </div>
            <Button type="submit" className="w-full" disabled={createProfile.isPending}>
              {createProfile.isPending ? 'Creating Profile...' : 'Create Creator Profile'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

