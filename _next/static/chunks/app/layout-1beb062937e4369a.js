(self.webpackChunk_N_E=self.webpackChunk_N_E||[]).push([[177],{4163:(e,t,a)=>{Promise.resolve().then(a.t.bind(a,8346,23)),Promise.resolve().then(a.bind(a,6849)),Promise.resolve().then(a.bind(a,2305)),Promise.resolve().then(a.bind(a,8088)),Promise.resolve().then(a.bind(a,6334)),Promise.resolve().then(a.t.bind(a,5786,23))},6849:(e,t,a)=>{"use strict";a.d(t,{default:()=>i});var s=a(5155);a(2115);var r=a(6836);let i=e=>{let{size:t=120,color:a="#a855f7",backgroundColor:i="#27272a",text:n="Loading..."}=e;return(0,s.jsxs)("div",{className:"flex flex-col items-center justify-center",children:[(0,s.jsxs)("div",{className:"relative",style:{width:t,height:t},children:[(0,s.jsx)(r.P.div,{className:"absolute rounded-full",style:{width:.8*t,height:.7*t,backgroundColor:a,top:.3*t,left:.1*t},animate:{scale:[1,1.05,1]},transition:{repeat:1/0,duration:2,ease:"easeInOut"}}),(0,s.jsx)(r.P.div,{className:"absolute rounded-full",style:{width:.6*t,height:.55*t,backgroundColor:a,top:.05*t,left:.2*t},animate:{y:[0,-2,0]},transition:{repeat:1/0,duration:2,ease:"easeInOut"}}),(0,s.jsx)(r.P.div,{className:"absolute",style:{width:0,height:0,borderLeft:"".concat(.15*t,"px solid transparent"),borderRight:"".concat(.15*t,"px solid transparent"),borderBottom:"".concat(.25*t,"px solid ").concat(a),top:-.1*t,left:.15*t,transform:"rotate(-30deg)"},animate:{rotate:["-30deg","-25deg","-30deg"]},transition:{repeat:1/0,duration:2,ease:"easeInOut"}}),(0,s.jsx)(r.P.div,{className:"absolute",style:{width:0,height:0,borderLeft:"".concat(.15*t,"px solid transparent"),borderRight:"".concat(.15*t,"px solid transparent"),borderBottom:"".concat(.25*t,"px solid ").concat(a),top:-.1*t,right:.15*t,transform:"rotate(30deg)"},animate:{rotate:["30deg","25deg","30deg"]},transition:{repeat:1/0,duration:2,ease:"easeInOut",delay:.5}}),(0,s.jsx)(r.P.div,{className:"absolute bg-black rounded-full",style:{width:.08*t,height:.1*t,top:.25*t,left:.35*t},animate:{scaleY:[1,.1,1]},transition:{repeat:1/0,duration:3,ease:"easeInOut",repeatDelay:2}}),(0,s.jsx)(r.P.div,{className:"absolute bg-black rounded-full",style:{width:.08*t,height:.1*t,top:.25*t,right:.35*t},animate:{scaleY:[1,.1,1]},transition:{repeat:1/0,duration:3,ease:"easeInOut",repeatDelay:2}}),(0,s.jsx)(r.P.div,{className:"absolute bg-black",style:{width:.08*t,height:.05*t,borderRadius:"50%",top:.35*t,left:"50%",transform:"translateX(-50%)"}}),(0,s.jsx)(r.P.div,{className:"absolute bg-black",style:{width:.03*t,height:.1*t,top:.4*t,left:"50%",transform:"translateX(-50%)"}}),(0,s.jsx)(r.P.div,{className:"absolute bg-white",style:{width:.25*t,height:.01*t,top:.38*t,left:.15*t,transformOrigin:"right center"},animate:{rotate:[0,-5,0]},transition:{repeat:1/0,duration:2,ease:"easeInOut"}}),(0,s.jsx)(r.P.div,{className:"absolute bg-white",style:{width:.25*t,height:.01*t,top:.42*t,left:.15*t,transformOrigin:"right center"},animate:{rotate:[0,-3,0]},transition:{repeat:1/0,duration:2,ease:"easeInOut",delay:.3}}),(0,s.jsx)(r.P.div,{className:"absolute bg-white",style:{width:.25*t,height:.01*t,top:.38*t,right:.15*t,transformOrigin:"left center"},animate:{rotate:[0,5,0]},transition:{repeat:1/0,duration:2,ease:"easeInOut"}}),(0,s.jsx)(r.P.div,{className:"absolute bg-white",style:{width:.25*t,height:.01*t,top:.42*t,right:.15*t,transformOrigin:"left center"},animate:{rotate:[0,3,0]},transition:{repeat:1/0,duration:2,ease:"easeInOut",delay:.3}}),(0,s.jsx)(r.P.div,{className:"absolute",style:{width:.4*t,height:.1*t,backgroundColor:a,borderRadius:"40%",bottom:.05*t,right:-.15*t,transformOrigin:"left center"},animate:{rotate:[0,20,0,-20,0]},transition:{repeat:1/0,duration:4,ease:"easeInOut"}})]}),(0,s.jsx)(r.P.p,{className:"mt-4 text-lg font-medium text-gray-200",animate:{opacity:[.5,1,.5]},transition:{repeat:1/0,duration:1.5,ease:"easeInOut"},children:n})]})}},2305:(e,t,a)=>{"use strict";a.d(t,{default:()=>l,useLoading:()=>o});var s=a(5155),r=a(2115),i=a(6849);let n=(0,r.createContext)(void 0),o=()=>{let e=(0,r.useContext)(n);if(!e)throw Error("useLoading must be used within a LoadingProvider");return e},l=e=>{let{children:t}=e,[a,o]=(0,r.useState)(!1);return(0,s.jsxs)(n.Provider,{value:{isLoading:a,startLoading:()=>o(!0),stopLoading:()=>o(!1)},children:[t,a&&(0,s.jsx)("div",{className:"fixed inset-0 flex items-center justify-center bg-zinc-900 bg-opacity-80 z-50",children:(0,s.jsx)(i.default,{})})]})}},8088:(e,t,a)=>{"use strict";a.d(t,{default:()=>i});var s=a(2115),r=a(2305);let i=function(){let{minimumLoadingTime:e=800,timeoutDuration:t=1e4}=arguments.length>0&&void 0!==arguments[0]?arguments[0]:{},{isLoading:a,startLoading:i,stopLoading:n}=(0,r.useLoading)(),o=(0,s.useCallback)(()=>{i();let a=setTimeout(()=>{},e),s=setTimeout(()=>{n()},t);return()=>{clearTimeout(a),clearTimeout(s);let t=Date.now()-Date.now();t<e?setTimeout(n,e-t):n()}},[i,n,e,t]),l=(0,s.useCallback)(async t=>{let a=o();try{let a=Date.now(),s=await t(),r=Date.now()-a;return r<e&&await new Promise(t=>setTimeout(t,e-r)),s}finally{a()}},[o,e]);return{isLoading:a,startLoading:o,stopLoading:n,withLoading:l}}},6334:(e,t,a)=>{"use strict";a.d(t,{default:()=>l});var s=a(5155),r=a(2115),i=a(6046),n=a(7873);let o=["/signin","/signup","/landing","/","/home","/forgot-password","/reset-password"],l=e=>{let{children:t}=e,a=(0,i.useRouter)(),l=(0,i.usePathname)()||"",[d,u]=(0,r.useState)(!1);return((0,r.useEffect)(()=>{let{data:{subscription:e}}=n.N.auth.onAuthStateChange((e,t)=>{"SIGNED_OUT"!==e||o.includes(l)||(window.location.href="/home")});return()=>e.unsubscribe()},[l]),(0,r.useEffect)(()=>{let e=async()=>{if(o.includes(l)){u(!0);return}await (0,n.C)()?u(!0):window.location.href="/signin"};e();let t=setInterval(e,9e5);return()=>clearInterval(t)},[a,l]),d||o.includes(l))?(0,s.jsx)(s.Fragment,{children:t}):null}},7873:(e,t,a)=>{"use strict";a.d(t,{C:()=>r,N:()=>s});let s=(0,a(5974).UU)("https://rechlvadwsjwxyhgksto.supabase.co","eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJlY2hsdmFkd3Nqd3h5aGdrc3RvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzgwNjU0MzcsImV4cCI6MjA1MzY0MTQzN30.zahU6vhEBmLa2pYkPa48ZKQA3YPUQF8THgfNf-_n74c",{auth:{autoRefreshToken:!0,persistSession:!0,detectSessionInUrl:!0,flowType:"pkce"},global:{headers:{"X-Client-Info":"my-hideout"}}});s.auth.onAuthStateChange((e,t)=>{"SIGNED_IN"===e&&t?localStorage.setItem("lastSignInTime",Date.now().toString()):"SIGNED_OUT"===e&&localStorage.removeItem("lastSignInTime")});let r=async()=>{try{let{data:{session:e}}=await s.auth.getSession();if(!e)return!1;let t=localStorage.getItem("lastSignInTime");if(t){let e=Date.now(),a=parseInt(t);if(e-a>864e5)return await s.auth.signOut(),localStorage.removeItem("lastSignInTime"),!1;return!0}if(e)return localStorage.setItem("lastSignInTime",Date.now().toString()),!0;return!1}catch(e){return console.error("Error checking session:",e),!1}}},5786:()=>{},8346:e=>{e.exports={style:{fontFamily:"'Inter', 'Inter Fallback'",fontStyle:"normal"},className:"__className_a8889d"}}},e=>{var t=t=>e(e.s=t);e.O(0,[266,836,385,441,517,358],()=>t(4163)),_N_E=e.O()}]);