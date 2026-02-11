import ApproachD from "./approach-d";

export default function Hero({ name, dob }: { name: string; dob: string }) {
  const age = Math.floor((Date.now() - new Date(dob).getTime()) / (365.25 * 24 * 60 * 60 * 1000));
  return <ApproachD name={name} age={age} dob={dob} />;
}
