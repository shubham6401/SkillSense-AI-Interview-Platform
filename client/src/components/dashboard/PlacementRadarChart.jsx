import { Radar, Sparkles } from "lucide-react";

export default function PlacementRadarChart({
    data = [
        { axis: "Algorithms & DSA", value: 90 },
        { axis: "System Design", value: 95 },
        { axis: "Core Frameworks", value: 88 },
        { axis: "Edge-Case Handling", value: 85 },
        { axis: "Technical Articulation", value: 92 },
    ],
    size = 280,
}) {
    const center = size / 2;
    const radius = center - 45;
    const totalAxes = data.length;
    const angleStep = (Math.PI * 2) / totalAxes;

    // Helper to calculate coordinates
    const getCoordinates = (index, valuePercent) => {
        const angle = index * angleStep - Math.PI / 2;
        const r = (valuePercent / 100) * radius;
        const x = center + r * Math.cos(angle);
        const y = center + r * Math.sin(angle);
        return { x, y };
    };

    // Calculate points for the candidate's shape
    const polygonPoints = data
        .map((d, i) => {
            const { x, y } = getCoordinates(i, d.value);
            return `${x},${y}`;
        })
        .join(" ");

    // Concentric grid rings
    const rings = [0.25, 0.5, 0.75, 1.0];

    return (
        <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200 shadow-sm flex flex-col items-center justify-between">
            <div className="w-full flex items-center justify-between mb-2">
                <div className="flex items-center gap-2 text-indigo-600 font-extrabold text-xs uppercase tracking-wider">
                    <Sparkles size={14} />
                    <span>5-Axis Placement Readiness Radar</span>
                </div>
                <span className="text-[10px] font-extrabold px-2.5 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200">
                    Google L5 Target
                </span>
            </div>

            {/* SVG Radar */}
            <div className="relative my-2 flex items-center justify-center">
                <svg width={size} height={size} className="overflow-visible">
                    {/* Concentric polygon rings */}
                    {rings.map((ring, rIdx) => {
                        const ringPoints = data
                            .map((_, i) => {
                                const { x, y } = getCoordinates(i, ring * 100);
                                return `${x},${y}`;
                            })
                            .join(" ");
                        return (
                            <polygon
                                key={rIdx}
                                points={ringPoints}
                                fill="none"
                                stroke="#e2e8f0"
                                strokeWidth="1"
                                strokeDasharray={rIdx < 3 ? "3,3" : "none"}
                            />
                        );
                    })}

                    {/* Radial axis lines */}
                    {data.map((_, i) => {
                        const { x, y } = getCoordinates(i, 100);
                        return (
                            <line
                                key={i}
                                x1={center}
                                y1={center}
                                x2={x}
                                y2={y}
                                stroke="#e2e8f0"
                                strokeWidth="1"
                            />
                        );
                    })}

                    {/* Candidate Data Filled Polygon */}
                    <polygon
                        points={polygonPoints}
                        fill="rgba(99, 102, 241, 0.25)"
                        stroke="#4f46e5"
                        strokeWidth="2.5"
                        className="transition-all duration-500 ease-out"
                    />

                    {/* Data Point Circles */}
                    {data.map((d, i) => {
                        const { x, y } = getCoordinates(i, d.value);
                        return (
                            <g key={i}>
                                <circle
                                    cx={x}
                                    cy={y}
                                    r="4.5"
                                    fill="#4f46e5"
                                    stroke="#ffffff"
                                    strokeWidth="2"
                                />
                            </g>
                        );
                    })}

                    {/* Axis Labels */}
                    {data.map((d, i) => {
                        const angle = i * angleStep - Math.PI / 2;
                        const labelRadius = radius + 24;
                        const lx = center + labelRadius * Math.cos(angle);
                        const ly = center + labelRadius * Math.sin(angle);

                        return (
                            <text
                                key={i}
                                x={lx}
                                y={ly}
                                textAnchor="middle"
                                dominantBaseline="middle"
                                className="text-[9px] font-extrabold fill-slate-600"
                            >
                                {d.axis}
                            </text>
                        );
                    })}
                </svg>
            </div>

            <div className="w-full pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] font-bold text-slate-500">
                <span>Average Competency:</span>
                <span className="text-indigo-600 font-extrabold">
                    {Math.round(data.reduce((acc, curr) => acc + curr.value, 0) / data.length)}% Mastered
                </span>
            </div>
        </div>
    );
}
