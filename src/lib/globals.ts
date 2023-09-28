import {Team} from './data/types';

export default class Globals {
  private static team: Team | undefined;
  private static teamChangeListeners: ((t: Team) => void)[] = [];

  static setTeam(team: Team) {
    this.team = team;
    this.teamChangeListeners.forEach((callback) => callback(team));
    console.log(
      'called team change listeners',
      this.teamChangeListeners.length,
    );
  }
  static getTeam() {
    return this.team;
  }
  static subscribeToTeamChange(callback: (t: Team) => void) {
    this.teamChangeListeners.push(callback);
  }
}
