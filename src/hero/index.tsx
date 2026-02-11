import ApproachC from "./approach-c";
import ApproachD from "./approach-d";

const approaches = { c: ApproachC, d: ApproachD };

export default function Hero({ name, dob, approach = "d" }: { name: string; dob: string; approach?: string }) {
  const age = Math.floor((Date.now() - new Date(dob).getTime()) / (365.25 * 24 * 60 * 60 * 1000));
  const Component = approaches[approach as keyof typeof approaches] || ApproachD;
  return <Component name={name} age={age} />;
}
