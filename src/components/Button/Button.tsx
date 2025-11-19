import { useEffect, useRef, useState } from "react";
import "./Button.scss";

interface ButtonProps {
  text: string;
  href: string;

  colorSchemeName?: "black" | "white";
}

const colorSchemes = {
  black: {
    gradientStart: "#cc4125", // UBC AI Safety burnt orange accent
    gradientEnd: "#111111",   // Deep charcoal
  },
  white: {
    gradientStart: "#9a031e", // Deep maroon accent
    gradientEnd: "#f9f9f9",   // Off-white
  },
};

export function Button({ text, href, colorSchemeName = "white" }: ButtonProps) {
  const buttonRef = useRef<HTMLAnchorElement>(null);
  const [mouseLocation, setMouseLocation] = useState<[x: number, y: number]>();

  useEffect(() => {
    const buttonElement = buttonRef.current;
    const handleMouseMove = (event: MouseEvent) => {
      if (buttonElement) {
        const { left, top, width, height } =
          buttonElement.getBoundingClientRect();
        const x = ((event.clientX - left) / width) * 100;
        const y = ((event.clientY - top) / height) * 100;

        setMouseLocation([x, y]);
      }
    };

    if (buttonElement) {
      buttonElement.addEventListener("mousemove", handleMouseMove);

      return () => {
        buttonElement.removeEventListener("mousemove", handleMouseMove);
      };
    }
  }, []);

  return (
    <a
      ref={buttonRef}
      href={href}
      target="_blank"
      className={`button ${colorSchemeName}`}
    >
      <div
        className="gradient"
        style={{
          background:
            mouseLocation &&
            `radial-gradient(circle at ${mouseLocation[0]}% ${mouseLocation[1]}%, ${colorSchemes[colorSchemeName].gradientStart}, ${colorSchemes[colorSchemeName].gradientEnd})`,
        }}
      />
      <span className="text">{text}</span>
    </a>
  );
}
