import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useQuery, useMutation } from "@tanstack/react-query";
import { PLATFORMS } from "@/lib/platforms";
import { Skeleton } from "@/components/ui/skeleton";
import { Link2, Users, CheckCircle2, XCircle } from "lucide-react";
import type { ConnectedAccount } from "@shared/schema";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { isUnauthorizedError } from "@/lib/authUtils";

export default function Accounts() {
  const { toast } = useToast();
  const { data: connectedAccounts, isLoading } = useQuery<ConnectedAccount[]>({
    queryKey: ["/api/accounts"],
  });

  const connectMutation = useMutation({
    mutationFn: async (platform: string) => {
      return await apiRequest("POST", "/api/accounts/connect", { platform });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/accounts"] });
      toast({
        title: "Account Connected",
        description: "Your account has been connected successfully",
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
        title: "Connection Failed",
        description: error.message || "Failed to connect account",
        variant: "destructive",
      });
    },
  });

  const disconnectMutation = useMutation({
    mutationFn: async (accountId: string) => {
      return await apiRequest("POST", `/api/accounts/${accountId}/disconnect`, {});
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/accounts"] });
      toast({
        title: "Account Disconnected",
        description: "Your account has been disconnected",
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
        title: "Disconnection Failed",
        description: error.message || "Failed to disconnect account",
        variant: "destructive",
      });
    },
  });

  const getAccountForPlatform = (platformId: string) => {
    return connectedAccounts?.find(acc => acc.platform === platformId);
  };

  return (
    <div className="flex-1 overflow-auto">
      <div className="container mx-auto p-8 max-w-6xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2" data-testid="text-accounts-title">Connected Accounts</h1>
          <p className="text-muted-foreground">
            Connect your social media accounts to start publishing
          </p>
        </div>

        {isLoading ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <Card key={i} className="p-6">
                <Skeleton className="h-32 w-full" />
              </Card>
            ))}
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {PLATFORMS.map((platform) => {
              const account = getAccountForPlatform(platform.id);
              const Icon = platform.icon;
              const isConnected = account?.isConnected || false;

              return (
                <Card key={platform.id} className="hover-elevate" data-testid={`card-platform-${platform.id}`}>
                  <CardHeader>
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex items-center gap-3">
                        <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-lg ${platform.bgColor}`}>
                          <Icon className="h-6 w-6" />
                        </div>
                        <div>
                          <CardTitle className="text-lg">{platform.name}</CardTitle>
                          {isConnected && account?.accountName && (
                            <CardDescription className="text-sm">
                              @{account.accountName}
                            </CardDescription>
                          )}
                        </div>
                      </div>
                      {isConnected ? (
                        <Badge variant="secondary" className="shrink-0">
                          <CheckCircle2 className="h-3 w-3 mr-1" />
                          Connected
                        </Badge>
                      ) : (
                        <Badge variant="outline" className="shrink-0">
                          <XCircle className="h-3 w-3 mr-1" />
                          Not Connected
                        </Badge>
                      )}
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {isConnected && account ? (
                      <>
                        {account.followers !== null && account.followers !== undefined && (
                          <div className="flex items-center gap-2 text-sm">
                            <Users className="h-4 w-4 text-muted-foreground" />
                            <span className="font-medium">{account.followers.toLocaleString()}</span>
                            <span className="text-muted-foreground">followers</span>
                          </div>
                        )}
                        <div className="space-y-2">
                          <p className="text-xs text-muted-foreground">Permissions:</p>
                          <ul className="text-xs text-muted-foreground space-y-1">
                            <li className="flex items-center gap-2">
                              <CheckCircle2 className="h-3 w-3 text-green-600" />
                              Publish posts
                            </li>
                            <li className="flex items-center gap-2">
                              <CheckCircle2 className="h-3 w-3 text-green-600" />
                              Read analytics
                            </li>
                            <li className="flex items-center gap-2">
                              <CheckCircle2 className="h-3 w-3 text-green-600" />
                              Manage comments
                            </li>
                          </ul>
                        </div>
                        <Button
                          variant="outline"
                          className="w-full"
                          onClick={() => disconnectMutation.mutate(account.id)}
                          disabled={disconnectMutation.isPending}
                          data-testid={`button-disconnect-${platform.id}`}
                        >
                          Disconnect
                        </Button>
                      </>
                    ) : (
                      <>
                        <div className="space-y-2">
                          <p className="text-xs text-muted-foreground">Connect to:</p>
                          <ul className="text-xs text-muted-foreground space-y-1">
                            <li className="flex items-center gap-2">
                              <div className="h-1 w-1 rounded-full bg-muted-foreground" />
                              Schedule posts automatically
                            </li>
                            <li className="flex items-center gap-2">
                              <div className="h-1 w-1 rounded-full bg-muted-foreground" />
                              Track engagement metrics
                            </li>
                            <li className="flex items-center gap-2">
                              <div className="h-1 w-1 rounded-full bg-muted-foreground" />
                              Respond to comments
                            </li>
                          </ul>
                        </div>
                        <Button
                          className="w-full"
                          onClick={() => connectMutation.mutate(platform.id)}
                          disabled={connectMutation.isPending}
                          data-testid={`button-connect-${platform.id}`}
                        >
                          <Link2 className="h-4 w-4 mr-2" />
                          Connect {platform.name}
                        </Button>
                      </>
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}

        <Card className="mt-8 p-6 bg-muted/50">
          <div className="flex items-start gap-4">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
              <Link2 className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h3 className="font-semibold mb-1">OAuth Authentication</h3>
              <p className="text-sm text-muted-foreground">
                Your accounts are connected securely using OAuth 2.0. MagicPin never stores your passwords
                and you can revoke access at any time from your social media settings.
              </p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
