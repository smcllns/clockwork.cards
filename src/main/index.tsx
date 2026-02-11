import { useState, useEffect } from "react";
import Card from "./Card";

const EARTH_ORBITAL_MPH = 66_616;
const EARTH_ORBITAL_KPH = 107_218;
const AVG_CHILD_BPM = 80;

function msAlive(dob: string) {
  return Date.now() - new Date(dob).getTime();
}

function AgeCard({ dob }: { dob: string }) {
  const [unit, setUnit] = useState<"years" | "months" | "days" | "hours" | "minutes" | "seconds">("years");
  const [now, setNow] = useState(Date.now());

  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, []);

  const ms = now - new Date(dob).getTime();
  const seconds = Math.floor(ms / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  const months = Math.floor(days / 30.44);
  const years = Math.floor(days / 365.25);

  const values = { years, months, days, hours, minutes, seconds };
  const labels = { years: "years", months: "months", days: "days", hours: "hours", minutes: "minutes", seconds: "seconds" };

  return (
    <Card
      front={
        <div className="text-center">
          <p className="text-4xl font-bold mb-1" style={{ fontFamily: "var(--font-stat)" }} data-stat>{values[unit].toLocaleString()}</p>
          <p className="text-sm mb-4" style={{ color: "var(--text-secondary)" }}>
            {labels[unit]} old today
          </p>
          <div className="flex flex-wrap gap-1 justify-center">
            {(Object.keys(labels) as (keyof typeof labels)[]).map((u) => (
              <button
                key={u}
                onClick={(e) => { e.stopPropagation(); setUnit(u); }}
                className="px-2 py-0.5 text-xs rounded-full border cursor-pointer"
                style={{
                  borderColor: u === unit ? "var(--text-accent)" : "var(--border-color)",
                  color: u === unit ? "var(--text-accent)" : "var(--text-secondary)",
                  background: "transparent",
                }}
              >
                {u}
              </button>
            ))}
          </div>
        </div>
      }
      back={
        <div>
          <p className="font-semibold mb-2" style={{ color: "var(--text-primary)" }}>The Math</p>
          <p>Born: {new Date(dob).toLocaleDateString()}</p>
          <p>Now: {new Date(now).toLocaleDateString()}</p>
          <p className="mt-2">
            {days.toLocaleString()} days × 24 = {hours.toLocaleString()} hours
          </p>
          <p>{hours.toLocaleString()} hours × 60 = {minutes.toLocaleString()} min</p>
          <p>{minutes.toLocaleString()} min × 60 = {seconds.toLocaleString()} sec</p>
          <p className="mt-2 text-xs" style={{ color: "var(--text-secondary)" }}>tap to flip back</p>
        </div>
      }
    />
  );
}

function SunCard({ dob }: { dob: string }) {
  const [unit, setUnit] = useState<"miles" | "km">("miles");

  const hoursAlive = msAlive(dob) / (1000 * 60 * 60);
  const miles = hoursAlive * EARTH_ORBITAL_MPH;
  const km = hoursAlive * EARTH_ORBITAL_KPH;
  const value = unit === "miles" ? miles : km;
  const display = value > 1_000_000_000
    ? `${(value / 1_000_000_000).toFixed(1)} billion`
    : `${(value / 1_000_000).toFixed(0)} million`;

  return (
    <Card
      front={
        <div className="text-center">
          <p className="text-4xl font-bold mb-1" style={{ fontFamily: "var(--font-stat)" }} data-stat>{display}</p>
          <p className="text-sm mb-4" style={{ color: "var(--text-secondary)" }}>
            {unit} around the sun
          </p>
          <div className="flex gap-1 justify-center">
            {(["miles", "km"] as const).map((u) => (
              <button
                key={u}
                onClick={(e) => { e.stopPropagation(); setUnit(u); }}
                className="px-2 py-0.5 text-xs rounded-full border cursor-pointer"
                style={{
                  borderColor: u === unit ? "var(--text-accent)" : "var(--border-color)",
                  color: u === unit ? "var(--text-accent)" : "var(--text-secondary)",
                  background: "transparent",
                }}
              >
                {u}
              </button>
            ))}
          </div>
        </div>
      }
      back={
        <div>
          <p className="font-semibold mb-2" style={{ color: "var(--text-primary)" }}>The Math</p>
          <p>Earth orbits at {EARTH_ORBITAL_MPH.toLocaleString()} mph</p>
          <p>You've been alive {Math.floor(hoursAlive).toLocaleString()} hours</p>
          <p className="mt-2">
            {EARTH_ORBITAL_MPH.toLocaleString()} × {Math.floor(hoursAlive).toLocaleString()} =
          </p>
          <p className="font-semibold">{Math.floor(miles).toLocaleString()} miles</p>
          <p className="mt-2 text-xs" style={{ color: "var(--text-secondary)" }}>tap to flip back</p>
        </div>
      }
    />
  );
}

function HeartCard({ dob }: { dob: string }) {
  const [unit, setUnit] = useState<"total" | "perDay" | "millions">("total");

  const minutesAlive = msAlive(dob) / (1000 * 60);
  const totalBeats = minutesAlive * AVG_CHILD_BPM;
  const perDay = AVG_CHILD_BPM * 60 * 24;

  const values = {
    total: { value: Math.floor(totalBeats).toLocaleString(), label: "heartbeats" },
    perDay: { value: perDay.toLocaleString(), label: "beats per day" },
    millions: { value: `${(totalBeats / 1_000_000).toFixed(1)} million`, label: "heartbeats" },
  };

  return (
    <Card
      front={
        <div className="text-center">
          <p className="text-4xl font-bold mb-1" style={{ fontFamily: "var(--font-stat)" }} data-stat>{values[unit].value}</p>
          <p className="text-sm mb-4" style={{ color: "var(--text-secondary)" }}>
            {values[unit].label}
          </p>
          <div className="flex gap-1 justify-center">
            {(["total", "perDay", "millions"] as const).map((u) => (
              <button
                key={u}
                onClick={(e) => { e.stopPropagation(); setUnit(u); }}
                className="px-2 py-0.5 text-xs rounded-full border cursor-pointer"
                style={{
                  borderColor: u === unit ? "var(--text-accent)" : "var(--border-color)",
                  color: u === unit ? "var(--text-accent)" : "var(--text-secondary)",
                  background: "transparent",
                }}
              >
                {u === "perDay" ? "per day" : u}
              </button>
            ))}
          </div>
        </div>
      }
      back={
        <div>
          <p className="font-semibold mb-2" style={{ color: "var(--text-primary)" }}>The Math</p>
          <p>Average heart rate: {AVG_CHILD_BPM} BPM</p>
          <p>Minutes alive: {Math.floor(minutesAlive).toLocaleString()}</p>
          <p className="mt-2">
            {AVG_CHILD_BPM} × {Math.floor(minutesAlive).toLocaleString()} =
          </p>
          <p className="font-semibold">{Math.floor(totalBeats).toLocaleString()} beats</p>
          <p className="mt-1">That's {perDay.toLocaleString()} per day!</p>
          <p className="mt-2 text-xs" style={{ color: "var(--text-secondary)" }}>tap to flip back</p>
        </div>
      }
    />
  );
}

export default function Main({ name, dob }: { name: string; dob: string }) {
  return (
    <section className="flex-1 flex items-center justify-center p-6" style={{ background: "var(--bg-primary)" }}>
      <div className="w-full grid grid-cols-1 sm:grid-cols-3 gap-4">
        <AgeCard dob={dob} />
        <SunCard dob={dob} />
        <HeartCard dob={dob} />
      </div>
    </section>
  );
}
