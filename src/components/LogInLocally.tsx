"use client";

import { fetchClientSide } from "@/lib/utils";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { useState } from "react";

const LocalLogIn = () => {
  const t = useTranslations("login");
  const MSG_HANDLE_EMPTY = t("msg_handle_empty");
  const MSG_PASSW_EMPTY = t("msg_passwd_empty");
  const MSG_PLACEHOLDER = "--";
  const UNAUTHORIZED = 401;

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
      router.push("/tournaments");
    } else if (res.status == UNAUTHORIZED) {
      setMsg(t("msg_invalid_credentials"));
    } else {
      const msg = await res.text();
      setMsg(msg);
    }
  };

  return (
    <>
      <div className="flex flex-col mt-16 mb-10">
        <p>{t("handle_label")}</p>
        <div className="relative">
          <input
            id="handleinput"
            type="text"
            aria-label={t("handle_aria_label")}
            className="bg-stone-950/65 px-[22px] p-1 rounded border border-stone-700 hover:border-stone-500 focus:border-stone-500"
            placeholder={t("handle_placeholder")}
            value={handle}
            onChange={(e) => {
              setHandle(e.target.value);
            }}
          />
          <p
            className={`absolute top-[5px] left-2 ${
              isHandleEmpty && "text-stone-400"
            }`}
          >
            {"@"}
          </p>
        </div>
        <p className="mt-2">{t("password_label")}</p>
        <input
          id="passwordinput"
          type="password"
          aria-label={t("password_aria_label")}
          placeholder={t("password_placeholder")}
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
          className={`mt-8 ${
            msg == MSG_PLACEHOLDER && "text-transparent select-none"
          }`}
        >
          {msg}
        </p>
        <button
          className="mt-1 cursor-pointer bg-stone-700/45 p-1 rounded border border-stone-700 hover:border-stone-500 focus:border-stone-500"
          onClick={() => {
            loginrequest();
          }}
        >
          {t("log_in")}
        </button>
      </div>
    </>
  );
};

export { LocalLogIn };
