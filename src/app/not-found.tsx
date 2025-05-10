"use client";
import { useEffect, useState } from "react";

const NotFound = () => {
  const [firstDigit, setFirstDigit] = useState<number | string>("");
  const [secondDigit, setSecondDigit] = useState<number | string>("");
  const [thirdDigit, setThirdDigit] = useState<number | string>("");

  const randomNum = () => Math.floor(Math.random() * 9) + 1;

  useEffect(() => {
    const time = 30;
    let i = 0;

    const loop3: ReturnType<typeof setInterval> = setInterval(function () {
      if (i > 40) {
        clearInterval(loop3);
        setThirdDigit(4);
      } else {
        setThirdDigit(randomNum());
        i++;
      }
    }, time);
    const loop2: ReturnType<typeof setInterval> = setInterval(function () {
      if (i > 80) {
        clearInterval(loop2);
        setSecondDigit(0);
      } else {
        setSecondDigit(randomNum());
        i++;
      }
    }, time);
    const loop1: ReturnType<typeof setInterval> = setInterval(function () {
      if (i > 100) {
        clearInterval(loop1);
        setFirstDigit(4);
      } else {
        setFirstDigit(randomNum());
        i++;
      }
    }, time);
  }, []);

  return (
    <div className="error">
      <div className="h-screen flex flex-col justify-center items-center">
        <div className="text-center">
          <div className={"container_error_404"}>
            <div className={"clip"}>
              <div className={"shadow"}>
                <span className="digit">{firstDigit}</span>
              </div>
            </div>
            <div className={"clip"}>
              <div className={"shadow"}>
                <span className="digit">{secondDigit}</span>
              </div>
            </div>
            <div className={"clip"}>
              <div className={"shadow"}>
                <span className="digit">{thirdDigit}</span>
              </div>
            </div>
          </div>
          <h2>صفحه مورد نظر یافت نشد!</h2>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
