import { useEffect, useState, type HTMLAttributes } from "react";
import { twMerge } from "tailwind-merge";
import Badge from "./badge";
import Button from "./button";
import IconButton from "./iconbutton";
import { Img } from "./Img";

interface BookCardProps extends Omit<HTMLAttributes<HTMLDivElement>, "title"> {
  title: string;
  author: string;
  cover?: string;
  status?: string;
  likes?: number;
  isLiked?: boolean;
  blurhash?: string;
  onOpen?: () => void;
  onLike?: () => void;
}

export default function BookCard({
  title,
  author,
  cover,
  blurhash,
  status,
  likes = 0,
  isLiked = false,
  onOpen,
  onLike,
  className,
  ...props
}: BookCardProps) {
  const [coverFailed, setCoverFailed] = useState(false);
  const showCover = Boolean(cover) && !coverFailed;

  useEffect(() => {
    setCoverFailed(false);
  }, [cover]);

  return (
    <div
      className={twMerge(
        "overflow-hidden rounded-2xl border border-fern/10 bg-ivory-card shadow-card transition hover:-translate-y-1 hover:shadow-page",
        className,
      )}
      {...props}
    >
      <button
        type="button"
        onClick={onOpen}
        className="h-64 w-full cursor-pointer overflow-hidden bg-ivory-muted"
      >
        {showCover ? (
          <Img
            src={cover}
            blurhash={blurhash}
            alt={title}
            loading="lazy"
            decoding="async"
            referrerPolicy="no-referrer"
            onError={() => setCoverFailed(true)}
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="flex h-full items-center justify-center px-4 text-center text-sm font-semibold text-natural">
            Нет обложки
          </div>
        )}
      </button>

      <div className="flex min-h-52 flex-col p-4">
        <button
          type="button"
          onClick={onOpen}
          className="cursor-pointer text-left"
        >
          <h3 className="text-sm font-bold text-fern transition hover:text-apricot sm:text-base">
            {title}
          </h3>
        </button>

        <p className="mt-1 text-xs text-natural-text sm:text-sm">{author}</p>

        {status && (
          <div className="mt-3">
            <Badge>{status}</Badge>
          </div>
        )}

        <div className="mt-auto flex items-center justify-between gap-3 pt-4">
          <IconButton
            onClick={onLike}
            active={isLiked}
            aria-label="Лайк"
            title="Лайк"
          >
            ♥ {likes}
          </IconButton>

          <Button variant="secondary" onClick={onOpen} className="px-4 py-2">
            Подробнее
          </Button>
        </div>
      </div>
    </div>
  );
}
