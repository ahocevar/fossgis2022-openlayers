import"./modulepreload-polyfill.b7f2da20.js";/* empty css           */import{T as R,O as k,b as G,C as Z,F as b,c as M,f as L,G as V,e as D,P as j,g as X,V as A,h as F,M as O,Z as q,i as x}from"./vendor.d7de2b27.js";var B=new R({source:new k}),P=new G({image:new Z({fill:new b({color:"rgb(255,240,0)"}),stroke:new M({color:"rgb(255,170,0)",width:1.5}),radius:11}),stroke:new M({color:"rgb(50,200,50)",width:2})}),u=new L({url:"./data/backhendl.gpx",format:new V}),y=Math.PI/200,g=[],S=new D({source:u,style:function(e,i){var t;c?t=30*(Date.now()/1e3-p):d?t=30*(d-p):t=0;var r=e.getGeometry().getLineString(0),s=a.minTime+t;s>a.maxTime&&(s=a.maxTime,K());var l=r.getCoordinateAtM(s,!0),o=r.getCoordinateAtM(s+30,!0),n=Math.atan2(o[1]-l[1],o[0]-l[0])-Math.PI/2,v=f.getRotation(),m=n-v;m>y?f.setRotation(v+y):m<-y?f.setRotation(v-y):f.setRotation(n),f.setCenter(l);var h=new j(l,"XYZM");return g.unshift(h),P.setGeometry(new X([r,h])),[P]}}),f=new A({center:F([15.437054,47.142729]),zoom:10,constrainRotation:!1}),E=new O({target:document.getElementById("map"),layers:[B,S],controls:[new q],view:f}),a={minTime:1/0,maxTime:-1/0,minZ:1/0,maxZ:-1/0,lengths:[],coordinates:[]};function H(e,i){var t=i[0]-e[0],r=i[1]-e[1];return Math.sqrt(t*t+r*r)}u.on("addfeature",function(e){var i=e.feature.getGeometry().getLineString(0),t=i.getCoordinates(),r=t[0],s=t.length,l=t[s-1];a.minTime=r[3],a.maxTime=l[3];for(var o=0;o<s;++o){var n=t[o][2];n<a.minZ&&(a.minZ=n),n>a.maxZ&&(a.maxZ=n),o===0?a.lengths.push(0):a.lengths.push(H(t[o-1],t[o])+a.lengths[o-1])}a.coordinates=t,f.animate({center:r,zoom:17})});var c=!1,p;function Y(){p=Date.now()/1e3,c=!0,d=null,u.changed()}var d;function C(){d=Date.now()/1e3,c=!1}function J(){p+=Date.now()/1e3-d,c=!0,u.changed()}function K(){C(),d=null}E.on("singleclick",function(){c?C():d?J():Y()});var N=30;S.on("postrender",function(e){if(c){for(var i=x(e),t=Math.min(N,g.length),r=0;r<t;r+=6)i.setImageStyle(new Z({fill:new b({color:"rgba(255,240,0, "+(1-r/t)+")"}),radius:9})),i.drawPoint(g[r]);g.length=t,Q(e.context),setTimeout(function(){u.changed()},100)}else g.length=0});function Q(e){var i=e.canvas,t=i.width,r=i.height,s=r/5,l=a.maxZ-a.minZ,o=a.lengths[a.lengths.length-1];e.beginPath(),e.moveTo(0,r);for(var n=0,v=a.coordinates.length;n<v;n+=2){var m=a.coordinates[n],h=m[2]-a.minZ,w=t*a.lengths[n]/o,T=r-s*h/l;e.lineTo(w,T)}if(e.lineTo(t,r),e.closePath(),e.fillStyle="rgba(0,0,0,0.6)",e.fill(),!(g.length<1)){var I=g[0].getCoordinates()[3];e.beginPath(),e.moveTo(0,r);for(var n=0,v=a.coordinates.length;n<v;n+=2){var m=a.coordinates[n];if(m[3]>I)break;var h=m[2]-a.minZ,w=t*a.lengths[n]/o,T=r-s*h/l;e.lineTo(w,T)}e.lineTo(w,r),e.closePath(),e.fillStyle="rgba(50,170,50,0.5)",e.fill()}}