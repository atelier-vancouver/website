import { useCallback, useState } from "react";
import { StringParam, useQueryParam, withDefault } from "use-query-params";

export function QotdGenerator({
  onQuestionSelect,
}: {
  onQuestionSelect: (question: string) => void;
}) {
  const [qotdLocation, setQotdLocation] = useQueryParam(
    "qotdLocation",
    withDefault(StringParam, "Vancouver, BC, Canada")
  );
  const [state, setState] = useState<"loading" | "error" | "ready">("ready");
  const [questions, setQuestions] = useState<string[]>([]);
  const getQuestions = useCallback(async () => {
    setState("loading");
    try {
      const response = await fetch("https://qotd-generator.atelier.ac", {
        method: "POST",
        body: JSON.stringify({
          location: qotdLocation,
          date: new Intl.DateTimeFormat("en-US", { dateStyle: "full" }).format(
            new Date()
          ),
        }),
        headers: { "Content-Type": "application/json" },
      });
      if (!response.ok) {
        console.error("Error fetching questions:", response.statusText);
        throw new Error("Network response was not ok");
      }
      const data = await response.json();
      const questions = data.questions;
      if (!Array.isArray(questions)) {
        console.error("Invalid response format:", data);
        throw new Error("Invalid response format");
      }
      setQuestions(questions);
      setState("ready");
    } catch (error) {
      console.error("Error fetching questions:", error);
      setState("error");
    }
  }, [qotdLocation, onQuestionSelect]);

  return (
    <div className="gaps">
      <div>
        location:
        <input
          type="text"
          value={qotdLocation}
          onChange={(e) => setQotdLocation(e.target.value)}
        />
      </div>
      <div>
        <button disabled={state === "loading"} onClick={getQuestions}>
          generate
        </button>
        {state === "loading" && <span>Loading...</span>}
        {state === "error" && <span>Error fetching questions</span>}
      </div>
      <div>
        {questions.map((question, index) => (
          <div key={index} className="qotd-question">
            <button
              onClick={() => {
                onQuestionSelect(question);
              }}
            >
              use this one
            </button>
            <span>{question}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
