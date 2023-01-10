import React, {useEffect, useMemo, useRef, useState} from 'react';
import {useFrame} from '@react-three/fiber';
import * as THREE from 'three';
import {getHeroImage} from '../../lib/data/data';
import {getColorFor} from '../../lib/color';
import {SpriteText2D, textAlign} from 'three-text2d';
interface PlayerProps {
  name: string;
  hero: string;
  position: THREE.Vector3;
  speed: number;
  playing: boolean;
  team: 1 | 2;
  health: number;
  maxHealth: number;
  ultCharge: number;
  renderText: (
    key: string,
    text: string,
    position: THREE.Vector3,
    positionTop: THREE.Vector3,
    camera: THREE.Camera,
    color: string,
  ) => void;
}

export const Player = ({
  name,
  hero,
  position,
  playing,
  team,
  health,
  maxHealth,
  speed,
  ultCharge,
  renderText,
}: PlayerProps) => {
  const ref = useRef<THREE.Group>();

  const loader = new THREE.TextureLoader();
  const [lastHero, setLastHero] = useState(hero);

  useEffect(() => {
    if (lastHero !== hero) {
      setLastHero(hero);
      setHeroImg(null);
    }
  }, [hero]);

  const [heroImg, setHeroImg] = useState<THREE.Texture | null>(null);
  useEffect(() => {
    loader.load(
      'https://scrimsight.com' + getHeroImage(hero),
      (texture) => {
        setHeroImg(texture);
      },
      undefined,
      (err) => {
        console.error('error loading hero image', err);
      },
    );
  }, [lastHero]);

  const spriteRef = useRef<THREE.Mesh | null>(null);

  const pillRadius = 0.3;
  const spriteOffset = pillRadius + 0.15;
  useFrame(({camera}, delta) => {
    // move towards target position
    const current = (ref as React.MutableRefObject<THREE.Group>).current;
    if (current && position) {
      const currentPos = current.position;
      const {x, y, z} = currentPos;
      const dx = position.x - x;
      const dy = position.y - y;
      const dz = position.z - z;
      const dist = Math.sqrt(dx * dx + dy * dy + dz * dz);
      if (dist > 0.1 && playing) {
        current.position.x += (dx / dist) * speed * delta;
        current.position.y += (dy / dist) * speed * delta;
        current.position.z += (dz / dist) * speed * delta;
      } else {
        // snap to position
        current.position.x = position.x;
        current.position.y = position.y;
        current.position.z = position.z;
      }
    }
    if (spriteRef.current) {
      const cameraPos = camera.position;
      // vector from currentPos to cameraPos
      const dir = new THREE.Vector3(
        cameraPos.x - position.x,
        cameraPos.y - position.y,
        cameraPos.z - position.z,
      ).normalize();

      // rotate sprite to face camera
      spriteRef.current.position.x = dir.x * spriteOffset;
      spriteRef.current.position.y = dir.y * spriteOffset + 0.2;
      spriteRef.current.position.z = dir.z * spriteOffset;

      // should be rotated to maintain the same angle to the camera
      spriteRef.current.rotation.x = camera.rotation.x;
      spriteRef.current.rotation.y = camera.rotation.y;
      spriteRef.current.rotation.z = camera.rotation.z;
    }
  });

  // display an arc around the player to indicate health
  const healthRadius = 0.45;
  const healthThickness = 0.07;
  const healthPercent = health / maxHealth;
  const initialRotation = Math.PI * 1.5;
  const angleOffsetPercent = 0.15;
  const angleOffset = Math.PI * 2 * angleOffsetPercent;

  const arc = useMemo(() => {
    const arc_ = new THREE.Shape();
    const innerRadius = healthRadius - healthThickness;
    const outerRadius = healthRadius;
    const startAngle = initialRotation - angleOffset;
    const endAngle =
      startAngle - Math.PI * 2 * (1 - angleOffsetPercent * 2) * healthPercent;
    const startInner = new THREE.Vector2(
      Math.cos(startAngle) * innerRadius,
      Math.sin(startAngle) * innerRadius,
    );
    const startOuter = new THREE.Vector2(
      Math.cos(startAngle) * outerRadius,

      Math.sin(startAngle) * outerRadius,
    );
    const endInner = new THREE.Vector2(
      Math.cos(endAngle) * innerRadius,
      Math.sin(endAngle) * innerRadius,
    );
    arc_.moveTo(startInner.x, startInner.y);
    arc_.lineTo(startOuter.x, startOuter.y);
    arc_.absarc(0, 0, outerRadius, startAngle, endAngle, true);
    arc_.lineTo(endInner.x, endInner.y);
    arc_.absarc(0, 0, innerRadius, endAngle, startAngle, false);
    arc_.closePath();
    return arc_;
  }, [healthPercent]);

  // health color should be red when low, yellow when medium, green when high
  const healthColor = useMemo(
    () =>
      new THREE.Color(
        healthPercent > 0.66
          ? 0x00ff00
          : healthPercent > 0.33
          ? 0xffff00
          : 0xff0000,
      ),
    [healthPercent],
  );
  const healthMaterial = new THREE.MeshBasicMaterial({
    color: healthColor,
    side: THREE.DoubleSide,
  });

  const healthGeometry = new THREE.ShapeGeometry(arc, 16);
  const healthMesh = new THREE.Mesh(healthGeometry, healthMaterial);

  // ultimate charge bar goes below the sprite
  const ultChargeBarWidth = 0.7;
  const ultChargeBarHeight = 0.05;
  const ultChargeBarOffset = 0.42;
  const ultChargeOutlineGeometry = new THREE.PlaneGeometry(
    ultChargeBarWidth,
    ultChargeBarHeight,
    1,
    1,
  );
  const ultChargeOutlineMaterial = new THREE.MeshBasicMaterial({
    color: 0x0000fcc,
    side: THREE.DoubleSide,
  });
  const ultChargeOutlineMesh = new THREE.Mesh(
    ultChargeOutlineGeometry,
    ultChargeOutlineMaterial,
  );
  const ultChargeBarGeometry = new THREE.CylinderGeometry(
    ultChargeBarHeight / 2,
    ultChargeBarHeight / 2,
    ultChargeBarWidth,
    4,
    1,
    false,
  );
  ultChargeBarGeometry.rotateZ(Math.PI / 2);
  const ultChargeBarMaterial = new THREE.MeshPhongMaterial({
    color: 0x2575f7,
    side: THREE.DoubleSide,
    emissive: 0x5e92e6,
    emissiveIntensity: ultCharge === 100 ? 10 : 0,
  });
  const ultChargeBarMesh = new THREE.Mesh(
    ultChargeBarGeometry,
    ultChargeBarMaterial,
  );
  ultChargeBarMesh.scale.x = ultCharge / 100;
  ultChargeOutlineMesh.position.y = -ultChargeBarOffset;
  ultChargeBarMesh.position.y = -ultChargeBarOffset;

  // render name above the sprite
  useFrame(({camera}) => {
    if (spriteRef.current) {
      const namePosition = spriteRef.current.localToWorld(
        new THREE.Vector3(0, 1, 0),
      );

      const namePositionTop = spriteRef.current.localToWorld(
        new THREE.Vector3(0, 1.5, 0),
      );

      renderText(
        `player_name_${name}`,
        name,
        namePosition,
        namePositionTop,
        camera,
        getColorFor(team === 1 ? 'team1' : 'team2'),
      );
    }
  });

  return (
    /* @ts-ignore */
    <group key={name} ref={ref}>
      <mesh scale={[1, 1, 1]}>
        <capsuleGeometry attach="geometry" args={[pillRadius, 0.7, 8, 32]} />
        <meshLambertMaterial
          attach="material"
          color={health > 0 ? getColorFor(lastHero) : 0x000000}
        />
      </mesh>
      <mesh scale={[1.25, 1.25, 1.25]}>
        <capsuleGeometry attach="geometry" args={[pillRadius, 0.7, 8, 32]} />
        <meshBasicMaterial
          attach="material"
          color={getColorFor(team === 1 ? 'team1' : 'team2')}
          side={THREE.BackSide}
        />
      </mesh>
      <mesh scale={[1, 1, 1]} ref={spriteRef}>
        <sprite scale={[0.6, 0.6, 0.6]}>
          {heroImg ? <spriteMaterial attach="material" map={heroImg} /> : null}
        </sprite>
        <primitive object={healthMesh} />
        {/* <primitive object={ultChargeOutlineMesh} /> */}
        <primitive object={ultChargeBarMesh} />
        {/* <primitive object={nameSprite} /> */}
      </mesh>
    </group>
  );
};
