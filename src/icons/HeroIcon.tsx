import { type ReactNode } from "react";
import { getHeroImage } from "../lib/hero";
import type { Hero } from "../lib/ScrimsightDataModel";

interface HeroIconProps {
  hero: Hero;
  size?: number;
  showTooltip?: boolean;
}

const HeroIcon = ({
  hero,
  size = 32,
  showTooltip = false,
}: HeroIconProps): ReactNode => {
  const imageSrc = getHeroImage(hero, true);
  const altText = `${hero} hero icon`;

  const imageElement = (
    <img
      src={imageSrc}
      alt={altText}
      width={size}
      height={size}
      className="rounded-full"
      style={{
        width: size,
        height: size,
        objectFit: "cover",
      }}
      onError={(e) => {
        // Fallback to non-rounded version if rounded fails
        const target = e.currentTarget;
        if (!target.dataset.fallbackAttempted) {
          target.dataset.fallbackAttempted = "true";
          target.src = getHeroImage(hero, false);
        }
      }}
    />
  );

  if (showTooltip) {
    return (
      <div className="tooltip" data-tip={hero}>
        {imageElement}
      </div>
    );
  }

  return imageElement;
};

export default HeroIcon;