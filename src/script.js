import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import * as dat from 'lil-gui'
import { BoxBufferGeometry, DoubleSide, KeyframeTrack } from 'three'
import gsap from 'gsap'
import ScrollTrigger from 'gsap/ScrollTrigger'
import dist from 'webpack-merge'

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()


/**
 * Floor
 */
const floorGeometry = new THREE.PlaneBufferGeometry(75, 50, 1, 1)

const floorMaterial = new THREE.MeshBasicMaterial({
    color: 'gray', side: DoubleSide, wireframe: false
})
const floorMesh = new THREE.Mesh(floorGeometry, floorMaterial)
floorMesh.rotation.x = Math.PI / 2, floorMesh.position.y = -1
scene.add(floorMesh)


/**
 * Object
 */
const geometry1 = new THREE.BoxBufferGeometry(6, 2, 4)
const material1 = new THREE.MeshBasicMaterial({ color: 'pink' })
const pinkMesh = new THREE.Mesh(geometry1, material1)
pinkMesh.position.x = 8, pinkMesh.position.z = - 2

const geometry2 = new THREE.BoxBufferGeometry(4, 2, 2)
const material2 = new THREE.MeshBasicMaterial({ color: 'orange' })
const orangeMesh = new THREE.Mesh(geometry2, material2)
orangeMesh.position.z = 5

const geometry3 = new THREE.BoxBufferGeometry(3, 2, 2)
const material3 = new THREE.MeshBasicMaterial({ color: 'purple' })
const purpleMesh = new THREE.Mesh(geometry3, material3)
purpleMesh.position.x = -11, purpleMesh.position.z = 1

const geometry4 = new THREE.BoxBufferGeometry(3, 2, 2)
const material4 = new THREE.MeshBasicMaterial({ color: 'violet' })
const violet = new THREE.Mesh(geometry4, material4)
violet.position.x = -5, violet.position.z = -4

const geometry5 = new THREE.BoxBufferGeometry(3, 2, 2)
const material5 = new THREE.MeshBasicMaterial({ color: 'brown' })
const brownMesh = new THREE.Mesh(geometry5, material5)
brownMesh.position.x = -14, brownMesh.position.z = -7

const group = window.group = new THREE.Group
group.add(pinkMesh)
group.add(orangeMesh)
group.add(purpleMesh)
group.add(violet)
group.add(brownMesh)
scene.add(group)
const meshes = { pinkMesh, orangeMesh, purpleMesh, violet, brownMesh }

/**
 * Sizes
 */
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

