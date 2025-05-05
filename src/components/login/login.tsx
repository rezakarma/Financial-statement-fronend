"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/card";
import LoginForm from "./loginForm";

const Login = () => {
  return (
    <Card className="w-4/5 sm:w-2/3 lg:w-[500px]">
      <CardHeader>
        <CardTitle>ورود به سامانه</CardTitle>
        <CardDescription>
          برای ورود به سیستم اطالاعت خود را وارد کنید.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <LoginForm />
      </CardContent>
      <CardFooter></CardFooter>
    </Card>
  );
};

export default Login;
