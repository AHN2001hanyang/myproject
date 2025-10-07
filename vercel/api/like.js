// vercel/api/like.js
// 需要环境变量：UPSTASH_REDIS_REST_URL, UPSTASH_REDIS_REST_TOKEN
export default async function handler(req, res){
  if(req.method !== 'POST') return res.status(405).end();
  const key = (req.query.key||'').toString();
  if(!key) return res.status(400).json({error:'missing key'});
  const base = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;
  const url = base + '/incr/' + encodeURIComponent('like:'+key);
  const r = await fetch(url, { headers: { Authorization: 'Bearer '+token }});
  const data = await r.json();
  return res.status(200).json({ ok:true, count:data.result });
}
