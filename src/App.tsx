import "./App.css";
import { useState, useEffect } from "react";import { 


  Download, 
  Copy, 
  RefreshCw, 

  Check, 


  Info,
 
} from "lucide-react";
import type {
  ShapeType,
} from "./types";

import {
  PASTEL_COLORS,
  BACKGROUND_COLORS
} from "./types";
import { generateProceduralSvg } from "./procedural";

export default function App() {
  // Navigation & Tabs
  const [activeTab, setActiveTab] = useState<"generator" | "about">("generator");

  // Generator engine state
  const [shapeType, setShapeType] = useState<ShapeType>("pebble");
  const [activePresetColor, setActivePresetColor] = useState<string>("#E29578"); // Terracotta
  const [activeBgColor, setActiveBgColor] = useState<string>("#F9F6F0"); // Warm Off-White
  
  // Mathematical tuning values
  const [complexity, setComplexity] = useState<number>(0.5);
  const [smoothness, setSmoothness] = useState<number>(0.7);
  const [rotation, setRotation] = useState<number>(0);
  const [scale, setScale] = useState<number>(0.85);
  
  // Unique generated details
  const [seed, setSeed] = useState<string>("#A8B2_99X_ORG");
  const [currentSvg, setCurrentSvg] = useState<string>("");
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [copied, setCopied] = useState<boolean>(false);

  // Interactive Philosophy playground state
  const [harmonyRatio, setHarmonyRatio] = useState<number>(0.45);

  // Initialize and load default state
  useEffect(() => {
    // Trigger initial shape generation
    triggerGeneration();
  }, []);

  // Update SVG automatically when mathematical levers move or shape options change
  useEffect(() => {
    const generated = generateProceduralSvg(
      shapeType,
      activePresetColor,
      activeBgColor,
      complexity,
      smoothness,
      rotation,
      scale
    );
    setCurrentSvg(generated);
  }, [shapeType, activePresetColor, activeBgColor, complexity, smoothness, rotation, scale]);

  // Generate a new seed string
  const rotateSeed = () => {
    const chars = "0123456789ABCDEF";
    const segment1 = Array.from({ length: 4 }, () => chars[Math.floor(Math.random() * 16)]).join("");
    const segment2 = Array.from({ length: 4 }, () => chars[Math.floor(Math.random() * 16)]).join("");
    const finalSeed = `#${segment1}_${segment2}_${shapeType.substring(0, 3).toUpperCase()}`;
    setSeed(finalSeed);
    return finalSeed;
  };

  // Generate artwork function
const triggerGeneration = async () => {    rotateSeed();
    setIsGenerating(true);
    setErrorMessage(null);

    // Procedural code is near-instantaneous, with a short aesthetic delay to visual confirmation
    setTimeout(() => {
      const generated = generateProceduralSvg(
        shapeType,
        activePresetColor,
        activeBgColor,
        complexity,
        smoothness,
        rotation,
        scale
      );
      setCurrentSvg(generated);
      setIsGenerating(false);
    }, 250);
  };

  // Apply preset mood from Philosophy page direct to generator
  const applyPresetMood = (
    presetShape: ShapeType,
    presetColor: string,
    presetBg: string,
    presetComplexity: number,
    presetSmoothness: number,
    presetRotation: number,
    presetScale: number
  ) => {
    setShapeType(presetShape);
    setActivePresetColor(presetColor);
    setActiveBgColor(presetBg);
    setComplexity(presetComplexity);
    setSmoothness(presetSmoothness);
    setRotation(presetRotation);
    setScale(presetScale);
    setActiveTab("generator");
  };

  // Copy raw SVG data
  const handleCopySvg = () => {
    navigator.clipboard.writeText(currentSvg);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Download SVG file standard
  const handleDownloadSvg = () => {
    if (!currentSvg) return;
    const blob = new Blob([currentSvg], { type: "image/svg+xml" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `lumaform_minimalist_${seed.replace("#", "")}.svg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="app">

    
    <div id="app-root" className="w-full min-h-screen bg-[#F4F0EA] text-[#4A443F] font-sans flex flex-col justify-between selection:bg-[#8C927D]/30">
      
      {/* Top Header Navigation matching Natural Tones style */}
      <nav id="navbar" className="h-20 border-b border-[#DED9D1] px-6 md:px-12 flex items-center justify-between shrink-0 bg-[#F4F0EA]">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-[#8C927D] rounded-full flex items-center justify-center text-[#F4F0EA] font-mono text-xs font-bold shadow-inner">
            L
          </div>
          <div>
            <span className="text-lg font-semibold tracking-tight uppercase font-display block">Lumaform</span>
            <span className="text-[10px] tracking-widest opacity-50 uppercase font-mono block -mt-1">Aesthetic Geometry</span>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="hidden md:flex items-center gap-8 text-xs uppercase tracking-widest font-mono font-medium">
          <button 
            onClick={() => setActiveTab("generator")}
            className={`transition-all pb-1 border-b ${activeTab === "generator" ? "border-[#4A443F] opacity-100" : "border-transparent opacity-45 hover:opacity-100"}`}
          >
            Generator
          </button>
          <button 
            onClick={() => setActiveTab("about")}
            className={`transition-all pb-1 border-b ${activeTab === "about" ? "border-[#4A443F] opacity-100" : "border-transparent opacity-45 hover:opacity-100"}`}
          >
            Philosophie
          </button>
        </div>

        {/* Action Header Button */}
        <div className="flex items-center gap-3">
          <button 
            onClick={handleDownloadSvg}
            className="px-5 py-2.5 border border-[#4A443F] text-xs uppercase tracking-widest hover:bg-[#4A443F] hover:text-[#F4F0EA] transition-all flex items-center gap-2 font-mono font-medium cursor-pointer"
          >
            <Download className="w-4 h-8  border-[#D8D2C8] flex items-center justify-center" />
            <span>Export .SVG</span>
          </button>
        </div>
      </nav>

      {/* Main Dynamic Viewport Grid */}
      <main id="main-viewport" className="flex-1 flex flex-col md:flex-row min-h-0">
        
        {/* MOBILE TABS (Responsive layout helper) */}
        <div className="flex md:hidden border-b border-[#DED9D1] bg-[#EFECE6] p-2 gap-1 overflow-x-auto">
          {/* Action Header Button */}
            <div className="flex items-center gap-3">
              
              <button 
                onClick={handleDownloadSvg}
                className="px-3
    py-2  text-[10px] uppercase tracking-widest hover:bg-[#4A443F] hover:text-[#F4F0EA] transition-all flex items-center gap-2 font-mono font-medium cursor-pointer"
              >
                <Download className="w-4 h-4" />
                <span>Export .SVG</span>
              </button>

            </div>
          <button 
            onClick={() => setActiveTab("about")}
            className={`flex-1 text-center py-2 text-xs uppercase tracking-wider font-mono px-3 ${activeTab === "about" ? "bg-[#8C927D] text-[#F4F0EA]" : "opacity-60"}`}
          >
            Philosophie
          </button>
        </div>

        {/* VIEW 1: MAIN REGENERATING CONTROLLER */}
        {activeTab === "generator" && (
          <>
            {/* Sidebar Controls matching Aesthetic Natural Tones Form */}
            <aside id="generator-sidebar" 
            className="sidebar w-full md:w-96 border-b md:border-b-0 md:border-r border-[#DED9D1] p-6 md:p-4 flex flex-col justify-between max-h-none md:max-h-[calc(100vh-8rem)] overflow-y-auto bg-[#F4F0EA]">
              <div className="space-y-8 pt-2">
                
                {/* Introduction Header text */}
                <div>
                  <h1 className="text-2xl font-light text-[#4A443F] leading-snug tracking-tight mb-3 font-display">
                    Lumaform<br/>
                    <span className="font-semibold text-[#8C927D]">Minimalist Art</span>
                  </h1>
                  <p className="text-xs leading-relaxed text-[#4A443F]/75">
                    Ein technisches Backend, welches saubere, skandinavische Vektor-Formen generiert. Fokussiert auf vollendetes Gleichgewicht und biomorphe Ästhetik.
                  </p>
                </div>

                {/* Informational Panel: Procedural Vector Math Core info */}
                <div className="space-y-3 bg-[#8C927D]/5 p-4 border border-[#8C927D]/20 rounded-sm">
                  <div className="flex justify-between items-center">
                    <label className="text-[10px] uppercase tracking-widest font-mono font-semibold opacity-70 text-[#8C927D]">Performance Core</label>
                    <span className="px-2 py-0.5 rounded-full text-[8px] font-semibold tracking-wider uppercase font-mono bg-[#8C927D] text-white">
                      Local Math Engine
                    </span>
                  </div>
                  <p className="text-[11px] leading-relaxed text-[#4A443F]/80">
                    Lumaform läuft zu 100% lokal im Browser. Spline-basierte Bezier-Wege und kubische Interpolationen berechnen Vektoren ohne Serverlast im Instant-Verfahren.
                  </p>
                </div>

                {/* ERROR PANEL if any */}
                {errorMessage && (
                  <div className="bg-[#E29578]/10 text-[#C27D68] p-3 border border-[#E29578]/30 rounded-sm text-xs leading-relaxed flex items-start gap-2">
                    <Info className="w-4 h-4 shrink-0 mt-0.5" />
                    <span className="text-[11px]">{errorMessage}</span>
                  </div>
                )}

                {/* Form configurations Selector */}
                <div className="space-y-4">
                  <h3 className="text-xs uppercase tracking-widest font-mono font-bold border-b border-[#DED9D1] pb-2 text-[#4A443F]">
                    Form & Layout
                  </h3>

                  {/* Primary shape type radio buttons */}
                  <div className="space-y-4">
                    <label className="text-[10px] uppercase tracking-widest opacity-60 font-mono">Geometrisches Muster</label>
                    <div className="grid grid-cols-2 gap-2">
                      {[
                        { id: "pebble", label: "Pebble (Kiesel)" },
                        { id: "arc", label: "Arc (Bogen)" },
                        { id: "drop", label: "Liquid (Tropfen)" },
                        { id: "circle", label: "Circle (Kreis)" },
                        { id: "organic", label: "Freiform" },
                        { id: "random", label: "Zufällig" }
                      ].map((item) => (
                        <button
                          key={item.id}
                          onClick={() => setShapeType(item.id as ShapeType)}
                          className={`p-2 border text-left text-xs transition-all flex items-center justify-between rounded-sm ${shapeType === item.id ? 'border-[#8C927D] bg-[#8C927D]/5 text-[#4A443F] font-semibold' : 'border-[#DED9D1] hover:border-[#4A443F]/50 text-[#4A443F]'}`}
                        >
                          <span>{item.label}</span>
                          <span className={`w-1.5 h-1.5 rounded-full ${shapeType === item.id ? 'bg-[#8C927D]' : 'bg-transparent'}`}></span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* MATHEMATICAL CONTROLS (Interactives Sliders only for real-time mathematical fine-tuning) */}
                  <div className="space-y-3 bg-[#EFECE6]/55 p-3.5 border border-[#DED9D1]/80 rounded-sm transition-all">
                    <div className="flex justify-between items-center">
                      <label className="text-[10px] uppercase tracking-widest opacity-60 font-mono font-semibold">Regler & Dimension</label>
                    </div>

                    {/* Complexity Slider */}
                    <div className="space-y-1">
                      <div className="flex justify-between text-[10px] font-mono">
                        <span className="opacity-75">Komplexität</span>
                        <span>{Math.round(complexity * 100)}%</span>
                      </div>
                      <input 
                        type="range" 
                        min="0.1" 
                        max="1" 
                        step="0.05"
                        value={complexity}
                        onChange={(e) => setComplexity(parseFloat(e.target.value))}
                        className="w-full accent-[#8C927D] h-1 bg-[#DED9D1] rounded-lg cursor-pointer transition-all"
                      />
                    </div>

                    {/* Smoothness Slider */}
                    <div className="space-y-1">
                      <div className="flex justify-between text-[10px] font-mono">
                        <span className="opacity-75">Weichheit</span>
                        <span>{Math.round(smoothness * 100)}%</span>
                      </div>
                      <input 
                        type="range" 
                        min="0.1" 
                        max="1.2" 
                        step="0.05"
                        value={smoothness}
                        onChange={(e) => setSmoothness(parseFloat(e.target.value))}
                        className="w-full accent-[#8C927D] h-1 bg-[#DED9D1] rounded-lg cursor-pointer transition-all"
                      />
                    </div>

                    {/* Rotation Slider */}
                    <div className="space-y-1">
                      <div className="flex justify-between text-[10px] font-mono">
                        <span className="opacity-75">Drehung (Winkel)</span>
                        <span>{rotation}°</span>
                      </div>
                      <input 
                        type="range" 
                        min="0" 
                        max="360" 
                        step="5"
                        value={rotation}
                        onChange={(e) => setRotation(parseInt(e.target.value))}
                        className="w-full accent-[#8C927D] h-1 bg-[#DED9D1] rounded-lg cursor-pointer transition-all"
                      />
                    </div>

                    {/* Scale Slider */}
                    <div className="space-y-1">
                      <div className="flex justify-between text-[10px] font-mono">
                        <span className="opacity-75">Skalierung (Größe)</span>
                        <span>{Math.round(scale * 100)}%</span>
                      </div>
                      <input 
                        type="range" 
                        min="0.4" 
                        max="1.2" 
                        step="0.05"
                        value={scale}
                        onChange={(e) => setScale(parseFloat(e.target.value))}
                        className="w-full accent-[#8C927D] h-1 bg-[#DED9D1] rounded-lg cursor-pointer transition-all"
                      />
                    </div>
                  </div>
                </div>

                {/* Color Palletes Selection */}
                <div className="space-y-3">
                  <div className="flex justify-between items-center border-b border-[#DED9D1] pb-2">
                    <label className="text-xs uppercase tracking-widest font-mono font-bold text-[#4A443F]">
                      Pastell Farbton
                    </label>
                    <span className="text-[10px] font-mono font-medium text-[#8C927D]">
                      {PASTEL_COLORS.find(c => c.hex === activePresetColor)?.nameDe || "Auswahl"}
                    </span>
                  </div>

                  {/* Circular Swatch List */}
                  <div className="flex flex-wrap gap-2.5 pt-1">
                    {PASTEL_COLORS.map((col) => (
                      <button
                        key={col.hex}
                        onClick={() => setActivePresetColor(col.hex)}
                        className={`w-8 h-8 rounded-full border flex items-center justify-center transition-all ${activePresetColor === col.hex ? 'border-[#4A443F] scale-110 shadow-sm ring-2 ring-[#8C927D]/30' : 'border-[#DED9D1] hover:scale-105'}`}
                        style={{ backgroundColor: col.hex }}
                        title={col.nameDe}
                      >
                        {activePresetColor === col.hex && (
                          <Check className="w-3.5 h-3.5 text-white stroke-[3px]" />
                        )}
                      </button>
                    ))}
                    <button
                      onClick={() => {
                        const rand = PASTEL_COLORS[Math.floor(Math.random() * PASTEL_COLORS.length)].hex;
                        setActivePresetColor(rand);
                      }}
                      className="w-8 h-8 rounded-full border border-dashed border-[#4A443F]/50 flex items-center justify-center text-xs font-mono hover:bg-[#EFECE6] transition-all"
                      title="Zufällige Farbe"
                    >
                      🎲
                    </button>
                  </div>
                </div>

                {/* Background color options */}
                <div className="space-y-4">
                  <label className="text-[10px] uppercase tracking-widest opacity-60 font-mono block">
                    Hintergrund-Flimmern
                  </label>
                  <div className="flex gap-2">
                    {BACKGROUND_COLORS.map((bg) => (
                      <button
                        key={bg.hex}
                        onClick={() => setActiveBgColor(bg.hex)}
                        className={`flex-1 py-1.5 px-3 border text-xs font-mono transition-all rounded-sm ${activeBgColor === bg.hex ? 'border-[#8C927D] bg-[#ECE9E1] font-semibold' : 'border-[#DED9D1] bg-transparent opacity-65 hover:opacity-100'}`}
                      >
                        <span className="inline-block w-2.5 h-2.5 rounded-full mr-1.5 border align-middle" style={{ backgroundColor: bg.hex }}></span>
                        <span className="align-middle text-[10px]">{bg.name.split(" ")[1] || "Ecru"}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Info and metadata seed line */}
                <div className="space-y-1 bg-[#EFECE6]/45 p-3 border border-[#DED9D1] rounded-sm">
                  <div className="flex justify-between items-center text-[9px] font-mono tracking-wide">
                    <span className="opacity-50 uppercase">Form-Signatur / Seed</span>
                    <span className="opacity-75">{seed}</span>
                  </div>
                  <div className="flex justify-between items-center text-[9px] font-mono tracking-wide">
                    <span className="opacity-50 uppercase">Canvas-Dimension</span>
                    <span className="opacity-75">750 x 750 px</span>
                  </div>
                </div>
              </div>

              {/* Action trigger Button matching exactly the specified 20px padding system */}
              <div className="mt-8 pt-6 border-t border-[#DED9D1] space-y-4">
                <button
                  onClick={() => triggerGeneration()}
                  disabled={isGenerating}
                  
                  className="w-full h-[74px] border border-[#D7D0C6] flex items-center justify-between
    px-8 bg-[#8C927D] hover:bg-[#4A443F] disabled:bg-[#8C927D]/60 text-white text-xs uppercase 
    font-medium transition-all duration-300 shadow-md flex items-center justify-center gap-3 whitespace-nowrap cursor-pointer rounded-sm transition-all"
                >
                  <RefreshCw className="w-5 h-5 shrink-0" />
                  <span>{isGenerating ? "Generiere..." : "Form neu generieren"}</span>
                </button>
              </div>
            </aside>

            {/* Main Visual Art Canvas Center Container */}
            <section id="art-panel" className="flex-1 flex flex-col items-center justify-center p-6 md:p-12 lg:p-16 min-h-0 bg-[#EFECE6]/50">
              
              <div className="w-full max-w-[720px] flex flex-col items-center gap-6">
                
                {/* SVG canvas enclosed with precise white frame border of 12px & shadow matching specifications */}
                <div className="relative w-full aspect-square bg-white shadow-[0_30px_90px_-20px_rgba(74,68,63,0.15)] flex items-center justify-center border-[12px] border-white transition-all overflow-hidden rounded-xs group select-none">
                  
                  {isGenerating ? (
                    <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-[#F4F0EA]/90 backdrop-blur-xs transition-all z-10">
                      <div className="w-8 h-8 rounded-full border-2 border-[#8C927D] border-t-transparent animate-spin"></div>
                      <span className="text-[10px] uppercase tracking-widest opacity-60 font-mono">Lumaform Engine rechnet...</span>
                    </div>
                  ) : null}

                  {/* Raw SVG component render */}
                  <div 
                    className="w-[85%] h-[85%] flex items-center justify-center transition-all duration-300"
                    dangerouslySetInnerHTML={{ __html: currentSvg }}
                  />

                  {/* Minimalistic border coordinates and labels */}
                  <div className="absolute top-4 left-4 font-mono text-[9px] opacity-30 select-none">
                    X: 500.00 Y: 500.00
                  </div>
                  <div className="absolute bottom-4 left-4 font-mono text-[9px] opacity-30 select-none">
                    SEED: {seed}
                  </div>
                  <div className="absolute top-4 right-4 font-mono text-[9px] opacity-30 select-none">
                    FORM_CALCULUS_S1
                  </div>
                  <div className="absolute bottom-4 right-4 font-mono text-[9px] opacity-30 select-none">
                    VECTOR_GEN_V.1.02
                  </div>
                </div>

                {/* Bottom Canvas Control Toolbar */}
                <div id="art-controls" className="w-full bg-[#F4F0EA] border border-[#DED9D1] p-3 rounded-sm flex align-middle justify-between gap-1 text-[11px] font-mono">
                  <button 
                    onClick={handleCopySvg}
                    // "px-4" wurde durch "w-[160px] justify-center" ersetzt, damit der Button starr bleibt
                    className="w-[160px] h-10 justify-center py-2 bg-[#EFECE6]/65 hover:bg-[#8C927D]/10 hover:text-[#4A443F] transition-all rounded-sm flex items-center gap-1.5 border border-transparent hover:border-[#DED9D1]"
                    title="SVG-Code kopieren"
                  >
                    {copied ? (
                      <>
                        <Check className="w-4 h-4 text-[#8C927D] stroke-[2.5px]" />
                        <span className="font-semibold text-[#8C927D]">Kopiert!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-4 h-4 opacity-60" />
                        <span>Code kopieren</span>
                      </>
                    )}
                  </button>

                  <div className="px-4 py-2 flex items-center text-[10px] opacity-50 px-4 uppercase tracking-wide">
                    Instant-Vektor
                  </div>
                </div>

                {/* Quick Hint of what can be customized */}
                <p className="text-[10px] text-center opacity-60 leading-relaxed font-serif italic max-w-sm">
                  💡 Tipp: Klicke oben auf <strong className="font-mono">Export .SVG</strong> oder kopiere den flüssig berechneten Quellcode, um die Grafik verlustfrei in Illustrator oder Figma zu skalieren.
                </p>

              </div>
            </section>
          </>
        )}

        {/* VIEW 3: PHILOSOPHY & SCIENTIFIC FOUNDATION - FULLY REWORKED AND BEAUTIFIED */}
        {activeTab === "about" && (
          <div id="about-view" className="flex-1 p-6 md:p-12 overflow-y-auto bg-[#F4F0EA] max-h-[calc(100vh-5rem)]">
            <div className="max-w-5xl mx-auto space-y-16">
              
              {/* Elegant Hero Introduction Header */}
              <div className="space-y-6 text-center md:text-left max-w-3xl">
                <span className="text-[10px] uppercase tracking-[0.25em] font-mono text-[#8C927D] font-bold block bg-[#8C927D]/10 py-1.5 px-3 rounded-md w-fit mx-auto md:mx-0">
                  Philosophische Abhandlung
                </span>
                <h2 className="text-4xl md:text-5xl font-light text-[#4A443F] leading-tight font-display tracking-tight">
                  Das Prinzip der <span className="font-semibold text-[#8C927D]">skandinavischen Stille</span> & Geometrie
                </h2>
                <div className="w-24 h-0.5 bg-[#8C927D] mt-4 mx-auto md:mx-0"></div>
                <p className="text-sm md:text-base leading-relaxed text-[#4A443F]/80 font-serif italic max-w-2xl pt-2">
                  "Lumaform ist kein bloßes Werkzeug zur Generierung von Pixeln. Es ist ein Experiment zur Beruhigung des Auges durch visuelle Reduktion und die Entfaltung von isolierten, harmonischen Gestalten."
                </p>
              </div>

              {/* CURATED STYLES & INTERACTIVE PRESET MOODBOARD */}
              <div className="space-y-6">
                <div className="border-b border-[#DED9D1] pb-3 flex flex-col sm:flex-row justify-between items-start sm:items-end gap-2">
                  <div>
                    <h3 className="text-lg uppercase tracking-wider font-mono font-bold text-[#4A443F]">
                      Ästhetische Stimmungswelten (presets)
                    </h3>
                    <p className="text-xs text-[#4A443F]/60 font-mono mt-1">Wähle eine philosophische Stimmungskombination, um sie sofort im Generator anzuwenden.</p>
                  </div>
                  <span className="text-[10px] font-mono text-[#8C927D]">Klicken, um den Generator zu konfigurieren</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {[
                    {
                      title: "Japandi Quietness",
                      desc: "Asymmetrische organische Kiesel-Formen in Weichgrau auf warmem Off-White. Perfekt ausbalancierte Beunruhigung.",
                      shape: "pebble",
                      color: "#8F9E8B",
                      bg: "#F9F6F0",
                      comp: 0.35,
                      smooth: 0.85,
                      rot: 30,
                      scale: 0.8,
                      badge: "Quiet"
                    },
                    {
                      title: "Eukalyptus & Senf",
                      desc: "Ein kräftiger, aber wohldosierter Akzentton im skandinavischen Herbstlicht. Elegant, minimalistisch und geerdet.",
                      shape: "arc",
                      color: "#E9C46A",
                      bg: "#EFECE6",
                      comp: 0.6,
                      smooth: 0.5,
                      rot: 180,
                      scale: 0.75,
                      badge: "Contrast"
                    },
                    {
                      title: "Terrakotta-Erde",
                      desc: "Weiche biomorphe Tropfen in tiefem gebranntem Ton. Die Wärme südländischer Naturstein-Strukturen.",
                      shape: "drop",
                      color: "#C27D68",
                      bg: "#F4F0EA",
                      comp: 0.45,
                      smooth: 0.9,
                      rot: 45,
                      scale: 0.9,
                      badge: "Earth"
                    },
                    {
                      title: "Perfekte Monotonie",
                      desc: "Ein exakter, asymmetrisch platzierter Kreis. Die ultimative Huldigung der modernen Reduktion.",
                      shape: "circle",
                      color: "#D4A3A3",
                      bg: "#F9F6F0",
                      comp: 0.2,
                      smooth: 0.95,
                      rot: 0,
                      scale: 0.7,
                      badge: "Pure"
                    }
                  ].map((mood, idx) => (
                    <div 
                      key={idx}
                      className="bg-white border border-[#DED9D1] p-5 rounded-sm flex flex-col justify-between hover:shadow-md transition-all group"
                    >
                      <div className="space-y-4">
                        <div className="flex justify-between items-center">
                          <span className="text-[10px] uppercase font-mono tracking-wider font-bold text-[#8C927D]">
                            {mood.badge}
                          </span>
                          <span className="text-xs font-mono opacity-35">0{idx + 1}</span>
                        </div>
                        {/* Sample visualization outline */}
                        <div 
                          className="w-full h-24 rounded-xs border border-transparent flex items-center justify-center relative overflow-hidden transition-all duration-300 group-hover:scale-[1.02]"
                          style={{ backgroundColor: mood.bg }}
                        >
                          <div 
                            className="w-10 h-10 rounded-full opacity-90 filter drop-shadow-xs"
                            style={{ 
                              backgroundColor: mood.color, 
                              borderRadius: mood.shape === 'pebble' ? '40% 60% 70% 30% / 40% 50% 60% 50%' : mood.shape === 'drop' ? '50% 50% 50% 50% / 80% 80% 20% 20%' : '50%'
                            }}
                          ></div>
                          <div className="absolute bottom-1 right-2 text-[8px] font-mono opacity-40">
                            {mood.shape.toUpperCase()}
                          </div>
                        </div>

                        <div className="space-y-1">
                          <h4 className="font-sans font-semibold text-sm text-[#4A443F]">
                            {mood.title}
                          </h4>
                          <p className="text-[11px] leading-relaxed text-[#4A443F]/75">
                            {mood.desc}
                          </p>
                        </div>
                      </div>

                      <button
                        onClick={() => applyPresetMood(
                          mood.shape as ShapeType, 
                          mood.color, 
                          mood.bg, 
                          mood.comp, 
                          mood.smooth, 
                          mood.rot, 
                          mood.scale
                        )}
                        className="w-full mt-4 py-2 bg-[#EFECE6] hover:bg-[#8C927D] hover:text-white text-[10px] uppercase tracking-widest font-mono font-medium transition-colors text-center cursor-pointer rounded-xs"
                      >
                        Stil anwenden
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* INTERACTIVE COMPOSITION TEST: STUDY LAB */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center bg-[#EFECE6]/60 border border-[#DED9D1] p-6 md:p-8 rounded-sm">
                
                <div className="lg:col-span-7 space-y-4">
                  <span className="text-[9px] uppercase tracking-[0.2em] font-mono font-bold text-[#E29578] block">Interactive Theory Lab</span>
                  <h3 className="text-2xl font-light font-display text-[#4A443F]">Studie der Proportionen & Raumspannung</h3>
                  <p className="text-xs leading-relaxed text-[#4A443F]/80 font-serif">
                    Die Ästhetik des Minimalismus basiert auf dem perfekten Zusammenspiel von **Form-Volumen** und **Negativ-Fläche**. Wenn die Form zu klein ist, verliert sich die Spannung. Wenn die Form zu groß wird, erdrückt sie den Raum.
                  </p>

                  {/* Interactive Slider to see optical calculations */}
                  <div className="space-y-4 pt-3">
                    <div className="flex justify-between items-center text-xs font-mono">
                      <span>Proportionaler Formanteil:</span>
                      <span className="font-bold text-[#8C927D] bg-white px-2 py-0.5 border rounded-sm">{(harmonyRatio * 100).toFixed(0)}%</span>
                    </div>
                    <input 
                      type="range"
                      min="0.15"
                      max="0.85"
                      step="0.05"
                      value={harmonyRatio}
                      onChange={(e) => setHarmonyRatio(parseFloat(e.target.value))}
                      className="w-full accent-[#8C927D] h-1.5 bg-[#DED9D1] rounded-lg cursor-pointer"
                    />
                    <div className="flex justify-between text-[9px] font-mono opacity-50">
                      <span>0.15 (Leere)</span>
                      <span>0.45 (Optimaler Schwerpunkt)</span>
                      <span>0.85 (Überfüllung)</span>
                    </div>
                  </div>

                  {/* Scientific visual feedback */}
                  <div className="bg-white/80 p-3 border border-[#DED9D1] text-xs font-mono flex items-center justify-between text-[11px] rounded-xs">
                    <span className="opacity-60">Optische Analyse:</span>
                    {harmonyRatio < 0.35 ? (
                      <span className="text-[#C27D68] font-bold">⚠️ ZU LEER (Vakuum-Effekt - Form verliert Halt)</span>
                    ) : harmonyRatio > 0.6 ? (
                      <span className="text-red-600 font-bold">⚠️ BRANDBREITE ÜBERSCHRITTEN (Form erdrückt die Leinwand)</span>
                    ) : (
                      <span className="text-[#8C927D] font-bold">🌌 GOLDENE HARMONIE (Perfekt schwebendes Gewicht)</span>
                    )}
                  </div>
                </div>

                {/* Live Mock proportions rendering right inside the lab */}
                <div className="lg:col-span-5 flex justify-center">
                  <div className="w-56 aspect-square bg-[#F9F6F0] rounded-xs border-4 border-white shadow-md flex items-center justify-center relative p-4 select-none">
                    <div 
                      className="rounded-full bg-[#E29578] transition-all duration-300"
                      style={{ 
                        width: `${harmonyRatio * 100}%`, 
                        height: `${harmonyRatio * 100}%`,
                        opacity: 0.85,
                        boxShadow: "0 10px 25px -5px rgba(226,149,120,0.3)"
                      }}
                    ></div>
                    {/* Proportional Grid Overlay helpers */}
                    <div className="absolute inset-0 border border-dashed border-[#DED9D1]/40 pointer-events-none rounded-xs"></div>
                    <div className="absolute inset-x-0 h-px top-1/2 border-t border-dashed border-[#DED9D1]/40 pointer-events-none"></div>
                    <div className="absolute inset-y-0 w-px left-1/2 border-l border-dashed border-[#DED9D1]/40 pointer-events-none"></div>
                    
                    <span className="absolute bottom-2 left-2 text-[8px] font-mono opacity-30">Ratio: {harmonyRatio.toFixed(2)}</span>
                    <span className="absolute top-2 right-2 text-[8px] font-mono opacity-30">PROPORTIONS_TEST</span>
                  </div>
                </div>

              </div>

              {/* THE FOUR GOLDEN PRINCIPLES CORES */}
              <div className="space-y-6 pt-4">
                <h3 className="text-lg uppercase tracking-wider font-mono font-bold text-[#4A443F] border-b border-[#DED9D1] pb-2 text-center md:text-left">
                  Die vier goldenen Säulen des Lumaform Minimalismus
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  
                  <div className="space-y-2.5">
                    <div className="flex items-center gap-3">
                      <div className="w-6 h-6 rounded-full bg-[#8C927D]/20 text-[#8C927D] flex items-center justify-center font-mono text-xs font-semibold">1</div>
                      <h4 className="font-sans font-bold text-sm uppercase text-[#4A443F] tracking-wider">Negativer Raum (Negative Space Rule)</h4>
                    </div>
                    <p className="text-xs leading-relaxed text-[#4A443F]/80 font-serif pl-9">
                      Das Nichts ist genauso wichtig wie das Etwas. Mindestens 45-60% der sichtbaren Leinwandfläche müssen gänzlich ungerührt bleiben. Dieser unberührte Creme-Hintergrund gibt der Form erst die Luft, um ihre plastische Kraft im Auge des Betrachters zu entfalten.
                    </p>
                  </div>

                  <div className="space-y-2.5">
                    <div className="flex items-center gap-3">
                      <div className="w-6 h-6 rounded-full bg-[#8C927D]/20 text-[#8C927D] flex items-center justify-center font-mono text-xs font-semibold">2</div>
                      <h4 className="font-sans font-bold text-sm uppercase text-[#4A443F] tracking-wider">Singuläre Geste (The Rule of Monarchy)</h4>
                    </div>
                    <p className="text-xs leading-relaxed text-[#4A443F]/80 font-serif pl-9">
                      Es darf exakt eine einzige zusammenhängende oder singulär geschlossene Form existieren. Jedes Hinzufügen einer zweiten Form bricht die Symmetrie der Fokussierung auf. Der Betrachter wird gezwungen, das Wesen dieses einzelnen Körpers ohne visuelle Ablenkung zu begreifen.
                    </p>
                  </div>

                  <div className="space-y-2.5">
                    <div className="flex items-center gap-3">
                      <div className="w-6 h-6 rounded-full bg-[#8C927D]/20 text-[#8C927D] flex items-center justify-center font-mono text-xs font-semibold">3</div>
                      <h4 className="font-sans font-bold text-sm uppercase text-[#4A443F] tracking-wider">Kanten-Rigorismus (The Hard-Edge Directive)</h4>
                    </div>
                    <p className="text-xs leading-relaxed text-[#4A443F]/80 font-serif pl-9">
                      Moderne Kunst gedeiht an der scharfen Grenze. Unsere Formen nutzen keinerlei Schlagschatten, texturierte Verläufe, Muster oder weichgezeichnete Ränder. Einzig und allein der harte Übergang von der Farbfläche zur leeren Leinwand formt die Kontur.
                    </p>
                  </div>

                  <div className="space-y-2.5">
                    <div className="flex items-center gap-3">
                      <div className="w-6 h-6 rounded-full bg-[#8C927D]/20 text-[#8C927D] flex items-center justify-center font-mono text-xs font-semibold">4</div>
                      <h4 className="font-sans font-bold text-sm uppercase text-[#4A443F] tracking-wider">Erdbasierte Farbakkorde (Earth Hues Only)</h4>
                    </div>
                    <p className="text-xs leading-relaxed text-[#4A443F]/80 font-serif pl-9">
                      Farben müssen leise sprechen, nicht laut schreien. Lumaform quantisiert die Farbgebung streng auf Pastellwerte und natürliche Oxide – gebrannter Ton, Salzwasser-Grün, blasses Altsandroth. Diese Hues harmonieren nahtlos mit natürlichen Holz- und Leinenstoffen.
                    </p>
                  </div>

                </div>
              </div>

              {/* TECHNICAL ENGINE DECONSTRUCTION */}
              <div className="bg-[#EFECE6]/45 p-6 border border-[#DED9D1] rounded-sm space-y-4">
                <h4 className="font-mono text-xs uppercase tracking-widest font-bold">Technische Spezifikationen & Rendering</h4>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-[10px] font-mono text-[#4A443F]/75">
                  <div className="space-y-1">
                    <span className="opacity-45 uppercase block">Engine Core</span>
                    <span className="font-semibold block">Vektor-Interpolation</span>
                    <span className="block opacity-60">Spline cubic math bezier paths rendering. Fully scalable output without compression loss.</span>
                  </div>
                  <div className="space-y-1">
                    <span className="opacity-45 uppercase block">Mathematische Präzision</span>
                    <span className="font-semibold block">Client-seitige Mathematik</span>
                    <span className="block opacity-60">Komplett lokale Berechnung auf Client-Hardware für augenblickliche Ergebnisse ohne Ladezeiten oder API-Abhängigkeit.</span>
                  </div>
                  <div className="space-y-1">
                    <span className="opacity-45 uppercase block">Hard-Edge Standard</span>
                    <span className="font-semibold block">W3C SVG 1.1 Compliant</span>
                    <span className="block opacity-60">Pure hard bounds geometry. Standard vector XML code ready for instant copy & paste.</span>
                  </div>
                </div>
              </div>

            </div>
          </div>
        )}

      </main>
      <footer id="footer" className="h-16 md:h-12 border-t border-[#DED9D1] px-6 md:px-12 flex flex-col md:flex-row items-center justify-between text-[9px] uppercase tracking-[0.18em] opacity-65 gap-2 md:gap-0 py-3 md:py-0 font-mono shrink-0 bg-[#F4F0EA]">
        <div className="flex items-center gap-2">
          <span>Lumaform SVG-Generierung</span>
          <span className="text-gray-400">|</span>
          <span className="opacity-90">Design Theme: Natural Tones</span>
        </div>
        <div className="flex gap-4 md:gap-8 text-center md:text-right">
          <span>Minimalist Rendering</span>
          <span>Pastel Hue Quantization</span>
          <span>Hard-Edge Compositions</span>
        </div>
      </footer>

    </div>
  
  </div>)
}
