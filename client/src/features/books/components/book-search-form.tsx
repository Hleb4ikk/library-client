import type { FormEvent } from "react";

import { Button, Input } from "../../../components/shared";

type BookSearchFormProps = {
    value: string;
    onChange: (value: string) => void;
    onSubmit: () => void;
};

export default function BookSearchForm({
    value,
    onChange,
    onSubmit,
}: BookSearchFormProps) {
    function handleSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
        onSubmit();
    }

    return (
        <form
            onSubmit={handleSubmit}
            className="mx-auto mt-10 flex max-w-2xl flex-col gap-3 sm:flex-row"
        >
            <div className="relative flex-1">
                <span className="pointer-events-none absolute left-4 top-1/2 z-10 -translate-y-1/2 text-natural">
                    ⌕
                </span>

                <Input
                    value={value}
                    onChange={(event) => onChange(event.target.value)}
                    placeholder="Название или автор..."
                    className="h-14 border-natural/40 bg-ivory-card/15 pl-11 text-ivory placeholder:text-natural focus:border-apricot"
                />
            </div>

            <Button type="submit" className="h-14 px-8">
                ⌕ Найти
            </Button>
        </form>
    );
}