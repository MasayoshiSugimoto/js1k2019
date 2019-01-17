
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

equilateralTriangle=(c,side,r)=>{
	let dv=v(0,side)
	return [
		a(c,matrixMultiply(rotationMatrix(r),v(0,-side))),
		a(c,matrixMultiply(rotationMatrix(r+(m.PI/3)),dv)),
		a(c,matrixMultiply(rotationMatrix(r-(m.PI/3)),dv))
	]
}

b=()=>m.floor(m.random()*256)

g=()=>`rgb(${b()},${b()},${b()})`

rot=0

drawTriangle=triangle=>{
	let triangleAsArray = equilateralTriangle(triangle.center,triangle.size,triangle.rotation)
	c.fillStyle=triangle.color
	c.beginPath()
	c.moveTo(triangleAsArray[0].x,triangleAsArray[0].y)
	c.lineTo(triangleAsArray[1].x,triangleAsArray[1].y)
	c.lineTo(triangleAsArray[2].x,triangleAsArray[2].y)
	c.fill()
}

const triangles=[]
let frameIndex=0
draw=()=>{
	let size=Math.random()*5
	triangles[frameIndex]={
		center:v(100,100),
		color:g(),
		size:size,
		speed:matrixMultiply(rotationMatrix(Math.random()*2*Math.PI),v(0,size/10)),
		rotation:0
	}
	c.fillStyle="black"
	c.fillRect(0,0,1000,1000)
	triangles.forEach(t=>{
		t.center=a(t.center,t.speed)
		drawTriangle(t)
	})
	frameIndex=frameIndex<999?frameIndex+1:0
	r(draw)
}

r(draw)

