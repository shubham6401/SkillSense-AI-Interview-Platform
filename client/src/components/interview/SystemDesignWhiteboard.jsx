import { useState, useRef, useEffect, useCallback } from "react";
import {
    Pencil,
    Eraser,
    RotateCcw,
    Maximize2,
    Minimize2,
    LayoutGrid,
    Server,
    Database,
    Zap,
    Globe,
    Cpu,
    Radio,
    Shield,
    Users,
} from "lucide-react";
import useLockBodyScroll from "../../hooks/useLockBodyScroll";

const getInitialElements = (isMobile = false) => {
    if (isMobile) {
        return [
            { id: 1, type: "Client", x: 10, y: 12, icon: Users, label: "Client App" },
            { id: 2, type: "LoadBalancer", x: 140, y: 12, icon: Radio, label: "Load Balancer" },
            { id: 3, type: "Service", x: 10, y: 90, icon: Cpu, label: "Core Service" },
            { id: 4, type: "Cache", x: 140, y: 90, icon: Zap, label: "Redis Cache" },
            { id: 5, type: "Database", x: 75, y: 170, icon: Database, label: "Postgres DB" },
        ];
    }
    return [
        { id: 1, type: "Client", x: 25, y: 110, icon: Users, label: "Web / Mobile Clients" },
        { id: 2, type: "LoadBalancer", x: 195, y: 110, icon: Radio, label: "Nginx Load Balancer" },
        { id: 3, type: "Service", x: 375, y: 60, icon: Cpu, label: "Auth & Core Service" },
        { id: 4, type: "Cache", x: 375, y: 185, icon: Zap, label: "Redis Cluster (Cache)" },
        { id: 5, type: "Database", x: 555, y: 110, icon: Database, label: "PostgreSQL Replica" },
    ];
};

