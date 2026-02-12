"use client";

import Link from "next/link";
import { useAuth } from "@/contexts/auth-context";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { GraduationCap, Home } from "lucide-react";

export function LehrerOnly({ children }: { children: React.ReactNode }) {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="container py-10 flex justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
      </div>
    );
  }

  if (user?.role !== "lehrer") {
    return (
      <div className="container py-10 flex justify-center">
        <Card className="w-full max-w-md border border-border shadow-md rounded-xl overflow-hidden bg-card">
          <CardHeader className="border-b border-border">
            <div className="flex items-center gap-2 text-primary">
              <GraduationCap className="h-6 w-6" />
              <CardTitle className="text-xl">Nur für Lehrer</CardTitle>
            </div>
            <p className="text-muted-foreground text-sm">
              Dieser Bereich ist Lehrkräften vorbehalten. Bitte melde dich als Lehrer an, um fortzufahren.
            </p>
          </CardHeader>
          <CardContent className="pt-6">
            <Button asChild className="w-full rounded-xl gap-2" size="lg">
              <Link href="/">
                <Home className="h-4 w-4" />
                Zur Startseite
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return <>{children}</>;
}
