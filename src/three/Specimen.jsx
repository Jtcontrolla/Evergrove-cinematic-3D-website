import { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

/* ------------------------------------------------------------------ */
/*  Procedural botanical specimen — real 3D geometry generated in code */
/* ------------------------------------------------------------------ */

function seeded(seed) {
  let s = seed
  return () => {
    s = (s * 16807) % 2147483647
    return (s - 1) / 2147483646
  }
}

/** Painted leaf texture: tonal gradient, midrib and lateral veins. */
function makeLeafTexture() {
  const c = document.createElement('canvas')
  c.width = 256
  c.height = 512
  const g = c.getContext('2d')
  const grad = g.createLinearGradient(0, 512, 0, 0)
  grad.addColorStop(0, '#1d4a2a')
  grad.addColorStop(0.6, '#2f6b3a')
  grad.addColorStop(1, '#3f7f42')
  g.fillStyle = grad
  g.fillRect(0, 0, 256, 512)
  // lateral veins
  g.strokeStyle = 'rgba(190, 230, 140, 0.28)'
  g.lineWidth = 2
  for (let i = 0; i < 14; i++) {
    const y = 470 - i * 32
    for (const side of [-1, 1]) {
      g.beginPath()
      g.moveTo(128, y)
      g.quadraticCurveTo(128 + side * 60, y - 30, 128 + side * 128, y - 70)
      g.stroke()
    }
  }
  // midrib
  g.strokeStyle = 'rgba(205, 240, 150, 0.55)'
  g.lineWidth = 5
  g.beginPath()
  g.moveTo(128, 512)
  g.lineTo(128, 10)
  g.stroke()
  const tex = new THREE.CanvasTexture(c)
  tex.colorSpace = THREE.SRGBColorSpace
  tex.anisotropy = 4
  return tex
}

/** Heart-shaped leaf with optional fenestrations, cupped and curled in 3D. */
function makeLeafGeometry({ holes = true, cup = 0.35, curl = 0.22 } = {}) {
  const s = new THREE.Shape()
  s.moveTo(0, 0)
  s.bezierCurveTo(-0.35, -0.08, -0.78, 0.18, -0.74, 0.62)
  s.bezierCurveTo(-0.7, 0.98, -0.32, 1.22, 0, 1.4)
  s.bezierCurveTo(0.32, 1.22, 0.7, 0.98, 0.74, 0.62)
  s.bezierCurveTo(0.78, 0.18, 0.35, -0.08, 0, 0)

  if (holes) {
    const slots = [
      [-0.42, 0.42, 0.06, 0.14, 0.5],
      [0.42, 0.42, 0.06, 0.14, -0.5],
      [-0.46, 0.72, 0.05, 0.12, 0.7],
      [0.46, 0.72, 0.05, 0.12, -0.7],
      [-0.3, 0.98, 0.04, 0.09, 0.8],
      [0.3, 0.98, 0.04, 0.09, -0.8],
    ]
    slots.forEach(([x, y, rx, ry, rot]) => {
      const p = new THREE.Path()
      p.absellipse(x, y, rx, ry, 0, Math.PI * 2, false, rot)
      s.holes.push(p)
    })
  }

  const geo = new THREE.ShapeGeometry(s, 28)
  const pos = geo.attributes.position
  const uv = new Float32Array(pos.count * 2)
  for (let i = 0; i < pos.count; i++) {
    const x = pos.getX(i)
    const y = pos.getY(i)
    uv[i * 2] = (x + 0.8) / 1.6
    uv[i * 2 + 1] = y / 1.4
    // cup across the width, curl back along the length, slight midrib fold
    const z = cup * x * x + curl * y * y - 0.06 * Math.abs(x)
    pos.setZ(i, z)
  }
  geo.setAttribute('uv', new THREE.BufferAttribute(uv, 2))
  geo.computeVertexNormals()
  return geo
}

const UP = new THREE.Vector3(0, 1, 0)

function useSpecimenLayout(count, seed = 7) {
  return useMemo(() => {
    const r = seeded(seed)
    const out = []
    for (let i = 0; i < count; i++) {
      const a = i * 2.39996 // golden angle
      const t = i / (count - 1)
      const radius = 0.55 + t * 0.85 + r() * 0.15
      const height = 2.6 - t * 1.25 + r() * 0.25
      const outward = new THREE.Vector3(Math.cos(a), 0, Math.sin(a))
      const tip = outward.clone().multiplyScalar(radius).setY(height)

      // stem: rises from the pot, arcs outward to the leaf
      const curve = new THREE.CatmullRomCurve3([
        new THREE.Vector3(0, 0.55, 0),
        outward.clone().multiplyScalar(radius * 0.15).setY(height * 0.55),
        outward.clone().multiplyScalar(radius * 0.7).setY(height * 0.98),
        tip,
      ])

      // leaf orientation: length points outward (drooping with age), face up
      const tilt = 0.55 - t * 0.75 + (r() - 0.5) * 0.2
      const dir = outward.clone().multiplyScalar(Math.cos(tilt)).add(UP.clone().multiplyScalar(Math.sin(tilt))).normalize()
      const side = new THREE.Vector3().crossVectors(dir, UP).normalize()
      const normal = new THREE.Vector3().crossVectors(side, dir).normalize()
      const q = new THREE.Quaternion().setFromRotationMatrix(new THREE.Matrix4().makeBasis(side, dir, normal))
      q.multiply(new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 1, 0), (r() - 0.5) * 0.5))

      out.push({ curve, tip, q, scale: 0.75 + (1 - Math.abs(t - 0.55)) * 0.55 + r() * 0.15, phase: r() * 6.28, holes: i > 1 })
    }
    return out
  }, [count, seed])
}

