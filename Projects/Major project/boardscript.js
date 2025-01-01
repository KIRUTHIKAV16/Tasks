// Ensure DOM is fully loaded before running the script
document.addEventListener("DOMContentLoaded", () => {
  // Get elements for whiteboard tools
  const newBtn = document.getElementById("newBtn");
  const importBtn = document.getElementById("importBtn");
  const saveBtn = document.getElementById("saveBtn");
  const printBtn = document.getElementById("printBtn");
  const shareBtn = document.getElementById("shareBtn");
  const exitBtn = document.getElementById("exitBtn");
  const zoomInBtn = document.getElementById("zoomInBtn");
  const zoomOutBtn = document.getElementById("zoomOutBtn");
  const gridBtn = document.getElementById("gridBtn");
  const fullscreenBtn = document.getElementById("fullscreenBtn");
  const undoBtn = document.getElementById("undoBtn");
  const redoBtn = document.getElementById("redoBtn");

  // Get canvas elements
  const whiteboard = document.getElementById("whiteboard");
  const ctx = whiteboard.getContext("2d");

  // Initialize canvas context
  let zoomLevel = 1;
  let lastX = 0;
  let lastY = 0;
  let lines = [];
  let undoneLines = [];
  let showGrid = false;

  let currentTool = 'pencil'; // Track the selected tool
  let drawing = false;
  let isErasing = false;

  // Tool Buttons
  const pencilBtn = document.getElementById("pencilBtn");
  const eraserBtn = document.getElementById("eraserBtn");
  const textBtn = document.getElementById("textBtn");
  const markerBtn = document.getElementById("markerBtn");

  // Tool Selection Handlers
  pencilBtn.addEventListener("click", () => {
    currentTool = 'pencil';
    isErasing = false;
    ctx.strokeStyle = "#000"; 
    ctx.lineWidth = 2; 
  });

  let eraserSize = 50; 

  // Event listener for the eraser button
  eraserBtn.addEventListener("click", () => {
    currentTool = 'eraser';
    ctx.globalCompositeOperation = 'destination-out'; // Set to eraser mode
  });

  // Erase function to clear an area
  function erase(x, y) {
    ctx.beginPath();
    ctx.arc(x, y, eraserSize / 2, 0, Math.PI * 2); // Create a circular eraser
    ctx.fill(); // Clear the area inside the circle
  }

  // Mouse events for erasing
  whiteboard.addEventListener("mousemove", (e) => {
    if (currentTool === 'eraser' && drawing) {
      erase(e.offsetX, e.offsetY);
    }
  });

  whiteboard.addEventListener("mouseup", () => {
    if (currentTool === 'eraser') {
      ctx.globalCompositeOperation = 'source-over'; // Reset to normal mode
    }
  });

  markerBtn.addEventListener("click", () => {
    currentTool = 'marker';
    isErasing = false;
    ctx.strokeStyle = "#FF0000"; 
    ctx.lineWidth = 5; 
  });

  // Event listener for the text tool button
  textBtn.addEventListener("click", () => {
    currentTool = 'text';
  });

  // Mouse Events for Drawing/Erasing/Text
  whiteboard.addEventListener("mousedown", (e) => {
    drawing = true;
    lastX = e.offsetX;
    lastY = e.offsetY;

    if (currentTool === 'text') {
      drawing = false; // Stop drawing when using the text tool
      const text = prompt("Enter text:");
      if (text) {
        ctx.font = "16px Arial"; // Font size and style
        ctx.fillStyle = ctx.strokeStyle; // Use current stroke style for text color
        ctx.fillText(text, e.offsetX, e.offsetY); // Draw text at the clicked position
      }
    }
  });

  whiteboard.addEventListener("mousemove", (e) => {
    if (!drawing || currentTool === 'text') return;

    const currentX = e.offsetX;
    const currentY = e.offsetY;

    if (isErasing) {
      erase(currentX, currentY); // Use existing erase function
    } else {
      ctx.beginPath();
      ctx.moveTo(lastX, lastY);
      ctx.lineTo(currentX, currentY);
      ctx.stroke();

      // Save the line for undo/redo functionality
      lines.push({ x1: lastX, y1: lastY, x2: currentX, y2: currentY });
    }

    lastX = currentX;
    lastY = currentY;
  });

  // Stop drawing when mouse is released
  whiteboard.addEventListener("mouseup", () => {
    drawing = false;
  });

  // Ensure the drawing stops when the mouse leaves the canvas
  whiteboard.addEventListener("mouseout", () => {
    drawing = false;
  });

  // Resize canvas
  function resizeCanvas() {
    whiteboard.width = window.innerWidth - 80;
    whiteboard.height = window.innerHeight * 0.8;
    if (showGrid) drawGrid(); // Redraw the grid after resizing
  }
  resizeCanvas();

  // Clear canvas
  function clearCanvas() {
    ctx.clearRect(0, 0, whiteboard.width, whiteboard.height);
  }

 // Store drawn shapes in an array
let shapes = [];
let currentShape = null;
let drawingShape = false;
let startX, startY;

// Event listeners for shape buttons
document.getElementById("squareBtn").addEventListener("click", () => setCurrentShape("square"));
document.getElementById("circleBtn").addEventListener("click", () => setCurrentShape("circle"));
document.getElementById("triangleBtn").addEventListener("click", () => setCurrentShape("triangle"));
document.getElementById("ellipseBtn").addEventListener("click", () => setCurrentShape("ellipse"));
document.getElementById("hexagonBtn").addEventListener("click", () => setCurrentShape("hexagon"));
document.getElementById("starBtn").addEventListener("click", () => setCurrentShape("star"));
document.getElementById("pentagonBtn").addEventListener("click", () => setCurrentShape("pentagon"));
document.getElementById("rhombusBtn").addEventListener("click", () => setCurrentShape("rhombus"));
document.getElementById("parallelogramBtn").addEventListener("click", () => setCurrentShape("parallelogram"));
document.getElementById("octagonBtn").addEventListener("click", () => setCurrentShape("octagon"));
document.getElementById("crossBtn").addEventListener("click", () => setCurrentShape("cross"));
document.getElementById("heartBtn").addEventListener("click", () => setCurrentShape("heart"));
document.getElementById("lineBtn").addEventListener("click", () => setCurrentShape("line"));
document.getElementById("arrowBtn").addEventListener("click", () => setCurrentShape("arrow"));

// Function to set the current shape to draw
function setCurrentShape(shape) {
  currentShape = shape;
  drawingShape = false;
}

// Event listeners for mouse actions
whiteboard.addEventListener("mousedown", (e) => {
  if (!currentShape) return;
  drawingShape = true;
  startX = e.offsetX;
  startY = e.offsetY;
});

whiteboard.addEventListener("mousemove", (e) => {
  if (!drawingShape) return;
  const endX = e.offsetX;
  const endY = e.offsetY;
  clearCanvas();  
  redrawShapes(); 
  drawShape(currentShape, startX, startY, endX, endY);
});

whiteboard.addEventListener("mouseup", (e) => {
  if (!drawingShape) return;
  drawingShape = false;
  const endX = e.offsetX;
  const endY = e.offsetY;
  shapes.push({ shape: currentShape, startX, startY, endX, endY }); // Store the shape data
  redrawShapes();
});

// Function to draw different shapes
function drawShape(shape, x1, y1, x2, y2) {
  const width = x2 - x1;
  const height = y2 - y1;
  ctx.beginPath();
  switch (shape) {
    case "square":
      ctx.rect(x1, y1, width, width);
      break;
    case "circle":
      const radius = Math.sqrt(width * width + height * height) / 2;
      ctx.arc(x1 + width / 2, y1 + height / 2, radius, 0, Math.PI * 2);
      break;
    case "triangle":
      ctx.moveTo(x1, y2);
      ctx.lineTo(x1 + width / 2, y1);
      ctx.lineTo(x2, y2);
      ctx.closePath();
      break;
    case "ellipse":
      ctx.ellipse(x1 + width / 2, y1 + height / 2, Math.abs(width) / 2, Math.abs(height) / 2, 0, 0, Math.PI * 2);
      break;
    case "hexagon":
      drawPolygon(6, x1, y1, width, height);
      break;
    case "pentagon":
      drawPolygon(5, x1, y1, width, height);
      break;
    case "star":
      drawStar(x1 + width / 2, y1 + height / 2, Math.abs(width) / 2, Math.abs(width) / 4, 5);
      break;
    case "rhombus":
      ctx.moveTo(x1 + width / 2, y1);
      ctx.lineTo(x2, y1 + height / 2);
      ctx.lineTo(x1 + width / 2, y2);
      ctx.lineTo(x1, y1 + height / 2);
      ctx.closePath();
      break;
    case "parallelogram":
      ctx.moveTo(x1 + width / 4, y1);
      ctx.lineTo(x2, y1);
      ctx.lineTo(x2 - width / 4, y2);
      ctx.lineTo(x1, y2);
      ctx.closePath();
      break;
    case "octagon":
      drawPolygon(8, x1, y1, width, height);
      break;
    case "cross":
      drawCross(x1, y1, width, height);
      break;
    case "heart":
      drawHeart(x1, y1, width, height);
      break;
    case "line":
      ctx.moveTo(x1, y1);
      ctx.lineTo(x2, y2);
      break;
    case "arrow":
      drawArrow(x1, y1, x2, y2);
      break;
  }
  ctx.stroke();
}

// Function to draw a polygon (for hexagons, pentagons, etc.)
function drawPolygon(sides, x1, y1, width, height) {
  const centerX = x1 + width / 2;
  const centerY = y1 + height / 2;
  const radius = Math.min(Math.abs(width), Math.abs(height)) / 2;
  ctx.moveTo(centerX + radius * Math.cos(0), centerY + radius * Math.sin(0));
  for (let i = 1; i <= sides; i++) {
    const angle = (i * 2 * Math.PI) / sides;
    ctx.lineTo(centerX + radius * Math.cos(angle), centerY + radius * Math.sin(angle));
  }
  ctx.closePath();
}

// Function to draw a star
function drawStar(cx, cy, outerRadius, innerRadius, points) {
  const step = Math.PI / points;
  let angle = -Math.PI / 2;
  ctx.moveTo(cx + outerRadius * Math.cos(angle), cy + outerRadius * Math.sin(angle));
  for (let i = 0; i < points; i++) {
    angle += step;
    ctx.lineTo(cx + innerRadius * Math.cos(angle), cy + innerRadius * Math.sin(angle));
    angle += step;
    ctx.lineTo(cx + outerRadius * Math.cos(angle), cy + outerRadius * Math.sin(angle));
  }
  ctx.closePath();
}

// Function to draw a cross
function drawCross(x1, y1, width, height) {
  const armWidth = Math.min(width, height) / 4;
  const centerX = x1 + width / 2;
  const centerY = y1 + height / 2;
  // Horizontal line
  ctx.moveTo(centerX - armWidth / 2, centerY);
  ctx.lineTo(centerX + armWidth / 2, centerY);
  // Vertical line
  ctx.moveTo(centerX, centerY - armWidth / 2);
  ctx.lineTo(centerX, centerY + armWidth / 2);
}

// Function to draw a heart
function drawHeart(x1, y1, width, height) {
  const x2 = x1 + width;
  const y2 = y1 + height;
  ctx.moveTo(x1 + width / 2, y1 + height / 4);
  ctx.bezierCurveTo(x1 + width / 2, y1, x1, y1, x1, y1 + height / 4);
  ctx.bezierCurveTo(x1, y1 + height / 2, x1 + width / 2, y2, x1 + width / 2, y2);
  ctx.bezierCurveTo(x1 + width / 2, y2, x2, y1 + height / 2, x2, y1 + height / 4);
  ctx.bezierCurveTo(x2, y1, x1 + width / 2, y1, x1 + width / 2, y1 + height / 4);
  ctx.closePath();
}

// Function to draw an arrow
function drawArrow(x1, y1, x2, y2) {
  ctx.moveTo(x1, y1);
  ctx.lineTo(x2, y2);
  // Arrowhead
  const angle = Math.atan2(y2 - y1, x2 - x1);
  const arrowLength = 15;  // Length of the arrowhead
  const arrowAngle = Math.PI / 6;  // Angle of the arrowhead
  ctx.lineTo(x2 - arrowLength * Math.cos(angle - arrowAngle), y2 - arrowLength * Math.sin(angle - arrowAngle));
  ctx.moveTo(x2, y2);
  ctx.lineTo(x2 - arrowLength * Math.cos(angle + arrowAngle), y2 - arrowLength * Math.sin(angle + arrowAngle));
  ctx.stroke();
}

// Function to redraw all the shapes
function redrawShapes() {
  shapes.forEach((shapeData) => {
    drawShape(shapeData.shape, shapeData.startX, shapeData.startY, shapeData.endX, shapeData.endY);
  });
}

// Function to clear the canvas
function clearCanvas() {
  ctx.clearRect(0, 0, whiteboard.width, whiteboard.height);
  if (showGrid) drawGrid(); // Redraw grid if enabled
}

// Brushes options
  const crayonBtn = document.getElementById("crayonBtn");
  const airbrushBtn = document.getElementById("airbrushBtn");
  const watercolorBtn = document.getElementById("watercolorBtn");
  const oilBrushBtn = document.getElementById("oilBrushBtn");
  const calligraphyBtn = document.getElementById("calligraphyBtn");
  const colorPicker = document.getElementById("color-picker");

  // Set up brush tool properties
  const brushSettings = {
    crayon: { lineWidth: 15, lineCap: "round", globalAlpha: 1 },
    airbrush: { lineWidth: 5, lineCap: "round", globalAlpha: 0.3 },
    watercolor: { lineWidth: 10, lineCap: "round", globalAlpha: 0.5 },
    oilBrush: { lineWidth: 20, lineCap: "round", globalAlpha: 1 },
    calligraphy: { lineWidth: 5, lineCap: "butt", globalAlpha: 1 }
  };

  // Set brush settings based on selected tool
  function setBrushSettings(brushType) {
    const settings = brushSettings[brushType];
    ctx.lineWidth = settings.lineWidth;
    ctx.lineCap = settings.lineCap;
    ctx.globalAlpha = settings.globalAlpha;
    ctx.strokeStyle = colorPicker.value; 
  }

  // Set default brush settings
  let currentBrush = "crayon";
  setBrushSettings(currentBrush);

  // Brush tool event listeners
  crayonBtn.addEventListener("click", () => {
    currentBrush = "crayon";
    setBrushSettings(currentBrush);
  });

  airbrushBtn.addEventListener("click", () => {
    currentBrush = "airbrush";
    setBrushSettings(currentBrush);
  });

  watercolorBtn.addEventListener("click", () => {
    currentBrush = "watercolor";
    setBrushSettings(currentBrush);
  });

  oilBrushBtn.addEventListener("click", () => {
    currentBrush = "oilBrush";
    setBrushSettings(currentBrush);
  });

  calligraphyBtn.addEventListener("click", () => {
    currentBrush = "calligraphy";
    setBrushSettings(currentBrush);
  });

  // Function to change the brush color based on the color picker
function changeBrushColor(color) {
  ctx.strokeStyle = color;  
  ctx.fillStyle = color;    
}
  // Event listener for color picker
  colorPicker.addEventListener("input", () => {
    setBrushSettings(currentBrush); // Update brush settings when color is changed
  });

  // Mouse events for drawing with brush
  whiteboard.addEventListener("mousedown", (e) => {
    drawing = true;
    lastX = e.offsetX;
    lastY = e.offsetY;
    ctx.beginPath();
    ctx.moveTo(lastX, lastY);
  });

  whiteboard.addEventListener("mouseup", () => {
    drawing = false;
    ctx.closePath();
  });

  whiteboard.addEventListener("mouseout", () => {
    drawing = false;
    ctx.closePath();
  });

pencilBtn.addEventListener("click", () => {
  currentTool = 'pencil';
  isErasing = false;
  ctx.strokeStyle = document.getElementById("color-picker").value; // Set to selected color
  ctx.lineWidth = 2; // Thin line for pencil
});

markerBtn.addEventListener("click", () => {
  currentTool = 'marker';
  isErasing = false;
  ctx.strokeStyle = document.getElementById("color-picker").value; // Set to selected color
  ctx.lineWidth = 5; // Thick line for marker
});

// New canvas
newBtn.addEventListener("click", () => {
  ctx.clearRect(0, 0, whiteboard.width, whiteboard.height);
  lines = [];
  undoneLines = [];
  if (showGrid) drawGrid();
});

// Import image
importBtn.addEventListener("click", () => {
  const input = document.createElement("input");
  input.type = "file";
  input.accept = "image/*";
  input.addEventListener("change", (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        ctx.clearRect(0, 0, whiteboard.width, whiteboard.height);
        ctx.drawImage(img, 0, 0, whiteboard.width, whiteboard.height);
        if (showGrid) drawGrid();
      };
      img.src = e.target.result;
    };
    reader.readAsDataURL(file);
  });
  input.click();
});

