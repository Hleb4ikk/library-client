import type { ReactNode } from "react";
import { twMerge } from "tailwind-merge";

import AppHeader from "../../../layouts/app-header";
import ProfileSidebar from "./profile-sidebar";
import type { SidebarItemId } from "./profile-sidebar";

type ProfileLayoutProps = {
  activeItem: SidebarItemId;
  title?: string;
  children: ReactNode;
};

export default function ProfileLayout({
  activeItem,
  title,
  children,
}: ProfileLayoutProps) {
  return (
    <div className="min-h-screen bg-ivory text-fern">
      <AppHeader />

      <main className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {title && (
          <h1 className="font-playfair text-3xl font-semibold text-fern sm:text-4xl">
            {title}
          </h1>
        )}

        <div
          className={twMerge(
            "grid items-start gap-6 lg:grid-cols-[280px_1fr]",
            title && "mt-7",
          )}
        >
          <ProfileSidebar activeItem={activeItem} />

          <section className="rounded-3xl border border-natural/20 bg-ivory-card p-5 shadow-page sm:p-7">
            {children}
          </section>
        </div>
      </main>
    </div>
  );
}