export default function SystemDesignWhiteboard() {
    const canvasRef = useRef(null);
    const boardAreaRef = useRef(null);
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
        { type: "Gateway", label: "Gateway", icon: Shield, defaultLabel: "API Gateway" },
        { type: "Service", label: "Service", icon: Cpu, defaultLabel: "Microservice" },
        { type: "Cache", label: "Cache", icon: Zap, defaultLabel: "Redis Cache" },
        { type: "Database", label: "Database", icon: Database, defaultLabel: "Postgres DB" },
        { type: "Queue", label: "Queue", icon: Server, defaultLabel: "Kafka MQ" },
        { type: "CDN", label: "CDN", icon: Globe, defaultLabel: "CloudFront" },
    ];

    // Setup canvas
    const initCanvas = useCallback(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext("2d");
        ctx.lineCap = "round";
        ctx.lineJoin = "round";
        ctx.lineWidth = 3;
    }, []);

    useEffect(() => {
        initCanvas();
    }, [isExpanded, initCanvas]);

    // Handle screen resize to adjust nodes if needed
    useEffect(() => {
        const handleResize = () => {
            const isMobile = window.innerWidth < 640;
            if (isMobile && !isExpanded) {
                setElements((prev) =>
                    prev.map((el) => ({
                        ...el,
                        x: Math.min(el.x, Math.max(10, window.innerWidth - 140)),
                        y: Math.min(el.y, 200),
                    }))
                );
            }
        };
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
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
        const board = boardAreaRef.current;
        const maxW = board ? board.clientWidth - 130 : 160;
        const maxH = board ? board.clientHeight - 60 : 160;
        const newEl = {
            id: Date.now(),
            type: primitive.type,
            x: Math.max(8, Math.floor(Math.random() * maxW)),
            y: Math.max(8, Math.floor(Math.random() * maxH)),
            icon: primitive.icon,
            label: primitive.defaultLabel,
        };
        setElements((prev) => [...prev, newEl]);
    };

    // Node Dragging with Boundary Clamping
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

            const board = boardAreaRef.current;
            const maxW = board ? board.clientWidth - 125 : 160;
            const maxH = board ? board.clientHeight - 55 : 210;

            const targetX = clientX - dragOffset.x;
            const targetY = clientY - dragOffset.y;

            setElements((prev) =>
                prev.map((el) =>
                    el.id === selectedElement
                        ? {
                              ...el,
                              x: Math.min(Math.max(5, targetX), Math.max(10, maxW)),
                              y: Math.min(Math.max(5, targetY), Math.max(10, maxH)),
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
            className={`bg-white rounded-3xl border border-slate-200 shadow-xl overflow-hidden flex flex-col w-full max-w-full ${
                isExpanded ? "h-full flex-1" : ""
            }`}
            onMouseMove={handleMoveDragElement}
            onMouseUp={handleEndDragElement}
            onTouchMove={handleMoveDragElement}
            onTouchEnd={handleEndDragElement}
        >
            {/* Whiteboard Responsive 2-Row / 1-Row Toolbar */}
            <div className="bg-slate-900 px-3 py-2.5 sm:px-6 sm:py-3 border-b border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-white w-full">
                {/* Row 1: Drawing Mode & Color Swatches */}
                <div className="flex items-center justify-between sm:justify-start gap-2 w-full sm:w-auto">
                    <div className="flex items-center gap-1.5">
                        <button
                            type="button"
                            onClick={() => setTool("pencil")}
                            className={`px-2.5 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1 min-h-[32px] ${
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
                            className={`px-2.5 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1 min-h-[32px] ${
                                tool === "eraser" ? "bg-blue-600 text-white shadow-xs" : "text-slate-400 hover:bg-slate-800"
                            }`}
                            title="Eraser"
                        >
                            <Eraser size={13} />
                            <span>Erase</span>
                        </button>
                    </div>

                    {/* Color Swatches */}
                    <div className="flex items-center gap-1.5">
                        {["#3b82f6", "#10b981", "#8b5cf6", "#f43f5e"].map((c) => (
                            <button
                                key={c}
                                type="button"
                                onClick={() => {
                                    setColor(c);
                                    setTool("pencil");
                                }}
                                className={`w-5 h-5 rounded-full transition-transform ${
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

                {/* Row 2: Action Buttons (Clear, Reset, Expand) */}
                <div className="flex items-center justify-between sm:justify-end gap-1.5 w-full sm:w-auto pt-1 sm:pt-0 border-t border-slate-800/80 sm:border-t-0">
                    <div className="flex items-center gap-1.5">
                        <button
                            type="button"
                            onClick={clearCanvas}
                            className="px-2.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold transition flex items-center gap-1 min-h-[32px]"
                            title="Clear connector lines"
                        >
                            <RotateCcw size={12} />
                            <span>Clear</span>
                        </button>

                        <button
                            type="button"
                            onClick={handleResetLayout}
                            className="px-2.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold transition flex items-center gap-1 min-h-[32px]"
                            title="Auto-arrange & reset architecture nodes"
                        >
                            <LayoutGrid size={12} />
                            <span>Reset</span>
                        </button>
                    </div>

                    <button
                        type="button"
                        onClick={() => setIsExpanded(!isExpanded)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 min-h-[32px] ${
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
            <div className="bg-slate-50 px-3 py-2 border-b border-slate-200 flex items-center gap-1.5 overflow-x-auto no-scrollbar w-full max-w-full">
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
                            className="px-2.5 py-1 bg-white hover:bg-indigo-50 border border-slate-200 hover:border-indigo-300 rounded-xl text-xs font-bold text-slate-700 hover:text-indigo-700 transition flex items-center gap-1 shrink-0 shadow-2xs min-h-[28px]"
                        >
                            <Icon size={12} className="text-indigo-600 shrink-0" />
                            <span>+ {prim.label}</span>
                        </button>
                    );
                })}
            </div>

            {/* Main Interactive Diagramming Board Canvas */}
            <div
                ref={boardAreaRef}
                className={`relative w-full max-w-full bg-slate-50/60 overflow-hidden select-none ${
                    isExpanded ? "flex-1 min-h-[450px]" : "h-[270px] sm:h-[420px]"
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
                            className={`absolute cursor-move p-1.5 sm:p-2 rounded-xl bg-white border shadow-md transition-shadow z-20 flex items-center gap-1.5 w-[118px] sm:w-[155px] ${
                                isSelected
                                    ? "border-blue-500 ring-2 ring-blue-500/20 shadow-lg"
                                    : "border-slate-300 hover:border-slate-400"
                            }`}
                        >
                            <div className="w-5 h-5 sm:w-6 sm:h-6 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
                                <Icon size={12} />
                            </div>
                            <div className="truncate flex-1 min-w-0">
                                <span className="text-[8px] sm:text-[9px] font-bold uppercase text-slate-400 block leading-none truncate">
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
                                    className="text-[10px] sm:text-xs font-bold text-slate-800 bg-transparent border-0 p-0 focus:outline-none focus:ring-0 w-full truncate"
                                />
                            </div>
                        </div>
                    );
                })}

                {/* Freehand Connector Canvas */}
                <canvas
                    ref={canvasRef}
                    width={isExpanded ? 1400 : 800}
                    height={isExpanded ? 800 : 420}
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
            <div className="fixed inset-0 z-50 bg-slate-950/95 backdrop-blur-md p-2 sm:p-6 flex flex-col animate-in fade-in zoom-in-95 duration-150">
                <div className="flex-1 w-full max-w-7xl mx-auto flex flex-col overflow-hidden">
                    {whiteboardContent}
                </div>
            </div>
        );
    }

    return whiteboardContent;
}
