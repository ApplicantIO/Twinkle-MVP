import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Button } from '../components/ui/button';
import { useJoinWaitlist } from '../hooks/useWaitlist';
import { useState } from 'react';
import { Input } from '../components/ui/input';

export default function Home() {
  const { user } = useAuth();
  const [email, setEmail] = useState('');
  const [interest, setInterest] = useState('USER');
  const [note, setNote] = useState('');
  const [message, setMessage] = useState('');
  const joinWaitlist = useJoinWaitlist();

  const handleWaitlistSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage('');

    try {
      await joinWaitlist.mutateAsync({
        userEmail: email,
        interestedIn: interest,
        note: note || undefined,
      });
      setMessage('Successfully joined the waitlist!');
      setEmail('');
      setNote('');
    } catch (error: any) {
      setMessage(error.message || 'Failed to join waitlist');
    }
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-blue-600 to-purple-700 text-white">
        <div className="container mx-auto px-4 py-24">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-5xl font-bold mb-6">Welcome to Twinkle</h1>
            <p className="text-xl mb-8 text-blue-100">
              The verified creator platform for Uzbekistan. Connect with trusted creators and
              discover amazing content.
            </p>
            <div className="flex gap-4 justify-center">
              {user ? (
                <>
                  <Link to="/browse">
                    <Button size="lg" variant="secondary">
                      Browse Videos
                    </Button>
                  </Link>
                  {user.role === 'CREATOR' && (
                    <Link to="/creator/dashboard">
                      <Button size="lg" variant="outline" className="bg-white/10 text-white border-white/20 hover:bg-white/20">
                        Creator Dashboard
                      </Button>
                    </Link>
                  )}
                </>
              ) : (
                <>
                  <Link to="/signup">
                    <Button size="lg" variant="secondary">
                      Get Started
                    </Button>
                  </Link>
                  <Link to="/browse">
                    <Button size="lg" variant="outline" className="bg-white/10 text-white border-white/20 hover:bg-white/20">
                      Browse Content
                    </Button>
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Waitlist Section */}
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-8">Join the Waitlist</h2>
          <form onSubmit={handleWaitlistSubmit} className="space-y-4 bg-white p-6 rounded-lg shadow-md">
            {message && (
              <div className={`p-3 rounded-md ${message.includes('Successfully') ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
                {message}
              </div>
            )}
            <div>
              <label className="block text-sm font-medium mb-2">Email</label>
              <Input
                type="email"
                placeholder="your@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">I'm interested in</label>
              <select
                value={interest}
                onChange={(e) => setInterest(e.target.value)}
                className="w-full h-10 rounded-md border border-input bg-background px-3 py-2"
              >
                <option value="USER">Being a User</option>
                <option value="CREATOR">Being a Creator</option>
                <option value="BUSINESS">Business Partnership</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Note (optional)</label>
              <textarea
                value={note}
                onChange={(e) => setNote(e.target.value)}
                className="w-full min-h-[80px] rounded-md border border-input bg-background px-3 py-2"
                placeholder="Tell us more about your interest..."
              />
            </div>
            <Button type="submit" className="w-full" disabled={joinWaitlist.isPending}>
              {joinWaitlist.isPending ? 'Submitting...' : 'Join Waitlist'}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}

