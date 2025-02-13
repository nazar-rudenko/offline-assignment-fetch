import { useState, useEffect } from "react";
import { Dog } from "lucide-react";

const Logo = () => {
  const [importantCounter, setImportantCounter] = useState(1);

  const handleClick = () => {
    setImportantCounter((count) => count + 1);
  };

  useEffect(() => {
    if (importantCounter >= 20) {
      window
        ?.open(
          "https://youtu.be/2soGJXQAQec?si=ZAwjIzXEgzZfJdKL&t=48",
          "_blank",
        )
        ?.focus();
    }
  }, [importantCounter, setImportantCounter]);

  return (
    <h1
      className="flex gap-2 text-xl font-bold absolute left-1/2 transform -translate-x-1/2"
      onClick={handleClick}
    >
      <Dog size={32} />
    </h1>
  );
};

export default Logo;