// Save functionality
saveBtn.addEventListener("click", async () => {
  if (window.showSaveFilePicker) {
    try {
      const fileHandle = await window.showSaveFilePicker({
        suggestedName: "whiteboard.png",
        types: [
          { description: "PNG Image", accept: { "image/png": [".png"] } }
        ]
      });
      const writable = await fileHandle.createWritable();
      const dataUrl = whiteboard.toDataURL("image/png");
      const blob = await (await fetch(dataUrl)).blob();
      await writable.write(blob);
      await writable.close();
      alert("File saved successfully!");
    } catch (err) {
      console.error("Save operation failed:", err);
    }
  } else {
    alert("The File System Access API is not supported in this browser.");
  }
});

// Print canvas content
printBtn.addEventListener("click", () => {
  const dataUrl = whiteboard.toDataURL("image/png");
  const printWindow = window.open();
  printWindow.document.write("<img src='" + dataUrl + "' />");
  printWindow.print();
});

// Share canvas content
shareBtn.addEventListener("click", () => {
  const dataUrl = whiteboard.toDataURL("image/png");
  navigator.share({ files: [new File([dataUrl], "whiteboard.png", { type: "image/png" })] });
});

// Exit functionality
exitBtn.addEventListener("click", () => window.close());

// Fullscreen toggle
fullscreenBtn.addEventListener("click", () => {
  if (document.fullscreenElement) {
    document.exitFullscreen();
  } else {
    document.documentElement.requestFullscreen();
  }
});

