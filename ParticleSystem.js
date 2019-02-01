a.style=`width:100%;height:100%;object-fit:none`
M=Math
R=M.random
Q=M.sqrt

//v = Vector constructor
v=(x,y)=>({x,y})
//A: add
A=(w,z)=>v(w.x+z.x,w.y+z.y)
//C: clamp
C=(a,b)=>M.min(b,M.max(a,0))
//X: multiply
X=(w,s)=>v(w.x*s,w.y*s)

//o: oldPosition
//p: position
//r: radius
//a: acceleration
//MP: makeParticle
MP=(p,r)=>({o:p,p,a:v(0,0),r})
//ScreenWidth
W=a.width
//ScreenHeight
H=a.height
//World2Screen
P=Q(W*H/900)

//PS: Particles
PS=[]
F=_=>PS.forEach(_)
T=(x,y)=>MP(X(A(X(v(W-150,H-300),.5),v(x,y)),1/P),.5)
for(i=1;i<300;i++)
	PS[i]=i<150
		?T(i,2*i)
		:T(i-150,(300-2*(i-150)))

a.onclick=e=>PS[0]=MP(v(e.clientX/P,e.clientY/P),2)

//Gradient
G=c.createLinearGradient(0,0,0,H*0.7)
T=G.addColorStop.bind(G)
T(0,'rgba(0,255,255,0)')
T(1,'#FF00FF')

S=_=>c.fillStyle=_

//dt In millisecond
//1000/60/1000
D=.017
setInterval(()=>{
	if(PS[0]){
		//Apply force
		//10 is the G force
		F(_=>_.a=v(0,10))

		//Verlet
		F(particle=>{
			T=A(
				particle.p,
				A(A(particle.p,X(particle.o,-1)),X(particle.a,D*D))
			)
			particle.o=particle.p
			particle.p=T
		})

		//Update collisions
		F(p1=>{
			F(p2=>{
				if(p1!=p2){
					let delta=A(p2.p,X(p1.p,-1))
					let deltaLength=Q(delta.x*delta.x+delta.y*delta.y)
					let restLength=p1.r+p2.r
					if(deltaLength>0.01 && deltaLength<restLength){
						let diff=(restLength-deltaLength)/deltaLength
						p1.p=A(p1.p,X(delta,-diff*(p2.r/restLength)))
						p2.p=A(p2.p,X(delta,diff*(p1.r/restLength)))
					}
				}
			})

			p1.p.x=C(p1.p.x,W/P)
			p1.p.y=C(p1.p.y,H/P)
		})

		PS[0]=PS[1]
	}

	S("black")
	c.fillRect(0,0,W,H)
	S(G)

	F(_=>{
		c.beginPath()
		c.arc(
			_.p.x*P,
			_.p.y*P,
			_.r*P*2,
			0,
			2*M.PI)
		c.fill()
	})
},D*1000)
