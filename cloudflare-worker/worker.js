// cloudflare-worker/worker.js
// 绑定 KV: LIKES (KV Namespace), 绑定 R2/Analytics 可选
export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    if(url.pathname === '/api/like' && request.method === 'POST'){
      const key = url.searchParams.get('key');
      if(!key) return new Response('missing key', {status:400});
      const kvKey = 'like:'+key;
      const current = parseInt((await env.LIKES.get(kvKey))||'0',10);
      const next = current + 1;
      await env.LIKES.put(kvKey, String(next));
      return Response.json({ ok:true, count: next });
    }
    if(url.pathname === '/api/totals'){
      // 简化：固定几个 key，如果你愿意可以在 KV 里维护一个 keys 列表
      const keys = ['proj-safeconvert','proj-2048','proj-heykanb','dl-safeconvert','dl-2048'];
      let totalLikes = 0; const items = {};
      for(const k of keys){
        const v = parseInt((await env.LIKES.get('like:'+k))||'0',10);
        items[k] = v; totalLikes += v;
      }
      const totalDownloads = parseInt((await env.LIKES.get('downloads:total'))||'0',10);
      return Response.json({ totalLikes, totalDownloads, items });
    }
    if(url.pathname === '/api/hit' && request.method === 'POST'){
      // 可写入 D1/Analytics，本文略
      return Response.json({ ok:true });
    }
    return new Response('OK');
  }
}
