export type Level = 'NORMAL' | 'MODERATE' | 'SIGNIFICANT';
export type QuoteStatus = 'fresh' | 'stale' | 'unavailable';
export interface Quote { symbol:string; name:string; price:number; volume?:number; volatility?:number; updatedAt:string; status:QuoteStatus; }
export interface Change { absolute:number; percent:number; volumePercent?:number; volatilityPercent?:number; score:number; level:Level; explanation:string; }

const cap = (n:number, at:number) => Math.min(100, Math.abs(n) / at * 100);
export function detectChange(previous: Quote | undefined, current: Quote): Change {
  if (!previous || current.status === 'unavailable') return { absolute:0, percent:0, score:0, level:'NORMAL', explanation: previous ? 'A current market quote is not available to compare.' : 'This is your first observation. PULSE will compare it the next time you return.' };
  const absolute = current.price - previous.price;
  const percent = previous.price ? (absolute / previous.price) * 100 : 0;
  const volumePercent = previous.volume && current.volume ? ((current.volume - previous.volume) / previous.volume) * 100 : undefined;
  const volatilityPercent = previous.volatility && current.volatility ? ((current.volatility - previous.volatility) / previous.volatility) * 100 : undefined;
  const available = [40, volumePercent === undefined ? 0 : 25, volatilityPercent === undefined ? 0 : 20];
  const total = available.reduce((a,b)=>a+b,0);
  // Tuned against the product thresholds: a 3% personal price move, 50% volume shift,
  // or 25% volatility jump is individually material; combined signals climb faster.
  const score = Math.round(((cap(percent, 3)*40) + (volumePercent === undefined ? 0 : cap(volumePercent, 50)*25) + (volatilityPercent === undefined ? 0 : cap(volatilityPercent, 25)*20)) / total);
  const level: Level = score >= 60 ? 'SIGNIFICANT' : score >= 30 ? 'MODERATE' : 'NORMAL';
  const drivers = [`price moved ${Math.abs(percent).toFixed(1)}%`];
  if (volumePercent !== undefined && Math.abs(volumePercent) >= 20) drivers.push(`volume changed ${Math.abs(volumePercent).toFixed(0)}%`);
  if (volatilityPercent !== undefined && Math.abs(volatilityPercent) >= 10) drivers.push(`volatility changed ${Math.abs(volatilityPercent).toFixed(0)}%`);
  return { absolute, percent, volumePercent, volatilityPercent, score, level, explanation: `${drivers.join(' and ')} ${drivers.length > 1 ? 'contributed' : 'contributed'} most to this classification.` };
}
