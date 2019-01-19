v=(x,y)=>({x:x,y:y})
const G=10
const PIXEL_PER_METER=50
const REST_LENGTH=0.4

function substract(v1, v2) {
	return v(
		v1.x-v2.x,
		v1.y-v2.y
	)
}

function add(v1, v2) {
	return v(
		v1.x+v2.x,
		v1.y+v2.y
	)
}

function length(v1) {
	return Math.sqrt(v1.x*v1.x+v1.y*v1.y)
}

function clamp(min, value, max) {
	return Math.min(max, Math.max(value, min))
}

function multiply(vector, scalar) {
	return v(vector.x*scalar, vector.y*scalar)
}

function createParticle(position) {
	return {
		oldPosition: position,
		position: position,
		acceleration: v(0,0),
	}
}

function toScreen(x) {
	return x*PIXEL_PER_METER
}

function toGameSpace(v1) {
	return v(v1.x/PIXEL_PER_METER, v1.y/PIXEL_PER_METER)
}

function applyForces(particles) {
	particles.forEach(particle => {
		particle.acceleration = v(0,G)
	})
}

function verlet(particles, deltaTimeSecond) {
	particles.forEach(particle => {
		const x = particle.position.x
			- particle.oldPosition.x
			+ particle.acceleration.x*deltaTimeSecond*deltaTimeSecond
		const y = particle.position.y
			- particle.oldPosition.y
			+ particle.acceleration.y*deltaTimeSecond*deltaTimeSecond
		const newPosition = v(particle.position.x+x, particle.position.y+y)
		particle.oldPosition = particle.position
		particle.position = newPosition
	})
}

function satisfyConstraints(particles) {
	particles.forEach(p1 => {
		particles.forEach(p2 => {
			if (p1 === p2) return
			const delta = substract(p2.position, p1.position)
			const deltaLength = length(delta)
			if (deltaLength > 0.001 && deltaLength < REST_LENGTH) {
				const diff = (REST_LENGTH - deltaLength) / deltaLength
				const dx = multiply(delta, 0.5*diff)
				p1.position = substract(p1.position, dx)
				p2.position = add(p2.position, dx)
			}
		})

		p1.position.x = clamp(0, p1.position.x, b.clientWidth/PIXEL_PER_METER)
		p1.position.y = clamp(0, p1.position.y, b.clientHeight/PIXEL_PER_METER)
	})
}

function draw(particles) {
	particles.forEach(particle => {
		c.beginPath();
		c.arc(
			toScreen(particle.position.x),
			toScreen(particle.position.y),
			10,
			0,
			2 * Math.PI);
		c.fill();
	})
}

function update(deltaTimeSecond, particles) {
	applyForces(particles)
	verlet(particles, deltaTimeSecond/1000)
	satisfyConstraints(particles)
	c.clearRect(0,0,10000,10000)
	draw(particles)
	bomb = undefined
}

const particles = []
for (let i = 0; i < 1000; i++) {
	particles[i] = createParticle(v(
		Math.random()*10,
		Math.random()*10
	))
}
window.c.fillStyle="black"

let bomb = undefined
window.b.addEventListener("click", e => {
	bomb = toGameSpace(v(e.clientX, e.clientY))
	console.log(`bombPosition = {x:${bomb.x}, y:${bomb.y})`)
})

setInterval(() => update(1000/60, particles), 1000/60)
