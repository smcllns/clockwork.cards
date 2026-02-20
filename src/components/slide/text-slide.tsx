import { Section } from "../page/section";

type Props = { children: React.ReactNode; className?: string };

export function TextSlide({ children, alt, id, className }: Props & { alt?: boolean; id: string }) {
  return (
    <Section id={id} bg={alt ? "secondary" : "primary"} className={className}>
      <div className="slide max-w-xl w-full py-16">{children}</div>
    </Section>
  );
}
