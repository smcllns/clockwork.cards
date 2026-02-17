import { createRoot } from 'react-dom/client';
import { useState, useEffect } from 'react';
import './theme.css';
import './index.css';

import { Nav } from './components/nav';
import { Footer } from './components/footer';
import { TileContainer } from './components/tile';

// Cards
import { SlideTime } from './cards/slide-time';
import { SlideTimeTable } from './cards/slide-time-table';
import { SlideSpace } from './cards/slide-space';
import { SlideYogurt } from './cards/slide-yogurt';
import { SlideSteps } from './cards/slide-steps';
import { SlideBrushing } from './cards/slide-brushing';
import { SlidePoops } from './cards/slide-poops';
import { TileSleep } from './cards/tile-sleep';
import { TileHeartbeats } from './cards/tile-heartbeats';
import { TileFruit } from './cards/tile-fruit';
import { TileHugs } from './cards/tile-hugs';
import { TileLungs } from './cards/tile-lungs';
import { TileWater } from './cards/tile-water';
import { HeroCyberpunk } from './cards/hero-cyberpunk';

// App shell. Owns only `shiny` state. Reads like a table of contents.
function App() {
  const [shiny, setShiny] = useState(false);

  // Get name and DOB from URL params or env
  const params = new URLSearchParams(window.location.search);
  const name = params.get('name') || import.meta.env.DEFAULT_NAME || 'Oscar';
  const dobString = params.get('dob') || import.meta.env.DEFAULT_DOB || '2017-02-20';
  const dob = new Date(dobString);

  // Apply shiny class to html element
  useEffect(() => {
    if (shiny) {
      document.documentElement.classList.add('shiny');
    } else {
      document.documentElement.classList.remove('shiny');
    }
  }, [shiny]);

  return (
    <>
      <Nav shiny={shiny} onToggleShiny={() => setShiny(!shiny)} />

      {/* Hero */}
      <HeroCyberpunk name={name} dob={dob} shiny={shiny} />

      {/* Time cards */}
      <SlideTime dob={dob} />
      <SlideTimeTable dob={dob} />

      {/* Space */}
      <SlideSpace dob={dob} />

      {/* Daily habits */}
      <SlideYogurt dob={dob} />
      <SlideSteps dob={dob} />
      <SlideBrushing dob={dob} />
      <SlidePoops dob={dob} />

      {/* Tile grid */}
      <TileContainer id="stats">
        <TileSleep dob={dob} span={2} />
        <TileHeartbeats dob={dob} span={2} />
        <TileFruit dob={dob} span={1} />
        <TileHugs dob={dob} span={2} />
        <TileLungs dob={dob} span={2} />
        <TileWater dob={dob} span={1} />
      </TileContainer>

      <Footer />
    </>
  );
}

const root = createRoot(document.getElementById('root')!);
root.render(<App />);
