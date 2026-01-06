/*
==================================================
  REALISTIC SMARTPHONE 3D MODEL - FINAL FIX
  ✅ Corner radius < half thickness (no distortion)
  ✅ Larger Z separations (no z-fighting/flickering)
  ✅ Clean material attachment
==================================================
*/

import React, { useRef, useMemo } from 'react';
import { RoundedBox } from '@react-three/drei';
import * as THREE from 'three';

export function PhoneModel({ rotation, ...props }) {
    const group = useRef();

    // === DIMENSIONS ===
    const WIDTH = 2.6;
    const HEIGHT = 5.9;
    const THICKNESS = 0.22;
    // CRITICAL: Corner radius must be < THICKNESS/2 = 0.11
    const CORNER_RADIUS = 0.10;

    // === PBR MATERIALS (Silver/Titanium for white background) ===

    const frameMaterial = useMemo(() => new THREE.MeshStandardMaterial({
        color: "#e8e8ed",
        metalness: 0.9,
        roughness: 0.25,
    }), []);

    const frontGlassMaterial = useMemo(() => new THREE.MeshStandardMaterial({
        color: "#1a1a1a",
        metalness: 0.0,
        roughness: 0.02,
        polygonOffset: true,
        polygonOffsetFactor: 1,
        polygonOffsetUnits: 1,
    }), []);

    const backGlassMaterial = useMemo(() => new THREE.MeshStandardMaterial({
        color: "#d1d1d6",
        metalness: 0.2,
        roughness: 0.4,
        polygonOffset: true,
        polygonOffsetFactor: 1,
        polygonOffsetUnits: 1,
    }), []);

    const lensMaterial = useMemo(() => new THREE.MeshStandardMaterial({
        color: "#1a1a2e",
        metalness: 0.9,
        roughness: 0.05,
    }), []);

    const ringMaterial = useMemo(() => new THREE.MeshStandardMaterial({
        color: "#c0c0c5",
        metalness: 1.0,
        roughness: 0.1,
    }), []);

    // === SCREEN TEXTURE ===
    const screenTexture = useMemo(() => {
        if (typeof document === 'undefined') return null;
        const canvas = document.createElement('canvas');
        canvas.width = 1080;
        canvas.height = 2340;
        const ctx = canvas.getContext('2d');
        const gradient = ctx.createLinearGradient(0, 0, 0, 2340);
        gradient.addColorStop(0, '#0a0a0a');
        gradient.addColorStop(1, '#000000');
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, 1080, 2340);
        const tex = new THREE.CanvasTexture(canvas);
        tex.colorSpace = THREE.SRGBColorSpace;
        return tex;
    }, []);

    const HALF_T = THICKNESS / 2;

    return (
        <group ref={group} rotation={rotation} {...props} dispose={null}>

            {/* ========================================
          MAIN BODY - Solid titanium frame
      ========================================= */}
            <RoundedBox
                args={[WIDTH, HEIGHT, THICKNESS]}
                radius={CORNER_RADIUS}
                smoothness={16}
                material={frameMaterial}
            />

            {/* ========================================
          FRONT FACE - Pushed forward to avoid z-fighting
          Offset by 0.01 from body surface
      ========================================= */}
            <group position={[0, 0, HALF_T + 0.01]}>

                {/* Front Glass - thicker for more rounded corners */}
                <RoundedBox
                    args={[WIDTH - 0.04, HEIGHT - 0.04, 0.04]}
                    radius={0.018}
                    smoothness={16}
                    material={frontGlassMaterial}
                />

                {/* Screen Display - offset 0.015 from glass */}
                {screenTexture && (
                    <mesh position={[0, 0, 0.015]}>
                        <planeGeometry args={[WIDTH - 0.12, HEIGHT - 0.12]} />
                        <meshStandardMaterial
                            map={screenTexture}
                            roughness={0.05}
                            depthWrite={false}
                        />
                    </mesh>
                )}

                {/* Dynamic Island - offset 0.016 from glass */}
                <mesh position={[0, HEIGHT / 2 - 0.26, 0.016]} rotation={[0, 0, Math.PI / 2]}>
                    <capsuleGeometry args={[0.09, 0.42, 4, 16]} />
                    <meshBasicMaterial color="#000" depthWrite={false} />
                </mesh>

            </group>

            {/* ========================================
          BACK FACE - Pushed backward to avoid z-fighting
          Offset by 0.01 from body surface
      ========================================= */}
            <group position={[0, 0, -HALF_T - 0.01]}>

                {/* Back Glass - thicker for more rounded corners */}
                <RoundedBox
                    args={[WIDTH - 0.04, HEIGHT - 0.04, 0.04]}
                    radius={0.018}
                    smoothness={16}
                    material={backGlassMaterial}
                />

            </group>

            {/* ========================================
          CAMERA MODULE - on back, well separated
      ========================================= */}
            <group position={[0.65, 1.95, -HALF_T - 0.02]}>

                {/* Camera Bump Platform - offset 0.03 */}
                <RoundedBox
                    args={[1.1, 1.1, 0.06]}
                    radius={0.025} // Safe: 0.025 < 0.06/2 = 0.03 ✅
                    smoothness={8}
                    material={backGlassMaterial}
                    position={[0, 0, -0.03]}
                />

                {/* Camera 1 (Main) - offset 0.07 total */}
                <group position={[-0.28, 0.28, -0.07]}>
                    <mesh rotation={[Math.PI / 2, 0, 0]} material={ringMaterial}>
                        <cylinderGeometry args={[0.22, 0.22, 0.035, 32]} />
                    </mesh>
                    <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, 0, -0.03]} material={lensMaterial}>
                        <sphereGeometry args={[0.15, 24, 24, 0, Math.PI * 2, 0, Math.PI * 0.4]} />
                    </mesh>
                </group>

                {/* Camera 2 (Ultra Wide) - offset 0.07 total */}
                <group position={[-0.28, -0.28, -0.07]}>
                    <mesh rotation={[Math.PI / 2, 0, 0]} material={ringMaterial}>
                        <cylinderGeometry args={[0.22, 0.22, 0.035, 32]} />
                    </mesh>
                    <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, 0, -0.03]} material={lensMaterial}>
                        <sphereGeometry args={[0.15, 24, 24, 0, Math.PI * 2, 0, Math.PI * 0.4]} />
                    </mesh>
                </group>

                {/* Camera 3 (Telephoto) - offset 0.07 total */}
                <group position={[0.28, -0.28, -0.07]}>
                    <mesh rotation={[Math.PI / 2, 0, 0]} material={ringMaterial}>
                        <cylinderGeometry args={[0.22, 0.22, 0.035, 32]} />
                    </mesh>
                    <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, 0, -0.03]} material={lensMaterial}>
                        <sphereGeometry args={[0.15, 24, 24, 0, Math.PI * 2, 0, Math.PI * 0.4]} />
                    </mesh>
                </group>

                {/* Flash - positioned at top-right inside camera module */}
                <mesh position={[0.28, 0.28, -0.065]} rotation={[Math.PI / 2, 0, 0]}>
                    <cylinderGeometry args={[0.06, 0.06, 0.01, 24]} />
                    <meshStandardMaterial color="#fff5e0" emissive="#fff5e0" emissiveIntensity={0.3} />
                </mesh>

                {/* LiDAR - positioned at top center inside camera module */}
                <mesh position={[0, 0.35, -0.065]} rotation={[Math.PI / 2, 0, 0]}>
                    <cylinderGeometry args={[0.05, 0.05, 0.01, 24]} />
                    <meshStandardMaterial color="#0a0a15" />
                </mesh>

            </group>

            {/* ========================================
          BUTTONS - Clean attachment
      ========================================= */}

            <mesh position={[WIDTH / 2 + 0.006, 0.65, 0]} material={frameMaterial}>
                <boxGeometry args={[0.012, 0.48, 0.08]} />
            </mesh>

            <mesh position={[-WIDTH / 2 - 0.006, 0.75, 0]} material={frameMaterial}>
                <boxGeometry args={[0.012, 0.32, 0.08]} />
            </mesh>

            <mesh position={[-WIDTH / 2 - 0.006, 0.25, 0]} material={frameMaterial}>
                <boxGeometry args={[0.012, 0.32, 0.08]} />
            </mesh>

            <mesh position={[-WIDTH / 2 - 0.006, 1.45, 0]} material={ringMaterial}>
                <boxGeometry args={[0.012, 0.18, 0.08]} />
            </mesh>

            {/* ========================================
          BOTTOM - Port & Speakers
      ========================================= */}
            <group position={[0, -HEIGHT / 2 - 0.006, 0]}>

                <mesh rotation={[0, 0, Math.PI / 2]}>
                    <capsuleGeometry args={[0.048, 0.22, 4, 16]} />
                    <meshStandardMaterial color="#0a0a0a" />
                </mesh>

                {[-0.52, -0.64, -0.76, 0.52, 0.64, 0.76].map((x, i) => (
                    <mesh key={i} position={[x, 0, 0]} rotation={[Math.PI / 2, 0, 0]}>
                        <cylinderGeometry args={[0.015, 0.015, 0.04, 8]} />
                        <meshStandardMaterial color="#1a1a1a" />
                    </mesh>
                ))}

            </group>

            {/* ========================================
          ANTENNA BANDS
      ========================================= */}
            {[
                [WIDTH / 2 + 0.006, 1.9, 0],
                [WIDTH / 2 + 0.006, -1.9, 0],
                [-WIDTH / 2 - 0.006, 1.9, 0],
                [-WIDTH / 2 - 0.006, -1.9, 0]
            ].map((pos, i) => (
                <mesh key={i} position={pos}>
                    <boxGeometry args={[0.04, 0.012, THICKNESS - 0.03]} />
                    <meshStandardMaterial color="#555" roughness={0.7} />
                </mesh>
            ))}

        </group>
    );
}
