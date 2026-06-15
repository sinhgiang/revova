import { NextRequest, NextResponse } from 'next/server'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ userId: string }> }
) {
  const { userId } = await params
  const apiBase = process.env.NEXT_PUBLIC_APP_URL || 'https://revova.io'

  const js = `(function(){
  var UID='${userId}',API='${apiBase}';
  function fmt(a,c){try{return new Intl.NumberFormat('en-US',{style:'currency',currency:c.toUpperCase()}).format(a/100)}catch(e){return a}}
  function banner(d){
    if(document.getElementById('rvb'))return;
    var b=document.createElement('div');
    b.id='rvb';
    b.style.cssText='position:fixed;top:0;left:0;right:0;z-index:2147483647;background:#dc2626;color:#fff;padding:10px 16px;display:flex;align-items:center;justify-content:center;gap:12px;font-family:-apple-system,sans-serif;font-size:14px;box-shadow:0 2px 8px rgba(0,0,0,.2)';
    var amt=d.amount?fmt(d.amount,d.currency||'usd'):'';
    b.innerHTML='<span>⚠️ Your payment of <strong>'+amt+'</strong> failed — update your card to keep access.</span>'
      +'<a href="'+d.updateCardUrl+'" style="background:#fff;color:#dc2626;padding:5px 14px;border-radius:6px;text-decoration:none;font-weight:600;font-size:13px;white-space:nowrap" target="_blank">Update Card →</a>'
      +'<button onclick="document.getElementById(\'rvb\').remove()" style="background:none;border:none;color:rgba(255,255,255,.8);cursor:pointer;font-size:20px;line-height:1;padding:0 2px;flex-shrink:0">×</button>';
    document.body?document.body.insertBefore(b,document.body.firstChild):document.addEventListener('DOMContentLoaded',function(){document.body.insertBefore(b,document.body.firstChild)});
  }
  function check(email){
    fetch(API+'/api/widget/'+UID+'/check?email='+encodeURIComponent(email))
      .then(function(r){return r.json()})
      .then(function(d){if(d.hasFailed)banner(d)})
      .catch(function(){});
  }
  function init(){
    var e=window.REVOVA_CUSTOMER_EMAIL;
    if(e){check(e);return;}
    var n=0,t=setInterval(function(){
      e=window.REVOVA_CUSTOMER_EMAIL;
      if(e){clearInterval(t);check(e);}
      if(++n>40)clearInterval(t);
    },500);
  }
  document.readyState==='loading'?document.addEventListener('DOMContentLoaded',init):init();
})();`

  return new NextResponse(js, {
    headers: {
      'Content-Type': 'application/javascript; charset=utf-8',
      'Access-Control-Allow-Origin': '*',
      'Cache-Control': 'public, max-age=3600, s-maxage=3600',
    },
  })
}
