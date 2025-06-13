"use client";

import React, { useEffect, useRef, useState } from "react";
import Head from "next/head";

export default function Home() {
  const canvasRef = useRef(null);

  const [text, setText] = useState("മലയാളം");
  const [fontSize, setFontSize] = useState(60);
  const [fontColor, setFontColor] = useState("#000000");
  const [strokeColor, setStrokeColor] = useState("#ffffff");
  const [strokeWidth, setStrokeWidth] = useState(2);
  const [lineHeight, setLineHeight] = useState(1.5);
  const [fontFamily, setFontFamily] = useState("Noto Sans Malayalam");

  const drawText = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Set styles
    ctx.fillStyle = fontColor;
    ctx.strokeStyle = strokeColor;
    ctx.lineWidth = strokeWidth;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.font = `${fontSize}px "${fontFamily}", sans-serif`;

    // Draw multiline text
    const lines = text.split("\n");
    const baseY =
      canvas.height / 2 - ((lines.length - 1) * fontSize * lineHeight) / 2;

    lines.forEach((line, index) => {
      const y = baseY + index * fontSize * lineHeight;
      ctx.strokeText(line, canvas.width / 2, y);
      ctx.fillText(line, canvas.width / 2, y);
    });
  };

  useEffect(() => {
    if (document.fonts?.ready) {
      document.fonts.ready.then(drawText);
    } else {
      drawText();
    }
  }, [
    text,
    fontSize,
    fontColor,
    strokeColor,
    strokeWidth,
    lineHeight,
    fontFamily,
  ]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-100 to-indigo-200 p-8 font-sans">
      <Head>
        <title>Malayalam Calligraphy Renderer</title>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Dyuthi&family=Kalyani&family=Noto+Sans+Malayalam&display=swap"
          rel="stylesheet"
        />
      </Head>

      <main className="max-w-5xl mx-auto bg-white shadow-lg rounded-2xl p-6 space-y-6">
        <h1 className="text-3xl font-bold text-center text-indigo-600">
          Malayalam Calligraphy Renderer
        </h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Controls */}
          <div className="space-y-4">
            <textarea
              rows={4}
              value={text}
              onChange={(e) => setText(e.target.value)}
              className="w-full p-3 border rounded-lg"
              placeholder="Type Malayalam text here..."
            />

            <div className="grid grid-cols-2 gap-4">
              <label className="block">
                <span className="text-sm font-semibold">Font Size</span>
                <input
                  type="range"
                  min="20"
                  max="150"
                  value={fontSize}
                  onChange={(e) => setFontSize(Number(e.target.value))}
                  className="w-full"
                />
              </label>

              <label className="block">
                <span className="text-sm font-semibold">Line Height</span>
                <input
                  type="range"
                  min="1"
                  max="3"
                  step="0.1"
                  value={lineHeight}
                  onChange={(e) => setLineHeight(Number(e.target.value))}
                  className="w-full"
                />
              </label>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <label className="block">
                <span className="text-sm font-semibold">Font Color</span>
                <input
                  type="color"
                  value={fontColor}
                  onChange={(e) => setFontColor(e.target.value)}
                />
              </label>

              <label className="block">
                <span className="text-sm font-semibold">Stroke Color</span>
                <input
                  type="color"
                  value={strokeColor}
                  onChange={(e) => setStrokeColor(e.target.value)}
                />
              </label>
            </div>

            <label className="block">
              <span className="text-sm font-semibold">Stroke Width</span>
              <input
                type="range"
                min="0"
                max="10"
                value={strokeWidth}
                onChange={(e) => setStrokeWidth(Number(e.target.value))}
                className="w-full"
              />
            </label>

            <label className="block">
              <span className="text-sm font-semibold">Font Family</span>
              <select
                className="w-full p-2 border rounded-lg"
                value={fontFamily}
                onChange={(e) => setFontFamily(e.target.value)}
              >
                <option value="Noto Sans Malayalam">Noto Sans Malayalam</option>
                <option value="Kalyani">Kalyani</option>
                <option value="Dyuthi">Dyuthi</option>
              </select>
            </label>
          </div>

          {/* Canvas */}
          <div className="flex items-center justify-center">
            <canvas
              ref={canvasRef}
              width={800}
              height={300}
              className="border rounded-lg"
            />
          </div>
        </div>
      </main>
    </div>
  );
}
