a.style=`width:100%;height:100%;object-fit:none`
M=Math

//v = Vector constructor
v=(x,y)=>({x:x,y:y})
//S: substract
S=(v1,v2)=>v(v1.x-v2.x,v1.y-v2.y)
//A: add
A=(v1,v2)=>v(v1.x+v2.x,v1.y+v2.y)
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
W=a.width
//ScreenHeight
H=a.height
//World2Screen
//900 is the reference screen height
//50 is the number of pixels per meter on the reference resolution
P=H/900*50

//PS: Particles
PS=[]
F=_=>PS.forEach(_)
for(let i=0;i<300;i++){
	PS[i]=MP(v(M.random(),M.random()),0.5)
}

a.onclick=e=>PS.push(MP(v(e.clientX/P,e.clientY/P),2))
//b.addEventListener("click",e=>{
//	PS.push(MP(v(e.clientX/P,e.clientY/P),2))
//})

//In millisecond
dt=1000/60/1000
setInterval(()=>{
	//Apply force
	//10 is the G force
	F(_=>_.a=v(0,10))

	//Verlet
	let dt2=dt*dt
	F(particle=>{
		let newPosition=A(
			particle.p,
			A(S(particle.p, particle.oldPosition),X(particle.a,dt2))
		)
		particle.oldPosition=particle.p
		particle.p=newPosition
	})

	//Update collisions
	F(p1=>{
		F(p2=>{
			if(p1!=p2){
				let delta=S(p2.p,p1.p)
				let deltaLength=L(delta)
				let restLength=p1.radius+p2.radius
				if(deltaLength>0.001 && deltaLength<restLength){
					let diff=(restLength-deltaLength)/deltaLength
					p1.p=S(p1.p,X(delta,diff*(p2.radius/restLength)))
					p2.p=A(p2.p,X(delta,diff*(p1.radius/restLength)))
				}
			}
		})

		p1.p.x=C(0,p1.p.x,W/P)
		p1.p.y=C(0,p1.p.y,H/P)
	})

	c.fillStyle="black"
	c.fillRect(0,0,W,H)
	let gradient=c.createLinearGradient(0,0,0,H*0.7)
	gradient.addColorStop(0,'rgba(0,255,255,0)')
	gradient.addColorStop(1,'#FF00FF')
	c.fillStyle=gradient

	F(particle=>{
		c.beginPath();
		c.arc(
			particle.p.x*P,
			particle.p.y*P,
			particle.radius*P*2,
			0,
			2*M.PI);
		c.fill();
	})

	PS=PS.filter(_=>_.radius!==2)
},dt*1000)
