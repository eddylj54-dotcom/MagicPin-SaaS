import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useQuery } from "@tanstack/react-query";
import { Plus, TrendingUp, Users, BarChart2, Calendar as CalendarIcon, Clock } from "lucide-react";
import { PLATFORMS, getPlatformById } from "@/lib/platforms";
import { Skeleton } from "@/components/ui/skeleton";
import { Link } from "wouter";
import type { ConnectedAccount, Post } from "@shared/schema";

export default function Dashboard() {
  const { data: connectedAccounts, isLoading: accountsLoading } = useQuery<ConnectedAccount[]>({
    queryKey: ["/api/accounts"],
  });

  const { data: recentPosts, isLoading: postsLoading } = useQuery<Post[]>({
    queryKey: ["/api/posts/recent"],
  });

  const connectedCount = connectedAccounts?.filter(a => a.isConnected).length || 0;
  const totalFollowers = connectedAccounts?.reduce((sum, acc) => sum + (acc.followers || 0), 0) || 0;
  const scheduledCount = recentPosts?.filter(p => p.status === 'scheduled').length || 0;

  return (
    <div className="flex-1 overflow-auto">
      <div className="container mx-auto p-8 max-w-7xl">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2" data-testid="text-dashboard-title">Dashboard</h1>
            <p className="text-muted-foreground">Manage your social media presence</p>
          </div>
          <Button asChild data-testid="button-new-post">
            <Link href="/generator">
              <Plus className="h-4 w-4 mr-2" />
              New Post
            </Link>
          </Button>
        </div>

        {/* Quick Stats */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Connected Accounts</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold" data-testid="text-connected-count">{connectedCount}</div>
              <p className="text-xs text-muted-foreground">
                out of {PLATFORMS.length} platforms
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Reach</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold" data-testid="text-total-followers">
                {totalFollowers.toLocaleString()}
              </div>
              <p className="text-xs text-muted-foreground">
                combined followers
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Scheduled Posts</CardTitle>
              <CalendarIcon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold" data-testid="text-scheduled-count">{scheduledCount}</div>
              <p className="text-xs text-muted-foreground">
                ready to publish
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Avg Engagement</CardTitle>
              <BarChart2 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">4.2%</div>
              <p className="text-xs text-muted-foreground">
                across all platforms
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-8 lg:grid-cols-3">
          {/* Connected Accounts Overview */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-semibold">Connected Accounts</h2>
              <Button variant="outline" size="sm" asChild>
                <Link href="/accounts">View All</Link>
              </Button>
            </div>

            {accountsLoading ? (
              <div className="grid gap-4 sm:grid-cols-2">
                {[1, 2, 3, 4].map((i) => (
                  <Card key={i} className="p-4">
                    <Skeleton className="h-20 w-full" />
                  </Card>
                ))}
              </div>
            ) : connectedAccounts && connectedAccounts.length > 0 ? (
              <div className="grid gap-4 sm:grid-cols-2">
                {connectedAccounts.slice(0, 4).map((account) => {
                  const platform = getPlatformById(account.platform);
                  if (!platform) return null;
                  const Icon = platform.icon;

                  return (
                    <Card key={account.id} className={`p-4 hover-elevate ${platform.bgColor}`} data-testid={`card-account-${account.platform}`}>
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex items-center gap-3 min-w-0">
                          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-background">
                            <Icon className="h-5 w-5" />
                          </div>
                          <div className="min-w-0">
                            <div className="flex items-center gap-2">
                              <p className="font-semibold truncate">{platform.name}</p>
                              {account.isConnected && (
                                <Badge variant="secondary" className="text-xs">
                                  Connected
                                </Badge>
                              )}
                            </div>
                            {account.accountName && (
                              <p className="text-sm text-muted-foreground truncate">
                                @{account.accountName}
                              </p>
                            )}
                            {account.followers !== null && account.followers !== undefined && (
                              <p className="text-xs text-muted-foreground">
                                {account.followers.toLocaleString()} followers
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                    </Card>
                  );
                })}
              </div>
            ) : (
              <Card className="p-12 text-center">
                <Users className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                <h3 className="text-lg font-semibold mb-2">No Accounts Connected</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Connect your social media accounts to get started
                </p>
                <Button asChild>
                  <Link href="/accounts">Connect Accounts</Link>
                </Button>
              </Card>
            )}
          </div>

          {/* Quick Actions & Recent Activity */}
          <div className="space-y-4">
            <h2 className="text-2xl font-semibold">Quick Actions</h2>
            
            <Card className="p-4 hover-elevate active-elevate-2 cursor-pointer" asChild>
              <Link href="/generator" data-testid="card-generate-content">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary">
                    <Plus className="h-5 w-5 text-primary-foreground" />
                  </div>
                  <div>
                    <p className="font-semibold">Generate Content</p>
                    <p className="text-sm text-muted-foreground">AI-powered posts</p>
                  </div>
                </div>
              </Link>
            </Card>

            <Card className="p-4 hover-elevate active-elevate-2 cursor-pointer" asChild>
              <Link href="/calendar" data-testid="card-schedule-post">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                    <CalendarIcon className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-semibold">Schedule Post</p>
                    <p className="text-sm text-muted-foreground">Plan your content</p>
                  </div>
                </div>
              </Link>
            </Card>

            <Card className="p-4 hover-elevate active-elevate-2 cursor-pointer" asChild>
              <Link href="/analytics" data-testid="card-view-analytics">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                    <BarChart2 className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-semibold">View Analytics</p>
                    <p className="text-sm text-muted-foreground">Track performance</p>
                  </div>
                </div>
              </Link>
            </Card>

            <div className="pt-4">
              <h3 className="text-sm font-semibold mb-3">Recent Posts</h3>
              {postsLoading ? (
                <div className="space-y-2">
                  {[1, 2, 3].map((i) => (
                    <Skeleton key={i} className="h-16 w-full" />
                  ))}
                </div>
              ) : recentPosts && recentPosts.length > 0 ? (
                <div className="space-y-2">
                  {recentPosts.slice(0, 3).map((post) => (
                    <Card key={post.id} className="p-3" data-testid={`card-post-${post.id}`}>
                      <div className="flex items-start gap-2">
                        <Clock className="h-4 w-4 text-muted-foreground mt-0.5 shrink-0" />
                        <div className="min-w-0 flex-1">
                          <p className="text-sm line-clamp-2">{post.content}</p>
                          <div className="flex items-center gap-2 mt-1">
                            <Badge variant="secondary" className="text-xs">
                              {post.status}
                            </Badge>
                            <span className="text-xs text-muted-foreground">
                              {post.platforms.length} platform{post.platforms.length !== 1 ? 's' : ''}
                            </span>
                          </div>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              ) : (
                <Card className="p-6 text-center">
                  <CalendarIcon className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                  <p className="text-sm text-muted-foreground">No posts yet</p>
                </Card>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
