import { useState, useRef, useEffect } from "react";
import {
    Pencil,
    Eraser,
    RotateCcw,
    Maximize2,
    Minimize2,
    X,
    LayoutGrid,
    Server,
    Database,
    Zap,
    Globe,
    Cpu,
    Radio,
    Shield,
    Users,
    Sparkles,
    Move,
} from "lucide-react";
import useLockBodyScroll from "../../hooks/useLockBodyScroll";

const getInitialElements = (isMobile = false) => {
    if (isMobile) {
        return [
            { id: 1, type: "Client", x: 10, y: 15, icon: Users, label: "Client App" },
            { id: 2, type: "LoadBalancer", x: 150, y: 15, icon: Radio, label: "Load Balancer" },
            { id: 3, type: "Service", x: 10, y: 110, icon: Cpu, label: "Core Service" },
            { id: 4, type: "Cache", x: 150, y: 110, icon: Zap, label: "Redis Cache" },
            { id: 5, type: "Database", x: 75, y: 205, icon: Database, label: "Postgres DB" },
        ];
    }
    return [
        { id: 1, type: "Client", x: 25, y: 120, icon: Users, label: "Web / Mobile Clients" },
        { id: 2, type: "LoadBalancer", x: 195, y: 120, icon: Radio, label: "Nginx Load Balancer" },
        { id: 3, type: "Service", x: 375, y: 70, icon: Cpu, label: "Auth & Core Service" },
        { id: 4, type: "Cache", x: 375, y: 200, icon: Zap, label: "Redis Cluster (Cache)" },
        { id: 5, type: "Database", x: 555, y: 120, icon: Database, label: "PostgreSQL Replica" },
    ];
};

