import"./modulepreload-polyfill.b7f2da20.js";/* empty css           */import{L as C,t as I,e as v,f as G,b as L,c as R,M as T,T as b,u as V,v as j,V as P,m as k,w as F}from"./vendor.d7de2b27.js";const c=1e7,m=Math.cos(Math.PI/6),_=Math.sin(Math.PI/6),h=c*_,y=c*m,w=new C([[0,c],[y,-h],[-y,-h],[0,c]]),x=new I(w),i=new v({source:new G({features:[x]}),style:[new L({stroke:new R({color:"#f00",width:5})})]}),d=new T({layers:[new b({source:new V({layer:"watercolor"})}),i],interactions:j({altShiftDragRotate:!1,pinchRotate:!1}),target:"map",view:new P({center:[0,0],zoom:1})});function $(t){const n=w.clone(),e=B(n.getCoordinates());for(let s=0;s<t;++s){let r=e;for(;r.next;){const a=r.next;q(r),r=a}}const o=N(e);n.setCoordinates(o),x.setGeometry(n)}function q(t){const n=t.next,e=t.point,o=t.next.point,s=o[0]-e[0],r=o[1]-e[1],a={point:[e[0]+s/3,e[1]+r/3]},u=Math.sqrt(s*s+r*r)/(2*m),p=Math.atan2(r,s)+Math.PI/6,g={point:[e[0]+u*Math.cos(p),e[1]+u*Math.sin(p)]},f={point:[o[0]-s/3,o[1]-r/3]};t.next=a,a.next=g,g.next=f,f.next=n}function B(t){const n={point:t[0]},e=t.length;for(let o=0,s=n;o<e-1;++o)s.next={point:t[o+1]},s=s.next;return n}function N(t){const n=[t.point];for(let e=t,o=1;e.next;e=e.next,++o)n[o]=e.next.point;return n}$(8);const M=i.getSource().getFeatures()[0].getGeometry();function l(){const t=M.getCoordinates().length,n=M.getSimplifiedGeometry(F(d.getView().getResolution(),devicePixelRatio)).getCoordinates().length,e=i.getRenderer().replayGroup_?i.getRenderer().replayGroup_.executorsByZIndex_[0].LineString.coordinates.length/2:"n/a";document.getElementById("count").innerHTML=`
    ${t} points original<br>
    ${n} points simplified<br>
    ${e} points rendered`}l();const S=new k({source:i.getSource()});d.addInteraction(S);S.on("modifyend",l);d.on("moveend",l);