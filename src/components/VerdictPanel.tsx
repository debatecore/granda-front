"use client";

import React, { useEffect, useState } from "react";
import { fetchClientSide } from "@/lib/utils";

type Props = {
  userId: string;
  tournamentId: string;
  debateId: string;
};

type Verdict = {
  id?: string;
  judgeId?: string;
  side: string; // "Proposition" | "Opposition" (backend may vary)
};

export default function VerdictPanel({ userId, tournamentId, debateId }: Props) {
  const [isJudge, setIsJudge] = useState<boolean | null>(null);
  const [verdicts, setVerdicts] = useState<Verdict[]>([]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [selectedSide, setSelectedSide] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!userId || !tournamentId || !debateId) return;
    setLoading(true);
    setError(null);

    const fetchData = async () => {
      try {
        // permission check
        const permRes = await fetchClientSide(
          `/user/${userId}/tournaments/${tournamentId}/permissions?permission_name=SubmitOwnVerdictVote"`,
        );
        let judge = false;
        if (permRes.ok) {
          try {
            const body = await permRes.json();
            if (typeof body === "boolean") judge = body;
            else if (body && typeof body === "object") {
              judge = !!(body.granted ?? body.permission ?? body.allowed ?? Object.values(body)[0]);
            }
          } catch (e) {
            // if no json, leave as false
          }
        }
        setIsJudge(judge);

        // verdicts
        const vRes = await fetchClientSide(
          `/tournament/${tournamentId}/debate/${debateId}/verdicts"`,
        );
        if (vRes.ok) {
          const j = await vRes.json();
          if (Array.isArray(j)) setVerdicts(j as Verdict[]);
          else setVerdicts([]);
        } else {
          setVerdicts([]);
        }
      } catch (e: any) {
        setError(String(e?.message ?? e));
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [userId, tournamentId, debateId]);

  const refreshVerdicts = async () => {
    try {
      const vRes = await fetchClientSide(
        `/tournament/${tournamentId}/debate/${debateId}/verdicts"`,
      );
      if (vRes.ok) {
        const j = await vRes.json();
        if (Array.isArray(j)) setVerdicts(j as Verdict[]);
      }
    } catch (e) {
      // ignore
    }
  };

  const submitVote = async () => {
    if (!selectedSide) return;
    setSubmitting(true);
    setError(null);
    try {
      const res = await fetchClientSide(
        `/tournament/${tournamentId}/debate/${debateId}/verdicts"`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ side: selectedSide }),
        },
      );
      if (!res.ok) {
        const txt = await res.text();
        setError(txt || "Failed to submit vote");
      } else {
        setSelectedSide(null);
        await refreshVerdicts();
      }
    } catch (e: any) {
      setError(String(e?.message ?? e));
    } finally {
      setSubmitting(false);
    }
  };

  // compute majority
  const counts = verdicts.reduce(
    (acc, v) => {
      const side = (v.side || "").toLowerCase();
      if (side.includes("prop") || side === "proposition") acc.proposition++;
      else acc.opposition++;
      return acc;
    },
    { proposition: 0, opposition: 0 },
  );
  const total = counts.proposition + counts.opposition;
  let majority: string | null = null;
  if (total === 0) majority = null;
  else if (counts.proposition > counts.opposition) majority = "Proposition";
  else if (counts.opposition > counts.proposition) majority = "Opposition";
  else majority = "Tie";

  return (
    <div className="w-[594px] h-[347px] pb-2.5 bg-[#141414] rounded outline outline-[0.50px] outline-offset-[-0.50px] outline-white/80 inline-flex flex-col justify-end items-center overflow-hidden">
      <div className="w-[580px] h-14 py-3 inline-flex justify-between items-center overflow-hidden">
        <div className="w-[30px] h-[30px] relative overflow-hidden">
          <div className="w-[2.50px] h-[2.50px] left-[13.75px] top-[13.75px] absolute outline outline-2 outline-offset-[-1px] outline-white/25" />
          <div className="w-[2.50px] h-[2.50px] left-[22.50px] top-[13.75px] absolute outline outline-2 outline-offset-[-1px] outline-white/25" />
          <div className="w-[2.50px] h-[2.50px] left-[5px] top-[13.75px] absolute outline outline-2 outline-offset-[-1px] outline-white/25" />
        </div>
        <div className="w-[305px] text-right justify-start text-white/75 text-xl font-medium">Verdict</div>
      </div>
      <div className="w-[580px] h-[281px] p-5 bg-[#202020] rounded shadow-[0px_4px_4px_0px_rgba(0,0,0,0.25)] outline outline-[0.50px] outline-offset-[-0.50px] outline-[#565656]/80 flex flex-col justify-center items-center gap-5">
        <div className="w-[560px] h-[54px] bg-[#202020]/0 rounded outline outline-[0.50px] outline-offset-[-0.50px] outline-[#8a8a8a]/0 inline-flex justify-center items-center gap-5 overflow-hidden">
          <div
            className={`w-[270px] h-[54px] py-5 rounded outline outline-[0.50px] outline-offset-[-0.50px] outline-[#979797]/80 flex justify-center items-center gap-2.5 ${
              selectedSide === "Proposition" || (!isJudge && majority === "Proposition")
                ? "bg-[#2c2c2c]"
                : "bg-[#2c2c2c] opacity-50"
            }`}
            onClick={() => isJudge && setSelectedSide("Proposition")}
            role={isJudge ? "button" : undefined}
          >
            <div className="opacity-75 text-center justify-center text-white/75 text-xl font-semibold">Proposition</div>
          </div>
          <div
            className={`w-[270px] h-[54px] py-5 rounded outline outline-[0.50px] outline-offset-[-0.50px] outline-[#979797]/80 flex justify-center items-center gap-2.5 ${
              selectedSide === "Opposition" || (!isJudge && majority === "Opposition")
                ? "bg-[#2c2c2c]"
                : "bg-[#2c2c2c] opacity-50"
            }`}
            onClick={() => isJudge && setSelectedSide("Opposition")}
            role={isJudge ? "button" : undefined}
          >
            <div className="opacity-75 text-center justify-center text-white/75 text-xl font-semibold">Opposition</div>
          </div>
        </div>

        <div
          className={`w-[560px] h-[54px] px-[262px] py-[17px] bg-[#2c2c2c] rounded outline outline-[0.50px] outline-offset-[-0.50px] outline-[#979797]/80 inline-flex justify-center items-center gap-2.5 overflow-hidden cursor-pointer ${
            !isJudge ? "opacity-50 cursor-default" : ""
          }`}
          onClick={() => {
            if (isJudge) submitVote();
          }}
        >
          <div className="w-[69px] h-3.5 opacity-75 text-center justify-center text-white/75 text-xl font-semibold">{submitting ? "Submitting" : "Submit"}</div>
        </div>

        <div className="w-[559px] h-[93px] px-[5px] rounded outline outline-[0.50px] outline-offset-[-0.50px] outline-[#8a8a8a]/40 flex flex-col justify-center items-center gap-2.5 overflow-hidden">
          <div className="w-[540px] h-[92px] opacity-50 text-center justify-center">
            {loading ? (
              <span className="text-white/75 text-lg font-medium leading-[26px]">Loading…</span>
            ) : total === 0 ? (
              <span className="text-white/75 text-lg font-medium leading-[26px]">
                There is <span className="font-bold">no verdict</span> yet.
              </span>
            ) : majority === "Tie" ? (
              <span className="text-white/75 text-lg font-medium leading-[26px]">There is a tie ({counts.proposition}–{counts.opposition}).</span>
            ) : (
              <span className="text-white/75 text-lg font-medium leading-[26px]">
                Majority: <span className="font-bold">{majority}</span> ({counts.proposition}–{counts.opposition})
              </span>
            )}
            {error && <div className="text-red-400 mt-2">{error}</div>}
          </div>
        </div>
      </div>
    </div>
  );
}
