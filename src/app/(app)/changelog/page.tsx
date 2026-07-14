import { prisma } from "@/lib/prisma";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default async function ChangelogPage() {
  const changelogs = await prisma.changelog.findMany({
    orderBy: { date: 'desc' }
  });

  return (
    <div className="max-w-3xl mx-auto">
      <h1 className="text-4xl font-extrabold tracking-tight mb-8 animate-fade-in-up">Changelog</h1>
      
      {changelogs.length === 0 ? (
        <p className="text-muted-foreground animate-fade-in-up delay-100">No updates yet.</p>
      ) : (
        <div className="space-y-8">
          {changelogs.map((log, i) => (
            <Card key={log.id} className="premium-card animate-fade-in-up" style={{ animationDelay: `${(i+1) * 100}ms` }}>
              <CardHeader className="pb-4">
                <div className="flex justify-between items-center mb-2">
                  <CardTitle className="text-2xl font-bold tracking-tight">{log.version}</CardTitle>
                  <span className="text-sm font-medium text-muted-foreground bg-muted/50 px-3 py-1 rounded-full">
                    {new Date(log.date).toLocaleDateString()}
                  </span>
                </div>
                <div>
                  <Badge variant="secondary" className="bg-primary/10 text-primary border border-primary/20 hover:bg-primary/20 font-semibold shadow-sm">
                    {log.category}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <h3 className="text-lg font-bold mb-3">{log.summary}</h3>
                {log.notes && (
                  <p className="text-muted-foreground leading-relaxed whitespace-pre-wrap text-sm">
                    {log.notes}
                  </p>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
