export type Level='NORMAL'|'MODERATE'|'SIGNIFICANT'; export type Status='fresh'|'stale'|'unavailable';
export interface Quote {symbol:string;name:string;price:number;volume?:number;volatility?:number;updatedAt:string;status:Status}
export interface Change {absolute:number;percent:number;volumePercent?:number;volatilityPercent?:number;score:number;level:Level;explanation:string}
export interface Card {current:Quote;previous?:Quote;change:Change}
