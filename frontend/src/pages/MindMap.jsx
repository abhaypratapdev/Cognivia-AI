import { useState, useCallback } from 'react';
import ReactFlow, { Background, Controls, MiniMap, addEdge, useNodesState, useEdgesState } from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { FiDownload, FiRefreshCw } from 'react-icons/fi';
import { toast } from 'react-hot-toast';

const initialNodes = [
  { id: '1', position: { x: 250, y: 0 }, data: { label: 'Main Topic' } },
  { id: '2', position: { x: 100, y: 100 }, data: { label: 'Subtopic 1' } },
  { id: '3', position: { x: 400, y: 100 }, data: { label: 'Subtopic 2' } },
];

const initialEdges = [
  { id: 'e1-2', source: '1', target: '2' },
  { id: 'e1-3', source: '1', target: '3' },
];

export default function MindMap({ summaryText }) {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  const onConnect = useCallback(
    (params) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  );

  const generateMindMap = () => {
    if (!summaryText) {
      toast.error('No summary available to generate mind map');
      return;
    }

    // In a real app, send summary to backend to generate mind map structure
    // For now, create a simple structure
    const words = summaryText.split(/\s+/).slice(0, 10);
    const newNodes = [
      { id: '1', position: { x: 400, y: 200 }, data: { label: 'Main Topic' } },
    ];
    const newEdges = [];

    words.forEach((word, index) => {
      const angle = (index / words.length) * 2 * Math.PI;
      const radius = 200;
      const x = 400 + radius * Math.cos(angle);
      const y = 200 + radius * Math.sin(angle);
      newNodes.push({
        id: `${index + 2}`,
        position: { x, y },
        data: { label: word },
      });
      newEdges.push({
        id: `e1-${index + 2}`,
        source: '1',
        target: `${index + 2}`,
      });
    });

    setNodes(newNodes);
    setEdges(newEdges);
    toast.success('Mind map generated!');
  };

  const downloadMindMap = () => {
    // In a real app, convert ReactFlow to image using html2canvas
    toast.info('Download feature will be implemented with html2canvas');
  };

  return (
    <div className="w-full h-[600px] bg-white dark:bg-gray-800 rounded-xl shadow-lg relative">
      <div className="absolute top-4 right-4 z-10 flex gap-2">
        <button
          onClick={generateMindMap}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition flex items-center gap-2"
        >
          <FiRefreshCw className="w-4 h-4" />
          Generate
        </button>
        <button
          onClick={downloadMindMap}
          className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition flex items-center gap-2"
        >
          <FiDownload className="w-4 h-4" />
          Download
        </button>
      </div>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        fitView
      >
        <Background />
        <Controls />
        <MiniMap />
      </ReactFlow>
    </div>
  );
}

