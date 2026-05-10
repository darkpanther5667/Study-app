'use client';

import { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import * as d3 from 'd3';
import { ChevronRight } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { pageAnim } from '@/lib/animations';
import { SUBJECT_COLORS, type Subject } from '@/types/grasp';

const mockScores: { subject: Subject; score: number }[] = [
  { subject: 'Physics', score: 65 }, { subject: 'Chemistry', score: 45 }, { subject: 'Maths', score: 80 }, { subject: 'Biology', score: 30 }, { subject: 'History', score: 55 }, { subject: 'English', score: 70 },
];

export default function RadarPage() {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (!svgRef.current) return;
    const width = 300, height = 300, cx = width / 2, cy = height / 2, r = 100;
    const subjects = mockScores.map(s => s.subject);
    const angleSlice = (Math.PI * 2) / subjects.length;
    const svg = d3.select(svgRef.current).attr('width', width).attr('height', height);
    svg.selectAll('*').remove();
    for (let i = 1; i <= 4; i++) svg.append('circle').attr('cx', cx).attr('cy', cy).attr('r', (r / 4) * i).attr('fill', 'none').attr('stroke', 'var(--text-3)').attr('stroke-opacity', 0.1);
    subjects.forEach((_, i) => { const a = angleSlice * i - Math.PI / 2; svg.append('line').attr('x1', cx).attr('y1', cy).attr('x2', cx + r * Math.cos(a)).attr('y2', cy + r * Math.sin(a)).attr('stroke', 'var(--text-3)').attr('stroke-opacity', 0.2); });
    subjects.forEach((s, i) => { const a = angleSlice * i - Math.PI / 2; const lr = r + 20; svg.append('text').attr('x', cx + lr * Math.cos(a)).attr('y', cy + lr * Math.sin(a)).attr('text-anchor', 'middle').attr('dominant-baseline', 'middle').attr('fill', 'var(--text-2)').attr('font-size', '11px').attr('font-weight', '500').text(s); });
    const radarLine = d3.lineRadial<typeof mockScores[0]>().radius(d => (d.score / 100) * r).angle((_, i) => i * angleSlice).curve(d3.curveLinearClosed);
    const points = mockScores.map((d, i) => ({ ...d, angle: i * angleSlice }));
    svg.append('path').datum(points).attr('d', radarLine as any).attr('transform', `translate(${cx}, ${cy})`).attr('fill', 'var(--brand)').attr('fill-opacity', 0.3).attr('stroke', 'var(--brand)').attr('stroke-width', 2);
    points.forEach(p => { const x = cx + (p.score / 100) * r * Math.cos(p.angle); const y = cy + (p.score / 100) * r * Math.sin(p.angle); svg.append('circle').attr('cx', x).attr('cy', y).attr('r', 5).attr('fill', SUBJECT_COLORS[p.subject as keyof typeof SUBJECT_COLORS] || 'var(--brand)').attr('stroke', 'white').attr('stroke-width', 2); });
  }, []);

  const sorted = [...mockScores].sort((a, b) => a.score - b.score);

  return (
    <motion.div variants={pageAnim} initial="initial" animate="animate" className="min-h-screen bg-[var(--bg-app)] pb-20">
      <div className="bg-[var(--bg-dark)] px-6 py-5"><h1 className="text-xl font-bold text-white">Weak Spot Radar</h1><p className="text-white/60 text-sm mt-1">Identify areas needing practice</p></div>
      <div className="px-6 py-6">
        <Card variant="grasp" className="p-6 flex justify-center mb-6"><svg ref={svgRef} /></Card>
        <Card variant="grasp" className="p-5">
          <h3 className="font-semibold text-[var(--text-1)] mb-4">Subjects by Score</h3>
          <div className="space-y-3">
            {sorted.map((item, i) => {
              const color = SUBJECT_COLORS[item.subject as keyof typeof SUBJECT_COLORS] || 'var(--brand)';
              return (
                <motion.div key={item.subject} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.1 }} className="flex items-center justify-between py-2">
                  <div className="flex items-center gap-3"><div className="w-3 h-3 rounded-full" style={{ backgroundColor: color }} /><span className="font-medium text-[var(--text-1)]">{item.subject}</span></div>
                  <div className="flex items-center gap-3">
                    <Badge variant={item.score >= 75 ? 'green' : item.score >= 40 ? 'orange' : 'red'}>{item.score}%</Badge>
                    <Button variant="ghost" size="sm">Practice <ChevronRight className="h-4 w-4" /></Button>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </Card>
      </div>
    </motion.div>
  );
}