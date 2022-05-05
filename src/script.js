import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import * as dat from 'lil-gui'
import { BoxBufferGeometry, DoubleSide } from 'three'

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()


/**
 * Floor
 */
const floorGeometry = new THREE.PlaneBufferGeometry(15, 15, 1, 1)

const floorMaterial = new THREE.MeshBasicMaterial({
    color: 'gray', side: DoubleSide
})
const floorMesh = new THREE.Mesh(floorGeometry, floorMaterial)
floorMesh.rotation.x = Math.PI / 2, floorMesh.position.y = -0.5
scene.add(floorMesh)


/**
 * Object
 */
const geometry1 = new THREE.BoxBufferGeometry(1, 1, 1)

const material1 = new THREE.MeshBasicMaterial({ color: 'pink' })
const mesh1 = new THREE.Mesh(geometry1, material1)
mesh1.position.x = 2
scene.add(mesh1)

const geometry2 = new THREE.BoxBufferGeometry(1, 1, 1)
const material2 = new THREE.MeshBasicMaterial({ color: 'yellow' })
const mesh2 = new THREE.Mesh(geometry2, material2)
mesh2.position.z = 2
scene.add(mesh2)

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

    // Update renderer
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
camera.position.x = -6.5, camera.position.y = 9, camera.position.z = 5
scene.add(camera)

// Player camera
const playerCamera = new THREE.PerspectiveCamera(50, sizes.width / sizes.height, 0.1, 100)
scene.add(playerCamera)
playerCamera.position.x = 8
const playerCameraHelper = new THREE.CameraHelper(playerCamera)
scene.add(playerCameraHelper)

// Camera controller
const parameters = {
    cameraIndex: 1
}
const cameras = [camera, playerCamera]

// Controls
const playerControls = new OrbitControls(playerCamera, canvas)
playerControls.enableDamping = true
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

const cameraGui = gui.addFolder("camera")
cameraGui.add(camera.position, "x").step(0.001)
cameraGui.add(camera.position, "y").step(0.001)
cameraGui.add(camera.position, "z").step(0.001)
cameraGui.add(parameters, 'cameraIndex', [0, 1])

const playerCameraGui = gui.addFolder("player camera")
playerCameraGui.add(playerCamera.position, "x").step(0.001)
playerCameraGui.add(playerCamera.position, "y").step(0.001)
playerCameraGui.add(playerCamera.position, "z").step(0.001)
playerCameraGui.add(playerCamera.rotation, "x").step(0.001)
playerCameraGui.add(playerCamera.rotation, "y").step(0.001)
playerCameraGui.add(playerCamera.rotation, "z").step(0.001)


/**
 * Animate
 */
const clock = new THREE.Clock()

const tick = () => {
    const elapsedTime = clock.getElapsedTime()
    
    // Update controls    
    controls.update()

    // Update camera
    const currentCamera = cameras[parameters.cameraIndex]
    
    // Render
    renderer.render(scene, currentCamera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()