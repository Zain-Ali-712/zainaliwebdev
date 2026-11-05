"use client";

import { useEffect, useState } from "react";

export function LahoreClock({ seconds = false }: { seconds?: boolean }) {
  const [now, setNow] = useState<string>("--:--");
  useEffect(() => {
    const fmt = new Intl.DateTimeFormat("en-GB", {
      timeZone: "Asia/Karachi",
      hour: "2-digit",
      minute: "2-digit",
      ...(seconds ? { second: "2-digit" } : {}),
    });
    const tick = () => setNow(fmt.format(new Date()));
    tick();
    const id = window.setInterval(tick, 1000);
    return () => window.clearInterval(id);
  }, [seconds]);
  return <span className="tabular">{now} PKT</span>;
}
