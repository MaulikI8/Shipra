import React, { useEffect, useRef, useState } from 'react'
import Globe from 'react-globe.gl'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'

interface Warehouse {
    id: number
    name: string
    city: string
    latitude?: number
    longitude?: number
    capacity?: number
    utilization?: number // 0-100
}

// Mock coordinates for demo purposes if real ones aren't provided
const MOCK_COORDS: Record<string, { lat: number, lng: number }> = {
    'New York': { lat: 40.7128, lng: -74.0060 },
    'London': { lat: 51.5074, lng: -0.1278 },
    'Tokyo': { lat: 35.6762, lng: 139.6503 },
    'Sydney': { lat: -33.8688, lng: 151.2093 },
    'Singapore': { lat: 1.3521, lng: 103.8198 },
    'Dubai': { lat: 25.2048, lng: 55.2708 },
    'Berlin': { lat: 52.5200, lng: 13.4050 },
    'San Francisco': { lat: 37.7749, lng: -122.4194 },
    'Mumbai': { lat: 19.0760, lng: 72.8777 },
    'Shanghai': { lat: 31.2304, lng: 121.4737 },
    'Los Angeles': { lat: 34.0522, lng: -118.2437 },
}

export function WarehouseGlobe({ warehouses }: { warehouses: Warehouse[] }) {
    const globeEl = useRef<any>()
    const [dimensions, setDimensions] = useState({ width: 800, height: 400 })
    const containerRef = useRef<HTMLDivElement>(null)
    const navigate = useNavigate()

    // Helper to get color based on utilization/capacity
    const getStatusColor = (w: Warehouse) => {
        // Mock utilization if not present (random 30-90%)
        const util = w.utilization || (Math.random() * 60 + 30)
        
        if (util > 85) return '#EF4444' // Red - Critical
        if (util > 60) return '#F59E0B' // Amber - Warning
        return '#00E8FF' // Cyan - Good
    }

    // Prepare data for the globe
    const globeData = warehouses.map(w => {
        // Try to find coords by city name if not provided
        const coords = (w.latitude && w.longitude)
            ? { lat: w.latitude, lng: w.longitude }
            : MOCK_COORDS[w.city] || { lat: (Math.random() * 140) - 70, lng: (Math.random() * 360) - 180 }

        return {
            ...w,
            lat: coords.lat,
            lng: coords.lng,
            size: 0.25, // Uniform base size
            color: getStatusColor(w),
            altitude: 0.02
        }
    })

    // Create rings propagation data (ripples for active hubs)
    const ringsData = globeData.map(node => ({
        lat: node.lat,
        lng: node.lng,
        color: node.color,
        maxRadius: 2,
        propagationSpeed: 2,
        repeatPeriod: Math.random() * 2000 + 1000 // Randomize ripple timing
    }))

    // Arcs (simulating shipments) with curved paths
    const arcsData = globeData.map((w, i) => {
        // Connect to 2 random other nodes to create a network web
        const targetIndex = (i + 2) % globeData.length
        const next = globeData[targetIndex]
        
        return {
            startLat: w.lat,
            startLng: w.lng,
            endLat: next.lat,
            endLng: next.lng,
            color: [w.color, next.color]
        }
    })

    useEffect(() => {
        // Auto-rotate
        if (globeEl.current) {
            globeEl.current.controls().autoRotate = true
            globeEl.current.controls().autoRotateSpeed = 0.6
            // Initial camera position
            globeEl.current.pointOfView({ lat: 20, lng: 0, altitude: 2.5 })
        }

        // Resize handler
        const handleResize = () => {
            if (containerRef.current) {
                setDimensions({
                    width: containerRef.current.clientWidth,
                    height: containerRef.current.clientHeight
                })
            }
        }

        window.addEventListener('resize', handleResize)
        handleResize()

        return () => window.removeEventListener('resize', handleResize)
    }, [])

    return (
        <motion.div
            ref={containerRef}
            layout
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="relative w-full h-full overflow-hidden"
        >
            <div className="absolute top-6 left-6 z-10 pointer-events-none">
                <div className="flex items-center gap-3 bg-black/40 backdrop-blur-xl border border-white/10 p-4 rounded-2xl">
                    <div className="w-10 h-10 rounded-xl bg-accent/20 flex items-center justify-center">
                        <div className="w-2.5 h-2.5 rounded-full bg-accent animate-pulse" />
                    </div>
                    <div>
                        <h3 className="text-white font-bold">Live Global Network</h3>
                        <p className="text-xs text-white/40">Interactive 3D visualization</p>
                    </div>
                </div>
            </div>
            
            <div className="absolute bottom-4 right-4 z-10 pointer-events-none flex flex-col gap-2">
                 <div className="flex items-center gap-2 text-xs text-white/70 bg-black/60 px-3 py-1.5 rounded-lg backdrop-blur">
                    <div className="w-2 h-2 rounded-full bg-[#00E8FF]" /> Optimal
                 </div>
                 <div className="flex items-center gap-2 text-xs text-white/70 bg-black/60 px-3 py-1.5 rounded-lg backdrop-blur">
                    <div className="w-2 h-2 rounded-full bg-[#F59E0B]" /> High Load
                 </div>
                 <div className="flex items-center gap-2 text-xs text-white/70 bg-black/60 px-3 py-1.5 rounded-lg backdrop-blur">
                    <div className="w-2 h-2 rounded-full bg-[#EF4444]" /> Critical
                 </div>
            </div>

            <Globe
                ref={globeEl}
                width={dimensions.width}
                height={dimensions.height}
                globeImageUrl="//unpkg.com/three-globe/example/img/earth-blue-marble.jpg"
                bumpImageUrl="//unpkg.com/three-globe/example/img/earth-topology.png"
                
                // Points (Warehouses)
                pointsData={globeData}
                pointAltitude="altitude"
                pointColor="color"
                pointRadius="size"
                pointsMerge={true}
                
                // Ripple Rings
                ringsData={ringsData}
                ringColor="color"
                ringMaxRadius="maxRadius"
                ringPropagationSpeed="propagationSpeed"
                ringRepeatPeriod="repeatPeriod"

                // Tooltips
                pointLabel={(d: any) => `
                  <div style="background: rgba(14, 15, 18, 0.9); color: white; padding: 12px; border-radius: 12px; font-family: 'Inter', sans-serif; border: 1px solid rgba(255,255,255,0.1); backdrop-filter: blur(10px); box-shadow: 0 10px 30px rgba(0,0,0,0.5);">
                    <div style="font-weight: 600; font-size: 14px; margin-bottom: 4px; color: ${d.color}; letter-spacing: 0.5px;">${d.name.toUpperCase()}</div>
                    <div style="color: #9CA3AF; font-size: 12px; margin-bottom: 8px;">${d.city}</div>
                    <div style="display: flex; gap: 8px; align-items: center; font-size: 11px;">
                        <span style="background: rgba(255,255,255,0.1); padding: 2px 6px; rounded: 4px;">Vol: ${d.capacity?.toLocaleString()}</span>
                        <span style="color: ${d.color}">● Live</span>
                    </div>
                  </div>
                `}

                // Interactions
                onPointClick={(d: any) => {
                    // Navigate to warehouse filtered view or detail
                    // Since specific detail page isn't set up, we go to list
                    navigate('/warehouses')
                    
                    // Optional: Zoom in logic (complex to implement perfectly without state)
                    if (globeEl.current) {
                        globeEl.current.pointOfView({ lat: d.lat, lng: d.lng, altitude: 1.5 }, 1000)
                    }
                }}

                // Arcs (Shipments)
                arcsData={arcsData}
                arcColor="color"
                arcDashLength={0.4}
                arcDashGap={2}
                arcDashInitialGap={() => Math.random() * 5}
                arcDashAnimateTime={1500}
                arcStroke={0.5}

                // Atmosphere - bright blue glow
                atmosphereColor="#4A90E2"
                atmosphereAltitude={0.25}
                backgroundColor="rgba(0,0,0,0)"
            />
        </motion.div>
    )
}