// Zoom functionality
zoomInBtn.addEventListener("click", () => {
  zoomLevel += 0.1;
  whiteboard.style.transform = `scale(${zoomLevel})`;
});

zoomOutBtn.addEventListener("click", () => {
  zoomLevel = Math.max(0.1, zoomLevel - 0.1);
  whiteboard.style.transform = `scale(${zoomLevel})`;
});

  let currentLine = null;
  // Draw gridlines on the canvas
  function drawGrid() {
    const gridSize = 20;
    ctx.strokeStyle = "#ddd";
    for (let x = 0; x < whiteboard.width; x += gridSize) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, whiteboard.height);
      ctx.stroke();
    }
    for (let y = 0; y < whiteboard.height; y += gridSize) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(whiteboard.width, y);
      ctx.stroke();
    }
  }

  // Redraw the canvas
  function redrawCanvas() {
    ctx.clearRect(0, 0, whiteboard.width, whiteboard.height);
    if (showGrid) drawGrid();
    lines.forEach((line) => {
      ctx.beginPath();
      ctx.moveTo(line.x1, line.y1);
      ctx.lineTo(line.x2, line.y2);
      ctx.strokeStyle = line.color;
      ctx.lineWidth = line.width;
      ctx.stroke();
    });
  }

  // Start drawing
  whiteboard.addEventListener("mousedown", (e) => {
    drawing = true;
    currentLine = {
      startX: e.offsetX,
      startY: e.offsetY,
      color: "#fff",
      width:4 ,
    };
    undoneLines = []; // Clear redo history when starting a new drawing
  });

  // Stop drawing
  whiteboard.addEventListener("mouseup", () => {
    drawing = false;
    currentLine = null;
  });

  // Undo functionality
  undoBtn.addEventListener("click", () => {
    if (lines.length > 0) {
      const lastLine = lines.pop();
      undoneLines.push(lastLine); // Save the undone line for redo
      redrawCanvas();
    }
  });

  // Redo functionality
  redoBtn.addEventListener("click", () => {
    if (undoneLines.length > 0) {
      const lastUndoneLine = undoneLines.pop();
      lines.push(lastUndoneLine); // Restore the undone line
      redrawCanvas();
    }
  });

  // Toggle gridlines
  gridBtn.addEventListener("click", () => {
    showGrid = !showGrid;
    redrawCanvas();
  });

  // Resize the canvas on window resize
  window.addEventListener("resize", resizeCanvas);
  resizeCanvas();

