import { useEffect, useState, type ImgHTMLAttributes } from "react";
import { Blurhash } from "react-blurhash";

interface ImageAttributes extends ImgHTMLAttributes<HTMLImageElement> {
  blurhash?: string;
}

export function Img({ src, blurhash, alt, ...props }: ImageAttributes) {
  const [imageLoaded, setImageLoaded] = useState<boolean>(false);

  useEffect(() => {
    if (src) {
      setImageLoaded(false);

      const img = new Image();
      img.src = src;

      img.onload = () => {
        setImageLoaded(true);
      };
      return () => {
        img.onload = null;
      };
    }
  }, [src]);

  return (
    <div
      style={{ position: "relative", width: props.width, height: props.height }}
    >
      {!imageLoaded && src && blurhash && (
        <Blurhash
          hash={blurhash}
          width="100%"
          height="100%"
          resolutionX={32}
          resolutionY={32}
          punch={1}
        />
      )}
      <img
        {...props}
        src={src}
        alt={alt ?? ""}
        style={{
          ...props.style,
          display: imageLoaded ? "block" : "none",
        }}
      />
    </div>
  );
}
