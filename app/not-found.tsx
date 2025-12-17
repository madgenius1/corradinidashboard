import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <Card className="max-w-md w-full">
        <div className="text-center">
          <div className="mb-6">
            <h1 className="text-9xl font-bold text-gray-200">404</h1>
          </div>
          
          <h2 className="text-2xl font-bold text-dark mb-2">
            Page Not Found
          </h2>
          
          <p className="text-gray-600 mb-6">
            The page you're looking for doesn't exist or has been moved.
          </p>
          
          <div className="flex gap-4 justify-center">
            <Link href="/">
              <Button>
                Go to Dashboard
              </Button>
            </Link>
            <Link href="/login">
              <Button variant="ghost">
                Go to Login
              </Button>
            </Link>
          </div>
        </div>
      </Card>
    </div>
  );
}