//sticky notes
let stickyNotes = [];
let selectedStickyNote = null;
let offsetX = 0;
let offsetY = 0;

document.getElementById('addStickyNoteBtn').addEventListener('click', function () {
  addStickyNote();
});

// Add a sticky note to the canvas
function addStickyNote() {
  const note = {
    id: Date.now(),
    x: 100, // Initial position
    y: 100,
    width: 150,
    height: 150,
    text: 'New Note',
    isEditing: false
  };
  stickyNotes.push(note);
  renderStickyNotes();
}

// Render all sticky notes on the canvas
function renderStickyNotes() {
  const canvas = document.getElementById('whiteboard');
  const ctx = canvas.getContext('2d');
  ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear the canvas
  stickyNotes.forEach(note => {
    ctx.fillStyle = '#FFD700'; 
    ctx.fillRect(note.x, note.y, note.width, note.height); 
    ctx.fillStyle = 'black';
    ctx.font = '16px Arial';
    wrapText(ctx, note.text, note.x + 10, note.y + 30, note.width - 20, note.height - 40);
  });
}

// Wrap text inside the sticky note box, ensuring it fits within the box boundaries
function wrapText(ctx, text, x, y, maxWidth, maxHeight) {
  const words = text.split(' ');
  let line = '';
  let lineHeight = 20; 
  let currentHeight = y;
  for (let i = 0; i < words.length; i++) {
    const testLine = line + words[i] + ' ';
    const testWidth = ctx.measureText(testLine).width;
    // If the line exceeds the maxWidth, draw the current line and start a new one
    if (testWidth > maxWidth && i > 0) {
      ctx.fillText(line, x, currentHeight);
      line = words[i] + ' ';
      currentHeight += lineHeight;
    } else {
      line = testLine;
    }
    // If the current height exceeds the max height, stop drawing more text
    if (currentHeight + lineHeight > y + maxHeight) {
      ctx.fillText('...', x, currentHeight); // Indicate that the text is truncated
      break;
    }
  }
  // Draw the last line of text if within bounds
  if (currentHeight + lineHeight <= y + maxHeight) {
    ctx.fillText(line, x, currentHeight);
  }
}
// Edit a sticky note
function editStickyNote(note) {
  const newText = prompt('Edit Sticky Note:', note.text);
  if (newText !== null) {
    note.text = newText;
    renderStickyNotes();
  }
}
// Delete a sticky note
function deleteStickyNote(note) {
  const index = stickyNotes.indexOf(note);
  if (index > -1) {
    stickyNotes.splice(index, 1);
    renderStickyNotes();
  }
}

