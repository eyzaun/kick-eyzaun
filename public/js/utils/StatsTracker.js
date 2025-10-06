// public/js/utils/StatsTracker.js - Basit sayaç/istatistik takipçisi (SRP/DRY)

export class StatsTracker {
  constructor() {
    this.reset();
  }

  reset() {
    this.totalMessages = 0;
    this.totalCommands = 0;
    this.totalMoves = 0;
    this.startTime = Date.now();
  }

  incMessages() { this.totalMessages++; }
  incCommands() { this.totalCommands++; }
  incMoves() { this.totalMoves++; }

  getSnapshot() {
    return {
      totalMessages: this.totalMessages,
      totalCommands: this.totalCommands,
      totalMoves: this.totalMoves,
      startTime: this.startTime
    };
  }
}

export default StatsTracker;
