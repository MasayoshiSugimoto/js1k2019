canvasElement = document.createElement('canvas')
canvas = canvasElement.getContext('2d')
document.body.appendChild(canvasElement)

vector = (x,y) => ({x:x,y:y})

vectorAdd = (v1, v2) => vector(v1.x+v2.x, v1.y+v2.y)

rotationMatrix = angle => {
	let cosine = Math.cos(angle)	
	let sinus = Math.sin(angle)
	return [
		[cosine, -sinus],
		[sinus, cosine]
	]
}

matrixMultiply = (m, v) => {
	return vector(
		(m[0][0]*v.x)+(m[0][1]*v.y),
		(m[1][0]*v.x)+(m[1][1]*v.y)
	)
}

equilateralTriangle = (center, side, rotation) => {
	dv = vector(0, side)
	return [
		vectorAdd(center, matrixMultiply(rotationMatrix(rotation), vector(0, -side))),
		vectorAdd(center, matrixMultiply(rotationMatrix(rotation+(2*Math.PI/6)), dv)),
		vectorAdd(center, matrixMultiply(rotationMatrix(rotation-(2*Math.PI/6)), dv))
	]
}

drawTriangle = (x,y,side,rotation) => {
	triangle = equilateralTriangle(vector(x, y), side, rotation)
	canvas.fillStyle=randomRGB()
	canvas.beginPath()
	canvas.moveTo(triangle[0].x,triangle[0].y)
	canvas.lineTo(triangle[1].x,triangle[1].y)
	canvas.lineTo(triangle[2].x,triangle[2].y)
	canvas.fill()
}

randomComponent = () => Math.floor(Math.random() * 256)

randomRGB = () => {
	return `rgb(${randomComponent()}, ${randomComponent()}, ${randomComponent()})`
}

rot = 0
draw = () => {
	rot += 0.01
	drawTriangle(100, 100, 50, rot)
	requestAnimationFrame(draw)
}

requestAnimationFrame(draw)

