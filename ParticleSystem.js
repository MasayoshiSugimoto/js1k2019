console.log("window.innerWidth="+window.innerWidth)
console.log("window.innerHeight="+window.innerHeight)
console.log("c.canvas.width="+a.width)
console.log("c.canvas.height="+a.height)
console.log(a)

a.style=`
	width: 100%;
	height: 100%;
	object-fit:contain;
	background: "black";
`

//
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
//ScreenWidth
SW=()=>c.canvas.width
//ScreenHeight
SH=()=>c.canvas.height
//World2Screen
//900 is the reference screen height
W2S=()=>SH()/900*P

//PS: Particles
PS=[]
F=f=>PS.forEach(f)
for(let i=0;i<300;i++){
	PS[i]=MP(v(M.random(),M.random()),0.5)
}

B=undefined
b.addEventListener("click",e=>{
	B=v(e.clientX/W2S(),e.clientY/W2S())
	//console.log(`B={x:${B.x},y:${B.y})`)
	PS.push(MP(B,2))
})

//In millisecond
dt=1000/60/1000
setInterval(()=>{
	//Apply force
	F(_=>_.a=v(0,G))

	//Verlet
	const dt2=dt*dt
	F(particle=>{
		const newPosition=add(
			particle.p,
			add(S(particle.p, particle.oldPosition),X(particle.a,dt2))
		)
		particle.oldPosition=particle.p
		particle.p=newPosition
	})

	//Update collisions
	F(p1=>{
		F(p2=>{
			if(p1==p2)return
			const delta=S(p2.p,p1.p)
			const deltaLength=L(delta)
			if(deltaLength>0.001 && deltaLength<(p1.radius+p2.radius)){
				const diff=((p1.radius+p2.radius)-deltaLength)/deltaLength
				const dx=X(delta,0.5*diff)
				p1.p=S(p1.p,X(delta,diff*(p2.radius/(p2.radius+p1.radius))))
				p2.p=add(p2.p,X(delta,diff*(p1.radius/(p2.radius+p1.radius))))
			}
		})

		p1.p.x=C(0,p1.p.x,SW()/W2S())
		p1.p.y=C(0,p1.p.y,SH()/W2S())
	})

	c.fillStyle="black"
	c.fillRect(0,0,SW(),SH())
	const gradient=c.createLinearGradient(0,0,0,SH()*0.7)
	gradient.addColorStop(0,'rgba(0,255,255,0)')
	gradient.addColorStop(1,'#FF00FF')
	c.fillStyle=gradient

	F(particle=>{
		c.beginPath();
		c.arc(
			particle.p.x*W2S(),
			particle.p.y*W2S(),
			particle.radius*W2S()*2,
			0,
			2*M.PI);
		c.fill();
	})

	B=undefined
	PS=PS.filter(x=>x.radius!==2)
},dt*1000)
