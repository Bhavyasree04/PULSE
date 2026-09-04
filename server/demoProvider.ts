import type { Quote } from './domain.js';
const now = () => new Date().toISOString();
const initial: Record<string, Quote> = {
  RELIANCE:{symbol:'RELIANCE',name:'Reliance Industries',price:1400,volume:10_000_000,volatility:1.2,updatedAt:now(),status:'fresh'},
  TCS:{symbol:'TCS',name:'Tata Consultancy Services',price:3840,volume:2_600_000,volatility:0.8,updatedAt:now(),status:'fresh'},
  INFY:{symbol:'INFY',name:'Infosys',price:1600,volume:4_100_000,volatility:1.0,updatedAt:now(),status:'fresh'},
  HDFCBANK:{symbol:'HDFCBANK',name:'HDFC Bank',price:1684,volume:5_200_000,volatility:0.9,updatedAt:now(),status:'fresh'},
  ICICIBANK:{symbol:'ICICIBANK',name:'ICICI Bank',price:1240,volume:4_700_000,volatility:0.7,updatedAt:now(),status:'fresh'}
};
const moved: Record<string, Partial<Quote>> = { RELIANCE:{price:1458,volume:16_000_000,volatility:1.5},TCS:{price:3882,volume:3_200_000,volatility:0.95},INFY:{price:1602,volume:4_150_000,volatility:1.01},HDFCBANK:{price:1670,volume:5_000_000,volatility:1.0},ICICIBANK:{price:1262,volume:5_800_000,volatility:1.1} };
export class MockMarketDataProvider {
  stage = 0; mode: 'healthy'|'stale'|'failure' = 'healthy';
  catalog(){ return Object.values(initial); }
  advance(){ this.stage = this.stage ? 0 : 1; return this.stage; }
  setMode(mode: typeof this.mode){this.mode=mode;}
  quote(symbol:string): Quote {
    const baseline = initial[symbol.toUpperCase()]; if (!baseline) throw new Error('Unknown demo symbol');
    if (this.mode === 'failure') return {...baseline,status:'unavailable',updatedAt:now()};
    const quote = {...baseline,...(this.stage ? moved[baseline.symbol] : {}),updatedAt:now(),status:this.mode === 'stale' ? 'stale' : 'fresh'} as Quote;
    return quote;
  }
  history(symbol:string){ const q=this.quote(symbol); const base=initial[symbol.toUpperCase()].price; return Array.from({length:8},(_,i)=>({time:`${9+i}:30`,price:Math.round((base+(q.price-base)*(i/7)+(i%2?3:-2))*100)/100})); }
}
