"use client";
import AttributeCard from "@/components/AttributeCard";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@base-ui/react";
import { Eye, EyeOff } from "lucide-react";
import { redirect, useRouter } from "next/navigation";
import React, { useState } from "react";

const AdminLogin = () => {
  const supabase = createClient();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

  async function handleLogin(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setError("Invalid email or password");
      return;
    }

    router.replace("/admin/monster");
    router.refresh();
  }
  return (
    <div className="flex flex-col flex-1 items-center justify-center h-screen relative">
      <main className="flex max-h-[90vh] min-h-0 flex-1 w-full flex-col justify-center items-center gap-3 md:gap-4 md:px-2">
        <form
          onSubmit={handleLogin}
          className="bg-panel-background w-[90%] h-3/5 border-black border-1 border-solid py-4 px-2 flex flex-col justify-center items-center gap-3 md:w-3/5 md:min-h-[300px]"
        >
          <div className="bg-panel-background2 border-1 border-black px-4 py-2 rounded-[7px] mb-7">
            <h1 className="md:text-[24px]">Admin Login</h1>
          </div>
          <div className="flex flex-col justify-center items-end gap-4">
            <AttributeCard
              label={"email"}
              labelClass="text-xs md:text-[18px]"
              valueDivClass="1/2"
              value={
                <input
                  type="text"
                  className="border-black border-1 w-full font-['Arial',sans-serif] py-3 px-2 rounded-[5px]"
                  name="email"
                  onChange={(e) => setEmail(e.target.value)}
                  required
                ></input>
              }
            ></AttributeCard>
            <AttributeCard
              label={"password"}
              labelClass="text-xs md:text-[18px]"
              valueDivClass="1/2"
              value={
                <div className="w-full relative flex justify-center items-center">
                  {" "}
                  <input
                    type={showPassword ? "text" : "password"}
                    className="border-black border-1 w-full font-['Arial',sans-serif] py-3 px-2 rounded-[5px]"
                    name="password"
                    onChange={(e) => setPassword(e.target.value)}
                    autoComplete="current-password"
                    required
                  ></input>
                  {showPassword ? (
                    <Eye
                      className="absolute right-[2%]"
                      onClick={() => setShowPassword(!showPassword)}
                    />
                  ) : (
                    <EyeOff
                      className="absolute right-[2%]"
                      onClick={() => setShowPassword(!showPassword)}
                    />
                  )}
                </div>
              }
            ></AttributeCard>
          </div>
          <span className="text-red-700 font-['Arial',sans-serif]">
            {error}
          </span>
          <Button
            type="submit"
            className={
              "bg-panel-background2 border-1 border-black px-4 px-2 text-[21px] cursor-pointer rounded-[5px] hover:bg-blue-200 hover:text-blue-300 active:scale-105"
            }
          >
            Login
          </Button>
        </form>
      </main>
    </div>
  );
};

export default AdminLogin;
