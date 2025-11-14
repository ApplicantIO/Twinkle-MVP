'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Search, Upload, User, LogOut, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from '@/components/ui/dropdown-menu';
import { useAuth } from '@/contexts/AuthContext';

export function Header() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  return (
    <header className="fixed top-0 left-0 right-0 h-16 bg-background border-b border-surface z-50 flex items-center px-4 gap-4">
      <Link href="/" className="flex items-center gap-2 flex-shrink-0">
        <span className="text-2xl font-bold text-accent">Twinkle</span>
      </Link>

      <form onSubmit={handleSearch} className="flex-1 max-w-2xl mx-8">
        <div className="relative">
          <Input
            type="text"
            placeholder="Search videos..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 pr-4 bg-surface border-surface text-text-primary placeholder:text-text-secondary"
          />
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-text-secondary" />
        </div>
      </form>

      <div className="flex items-center gap-2 flex-shrink-0">
        {user ? (
          <>
            {(user.role === 'creator' || user.role === 'admin') && (
              <Button
                variant="ghost"
                size="icon"
                onClick={() => router.push('/studio/upload')}
                title="Upload video"
                className="text-text-secondary hover:text-text-primary hover:bg-surface"
              >
                <Upload className="h-5 w-5" />
              </Button>
            )}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="rounded-full text-text-secondary hover:text-text-primary hover:bg-surface"
                >
                  {user.profileImageUrl ? (
                    <img 
                      src={user.profileImageUrl} 
                      alt={user.name || 'User'} 
                      className="h-8 w-8 rounded-full" 
                    />
                  ) : (
                    <User className="h-5 w-5" />
                  )}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="bg-surface border-surface">
                <DropdownMenuItem 
                  onClick={() => router.push('/studio')}
                  className="text-text-primary hover:bg-background"
                >
                  <Settings className="h-4 w-4 mr-2" />
                  Creator Studio
                </DropdownMenuItem>
                <DropdownMenuItem 
                  onClick={handleLogout}
                  className="text-text-primary hover:bg-background"
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  Sign Out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </>
        ) : (
          <Button
            variant="default"
            onClick={() => router.push('/auth/signin')}
            className="bg-accent hover:bg-accent/90 text-white"
          >
            Sign In
          </Button>
        )}
      </div>
    </header>
  );
}
