import { redirect } from "next/navigation";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { PortfolioList } from "@/components/portfolios/portfolio-list";
import { PortfolioSetupForm } from "@/components/portfolios/portfolio-setup-form";
import { getUserPortfolios } from "@/lib/portfolio/queries";
import { getCurrentUser } from "@/lib/supabase/server";

export default async function PortfolioSetupPage() {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/sign-in");
  }

  const portfolios = await getUserPortfolios(user.id);

  return (
    <div className="min-h-screen px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-6">
        <Card className="border-white/10 bg-white/6">
          <CardHeader>
            <CardTitle>Create a portfolio</CardTitle>
            <CardDescription>
              Save a filtered portfolio definition so the dashboard can render the right charts
              for that slice of your claims data.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <PortfolioSetupForm />
          </CardContent>
        </Card>

        <Card className="border-white/10 bg-white/6">
          <CardHeader>
            <CardTitle>Saved portfolios</CardTitle>
            <CardDescription>
              These records are persisted in Supabase and will be used by the dashboard selector.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <PortfolioList portfolios={portfolios} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
