"use client";

import { useState } from "react";
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarFooter,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import {
  Menu,
  LayoutDashboard,
  FileSpreadsheet,
  BarChart2,
  Settings,
  LogOut,
} from "lucide-react";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isSidebarOpen] = useState(true);

  return (
    <SidebarProvider defaultOpen={isSidebarOpen}>
      <div className="flex h-screen w-full">
        <Sidebar>
          <SidebarHeader className="p-4">
            <h2 className="text-lg font-semibold">Celonis Dashboard</h2>
          </SidebarHeader>
          <SidebarContent className="flex flex-col gap-2 p-4">
            <Button variant="ghost" className="justify-start">
              <LayoutDashboard className="mr-2 h-4 w-4" />
              Dashboard
            </Button>
            <Button variant="ghost" className="justify-start">
              <FileSpreadsheet className="mr-2 h-4 w-4" />
              Data Upload
            </Button>
            <Button variant="ghost" className="justify-start">
              <BarChart2 className="mr-2 h-4 w-4" />
              Analytics
            </Button>
            <Button variant="ghost" className="justify-start">
              <Settings className="mr-2 h-4 w-4" />
              Settings
            </Button>
          </SidebarContent>
          <SidebarFooter className="p-4">
            <Button variant="ghost" className="w-full justify-start">
              <LogOut className="mr-2 h-4 w-4" />
              Logout
            </Button>
          </SidebarFooter>
        </Sidebar>
        <div className="flex flex-col flex-1 overflow-hidden">
          <header className="flex items-center justify-between p-4 border-b">
            <SidebarTrigger>
              <Button variant="ghost" size="icon">
                <Menu className="h-4 w-4" />
              </Button>
            </SidebarTrigger>
            <div className="w-8" /> {/* Placeholder for right-side content */}
          </header>
          <main className="overflow-auto p-6">{children}</main>
          <footer className="p-4 border-t text-center text-sm text-gray-600">
            © 2025 Process Visualization Dashboard. All rights reserved.
          </footer>
        </div>
      </div>
    </SidebarProvider>
  );
}
