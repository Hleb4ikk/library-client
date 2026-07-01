import { useNavigate } from "react-router-dom";
import { twMerge } from "tailwind-merge";

export type SidebarItemId =
  | "profile"
  | "likes"
  | "reading-list"
  | "comments"
  | "my-search";

type ProfileSidebarProps = {
  activeItem?: SidebarItemId;
};

const sidebarItems: Array<{
  id: SidebarItemId;
  label: string;
  icon: string;
  path?: string;
}> = [
  { id: "profile", label: "Профиль", icon: "♙", path: "/profile" },
  { id: "likes", label: "Мои лайки", icon: "♡", path: "/likes" },
  {
    id: "reading-list",
    label: "Список чтения",
    icon: "☷",
    path: "/reading-list",
  },
  { id: "comments", label: "Комментарии", icon: "▱", path: "/comments" },
];

export default function ProfileSidebar({
  activeItem = "profile",
}: ProfileSidebarProps) {
  const navigate = useNavigate();

  function handleItemClick(path?: string) {
    if (path) {
      navigate(path);
    }
  }

  return (
    <aside className="h-fit self-start overflow-hidden rounded-2xl border border-natural/20 bg-ivory-card shadow-card lg:sticky lg:top-24">
      <nav aria-label="Навигация личного кабинета">
        {sidebarItems.map((item) => {
          const isActive = item.id === activeItem;

          return (
            <button
              key={item.id}
              type="button"
              onClick={() => handleItemClick(item.path)}
              className={twMerge(
                "flex w-full items-center gap-3 border-b border-natural/10 px-5 py-4 text-left text-sm font-semibold text-fern transition last:border-b-0 hover:bg-natural/10",
                isActive &&
                  "border-l-4 border-l-apricot bg-apricot/5 pl-4 text-apricot",
                !item.path && "cursor-default",
              )}
            >
              <span
                className={twMerge(
                  "w-5 text-lg leading-none text-natural",
                  isActive && "text-apricot",
                )}
              >
                {item.icon}
              </span>

              <span>{item.label}</span>
            </button>
          );
        })}
      </nav>
    </aside>
  );
}
