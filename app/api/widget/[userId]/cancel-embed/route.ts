import { NextRequest, NextResponse } from 'next/server'

// Returns a tiny JS SDK the merchant embeds in their app. It exposes
// window.Revova.openCancelFlow({ subscriptionId, returnUrl }) which opens Revova's
// retention/cancel flow inside a modal overlay (iframe) — no full-page redirect.
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ userId: string }> }
) {
  const { userId } = await params
  const apiBase = process.env.NEXT_PUBLIC_APP_URL || 'https://revova.io'

  const js = `(function(){
  var UID='${userId}',API='${apiBase}';
  function closeModal(){
    var o=document.getElementById('rv-cancel-overlay');
    if(o)o.remove();
    document.documentElement.style.overflow='';
  }
  function openCancelFlow(opts){
    opts=opts||{};
    var sub=opts.subscriptionId||'';
    var tok=opts.token||'';
    var ret=opts.returnUrl||window.location.href;
    if(document.getElementById('rv-cancel-overlay'))return;
    var ov=document.createElement('div');
    ov.id='rv-cancel-overlay';
    ov.style.cssText='position:fixed;inset:0;z-index:2147483647;background:rgba(15,23,42,.55);display:flex;align-items:center;justify-content:center;padding:16px;backdrop-filter:blur(2px)';
    var frameWrap=document.createElement('div');
    frameWrap.style.cssText='position:relative;width:100%;max-width:480px;height:640px;max-height:92vh;border-radius:18px;overflow:hidden;box-shadow:0 24px 60px rgba(0,0,0,.35);background:#f9fafb';
    var close=document.createElement('button');
    close.innerHTML='×';
    close.setAttribute('aria-label','Close');
    close.style.cssText='position:absolute;top:10px;right:12px;z-index:2;background:rgba(255,255,255,.9);border:none;width:30px;height:30px;border-radius:50%;font-size:20px;line-height:1;cursor:pointer;color:#475569;box-shadow:0 1px 4px rgba(0,0,0,.15)';
    close.onclick=closeModal;
    var f=document.createElement('iframe');
    f.src=API+'/cancel/'+UID+'?embed=1&sub='+encodeURIComponent(sub)+(tok?'&token='+encodeURIComponent(tok):'')+'&return='+encodeURIComponent(ret);
    f.style.cssText='width:100%;height:100%;border:0;display:block';
    f.setAttribute('title','Cancel subscription');
    frameWrap.appendChild(close);
    frameWrap.appendChild(f);
    ov.appendChild(frameWrap);
    ov.addEventListener('click',function(e){if(e.target===ov)closeModal();});
    document.body.appendChild(ov);
    document.documentElement.style.overflow='hidden';
  }
  // Listen for completion messages posted by the embedded cancel flow
  window.addEventListener('message',function(e){
    if(!e.data||e.data.source!=='revova-cancel')return;
    if(e.data.type==='close')closeModal();
    if(e.data.type==='done'){
      // Fire an optional callback the merchant can hook into
      if(typeof window.REVOVA_ON_CANCEL_RESULT==='function'){
        try{window.REVOVA_ON_CANCEL_RESULT(e.data.result);}catch(x){}
      }
      if(e.data.result==='cancelled'){
        // Let the host app know the subscription was actually cancelled
        setTimeout(closeModal,2200);
      }
    }
  });
  window.Revova=window.Revova||{};
  window.Revova.openCancelFlow=openCancelFlow;
  window.Revova.closeCancelFlow=closeModal;
})();`

  return new NextResponse(js, {
    headers: {
      'Content-Type': 'application/javascript; charset=utf-8',
      'Access-Control-Allow-Origin': '*',
      'Cache-Control': 'public, max-age=3600, s-maxage=3600',
    },
  })
}
