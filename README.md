"use client";

import React, { useState, useRef, useCallback } from "react";

export interface TimelineItem {
  id: string;
  startDate: string; // YYYY/MM/DD format
  endDate: string; // YYYY/MM/DD format
  title: string;
  color?: string;
}

interface SimpleTimelineProps {
  items: TimelineItem[];
  onItemsChange: (items: TimelineItem[]) => void;
  dateRange: string[]; // Array of dates in YYYY/MM/DD format
}

const TimelineSegment: React.FC<{
  item: TimelineItem;
  scale: number;
  timelineHeight: number;
  dateRange: string[];
  onPositionChange: (id: string, startDate: string, endDate: string) => void;
}> = ({ item, scale, timelineHeight, dateRange, onPositionChange }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState<{
    mouseX: number;
    startIndex: number;
    endIndex: number;
  } | null>(null);

  const startIndex = dateRange.indexOf(item.startDate);
  const endIndex = dateRange.indexOf(item.endDate);

  // Calculate position and width based on date range proportions
  const totalDays = dateRange.length;
  const segmentDays = endIndex - startIndex + 1;

  // Get container width from parent
  const containerWidth = scale * totalDays; // scale here represents pixels per day
  const width = (segmentDays / totalDays) * containerWidth;
  const leftPosition = (startIndex / totalDays) * containerWidth;

  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsDragging(true);
    setDragStart({
      mouseX: e.clientX,
      startIndex: startIndex,
      endIndex: endIndex,
    });
  };

  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      if (!isDragging || !dragStart) return;

      const deltaX = e.clientX - dragStart.mouseX;
      const totalDays = dateRange.length;
      const containerWidth = scale * totalDays;
      const deltaDays = Math.round((deltaX / containerWidth) * totalDays);

      const newStartIndex = Math.max(
        0,
        Math.min(dateRange.length - 1, dragStart.startIndex + deltaDays)
      );
      const duration = dragStart.endIndex - dragStart.startIndex;
      const newEndIndex = Math.min(
        dateRange.length - 1,
        newStartIndex + duration
      );

      if (newStartIndex >= 0 && newEndIndex < dateRange.length) {
        onPositionChange(
          item.id,
          dateRange[newStartIndex],
          dateRange[newEndIndex]
        );
      }
    },
    [isDragging, dragStart, scale, onPositionChange, item.id, dateRange]
  );

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
    setDragStart(null);
  }, []);

  React.useEffect(() => {
    if (isDragging) {
      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
      return () => {
        document.removeEventListener("mousemove", handleMouseMove);
        document.removeEventListener("mouseup", handleMouseUp);
      };
    }
  }, [isDragging, handleMouseMove, handleMouseUp]);

  return (
    <div
      className={`absolute cursor-move select-none transition-opacity rounded border-1 ${
        isDragging ? "opacity-80 z-10" : "opacity-100"
      }`}
      style={{
        left: leftPosition,
        width: width,
        minWidth: width,
        height: timelineHeight,
        backgroundColor: item.color || "#3b82f6",
      }}
      onMouseDown={handleMouseDown}
    >
      <div className="h-full flex items-center justify-center rounded text-white text-xs font-medium px-2">
        <span className="truncate">{item.title}</span>
      </div>
    </div>
  );
};

const TimeMarkers: React.FC<{ dateRange: string[]; scale: number }> = ({
  dateRange,
}) => {
  const markers: React.ReactElement[] = [];

  dateRange.forEach((date, index) => {
    const showEvery =
      dateRange.length > 20 ? Math.ceil(dateRange.length / 10) : 1;

    if (index % showEvery === 0) {
      markers.push(
        <div
          key={date}
          className="absolute flex flex-col items-center text-xs text-gray-500"
          style={{ left: `${(index / dateRange.length) * 100}%` }}
        >
          <div className="w-px h-4 bg-gray-300" />
          <span className="mt-1 transform origin-left whitespace-nowrap">
            {date}
          </span>
        </div>
      );
    }
  });

  return <div className="relative h-12 mb-4">{markers}</div>;
};

