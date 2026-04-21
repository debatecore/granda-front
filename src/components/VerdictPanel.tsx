"use client";

import React, { useEffect, useMemo, useState } from "react";

type VerdictValue = "proposition" | "opposition";

interface VerdictRecord {
  id: string;
  user_id: string;
  verdict: VerdictValue;
}

interface VerdictPanelProps {
  userId: string;
  tournamentId: string;
  debateId: string;
}

const VerdictPanel: React.FC<VerdictPanelProps> = ({
  userId,
  tournamentId,
  debateId,
}) => {
  const [isJudge, setIsJudge] = useState<boolean | null>(null);
  const [verdicts, setVerdicts] = useState<VerdictRecord[]>([]);
  const [selectedVote, setSelectedVote] = useState<VerdictValue | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const currentUserVerdict = useMemo(
    () => verdicts.find((verdict) => verdict.user_id === userId) ?? null,
    [verdicts, userId],
  );

  const majorityVerdict = useMemo(() => {
    const counts = verdicts.reduce(
      (acc, verdict) => {
        if (verdict.verdict === "proposition") acc.proposition += 1;
        if (verdict.verdict === "opposition") acc.opposition += 1;
        return acc;
      },
      { proposition: 0, opposition: 0 },
    );

    if (counts.proposition === 0 && counts.opposition === 0) {
      return null;
    }

    if (counts.proposition > counts.opposition) return "Proposition";
    if (counts.opposition > counts.proposition) return "Opposition";
    return "Tie";
  }, [verdicts]);

  useEffect(() => {
    setLoading(true);
    setError(null);

    const permissionUrl = `/user/${userId}/tournaments/${tournamentId}/permissions?permission_name=SubmitOwnVerdictVote`;
    const verdictsUrl = `/tournament/${tournamentId}/debate/${debateId}/verdicts`;

    Promise.all([
      fetch(permissionUrl).then((res) => {
        if (!res.ok) throw new Error("Failed to load permissions");
        return res.json();
      }),
      fetch(verdictsUrl).then((res) => {
        if (!res.ok) throw new Error("Failed to load verdicts");
        return res.json();
      }),
    ])
      .then(([permissionData, verdictsData]) => {
        setIsJudge(Boolean(permissionData));
        const loadedVerdicts: VerdictRecord[] = Array.isArray(verdictsData)
          ? verdictsData
          : [];
        setVerdicts(loadedVerdicts);

        const existing = loadedVerdicts.find((v) => v.user_id === userId);
        if (existing) {
          setSelectedVote(existing.verdict);
        } else {
          setSelectedVote(null);
        }
      })
      .catch((fetchError) => {
        setError(
          fetchError instanceof Error
            ? fetchError.message
            : "Unable to load verdict information",
        );
      })
      .finally(() => {
        setLoading(false);
      });
  }, [userId, tournamentId, debateId]);

  const handleSubmit = async () => {
    if (!selectedVote) {
      setError("Please select a verdict before submitting.");
      return;
    }

    setSubmitting(true);
    setError(null);

    try {
      if (currentUserVerdict) {
        const patchUrl = `/tournament/${tournamentId}/debate/${debateId}/verdicts/${currentUserVerdict.id}`;
        const response = await fetch(patchUrl, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ verdict: selectedVote }),
        });
        if (!response.ok) throw new Error("Failed to update verdict");
        const updatedVerdict: VerdictRecord = await response.json();
        setVerdicts((prev) =>
          prev.map((verdict) =>
            verdict.id === updatedVerdict.id ? updatedVerdict : verdict,
          ),
        );
      } else {
        const postUrl = `/tournament/${tournamentId}/debate/${debateId}/verdicts`;
        const response = await fetch(postUrl, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ verdict: selectedVote }),
        });
        if (!response.ok) throw new Error("Failed to submit verdict");
        const newVerdict: VerdictRecord = await response.json();
        setVerdicts((prev) => [...prev, newVerdict]);
      }
    } catch (submitError) {
      setError(
        submitError instanceof Error
          ? submitError.message
          : "Unable to submit verdict",
      );
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <section>
        <h2>Verdict</h2>
        <p>Loading verdict information…</p>
      </section>
    );
  }

  if (error) {
    return (
      <section>
        <h2>Verdict</h2>
        <p role="alert">{error}</p>
      </section>
    );
  }

  return (
    <section>
      <h2>Verdict</h2>

      <div>
        <strong>Current decision:</strong>{" "}
        {majorityVerdict
          ? majorityVerdict
          : "No verdict has been recorded yet."}
      </div>

      {isJudge ? (
        <div>
          <div>
            <button
              type="button"
              onClick={() => setSelectedVote("proposition")}
              aria-pressed={selectedVote === "proposition"}
            >
              Proposition
            </button>
            <button
              type="button"
              onClick={() => setSelectedVote("opposition")}
              aria-pressed={selectedVote === "opposition"}
            >
              Opposition
            </button>
          </div>

          <div>
            <button
              type="button"
              onClick={handleSubmit}
              disabled={submitting || !selectedVote}
            >
              {currentUserVerdict ? "Update Verdict" : "Submit Verdict"}
            </button>
          </div>

          {currentUserVerdict ? (
            <p>
              Your current vote:{" "}
              {currentUserVerdict.verdict === "proposition"
                ? "Proposition"
                : "Opposition"}
            </p>
          ) : (
            <p>You have not submitted a verdict yet.</p>
          )}
        </div>
      ) : (
        <div>
          <p>You are viewing the verdict as a user.</p>
          <p>Total verdicts: {verdicts.length}</p>
        </div>
      )}
    </section>
  );
};

export default VerdictPanel;
