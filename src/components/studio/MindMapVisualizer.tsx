import React, { useState, useRef } from 'react';
import { 
  MindMapData, 
  MindMapNode, 
  IngestedSource 
} from '../../types/strater';
import { 
  ZoomIn, 
  ZoomOut, 
  Maximize2, 
  RotateCcw, 
  X, 
  Sparkles, 
  BookOpen, 
  Compass, 
  Layers, 
  Share2 
} from 'lucide-react';

interface MindMapVisualizerProps {
  source: IngestedSource;
  mindMap: MindMapData;
}

export const MindMapVisualizer: React.FC<MindMapVisualizerProps> = ({
  source,
  mindMap
}) => {
  const [zoomLevel, setZoomLevel] = useState<number>(1);
  const [selectedNode, setSelectedNode] = useState<MindMapNode | null>(null);
  const [panOffset, setPanOffset] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const dragStartRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });

  const rootNode = mindMap.nodes.find(n => n.id === mindMap.rootNodeId) || mindMap.nodes[0];

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    dragStartRef.current = { x: e.clientX - panOffset.x, y: e.clientY - panOffset.y };
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    setPanOffset({
      x: e.clientX - dragStartRef.current.x,
      y: e.clientY - dragStartRef.current.y
    });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const resetView = () => {
    setZoomLevel(1);
    setPanOffset({ x: 0, y: 0 });
  };

  // Node position helper lookup
  const nodeMap = new Map<string, MindMapNode>();
  mindMap.nodes.forEach(n => nodeMap.set(n.id, n));

  return (
    <div className="space-y-4 max-w-6xl mx-auto pb-12 animate-fade-in">
      
      {/* Header & Controls Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-2xl bg-[#1c1c1e] border border-white/10">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-[#bf5af2]/20 text-[#bf5af2] border border-[#bf5af2]/30">
              Interactive Concept Graph
            </span>
            <span className="text-xs text-[#86868b]">{mindMap.nodes.length} Nodes • {mindMap.edges.length} Semantic Connections</span>
          </div>
          <h2 className="text-sm sm:text-base font-semibold text-white tracking-tight mt-1">{source.title}</h2>
        </div>

        {/* Toolbar Controls */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 bg-white/5 p-1 rounded-xl border border-white/10">
            <button
              onClick={() => setZoomLevel(prev => Math.min(1.8, prev + 0.15))}
              className="p-1.5 rounded-lg text-[#86868b] hover:text-white hover:bg-white/10 transition-colors"
              title="Zoom In"
            >
              <ZoomIn className="w-3.5 h-3.5" />
            </button>
            <span className="text-[11px] font-mono text-[#86868b] px-1.5">{Math.round(zoomLevel * 100)}%</span>
            <button
              onClick={() => setZoomLevel(prev => Math.max(0.5, prev - 0.15))}
              className="p-1.5 rounded-lg text-[#86868b] hover:text-white hover:bg-white/10 transition-colors"
              title="Zoom Out"
            >
              <ZoomOut className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={resetView}
              className="p-1.5 rounded-lg text-[#86868b] hover:text-white hover:bg-white/10 transition-colors"
              title="Reset View"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Main Interactive SVG Mind Map Canvas */}
      <div 
        className="relative w-full h-[580px] rounded-3xl bg-gradient-to-b from-[#121214] to-[#1c1c1e] border border-white/10 overflow-hidden cursor-grab active:cursor-grabbing select-none shadow-2xl"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      >
        {/* Background Grid Dots */}
        <div 
          className="absolute inset-0 opacity-15 pointer-events-none"
          style={{
            backgroundImage: 'radial-gradient(circle, #ffffff 1px, transparent 1px)',
            backgroundSize: '24px 24px'
          }}
        />

        {/* Scaled/Panned Graph Container */}
        <div 
          className="w-full h-full relative transition-transform duration-75"
          style={{
            transform: `translate(${panOffset.x}px, ${panOffset.y}px) scale(${zoomLevel})`,
            transformOrigin: 'center center'
          }}
        >
          {/* SVG Connection Lines */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ width: '1000px', height: '600px' }}>
            <defs>
              <linearGradient id="edgeGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#0071e3" stopOpacity="0.6" />
                <stop offset="100%" stopColor="#2997ff" stopOpacity="0.2" />
              </linearGradient>
            </defs>

            {mindMap.edges.map(edge => {
              const srcNode = nodeMap.get(edge.source);
              const tgtNode = nodeMap.get(edge.target);
              if (!srcNode || !tgtNode) return null;

              const sx = srcNode.x || 400;
              const sy = srcNode.y || 260;
              const tx = tgtNode.x || 200;
              const ty = tgtNode.y || 120;

              // Cubic bezier curve path
              const midX = (sx + tx) / 2;
              const d = `M ${sx} ${sy} C ${midX} ${sy}, ${midX} ${ty}, ${tx} ${ty}`;

              return (
                <g key={edge.id}>
                  <path
                    d={d}
                    fill="none"
                    stroke="#ffffff"
                    strokeOpacity="0.2"
                    strokeWidth="2"
                    strokeDasharray={tgtNode.depth === 2 ? '4 4' : 'none'}
                  />
                  {edge.label && (
                    <text
                      x={midX}
                      y={(sy + ty) / 2 - 6}
                      fill="#86868b"
                      fontSize="9"
                      fontFamily="sans-serif"
                      textAnchor="middle"
                    >
                      {edge.label}
                    </text>
                  )}
                </g>
              );
            })}
          </svg>

          {/* Interactive Graph Nodes */}
          {mindMap.nodes.map(node => {
            const isRoot = node.id === mindMap.rootNodeId;
            const isSelected = selectedNode?.id === node.id;
            const x = node.x || 400;
            const y = node.y || 260;

            return (
              <div
                key={node.id}
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedNode(node);
                }}
                className={`absolute cursor-pointer transition-all duration-200 group ${
                  isRoot
                    ? 'p-4 rounded-2xl bg-gradient-to-r from-[#0071e3] to-[#2997ff] text-white shadow-xl shadow-[#0071e3]/30 border border-white/30 text-center font-bold text-xs sm:text-sm max-w-[220px]'
                    : node.depth === 1
                    ? 'px-3.5 py-2.5 rounded-xl bg-[#1c1c1e] text-white border shadow-md font-semibold text-xs max-w-[190px]'
                    : 'px-2.5 py-1.5 rounded-lg bg-[#2c2c2e]/90 text-[#d1d1d6] border shadow-sm font-medium text-[11px] max-w-[170px]'
                } ${
                  isSelected
                    ? 'ring-2 ring-white ring-offset-2 ring-offset-black scale-105'
                    : 'hover:scale-105'
                }`}
                style={{
                  left: `${x}px`,
                  top: `${y}px`,
                  transform: 'translate(-50%, -50%)',
                  borderColor: node.color ? `${node.color}55` : 'rgba(255,255,255,0.1)'
                }}
              >
                <div className="flex items-center gap-1.5 justify-center">
                  {node.color && (
                    <span 
                      className="w-2 h-2 rounded-full shrink-0" 
                      style={{ backgroundColor: node.color }} 
                    />
                  )}
                  <span className="truncate">{node.label}</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Selected Node Concept Deep-Dive Drawer */}
        {selectedNode && (
          <div className="absolute right-4 top-4 bottom-4 w-80 sm:w-96 rounded-2xl bg-[#1c1c1e]/95 backdrop-blur-2xl border border-white/15 p-5 shadow-2xl flex flex-col justify-between animate-fade-in-down z-20 overflow-y-auto">
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <div className="flex items-center gap-2">
                  <span 
                    className="w-2.5 h-2.5 rounded-full" 
                    style={{ backgroundColor: selectedNode.color || '#0071e3' }} 
                  />
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#a1a1a6]">
                    {selectedNode.category.replace('_', ' ')}
                  </span>
                </div>
                <button
                  onClick={() => setSelectedNode(null)}
                  className="p-1 rounded-lg text-[#86868b] hover:text-white hover:bg-white/10"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="space-y-1.5">
                <h3 className="text-base font-bold text-white leading-snug">{selectedNode.label}</h3>
                <p className="text-xs text-[#a1a1a6] leading-relaxed">
                  {selectedNode.summary}
                </p>
              </div>

              <div className="p-3.5 rounded-xl bg-white/[0.03] border border-white/5 space-y-2">
                <span className="text-[11px] font-semibold text-white flex items-center gap-1.5">
                  <Compass className="w-3.5 h-3.5 text-[#2997ff]" /> Contextual Relationship
                </span>
                <p className="text-xs text-[#86868b] leading-relaxed">
                  Directly linked to <strong className="text-white">{source.title}</strong>. Forms an essential sub-branch in this subject's cognitive mastery graph.
                </p>
              </div>
            </div>

            <div className="pt-4 border-t border-white/10 flex justify-end">
              <button
                onClick={() => setSelectedNode(null)}
                className="px-4 py-1.5 rounded-xl bg-white/10 hover:bg-white/15 text-xs text-white font-medium transition-colors"
              >
                Close Drawer
              </button>
            </div>
          </div>
        )}

      </div>

    </div>
  );
};