export const SimpleTimeline: React.FC<SimpleTimelineProps> = ({
  items,
  onItemsChange,
  dateRange,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const heightTimeLine: number = 100;

  // Get container width for calculations
  const [containerWidth, setContainerWidth] = React.useState(800);

  React.useEffect(() => {
    const updateWidth = () => {
      if (containerRef.current) {
        const width = containerRef.current.clientWidth - 30; // subtract padding
        setContainerWidth(width);
      }
    };

    updateWidth();
    window.addEventListener("resize", updateWidth);
    return () => window.removeEventListener("resize", updateWidth);
  }, []);

  const handlePositionChange = (
    id: string,
    startDate: string,
    endDate: string
  ) => {
    const updatedItems = items.map((item) =>
      item.id === id ? { ...item, startDate, endDate } : item
    );
    onItemsChange(updatedItems);
  };

  return (
    <div className="w-full p-4 bg-white rounded-lg border">
      <h3 className="text-lg font-semibold mb-4">Timeline Editor</h3>

      {/* Timeline Container */}
      <div
        ref={containerRef}
        className="relative bg-gray-50 rounded-lg p-4 w-full"
      >
        {/* Timeline Track */}
        <div
          className="relative bg-gray-200 rounded mb-2 w-full"
          style={{
            height: heightTimeLine,
          }}
        >
          {/* Grid lines */}
          <div className="absolute inset-0">
            {dateRange.map((_, i) => (
              <div
                key={i}
                className="absolute top-0 w-px h-full bg-gray-300 opacity-30"
                style={{ left: `${(i / dateRange.length) * 100}%` }}
              />
            ))}
          </div>

          {items.length > 0 && (
            <TimelineSegment
              key={items[0].id}
              item={items[0]}
              scale={containerWidth / dateRange.length}
              timelineHeight={heightTimeLine}
              dateRange={dateRange}
              onPositionChange={handlePositionChange}
            />
          )}
        </div>
        <TimeMarkers
          dateRange={dateRange}
          scale={containerWidth / dateRange.length}
        />
      </div>
    </div>
  );
};


"use client";

import { useState } from "react";
import { SimpleTimeline, TimelineItem } from "@/components/simple-timeline";

export default function Page() {
  // Generate date range for 2024
  const generateDateRange = (startDate: string, days: number) => {
    const dates = [];
    const start = new Date(startDate);

    for (let i = 0; i < days; i++) {
      const currentDate = new Date(start);
      currentDate.setDate(start.getDate() + i);
      const formatted = currentDate
        .toISOString()
        .split("T")[0]
        .replace(/-/g, "/");
      dates.push(formatted);
    }
    return dates;
  };

  const dateRange = generateDateRange("2024-01-01", 100); // 30 days in January 2024

  const [items, setItems] = useState<TimelineItem[]>([
    {
      id: "segment-1",
      startDate: "2024/01/01",
      endDate: "2024/01/10",
      title: "My Segment",
      color: "#3b82f6",
    },
  ]);

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">
          Timeline với format YYYY/MM/DD - Kéo thả để lấy startDate/endDate
        </h1>

        <SimpleTimeline
          items={items}
          onItemsChange={setItems}
          dateRange={dateRange}
        />

        {/* Debug Info */}
        <div className="mt-8 bg-white rounded-lg shadow p-4">
          <h2 className="text-lg font-semibold mb-4">Timeline Data:</h2>
          <pre className="bg-gray-100 p-4 rounded text-sm overflow-x-auto">
            {JSON.stringify(items, null, 2)}
          </pre>
          <div className="mt-4">
            <h3 className="font-medium mb-2">Date Range:</h3>
            <p className="text-sm text-gray-600">
              {dateRange[0]} to {dateRange[dateRange.length - 1]} (
              {dateRange.length} days)
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}


