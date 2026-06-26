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
    <form
      onSubmit={handleSubmit}
      className="mx-auto mt-10 flex max-w-3xl flex-col gap-3"
    >
      <div className="flex flex-col gap-3 sm:flex-row">
        <div className="relative flex-1">
          <span className="pointer-events-none absolute left-4 top-1/2 z-10 -translate-y-1/2 text-natural">
            ⌕
          </span>

          <Input
            value={value}
            onChange={(event) => onChange(event.target.value)}
            placeholder={placeholder}
            className="h-14 border-natural/40 bg-ivory-card/15 pl-11 text-ivory placeholder:text-natural focus:border-apricot"
          />
        </div>

        <Button type="submit" className="h-14 px-8 sm:w-auto">
          ⌕ Найти
        </Button>
      </div>

      {onSearchTypeChange && (
        <div className="flex items-center gap-3">
          <span className="text-sm font-medium text-natural">Искать:</span>
          <Dropdown
            options={searchTypeOptions}
            value={searchType}
            onChange={handleSearchTypeChange}
            className="w-48"
          />
        </div>
      )}
    </form>
  );
}