export default function SystemDesignWhiteboard() {
    const canvasRef = useRef(null);
    const containerRef = useRef(null);
    const [isExpanded, setIsExpanded] = useState(false);
    const [isDrawing, setIsDrawing] = useState(false);
    const [tool, setTool] = useState("pencil"); // 'pencil' | 'eraser'
    const [color, setColor] = useState("#3b82f6");
    const [elements, setElements] = useState(() => {
        const isMobile = typeof window !== "undefined" ? window.innerWidth < 640 : false;
        return getInitialElements(isMobile);
    });

    const [selectedElement, setSelectedElement] = useState(null);
    const [isDragging, setIsDragging] = useState(false);
    const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });

    // Lock body scroll when in expanded / fullscreen whiteboard mode
    useLockBodyScroll(isExpanded);

    const systemPrimitives = [
        { type: "Client", label: "Client", icon: Users, defaultLabel: "Client App" },
        { type: "LoadBalancer", label: "Load Balancer", icon: Radio, defaultLabel: "ALB / Nginx" },
        { type: "Gateway", label: "API Gateway", icon: Shield, defaultLabel: "Kong Gateway" },
        { type: "Service", label: "Service", icon: Cpu, defaultLabel: "Microservice" },
        { type: "Cache", label: "Redis Cache", icon: Zap, defaultLabel: "Redis Cluster" },
        { type: "Database", label: "Database", icon: Database, defaultLabel: "PostgreSQL DB" },
        { type: "Queue", label: "Message Queue", icon: Server, defaultLabel: "Kafka / MQ" },
        { type: "CDN", label: "CDN Edge", icon: Globe, defaultLabel: "CloudFront CDN" },
    ];

    // Setup canvas
    const initCanvas = () => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext("2d");
        ctx.lineCap = "round";
        ctx.lineJoin = "round";
        ctx.lineWidth = 3;
    };

    useEffect(() => {
        initCanvas();
    }, [isExpanded]);

    const getCanvasCoords = (e) => {
        const canvas = canvasRef.current;
        if (!canvas) return { x: 0, y: 0 };
        const rect = canvas.getBoundingClientRect();
        const clientX = e.touches ? e.touches[0].clientX : e.clientX;
        const clientY = e.touches ? e.touches[0].clientY : e.clientY;
        const scaleX = canvas.width / rect.width;
        const scaleY = canvas.height / rect.height;
        return {
            x: (clientX - rect.left) * scaleX,
            y: (clientY - rect.top) * scaleY,
        };
    };

    const startDrawing = (e) => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const { x, y } = getCanvasCoords(e);

        const ctx = canvas.getContext("2d");
        ctx.beginPath();
        ctx.moveTo(x, y);
        ctx.strokeStyle = tool === "eraser" ? "#ffffff" : color;
        ctx.lineWidth = tool === "eraser" ? 24 : 3;
        setIsDrawing(true);
    };

    const draw = (e) => {
        if (!isDrawing) return;
        if (e.cancelable) e.preventDefault();
        const canvas = canvasRef.current;
        if (!canvas) return;
        const { x, y } = getCanvasCoords(e);

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

    const handleResetLayout = () => {
        const isMobile = window.innerWidth < 640 && !isExpanded;
        setElements(getInitialElements(isMobile));
        clearCanvas();
    };

    const addPrimitive = (primitive) => {
        const newEl = {
            id: Date.now(),
            type: primitive.type,
            x: 40 + Math.random() * (isExpanded ? 300 : 100),
            y: 40 + Math.random() * (isExpanded ? 200 : 80),
            icon: primitive.icon,
            label: primitive.defaultLabel,
        };
        setElements((prev) => [...prev, newEl]);
    };

    // Mouse & Touch Dragging for Nodes
    const handleStartDragElement = (el, e) => {
        e.stopPropagation();
        setSelectedElement(el.id);
        setIsDragging(true);
        const clientX = e.touches ? e.touches[0].clientX : e.clientX;
        const clientY = e.touches ? e.touches[0].clientY : e.clientY;
        setDragOffset({
            x: clientX - el.x,
            y: clientY - el.y,
        });
    };

    const handleMoveDragElement = (e) => {
        if (isDragging && selectedElement) {
            if (e.cancelable) e.preventDefault();
            const clientX = e.touches ? e.touches[0].clientX : e.clientX;
            const clientY = e.touches ? e.touches[0].clientY : e.clientY;
            setElements((prev) =>
                prev.map((el) =>
                    el.id === selectedElement
                        ? {
                              ...el,
                              x: Math.max(5, clientX - dragOffset.x),
                              y: Math.max(5, clientY - dragOffset.y),
                          }
                        : el
                )
            );
        }
    };

    const handleEndDragElement = () => {
        setIsDragging(false);
    };

    const whiteboardContent = (
        <div
            ref={containerRef}
            className={`bg-white rounded-3xl border border-slate-200 shadow-xl overflow-hidden flex flex-col ${
                isExpanded ? "w-full h-full" : "w-full"
            }`}
            onMouseMove={handleMoveDragElement}
            onMouseUp={handleEndDragElement}
            onTouchMove={handleMoveDragElement}
            onTouchEnd={handleEndDragElement}
        >
            {/* Whiteboard Toolbar */}
            <div className="bg-slate-900 px-3 sm:px-6 py-2.5 sm:py-3 border-b border-slate-800 flex flex-wrap items-center justify-between gap-2 text-white">
                {/* Drawing Tools */}
                <div className="flex items-center gap-1.5 sm:gap-2">
                    <button
                        type="button"
                        onClick={() => setTool("pencil")}
                        className={`px-2.5 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
                            tool === "pencil" ? "bg-blue-600 text-white shadow-xs" : "text-slate-400 hover:bg-slate-800"
                        }`}
                        title="Connector Pencil"
                    >
                        <Pencil size={13} />
                        <span>Draw</span>
                    </button>

                    <button
                        type="button"
                        onClick={() => setTool("eraser")}
                        className={`px-2.5 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
                            tool === "eraser" ? "bg-blue-600 text-white shadow-xs" : "text-slate-400 hover:bg-slate-800"
                        }`}
                        title="Eraser"
                    >
                        <Eraser size={13} />
                        <span>Erase</span>
                    </button>

                    {/* Colors */}
                    <div className="flex items-center gap-1 sm:gap-1.5 ml-1">
                        {["#3b82f6", "#10b981", "#8b5cf6", "#f43f5e", "#f59e0b"].map((c) => (
                            <button
                                key={c}
                                type="button"
                                onClick={() => {
                                    setColor(c);
                                    setTool("pencil");
                                }}
                                className={`w-4 h-4 sm:w-5 sm:h-5 rounded-full transition-transform ${
                                    color === c && tool === "pencil"
                                        ? "scale-125 ring-2 ring-white"
                                        : "opacity-75 hover:opacity-100"
                                }`}
                                style={{ backgroundColor: c }}
                                aria-label={`Select color ${c}`}
                            />
                        ))}
                    </div>
                </div>

                {/* Right Action Buttons: Clear, Auto-Arrange, Expand */}
                <div className="flex items-center gap-1.5 sm:gap-2 ml-auto">
                    <button
                        type="button"
                        onClick={clearCanvas}
                        className="px-2.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-[11px] sm:text-xs font-bold transition flex items-center gap-1"
                        title="Clear connector lines"
                    >
                        <RotateCcw size={12} />
                        <span className="hidden sm:inline">Clear Lines</span>
                    </button>

                    <button
                        type="button"
                        onClick={handleResetLayout}
                        className="px-2.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-[11px] sm:text-xs font-bold transition flex items-center gap-1"
                        title="Auto-arrange & reset architecture nodes"
                    >
                        <LayoutGrid size={12} />
                        <span>Reset</span>
                    </button>

                    <button
                        type="button"
                        onClick={() => setIsExpanded(!isExpanded)}
                        className={`px-3 py-1.5 rounded-xl text-[11px] sm:text-xs font-bold transition flex items-center gap-1.5 min-h-[32px] ${
                            isExpanded
                                ? "bg-rose-600 hover:bg-rose-500 text-white shadow-md shadow-rose-600/30"
                                : "bg-indigo-600 hover:bg-indigo-500 text-white shadow-md shadow-indigo-600/30"
                        }`}
                        title={isExpanded ? "Exit Fullscreen" : "Expand Whiteboard on Mobile / Fullscreen"}
                    >
                        {isExpanded ? (
                            <>
                                <Minimize2 size={13} />
                                <span>Exit</span>
                            </>
                        ) : (
                            <>
                                <Maximize2 size={13} />
                                <span>Expand Board</span>
                            </>
                        )}
                    </button>
                </div>
            </div>

            {/* Primitive Blocks Palette */}
            <div className="bg-slate-50 px-3 sm:px-6 py-2 border-b border-slate-200 flex items-center gap-1.5 sm:gap-2 overflow-x-auto no-scrollbar">
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 shrink-0 mr-1">
                    Nodes:
                </span>
                {systemPrimitives.map((prim) => {
                    const Icon = prim.icon;
                    return (
                        <button
                            key={prim.type}
                            type="button"
                            onClick={() => addPrimitive(prim)}
                            className="px-2.5 py-1 bg-white hover:bg-indigo-50 border border-slate-200 hover:border-indigo-300 rounded-xl text-[11px] sm:text-xs font-bold text-slate-700 hover:text-indigo-700 transition flex items-center gap-1.5 shrink-0 shadow-2xs min-h-[30px]"
                        >
                            <Icon size={12} className="text-indigo-600 shrink-0" />
                            <span>+ {prim.label}</span>
                        </button>
                    );
                })}
            </div>

            {/* Main Interactive Diagramming Board Canvas */}
            <div
                className={`relative w-full bg-slate-50/60 overflow-hidden select-none ${
                    isExpanded ? "flex-1 min-h-[500px]" : "h-[340px] sm:h-[450px]"
                }`}
                style={{ touchAction: "none" }}
            >
                {/* Draggable Architecture System Nodes */}
                {elements.map((el) => {
                    const Icon = el.icon;
                    const isSelected = selectedElement === el.id;
                    return (
                        <div
                            key={el.id}
                            onMouseDown={(e) => handleStartDragElement(el, e)}
                            onTouchStart={(e) => handleStartDragElement(el, e)}
                            style={{
                                left: `${el.x}px`,
                                top: `${el.y}px`,
                                touchAction: "none",
                            }}
                            className={`absolute cursor-move p-2 sm:p-3 rounded-2xl bg-white border shadow-md transition-shadow z-20 flex items-center gap-1.5 sm:gap-2.5 ${
                                isSelected
                                    ? "border-blue-500 ring-2 ring-blue-500/20 shadow-lg"
                                    : "border-slate-300 hover:border-slate-400"
                            }`}
                        >
                            <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
                                <Icon size={14} />
                            </div>
                            <div>
                                <span className="text-[9px] sm:text-[10px] font-bold uppercase text-slate-400 block leading-tight">
                                    {el.type}
                                </span>
                                <input
                                    type="text"
                                    value={el.label}
                                    onChange={(e) => {
                                        const newLabel = e.target.value;
                                        setElements((prev) =>
                                            prev.map((item) =>
                                                item.id === el.id ? { ...item, label: newLabel } : item
                                            )
                                        );
                                    }}
                                    className="text-[11px] sm:text-xs font-bold text-slate-800 bg-transparent border-0 p-0 focus:outline-none focus:ring-0 w-24 sm:w-36"
                                />
                            </div>
                        </div>
                    );
                })}

                {/* Freehand Connector Canvas */}
                <canvas
                    ref={canvasRef}
                    width={isExpanded ? 1400 : 1000}
                    height={isExpanded ? 800 : 450}
                    onMouseDown={startDrawing}
                    onMouseMove={draw}
                    onMouseUp={stopDrawing}
                    onMouseLeave={stopDrawing}
                    onTouchStart={startDrawing}
                    onTouchMove={draw}
                    onTouchEnd={stopDrawing}
                    className="absolute inset-0 w-full h-full cursor-crosshair z-10"
                    style={{ touchAction: "none" }}
                />
            </div>
        </div>
    );

    if (isExpanded) {
        return (
            <div className="fixed inset-0 z-50 bg-slate-950/90 backdrop-blur-md p-2 sm:p-6 flex flex-col animate-in fade-in zoom-in-95 duration-150">
                <div className="flex-1 w-full max-w-7xl mx-auto flex flex-col overflow-hidden">
                    {whiteboardContent}
                </div>
            </div>
        );
    }

    return whiteboardContent;
}
