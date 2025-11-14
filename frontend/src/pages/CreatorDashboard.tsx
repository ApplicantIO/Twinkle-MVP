import { useCreatorProfile } from '../hooks/useCreator';
import { useMyVideos, useCreateVideo } from '../hooks/useVideos';
import { useState } from 'react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Textarea } from '../components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Link } from 'react-router-dom';
import { Video } from '../types';

export default function CreatorDashboard() {
  const { data: profile, isLoading: profileLoading } = useCreatorProfile();
  const { data: videos, isLoading: videosLoading } = useMyVideos();
  const createVideo = useCreateVideo();
  const [showForm, setShowForm] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [videoUrl, setVideoUrl] = useState('');
  const [thumbnailUrl, setThumbnailUrl] = useState('');
  const [tags, setTags] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!title || !videoUrl) {
      setError('Title and video URL are required');
      return;
    }

    try {
      await createVideo.mutateAsync({
        title,
        description: description || undefined,
        videoUrl,
        thumbnailUrl: thumbnailUrl || undefined,
        tags: tags ? tags.split(',').map((t) => t.trim()) : [],
        status: 'DRAFT',
      });
      setTitle('');
      setDescription('');
      setVideoUrl('');
      setThumbnailUrl('');
      setTags('');
      setShowForm(false);
    } catch (err: any) {
      setError(err.message || 'Failed to create video');
    }
  };

  if (profileLoading) {
    return <div className="container mx-auto px-4 py-8">Loading...</div>;
  }

  if (!profile) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card>
          <CardContent className="pt-6">
            <p className="mb-4">You need to create a creator profile first.</p>
            <Link to="/creator/become">
              <Button>Become a Creator</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!profile.approvedByAdmin) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card>
          <CardHeader>
            <CardTitle>Pending Approval</CardTitle>
            <CardDescription>
              Your creator profile is pending admin approval. You'll be able to upload videos once
              approved.
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-bold">Creator Dashboard</h1>
        <Button onClick={() => setShowForm(!showForm)}>
          {showForm ? 'Cancel' : 'Create New Video'}
        </Button>
      </div>

      {showForm && (
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Create New Video</CardTitle>
            <CardDescription>Add a new video to your channel</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <div className="p-3 text-sm text-red-600 bg-red-50 rounded-md">{error}</div>
              )}
              <div className="space-y-2">
                <Label htmlFor="title">Title *</Label>
                <Input
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="videoUrl">Video URL *</Label>
                <Input
                  id="videoUrl"
                  type="url"
                  placeholder="https://youtube.com/watch?v=..."
                  value={videoUrl}
                  onChange={(e) => setVideoUrl(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="thumbnailUrl">Thumbnail URL</Label>
                <Input
                  id="thumbnailUrl"
                  type="url"
                  placeholder="https://example.com/thumbnail.jpg"
                  value={thumbnailUrl}
                  onChange={(e) => setThumbnailUrl(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="tags">Tags (comma-separated)</Label>
                <Input
                  id="tags"
                  placeholder="tech, tutorial, education"
                  value={tags}
                  onChange={(e) => setTags(e.target.value)}
                />
              </div>
              <Button type="submit" disabled={createVideo.isPending}>
                {createVideo.isPending ? 'Creating...' : 'Create Video'}
              </Button>
            </form>
          </CardContent>
        </Card>
      )}

      <div>
        <h2 className="text-2xl font-bold mb-4">My Videos</h2>
        {videosLoading ? (
          <div>Loading videos...</div>
        ) : videos && videos.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {videos.map((video: Video) => (
              <Card key={video.id}>
                {video.thumbnailUrl && (
                  <img
                    src={video.thumbnailUrl}
                    alt={video.title}
                    className="w-full h-48 object-cover"
                  />
                )}
                <CardHeader>
                  <CardTitle>{video.title}</CardTitle>
                  <CardDescription>Status: {video.status}</CardDescription>
                </CardHeader>
                <CardContent>
                  {video.description && (
                    <p className="text-sm text-muted-foreground mb-4">{video.description}</p>
                  )}
                  <a
                    href={video.videoUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary hover:underline text-sm"
                  >
                    View Video →
                  </a>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No videos yet. Create your first video!</p>
          </div>
        )}
      </div>
    </div>
  );
}

