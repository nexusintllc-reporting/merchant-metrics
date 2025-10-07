import { useState, useCallback, useRef, useEffect } from "react";
import html2canvas from "html2canvas";

// SVG Icons for Shopify App Store compliance
const Icons = {
  // Camera icon for screenshot button
  Camera: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 15.2C13.767 15.2 15.2 13.767 15.2 12 15.2 10.233 13.767 8.8 12 8.8 10.233 8.8 8.8 10.233 8.8 12 8.8 13.767 10.233 15.2 12 15.2z"/>
      <path d="M9 2L7.17 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2h-3.17L15 2H9zm3 15c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5z"/>
    </svg>
  ),
  
  // Download icon
  Download: () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
      <path d="M19 9h-4V3H9v6H5l7 7 7-7zM5 18v2h14v-2H5z"/>
    </svg>
  ),
  
  // Copy icon
  Copy: () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
      <path d="M16 1H4c-1.1 0-2 .9-2 2v14h2V3h12V1zm3 4H8c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm0 16H8V7h11v14z"/>
    </svg>
  ),
  
  // Edit icon
  Edit: () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
      <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/>
    </svg>
  ),
  
  // Close icon
  Close: () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
      <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
    </svg>
  ),
  
  // Selection icon
  Selection: () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
      <path d="M13 11h-2V3H5v2h6v6zm8-6h-2v2h2v2h2V5h-2V5zm0 8h-2v-2h-2v2h2v2h2v-2zm-8 6h2v6h2v-6h6v-2h-8v2zm-6 0H3v2h2v2h2v-2H5v-2zM3 5V3h2v2H3z"/>
    </svg>
  ),
  
  // Rectangle icon
  Rectangle: () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
      <rect x="3" y="3" width="18" height="18" rx="2" ry="2" stroke="currentColor" strokeWidth="2" fill="none"/>
    </svg>
  ),
  
  // Circle icon
  Circle: () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="2" fill="none"/>
    </svg>
  ),
  
  // Arrow icon
  Arrow: () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 4l-1.41 1.41L16.17 11H4v2h12.17l-5.58 5.59L12 20l8-8z"/>
    </svg>
  ),
  
  // Text icon
  Text: () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
      <path d="M5 4v3h5.5v12h3V7H19V4z"/>
    </svg>
  ),
  
  // Trash icon
  Trash: () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
      <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"/>
    </svg>
  ),
  
  // Mobile icon for viewport
  Mobile: () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
      <path d="M17 1.01L7 1c-1.1 0-2 .9-2 2v18c0 1.1.9 2 2 2h10c1.1 0 2-.9 2-2V3c0-1.1-.9-1.99-2-1.99zM17 19H7V5h10v14z"/>
    </svg>
  ),
  
  // Document icon for full page
  Document: () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
      <path d="M14 2H6c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 1.99 2H18c1.1 0 2-.9 2-2V8l-6-6zm4 18H6V4h7v5h5v11z"/>
    </svg>
  ),
  
  // Scissors icon for selection
  Scissors: () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
      <path d="M7.5 5.6L10 7 8.6 4.5 10 2 7.5 3.4 5 2l1.4 2.5L5 7zm12 9.8L17 14l1.4 2.5L17 19l2.5-1.4L22 19l-1.4-2.5L22 14z"/>
      <path d="M21.41 11.58l-9-9C12.05 2.22 11.55 2 11 2H4c-1.1 0-2 .9-2 2v7c0 .55.22 1.05.59 1.42l9 9c.36.36.86.58 1.41.58.55 0 1.05-.22 1.41-.59l7-7c.37-.36.59-.86.59-1.41 0-.55-.23-1.06-.59-1.42zM13 20.01L4 11V4h7v-.01l9 9-7 7.02z"/>
    </svg>
  ),
  
  // Lightbulb icon for hint
  Lightbulb: () => (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
      <path d="M9 21c0 .5.4 1 1 1h4c.6 0 1-.5 1-1v-1H9v1zm3-19C8.1 2 5 5.1 5 9c0 2.4 1.2 4.5 3 5.7V17c0 .5.4 1 1 1h6c.6 0 1-.5 1-1v-2.3c1.8-1.3 3-3.4 3-5.7 0-3.9-3.1-7-7-7z"/>
    </svg>
  )
};

// Local type definitions
interface Point {
  x: number;
  y: number;
}

interface Area {
  width: number;
  height: number;
  x: number;
  y: number;
}

type ScreenshotMode = "fullscreen" | "viewport" | "selection";
type ImageFormat = "png" | "jpeg" | "webp";
type AnnotationType = "rectangle" | "circle" | "arrow" | "text";
type ToolMode = "select" | "rectangle" | "circle" | "arrow" | "text";

