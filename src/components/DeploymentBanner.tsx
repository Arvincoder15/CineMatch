import { AlertCircle, ExternalLink } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from './ui/alert';

export function DeploymentBanner() {
  return (
    <Alert variant="destructive" className="mb-4">
      <AlertCircle className="h-4 w-4" />
      <AlertTitle>Backend Not Deployed</AlertTitle>
      <AlertDescription className="mt-2 space-y-2">
        <p>
          The Supabase Edge Function needs to be deployed before you can create or join sessions.
        </p>
        <div className="mt-3 space-y-1">
          <p className="font-medium">Quick Fix:</p>
          <code className="block bg-background/50 p-2 rounded text-sm">
            supabase functions deploy make-server-ec9c6d6c
          </code>
        </div>
        <a
          href="/DEPLOYMENT_GUIDE.md"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1 text-sm underline mt-2 hover:no-underline"
        >
          View Full Deployment Guide
          <ExternalLink className="h-3 w-3" />
        </a>
      </AlertDescription>
    </Alert>
  );
}
