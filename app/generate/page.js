"use client";

import React, { useEffect, useRef, useState } from "react";
import Head from "next/head";

export default function CalligraphyPage() {
  const canvasRef = useRef(null);
  const [text, setText] = useState("");
  const [fontSize, setFontSize] = useState(60);
  const [fontColor, setFontColor] = useState("#e0e0e0");
  const [strokeColor, setStrokeColor] = useState("#1a1a1a");
  const [strokeWidth, setStrokeWidth] = useState(2);
  const [lineHeight, setLineHeight] = useState(1.5);
  const [fontFamily, setFontFamily] = useState("Noto Sans Malayalam");

  const [isBold, setIsBold] = useState(false);
  const [isItalic, setIsItalic] = useState(false);
  const [isUnderline, setIsUnderline] = useState(false);

  const [showDownloadOptions, setShowDownloadOptions] = useState(false);

  const drawText = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = fontColor;
    ctx.strokeStyle = strokeColor;
    ctx.lineWidth = strokeWidth;

    let fontStyle = "";
    if (isItalic) fontStyle += "italic ";
    if (isBold) fontStyle += "bold ";
    fontStyle += `${fontSize}px ${fontFamily}`;
    ctx.font = fontStyle;

    ctx.textBaseline = "top";

    const lines = text.split("\n");
    const lineHeightPx = fontSize * lineHeight;

    lines.forEach((line, index) => {
      const y = index * lineHeightPx;
      ctx.strokeText(line, 0, y);
      ctx.fillText(line, 0, y);

      if (isUnderline) {
        const textWidth = ctx.measureText(line).width;
        const underlineY = y + fontSize + 2;
        ctx.beginPath();
        ctx.moveTo(0, underlineY);
        ctx.lineTo(textWidth, underlineY);
        ctx.stroke();
      }
    });
  };

  const downloadPNG = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const link = document.createElement("a");
    link.download = "calligraphy.png";
    link.href = canvas.toDataURL("image/png");
    link.click();
  };

  const downloadJPEG = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const link = document.createElement("a");
    link.download = "calligraphy.jpeg";
    link.href = canvas.toDataURL("image/jpeg", 1.0);
    link.click();
  };

  const downloadSVG = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const imgData = canvas.toDataURL("image/png");
    const svg = `
      <svg xmlns="http://www.w3.org/2000/svg" width="${canvas.width}" height="${canvas.height}">
        <image href="${imgData}" width="${canvas.width}" height="${canvas.height}"/>
      </svg>
    `;
    const blob = new Blob([svg], { type: "image/svg+xml" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.download = "calligraphy.svg";
    link.href = url;
    link.click();
    URL.revokeObjectURL(url);
  };

  useEffect(() => {
    if (document.fonts?.ready) {
      document.fonts.ready.then(() => {
        drawText();
      });
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
    isBold,
    isItalic,
    isUnderline,
  ]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0f2027] via-[#203a43] to-[#2c5364] p-6 font-sans text-gray-100">
      <Head>
        <title>Malayalam Calligraphy Renderer</title>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Dyuthi&family=Kalyani&family=Noto+Sans+Malayalam&display=swap"
          rel="stylesheet"
        />
      </Head>

      <main className="max-w-7xl mx-auto bg-[#1f2937] bg-opacity-95 rounded-2xl shadow-2xl p-8 flex flex-col md:flex-row flex-wrap gap-8">
        <section className="flex-1 min-w-0 space-y-6">
          <textarea
            rows={4}
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="-----INPUT TEXT-----"
            className="w-full p-4 bg-[#374151] text-gray-200 rounded-xl shadow-inner font-semibold text-center resize-none focus:outline-none focus:ring-4 focus:ring-indigo-500 transition"
          />
          <button
            onClick={drawText}
            className="w-full py-3 bg-indigo-600 text-white font-extrabold rounded-xl shadow-lg hover:bg-indigo-700 active:scale-95 transition-transform"
          >
            GENERATE CALLIGRAPHY
          </button>

          <div className="bg-[#111827] rounded-xl shadow-lg p-4">
            <p className="text-center text-indigo-400 font-semibold mb-2">-----OUTPUT TEXT-----</p>
            <div className="w-full max-w-full overflow-auto">
              <canvas
                ref={canvasRef}
                className="w-full h-auto rounded-lg border border-indigo-500"
                width={1000}
                height={400}
              />
            </div>
          </div>

          <div className="relative text-right">
            <button
              onClick={() => setShowDownloadOptions(!showDownloadOptions)}
              className="bg-indigo-600 text-white font-extrabold py-2 px-5 rounded-xl shadow-md inline-flex items-center hover:bg-indigo-700 active:scale-95 transition"
              aria-haspopup="true"
              aria-expanded={showDownloadOptions}
            >
              DOWNLOAD
              <svg
                className={`ml-2 h-5 w-5 transform transition-transform duration-300 ${
                  showDownloadOptions ? "rotate-180" : "rotate-0"
                }`}
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            {showDownloadOptions && (
              <div className="absolute right-0 mt-2 w-36 bg-indigo-600 rounded-xl shadow-xl z-20 text-white font-semibold">
                <button
                  onClick={downloadPNG}
                  className="block w-full text-left px-5 py-2 hover:bg-indigo-700 rounded-t-xl transition"
                >
                  PNG
                </button>
                <button
                  onClick={downloadJPEG}
                  className="block w-full text-left px-5 py-2 hover:bg-indigo-700 transition"
                >
                  JPEG
                </button>
                <button
                  onClick={downloadSVG}
                  className="block w-full text-left px-5 py-2 hover:bg-indigo-700 rounded-b-xl transition"
                >
                  SVG
                </button>
              </div>
            )}
          </div>
        </section>

        <aside className="w-full md:w-1/3 min-w-[280px] space-y-6 bg-[#111827] rounded-2xl p-6 shadow-inner">
          <div>
            <label className="block text-indigo-400 font-extrabold mb-2 tracking-wide">FONT TYPE</label>
            <select
              value={fontFamily}
              onChange={(e) => setFontFamily(e.target.value)}
              className="w-full p-3 rounded-lg bg-indigo-700 text-white font-semibold shadow-md focus:outline-none focus:ring-4 focus:ring-indigo-500 transition"
            >
              <option value="Noto Sans Malayalam">Noto Sans Malayalam</option>
              <option value="Kalyani">Kalyani</option>
              <option value="Dyuthi">Dyuthi</option>
            </select>
          </div>

          <div>
            <label className="block text-indigo-400 font-extrabold mb-2 tracking-wide">FONT COLOR</label>
            <input
              type="color"
              value={fontColor}
              onChange={(e) => setFontColor(e.target.value)}
              className="w-full h-12 rounded-lg cursor-pointer border-2 border-indigo-500 shadow-inner"
              aria-label="Choose font color"
            />
          </div>

          <div>
            <label className="block text-indigo-400 font-extrabold mb-2 tracking-wide">FONT SIZE</label>
            <input
              type="range"
              min="20"
              max="150"
              value={fontSize}
              onChange={(e) => setFontSize(Number(e.target.value))}
              className="w-full accent-indigo-500 cursor-pointer"
              aria-label="Adjust font size"
            />
          </div>

          <div>
            <label className="block text-indigo-400 font-extrabold mb-2 tracking-wide">TEXT EFFECTS</label>
            <div className="flex gap-4 flex-wrap mt-2 text-white font-semibold">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={isBold}
                  onChange={() => setIsBold(!isBold)}
                  className="w-5 h-5 rounded border-indigo-500 accent-indigo-600 cursor-pointer"
                />
                Bold
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={isItalic}
                  onChange={() => setIsItalic(!isItalic)}
                  className="w-5 h-5 rounded border-indigo-500 accent-indigo-600 cursor-pointer"
                />
                Italic
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={isUnderline}
                  onChange={() => setIsUnderline(!isUnderline)}
                  className="w-5 h-5 rounded border-indigo-500 accent-indigo-600 cursor-pointer"
                />
                Underline
              </label>
            </div>
          </div>

          <div>
            <label className="block text-indigo-400 font-extrabold mb-2 tracking-wide">STROKE OUTLINE</label>
            <input
              type="color"
              value={strokeColor}
              onChange={(e) => setStrokeColor(e.target.value)}
              className="w-full h-12 rounded-lg cursor-pointer border-2 border-indigo-500 shadow-inner"
              aria-label="Choose stroke outline color"
            />
          </div>

          <div>
            <label className="block text-indigo-400 font-extrabold mb-2 tracking-wide">LINE SPACING</label>
            <input
              type="range"
              min="1"
              max="3"
              step="0.1"
              value={lineHeight}
              onChange={(e) => setLineHeight(Number(e.target.value))}
              className="w-full accent-indigo-500 cursor-pointer"
              aria-label="Adjust line spacing"
            />
          </div>
        </aside>
      </main>
    </div>
  );
}
