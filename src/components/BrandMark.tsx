import { assetUrl } from '../utils/assetUrl';

type BrandMarkProps = {
  size?: 'home' | 'splash';
};

export function BrandMark({ size = 'home' }: BrandMarkProps) {
  const isSplash = size === 'splash';

  return (
    <span className={`brand-mark brand-mark--${size}`} aria-hidden="true">
      <img
        src={assetUrl(isSplash
          ? 'images/brand/warmth-mark-splash.svg'
          : 'images/brand/warmth-mark.svg')}
        alt=""
      />
    </span>
  );
}
