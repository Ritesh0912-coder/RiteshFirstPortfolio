"use client";

import { useRef, useMemo, forwardRef, useImperativeHandle, useEffect } from "react";
import { Canvas, useFrame, useLoader } from "@react-three/fiber";
import { OrbitControls, Stars } from "@react-three/drei";
import { TextureLoader, DoubleSide, BackSide, AdditiveBlending, ShaderMaterial, Vector3, Color } from "three";

interface Earth3DProps {
    interactive?: boolean;
    showStars?: boolean;
    autoRotate?: boolean;
    scale?: number;
    initialCoords?: { lat: number, lng: number };
    onZoom?: (distance: number, coords?: { lat: number, lng: number }) => void;
    onRotate?: (rotation: number) => void;
    onGlobeClick?: (coords: { lat: number, lng: number }) => void;
}

function RealisticEarth({
    autoRotate = true,
    scale = 2,
    earthRef,
    onGlobeClick
}: {
    autoRotate?: boolean,
    scale?: number,
    earthRef: React.RefObject<any>,
    onGlobeClick?: (coords: { lat: number, lng: number }) => void
}) {
    const cloudsRef = useRef<any>();

    // Load textures with reliable fallbacks
    const textureUrls = [
        "https://raw.githubusercontent.com/mrdoob/three.js/master/examples/textures/planets/earth_atmos_2048.jpg",
        "https://raw.githubusercontent.com/mrdoob/three.js/master/examples/textures/planets/earth_specular_2048.jpg",
        "https://raw.githubusercontent.com/mrdoob/three.js/master/examples/textures/planets/earth_clouds_1024.png"
    ];

    const [colorMap, specularMap, cloudsMap] = useLoader(TextureLoader, textureUrls, (loader) => {
        // Optional: could add cross-origin or other settings here
    });

    useFrame(({ clock }) => {
        const elapsedTime = clock.getElapsedTime();
        if (earthRef.current && autoRotate) {
            // Slower, more cinematic rotation
            earthRef.current.rotation.y += 0.001;
        }
        if (cloudsRef.current && autoRotate) {
            cloudsRef.current.rotation.y += 0.0015;
        }
    });

    const handleMeshClick = (e: any) => {
        e.stopPropagation();
        if (!onGlobeClick || !earthRef.current) return;

        // The point on the sphere surface
        const point = e.point.clone().normalize();

        // Longitude: atan2(x, z)
        let lng = Math.atan2(point.x, point.z) * (180 / Math.PI);

        // Adjust for Earth's rotation at the time of click
        const rotationDegrees = (earthRef.current.rotation.y * (180 / Math.PI)) % 360;
        lng = (lng - rotationDegrees + 540) % 360 - 180;

        // Latitude: asin(y)
        let lat = Math.asin(point.y) * (180 / Math.PI);

        onGlobeClick({ lat, lng });
    };

    return (
        <>
            <mesh
                ref={earthRef}
                scale={scale}
                onClick={handleMeshClick}
            >
                <sphereGeometry args={[1, 64, 64]} />
                <meshPhongMaterial
                    map={colorMap}
                    specularMap={specularMap}
                    specular={0x333333}
                    shininess={15}
                />
            </mesh>
            <mesh ref={cloudsRef} scale={scale * 1.015}>
                <sphereGeometry args={[1, 64, 64]} />
                <meshStandardMaterial
                    map={cloudsMap}
                    transparent={true}
                    opacity={0.8}
                    side={DoubleSide}
                    blending={2}
                />
            </mesh>
        </>
    );
}
RealisticEarth.displayName = "RealisticEarth";

