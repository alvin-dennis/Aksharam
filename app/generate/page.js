"use client";

import React, { useEffect, useRef, useState } from "react";
import Head from "next/head";
import { Button } from "@/components/ui/button";
import styles from "./generate.module.css";

export default function Generate() {
  const canvasRef = useRef(null);
  const [text, setText] = useState("");
  const [fontSize, setFontSize] = useState(60);
  const [fontColor, setFontColor] = useState("#e0e0e0");
  const [strokeColor, setStrokeColor] = useState("#1a1a1a");
  const [strokeWidth, setStrokeWidth] = useState(2);
  const [lineHeight, setLineHeight] = useState(1.5);
  const [fontFamily, setFontFamily] = useState("Nupuram Calligraphy");
  const [fontWeight, setFontWeight] = useState(400);

  const [isBold, setIsBold] = useState(false);
  const [isItalic, setIsItalic] = useState(false);
  const [isUnderline, setIsUnderline] = useState(false);

  const [showDownloadOptions, setShowDownloadOptions] = useState(false);

  const drawText = React.useCallback(() => {
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

    const actualWeight = isBold ? Math.min(fontWeight + 300, 900) : fontWeight;
    fontStyle += `${actualWeight} ${fontSize}px ${fontFamily}`;
    ctx.font = fontStyle;

    ctx.textBaseline = "top";

    const lines = text.split("\n");
    // Use actual text metrics for line height
    let metrics = ctx.measureText("M");
    let actualLineHeight =
      metrics.actualBoundingBoxAscent + metrics.actualBoundingBoxDescent;
    const lineHeightPx = actualLineHeight * lineHeight;

    lines.forEach((line, index) => {
      const y = index * lineHeightPx;
      ctx.strokeText(line, 0, y);
      ctx.fillText(line, 0, y);

      if (isUnderline) {
        const textWidth = ctx.measureText(line).width;
        const underlineY = y + actualLineHeight + 2;
        ctx.beginPath();
        ctx.moveTo(0, underlineY);
        ctx.lineTo(textWidth, underlineY);
        ctx.stroke();
      }
    });
  }, [
    text,
    fontSize,
    fontColor,
    strokeColor,
    strokeWidth,
    lineHeight,
    fontFamily,
    fontWeight,
    isBold,
    isItalic,
    isUnderline,
  ]);

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
    fontWeight,
    isBold,
    isItalic,
    isUnderline,
    drawText,
  ]);

  return (
    <div className={styles.container}>
      <main className={styles.main}>
        <section className={styles.section}>
          <textarea
            rows={4}
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="-----INPUT TEXT-----"
            className={styles.textarea}
          />
          <Button
            variant="primary"
            onClick={drawText}
            className={styles.generateButton}
          >
            GENERATE CALLIGRAPHY
          </Button>

          <div className={styles.outputContainer}>
            <p className={styles.outputTitle}>-----OUTPUT TEXT-----</p>
            <div className={styles.canvasContainer}>
              <canvas
                ref={canvasRef}
                className={styles.canvas}
                width={1000}
                height={400}
              />
            </div>
          </div>

          <div className={styles.downloadContainer}>
            <button
              onClick={() => setShowDownloadOptions(!showDownloadOptions)}
              className={styles.downloadButton}
              aria-haspopup="true"
              aria-expanded={showDownloadOptions}
            >
              DOWNLOAD
              <svg
                className={`${styles.downloadIcon} ${
                  showDownloadOptions ? styles.rotated : ""
                }`}
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </button>

            {showDownloadOptions && (
              <div className={styles.downloadMenu}>
                <button onClick={downloadPNG} className={styles.downloadOption}>
                  PNG
                </button>
                <button
                  onClick={downloadJPEG}
                  className={styles.downloadOption}
                >
                  JPEG
                </button>
                <button onClick={downloadSVG} className={styles.downloadOption}>
                  SVG
                </button>
              </div>
            )}
          </div>
        </section>

        <aside className={styles.aside}>

          <div className={styles.controlGroup}>
            <label className={styles.label}>FONT COLOR</label>
            <input
              type="color"
              value={fontColor}
              onChange={(e) => setFontColor(e.target.value)}
              className={styles.colorInput}
              aria-label="Choose font color"
            />
          </div>

          <div className={styles.controlGroup}>
            <label className={styles.label}>FONT SIZE</label>
            <input
              type="range"
              min="20"
              max="150"
              value={fontSize}
              onChange={(e) => setFontSize(Number(e.target.value))}
              className={styles.rangeInput}
              aria-label="Adjust font size"
            />
          </div>

          <div className={styles.controlGroup}>
            <label className={styles.label}>TEXT EFFECTS</label>
            <div className={styles.checkboxGroup}>
              <label className={styles.checkboxLabel}>
                <input
                  type="checkbox"
                  checked={isBold}
                  onChange={() => setIsBold(!isBold)}
                  className={styles.checkbox}
                />
                Bold
              </label>
              <label className={styles.checkboxLabel}>
                <input
                  type="checkbox"
                  checked={isItalic}
                  onChange={() => setIsItalic(!isItalic)}
                  className={styles.checkbox}
                />
                Italic
              </label>
              <label className={styles.checkboxLabel}>
                <input
                  type="checkbox"
                  checked={isUnderline}
                  onChange={() => setIsUnderline(!isUnderline)}
                  className={styles.checkbox}
                />
                Underline
              </label>
            </div>
          </div>

          <div className={styles.controlGroup}>
            <label className={styles.label}>STROKE OUTLINE</label>
            <input
              type="color"
              value={strokeColor}
              onChange={(e) => setStrokeColor(e.target.value)}
              className={styles.colorInput}
              aria-label="Choose stroke outline color"
            />
          </div>

        </aside>
      </main>
    </div>
  );
}
