import { useEffect, useState, type ImgHTMLAttributes } from "react";
import { Blurhash } from "react-blurhash";

interface ImageAttributes extends ImgHTMLAttributes<HTMLImageElement> {
  blurhash?: string | null;
}

export function Img({ src, blurhash, alt, style, ...props }: ImageAttributes) {
  const [imageLoaded, setImageLoaded] = useState<boolean>(false);

  useEffect(() => {
    if (!src) return;

    setImageLoaded(false);

    const img = new Image();
    img.src = src;

    if (img.complete) {
      setImageLoaded(true);
      return;
    }

    img.onload = () => setImageLoaded(true);
    img.onerror = () => setImageLoaded(true);

    return () => {
      img.onload = null;
      img.onerror = null;
    };
  }, [src]);

  const showBlurhash = !imageLoaded && !!src && !!blurhash;

  return (
    <div
      style={{
        position: "relative",
        width: props.width || "100%",
        height: props.height || "100%",
        overflow: "hidden",
      }}
    >
      {showBlurhash && (
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
          }}
        >
          <Blurhash
            hash={blurhash}
            width="100%"
            height="100%"
            resolutionX={32}
            resolutionY={32}
            punch={1}
          />
        </div>
      )}

      {src && (
        <img
          {...props}
          src={src}
          alt={alt ?? ""}
          style={{
            ...style,
            display: imageLoaded ? "block" : "none",
            width: "100%",
            height: "100%",
            objectFit: style?.objectFit ?? "cover",
          }}
        />
      )}
    </div>
  );
}
