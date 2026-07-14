import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function FeedbackPage() {
  const typeformUrl = process.env.NEXT_PUBLIC_TYPEFORM_URL || "https://form.typeform.com/to/placeholder";

  return (
    <div className="space-y-6 max-w-4xl mx-auto py-6">
      <Card className="rounded-none border-2 border-border shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(242,239,233,1)]">
        <CardHeader className="border-b-2 border-border">
          <CardTitle className="text-3xl font-black tracking-tight">PLATFORM FEEDBACK</CardTitle>
          <CardDescription className="text-sm font-bold uppercase text-muted-foreground">
            Help us harden and improve the CertVault developer workspace.
          </CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <div className="w-full h-[600px] bg-card relative">
            {typeformUrl.includes("placeholder") ? (
              <div className="absolute inset-0 flex flex-col items-center justify-center p-8 text-center space-y-4">
                <div className="w-12 h-12 border-2 border-border flex items-center justify-center font-black text-xl bg-accent text-accent-foreground">
                  !
                </div>
                <p className="font-bold uppercase tracking-wider text-sm">
                  Typeform Link Pending Configuration
                </p>
                <p className="text-xs text-muted-foreground max-w-md">
                  Please configure the <code className="bg-muted px-1.5 py-0.5 border border-border">NEXT_PUBLIC_TYPEFORM_URL</code> environment variable on your Vercel project to load your custom feedback form.
                </p>
              </div>
            ) : (
              <iframe
                src={typeformUrl}
                width="100%"
                height="100%"
                frameBorder="0"
                allow="camera; microphone; autoplay; encrypted-media;"
                title="CertVault Feedback Form"
                className="w-full h-full"
              />
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