interface Annotation {
  id: string;
  x: number;
  y: number;
  type: AnnotationType;
  color: string;
  width?: number;
  height?: number;
  data?: any;
  fontSize?: number;
  isDragging?: boolean;
  dragOffset?: { x: number; y: number };
}

interface SelectionArea {
  startX: number;
  startY: number;
  endX: number;
  endY: number;
  isSelecting: boolean;
  isActive: boolean;
}

export default function ProfessionalScreenshotTool() {
  const [captured, setCaptured] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [isCapturing, setIsCapturing] = useState(false);
  const [imageFormat, setImageFormat] = useState<ImageFormat>("png");
  const [imageQuality, setImageQuality] = useState(0.95);
  const [annotations, setAnnotations] = useState<Annotation[]>([]);
  const [showModeSelector, setShowModeSelector] = useState(false);
  const [selectionArea, setSelectionArea] = useState<SelectionArea>({
    startX: 0,
    startY: 0,
    endX: 0,
    endY: 0,
    isSelecting: false,
    isActive: false
  });
  const [isDragging, setIsDragging] = useState(false);
  const [currentTool, setCurrentTool] = useState<ToolMode>("select");
  const [imageDimensions, setImageDimensions] = useState({ width: 0, height: 0 });
  const [textInput, setTextInput] = useState("");
  const [showTextInput, setShowTextInput] = useState(false);
  const [textPosition, setTextPosition] = useState({ x: 0, y: 0 });
  const [fontSize, setFontSize] = useState(16);
  const [draggingAnnotation, setDraggingAnnotation] = useState<string | null>(null);
  const [selectionActive, setSelectionActive] = useState(false);
  
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const textInputRef = useRef<HTMLInputElement>(null);

  // Fixed download function
  const downloadImage = async (blob: Blob, filename: string) => {
    try {
      const blobUrl = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = blobUrl;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      setTimeout(() => URL.revokeObjectURL(blobUrl), 100);
    } catch (error) {
      console.error("Download failed:", error);
    }
  };

  // Enhanced capture screen with better full width capture - INTEGRATED SCROLL FROM CODE 2
  const captureScreen = async (mode: ScreenshotMode) => {
    setIsCapturing(true);
    setShowModeSelector(false);
    
    try {
      // Enhanced capture options with scroll integration from code 2
      const options = {
        scale: 1,
        useCORS: true,
        allowTaint: true,
        logging: false,
        removeContainer: true,
        backgroundColor: "#ffffff",
        scrollX: -window.scrollX,
        scrollY: -window.scrollY,
        width: document.documentElement.scrollWidth,
        height: document.documentElement.scrollHeight,
        windowWidth: document.documentElement.scrollWidth,
        windowHeight: document.documentElement.scrollHeight,
        onclone: (clonedDoc: Document) => {
          const screenshotElements = clonedDoc.querySelectorAll('[data-screenshot-ignore]');
          screenshotElements.forEach(el => el.remove());
        }
      };

      let canvas: HTMLCanvasElement;

      if (mode === "fullscreen") {
        // Enhanced full page capture with scroll integration
        canvas = await html2canvas(document.documentElement, options as any);
      } else if (mode === "viewport") {
        // Viewport capture with scroll integration
        canvas = await html2canvas(document.body, options as any);
      } else {
        // Selection mode - use full page capture for selection
        canvas = await html2canvas(document.body, options as any);
      }

      // Get proper MIME type
      let mimeType: string;
      switch (imageFormat) {
        case "jpeg":
          mimeType = "image/jpeg";
          break;
        case "webp":
          mimeType = "image/webp";
          break;
        case "png":
        default:
          mimeType = "image/png";
          break;
      }

      const dataUrl = canvas.toDataURL(mimeType, imageFormat === "png" ? undefined : imageQuality);
      setCaptured(dataUrl);
      
      // Store image dimensions for proper display
      setImageDimensions({
        width: canvas.width,
        height: canvas.height
      });

      if (mode === "selection") {
        setShowModal(true);
      }
      setAnnotations([]);
      setCurrentTool("select");
      setSelectionArea({
        startX: 0, startY: 0, endX: 0, endY: 0, isSelecting: false, isActive: false
      });
      setSelectionActive(false);
    } catch (error) {
      console.error("Screenshot capture failed:", error);
      alert("Failed to capture screenshot. Please try again.");
    } finally {
      setIsCapturing(false);
    }
  };

  // Enhanced mouse events with better selection from code 2
  const handleMouseMove = (e: React.MouseEvent) => {
    if (!imageRef.current) return;
    
    const rect = imageRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    // Handle annotation dragging
    if (draggingAnnotation) {
      setAnnotations(prev => prev.map(annotation => {
        if (annotation.id === draggingAnnotation && annotation.dragOffset) {
          return {
            ...annotation,
            x: x - annotation.dragOffset.x,
            y: y - annotation.dragOffset.y
          };
        }
        return annotation;
      }));
      return;
    }
    
    if (selectionActive && imageRef.current) {
      setSelectionArea(prev => ({ ...prev, endX: x, endY: y }));
    } else if (isDragging && currentTool !== "select" && currentTool !== "text") {
      // Update annotation size (for rectangle, circle, arrow)
      setAnnotations(prev => {
        const lastIndex = prev.length - 1;
        if (lastIndex < 0) return prev;
        
        const lastAnnotation = prev[lastIndex];
        const updatedAnnotation = {
          ...lastAnnotation,
          width: x - lastAnnotation.x,
          height: y - lastAnnotation.y
        };
        
        const newAnnotations = [...prev];
        newAnnotations[lastIndex] = updatedAnnotation;
        return newAnnotations;
      });
    }
  };

  const handleClick = (e: React.MouseEvent) => {
    if (!imageRef.current) return;
    
    const rect = imageRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // Check if clicking on existing annotation for dragging
    const clickedAnnotation = annotations.find(annotation => {
      if (annotation.type === "rectangle" && annotation.width && annotation.height) {
        return x >= annotation.x && x <= annotation.x + annotation.width &&
               y >= annotation.y && y <= annotation.y + annotation.height;
      } else if (annotation.type === "circle" && annotation.width && annotation.height) {
        const centerX = annotation.x + annotation.width / 2;
        const centerY = annotation.y + annotation.height / 2;
        const radius = Math.max(Math.abs(annotation.width), Math.abs(annotation.height)) / 2;
        const distance = Math.sqrt((x - centerX) ** 2 + (y - centerY) ** 2);
        return distance <= radius;
      } else if (annotation.type === "arrow" && annotation.width && annotation.height) {
        // Simple bounding box check for arrow
        const minX = Math.min(annotation.x, annotation.x + annotation.width);
        const maxX = Math.max(annotation.x, annotation.x + annotation.width);
        const minY = Math.min(annotation.y, annotation.y + annotation.height);
        const maxY = Math.max(annotation.y, annotation.y + annotation.height);
        return x >= minX && x <= maxX && y >= minY && y <= maxY;
      } else if (annotation.type === "text") {
        // Estimate text bounding box
        return x >= annotation.x && x <= annotation.x + 100 &&
               y >= annotation.y - 20 && y <= annotation.y;
      }
      return false;
    });

    if (clickedAnnotation) {
      // Start dragging existing annotation
      setDraggingAnnotation(clickedAnnotation.id);
      setAnnotations(prev => prev.map(ann => 
        ann.id === clickedAnnotation.id 
          ? { ...ann, isDragging: true, dragOffset: { x: x - ann.x, y: y - ann.y } }
          : ann
      ));
      return;
    }

    if (currentTool === "select") {
      if (!selectionActive) {
        // First click - start selection
        setSelectionArea({ startX: x, startY: y, endX: x, endY: y, isSelecting: true, isActive: true });
        setSelectionActive(true);
      } else {
        // Second click - finish selection
        setSelectionArea(prev => ({ ...prev, endX: x, endY: y, isSelecting: false }));
        setSelectionActive(false);
      }
    } else if (currentTool === "text") {
      // Handle text tool - show input at click position
      setTextPosition({ x, y });
      setTextInput("");
      setShowTextInput(true);
      setTimeout(() => {
        if (textInputRef.current) {
          textInputRef.current.focus();
        }
      }, 100);
    } else {
      // Start drawing new shape
      const newAnnotation: Annotation = {
        id: Math.random().toString(36).substr(2, 9),
        x,
        y,
        type: currentTool,
        color: "#ff0000",
        width: 0,
        height: 0
      };
      
      setAnnotations(prev => [...prev, newAnnotation]);
      setIsDragging(true);
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
    setDraggingAnnotation(null);
    
    // Clear dragging state from all annotations
    setAnnotations(prev => prev.map(ann => ({
      ...ann,
      isDragging: false,
      dragOffset: undefined
    })));
  };

  // Add text annotation
  const addTextAnnotation = () => {
    if (!textInput.trim()) {
      setShowTextInput(false);
      return;
    }

    const newAnnotation: Annotation = {
      id: Math.random().toString(36).substr(2, 9),
      x: textPosition.x,
      y: textPosition.y,
      type: "text",
      color: "#ff0000",
      data: { text: textInput },
      fontSize: fontSize
    };
    
    setAnnotations(prev => [...prev, newAnnotation]);
    setShowTextInput(false);
    setTextInput("");
  };

  // Enhanced download with proper annotation rendering and scroll integration
  const downloadSelectedArea = async () => {
    if (!captured || !selectionArea.isActive) {
      alert("Please select an area first by clicking on the image.");
      return;
    }

    const image = new Image();
    image.src = captured;
    
    await new Promise((resolve) => {
      image.onload = resolve;
      image.onerror = resolve;
    });

    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    
    if (!ctx) return;

    // Calculate selection dimensions with proper scaling - INTEGRATED FROM CODE 2
    const imgElement = imageRef.current!;
    const scaleX = image.width / imgElement.clientWidth;
    const scaleY = image.height / imgElement.clientHeight;

    const x = Math.min(selectionArea.startX, selectionArea.endX) * scaleX;
    const y = Math.min(selectionArea.startY, selectionArea.endY) * scaleY;
    const width = Math.abs(selectionArea.endX - selectionArea.startX) * scaleX;
    const height = Math.abs(selectionArea.endY - selectionArea.startY) * scaleY;

    // Ensure minimum size
    if (width < 10 || height < 10) {
      alert("Please select a larger area.");
      return;
    }

    canvas.width = width;
    canvas.height = height;

    // Draw the selected area
    ctx.drawImage(image, x, y, width, height, 0, 0, width, height);

    // Enhanced annotation rendering for download
    ctx.strokeStyle = "#ff0000";
    ctx.fillStyle = "#ff0000";
    ctx.lineWidth = 3;

    annotations.forEach(annotation => {
      const relativeX = (annotation.x * scaleX) - x;
      const relativeY = (annotation.y * scaleY) - y;
      const annotationWidth = (annotation.width || 0) * scaleX;
      const annotationHeight = (annotation.height || 0) * scaleY;

      // Only draw if annotation is within or intersects the selection
      if (relativeX + annotationWidth > 0 && 
          relativeY + annotationHeight > 0 &&
          relativeX < width && relativeY < height) {
        
        switch (annotation.type) {
          case "rectangle":
            if (annotation.width && annotation.height) {
              ctx.strokeRect(relativeX, relativeY, annotationWidth, annotationHeight);
            }
            break;
          case "circle":
            if (annotation.width && annotation.height) {
              const radiusX = Math.abs(annotationWidth) / 2;
              const radiusY = Math.abs(annotationHeight) / 2;
              const centerX = relativeX + radiusX * Math.sign(annotationWidth);
              const centerY = relativeY + radiusY * Math.sign(annotationHeight);
              
              ctx.beginPath();
              ctx.ellipse(centerX, centerY, radiusX, radiusY, 0, 0, 2 * Math.PI);
              ctx.stroke();
            }
            break;
          case "arrow":
            if (annotation.width && annotation.height) {
              const endX = relativeX + annotationWidth;
              const endY = relativeY + annotationHeight;
              
              ctx.beginPath();
              ctx.moveTo(relativeX, relativeY);
              ctx.lineTo(endX, endY);
              
              // Arrow head
              const angle = Math.atan2(endY - relativeY, endX - relativeX);
              const headLength = 15;
              ctx.lineTo(
                endX - headLength * Math.cos(angle - Math.PI/6),
                endY - headLength * Math.sin(angle - Math.PI/6)
              );
              ctx.moveTo(endX, endY);
              ctx.lineTo(
                endX - headLength * Math.cos(angle + Math.PI/6),
                endY - headLength * Math.sin(angle + Math.PI/6)
              );
              ctx.stroke();
            }
            break;
          case "text":
            const textSize = (annotation.fontSize || 16) * Math.min(scaleX, scaleY);
            ctx.font = `bold ${textSize}px Arial`;
            ctx.fillText(annotation.data?.text || "Text", relativeX, relativeY);
            break;
        }
      }
    });

    // Convert to blob properly
    canvas.toBlob((blob) => {
      if (blob) {
        const timestamp = new Date().getTime();
        const filename = `screenshot-${timestamp}.${imageFormat}`;
        downloadImage(blob, filename);
        handleClose();
      }
    }, imageFormat === "png" ? "image/png" : imageFormat === "jpeg" ? "image/jpeg" : "image/webp", imageFormat === "png" ? undefined : imageQuality);
  };

  // Quick download without cropping
  const quickDownload = async () => {
    if (!captured) return;
    
    const response = await fetch(captured);
    const blob = await response.blob();
    const timestamp = new Date().getTime();
    const filename = `screenshot-${timestamp}.${imageFormat}`;
    await downloadImage(blob, filename);
  };

  // Copy to clipboard
  const copyToClipboard = async () => {
    if (!captured) return;
    
    try {
      const response = await fetch(captured);
      const blob = await response.blob();
      await navigator.clipboard.write([new ClipboardItem({ [blob.type]: blob })]);
      alert("Screenshot copied to clipboard!");
    } catch (error) {
      alert("Failed to copy to clipboard. Please try downloading instead.");
    }
  };

  // Close everything
  const handleClose = () => {
    setShowModal(false);
    setShowModeSelector(false);
    setCaptured(null);
    setAnnotations([]);
    setSelectionArea({
      startX: 0, startY: 0, endX: 0, endY: 0, isSelecting: false, isActive: false
    });
    setCurrentTool("select");
    setShowTextInput(false);
    setDraggingAnnotation(null);
    setSelectionActive(false);
  };

  // Close preview only
  const handleClosePreview = () => {
    setCaptured(null);
    setAnnotations([]);
    setSelectionActive(false);
  };

  // Open editor from preview
  const openEditor = () => {
    setShowModal(true);
  };

  // Clear selection
  const clearSelection = () => {
    setSelectionArea({
      startX: 0, startY: 0, endX: 0, endY: 0, isSelecting: false, isActive: false
    });
    setSelectionActive(false);
  };

  // Calculate selection rectangle
  const getSelectionRect = () => {
    if (!selectionArea.isActive) return null;
    
    const left = Math.min(selectionArea.startX, selectionArea.endX);
    const top = Math.min(selectionArea.startY, selectionArea.endY);
    const width = Math.abs(selectionArea.endX - selectionArea.startX);
    const height = Math.abs(selectionArea.endY - selectionArea.startY);
    
    return { left, top, width, height };
  };

  const selectionRect = getSelectionRect();

  return (
    <div style={{ padding: "10px", fontFamily: "Arial, sans-serif" }} data-screenshot-ignore>
      {/* Mode Selector Modal */}
      {showModeSelector && (
        <div style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100vw",
          height: "100vh",
          background: "rgba(0,0,0,0.8)",
          zIndex: 10000,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}>
          <div style={{
            background: "white",
            padding: "20px",
            borderRadius: "8px",
            textAlign: "center",
            minWidth: "280px",
            boxShadow: "0 4px 12px rgba(0,0,0,0.3)"
          }}>
            <h4 style={{ margin: "0 0 15px 0" }}>Select Capture Area</h4>
            <div style={{ display: "flex", flexDirection: "column", gap: "8px", marginBottom: "15px" }}>
              <button
                onClick={() => captureScreen("viewport")}
                style={{
                  padding: "10px",
                  background: "#007bff",
                  color: "white",
                  border: "none",
                  borderRadius: "4px",
                  cursor: "pointer",
                  fontSize: "12px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "8px"
                }}
              >
                <Icons.Mobile />
                Current Viewport
              </button>
              
              <button
                onClick={() => captureScreen("fullscreen")}
                style={{
                  padding: "10px",
                  background: "#28a745",
                  color: "white",
                  border: "none",
                  borderRadius: "4px",
                  cursor: "pointer",
                  fontSize: "12px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "8px"
                }}
              >
                <Icons.Document />
                Full Page
              </button>
              
              <button
                onClick={() => captureScreen("selection")}
                style={{
                  padding: "10px",
                  background: "#ffc107",
                  color: "black",
                  border: "none",
                  borderRadius: "4px",
                  cursor: "pointer",
                  fontSize: "12px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "8px"
                }}
              >
                <Icons.Scissors />
                Select Area (Click & Drag)
              </button>
            </div>
            <button
              onClick={() => setShowModeSelector(false)}
              style={{
                padding: "8px 16px",
                background: "#6c757d",
                color: "white",
                border: "none",
                borderRadius: "4px",
                cursor: "pointer",
                fontSize: "12px"
              }}
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Compact Configuration */}
      <div style={{ 
        marginBottom: "15px", 
        padding: "10px", 
        border: "1px solid #e0e0e0", 
        borderRadius: "6px",
        backgroundColor: "#f8f9fa",
        fontSize: "12px"
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: "10px", flexWrap: "wrap" }}>
          <label style={{ fontWeight: "bold" }}>Format:</label>
          <select 
            value={imageFormat} 
            onChange={(e) => setImageFormat(e.target.value as ImageFormat)}
            style={{ 
              padding: "4px 8px", 
              borderRadius: "4px", 
              border: "1px solid #ccc",
              fontSize: "12px"
            }}
          >
            <option value="png">PNG</option>
            <option value="jpeg">JPEG</option>
            <option value="webp">WebP</option>
          </select>

          {imageFormat !== "png" && (
            <>
              <label style={{ fontWeight: "bold" }}>Quality:</label>
              <input 
                type="range" 
                min="0.1" 
                max="1" 
                step="0.1" 
                value={imageQuality} 
                onChange={(e) => setImageQuality(parseFloat(e.target.value))}
                style={{ width: "80px" }}
              />
              <span>{Math.round(imageQuality * 100)}%</span>
            </>
          )}
        </div>
      </div>

      {/* Compact Action Buttons */}
      <div style={{ marginBottom: "15px", display: "flex", gap: "8px", flexWrap: "wrap" }}>
        <button
          onClick={() => setShowModeSelector(true)}
          disabled={isCapturing}
          style={{
            padding: "8px 12px",
            background: isCapturing ? "#6c757d" : "#007bff",
            color: "white",
            borderRadius: "4px",
            border: "none",
            cursor: isCapturing ? "not-allowed" : "pointer",
            fontSize: "12px",
            fontWeight: "bold",
            display: "flex",
            alignItems: "center",
            gap: "6px"
          }}
        >
          <Icons.Camera />
          {isCapturing ? "Capturing..." : "Screenshot"}
        </button>

        {captured && !showModal && (
          <>
            <button
              onClick={quickDownload}
              style={{
                padding: "6px 10px",
                background: "#28a745",
                color: "white",
                borderRadius: "4px",
                border: "none",
                cursor: "pointer",
                fontSize: "11px",
                display: "flex",
                alignItems: "center",
                gap: "4px"
              }}
            >
              <Icons.Download />
              Download
            </button>
            <button
              onClick={copyToClipboard}
              style={{
                padding: "6px 10px",
                background: "#17a2b8",
                color: "white",
                borderRadius: "4px",
                border: "none",
                cursor: "pointer",
                fontSize: "11px",
                display: "flex",
                alignItems: "center",
                gap: "4px"
              }}
            >
              <Icons.Copy />
              Copy
            </button>
            <button
              onClick={openEditor}
              style={{
                padding: "6px 10px",
                background: "#ffc107",
                color: "black",
                borderRadius: "4px",
                border: "none",
                cursor: "pointer",
                fontSize: "11px",
                display: "flex",
                alignItems: "center",
                gap: "4px"
              }}
            >
              <Icons.Edit />
              Edit
            </button>
            <button
              onClick={handleClosePreview}
              style={{
                padding: "6px 10px",
                background: "#dc3545",
                color: "white",
                borderRadius: "4px",
                border: "none",
                cursor: "pointer",
                fontSize: "11px",
                display: "flex",
                alignItems: "center",
                gap: "4px"
              }}
            >
              <Icons.Close />
              Close
            </button>
          </>
        )}
      </div>

      {/* Compact Preview - Click to open editor */}
      {captured && !showModal && (
        <div style={{ marginTop: "10px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "5px" }}>
            <span style={{ fontSize: "11px", fontWeight: "bold" }}>Preview:</span>
          </div>
          <div 
            style={{ 
              cursor: "pointer",
              border: "2px solid #007bff",
              borderRadius: "4px",
              padding: "2px",
              display: "block",
              width: "100%"
            }}
            onClick={openEditor}
          >
            <img 
              src={captured} 
              alt="Screenshot preview" 
              style={{ 
                width: "100%", 
                height: "auto",
                maxHeight: "350px",
                borderRadius: "2px",
                display: "block"
              }} 
            />
          </div>
          <div style={{ fontSize: "10px", color: "#666", marginTop: "4px", display: "flex", alignItems: "center", gap: "4px" }}>
            <Icons.Lightbulb />
            Click on the preview to open editor
          </div>
        </div>
      )}

      {/* Professional Selection Modal */}
      {showModal && captured && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            background: "rgba(0,0,0,0.95)",
            zIndex: 9999,
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            padding: "20px",
            boxSizing: "border-box"
          }}
        >
          <div
            style={{
              position: "relative",
              width: "100%",
              height: "100%",
              maxWidth: "1400px",
              maxHeight: "900px",
              background: "white",
              borderRadius: "8px",
              overflow: "hidden",
              display: "flex",
              flexDirection: "column"
            }}
          >
            {/* Compact Header */}
            <div style={{
              padding: "8px 12px",
              background: "#2c3e50",
              borderBottom: "1px solid #34495e",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center"
            }}>
              <span style={{ color: "white", fontSize: "12px", fontWeight: "bold" }}>
                {currentTool === "select" 
                  ? "Click to start selection, click again to finish • Click and drag annotations to move them" 
                  : currentTool === "text"
                  ? "Click on image to add text"
                  : `Click and drag to draw ${currentTool} • Click and drag to move existing shapes`}
              </span>
              <button
                onClick={handleClose}
                style={{
                  padding: "4px 8px",
                  background: "#e74c3c",
                  color: "white",
                  border: "none",
                  borderRadius: "3px",
                  cursor: "pointer",
                  fontSize: "11px",
                  display: "flex",
                  alignItems: "center",
                  gap: "4px"
                }}
              >
                <Icons.Close />
                Close
              </button>
            </div>

            {/* Text Input Modal */}
            {showTextInput && (
              <div style={{
                position: "absolute",
                top: textPosition.y,
                left: textPosition.x,
                background: "white",
                border: "2px solid #007bff",
                borderRadius: "4px",
                padding: "12px",
                zIndex: 10000,
                boxShadow: "0 4px 12px rgba(0,0,0,0.3)",
                minWidth: "250px"
              }}>
                <div style={{ marginBottom: "8px" }}>
                  <label style={{ fontSize: "12px", fontWeight: "bold", display: "block", marginBottom: "4px" }}>
                    Text:
                  </label>
                  <input
                    ref={textInputRef}
                    type="text"
                    value={textInput}
                    onChange={(e) => setTextInput(e.target.value)}
                    placeholder="Enter your text here..."
                    style={{
                      border: "1px solid #ccc",
                      borderRadius: "3px",
                      padding: "6px",
                      fontSize: "12px",
                      width: "100%",
                      boxSizing: "border-box"
                    }}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        addTextAnnotation();
                      } else if (e.key === 'Escape') {
                        setShowTextInput(false);
                      }
                    }}
                  />
                </div>
                <div style={{ marginBottom: "8px" }}>
                  <label style={{ fontSize: "12px", fontWeight: "bold", display: "block", marginBottom: "4px" }}>
                    Font Size: {fontSize}px
                  </label>
                  <input
                    type="range"
                    min="12"
                    max="36"
                    value={fontSize}
                    onChange={(e) => setFontSize(parseInt(e.target.value))}
                    style={{ width: "100%" }}
                  />
                </div>
                <div style={{ display: "flex", gap: "6px", justifyContent: "flex-end" }}>
                  <button
                    onClick={addTextAnnotation}
                    style={{
                      padding: "4px 8px",
                      background: "#28a745",
                      color: "white",
                      border: "none",
                      borderRadius: "3px",
                      cursor: "pointer",
                      fontSize: "11px"
                    }}
                  >
                    Add Text
                  </button>
                  <button
                    onClick={() => setShowTextInput(false)}
                    style={{
                      padding: "4px 8px",
                      background: "#dc3545",
                      color: "white",
                      border: "none",
                      borderRadius: "3px",
                      cursor: "pointer",
                      fontSize: "11px"
                    }}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}

            {/* Main Content - Full size image with selection */}
            <div 
              ref={containerRef}
              style={{ 
                flex: 1, 
                overflow: "auto",
                position: "relative",
                display: "flex",
                justifyContent: "center",
                alignItems: "flex-start",
                padding: "20px",
                backgroundColor: "#2c3e50"
              }}
            >
              <div style={{ 
                position: "relative", 
                display: "inline-block"
              }}>
                <img
                  ref={imageRef}
                  src={captured || undefined}
                  alt="Screenshot for selection"
                  style={{
                    width: "auto",
                    height: "auto",
                    maxWidth: "none",
                    maxHeight: "none",
                    cursor: draggingAnnotation ? "grabbing" : (currentTool === "select" ? "crosshair" : "crosshair"),
                    display: "block",
                    border: "1px solid #555"
                  }}
                  onMouseMove={handleMouseMove}
                  onClick={handleClick}
                  onMouseUp={handleMouseUp}
                  onMouseLeave={handleMouseUp}
                />
                
                {/* Selection Rectangle */}
                {selectionArea.isActive && selectionRect && (
                  <div
                    style={{
                      position: "absolute",
                      left: selectionRect.left,
                      top: selectionRect.top,
                      width: selectionRect.width,
                      height: selectionRect.height,
                      border: "2px dashed #00ff00",
                      backgroundColor: "rgba(0, 255, 0, 0.1)",
                      pointerEvents: "none",
                      boxSizing: "border-box"
                    }}
                  />
                )}

                {/* Annotations - Rendered as SVG for better quality */}
                <svg
                  style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    width: "100%",
                    height: "100%",
                    pointerEvents: "none"
                  }}
                >
                  {annotations.map(annotation => {
                    if (annotation.type === "rectangle" && annotation.width && annotation.height) {
                      return (
                        <rect
                          key={annotation.id}
                          x={annotation.x}
                          y={annotation.y}
                          width={annotation.width}
                          height={annotation.height}
                          stroke="#ff0000"
                          strokeWidth="3"
                          fill="none"
                        />
                      );
                    } else if (annotation.type === "circle" && annotation.width && annotation.height) {
                      const radiusX = Math.abs(annotation.width) / 2;
                      const radiusY = Math.abs(annotation.height) / 2;
                      const centerX = annotation.x + radiusX * Math.sign(annotation.width);
                      const centerY = annotation.y + radiusY * Math.sign(annotation.height);
                      return (
                        <ellipse
                          key={annotation.id}
                          cx={centerX}
                          cy={centerY}
                          rx={radiusX}
                          ry={radiusY}
                          stroke="#ff0000"
                          strokeWidth="3"
                          fill="none"
                        />
                      );
                    } else if (annotation.type === "arrow" && annotation.width && annotation.height) {
                      const endX = annotation.x + annotation.width;
                      const endY = annotation.y + annotation.height;
                      const angle = Math.atan2(endY - annotation.y, endX - annotation.x);
                      const headLength = 15;
                      return (
                        <g key={annotation.id} stroke="#ff0000" strokeWidth="3">
                          <line 
                            x1={annotation.x} 
                            y1={annotation.y} 
                            x2={endX} 
                            y2={endY} 
                          />
                          <line 
                            x1={endX} 
                            y1={endY} 
                            x2={endX - headLength * Math.cos(angle - Math.PI/6)} 
                            y2={endY - headLength * Math.sin(angle - Math.PI/6)} 
                          />
                          <line 
                            x1={endX} 
                            y1={endY} 
                            x2={endX - headLength * Math.cos(angle + Math.PI/6)} 
                            y2={endY - headLength * Math.sin(angle + Math.PI/6)} 
                          />
                        </g>
                      );
                    } else if (annotation.type === "text") {
                      const textSize = annotation.fontSize || 16;
                      return (
                        <text
                          key={annotation.id}
                          x={annotation.x}
                          y={annotation.y}
                          fill="#ff0000"
                          fontSize={textSize}
                          fontWeight="bold"
                          fontFamily="Arial"
                        >
                          {annotation.data?.text || "Text"}
                        </text>
                      );
                    }
                    return null;
                  })}
                </svg>
              </div>
            </div>

            {/* Toolbar */}
            <div style={{
              padding: "8px 12px",
              background: "#ecf0f1",
              borderTop: "1px solid #bdc3c7",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              gap: "8px",
              flexWrap: "wrap"
            }}>
              <div style={{ display: "flex", gap: "6px", alignItems: "center", flexWrap: "wrap" }}>
                <span style={{ fontSize: "11px", fontWeight: "bold" }}>Tools:</span>
                
                {/* Selection Tool */}
                <button
                  onClick={() => setCurrentTool("select")}
                  style={{
                    padding: "4px 8px",
                    background: currentTool === "select" ? "#27ae60" : "#3498db",
                    color: "white",
                    border: "none",
                    borderRadius: "3px",
                    cursor: "pointer",
                    fontSize: "10px",
                    fontWeight: currentTool === "select" ? "bold" : "normal",
                    display: "flex",
                    alignItems: "center",
                    gap: "4px"
                  }}
                >
                  <Icons.Selection />
                  Select Area
                </button>

                {/* Annotation Tools */}
                {(["rectangle", "circle", "arrow", "text"] as ToolMode[]).filter(t => t !== "select").map((tool) => (
                  <button
                    key={tool}
                    onClick={() => setCurrentTool(tool)}
                    style={{
                      padding: "4px 8px",
                      background: currentTool === tool ? "#e67e22" : "#3498db",
                      color: "white",
                      border: "none",
                      borderRadius: "3px",
                      cursor: "pointer",
                      fontSize: "10px",
                      fontWeight: currentTool === tool ? "bold" : "normal",
                      display: "flex",
                      alignItems: "center",
                      gap: "4px"
                    }}
                  >
                    {tool === "rectangle" && <><Icons.Rectangle /> Rectangle</>}
                    {tool === "circle" && <><Icons.Circle /> Circle</>}
                    {tool === "arrow" && <><Icons.Arrow /> Arrow</>}
                    {tool === "text" && <><Icons.Text /> Text</>}
                  </button>
                ))}

                {/* Clear buttons */}
                <button
                  onClick={() => setAnnotations([])}
                  style={{
                    padding: "4px 8px",
                    background: "#e74c3c",
                    color: "white",
                    border: "none",
                    borderRadius: "3px",
                    cursor: "pointer",
                    fontSize: "10px",
                    display: "flex",
                    alignItems: "center",
                    gap: "4px"
                  }}
                >
                  <Icons.Trash />
                  Clear Annotations
                </button>

                {selectionArea.isActive && (
                  <button
                    onClick={clearSelection}
                    style={{
                      padding: "4px 8px",
                      background: "#e74c3c",
                      color: "white",
                      border: "none",
                      borderRadius: "3px",
                      cursor: "pointer",
                      fontSize: "10px",
                      display: "flex",
                      alignItems: "center",
                      gap: "4px"
                    }}
                  >
                    <Icons.Close />
                    Clear Selection
                  </button>
                )}
              </div>

              <div style={{ display: "flex", gap: "8px" }}>
                <button
                  onClick={downloadSelectedArea}
                  disabled={!selectionArea.isActive}
                  style={{
                    padding: "6px 12px",
                    background: selectionArea.isActive ? "#27ae60" : "#95a5a6",
                    color: "white",
                    border: "none",
                    borderRadius: "4px",
                    cursor: selectionArea.isActive ? "pointer" : "not-allowed",
                    fontSize: "11px",
                    fontWeight: "bold",
                    display: "flex",
                    alignItems: "center",
                    gap: "6px"
                  }}
                >
                  <Icons.Download />
                  Download Selected Area
                </button>
                
                <button
                  onClick={quickDownload}
                  style={{
                    padding: "6px 12px",
                    background: "#2980b9",
                    color: "white",
                    border: "none",
                    borderRadius: "4px",
                    cursor: "pointer",
                    fontSize: "11px",
                    display: "flex",
                    alignItems: "center",
                    gap: "6px"
                  }}
                >
                  <Icons.Download />
                  Download Full Image
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}