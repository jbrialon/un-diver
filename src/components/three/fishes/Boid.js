/* eslint-disable */
// Based on http://www.openprocessing.org/visuals/?visualID=6910
import * as THREE from 'three'

export default class Fish {
  vector = new THREE.Vector3()
  _acceleration
  _width
  _height
  _depth
  _goal
  _goalOffset = new THREE.Vector3()
  _neighborhoodRadius = 20
  _maxSpeed = 1 + Math.random()
  _maxSteerForce = 0.02

  position = new THREE.Vector3()
  velocity = new THREE.Vector3()
  _acceleration = new THREE.Vector3()

  constructor () {
  }
  
  setGoal (target) {
    this._goal = target
  }

  setGoalOffset (target) {
    this._goalOffset = target
  }

  run (boids) {
    if (Math.random() > 0.2) {
      this.flock(boids)
    }
    this.move()
  }

  flock (boids) {
    if (this._goal) {
      this._acceleration.add(this.reach(this._goal.clone().add(this._goalOffset), Math.random() * 0.002))
    }

    this._acceleration.add(this.alignment(boids))
    this._acceleration.add(this.cohesion(boids))
    this._acceleration.add(this.separation(boids))
  }

  move () {
    this.velocity.add(this._acceleration)

    var l = this.velocity.length()

    if (l > this._maxSpeed) {
      this.velocity.divideScalar(l / this._maxSpeed)
    }

    this.position.add(this.velocity)
    this._acceleration.set(0, 0, 0)
  }

  checkBounds () {
    if (this.position.x >   this._width) this.position.x = - this._width
    if (this.position.x < - this._width) this.position.x =   this._width
    if (this.position.y >   this._height) this.position.y = - this._height
    if (this.position.y < - this._height) this.position.y =  this._height
    if (this.position.z >  this._depth) this.position.z = - this._depth
    if (this.position.z < - this._depth) this.position.z =  this._depth
  }

  //

  avoid (target) {
    var steer = new THREE.Vector3()

    steer.copy(this.position)
    steer.sub(target)

    steer.multiplyScalar(1 / this.position.distanceToSquared(target))

    return steer
  }

  repulse (target) {
    var distance = this.position.distanceTo(target)

    if (distance < this._neighborhoodRadius * 3) {
      var steer = new THREE.Vector3()

      steer.subVectors(this.position, target)
      steer.multiplyScalar(0.5 / distance)

      this._acceleration.add(steer)
    }
  }

  reach (target, amount) {
    var steer = new THREE.Vector3()
    steer.subVectors(target, this.position)
    steer.multiplyScalar(amount)

    var distance = this.position.distanceTo(target)
    if (distance > 300) {
      this._maxSpeed = this._maxSpeed * 10
    } else {
      this._maxSpeed = 0.7
    }

    return steer
  }

  alignment (boids) {
    var boid, velSum = new THREE.Vector3(),
    count = 0

    for (var i = 0, il = boids.length; i < il; i++) {
      if (Math.random() > 0.6) continue

      boid = boids[ i ]

      this.distance = boid.position.distanceTo(this.position)

      if (this.distance > 0 && this.distance <= this._neighborhoodRadius) {
        velSum.add(boid.velocity)
        count++
      }
    }

    if (count > 0) {
      velSum.divideScalar(count)
      var l = velSum.length()
      if (l > this._maxSteerForce) {
        velSum.divideScalar(l / this._maxSteerForce)
      }
    }
    return velSum
  }

  cohesion (boids) {
    var boid, distance,
    posSum = new THREE.Vector3(),
    steer = new THREE.Vector3(),
    count = 0

    for (var i = 0, il = boids.length; i < il; i++) {
      if (Math.random() > 0.6) continue
      boid = boids[ i ]
      distance = boid.position.distanceTo(this.position)

      if (distance > 0 && distance <= this._neighborhoodRadius) {
        posSum.add(boid.position)
        count++
      }
    }

    if (count > 0) {
      posSum.divideScalar(count)
    }

    steer.subVectors(posSum, this.position)

    var l = steer.length()

    if (l > this._maxSteerForce) {
      steer.divideScalar(l / this._maxSteerForce)
    }
    return steer
  }

  separation (boids) {
    var boid, distance,
    posSum = new THREE.Vector3(),
    repulse = new THREE.Vector3()

    for (var i = 0, il = boids.length; i < il; i++) {
      if (Math.random() > 0.6) continue

      boid = boids[ i ]
      distance = boid.position.distanceTo(this.position)

      if (distance > 0 && distance <= this._neighborhoodRadius) {
        repulse.subVectors(this.position, boid.position)
        repulse.normalize()
        repulse.divideScalar(distance)
        posSum.add(repulse)
      }
    }

    return posSum
  }
}