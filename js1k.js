//a=vectorAdd
//c=canvas.getContext('2d')
//d=document
//z=document.createElement('canvas')
//v=vector constructor

d=document
z=d.createElement('canvas')
c=z.getContext('2d')
d.body.appendChild(z)
v=(x,y)=>({x:x,y:y})
a=(v1,v2)=>v(v1.x+v2.x,v1.y+v2.y)
rotationMatrix=angle => {
	let cosine=Math.cos(angle)	
	let sinus=Math.sin(angle)
	return [
		[cosine,-sinus],
		[sinus,cosine]
	]
}

matrixMultiply=(m,w)=>{
	return v(
		(m[0][0]*w.x)+(m[0][1]*w.y),
		(m[1][0]*w.x)+(m[1][1]*w.y)
	)
}

equilateralTriangle=(center,side,rotation)=>{
	dv=v(0,side)
	return [
		a(center,matrixMultiply(rotationMatrix(rotation),v(0,-side))),
		a(center,matrixMultiply(rotationMatrix(rotation+(2*Math.PI/6)),dv)),
		a(center,matrixMultiply(rotationMatrix(rotation-(2*Math.PI/6)),dv))
	]
}

drawTriangle=(x,y,side,rotation)=>{
	triangle=equilateralTriangle(v(x,y),side,rotation)
	c.fillStyle=randomRGB()
	c.beginPath()
	c.moveTo(triangle[0].x,triangle[0].y)
	c.lineTo(triangle[1].x,triangle[1].y)
	c.lineTo(triangle[2].x,triangle[2].y)
	c.fill()
}

randomComponent=()=>Math.floor(Math.random()*256)

randomRGB=()=>{
	return `rgb(${randomComponent()},${randomComponent()},${randomComponent()})`
}

rot=0
draw=()=>{
	rot+=0.01
	drawTriangle(100,100,50,rot)
	requestAnimationFrame(draw)
}

requestAnimationFrame(draw)

