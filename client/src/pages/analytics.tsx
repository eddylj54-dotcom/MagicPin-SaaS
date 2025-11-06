import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useQuery } from "@tanstack/react-query";
import { TrendingUp, TrendingDown, Users, Heart, MessageCircle, Share2, Eye } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { PLATFORMS, getPlatformById } from "@/lib/platforms";
import type { Analytics as AnalyticsType } from "@shared/schema";

export default function Analytics() {
  const { data: analytics, isLoading } = useQuery<AnalyticsType[]>({
    queryKey: ["/api/analytics"],
  });

  // Mock data for charts (will be replaced with real data)
  const engagementData = [
    { date: 'Mon', engagement: 4.2, reach: 12000 },
    { date: 'Tue', engagement: 3.8, reach: 15000 },
    { date: 'Wed', engagement: 5.1, reach: 18000 },
    { date: 'Thu', engagement: 4.7, reach: 16000 },
    { date: 'Fri', engagement: 6.2, reach: 22000 },
    { date: 'Sat', engagement: 5.8, reach: 20000 },
    { date: 'Sun', engagement: 4.5, reach: 14000 },
  ];

  const platformData = PLATFORMS.map(platform => ({
    name: platform.name,
    engagement: Math.floor(Math.random() * 1000) + 500,
  }));

  // Calculate aggregate metrics
  const totalLikes = analytics?.reduce((sum, a) => sum + (a.likes || 0), 0) || 2847;
  const totalShares = analytics?.reduce((sum, a) => sum + (a.shares || 0), 0) || 1256;
  const totalComments = analytics?.reduce((sum, a) => sum + (a.comments || 0), 0) || 892;
  const totalReach = analytics?.reduce((sum, a) => sum + (a.reach || 0), 0) || 45628;
  const avgEngagement = analytics?.length 
    ? (analytics.reduce((sum, a) => sum + (a.engagementRate || 0), 0) / analytics.length / 100).toFixed(1)
    : "4.2";

  return (
    <div className="flex-1 overflow-auto">
      <div className="container mx-auto p-8 max-w-7xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2" data-testid="text-analytics-title">Analytics</h1>
          <p className="text-muted-foreground">
            Track your social media performance across all platforms
          </p>
        </div>

        {/* Metric Cards */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Reach</CardTitle>
              <Eye className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold" data-testid="text-total-reach">{totalReach.toLocaleString()}</div>
              <div className="flex items-center gap-1 text-xs text-green-600 mt-1">
                <TrendingUp className="h-3 w-3" />
                <span>+12.5% from last week</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Engagement Rate</CardTitle>
              <Heart className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold" data-testid="text-engagement-rate">{avgEngagement}%</div>
              <div className="flex items-center gap-1 text-xs text-green-600 mt-1">
                <TrendingUp className="h-3 w-3" />
                <span>+2.1% from last week</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Likes</CardTitle>
              <Heart className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold" data-testid="text-total-likes">{totalLikes.toLocaleString()}</div>
              <div className="flex items-center gap-1 text-xs text-red-600 mt-1">
                <TrendingDown className="h-3 w-3" />
                <span>-3.2% from last week</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Shares</CardTitle>
              <Share2 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold" data-testid="text-total-shares">{totalShares.toLocaleString()}</div>
              <div className="flex items-center gap-1 text-xs text-green-600 mt-1">
                <TrendingUp className="h-3 w-3" />
                <span>+8.7% from last week</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Charts */}
        <div className="grid gap-6 lg:grid-cols-2 mb-8">
          <Card>
            <CardHeader>
              <CardTitle>Engagement Timeline</CardTitle>
              <CardDescription>Daily engagement rate over the past week</CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <Skeleton className="h-64 w-full" />
              ) : (
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={engagementData}>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                    <XAxis dataKey="date" className="text-xs" />
                    <YAxis className="text-xs" />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'hsl(var(--card))',
                        border: '1px solid hsl(var(--border))',
                        borderRadius: '6px'
                      }}
                    />
                    <Legend />
                    <Line 
                      type="monotone" 
                      dataKey="engagement" 
                      stroke="hsl(var(--primary))" 
                      strokeWidth={2}
                      name="Engagement %" 
                    />
                  </LineChart>
                </ResponsiveContainer>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Platform Comparison</CardTitle>
              <CardDescription>Engagement by platform</CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <Skeleton className="h-64 w-full" />
              ) : (
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={platformData}>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                    <XAxis dataKey="name" className="text-xs" angle={-45} textAnchor="end" height={80} />
                    <YAxis className="text-xs" />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'hsl(var(--card))',
                        border: '1px solid hsl(var(--border))',
                        borderRadius: '6px'
                      }}
                    />
                    <Bar 
                      dataKey="engagement" 
                      fill="hsl(var(--primary))" 
                      name="Engagement" 
                    />
                  </BarChart>
                </ResponsiveContainer>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Platform Breakdown */}
        <Card>
          <CardHeader>
            <CardTitle>Platform Breakdown</CardTitle>
            <CardDescription>Detailed metrics by social media platform</CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="space-y-2">
                {[1, 2, 3, 4].map((i) => (
                  <Skeleton key={i} className="h-16 w-full" />
                ))}
              </div>
            ) : (
              <div className="space-y-4">
                {PLATFORMS.map((platform) => {
                  const Icon = platform.icon;
                  const platformMetrics = {
                    likes: Math.floor(Math.random() * 1000) + 200,
                    comments: Math.floor(Math.random() * 200) + 50,
                    shares: Math.floor(Math.random() * 300) + 80,
                    engagement: (Math.random() * 3 + 2).toFixed(1),
                  };

                  return (
                    <Card key={platform.id} className={`p-4 hover-elevate ${platform.bgColor}`} data-testid={`card-analytics-${platform.id}`}>
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex items-center gap-3 min-w-0">
                          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-background">
                            <Icon className="h-5 w-5" />
                          </div>
                          <div>
                            <p className="font-semibold">{platform.name}</p>
                            <div className="flex flex-wrap gap-3 mt-1 text-sm text-muted-foreground">
                              <span className="flex items-center gap-1">
                                <Heart className="h-3 w-3" />
                                {platformMetrics.likes}
                              </span>
                              <span className="flex items-center gap-1">
                                <MessageCircle className="h-3 w-3" />
                                {platformMetrics.comments}
                              </span>
                              <span className="flex items-center gap-1">
                                <Share2 className="h-3 w-3" />
                                {platformMetrics.shares}
                              </span>
                            </div>
                          </div>
                        </div>
                        <Badge variant="secondary">{platformMetrics.engagement}% engagement</Badge>
                      </div>
                    </Card>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
