"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { useTheme } from "next-themes";
import {
  ReactFlow,
  Background,
  Controls,
  MiniMap,
  useNodesState,
  useEdgesState,
  type Node,
  type Edge,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { Loader2 } from "lucide-react";
import type { KnowledgeItem } from "@/types";
import { KnowledgeType } from "@/types";

const typeColors: Record<KnowledgeType, string> = {
  [KnowledgeType.NOTE]: "#c4a47c",
  [KnowledgeType.LINK]: "#8a8a8a",
  [KnowledgeType.INSIGHT]: "#d4b48c",
};

const typeLabels: Record<KnowledgeType, string> = {
  [KnowledgeType.NOTE]: "Note",
  [KnowledgeType.LINK]: "Link",
  [KnowledgeType.INSIGHT]: "Insight",
};

function buildGraph(items: KnowledgeItem[]) {
  const cx = 500;
  const cy = 400;
  const radius = Math.max(250, Math.min(400, items.length * 80));

  // Compute positions first
  const positions = items.map((_, idx) => {
    const angle = (2 * Math.PI * idx) / items.length;
    return {
      x: cx + radius * Math.cos(angle),
      y: cy + radius * Math.sin(angle),
    };
  });

  const nodes: Node[] = items.map((item, idx) => ({
    id: item.id,
    position: positions[idx],
    data: {
      label: (
        <div className="text-center">
          <div
            className="mx-auto mb-1 inline-block rounded-full px-2 py-0.5 text-[10px] font-medium"
            style={{ backgroundColor: typeColors[item.type], color: "var(--bg)" }}
          >
            {typeLabels[item.type]}
          </div>
          <div className="max-w-[140px] truncate text-xs font-medium text-foreground">
            {item.title}
          </div>
        </div>
      ),
    },
    style: {
      background: "var(--srf)",
      border: `2px solid ${typeColors[item.type]}60`,
      borderRadius: "12px",
      padding: "8px 12px",
      minWidth: "120px",
    },
  }));

  const edges: Edge[] = [];
  const edgeColor = "#c4a47c";

  for (let i = 0; i < items.length; i++) {
    for (let j = i + 1; j < items.length; j++) {
      const sharedTags = items[i].tags.filter((t1) =>
        items[j].tags.some((t2) => t2.name === t1.name)
      );
      if (sharedTags.length > 0) {
        edges.push({
          id: `${items[i].id}-${items[j].id}`,
          source: items[i].id,
          target: items[j].id,
          type: "straight",
          style: {
            stroke: edgeColor,
            strokeWidth: 2,
            opacity: 0.5 + Math.min(0.5, sharedTags.length * 0.15),
          },
          label: sharedTags.map((t) => t.name).join(", "),
          labelStyle: { fill: "var(--fg)", fontSize: 10 },
          labelBgStyle: { fill: "var(--srf)", fillOpacity: 0.9 },
          animated: true,
        });
      }
    }
  }

  return { nodes, edges };
}

export default function GraphPage() {
  const router = useRouter();
  const { resolvedTheme } = useTheme();
  const [nodes, setNodes, onNodesChange] = useNodesState<Node>([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState<Edge>([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const fetchItems = async () => {
      try {
        const res = await fetch("/api/knowledge?limit=100");
        if (res.ok) {
          const data = await res.json();
          const items: KnowledgeItem[] = data.items || [];
          const graph = buildGraph(items);
          setNodes(graph.nodes);
          setEdges(graph.edges);
        }
      } catch {
        // silently handle
      } finally {
        setLoading(false);
      }
    };
    fetchItems();
  }, [setNodes, setEdges]);

  const onNodeClick = React.useCallback(
    (_: React.MouseEvent, node: Node) => {
      router.push(`/item/${node.id}`);
    },
    [router]
  );

  if (loading) {
    return (
      <div className="flex h-[calc(100vh-4rem)] items-center justify-center">
        <div className="flex flex-col items-center gap-3 text-muted">
          <Loader2 className="h-8 w-8 animate-spin text-accent" />
          <p className="text-sm">Loading knowledge graph...</p>
        </div>
      </div>
    );
  }

  if (nodes.length === 0) {
    return (
      <div className="flex h-[calc(100vh-4rem)] items-center justify-center">
        <div className="text-center max-w-sm">
          <p className="text-foreground text-sm font-medium mb-2">No knowledge items yet</p>
          <p className="text-dim text-xs leading-relaxed">
            Add notes, links, and insights from the Capture page. When items share the same tags, they&apos;ll be connected here visually.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-[calc(100vh-4rem)] w-full">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onNodeClick={onNodeClick}
        fitView
        fitViewOptions={{ padding: 0.3 }}
        proOptions={{ hideAttribution: true }}
        colorMode={resolvedTheme === "dark" ? "dark" : "light"}
      >
        <Background gap={32} size={1} />
        <Controls position="top-left" />
        <MiniMap nodeColor={() => "#c4a47c"} />
      </ReactFlow>

      {/* Legend */}
      <div className="absolute bottom-4 left-4 z-10 rounded-lg border border-border bg-surface px-4 py-3">
        <div className="flex items-center gap-4 text-xs mb-2">
          {Object.entries(typeLabels).map(([key, label]) => (
            <div key={key} className="flex items-center gap-1.5">
              <div
                className="h-2.5 w-2.5 rounded-full"
                style={{ backgroundColor: typeColors[key as KnowledgeType] }}
              />
              <span className="text-muted">{label}</span>
            </div>
          ))}
        </div>
        <div className="flex items-center gap-2 text-xs text-dim">
          <div className="h-px w-4 bg-accent" />
          <span>Connected by shared tags</span>
        </div>
        {edges.length === 0 && nodes.length > 0 && (
          <p className="mt-2 text-[10px] text-accent">
            No connections yet — add the same tag to multiple items to link them
          </p>
        )}
      </div>
    </div>
  );
}
