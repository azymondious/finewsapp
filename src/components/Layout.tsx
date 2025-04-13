import React from "react";
import { Outlet, Link } from "react-router-dom";
import DataBar from "./DataBar";
import { Button } from "@/components/ui/button";
import { Home as HomeIcon } from "lucide-react";

interface LayoutProps {
  children?: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 overflow-y-auto relative">
      <DataBar />
      <div className="absolute top-4 right-4 z-20">
        <Button
          variant="outline"
          size="sm"
          className="rounded-full p-2 h-10 w-10 bg-white/80 backdrop-blur-sm shadow-soft hover:shadow-soft-lg transition-all duration-300 border-modern-gray-200"
          asChild
        >
          <Link to="/">
            <HomeIcon className="h-5 w-5 text-modern-accent" />
            <span className="sr-only">Go Home</span>
          </Link>
        </Button>
      </div>
      <main className="container mx-auto py-6 px-4 md:px-6">
        {children || <Outlet />}
      </main>
    </div>
  );
};

export default Layout;
