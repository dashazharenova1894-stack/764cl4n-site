/* 3D-объект в верхнем экране: следит за курсором, цвет берётся из темы сайта */
(function(){var h=document.getElementById('hero'),R=document.documentElement;
if(!h||!window.THREE||innerWidth<760||R.classList.contains('hx-phone')||matchMedia('(prefers-reduced-motion:reduce)').matches)return;
var c=document.createElement('canvas');c.id='h3d';c.setAttribute('aria-hidden','true');h.insertBefore(c,h.firstChild);
var r;try{r=new THREE.WebGLRenderer({canvas:c,alpha:true,antialias:true})}catch(e){c.remove();return}
var s=new THREE.Scene(),cam=new THREE.PerspectiveCamera(45,1,.1,100),g=new THREE.Group(),col=new THREE.Color(),
a=new THREE.Mesh(new THREE.TorusKnotGeometry(1.5,.42,140,18),new THREE.MeshBasicMaterial({wireframe:true,transparent:true,opacity:.5})),
b=new THREE.Mesh(new THREE.IcosahedronGeometry(.9,1),new THREE.MeshBasicMaterial({wireframe:true,transparent:true,opacity:.9}));
cam.position.z=7;g.add(a,b);s.add(g);
function size(){var w=c.clientWidth,k=c.clientHeight;if(!w||!k)return;r.setPixelRatio(Math.min(devicePixelRatio,1.5));r.setSize(w,k,false);cam.aspect=w/k;cam.updateProjectionMatrix()}
function tint(){col.set(getComputedStyle(R).getPropertyValue('--a').trim()||'#5b8cff');a.material.color.copy(col);b.material.color.copy(col)}
var mx=0,my=0,tx=0,ty=0,vis=true;
addEventListener('pointermove',function(e){mx=e.clientX/innerWidth-.5;my=e.clientY/innerHeight-.5},{passive:true});
new IntersectionObserver(function(e){vis=e[0].isIntersecting}).observe(h);
addEventListener('resize',size);size();tint();setInterval(tint,1500);
(function f(t){requestAnimationFrame(f);if(!vis||document.hidden)return;
tx+=(mx-tx)*.05;ty+=(my-ty)*.05;g.rotation.y=t*3e-4+tx*1.6;g.rotation.x=t*2e-4+ty*1.2;b.rotation.y=-t*6e-4;r.render(s,cam)})(0);
})();
