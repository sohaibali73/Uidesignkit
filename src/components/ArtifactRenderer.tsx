import React, { useState, useEffect } from 'react';
import { Code, Eye, Copy, Download, Maximize2, Minimize2, Check } from 'lucide-react';

interface Artifact {
  type: string;
  code: string;
  language: string;
  id: string;
}

interface ArtifactRendererProps {
  artifact: Artifact;
  isDark: boolean;
}

export function ArtifactRenderer({ artifact, isDark }: ArtifactRendererProps) {
  const [showCode, setShowCode] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [copied, setCopied] = useState(false);
  const [iframeContent, setIframeContent] = useState('');

  const colors = {
    bg: isDark ? '#1E1E1E' : '#ffffff',
    border: isDark ? '#424242' : '#e0e0e0',
    text: isDark ? '#FFFFFF' : '#212121',
    textMuted: isDark ? '#9E9E9E' : '#757575',
    codeBg: isDark ? '#1a1a2e' : '#f5f5f5',
    buttonBg: isDark ? '#2A2A2A' : '#f0f0f0',
    buttonHover: isDark ? '#3A3A3A' : '#e0e0e0',
  };

  useEffect(() => {
    let content = '';
    
    switch (artifact.type) {
      case 'react':
        content = wrapReactForPreview(artifact.code);
        break;
      case 'html':
        content = artifact.code;
        break;
      case 'svg':
        content = wrapSVGForPreview(artifact.code);
        break;
      case 'mermaid':
        content = wrapMermaidForPreview(artifact.code);
        break;
      default:
        content = `<pre>${artifact.code}</pre>`;
    }
    
    setIframeContent(content);
  }, [artifact]);

  const wrapReactForPreview = (code: string): string => {
    return `<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <script crossorigin src="https://unpkg.com/react@18/umd/react.production.min.js"></script>
    <script crossorigin src="https://unpkg.com/react-dom@18/umd/react-dom.production.min.js"></script>
    <script src="https://unpkg.com/@babel/standalone/babel.min.js"></script>
    <script src="https://cdn.tailwindcss.com"></script>
    <style>
        body {
            margin: 0;
            padding: 20px;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif;
            background: ${isDark ? '#1E1E1E' : '#ffffff'};
            color: ${isDark ? '#FFFFFF' : '#212121'};
        }
        * {
            box-sizing: border-box;
        }
    </style>
</head>
<body>
    <div id="root"></div>
    <script type="text/babel">
        const { useState, useEffect, useRef } = React;
        
        ${code}
        
        const root = ReactDOM.createRoot(document.getElementById('root'));
        root.render(<App />);
    </script>
</body>
</html>`;
  };

  const wrapSVGForPreview = (code: string): string => {
    return `<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <style>
        body {
            margin: 0;
            padding: 20px;
            display: flex;
            justify-content: center;
            align-items: center;
            min-height: 100vh;
            background: ${isDark ? '#1E1E1E' : '#ffffff'};
        }
        svg {
            max-width: 100%;
            height: auto;
        }
    </style>
</head>
<body>
    ${code}
</body>
</html>`;
  };

  const wrapMermaidForPreview = (code: string): string => {
    return `<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <script src="https://cdn.jsdelivr.net/npm/mermaid@10/dist/mermaid.min.js"></script>
    <style>
        body {
            margin: 0;
            padding: 20px;
            background: ${isDark ? '#1E1E1E' : '#ffffff'};
            color: ${isDark ? '#FFFFFF' : '#212121'};
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;
        }
        .mermaid {
            display: flex;
            justify-content: center;
            align-items: center;
        }
    </style>
</head>
<body>
    <div class="mermaid">
${code}
    </div>
    <script>
        mermaid.initialize({ 
            startOnLoad: true,
            theme: '${isDark ? 'dark' : 'default'}'
        });
    </script>
</body>
</html>`;
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(artifact.code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const extension = artifact.language || 'txt';
    const blob = new Blob([artifact.code], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `artifact-${artifact.id}.${extension}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div style={{
      marginTop: '16px',
      border: `1px solid ${colors.border}`,
      borderRadius: '12px',
      overflow: 'hidden',
      backgroundColor: colors.bg,
    }}>
      {/* Header */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '12px 16px',
        backgroundColor: isDark ? '#252540' : '#e8e8e8',
        borderBottom: `1px solid ${colors.border}`,
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
        }}>
          <span style={{
            fontSize: '12px',
            fontWeight: 600,
            color: '#FEC00F',
            textTransform: 'uppercase',
            letterSpacing: '0.5px',
          }}>
            {artifact.type} {artifact.language && `(${artifact.language})`}
          </span>
        </div>

        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
        }}>
          {/* Code/Preview Toggle */}
          <button
            onClick={() => setShowCode(!showCode)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '6px 12px',
              backgroundColor: showCode ? 'rgba(254,192,15,0.2)' : 'transparent',
              border: `1px solid ${showCode ? '#FEC00F' : colors.border}`,
              borderRadius: '6px',
              cursor: 'pointer',
              color: showCode ? '#FEC00F' : colors.textMuted,
              fontSize: '12px',
              fontWeight: 500,
              transition: 'all 0.2s ease',
            }}
          >
            {showCode ? <Eye size={14} /> : <Code size={14} />}
            {showCode ? 'Preview' : 'Code'}
          </button>

          {/* Copy Button */}
          <button
            onClick={handleCopy}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '6px 12px',
              backgroundColor: copied ? '#22C55E' : 'transparent',
              border: `1px solid ${copied ? '#22C55E' : colors.border}`,
              borderRadius: '6px',
              cursor: 'pointer',
              color: copied ? '#fff' : colors.textMuted,
              fontSize: '12px',
              fontWeight: 500,
              transition: 'all 0.2s ease',
            }}
          >
            {copied ? <Check size={14} /> : <Copy size={14} />}
            {copied ? 'Copied!' : 'Copy'}
          </button>

          {/* Download Button */}
          <button
            onClick={handleDownload}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '6px 12px',
              backgroundColor: 'transparent',
              border: `1px solid ${colors.border}`,
              borderRadius: '6px',
              cursor: 'pointer',
              color: colors.textMuted,
              fontSize: '12px',
              fontWeight: 500,
              transition: 'all 0.2s ease',
            }}
          >
            <Download size={14} />
            Download
          </button>

          {/* Expand/Minimize Button */}
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '6px 12px',
              backgroundColor: 'transparent',
              border: `1px solid ${colors.border}`,
              borderRadius: '6px',
              cursor: 'pointer',
              color: colors.textMuted,
              fontSize: '12px',
              fontWeight: 500,
              transition: 'all 0.2s ease',
            }}
          >
            {isExpanded ? <Minimize2 size={14} /> : <Maximize2 size={14} />}
          </button>
        </div>
      </div>

      {/* Content */}
      <div style={{
        height: isExpanded ? '600px' : '400px',
        transition: 'height 0.3s ease',
        overflow: 'hidden',
      }}>
        {showCode ? (
          <pre style={{
            margin: 0,
            padding: '16px',
            fontFamily: "'Fira Code', 'Monaco', monospace",
            fontSize: '13px',
            color: isDark ? '#e0e0e0' : '#333',
            backgroundColor: colors.codeBg,
            whiteSpace: 'pre-wrap',
            wordBreak: 'break-word',
            lineHeight: 1.6,
            height: '100%',
            overflow: 'auto',
          }}>
            {artifact.code}
          </pre>
        ) : (
          <iframe
            srcDoc={iframeContent}
            style={{
              width: '100%',
              height: '100%',
              border: 'none',
              backgroundColor: isDark ? '#1E1E1E' : '#ffffff',
            }}
            sandbox="allow-scripts allow-same-origin"
            title={`artifact-${artifact.id}`}
          />
        )}
      </div>
    </div>
  );
}