const Scene = forwardRef<any, Earth3DProps>((props, ref) => {
    const {
        interactive = false,
        showStars = true,
        autoRotate = true,
        scale = 2,
        initialCoords,
        onZoom,
        onRotate,
        onGlobeClick
    } = props;
    const controlsRef = useRef<any>();
    const earthRef = useRef<any>();

    useImperativeHandle(ref, () => ({
        zoomIn: () => {
            if (controlsRef.current) {
                const camera = controlsRef.current.object;
                camera.position.multiplyScalar(0.85); // Faster zoom
                controlsRef.current.update();
            }
        },
        zoomOut: () => {
            if (controlsRef.current) {
                const camera = controlsRef.current.object;
                camera.position.multiplyScalar(1.15); // Faster zoom
                controlsRef.current.update();
            }
        }
    }));

    // Set initial orientation based on coordinates
    useEffect(() => {
        if (earthRef.current && initialCoords) {
            // Latitude: x axis rotation (approx)
            // Longitude: y axis rotation
            const phi = (90 - initialCoords.lat) * (Math.PI / 180);
            const theta = (initialCoords.lng + 180) * (Math.PI / 180);

            // Map to mesh rotation
            // Standard Three.js sphere: 
            // - Lat 0, Lon 0 is at (0, 0, 1) or similar depending on map
            // For our texture, we need to counter-rotate
            earthRef.current.rotation.y = -theta + Math.PI / 2;
            earthRef.current.rotation.x = 0; // Keeping it level for now as per user screenshot
        }
    }, [initialCoords]);

    useFrame(({ camera }) => {
        if (earthRef.current) {
            if (onRotate) onRotate(earthRef.current.rotation.y);

            if (onZoom && interactive) {
                const distance = camera.position.length();
                const pos = camera.position.clone().normalize();

                // Longitude: atan2(x, z)
                let lng = Math.atan2(pos.x, pos.z) * (180 / Math.PI);

                // Adjust for Earth's rotation
                const rotationDegrees = (earthRef.current.rotation.y * (180 / Math.PI)) % 360;
                lng = (lng - rotationDegrees + 540) % 360 - 180;

                // Latitude: asin(y)
                let lat = Math.asin(pos.y) * (180 / Math.PI);

                onZoom(distance, { lat, lng });
            }
        }
    });

    return (
        <>
            <ambientLight intensity={1.5} />
            <directionalLight position={[5, 3, 5]} intensity={3} color="#ffffff" />

            {showStars && (
                <Stars radius={300} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />
            )}

            <RealisticEarth autoRotate={autoRotate} scale={scale} earthRef={earthRef} onGlobeClick={onGlobeClick} />

            <OrbitControls
                ref={controlsRef}
                enableZoom={interactive}
                enablePan={false}
                enableRotate={interactive}
                autoRotate={autoRotate && !interactive}
                autoRotateSpeed={0.3}
                makeDefault
                minDistance={scale * 1.1}
                maxDistance={15}
                enableDamping={true}
                dampingFactor={0.05}
                rotateSpeed={0.5}
                zoomSpeed={1.5}
            />
        </>
    );
});
Scene.displayName = "Scene";

const Earth3D = forwardRef<any, Earth3DProps>(({
    interactive = false,
    showStars = true,
    autoRotate = true,
    scale = 2,
    initialCoords,
    onZoom,
    onRotate,
    onGlobeClick
}, ref) => {
    const sceneRef = useRef<any>();

    useImperativeHandle(ref, () => ({
        zoomIn: () => {
            if (sceneRef.current) sceneRef.current.zoomIn();
        },
        zoomOut: () => {
            if (sceneRef.current) sceneRef.current.zoomOut();
        }
    }));

    return (
        <div className="w-full h-full relative">
            <Canvas camera={{ position: [0, 0, 5.5], fov: 45 }}>
                <Scene
                    ref={sceneRef}
                    interactive={interactive}
                    showStars={showStars}
                    autoRotate={autoRotate}
                    scale={scale}
                    initialCoords={initialCoords}
                    onZoom={onZoom}
                    onRotate={onRotate}
                    onGlobeClick={onGlobeClick}
                />
            </Canvas>
        </div>
    );
});

Earth3D.displayName = "Earth3D";
export default Earth3D;
