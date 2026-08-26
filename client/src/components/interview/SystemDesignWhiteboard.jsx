import { useState, useRef, useEffect } from "react";
import {
    Pencil,
    Eraser,
    Square,
    Type,
    RotateCcw,
    Download,
    Layers,
    Server,
    Database,
    Zap,
    Globe,
    Cpu,
    Radio,
    Shield,
    Users,
} from "lucide-react";

export default function SystemDesignWhiteboard() {
    const canvasRef = useRef(null);
    const [isDrawing, setIsDrawing] = useState(false);
    const [tool, setTool] = useState("pencil"); // 'pencil' | 'line' | 'eraser'
    const [color, setColor] = useState("#3b82f6");
    const [elements, setElements] = useState([
        { id: 1, type: "Client", x: 60, y: 140, icon: Users, label: "Web / Mobile Clients" },
        { id: 2, type: "LoadBalancer", x: 260, y: 140, icon: Radio, label: "Nginx Load Balancer" },
        { id: 3, type: "Service", x: 480, y: 100, icon: Cpu, label: "Auth & Core Service" },
        { id: 4, type: "Cache", x: 480, y: 220, icon: Zap, label: "Redis Cluster (Cache)" },
        { id: 5, type: "Database", x: 700, y: 140, icon: Database, label: "PostgreSQL Primary + Replica" },
    ]);

    const [selectedElement, setSelectedElement] = useState(null);
    const [isDragging, setIsDragging] = useState(false);
    const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });

    const systemPrimitives = [
        { type: "Client", label: "Client Browser", icon: Users, defaultLabel: "Web / Mobile App" },
        { type: "LoadBalancer", label: "Load Balancer", icon: Radio, defaultLabel: "HAProxy / ALB" },
        { type: "Gateway", label: "API Gateway", icon: Shield, defaultLabel: "Kong / Cloudflare" },
        { type: "Service", label: "Microservice", icon: Cpu, defaultLabel: "Node.js / Go Service" },
        { type: "Cache", label: "Redis Cache", icon: Zap, defaultLabel: "Redis / Memcached" },
        { type: "Database", label: "Database", icon: Database, defaultLabel: "PostgreSQL / MongoDB" },
        { type: "Queue", label: "Message Queue", icon: Server, defaultLabel: "Kafka / RabbitMQ" },
        { type: "CDN", label: "CDN Edge", icon: Globe, defaultLabel: "CloudFront CDN" },
    ];

    // Setup canvas
    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext("2d");
        ctx.lineCap = "round";
        ctx.lineJoin = "round";
        ctx.lineWidth = 3;
    }, []);

    const startDrawing = (e) => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const rect = canvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        const ctx = canvas.getContext("2d");
        ctx.beginPath();
        ctx.moveTo(x, y);
        ctx.strokeStyle = tool === "eraser" ? "#ffffff" : color;
        ctx.lineWidth = tool === "eraser" ? 20 : 3;
        setIsDrawing(true);
    };

    const draw = (e) => {
        if (!isDrawing) return;
        const canvas = canvasRef.current;
        if (!canvas) return;
        const rect = canvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        const ctx = canvas.getContext("2d");
        ctx.lineTo(x, y);
        ctx.stroke();
    };

    const stopDrawing = () => {
        setIsDrawing(false);
    };

    const clearCanvas = () => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext("2d");
        ctx.clearRect(0, 0, canvas.width, canvas.height);
    };

    const addPrimitive = (primitive) => {
        const newEl = {
            id: Date.now(),
            type: primitive.type,
            x: 200 + Math.random() * 150,
            y: 100 + Math.random() * 150,
            icon: primitive.icon,
            label: primitive.defaultLabel,
        };
        setElements((prev) => [...prev, newEl]);
    };

    const handleMouseDownElement = (el, e) => {
        e.stopPropagation();
        setSelectedElement(el.id);
        setIsDragging(true);
        setDragOffset({
            x: e.clientX - el.x,
            y: e.clientY - el.y,
        });
    };

    const handleMouseMoveElement = (e) => {
        if (isDragging && selectedElement) {
            setElements((prev) =>
                prev.map((el) =>
                    el.id === selectedElement
                        ? { ...el, x: Math.max(10, e.clientX - dragOffset.x), y: Math.max(10, e.clientY - dragOffset.y) }
                        : el
                )
            );
        }
    };

    const handleMouseUpElement = () => {
        setIsDragging(false);
    };

    return (
        <div
            className="bg-white rounded-3xl border border-slate-200 shadow-xl overflow-hidden flex flex-col"
            onMouseMove={handleMouseMoveElement}
            onMouseUp={handleMouseUpElement}
        >
            {/* Whiteboard Toolbar */}
            <div className="bg-slate-900 px-4 sm:px-6 py-3 border-b border-slate-800 flex flex-wrap items-center justify-between gap-3 text-white">
                {/* Freehand tools */}
                <div className="flex items-center gap-2">
                    <button
                        type="button"
                        onClick={() => setTool("pencil")}
                        className={`p-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
                            tool === "pencil" ? "bg-blue-600 text-white" : "text-slate-400 hover:bg-slate-800"
                        }`}
                        title="Architecture Connector Pencil"
                    >
                        <Pencil size={15} />
                        <span className="hidden sm:inline">Connector</span>
                    </button>

                    <button
                        type="button"
                        onClick={() => setTool("eraser")}
                        className={`p-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
                            tool === "eraser" ? "bg-blue-600 text-white" : "text-slate-400 hover:bg-slate-800"
                        }`}
                        title="Eraser"
                    >
                        <Eraser size={15} />
                        <span className="hidden sm:inline">Eraser</span>
                    </button>

                    {/* Colors */}
                    <div className="flex items-center gap-1.5 ml-2">
                        {["#3b82f6", "#10b981", "#8b5cf6", "#f43f5e", "#f59e0b"].map((c) => (
                            <button
                                key={c}
                                type="button"
                                onClick={() => {
                                    setColor(c);
                                    setTool("pencil");
                                }}
                                className={`w-5 h-5 rounded-full transition-transform ${
                                    color === c && tool === "pencil" ? "scale-125 ring-2 ring-white" : "opacity-80 hover:opacity-100"
                                }`}
                                style={{ backgroundColor: c }}
                            />
                        ))}
                    </div>
                </div>

                <div className="flex items-center gap-2">
                    <button
                        type="button"
                        onClick={clearCanvas}
                        className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold transition flex items-center gap-1"
                    >
                        <RotateCcw size={13} />
                        <span>Clear Lines</span>
                    </button>
                </div>
            </div>

            {/* Primitive Blocks Palette */}
            <div className="bg-slate-50 px-4 sm:px-6 py-2.5 border-b border-slate-200 flex items-center gap-2 overflow-x-auto">
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 shrink-0 mr-1">
                    System Nodes:
                </span>
                {systemPrimitives.map((prim) => {
                    const Icon = prim.icon;
                    return (
                        <button
                            key={prim.type}
                            type="button"
                            onClick={() => addPrimitive(prim)}
                            className="px-2.5 py-1.5 bg-white hover:bg-indigo-50 border border-slate-200 hover:border-indigo-300 rounded-xl text-xs font-bold text-slate-700 hover:text-indigo-700 transition flex items-center gap-1.5 shrink-0 shadow-2xs"
                        >
                            <Icon size={13} className="text-indigo-600" />
                            <span>+ {prim.label}</span>
                        </button>
                    );
                })}
            </div>

            {/* Main Interactive Diagramming Board */}
            <div className="relative w-full h-[450px] bg-slate-50/50 overflow-hidden select-none">
                {/* Draggable Architecture System Nodes */}
                {elements.map((el) => {
                    const Icon = el.icon;
                    const isSelected = selectedElement === el.id;
                    return (
                        <div
                            key={el.id}
                            onMouseDown={(e) => handleMouseDownElement(el, e)}
                            style={{ left: `${el.x}px`, top: `${el.y}px` }}
                            className={`absolute cursor-move p-3 rounded-2xl bg-white border shadow-md transition-shadow z-20 flex items-center gap-2.5 ${
                                isSelected
                                    ? "border-blue-500 ring-2 ring-blue-500/20 shadow-lg"
                                    : "border-slate-300 hover:border-slate-400"
                            }`}
                        >
                            <div className="w-8 h-8 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
                                <Icon size={16} />
                            </div>
                            <div>
                                <span className="text-[10px] font-bold uppercase text-slate-400 block">{el.type}</span>
                                <input
                                    type="text"
                                    value={el.label}
                                    onChange={(e) => {
                                        const newLabel = e.target.value;
                                        setElements((prev) =>
                                            prev.map((item) => (item.id === el.id ? { ...item, label: newLabel } : item))
                                        );
                                    }}
                                    className="text-xs font-bold text-slate-800 bg-transparent border-0 p-0 focus:outline-none focus:ring-0 w-36"
                                />
                            </div>
                        </div>
                    );
                })}

                {/* Freehand Connector Canvas */}
                <canvas
                    ref={canvasRef}
                    width={1000}
                    height={450}
                    onMouseDown={startDrawing}
                    onMouseMove={draw}
                    onMouseUp={stopDrawing}
                    onMouseLeave={stopDrawing}
                    className="absolute inset-0 w-full h-full cursor-crosshair z-10"
                />
            </div>
        </div>
    );
}
