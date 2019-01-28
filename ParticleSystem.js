a.style=`width:100%;height:100%;object-fit:none`
M=Math
R=M.random
Q=M.sqrt

//v = Vector constructor
v=(x,y)=>({x,y})
//A: add
A=(v1,v2)=>v(v1.x+v2.x,v1.y+v2.y)
//L: length
L=v1=>Q(v1.x*v1.x+v1.y*v1.y)
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
P=Q(W*H/900)

//PS: Particles
PS=[]
F=_=>PS.forEach(_)
for(i=1;i<300;i++)
	PS[i]=MP(v(R()*W/P,R()*H/P),0.5)

a.onclick=e=>PS[0]=MP(v(e.clientX/P,e.clientY/P),2)

//Gradient
G=c.createLinearGradient(0,0,0,H*0.7)
T=G.addColorStop.bind(G)
T(0,'rgba(0,255,255,0)')
T(1,'#FF00FF')

//dt In millisecond
//1000/60/1000
D=.017
setInterval(()=>{
	//Apply force
	//10 is the G force
	F(_=>_.a=v(0,10))

	//Verlet
	F(particle=>{
		T=A(
			particle.p,
			A(A(particle.p,X(particle.oldPosition,-1)),X(particle.a,D*D))
		)
		particle.oldPosition=particle.p
		particle.p=T
	})

	//Update collisions
	F(p1=>{
		F(p2=>{
			if(p1!=p2){
				let delta=A(p2.p,X(p1.p,-1))
				let deltaLength=L(delta)
				let restLength=p1.radius+p2.radius
				if(deltaLength>0.01 && deltaLength<restLength){
					let diff=(restLength-deltaLength)/deltaLength
					p1.p=A(p1.p,X(delta,-diff*(p2.radius/restLength)))
					p2.p=A(p2.p,X(delta,diff*(p1.radius/restLength)))
				}
			}
		})

		p1.p.x=C(0,p1.p.x,W/P)
		p1.p.y=C(0,p1.p.y,H/P)
	})

	c.fillStyle="black"
	c.fillRect(0,0,W,H)
	c.fillStyle=G

	F(particle=>{
		c.beginPath()
		c.arc(
			particle.p.x*P,
			particle.p.y*P,
			particle.radius*P*2,
			0,
			2*M.PI)
		c.fill()
	})

	PS[0]=PS[1]
},D*1000)
