"use client";
import Login from "@/components/login/login";
import { FileSpreadsheet } from "lucide-react";

const LoginPage = () => {
  return (
    <div className="w-screen h-screen flex justify-center items-center">
      <div className="w-full sm:w-1/2 flex justify-center items-center">
        <Login />
      </div>
      <div className="bg-neutral-950 w-1/2 h-full justify-center items-center invisible sm:visible hidden sm:flex">
        <FileSpreadsheet color="white" className="w-2/5 h-2/5" />
      </div>
    </div>
  );
};

export default LoginPage;
