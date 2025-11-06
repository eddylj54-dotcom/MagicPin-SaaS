import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useQuery } from "@tanstack/react-query";
import { Calendar as CalendarIcon, Plus, Clock } from "lucide-react";
import { PLATFORMS, getPlatformById } from "@/lib/platforms";
import type { Post } from "@shared/schema";
import { Skeleton } from "@/components/ui/skeleton";
import { Link } from "wouter";

export default function Calendar() {
  const [view, setView] = useState<"month" | "week" | "day">("month");
  
  const { data: posts, isLoading } = useQuery<Post[]>({
    queryKey: ["/api/posts"],
  });

  const scheduledPosts = posts?.filter(p => p.status === 'scheduled') || [];
  const draftPosts = posts?.filter(p => p.status === 'draft') || [];

  // Generate calendar days for the current month
  const generateCalendarDays = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = today.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const days = [];
    
    // Add empty cells for days before the 1st
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push({ date: null, posts: [] });
    }
    
    // Add actual days
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(year, month, day);
      const postsOnDate = scheduledPosts.filter(post => {
        if (!post.scheduledFor) return false;
        const postDate = new Date(post.scheduledFor);
        return postDate.toDateString() === date.toDateString();
      });
      days.push({ date: day, posts: postsOnDate });
    }
    
    return days;
  };

  const calendarDays = generateCalendarDays();
  const today = new Date();
  const monthName = today.toLocaleString('default', { month: 'long', year: 'numeric' });

  return (
    <div className="flex-1 overflow-auto">
      <div className="container mx-auto p-8 max-w-7xl">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2" data-testid="text-calendar-title">Content Calendar</h1>
            <p className="text-muted-foreground">
              Plan and schedule your social media posts
            </p>
          </div>
          <Button asChild data-testid="button-schedule-new">
            <Link href="/generator">
              <Plus className="h-4 w-4 mr-2" />
              Schedule Post
            </Link>
          </Button>
        </div>

        <Tabs value={view} onValueChange={(v) => setView(v as any)} className="mb-6">
          <TabsList>
            <TabsTrigger value="month" data-testid="tab-month">Month</TabsTrigger>
            <TabsTrigger value="week" data-testid="tab-week">Week</TabsTrigger>
            <TabsTrigger value="day" data-testid="tab-day">Day</TabsTrigger>
          </TabsList>

          <TabsContent value="month" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>{monthName}</CardTitle>
                <CardDescription>Click on any day to view or schedule posts</CardDescription>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <Skeleton className="h-96 w-full" />
                ) : (
                  <div className="grid grid-cols-7 gap-2">
                    {/* Day headers */}
                    {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                      <div key={day} className="text-center font-semibold text-sm p-2">
                        {day}
                      </div>
                    ))}
                    
                    {/* Calendar days */}
                    {calendarDays.map((day, idx) => (
                      <div
                        key={idx}
                        className={`min-h-24 border rounded-md p-2 ${
                          day.date ? 'bg-card hover-elevate cursor-pointer' : 'bg-muted/30'
                        } ${day.date === today.getDate() ? 'border-primary' : ''}`}
                        data-testid={day.date ? `calendar-day-${day.date}` : undefined}
                      >
                        {day.date && (
                          <>
                            <div className="text-sm font-medium mb-1">{day.date}</div>
                            <div className="space-y-1">
                              {day.posts.slice(0, 2).map((post) => (
                                <div key={post.id} className="text-xs bg-primary/10 text-primary rounded px-1.5 py-0.5 truncate">
                                  {post.platforms.length} platforms
                                </div>
                              ))}
                              {day.posts.length > 2 && (
                                <div className="text-xs text-muted-foreground">
                                  +{day.posts.length - 2} more
                                </div>
                              )}
                            </div>
                          </>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="week" className="space-y-4">
            <Card className="p-6 text-center">
              <CalendarIcon className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-lg font-semibold mb-2">Week View Coming Soon</h3>
              <p className="text-sm text-muted-foreground">
                Week view will show your scheduled posts in a weekly timeline
              </p>
            </Card>
          </TabsContent>

          <TabsContent value="day" className="space-y-4">
            <Card className="p-6 text-center">
              <Clock className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-lg font-semibold mb-2">Day View Coming Soon</h3>
              <p className="text-sm text-muted-foreground">
                Day view will show your hourly schedule for a single day
              </p>
            </Card>
          </TabsContent>
        </Tabs>

        <div className="grid gap-6 md:grid-cols-2">
          {/* Scheduled Posts */}
          <Card>
            <CardHeader>
              <CardTitle>Scheduled Posts</CardTitle>
              <CardDescription>Posts ready to be published</CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="space-y-2">
                  {[1, 2, 3].map((i) => (
                    <Skeleton key={i} className="h-20 w-full" />
                  ))}
                </div>
              ) : scheduledPosts.length > 0 ? (
                <div className="space-y-3">
                  {scheduledPosts.map((post) => (
                    <Card key={post.id} className="p-4 hover-elevate" data-testid={`card-scheduled-${post.id}`}>
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <p className="text-sm line-clamp-2 flex-1">{post.content}</p>
                        <Badge variant="secondary" className="shrink-0">Scheduled</Badge>
                      </div>
                      <div className="flex flex-wrap gap-2 items-center">
                        {post.platforms.map((platformId) => {
                          const platform = getPlatformById(platformId);
                          if (!platform) return null;
                          const Icon = platform.icon;
                          return (
                            <div key={platformId} className="flex items-center gap-1 text-xs text-muted-foreground">
                              <Icon className="h-3 w-3" />
                              <span>{platform.name}</span>
                            </div>
                          );
                        })}
                        {post.scheduledFor && (
                          <span className="text-xs text-muted-foreground ml-auto">
                            {new Date(post.scheduledFor).toLocaleDateString()}
                          </span>
                        )}
                      </div>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="text-center py-6">
                  <CalendarIcon className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                  <p className="text-sm text-muted-foreground">No scheduled posts</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Drafts */}
          <Card>
            <CardHeader>
              <CardTitle>Drafts</CardTitle>
              <CardDescription>Posts waiting to be scheduled</CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="space-y-2">
                  {[1, 2].map((i) => (
                    <Skeleton key={i} className="h-20 w-full" />
                  ))}
                </div>
              ) : draftPosts.length > 0 ? (
                <div className="space-y-3">
                  {draftPosts.map((post) => (
                    <Card key={post.id} className="p-4 hover-elevate" data-testid={`card-draft-${post.id}`}>
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <p className="text-sm line-clamp-2 flex-1">{post.content}</p>
                        <Badge variant="outline" className="shrink-0">Draft</Badge>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {post.platforms.map((platformId) => {
                          const platform = getPlatformById(platformId);
                          if (!platform) return null;
                          const Icon = platform.icon;
                          return (
                            <div key={platformId} className="flex items-center gap-1 text-xs text-muted-foreground">
                              <Icon className="h-3 w-3" />
                              <span>{platform.name}</span>
                            </div>
                          );
                        })}
                      </div>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="text-center py-6">
                  <Clock className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                  <p className="text-sm text-muted-foreground">No drafts</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
