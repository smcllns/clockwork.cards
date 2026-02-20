import { preload } from "./preload";
import { createRoot } from "react-dom/client";
import { Card } from "./card";

const params = new URLSearchParams(window.location.search);
const rawName = params.get("name") ?? process.env.DEFAULT_NAME!;
const name = rawName.charAt(0).toUpperCase() + rawName.slice(1);
const dobStr = params.get("dob") ?? process.env.DEFAULT_DOB;
const [dobY, dobM, dobD] = dobStr!.split("-").map(Number);
const dob = new Date(dobY, dobM - 1, dobD); // local midnight, not UTC
const pronouns = (params.get("pronouns") ?? process.env.DEFAULT_SEX ?? "m") as "m" | "f";

const root = createRoot(document.getElementById("root")!);
preload().then(() => root.render(<Card name={name} dob={dob} pronouns={pronouns} />));

if (import.meta.hot) {
  import.meta.hot.accept();
}
