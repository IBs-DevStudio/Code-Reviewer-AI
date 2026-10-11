"use client";

import { useState } from "react";
import { authClient } from "@/lib/auth-client";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { FaGithub } from "react-icons/fa";

interface ConnectGitHubProps {
  title?: string;
  description?: string;
}

export function ConnectGitHub({
  title = "Connect GitHub Account",
  description = "Connect your GitHub account to import and view your repositories.",
}: ConnectGitHubProps) {
  const [isConnecting, setIsConnecting] = useState(false);

  const handleConnect = async () => {
    setIsConnecting(true);
    try {
      await authClient.linkSocial({
        provider: "github",
        callbackURL: window.location.href,
      });
    } catch (error) {
      console.error(error);
      setIsConnecting(false);
    }
  };

  return (
    <Card>
      <CardContent className="p-12 text-center">
        <div className="mx-auto flex size-14 items-center justify-center rounded-full bg-muted">
          <FaGithub className="size-7 text-muted-foreground" />
        </div>
        <h3 className="mt-4 text-lg font-semibold">{title}</h3>
        <p className="mx-auto mt-2 max-w-md text-sm text-muted-foreground">
          {description}
        </p>
        <Button
          onClick={handleConnect}
          disabled={isConnecting}
          className="mt-6"
        >
          {isConnecting ? (
            <Loader2 className="mr-2 size-4 animate-spin" />
          ) : (
            <FaGithub className="mr-2 size-4" />
          )}
          Connect GitHub
        </Button>
      </CardContent>
    </Card>
  );
}