window.addEventListener('resize', () => {
    // Update sizes
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight

    // Update camera
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()
    playerCamera.aspect = sizes.width / sizes.height
    playerCamera.updateProjectionMatrix()

    // Update renderer
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
camera.position.x = -6.5, camera.position.y = 9, camera.position.z = 15
scene.add(camera)

// Player camera
const playerCamera = window.pCam = new THREE.PerspectiveCamera(50, sizes.width / sizes.height, 0.1, 50)
scene.add(playerCamera)
playerCamera.position.x = 5, playerCamera.position.z = 5
const playerCameraHelper = new THREE.CameraHelper(playerCamera)
scene.add(playerCameraHelper)

// Camera controller
const parameters = {
    cameraIndex: 0
}
const cameras = [camera, playerCamera]

// Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true

// Axes helper
const axesHelper = new THREE.AxesHelper(5)
scene.add(axesHelper)

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

/**
 * Debug
 */
const gui = new dat.GUI({
    width: 400
})

const floorGui = gui.addFolder("floor");
floorGui.add(floorMesh.rotation, "x").step(0.0001)
floorGui.add(floorMesh.position, "y").step(0.001)
floorGui.close()

const cameraGui = gui.addFolder("camera")
cameraGui.add(camera.position, "x").step(0.001)
cameraGui.add(camera.position, "y").step(0.001)
cameraGui.add(camera.position, "z").step(0.001)
cameraGui.close()

const playerCameraGui = gui.addFolder("player camera")
playerCameraGui.add(playerCamera.position, "x").step(0.001)
playerCameraGui.add(playerCamera.position, "y").step(0.001)
playerCameraGui.add(playerCamera.position, "z").step(0.001)
playerCameraGui.add(playerCamera.rotation, "x").step(0.001)
playerCameraGui.add(playerCamera.rotation, "y").step(0.001)
playerCameraGui.add(playerCamera.rotation, "z").step(0.001)
playerCameraGui.close()


/**
 * Animate
 */
const clock = new THREE.Clock()

const mouse = {
    x: 0, y: 0, scrollUp: undefined
},
    target = {
        x: 0, y: 0
    }
window.addEventListener('mousemove', (e) => {
    mouse.x = e.clientX
    mouse.y = e.clientY
})
canvas.addEventListener('wheel', (e) => {
    mouse.scrollUp = e.deltaY < 0
})

/**
 * Movement
 */
const defaultDist = 10
const savedPos = {
    x: 0, y: 0, z: 0
}
const pos = {
    x: 0, y: 0
}
const move = window.move = {
    restore: () => {
        playerCamera.position.x = savedPos.x
        playerCamera.position.y = savedPos.y
        playerCamera.position.z = savedPos.z
    },
    save: () => {
        savedPos.x = parseFloat(playerCamera.position.x)
        savedPos.y = parseFloat(playerCamera.position.y)
        savedPos.z = parseFloat(playerCamera.position.z)
    },
    forward: (dist = defaultDist, vec = 1) => {
        for (let i = 0; i < dist; i++) {
            for (let j = 0; j < 0.01 * vec; j += 0.001 * vec) {
                setTimeout(() => {
                    playerCamera.translateZ(-j)
                }, 20000 * j);
            }
        }
        return playerCamera.position.z
    },

    backward: (dist = defaultDist, vec = 1) => {
        for (let i = 0; i < dist; i++) {
            for (let j = 0; j < 0.01 * vec; j += 0.001 * vec) {
                setTimeout(() => {
                    playerCamera.translateZ(j)
                }, 20000 * j);
            }
        }
        return playerCamera.position.z
    },

    left: (dist = defaultDist, vec = 1) => {
        for (let i = 0; i < dist; i++) {
            for (let j = 0; j < 0.01 * vec; j += 0.001 * vec) {
                setTimeout(() => {
                    playerCamera.translateX(-j)
                }, 20000 * j);
            }
        }
        return playerCamera.position.x
    },
    right: (dist = defaultDist, vec = 1) => {
        for (let i = 0; i < dist; i++) {
            for (let j = 0; j < 0.01 * vec; j += 0.001 * vec) {
                setTimeout(() => {
                    playerCamera.translateX(j)
                }, 20000 * j);
            }
        }
        return playerCamera.position.x
    },
    lookAt: (object) => {
        playerCamera.lookAt(meshes[object].position)
    },
    rotateY: (val, vec = 1) => {
        gsap.to(playerCamera.rotation, { y: val, duration: vec })
    }
}

// please copy prev pos/rotation
const movements = window.movements = [
    {
        id: 1,
        position: {
            z: 3
        }
    },
    {
        id: 1,
        position: {
            z: 3,
            x: -5
        }
    },
    {
        id: 1,
        position: {
            z: 5,
            x: -5
        }
    },
    {
        id: 1,
        position: {
            z: 5,
            x: -15
        }
    },
    {
        id: 1,
        position: {
            x: -15,
            z: -5
        },
        rotation: {
            y: Math.PI / -2
        }
    },
    {
        id: 1,
        position: {
            x: -5,
            z: -7
        },
        rotation: {
            y: Math.PI / -2
        }
    },
    {
        id: 1,
        position: {
            z: -7,
            x: 12
        },
        rotation: {
            y: Math.PI
        }
    },
    {
        position: {
            x: 12,
            z: 5
        },
        rotation: {
            y: Math.PI / 2
        }
    },
    {
        position: {
            x: 5
        },
        rotation: {
        }
    }

]

gsap.registerPlugin(ScrollTrigger)
const tl = gsap.timeline({
    paused: true,
    scrollTrigger: {
        trigger: ".scrollTarget",
        start: "top top",
        end: "bottom 100%",
        scrub: 5,
        markers: { color: "white" }
    }

})

gsap.registerPlugin(ScrollTrigger)

movements.forEach((movement, j) => {
    if (movement.position) {
        tl.to(playerCamera.position, {
            x: movement.position.x || playerCamera.position.x,
            y: movement.position.y || playerCamera.position.y,
            z: movement.position.z || playerCamera.position.z,
            duration: 1
        })
    }
    if (movement.rotation &&
        // not smooth enough
        false) {
        tl.to(playerCamera.rotation, {
            x: movement.rotation.x || playerCamera.rotation.x,
            y: movement.rotation.y || playerCamera.rotation.y,
            z: movement.rotation.z || playerCamera.rotation.z,
            duration: 1
        })

    }
})


const start = window.start = () => {
    tl.restart()
}


const tick = () => {
    const elapsedTime = clock.getElapsedTime()

    // Update controls    
    controls.update()


    // Update camera
    const currentCamera = cameras[parameters.cameraIndex]

    // Camera movement
    target.x = (sizes.width - mouse.x) * 0.0002;
    target.y = (sizes.height - mouse.y) * 0.0002;
    playerCamera.rotation.x += 0.05 * (target.y - playerCamera.rotation.x);
    playerCamera.rotation.y += 0.05 * (target.x - playerCamera.rotation.y);


    // Render
    renderer.render(scene, currentCamera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()

const changeBtn = document.createElement('button')
changeBtn.innerText = "SWITCH CAMERA"
changeBtn.onclick = function (e) {
    if (parameters.cameraIndex == 1) {
        parameters.cameraIndex = 0

    } else {

        parameters.cameraIndex = 1
    }
}
gui.domElement.append(changeBtn)
const startBtn = document.createElement('button')
startBtn.innerText = "START"
startBtn.onclick = function (e) {
    start()
}
gui.domElement.append(startBtn)
const toggleAxesBtn = document.createElement('button')
toggleAxesBtn.innerText = "TOGGLE AXES"
toggleAxesBtn.onclick = function (e) {
    axesHelper.material.transparent = true
    axesHelper.material.opacity = +!Boolean(axesHelper.material.opacity)
}
gui.domElement.append(toggleAxesBtn)


const onKeyDown = function (event) {
    switch (event.code) {
        case "Space":
            startBtn.click()
            break
        case "Enter":
            changeBtn.click()
            break
    }
}


document.addEventListener('keydown', onKeyDown);
toggleAxesBtn.click()