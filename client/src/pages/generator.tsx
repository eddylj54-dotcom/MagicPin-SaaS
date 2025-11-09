import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PLATFORMS } from "@/lib/platforms";
import { Sparkles, Copy, RefreshCw, Calendar, Loader2 } from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { isUnauthorizedError } from "@/lib/authUtils";
import { Badge } from "@/components/ui/badge";

export default function Generator() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>([]);
  const [topic, setTopic] = useState("");
  const [tone, setTone] = useState("professional");
  const [generatedContent, setGeneratedContent] = useState<Record<string, string>>({});

  const generateMutation = useMutation({
    mutationFn: async () => {
      return await apiRequest("POST", "/api/ai/generate", {
        topic,
        tone,
        platforms: selectedPlatforms,
      });
    },
    onSuccess: (data: any) => {
      setGeneratedContent(data.content);
      toast({
        title: "Content Generated",
        description: "AI-powered content is ready for review",
      });
    },
    onError: (error: Error) => {
      if (isUnauthorizedError(error)) {
        toast({
          title: "Unauthorized",
          description: "You are logged out. Logging in again...",
          variant: "destructive",
        });
        setTimeout(() => {
          window.location.href = "/api/login";
        }, 500);
        return;
      }
      toast({
        title: "Generation Failed",
        description: error.message || "Failed to generate content",
        variant: "destructive",
      });
    },
  });

  const savePostMutation = useMutation({
    mutationFn: async (postContent: { platform: string; content: string }) => {
      return await apiRequest("POST", "/api/posts", {
        content: postContent.content,
        platforms: [postContent.platform],
        status: "draft",
      });
    },
    onSuccess: () => {
      toast({
        title: "Post Saved",
        description: "Your post has been saved as a draft.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/posts"] });
    },
    onError: (error: Error) => {
      toast({
        title: "Save Failed",
        description: error.message || "Failed to save the post",
        variant: "destructive",
      });
    },
  });

  const togglePlatform = (platformId: string) => {
    setSelectedPlatforms(prev =>
      prev.includes(platformId)
        ? prev.filter(p => p !== platformId)
        : [...prev, platformId]
    );
  };

  const handleGenerate = () => {
    if (selectedPlatforms.length === 0) {
      toast({
        title: "No Platforms Selected",
        description: "Please select at least one platform",
        variant: "destructive",
      });
      return;
    }
    if (!topic.trim()) {
      toast({
        title: "No Topic",
        description: "Please enter a topic or description",
        variant: "destructive",
      });
      return;
    }
    generateMutation.mutate();
  };

  const handleSavePost = (platform: string, content: string) => {
    savePostMutation.mutate({ platform, content });
  };

  const copyToClipboard = (content: string) => {
    navigator.clipboard.writeText(content);
    toast({
      title: "Copied",
      description: "Content copied to clipboard",
    });
  };

  return (
    <div className="flex-1 overflow-auto">
      <div className="container mx-auto p-8 max-w-7xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2" data-testid="text-generator-title">AI Content Generator</h1>
          <p className="text-muted-foreground">
            Generate platform-optimized posts with AI-powered content
          </p>
        </div>

        <div className="grid gap-8 lg:grid-cols-5">
          {/* Input Form */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Configure Content</CardTitle>
                <CardDescription>
                  Customize your AI-generated content
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Platform Selection */}
                <div className="space-y-3">
                  <Label>Select Platforms</Label>
                  <div className="grid gap-3 sm:grid-cols-2">
                    {PLATFORMS.map((platform) => {
                      const Icon = platform.icon;
                      const isSelected = selectedPlatforms.includes(platform.id);
                      
                      return (
                        <div
                          key={platform.id}
                          className={`flex items-center gap-3 rounded-md border p-3 cursor-pointer hover-elevate active-elevate-2 ${
                            isSelected ? 'border-primary bg-primary/5' : ''
                          }`}
                          onClick={() => togglePlatform(platform.id)}
                          data-testid={`checkbox-platform-${platform.id}`}
                        >
                          <Checkbox
                            checked={isSelected}
                            onCheckedChange={() => togglePlatform(platform.id)}
                          />
                          <Icon className="h-4 w-4" />
                          <span className="text-sm font-medium">{platform.name}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Topic Input */}
                <div className="space-y-2">
                  <Label htmlFor="topic">Topic or Description</Label>
                  <Textarea
                    id="topic"
                    placeholder="e.g., Launch of new eco-friendly product line, summer sale promotion, company milestone..."
                    className="min-h-32 resize-none"
                    value={topic}
                    onChange={(e) => setTopic(e.target.value)}
                    data-testid="input-topic"
                  />
                  <p className="text-xs text-muted-foreground">
                    Describe what you want to post about
                  </p>
                </div>

                {/* Tone Selector */}
                <div className="space-y-2">
                  <Label htmlFor="tone">Tone</Label>
                  <Select value={tone} onValueChange={setTone}>
                    <SelectTrigger id="tone" data-testid="select-tone">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="professional">Professional</SelectItem>
                      <SelectItem value="casual">Casual & Friendly</SelectItem>
                      <SelectItem value="enthusiastic">Enthusiastic</SelectItem>
                      <SelectItem value="educational">Educational</SelectItem>
                      <SelectItem value="promotional">Promotional</SelectItem>
                      <SelectItem value="inspirational">Inspirational</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Generate Button */}
                <Button
                  className="w-full"
                  onClick={handleGenerate}
                  disabled={generateMutation.isPending}
                  data-testid="button-generate"
                >
                  {generateMutation.isPending ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Generating...
                    </>
                  ) : (
                    <>
                      <Sparkles className="h-4 w-4 mr-2" />
                      Generate Content
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Preview */}
          <div className="lg:col-span-3 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Generated Content</CardTitle>
                <CardDescription>
                  Platform-specific content optimized for engagement
                </CardDescription>
              </CardHeader>
              <CardContent>
                {Object.keys(generatedContent).length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-12 text-center">
                    <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 mb-4">
                      <Sparkles className="h-8 w-8 text-primary" />
                    </div>
                    <h3 className="text-lg font-semibold mb-2">No Content Yet</h3>
                    <p className="text-sm text-muted-foreground max-w-sm">
                      Select platforms, enter a topic, and click generate to create AI-powered content
                    </p>
                  </div>
                ) : (
                  <Tabs defaultValue={selectedPlatforms[0]} className="w-full">
                    <TabsList className="w-full flex-wrap h-auto gap-2">
                      {selectedPlatforms.map((platformId) => {
                        const platform = PLATFORMS.find(p => p.id === platformId);
                        if (!platform) return null;
                        const Icon = platform.icon;
                        
                        return (
                          <TabsTrigger key={platformId} value={platformId} className="gap-2" data-testid={`tab-${platformId}`}>
                            <Icon className="h-3 w-3" />
                            {platform.name}
                          </TabsTrigger>
                        );
                      })}
                    </TabsList>
                    {selectedPlatforms.map((platformId) => {
                      const platform = PLATFORMS.find(p => p.id === platformId);
                      if (!platform) return null;
                      const content = generatedContent[platformId] || "";
                      
                      return (
                        <TabsContent key={platformId} value={platformId} className="space-y-4">
                          <div className={`rounded-lg border p-4 ${platform.bgColor}`}>
                            <div className="flex items-start justify-between gap-2 mb-3">
                              <Badge variant="secondary">{platform.name} Preview</Badge>
                              <div className="flex gap-1">
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => copyToClipboard(content)}
                                  data-testid={`button-copy-${platformId}`}
                                >
                                  <Copy className="h-4 w-4" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={handleGenerate}
                                  disabled={generateMutation.isPending}
                                  data-testid={`button-regenerate-${platformId}`}
                                >
                                  <RefreshCw className="h-4 w-4" />
                                </Button>
                              </div>
                            </div>
                            <div className="bg-background rounded-md p-4">
                              <p className="text-sm whitespace-pre-wrap" data-testid={`text-content-${platformId}`}>
                                {content}
                              </p>
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <Button variant="outline" className="flex-1" data-testid={`button-edit-${platformId}`}>
                              Edit Content
                            </Button>
                            <Button
                              className="flex-1"
                              data-testid={`button-schedule-${platformId}`}
                              onClick={() => handleSavePost(platformId, content)}
                              disabled={savePostMutation.isPending}
                            >
                              {savePostMutation.isPending ? (
                                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                              ) : (
                                <Calendar className="h-4 w-4 mr-2" />
                              )}
                              Schedule Post
                            </Button>
                          </div>
                        </TabsContent>
                      );
                    })}
                  </Tabs>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
