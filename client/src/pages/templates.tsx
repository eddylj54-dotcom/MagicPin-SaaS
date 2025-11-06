import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { useQuery, useMutation } from "@tanstack/react-query";
import { FileText, Search, Plus, Copy, Sparkles } from "lucide-react";
import { PLATFORMS, getPlatformById } from "@/lib/platforms";
import { Skeleton } from "@/components/ui/skeleton";
import type { Template } from "@shared/schema";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { isUnauthorizedError } from "@/lib/authUtils";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function Templates() {
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  const { data: templates, isLoading } = useQuery<Template[]>({
    queryKey: ["/api/templates"],
  });

  const useTemplateMutation = useMutation({
    mutationFn: async (templateId: string) => {
      return await apiRequest("POST", `/api/templates/${templateId}/use`, {});
    },
    onSuccess: () => {
      toast({
        title: "Template Applied",
        description: "Template content copied to clipboard",
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
        title: "Failed to Use Template",
        description: error.message || "Something went wrong",
        variant: "destructive",
      });
    },
  });

  const filteredTemplates = templates?.filter(template => {
    const matchesSearch = template.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         template.description?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === "all" || template.category === selectedCategory;
    return matchesSearch && matchesCategory;
  }) || [];

  const categories = [
    { value: "all", label: "All Templates" },
    { value: "business", label: "Business" },
    { value: "lifestyle", label: "Lifestyle" },
    { value: "promotional", label: "Promotional" },
    { value: "educational", label: "Educational" },
  ];

  const handleUseTemplate = (template: Template) => {
    navigator.clipboard.writeText(template.content);
    useTemplateMutation.mutate(template.id);
  };

  return (
    <div className="flex-1 overflow-auto">
      <div className="container mx-auto p-8 max-w-7xl">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2" data-testid="text-templates-title">Templates</h1>
            <p className="text-muted-foreground">
              Pre-designed content templates to speed up your workflow
            </p>
          </div>
          <Button variant="outline" data-testid="button-create-template">
            <Plus className="h-4 w-4 mr-2" />
            Create Template
          </Button>
        </div>

        {/* Search and Filter */}
        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search templates..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
              data-testid="input-search-templates"
            />
          </div>
        </div>

        <Tabs value={selectedCategory} onValueChange={setSelectedCategory} className="mb-6">
          <TabsList className="flex-wrap h-auto">
            {categories.map((category) => (
              <TabsTrigger 
                key={category.value} 
                value={category.value}
                data-testid={`tab-category-${category.value}`}
              >
                {category.label}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>

        {isLoading ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <Card key={i} className="p-6">
                <Skeleton className="h-40 w-full" />
              </Card>
            ))}
          </div>
        ) : filteredTemplates.length > 0 ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filteredTemplates.map((template) => (
              <Card key={template.id} className="hover-elevate flex flex-col" data-testid={`card-template-${template.id}`}>
                <CardHeader>
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1 min-w-0">
                      <CardTitle className="text-lg mb-1">{template.name}</CardTitle>
                      {template.description && (
                        <CardDescription className="line-clamp-2">
                          {template.description}
                        </CardDescription>
                      )}
                    </div>
                    {template.category && (
                      <Badge variant="secondary" className="shrink-0 capitalize">
                        {template.category}
                      </Badge>
                    )}
                  </div>
                </CardHeader>
                <CardContent className="flex-1 flex flex-col gap-4">
                  <div className="bg-muted/50 rounded-md p-3 flex-1">
                    <p className="text-sm line-clamp-4">{template.content}</p>
                  </div>
                  
                  <div className="flex flex-wrap gap-2">
                    {template.platforms.map((platformId) => {
                      const platform = getPlatformById(platformId);
                      if (!platform) return null;
                      const Icon = platform.icon;
                      return (
                        <div key={platformId} className="flex items-center gap-1 text-xs text-muted-foreground">
                          <Icon className="h-3 w-3" />
                        </div>
                      );
                    })}
                  </div>

                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span>{template.usageCount || 0} uses</span>
                    {template.isPublic && (
                      <Badge variant="outline" className="text-xs">
                        Public
                      </Badge>
                    )}
                  </div>

                  <Button
                    className="w-full"
                    onClick={() => handleUseTemplate(template)}
                    disabled={useTemplateMutation.isPending}
                    data-testid={`button-use-template-${template.id}`}
                  >
                    <Copy className="h-4 w-4 mr-2" />
                    Use Template
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card className="p-12 text-center">
            <FileText className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
            <h3 className="text-lg font-semibold mb-2">No Templates Found</h3>
            <p className="text-sm text-muted-foreground mb-4">
              {searchQuery ? "Try a different search term" : "Create your first template to get started"}
            </p>
            <Button variant="outline">
              <Plus className="h-4 w-4 mr-2" />
              Create Template
            </Button>
          </Card>
        )}

        {/* Info Card */}
        <Card className="mt-8 p-6 bg-muted/50">
          <div className="flex items-start gap-4">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
              <Sparkles className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h3 className="font-semibold mb-1">Create Custom Templates</h3>
              <p className="text-sm text-muted-foreground">
                Save your best-performing posts as templates to reuse them across different campaigns.
                Templates can be customized for specific platforms and shared with your team.
              </p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