// Event listeners for interacting with sticky notes
document.getElementById('whiteboard').addEventListener('mousedown', function (e) {
  const canvas = e.target;
  const rect = canvas.getBoundingClientRect();
  const x = e.clientX - rect.left;
  const y = e.clientY - rect.top;

  // Check if a sticky note is clicked
  for (let i = stickyNotes.length - 1; i >= 0; i--) {
    const note = stickyNotes[i];
    if (x >= note.x && x <= note.x + note.width && y >= note.y && y <= note.y + note.height) {
      selectedStickyNote = note;
      offsetX = x - note.x;
      offsetY = y - note.y;

      // If Ctrl key is pressed, delete the sticky note
      if (e.ctrlKey) {
        deleteStickyNote(note);
      } else {
        // If the sticky note is clicked, edit it
        if (!note.isEditing) {
          note.isEditing = true;
          editStickyNote(note);
        }
      }
      return;
    }
  }
});
// Move sticky note when dragging
document.getElementById('whiteboard').addEventListener('mousemove', function (e) {
  if (selectedStickyNote) {
    const canvas = e.target;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    selectedStickyNote.x = x - offsetX;
    selectedStickyNote.y = y - offsetY;
    renderStickyNotes();
  }
});

// Release selected sticky note when mouse button is released
document.getElementById('whiteboard').addEventListener('mouseup', function () {
  selectedStickyNote = null;
});

