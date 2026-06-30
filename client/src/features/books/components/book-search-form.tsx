import type { FormEvent } from "react";

import { Button, Dropdown, Input } from "../../../components/shared";
import type { DropdownOption } from "../../../components/shared/dropdown";

export type SearchType = "all" | "title" | "author";

type BookSearchFormProps = {
  value: string;
  onChange: (value: string) => void;
  onSubmit: () => void;
  searchType?: SearchType;
  onSearchTypeChange?: (type: SearchType) => void;
};

const searchTypeOptions: DropdownOption[] = [
  { value: "all", label: "Везде", icon: "🔍" },
  { value: "title", label: "По названию", icon: "📖" },
  { value: "author", label: "По автору", icon: "✍️" },
];

export default function BookSearchForm({
  value,
  onChange,
  onSubmit,
  searchType = "all",
  onSearchTypeChange,
}: BookSearchFormProps) {
  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    onSubmit();
  }

  function handleSearchTypeChange(newType: string) {
    if (onSearchTypeChange) {
      onSearchTypeChange(newType as SearchType);
    }
  }

  let placeholder = "Поиск по названию или автору...";
  if (searchType === "title") {
    placeholder = "Введите название книги...";
  } else if (searchType === "author") {
    placeholder = "Введите имя автора...";
  }

  return (
    <form onSubmit={handleSubmit} className="mx-auto mt-10 max-w-3xl">
      <div className="flex flex-col gap-2 rounded-2xl border border-natural/40 bg-ivory-card/15 p-1.5 sm:flex-row sm:items-stretch">
        {onSearchTypeChange && (
          <>
            <Dropdown
              options={searchTypeOptions}
              value={searchType}
              onChange={handleSearchTypeChange}
              className="w-full shrink-0 sm:w-44"
              triggerClassName="h-12 rounded-xl border-0 bg-ivory-card/15 text-ivory hover:border-0 focus:ring-0 sm:bg-transparent"
            />

            <div className="hidden w-px shrink-0 self-stretch bg-natural/30 sm:block" />
          </>
        )}

        <div className="relative flex-1">
          <span className="pointer-events-none absolute left-4 top-1/2 z-10 -translate-y-1/2 text-natural">
            ⌕
          </span>

          <Input
            value={value}
            onChange={(event) => onChange(event.target.value)}
            placeholder={placeholder}
            className="h-12 border-0 bg-ivory-card/15 pl-11 text-ivory placeholder:text-natural focus:ring-0 sm:bg-transparent"
          />
        </div>

        <Button type="submit" className="h-12 shrink-0 px-8">
          ⌕ Найти
        </Button>
      </div>
    </form>
  );
}
