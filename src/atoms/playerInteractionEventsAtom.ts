import { atom } from 'jotai';
import { MercyRezLogEvent, mercyRezExtractorAtom } from './mercyRezExtractorAtom';
import { DvaDemechLogEvent, dvaDemechExtractorAtom } from './dvaDemechExtractorAtom';
import { DvaRemechLogEvent, dvaRemechExtractorAtom } from './dvaRemechExtractorAtom';
import { KillLogEvent, killExtractorAtom } from './killExtractorAtom';
import { DamageLogEvent, damageExtractorAtom } from './damageExtractorAtom';
import { HealingLogEvent, healingExtractorAtom } from './healingExtractorAtom';

/**
 * Interface for combined player interaction events
 */
export interface PlayerInteractionEvent {
  matchId: string;
  playerName: string;
  playerTeam: string;
  playerHero: string;
  otherPlayerName: string;
  playerInteractionEventTime: number;
  playerInteractionEventType: string;
}

/**
 * Helper function to convert a mercy rez event to the common format
 */
function fromMercyRez(event: MercyRezLogEvent): PlayerInteractionEvent[] {
  return [
    {
      matchId: event.matchId,
      playerName: event.revivedName,
      playerTeam: event.revivedTeam,
      playerHero: event.revivedHero,
      otherPlayerName: event.mercyName,
      playerInteractionEventTime: event.matchTime,
      playerInteractionEventType: 'Resurrected'
    },
    {
      matchId: event.matchId,
      playerName: event.mercyName,
      playerTeam: event.mercyTeam,
      playerHero: 'Mercy',
      otherPlayerName: event.revivedName,
      playerInteractionEventTime: event.matchTime,
      playerInteractionEventType: 'Resurrected Player'
    }
  ];
}

/**
 * Helper function to convert a D.Va demech event to the common format
 */
function fromDvaDemech(event: DvaDemechLogEvent): PlayerInteractionEvent[] {
  return [
    {
      matchId: event.matchId,
      playerName: event.victimName,
      playerTeam: event.victimTeam,
      playerHero: event.victimHero,
      otherPlayerName: event.attackerName,
      playerInteractionEventTime: event.matchTime,
      playerInteractionEventType: 'Demeched'
    }
  ];
}

/**
 * Helper function to convert a D.Va remech event to the common format
 */
function fromDvaRemech(event: DvaRemechLogEvent): PlayerInteractionEvent[] {
  return [
    {
      matchId: event.matchId,
      playerName: event.playerName,
      playerTeam: event.playerTeam,
      playerHero: event.playerHero,
      otherPlayerName: event.playerName,
      playerInteractionEventTime: event.matchTime,
      playerInteractionEventType: 'Remeched'
    }
  ];
}

/**
 * Helper function to convert a kill event to the common format
 */
function fromKill(event: KillLogEvent): PlayerInteractionEvent[] {
  return [
    {
      matchId: event.matchId,
      playerName: event.attackerName,
      playerTeam: event.attackerTeam,
      playerHero: event.attackerHero,
      otherPlayerName: event.victimName,
      playerInteractionEventTime: event.matchTime,
      playerInteractionEventType: 'Killed player'
    },
    {
      matchId: event.matchId,
      playerName: event.victimName,
      playerTeam: event.victimTeam,
      playerHero: event.victimHero,
      otherPlayerName: event.attackerName,
      playerInteractionEventTime: event.matchTime,
      playerInteractionEventType: 'Died'
    }
  ];
}

/**
 * Helper function to convert a damage event to the common format
 */
function fromDamage(event: DamageLogEvent): PlayerInteractionEvent[] {
  return [
    {
      matchId: event.matchId,
      playerName: event.attackerName,
      playerTeam: event.attackerTeam,
      playerHero: event.attackerHero,
      otherPlayerName: event.victimName,
      playerInteractionEventTime: event.matchTime,
      playerInteractionEventType: 'Dealt Damage'
    },
    {
      matchId: event.matchId,
      playerName: event.victimName,
      playerTeam: event.victimTeam,
      playerHero: event.victimHero,
      otherPlayerName: event.attackerName,
      playerInteractionEventTime: event.matchTime,
      playerInteractionEventType: 'Received Damage'
    }
  ];
}

/**
 * Helper function to convert a healing event to the common format
 */
function fromHealing(event: HealingLogEvent): PlayerInteractionEvent[] {
  return [
    {
      matchId: event.matchId,
      playerName: event.healerName,
      playerTeam: event.healerTeam,
      playerHero: event.healerHero,
      otherPlayerName: event.healeeName,
      playerInteractionEventTime: event.matchTime,
      playerInteractionEventType: 'Dealt Healing'
    },
    {
      matchId: event.matchId,
      playerName: event.healeeName,
      playerTeam: event.healeeTeam,
      playerHero: event.healeeHero,
      otherPlayerName: event.healerName,
      playerInteractionEventTime: event.matchTime,
      playerInteractionEventType: 'Received Healing'
    }
  ];
}

/**
 * Atom that combines various player interaction events
 */
export const playerInteractionEventsAtom = atom(async (get): Promise<PlayerInteractionEvent[]> => {
  const mercyRezs = await get(mercyRezExtractorAtom);
  const dvaDemechs = await get(dvaDemechExtractorAtom);
  const dvaRemechs = await get(dvaRemechExtractorAtom);
  const kills = await get(killExtractorAtom);
  const damages = await get(damageExtractorAtom);
  const healings = await get(healingExtractorAtom);

  return [
    ...mercyRezs.flatMap(fromMercyRez),
    ...dvaDemechs.flatMap(fromDvaDemech),
    ...dvaRemechs.flatMap(fromDvaRemech),
    ...kills.flatMap(fromKill),
    ...damages.flatMap(fromDamage),
    ...healings.flatMap(fromHealing),
  ].sort((a, b) => a.playerInteractionEventTime - b.playerInteractionEventTime);
}); 