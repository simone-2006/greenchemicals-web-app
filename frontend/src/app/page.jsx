"use client";

import { useEffect, useState } from "react";
import { Calendar, Clock, House } from "lucide-react";
import Title from "@/components/layout/Title";

import Button from "@/components/ui/Button";

import Link from "next/link";


import { formatGGMMAAAA } from "@/hooks/function";
import { formatHHMMSS } from "@/hooks/function";

function CardHome({ children, ...props }) {
  return (
    <div
      className="bg-background-element rounded-md p-4 border border-border m-2"
      {...props}
    >
      {children}
    </div>
  );
}

function HomeClock() {
  const [now, setNow] = useState(null);

  useEffect(() => {
    function tick() {
      setNow(new Date());
    }

    tick();
    const timer = setInterval(tick, 1000);
    return () => clearInterval(timer);
  }, []);

  const dateLabel = now
    ? formatGGMMAAAA(now)
    : "--/--/----";
  const timeLabel = now
    ? formatHHMMSS(now)
    : "--:--:--";

  return (
    <div className="flex items-center gap-3 text-text text-lg">
      <div className="flex items-center gap-1">
        <Calendar size={16} aria-hidden="true" />
        <p className="font-semibold tabular-nums">{dateLabel}</p>
      </div>
      <div className="flex items-center gap-1">
        <Clock size={16} aria-hidden="true" />
        <p className="font-semibold tabular-nums">{timeLabel}</p>
      </div>
      <div className="bg-success w-2 h-2 rounded-full animate-pulse hidden sm:block" />
    </div>
  );
}

export default function Page() {
  const quickActions = [
    {
      title: "Reminders",
      to: "/reminders",
    },
    {
      title: "Customers",
      to: "/customer",
    },
    {
      title: "Reminders",
      to: "/reminders",
    },
    {
      title: "Reminders",
      to: "/reminders",
    },
  ]
  return (
    <div>
      <Title icon={<House size={20} />} subtitle="Greenchemicals web">Home</Title>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 pt-2 gap-4">

        <CardHome>
          <img src="/logo/GC_logo.jpg" alt="Logo Greenchemicals" />
        </CardHome>
        <CardHome>
          <div className="flex flex-col justify-between h-full">
            <h2 className="text-2xl font-bold">
              Welcome, <span>App!</span>
            </h2>
            <p className="text-text-secondary">Welcome to Greenchemicals WEB</p>
            <HomeClock />
          </div>
        </CardHome>
        <CardHome>
          <h2 className="text-2xl font-bold mb-2">
            Quick actions
          </h2>
          <div className="flex items-center gap-2 flex-wrap">
            {
              quickActions.map((action, idx) => (
                <Link key={idx} href={action.to}>
                  <Button variant="primary">
                    {action.title}
                  </Button>
                </Link>
              ))
            }

          </div>
        </CardHome>
      </div>

      <Button variant="default">BOTTONE</Button>
      <Button variant="ghost">BOTTONE</Button>
      <Button variant="primary">BOTTONE</Button>
      <Button variant="success">BOTTONE</Button>
      <Button variant="danger">BOTTONE</Button>
      <Button variant="warning">BOTTONE</Button>
    </div>
  );
}
