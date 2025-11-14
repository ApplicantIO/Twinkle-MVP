import { usePendingCreators, useApproveCreator } from '../hooks/useAdmin';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { CreatorProfile } from '../types';

export default function AdminDashboard() {
  const { data: pendingCreators, isLoading } = usePendingCreators();
  const approveCreator = useApproveCreator();

  const handleApprove = async (creatorId: string) => {
    if (confirm('Are you sure you want to approve this creator?')) {
      try {
        await approveCreator.mutateAsync(creatorId);
      } catch (error: any) {
        alert(error.message || 'Failed to approve creator');
      }
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div>Loading...</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8">Admin Dashboard</h1>
      <h2 className="text-2xl font-semibold mb-4">Pending Creator Approvals</h2>
      {pendingCreators && pendingCreators.length > 0 ? (
        <div className="space-y-4">
          {pendingCreators.map((creator: CreatorProfile) => (
            <Card key={creator.id}>
              <CardHeader>
                <CardTitle>{creator.user.email}</CardTitle>
                <CardDescription>
                  Category: {creator.category || 'N/A'} | Audience: {creator.audienceSize}
                </CardDescription>
              </CardHeader>
              <CardContent>
                {creator.bio && <p className="mb-4">{creator.bio}</p>}
                {creator.platformLinks && (
                  <p className="text-sm text-muted-foreground mb-4">
                    Links: {creator.platformLinks}
                  </p>
                )}
                <Button onClick={() => handleApprove(creator.id)} disabled={approveCreator.isPending}>
                  {approveCreator.isPending ? 'Approving...' : 'Approve Creator'}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-muted-foreground">No pending creator approvals.</p>
        </div>
      )}
    </div>
  );
}

