"use client";

import { fetchClientSide } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { useState } from "react";

const LocalLogIn = () => {
  const MSG_HANDLE_EMPTY = "Handle must not be empty.";
  const MSG_PASSW_EMPTY = "Password must not be empty.";
  const MSG_PLACEHOLDER = "--";

  const router = useRouter();
  const [handle, setHandle] = useState<string>("");
  const [passw, setPassw] = useState<string>("");
  const [msg, setMsg] = useState<string>(MSG_PLACEHOLDER);

  const isHandleEmpty = handle.length === 0;
  const isPasswEmpty = passw.length === 0;

  const loginrequest = async () => {
    if (isHandleEmpty) {
      setMsg(MSG_HANDLE_EMPTY);
      return;
    }
    if (isPasswEmpty) {
      setMsg(MSG_PASSW_EMPTY);
      return;
    }

    const res = await fetchClientSide("/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        login: handle,
        password: passw,
      }),
    });
    if (res.ok) {
      // setMsg("Logged in succesfully!");
      router.push("/tournaments");
    } else {
      const msg = await res.text();
      setMsg(msg);
    }
  };

  return (
    <>
      <div className="flex flex-col mt-16 mb-10">
        <p>{"Handle"}</p>
        <div className="relative">
          <input
            id="handleinput"
            type="text"
            aria-label="Your handle (username)"
            className="bg-stone-950/65 px-[22px] p-1 rounded border border-stone-700 hover:border-stone-500 focus:border-stone-500"
            placeholder="your_handle"
            value={handle}
            onChange={(e) => {
              setHandle(e.target.value);
            }}
          />
          <p
            className={`absolute top-[5px] left-2 ${isHandleEmpty && "text-stone-400"}`}
          >
            {"@"}
          </p>
        </div>
        <p className="mt-2">{"Password"}</p>
        <input
          id="passwordinput"
          type="password"
          aria-label="Your password"
          placeholder="your_password"
          className="bg-stone-950/65 px-2 p-1 rounded border border-stone-700 hover:border-stone-500 focus:border-stone-500"
          value={passw}
          onKeyUp={(e) => {
            if (e.key === "Enter") loginrequest();
          }}
          onChange={(e) => {
            setPassw(e.target.value);
          }}
        />
        <p
          className={`mt-8 ${msg == MSG_PLACEHOLDER && "text-transparent select-none"}`}
        >
          {msg}
        </p>
        <button
          className="mt-1 cursor-pointer bg-stone-700/45 p-1 rounded border border-stone-700 hover:border-stone-500 focus:border-stone-500"
          onClick={() => {
            loginrequest();
          }}
        >
          {"Log in"}
        </button>
      </div>
    </>
  );
};

export { LocalLogIn };
