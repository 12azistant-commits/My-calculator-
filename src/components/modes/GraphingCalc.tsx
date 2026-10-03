import React, { useState, useRef, useEffect, useCallback } from 'react';
import { GraphFunction } from '../../types/calculator';
import { evaluateMathExpression } from '../../utils/mathEvaluator';
import { Plus, Trash2, Eye, EyeOff, ZoomIn, ZoomOut, RefreshCw, Sparkles, HelpCircle } from 'lucide-react';

const DEFAULT_COLORS = ['#06b6d4', '#10b981', '#f59e0b', '#f43f5e'];

const PRESETS: { name: string; funcs: string[] }[] = [
  { name: 'Trig Waves', funcs: ['sin(x)', 'cos(x)'] },
  { name: 'Polynomial & Roots', funcs: ['x^3 - 3*x', 'x^2 - 4'] },
  { name: 'Damped Oscillation', funcs: ['exp(-0.3*x) * sin(3*x)', 'exp(-0.3*x)'] },
  { name: 'Rational & Asymptote', funcs: ['1 / x', 'x / (x^2 + 1)'] },
  { name: 'Gaussian Bell', funcs: ['exp(-x^2)', '1 / sqrt(2*PI) * exp(-0.5*x^2)'] },
];

export const GraphingCalc: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const [functions, setFunctions] = useState<GraphFunction[]>([
    { id: '1', expression: 'sin(x)', color: DEFAULT_COLORS[0], visible: true },
    { id: '2', expression: 'x^2 - 4', color: DEFAULT_COLORS[1], visible: true },
  ]);

  // View bounds
  const [xMin, setXMin] = useState(-10);
  const [xMax, setXMax] = useState(10);
  const [yMin, setYMin] = useState(-10);
  const [yMax, setYMax] = useState(10);

  // Mouse hover state
  const [mousePos, setMousePos] = useState<{ x: number; y: number; canvasX: number; canvasY: number } | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState<{ x: number; y: number }>({ x: 0, y: 0 });

  // Add new function
  const handleAddFunction = () => {
    if (functions.length >= 4) return;
    const nextColor = DEFAULT_COLORS[functions.length % DEFAULT_COLORS.length];
    setFunctions([
      ...functions,
      {
        id: Date.now().toString(),
        expression: 'cos(x)',
        color: nextColor,
        visible: true,
      },
    ]);
  };

  // Update expression
  const handleUpdateExpr = (id: string, expr: string) => {
    setFunctions(functions.map((f) => (f.id === id ? { ...f, expression: expr, error: undefined } : f)));
  };

  // Toggle visibility
  const handleToggleVisible = (id: string) => {
    setFunctions(functions.map((f) => (f.id === id ? { ...f, visible: !f.visible } : f)));
  };

  // Remove function
  const handleRemoveFunction = (id: string) => {
    setFunctions(functions.filter((f) => f.id !== id));
  };

  // Apply preset
  const handleApplyPreset = (funcs: string[]) => {
    setFunctions(
      funcs.map((expr, idx) => ({
        id: (idx + 1).toString(),
        expression: expr,
        color: DEFAULT_COLORS[idx % DEFAULT_COLORS.length],
        visible: true,
      }))
    );
    setXMin(-10);
    setXMax(10);
    setYMin(-10);
    setYMax(10);
  };

  // Zoom
  const handleZoom = (factor: number) => {
    const xCenter = (xMin + xMax) / 2;
    const yCenter = (yMin + yMax) / 2;
    const xRange = (xMax - xMin) * factor;
    const yRange = (yMax - yMin) * factor;

    setXMin(xCenter - xRange / 2);
    setXMax(xCenter + xRange / 2);
    setYMin(yCenter - yRange / 2);
    setYMax(yCenter + yRange / 2);
  };

  // Reset view
  const handleResetView = () => {
    setXMin(-10);
    setXMax(10);
    setYMin(-10);
    setYMax(10);
  };

  // Draw Canvas
  const drawGraph = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;

    // Clear canvas
    ctx.fillStyle = '#070a12';
    ctx.fillRect(0, 0, width, height);

    // Coordinate conversion functions
    const toCanvasX = (x: number) => ((x - xMin) / (xMax - xMin)) * width;
    const toCanvasY = (y: number) => height - ((y - yMin) / (yMax - yMin)) * height;
    const toWorldX = (cx: number) => xMin + (cx / width) * (xMax - xMin);

    // Draw Grid Lines
    ctx.lineWidth = 1;
    ctx.strokeStyle = '#1e293b';

    // Grid spacing logic
    const xStep = Math.pow(10, Math.floor(Math.log10((xMax - xMin) / 5)));
    const yStep = Math.pow(10, Math.floor(Math.log10((yMax - yMin) / 5)));

    // Vertical grid lines
    const startX = Math.ceil(xMin / xStep) * xStep;
    for (let x = startX; x <= xMax; x += xStep) {
      const cx = toCanvasX(x);
      ctx.beginPath();
      ctx.moveTo(cx, 0);
      ctx.lineTo(cx, height);
      ctx.stroke();

      // Label ticks
      ctx.fillStyle = '#64748b';
      ctx.font = '10px JetBrains Mono';
      const cyZero = Math.max(15, Math.min(height - 5, toCanvasY(0) + 12));
      ctx.fillText(Number(x.toFixed(2)).toString(), cx + 2, cyZero);
    }

    // Horizontal grid lines
    const startY = Math.ceil(yMin / yStep) * yStep;
    for (let y = startY; y <= yMax; y += yStep) {
      const cy = toCanvasY(y);
      ctx.beginPath();
      ctx.moveTo(0, cy);
      ctx.lineTo(width, cy);
      ctx.stroke();

      // Label ticks
      ctx.fillStyle = '#64748b';
      ctx.font = '10px JetBrains Mono';
      const cxZero = Math.max(5, Math.min(width - 30, toCanvasX(0) + 4));
      if (Math.abs(y) > 1e-6) {
        ctx.fillText(Number(y.toFixed(2)).toString(), cxZero, cy - 2);
      }
    }

    // Draw Main Axes (X and Y = 0)
    ctx.lineWidth = 2;
    ctx.strokeStyle = '#475569';

    // X axis
    const yZero = toCanvasY(0);
    ctx.beginPath();
    ctx.moveTo(0, yZero);
    ctx.lineTo(width, yZero);
    ctx.stroke();

    // Y axis
    const xZero = toCanvasX(0);
    ctx.beginPath();
    ctx.moveTo(xZero, 0);
    ctx.lineTo(xZero, height);
    ctx.stroke();

    // Plot each function
    functions.forEach((fn) => {
      if (!fn.visible || !fn.expression.trim()) return;

      ctx.lineWidth = 2.5;
      ctx.strokeStyle = fn.color;
      ctx.beginPath();

      let isDrawing = false;
      const numSamples = width;

      for (let i = 0; i < numSamples; i++) {
        const cx = i;
        const wx = toWorldX(cx);
        const evalRes = evaluateMathExpression(fn.expression, 'RAD', { x: wx });

        if (evalRes.result !== null && isFinite(evalRes.result)) {
          const cy = toCanvasY(evalRes.result);
          if (cy >= -100 && cy <= height + 100) {
            if (!isDrawing) {
              ctx.moveTo(cx, cy);
              isDrawing = true;
            } else {
              ctx.lineTo(cx, cy);
            }
          } else {
            isDrawing = false;
          }
        } else {
          isDrawing = false;
        }
      }
      ctx.stroke();
    });

    // Draw Mouse Crosshair
    if (mousePos) {
      ctx.lineWidth = 1;
      ctx.setLineDash([4, 4]);
      ctx.strokeStyle = '#94a3b8';

      // Vertical crosshair
      ctx.beginPath();
      ctx.moveTo(mousePos.canvasX, 0);
      ctx.lineTo(mousePos.canvasX, height);
      ctx.stroke();

      // Horizontal crosshair
      ctx.beginPath();
      ctx.moveTo(0, mousePos.canvasY);
      ctx.lineTo(width, mousePos.canvasY);
      ctx.stroke();

      ctx.setLineDash([]); // Reset line dash
    }
  }, [functions, xMin, xMax, yMin, yMax, mousePos]);

  useEffect(() => {
    drawGraph();
  }, [drawGraph]);

  // Canvas mouse handlers
  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const cx = ((e.clientX - rect.left) / rect.width) * canvas.width;
    const cy = ((e.clientY - rect.top) / rect.height) * canvas.height;

    const wx = xMin + (cx / canvas.width) * (xMax - xMin);
    const wy = yMax - (cy / canvas.height) * (yMax - yMin);

    if (isDragging) {
      const dx = ((e.clientX - dragStart.x) / rect.width) * (xMax - xMin);
      const dy = ((e.clientY - dragStart.y) / rect.height) * (yMax - yMin);
      setXMin(xMin - dx);
      setXMax(xMax - dx);
      setYMin(yMin + dy);
      setYMax(yMax + dy);
      setDragStart({ x: e.clientX, y: e.clientY });
    } else {
      setMousePos({ x: wx, y: wy, canvasX: cx, canvasY: cy });
    }
  };

  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    setIsDragging(true);
    setDragStart({ x: e.clientX, y: e.clientY });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleWheel = (e: React.WheelEvent<HTMLCanvasElement>) => {
    e.preventDefault();
    const zoomFactor = e.deltaY > 0 ? 1.15 : 0.85;
    handleZoom(zoomFactor);
  };

  return (
    <div className="flex flex-col lg:flex-row gap-4 mt-3">
      {/* Function Control Panel */}
      <div className="w-full lg:w-80 flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-slate-100 flex items-center gap-1.5">
            Functions f(x)
          </h3>
          <button
            onClick={handleAddFunction}
            disabled={functions.length >= 4}
            className="flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-lg bg-cyan-950 border border-cyan-800 text-cyan-300 hover:bg-cyan-900 transition-colors disabled:opacity-40"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Function</span>
          </button>
        </div>

        {/* Function Inputs List */}
        <div className="space-y-2">
          {functions.map((fn, index) => (
            <div key={fn.id} className="bg-slate-900/90 border border-slate-800 rounded-xl p-2.5 space-y-2">
              <div className="flex items-center gap-2">
                <span
                  className="w-3 h-3 rounded-full shrink-0 shadow-sm"
                  style={{ backgroundColor: fn.color }}
                />
                <span className="text-xs font-mono text-slate-400 font-bold shrink-0">
                  f{index + 1}(x) =
                </span>
                <input
                  type="text"
                  value={fn.expression}
                  onChange={(e) => handleUpdateExpr(fn.id, e.target.value)}
                  placeholder="e.g. sin(x)"
                  className="flex-1 bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1 text-xs font-mono text-slate-100 focus:outline-none focus:border-cyan-500"
                />
                <button
                  onClick={() => handleToggleVisible(fn.id)}
                  className="p-1 text-slate-400 hover:text-slate-200 transition-colors"
                  title="Toggle Visibility"
                >
                  {fn.visible ? <Eye className="w-3.5 h-3.5 text-cyan-400" /> : <EyeOff className="w-3.5 h-3.5" />}
                </button>
                {functions.length > 1 && (
                  <button
                    onClick={() => handleRemoveFunction(fn.id)}
                    className="p-1 text-slate-400 hover:text-rose-400 transition-colors"
                    title="Remove Function"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Presets Gallery */}
        <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-3 space-y-2">
          <div className="text-xs font-semibold text-slate-400 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
            <span>Graph Presets</span>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {PRESETS.map((p) => (
              <button
                key={p.name}
                onClick={() => handleApplyPreset(p.funcs)}
                className="px-2.5 py-1 text-[11px] font-medium bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg border border-slate-700/60 transition-colors"
              >
                {p.name}
              </button>
            ))}
          </div>
        </div>

        {/* Live Coordinate Callout */}
        {mousePos && (
          <div className="bg-slate-950 border border-cyan-500/30 rounded-xl p-3 font-mono text-xs text-slate-300 space-y-1">
            <div className="text-[10px] text-cyan-400 uppercase font-bold tracking-wider">
              Cursor Coordinates
            </div>
            <div className="flex justify-between">
              <span>X = {mousePos.x.toFixed(4)}</span>
              <span>Y = {mousePos.y.toFixed(4)}</span>
            </div>
            {/* Value for each visible function */}
            <div className="pt-1 border-t border-slate-800 space-y-0.5">
              {functions.map((fn, idx) => {
                if (!fn.visible) return null;
                const evalRes = evaluateMathExpression(fn.expression, 'RAD', { x: mousePos.x });
                return (
                  <div key={fn.id} className="flex justify-between text-[11px]" style={{ color: fn.color }}>
                    <span>f{idx + 1}({mousePos.x.toFixed(2)}):</span>
                    <span>{evalRes.result !== null ? evalRes.result.toFixed(4) : 'NaN'}</span>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Main Canvas Viewport */}
      <div className="flex-1 flex flex-col gap-2">
        <div className="relative border border-slate-800 rounded-2xl overflow-hidden bg-slate-950 shadow-2xl">
          <canvas
            ref={canvasRef}
            width={720}
            height={480}
            onMouseMove={handleMouseMove}
            onMouseDown={handleMouseDown}
            onMouseUp={handleMouseUp}
            onMouseLeave={() => {
              setIsDragging(false);
              setMousePos(null);
            }}
            onWheel={handleWheel}
            className="w-full h-[360px] md:h-[440px] cursor-crosshair touch-none"
          />

          {/* Canvas Floating Toolbar */}
          <div className="absolute top-3 right-3 flex items-center gap-1.5 bg-slate-900/90 border border-slate-800 p-1.5 rounded-xl backdrop-blur-md">
            <button
              onClick={() => handleZoom(0.8)}
              className="p-1.5 text-slate-300 hover:text-cyan-300 hover:bg-slate-800 rounded-lg transition-colors"
              title="Zoom In"
            >
              <ZoomIn className="w-4 h-4" />
            </button>
            <button
              onClick={() => handleZoom(1.25)}
              className="p-1.5 text-slate-300 hover:text-cyan-300 hover:bg-slate-800 rounded-lg transition-colors"
              title="Zoom Out"
            >
              <ZoomOut className="w-4 h-4" />
            </button>
            <button
              onClick={handleResetView}
              className="p-1.5 text-slate-300 hover:text-cyan-300 hover:bg-slate-800 rounded-lg transition-colors"
              title="Reset View Window"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
          </div>

          {/* Controls Hint */}
          <div className="absolute bottom-3 left-3 text-[10px] font-mono text-slate-400 bg-slate-900/80 px-2.5 py-1 rounded-lg border border-slate-800 pointer-events-none">
            Drag to pan • Scroll to zoom • Hover for crosshairs
          </div>
        </div>
      </div>
    </div>
  );
};
