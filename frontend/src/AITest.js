import React, { useEffect } from "react";
import { testAIConnection } from "./utils";

export default function AITest() {
  useEffect(() => {
    async function check() {
      const reply = await testAIConnection();
      alert("AI says: " + reply);
    }
    check();
  }, []);

  return <div>Checking AI connection...</div>;
}
