// vercel/api/hit.js
export default async function handler(req, res){
  if(req.method !== 'POST') return res.status(405).end();
  const base = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;
  const body = req.body || {};
  // PV 计数
  await fetch(base+'/incr/' + encodeURIComponent('pv:'+ (new Date()).toISOString().slice(0,10)), { headers:{Authorization:'Bearer '+token}});
  // 总下载可在下载链接走中转后自增，此处仅示例 PV/UV
  // UV 计数（按 day+uid 去重）
  if(body.uid){
    const todayKey = 'uv:'+ (new Date()).toISOString().slice(0,10);
    await fetch(base+'/pfadd/'+encodeURIComponent(todayKey)+'/'+encodeURIComponent(body.uid), { headers:{Authorization:'Bearer '+token}});
  }
  res.status(200).json({ ok:true });
}
