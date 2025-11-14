'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { Video } from '@/types';
import { Play } from 'lucide-react';
import Link from 'next/link';

export default function SubscriptionsPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [videos, setVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      router.push('/auth/signin');
      return;
    }

    // For MVP, subscriptions are disabled
    // This page shows a placeholder
    setLoading(false);
  }, [user, router]);

  if (loading) {
    return (
      <div className="p-8">
        <div className="text-center text-text-secondary">Loading...</div>
      </div>
    );
  }

  return (
    <div className="p-8">
      <h1 className="text-2xl font-semibold mb-6 text-text-primary">Subscriptions</h1>
      
      <div className="text-center py-12 text-text-secondary">
        <p className="mb-2">Subscriptions feature is coming soon!</p>
        <p className="text-sm">This feature will be available in a future update.</p>
      </div>
    </div>
  );
}
