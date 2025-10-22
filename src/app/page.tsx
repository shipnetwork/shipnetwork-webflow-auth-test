import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function Home() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="container max-w-2xl">
        <Card className="text-center">
          <CardHeader>
            <CardTitle className="text-4xl font-bold bg-gradient-to-r from-[#3245ff] to-[#bc52ee] bg-clip-text text-transparent">
              Welcome to Webflow Cloud
            </CardTitle>
            <CardDescription className="text-base mt-2">
              This is a simple test using shadcn/ui components with Tailwind CSS v4
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              Get started with modern UI components, beautiful default styling, and full TypeScript support.
            </p>
          </CardContent>
          <CardFooter className="flex justify-center">
            <Button asChild size="lg">
              <a href="https://developers.webflow.com/webflow-cloud/getting-started">
                Get Started
              </a>
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
