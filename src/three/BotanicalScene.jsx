import { Suspense, useRef } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { ContactShadows, Environment, Lightformer, useGLTF } from '@react-three/drei'
import * as THREE from 'three'
import { models } from '../data/media'
import { DriftingLeaves, ProceduralSpecimen } from './Specimen'

/* Camera path for the scroll-driven orbit: wide → close leaf study → overhead. */
const camPath = new THREE.CatmullRomCurve3([
  new THREE.Vector3(0, 2.6, 9.2),
  new THREE.Vector3(3.8, 3.1, 6.0),
  new THREE.Vector3(2.6, 3.6, 4.2),
  new THREE.Vector3(-0.4, 7.6, 3.4),
])
const lookFrom = new THREE.Vector3(0, 1.6, 0)
const lookTo = new THREE.Vector3(0, 1.0, 0)

function GLBSpecimen({ url }) {
  const { scene } = useGLTF(url)
  scene.traverse((o) => {
    if (o.isMesh) {
      o.castShadow = true
      o.receiveShadow = true
    }
  })
  return <primitive object={scene} />
}

function Rig({ progress, mouse, children }) {
  const group = useRef()
  const { camera } = useThree()
  const target = useRef(new THREE.Vector3())
  const pos = useRef(new THREE.Vector3())

  useFrame((_, dt) => {
    const p = THREE.MathUtils.clamp(progress.current, 0, 1)
    camPath.getPoint(p, pos.current)
    camera.position.lerp(pos.current, 1 - Math.pow(0.001, dt))
    target.current.lerpVectors(lookFrom, lookTo, p)
    camera.lookAt(target.current)

    // Scroll spins the specimen; the cursor tilts it.
    const g = group.current
    g.rotation.y = THREE.MathUtils.lerp(g.rotation.y, p * Math.PI * 1.25 + mouse.current.x * 0.35, 0.06)
    g.rotation.x = THREE.MathUtils.lerp(g.rotation.x, -mouse.current.y * 0.08, 0.06)
  })
  return <group ref={group}>{children}</group>
}

export default function BotanicalScene({ progress, active = true, mobile = false }) {
  const mouse = useRef(new THREE.Vector2())
  const onMove = (e) => {
    const r = e.currentTarget.getBoundingClientRect()
    mouse.current.set(((e.clientX - r.left) / r.width) * 2 - 1, -(((e.clientY - r.top) / r.height) * 2 - 1))
  }

  return (
    <div className="botanical-canvas" onPointerMove={onMove} onPointerLeave={() => mouse.current.set(0, 0)}>
      <Canvas
        shadows={!mobile}
        dpr={[1, mobile ? 1.25 : 1.75]}
        camera={{ position: [0, 2.4, 7.6], fov: 38, near: 0.1, far: 60 }}
        gl={{ antialias: true, alpha: true, toneMapping: THREE.ACESFilmicToneMapping }}
        frameloop={active ? 'always' : 'never'}
      >
        <fog attach="fog" args={['#10251D', 7, 18]} />
        <ambientLight intensity={0.35} />
        <directionalLight
          position={[4, 8, 3]}
          intensity={2.2}
          color="#fff3d6"
          castShadow={!mobile}
          shadow-mapSize={[1024, 1024]}
          shadow-camera-left={-4}
          shadow-camera-right={4}
          shadow-camera-top={4}
          shadow-camera-bottom={-4}
          shadow-bias={-0.0004}
        />
        <pointLight position={[-4, 2, -3]} intensity={18} color="#A8D85A" distance={12} />

        {/* Local studio lighting — no external HDR download. */}
        <Environment resolution={128}>
          <Lightformer form="rect" intensity={2.5} position={[0, 5, -6]} scale={[10, 4, 1]} color="#f5f4ee" />
          <Lightformer form="rect" intensity={1.2} position={[-6, 2, 0]} rotation-y={Math.PI / 2} scale={[8, 3, 1]} color="#a8d85a" />
          <Lightformer form="ring" intensity={1.5} position={[5, 4, 4]} scale={2} color="#fff1cc" />
        </Environment>

        {/* On desktop the specimen sits right of centre so the chapter copy reads cleanly. */}
        <group position={[mobile ? 0 : 1.1, mobile ? 0.6 : 0, 0]}>
          <Rig progress={progress} mouse={mouse}>
            <Suspense fallback={null}>
              {models.specimen ? <GLBSpecimen url={models.specimen} /> : <ProceduralSpecimen shadows={!mobile} />}
            </Suspense>
          </Rig>
          <ContactShadows position={[0, -0.19, 0]} opacity={0.55} scale={9} blur={2.6} far={3} color="#000" />
        </group>
        <DriftingLeaves count={mobile ? 18 : 42} />
      </Canvas>
    </div>
  )
}
