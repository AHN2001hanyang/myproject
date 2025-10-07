// vercel/api/totals.js
export default async function handler(req, res){
  const base = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;
  async function get(key){ const r = await fetch(base+'/get/'+encodeURIComponent(key), {headers:{Authorization:'Bearer '+token}}); const d = await r.json(); return parseInt(d.result||'0',10)||0; }
  // 列出要统计的项目 key —— 你可以改成从 Redis SCAN 获取
  const keys = ['proj-safeconvert','proj-2048','proj-heykanb','dl-safeconvert','dl-2048'];
  const items = {};
  for(const k of keys){ items[k] = await get('like:'+k); }
  const totalLikes = Object.values(items).reduce((a,b)=>a+b,0);
  const totalDownloads = await get('downloads:total');
  res.status(200).json({ totalLikes, totalDownloads, items });
}
