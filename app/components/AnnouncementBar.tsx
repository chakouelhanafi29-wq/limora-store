"use client";

import { useEffect, useState } from "react";

type Props = {
  announcements: string[];
};

export default function AnnouncementBar({ announcements }: Props) {
  const [index, setIndex] = useState(0);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    if (announcements.length <= 1) return;

    const interval = setInterval(() => {
      setVisible(false);
      setTimeout(() => {
        setIndex((prev) => (prev + 1) % announcements.length);
        setVisible(true);
      }, 400);
    }, 4500);

    return () => clearInterval(interval);
  }, [announcements.length]);

  if (!announcements.length) return null;

  return (
    <div className="relative overflow-hidden bg-[#3d2e2a] py-3 text-center text-sm text-ivory">
      <div className="absolute inset-0 gold-shimmer animate-shimmer opacity-15" />
      <div className="relative z-10 mx-auto flex h-5 max-w-4xl items-center justify-center px-4">
        <p
          className={`announcement-fade font-medium tracking-wide ${
            visible ? "translate-y-0 opacity-100" : "-translate-y-2 opacity-0"
          }`}
        >
          <span className="ml-2 text-champagne">✦</span>
          {announcements[index]}
          <span className="mr-2 text-champagne">✦</span>
        </p>
      </div>
    </div>
  );
}