function Leaf({ data, geoHoles, geoPlain, material }) {
  const ref = useRef()
  useFrame((state) => {
    const t = state.clock.elapsedTime
    ref.current.rotation.x = Math.sin(t * 0.9 + data.phase) * 0.035
    ref.current.rotation.z = Math.sin(t * 0.6 + data.phase) * 0.03
  })
  return (
    <group position={data.tip} quaternion={data.q}>
      <mesh ref={ref} geometry={data.holes ? geoHoles : geoPlain} material={material} scale={data.scale} castShadow receiveShadow />
    </group>
  )
}

export function ProceduralSpecimen({ shadows = true }) {
  const leaves = useSpecimenLayout(11)
  const tex = useMemo(makeLeafTexture, [])
  const geoHoles = useMemo(() => makeLeafGeometry({ holes: true }), [])
  const geoPlain = useMemo(() => makeLeafGeometry({ holes: false, cup: 0.45, curl: 0.15 }), [])
  const leafMat = useMemo(
    () =>
      new THREE.MeshPhysicalMaterial({
        map: tex,
        roughness: 0.48,
        clearcoat: 0.35,
        clearcoatRoughness: 0.4,
        sheen: 0.4,
        sheenColor: new THREE.Color('#A8D85A'),
        side: THREE.DoubleSide,
      }),
    [tex],
  )
  const stemMat = useMemo(() => new THREE.MeshStandardMaterial({ color: '#3d6b35', roughness: 0.6 }), [])
  const stems = useMemo(() => leaves.map((l) => new THREE.TubeGeometry(l.curve, 24, 0.022, 6, false)), [leaves])

  return (
    <group>
      {/* Planter + plinth */}
      <mesh position={[0, 0.3, 0]} castShadow={shadows} receiveShadow>
        <cylinderGeometry args={[0.62, 0.5, 0.6, 48]} />
        <meshStandardMaterial color="#d9d6cb" roughness={0.85} />
      </mesh>
      <mesh position={[0, 0.58, 0]}>
        <cylinderGeometry args={[0.57, 0.57, 0.04, 48]} />
        <meshStandardMaterial color="#2a2118" roughness={1} />
      </mesh>
      <mesh position={[0, -0.1, 0]} receiveShadow>
        <cylinderGeometry args={[1.5, 1.6, 0.2, 64]} />
        <meshStandardMaterial color="#1a2a21" roughness={0.9} />
      </mesh>

      {stems.map((g, i) => (
        <mesh key={i} geometry={g} material={stemMat} castShadow={shadows} />
      ))}
      {leaves.map((l, i) => (
        <Leaf key={i} data={l} geoHoles={geoHoles} geoPlain={geoPlain} material={leafMat} />
      ))}
    </group>
  )
}

/** Small leaves drifting through the scene for depth and atmosphere. */
export function DriftingLeaves({ count = 40 }) {
  const ref = useRef()
  const geo = useMemo(() => makeLeafGeometry({ holes: false, cup: 0.4, curl: 0.1 }), [])
  const seeds = useMemo(() => {
    const r = seeded(42)
    return Array.from({ length: count }, () => ({
      x: (r() - 0.5) * 12,
      y: r() * 8 - 1,
      z: (r() - 0.5) * 10 - 2,
      s: 0.08 + r() * 0.12,
      sp: 0.15 + r() * 0.25,
      rot: r() * 6.28,
    }))
  }, [count])
  const dummy = useMemo(() => new THREE.Object3D(), [])

  useFrame((state) => {
    const t = state.clock.elapsedTime
    seeds.forEach((s, i) => {
      const y = ((s.y + t * s.sp) % 9) - 1
      dummy.position.set(s.x + Math.sin(t * 0.4 + s.rot) * 0.6, y, s.z)
      dummy.rotation.set(t * 0.5 + s.rot, t * 0.3 + s.rot, Math.sin(t + s.rot))
      dummy.scale.setScalar(s.s)
      dummy.updateMatrix()
      ref.current.setMatrixAt(i, dummy.matrix)
    })
    ref.current.instanceMatrix.needsUpdate = true
  })

  return (
    <instancedMesh ref={ref} args={[geo, undefined, count]}>
      <meshStandardMaterial color="#6f9f45" side={THREE.DoubleSide} roughness={0.6} />
    </instancedMesh>
  )
}
