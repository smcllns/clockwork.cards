import HeroCyberpunk from "../components/hero/cyberpunk";
import type { SectionProps } from "./types";

type Props = SectionProps;

// The hero renders name + birthday text in the 3D scene.
// dob drives the age shown — pass a different date here to override what's displayed.
export function HeroSection({ name, dob, shiny }: Props) {
  return <HeroCyberpunk name={name} dob={dob} shiny={shiny} />;
}
