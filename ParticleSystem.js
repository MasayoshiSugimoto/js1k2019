//v = Vector constructor
v=(x,y)=>({x:x,y:y})
M=Math
G=10
//PIXEL_PER_METER
P=50

//S: substract
S=(v1,v2)=>v(v1.x-v2.x,v1.y-v2.y)
add=(v1,v2)=>v(v1.x+v2.x,v1.y+v2.y)
//L: length
L=v1=>M.sqrt(v1.x*v1.x+v1.y*v1.y)
//C: clamp
C=(min,value,max)=>M.min(max,M.max(value,min))
//X: multiply
X=(vector,scalar)=>v(vector.x*scalar,vector.y*scalar)

//p: position
//r: radius
//a: acceleration
//MP: makeParticle
MP=(p,r)=>({oldPosition:p,p:p,a:v(0,0),radius:r})
CW=()=>b.clientWidth
CH=()=>b.clientHeight

//PS: Particles
PS=[]
for(let i=0;i<1000;i++){
	PS[i]=MP(v(
		M.random()*CW()/P,
		M.random()*CH()/P
	),0.2)
}
window.c.fillStyle="black"

B=undefined
window.b.addEventListener("click",e=>{
	B=X(v(e.clientX,e.clientY),1/P)
	//console.log(`B={x:${B.x},y:${B.y})`)
	PS.push(MP(B,2))
})

//In millisecond
dt=1000/60/1000
setInterval(()=>{
	//Apply force
	PS.forEach(_=>_.a=v(0,G))

	//Verlet
	const dt2=dt*dt
	PS.forEach(particle=>{
		const newPosition=add(
			particle.p,
			add(S(particle.p, particle.oldPosition),X(particle.a,dt2))
		)
		particle.oldPosition=particle.p
		particle.p=newPosition
	})

	//Update collisions
	PS.forEach(p1=>{
		PS.forEach(p2=>{
			if(p1===p2)return
			const delta=S(p2.p,p1.p)
			const deltaLength=L(delta)
			if(deltaLength>0.001 && deltaLength<(p1.radius+p2.radius)){
				const diff=((p1.radius+p2.radius)-deltaLength)/deltaLength
				const dx=X(delta,0.5*diff)
				p1.p=S(p1.p,X(delta,diff*(p2.radius/(p2.radius+p1.radius))))
				p2.p=add(p2.p,X(delta,diff*(p1.radius/(p2.radius+p1.radius))))
			}
		})

		p1.p.x=C(0,p1.p.x,CW()/P)
		p1.p.y=C(0,p1.p.y,CH()/P)
	})
	c.clearRect(0,0,10000,10000)

	PS.forEach(particle=>{
		c.beginPath();
		c.arc(
			particle.p.x*P,
			particle.p.y*P,
			10,
			0,
			2*M.PI);
		c.fill();
	})

	B=undefined
	PS=PS.filter(x=>x.radius!==2)
},dt*1000)