// Initial rendering
renderStickyNotes();

//clear functionality
const clearBtn = document.getElementById('clearBtn');
let isSelecting = false;
let selectedObject = null;

// Get references to the canvas and the thumbnail image
const thumbnailPreview = document.getElementById('thumbnailPreview');
// Function to capture the thumbnail
function captureThumbnail() {
  
  if (whiteboard) {
    const thumbnail = whiteboard.toDataURL('image/png'); 
    // Set the thumbnail as the source for the preview image
    thumbnailPreview.src = thumbnail;
    thumbnailPreview.style.display = 'block'; // Make sure the thumbnail is visible
  }
}

whiteboard.addEventListener('mouseup', captureThumbnail); 
whiteboard.addEventListener('touchend', captureThumbnail); 

// Function to clear the whiteboard
clearBtn.addEventListener('click', () => {
  const ctx = whiteboard.getContext('2d');
  ctx.clearRect(0, 0, whiteboard.width, whiteboard.height);  
});

//Backgroung Btn
const backgroundColorBtn = document.getElementById("backgroundColorBtn");

// Initialize the whiteboard canvas
const canvas = whiteboard;
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
// Function to change the background color
function changeBackgroundColor() {
    // Open a color picker dialog
    const colorPicker = document.createElement("input");
    colorPicker.type = "color";
    colorPicker.style.display = "none";
    document.body.appendChild(colorPicker);
    colorPicker.click();

    // Update the canvas background color when a color is selected
    colorPicker.addEventListener("input", (event) => {
        const selectedColor = event.target.value;
        ctx.fillStyle = selectedColor;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
    });

    // Clean up the color picker element
    colorPicker.addEventListener("change", () => {
        document.body.removeChild(colorPicker);
    });
}
backgroundColorBtn.addEventListener("click", changeBackgroundColor);

