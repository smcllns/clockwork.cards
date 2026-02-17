import { ReactNode } from 'react';
import { Section } from './section';

interface TileContainerProps {
  id?: string;
  children: ReactNode;
}

// Section with 5-column bento grid
export function TileContainer({ id, children }: TileContainerProps) {
  return (
    <Section id={id}>
      <div className="tile-grid w-full max-w-6xl">
        {children}
      </div>
    </Section>
  );
}

interface TileDataProps {
  emoji: string;
  value: string | number;
  unit?: string;
  headline: string;
  body?: ReactNode;
  span?: number;
}

interface TileChildrenProps {
  children: ReactNode;
  span?: number;
}

type TileProps = TileDataProps | TileChildrenProps;

function isTileDataProps(props: TileProps): props is TileDataProps {
  return 'emoji' in props;
}

// Tile accepts either data props or children
export function Tile(props: TileProps) {
  const span = props.span || 1;

  if (isTileDataProps(props)) {
    const { emoji, value, unit, headline, body } = props;
    return (
      <div
        className="p-6 rounded-lg flex flex-col gap-3"
        style={{
          backgroundColor: 'var(--card-bg)',
          border: '1px solid var(--border)',
          ['--span' as string]: span,
        }}
        data-card
      >
        <div className="text-4xl">{emoji}</div>
        <div>
          <div className="text-3xl sm:text-4xl font-bold" data-stat>
            {value}
            {unit && <span className="text-xl sm:text-2xl ml-1" style={{ color: 'var(--text-muted)' }}>{unit}</span>}
          </div>
          <div className="text-sm font-medium mt-1" style={{ color: 'var(--text-muted)' }}>
            {headline}
          </div>
        </div>
        {body && (
          <div className="text-sm" style={{ color: 'var(--text-muted)' }}>
            {body}
          </div>
        )}
      </div>
    );
  }

  return (
    <div
      className="p-6 rounded-lg"
      style={{
        backgroundColor: 'var(--card-bg)',
        border: '1px solid var(--border)',
        ['--span' as string]: span,
      }}
      data-card
    >
      {props.children}
    </div>
  );
}
