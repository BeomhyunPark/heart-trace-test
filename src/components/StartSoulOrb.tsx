import type { CSSProperties } from 'react';

import { assetUrl } from '../utils/assetUrl';

type PhaseStyle = CSSProperties & {
  '--phase-index': number;
};

const START_ORB_PHASES = Array.from(
  { length: 6 },
  (_, index) => assetUrl(`images/motion/start-orb/phase-${String(index + 1).padStart(2, '0')}.png`),
);

export function StartSoulOrb() {
  return (
    <div className="start-soul-orb" aria-hidden="true">
      {START_ORB_PHASES.map((src, index) => (
        <img
          key={src}
          className="start-soul-orb__phase"
          src={src}
          alt=""
          style={{ '--phase-index': index } as PhaseStyle}
        />
      ))}
    </div>
  );
}