//Export functionality
document.getElementById("exportPdfBtn").addEventListener("click", function () {
  const canvas = document.getElementById("whiteboard");
  if (!canvas) {
    alert("Whiteboard canvas not found!");
    return;
  }
  // Convert canvas to an image
  const canvasData = canvas.toDataURL("image/png");
  // Initialize jsPDF
  const { jsPDF } = window.jspdf;
  const pdf = new jsPDF();
  // Get the canvas dimensions
  const canvasWidth = canvas.width;
  const canvasHeight = canvas.height;
  // Calculate PDF dimensions (A4 size: 210mm x 297mm)
  const pageWidth = pdf.internal.pageSize.getWidth();
  const pageHeight = (canvasHeight / canvasWidth) * pageWidth;
  // Add the image to the PDF
  pdf.addImage(canvasData, "PNG", 0, 0, pageWidth, pageHeight);
  // Prompt the user to download the PDF
  pdf.save("whiteboard.pdf");
});
// Selecting necessary elements
const lineWidthSlider = document.getElementById('lineWidth');
// Canvas and Context setup
canvas.width = canvas.offsetWidth;
canvas.height = canvas.offsetHeight;
// Default settings
let currentLineWidth = 2;
// Update line width based on slider value
lineWidthSlider.addEventListener('input', (e) => {
  currentLineWidth = e.target.value;
  ctx.lineWidth = currentLineWidth;
});

// Tool selection logic
function selectTool(toolName) {
  currentTool = toolName;
  switch (toolName) {
    case 'eraser':
      ctx.globalCompositeOperation = 'destination-out'; 
      break;
    default:
      ctx.globalCompositeOperation = 'source-over'; 
      break;
  }
  ctx.lineWidth = currentLineWidth; 
}

// Tool button event listeners
pencilBtn.addEventListener('click', () => selectTool('pencil'));
eraserBtn.addEventListener('click', () => selectTool('eraser'));
markerBtn.addEventListener('click', () => selectTool('marker'));
crayonBtn.addEventListener('click', () => selectTool('crayon'));
airbrushBtn.addEventListener('click', () => selectTool('airbrush'));
oilBrushBtn.addEventListener('click', () => selectTool('oilBrush'));
calligraphyBtn.addEventListener('click', () => selectTool('calligraphy'));
watercolorBtn.addEventListener('click', () => selectTool('watercolor'));

// Drawing functionality
let isDrawing = false;

let isFirstMove = true;
// Smooth drawing 
function drawLine(x, y) {
  if (isFirstMove) {
    ctx.moveTo(x, y);  
    isFirstMove = false;
  } else {
    ctx.lineTo(x, y);  
    ctx.stroke();
  }
}
// Drawing event listeners
canvas.addEventListener('mousedown', (e) => {
  isDrawing = true;
  const rect = canvas.getBoundingClientRect();
  lastX = e.clientX - rect.left;
  lastY = e.clientY - rect.top;
  ctx.beginPath();
  isFirstMove = true;  // Reset on mouse down
});

canvas.addEventListener('mousemove', (e) => {
  if (!isDrawing) return;

  const rect = canvas.getBoundingClientRect();
  const x = e.clientX - rect.left;
  const y = e.clientY - rect.top;

  drawLine(x, y);
});

canvas.addEventListener('mouseup', () => {
  isDrawing = false;
  lastX = 0;
  lastY = 0;
  isFirstMove = true;  
});

canvas.addEventListener('mouseout', () => {
  isDrawing = false;
  lastX = 0;
  lastY = 0;
  isFirstMove = true;  
});
// Resize event
window.addEventListener("resize", resizeCanvas);

});