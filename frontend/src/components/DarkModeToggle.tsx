import { useEffect, useState } from "react";
import { BsSun, BsMoonFill } from "react-icons/bs";
import { themeChange } from "theme-change";

type Props = {
  className?: string;
};

const DarkModeToggle = ({ className }: Props) => {
  const [darkMode, setDarkMode] = useState(
    localStorage.getItem("theme") === "darkTheme"
  );

  useEffect(() => {
    themeChange(false);
  }, []);

  return (
    <div className={className}>
      {darkMode ? (
        <button
          data-set-theme="lightTheme"
          data-act-class="ACTIVECLASS"
          onClick={() => setDarkMode(false)}
        >
          <BsMoonFill className="w-5 h-5 animate-[spin_0.75s]" />
        </button>
      ) : (
        <button
          data-set-theme="darkTheme"
          data-act-class="ACTIVECLASS"
          onClick={() => setDarkMode(true)}
        >
          <BsSun className="w-6 h-6 animate-[spin_0.75s]" />
        </button>
      )}
    </div>
  );
};
export default DarkModeToggle;
