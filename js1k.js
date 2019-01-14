//a=vectorAdd
//b=randomComponent()
//c=canvas.getContext('2d')
//d=document
//e=center of the triangle
//g=randomRGB()
//m=Math
//r=requestAnimationFrame
//t=tmp
//v=vector constructor
//z=document.createElement('canvas')

d=document
r=requestAnimationFrame
m=Math
z=d.createElement('canvas')
c=z.getContext('2d')
d.body.appendChild(z)
v=(x,y)=>({x:x,y:y})
a=(v1,v2)=>v(v1.x+v2.x,v1.y+v2.y)

rotationMatrix=angle=>{
	cosine=m.cos(angle)	
	sinus=m.sin(angle)
	return [
		[cosine,-sinus],
		[sinus,cosine]
	]
}

matrixMultiply=(m,w)=>
	v(
		(m[0][0]*w.x)+(m[0][1]*w.y),
		(m[1][0]*w.x)+(m[1][1]*w.y)
	)

b=()=>m.floor(m.random()*256)

g=()=>`rgb(${b()},${b()},${b()})`

rot=0
draw=()=>{
	rot+=0.01
	e=v(100,100)
	t=v(0,50)
	t=[
		a(e,matrixMultiply(rotationMatrix(rot),v(0,-50))),
		a(e,matrixMultiply(rotationMatrix(rot+(m.PI/3)),t)),
		a(e,matrixMultiply(rotationMatrix(rot-(m.PI/3)),t))
	]
	c.fillStyle=g()
	c.beginPath()
	c.moveTo(t[0].x,t[0].y)
	c.lineTo(t[1].x,t[1].y)
	c.lineTo(t[2].x,t[2].y)
	c.fill()
	r(draw)
}

r(draw)

