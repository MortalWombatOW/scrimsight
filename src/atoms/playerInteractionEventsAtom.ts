import { atom } from 'jotai';
import {
  MercyRezLogEvent,
  mercyRez,
  DvaDemechLogEvent,
  dvaDemech,
  DvaRemechLogEvent,
  dvaRemech,
  KillLogEvent,
  kill,
  DamageLogEvent,
  damage,
  HealingLogEvent,
  healing,
  PlayerInteractionEvent,
} from '@atoms';

export const playerInteractionEventsAtomFn = (
  mercyRezs: MercyRezLogEvent[],
  dvaDemechs: DvaDemechLogEvent[],
  dvaRemechs: DvaRemechLogEvent[],
  kills: KillLogEvent[],
  damages: DamageLogEvent[],
  healings: HealingLogEvent[]
): PlayerInteractionEvent[] => {
  
  // Helper function to convert a mercy rez event to the common format
  const fromMercyRez = (event: MercyRezLogEvent, i: number): PlayerInteractionEvent[] => {
    return [
      {
        id: `${event.matchId}-${event.matchTime}-${event.revivedName}-${event.mercyName}-resurrected-${i}`,
        matchId: event.matchId,
        playerName: event.revivedName,
        playerTeam: event.revivedTeam,
        playerHero: event.revivedHero,
        otherPlayerName: event.mercyName,
        playerInteractionEventTime: event.matchTime,
        playerInteractionEventType: 'Resurrected',
        direction: 'incoming'
      },
      {
        id: `${event.matchId}-${event.matchTime}-${event.mercyName}-${event.revivedName}-resurrect-${i}`,
        matchId: event.matchId,
        playerName: event.mercyName,
        playerTeam: event.mercyTeam,
        playerHero: 'Mercy',
        otherPlayerName: event.revivedName,
        playerInteractionEventTime: event.matchTime,
        playerInteractionEventType: 'Resurrect',
        direction: 'outgoing'
      }
    ];
  };

  // Helper function to convert a dva demech event to the common format
  const fromDvaDemech = (event: DvaDemechLogEvent, i: number): PlayerInteractionEvent[] => {
    return [
      {
        id: `${event.matchId}-${event.matchTime}-${event.attackerName}-${event.victimName}-demech-${i}`,
        matchId: event.matchId,
        playerName: event.attackerName,
        playerTeam: event.attackerTeam,
        playerHero: event.attackerHero,
        otherPlayerName: event.victimName,
        playerInteractionEventTime: event.matchTime,
        playerInteractionEventType: 'Demech player',
        direction: 'outgoing'
      },
      {
        id: `${event.matchId}-${event.matchTime}-${event.victimName}-${event.attackerName}-demeched-${i}`,
        matchId: event.matchId,
        playerName: event.victimName,
        playerTeam: event.victimTeam,
        playerHero: event.victimHero,
        otherPlayerName: event.attackerName,
        playerInteractionEventTime: event.matchTime,
        playerInteractionEventType: 'Demeched',
        direction: 'incoming'
      }
    ];
  };

  // Helper function to convert a dva remech event to the common format
  const fromDvaRemech = (event: DvaRemechLogEvent, i: number): PlayerInteractionEvent[] => {
    return [
      {
        id: `${event.matchId}-${event.matchTime}-${event.playerName}-remech-${i}`,
        matchId: event.matchId,
        playerName: event.playerName,
        playerTeam: event.playerTeam,
        playerHero: event.playerHero,
        otherPlayerName: '', // No other player involved
        playerInteractionEventTime: event.matchTime,
        playerInteractionEventType: 'Remech',
        direction: 'outgoing'
      }
    ];
  };

  // Helper function to convert a kill event to the common format
  const fromKill = (event: KillLogEvent, i: number): PlayerInteractionEvent[] => {
    return [
      {
        id: `${event.matchId}-${event.matchTime}-${event.attackerName}-${event.victimName}-kill-${i}`,
        matchId: event.matchId,
        playerName: event.attackerName,
        playerTeam: event.attackerTeam,
        playerHero: event.attackerHero,
        otherPlayerName: event.victimName,
        playerInteractionEventTime: event.matchTime,
        playerInteractionEventType: 'Killed player',
        direction: 'outgoing'
      },
      {
        id: `${event.matchId}-${event.matchTime}-${event.victimName}-${event.attackerName}-killed-${i}`,
        matchId: event.matchId,
        playerName: event.victimName,
        playerTeam: event.victimTeam,
        playerHero: event.victimHero,
        otherPlayerName: event.attackerName,
        playerInteractionEventTime: event.matchTime,
        playerInteractionEventType: 'Killed by player',
        direction: 'incoming'
      }
    ];
  };

  // Helper function to convert a damage event to the common format
  const fromDamage = (event: DamageLogEvent, i: number): PlayerInteractionEvent[] => {
    return [
      {
        id: `${event.matchId}-${event.matchTime}-${event.attackerName}-${event.victimName}-damage-${i}`,
        matchId: event.matchId,
        playerName: event.attackerName,
        playerTeam: event.attackerTeam,
        playerHero: event.attackerHero,
        otherPlayerName: event.victimName,
        playerInteractionEventTime: event.matchTime,
        playerInteractionEventType: 'Damage to player',
        direction: 'outgoing'
      },
      {
        id: `${event.matchId}-${event.matchTime}-${event.victimName}-${event.attackerName}-damaged-${i}`,
        matchId: event.matchId,
        playerName: event.victimName,
        playerTeam: event.victimTeam,
        playerHero: event.victimHero,
        otherPlayerName: event.attackerName,
        playerInteractionEventTime: event.matchTime,
        playerInteractionEventType: 'Damage from player',
        direction: 'incoming'
      }
    ];
  };

  // Helper function to convert a healing event to the common format
  const fromHealing = (event: HealingLogEvent, i: number): PlayerInteractionEvent[] => {
    return [
      {
        id: `${event.matchId}-${event.matchTime}-${event.healerName}-${event.healeeName}-healing-${i}`,
        matchId: event.matchId,
        playerName: event.healerName,
        playerTeam: event.healerTeam,
        playerHero: event.healerName, // Healer hero not specified in interface
        otherPlayerName: event.healeeName,
        playerInteractionEventTime: event.matchTime,
        playerInteractionEventType: 'Healing to player',
        direction: 'outgoing'
      },
      {
        id: `${event.matchId}-${event.matchTime}-${event.healeeName}-${event.healerName}-healed-${i}`,
        matchId: event.matchId,
        playerName: event.healeeName,
        playerTeam: event.healeeTeam,
        playerHero: event.healeeHero,
        otherPlayerName: event.healerName,
        playerInteractionEventTime: event.matchTime,
        playerInteractionEventType: 'Healing from player',
        direction: 'incoming'
      }
    ];
  };

  return [
    ...mercyRezs.flatMap(fromMercyRez),
    ...dvaDemechs.flatMap(fromDvaDemech),
    ...dvaRemechs.flatMap(fromDvaRemech),
    ...kills.flatMap(fromKill),
    ...damages.flatMap(fromDamage),
    ...healings.flatMap(fromHealing),
  ].sort((a, b) => a.playerInteractionEventTime - b.playerInteractionEventTime);
};

export default atom(async (get): Promise<PlayerInteractionEvent[]> => {
  const mercyRezs = await get(mercyRez.atom);
  const dvaDemechs = await get(dvaDemech.atom);
  const dvaRemechs = await get(dvaRemech.atom);
  const kills = await get(kill.atom);
  const damages = await get(damage.atom);
  const healings = await get(healing.atom);

  return playerInteractionEventsAtomFn(mercyRezs, dvaDemechs, dvaRemechs, kills, damages, healings);
});