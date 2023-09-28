import React, {useEffect, useMemo} from 'react';
import * as THREE from 'three';
import {getColorFor} from '../../lib/color';
import {
  colorPlaneFlat,
  colorPlaneForMapControl,
  generateBackgroundPlaneGeometry,
} from '../../lib/geom/geometry';
import Globals from '../../lib/globals';
import {MapEntity} from '../../lib/data/types';
import {LayerMode} from './Controls';

interface BackgroundPlaneProps {
  bounds: THREE.Box3;
  // the size of each cell in the grid
  cellSize: number;
  isWireframe: boolean;
  layerMode: LayerMode;
  playerEntities: MapEntity[];
  currentTime: number;
}

export function BackgroundPlane(props: BackgroundPlaneProps) {
  const {
    bounds,
    cellSize,
    isWireframe,
    layerMode,
    playerEntities,
    currentTime,
  } = props;
  const geometry = useMemo(
    () => generateBackgroundPlaneGeometry(bounds, cellSize),
    [],
  );
  const playerTeam = (name: string): 1 | 2 =>
    Globals.getTeam()?.players.includes(name) ? 1 : 2;
  const playerColor = (name: string): string =>
    getColorFor(playerTeam(name) === 1 ? 'team1' : 'team2');

  useEffect(() => {
    if (layerMode === 'default') {
      colorPlaneFlat(geometry);
    } else if (layerMode === 'mapcontrol') {
      const team1Positions = playerEntities
        .filter((e) => playerTeam(e.id) === 1)
        .map((e) => e.states[currentTime])
        .filter((s) => s !== undefined)
        .map(
          (pos) =>
            new THREE.Vector3(
              pos.x as number,
              pos.y as number,
              pos.z as number,
            ),
        );
      const team2Positions = playerEntities
        .filter((e) => playerTeam(e.id) === 2)
        .map((e) => e.states[currentTime])
        .filter((s) => s !== undefined)
        .map(
          (pos) =>
            new THREE.Vector3(
              pos.x as number,
              pos.y as number,
              pos.z as number,
            ),
        );

      colorPlaneForMapControl(geometry, team1Positions, team2Positions, true);
    }
  }, [layerMode, currentTime]);

  const material = useMemo(
    () =>
      new THREE.MeshLambertMaterial({
        wireframe: isWireframe,
        vertexColors: true,
      }),
    [layerMode],
  );
  return (
    <group>
      <mesh geometry={geometry} material={material} />
    </group>
  );
}
