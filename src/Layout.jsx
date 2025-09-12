import React from 'react';
import { Outlet } from "react-router";
import { data } from "@lib/data/linkSidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { Link } from 'react-router';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import './css/index.css'; // Asegúrate de importar tu archivo CSS

//✅Components traduction
import { useTranslation } from "react-i18next";

const LayoutContent = () => {
  // Traducción
  const { t } = useTranslation();
  return (
<SidebarProvider>
      <AppSidebar  collapsible="icon" data={data} />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 lg:rounded-t-[10px] bg-green">
          <div className="flex items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1 text-primary" />
            <Separator orientation="vertical" className="mr-2 data-[orientation=vertical]:h-4" />
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem className="hidden md:block">
                  <BreadcrumbLink className="text-white font-black">
                    <Link to={'/'}>
                      {t("layout.breadcrumb.home")}
                    </Link>
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator className="hidden md:block" />
                <BreadcrumbItem>
                  <BreadcrumbPage className="text-white font-black">{t("layout.breadcrumb.module")}</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </header>
        <main className="flex-1 overflow-y-auto px-6 py-4">
          <Outlet />
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
};

        
const RootLayout = ({ children }) => {
  return (
    <div className="min-h-screen bg-background" style={{ fontFamily: 'var(--font-geist-sans)' }}>
      <LayoutContent />
    </div>
  );
};

export default RootLayout;