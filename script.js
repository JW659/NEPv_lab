// JavaScript Logic Setup - Navigation Control Hub and Level 1 Canvas Engine

document.addEventListener("DOMContentLoaded", () => {
    initNavigation();
    initLevel1Canvas();
    initLevel2Canvas();
    initBinetCalculator();
});

// ==========================================
// 1. Sidebar tab switching engine
// ==========================================
function initNavigation() {
    const navItems = document.querySelectorAll(".nav-item");
    const pageSections = document.querySelectorAll(".page-section");

    navItems.forEach(item => {
        item.addEventListener("click", () => {
            // Remove active tags everywhere
            navItems.forEach(nav => nav.classList.remove("active"));
            pageSections.forEach(page => page.classList.remove("active"));

            item.classList.add("active");
            const targetPageId = item.getAttribute("data-target");
            document.getElementById(targetPageId).classList.add("active");
        });
    });
}


// ==========================================
// 2. Level 1: Analytical Binet's Formula Calculator
// ==========================================
function initBinetCalculator() {
    const monthInput = document.getElementById('month-input');
    const calcBtn = document.getElementById('calc-btn');
    const rabbitCount = document.getElementById('rabbit-count');

    if (!monthInput || !calcBtn || !rabbitCount) return;

    function calculateRabbits() {
        const n = parseInt(monthInput.value, 10);
        
        // input check
        if (isNaN(n) || n < 1) {
            rabbitCount.innerText = "N/A";
            return;
        }

        // Binet equation
        const sqrt5 = Math.sqrt(5);
        const lambda1 = (1 + sqrt5) / 2; // 黄金分割比例 (约 1.618)
        const lambda2 = (1 - sqrt5) / 2; // (约 -0.618)

        const result = (Math.pow(lambda1, n) - Math.pow(lambda2, n)) / sqrt5;

        // rounding and display
        const finalCount = Math.round(result);

        rabbitCount.innerText = finalCount.toLocaleString();
    }

    // click event 
    calcBtn.addEventListener('click', calculateRabbits);
}

// ==========================================
// 3. Level 1: Standard Eigenvalue Engine (SEP)
// ==========================================
function initLevel1Canvas() {
    const canvas = document.getElementById('sepCanvas');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    const statusVal = document.getElementById('sep-status');
    
    // Interactions
    const inputX = document.getElementById('vec-x');
    const inputY = document.getElementById('vec-y');
    const transBtn = document.getElementById('trans-btn');
    const resetBtn = document.getElementById('reset-btn');

    // Coordinates setup
    const originX = canvas.width / 2;
    const originY = canvas.height / 2;
    const scale = 50; 

    // core matrix
    const matrixA = [
        [1, 1],
        [1, 0]
    ];

    // number of transistions
    let transformCount = 0; 
    
    // matrix after (several) transformation
    let spaceMatrix = [
        [1, 0],
        [0, 1]
    ];

    // Matrix multiplication function
    function multiplyMatrices(m1, m2) {
        return [
            [
                m1[0][0] * m2[0][0] + m1[0][1] * m2[1][0],
                m1[0][0] * m2[0][1] + m1[0][1] * m2[1][1]
            ],
            [
                m1[1][0] * m2[0][0] + m1[1][1] * m2[1][0],
                m1[1][0] * m2[0][1] + m1[1][1] * m2[1][1]
            ]
        ];
    }

    // coordinates shift
    function toScreen(x, y) {
        return {
            sx: originX + x * scale,
            sy: originY - y * scale
        };
    }

    // mapping of vector space
    function transformPoint(x, y, matrix) {
        return {
            tx: matrix[0][0] * x + matrix[0][1] * y,
            ty: matrix[1][0] * x + matrix[1][1] * y
        };
    }

    // vector drawing
    function drawArrow(fromX, fromY, toX, toY, color, width) {
        const p0 = toScreen(fromX, fromY);
        const p1 = toScreen(toX, toY);
        const headLen = 12;
        const angle = Math.atan2(p1.sy - p0.sy, p1.sx - p0.sx);

        ctx.beginPath();
        ctx.moveTo(p0.sx, p0.sy);
        ctx.lineTo(p1.sx, p1.sy);
        ctx.lineTo(p1.sx - headLen * Math.cos(angle - Math.PI / 6), p1.sy - headLen * Math.sin(angle - Math.PI / 6));
        ctx.moveTo(p1.sx, p1.sy);
        ctx.lineTo(p1.sx - headLen * Math.cos(angle + Math.PI / 6), p1.sy - headLen * Math.sin(angle + Math.PI / 6));
        ctx.strokeStyle = color;
        ctx.lineWidth = width;
        ctx.stroke();
    }

    // rendor
    function renderEngine() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // 1.static coordinates 
        ctx.strokeStyle = '#e2e8f0';
        ctx.lineWidth = 1;
        ctx.beginPath();
        for (let i = -5; i <= 5; i++) {
            let vStart = toScreen(i, -5); let vEnd = toScreen(i, 5);
            ctx.moveTo(vStart.sx, vStart.sy); ctx.lineTo(vEnd.sx, vEnd.sy);
            
            let hStart = toScreen(-5, i); let hEnd = toScreen(5, i);
            ctx.moveTo(hStart.sx, hStart.sy); ctx.lineTo(hEnd.sx, hEnd.sy);
        }
        ctx.stroke();

        // 2. transformed coordinates
        ctx.strokeStyle = 'rgba(49, 130, 206, 0.2)';
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        for (let i = -5; i <= 5; i++) {
            // vertical lines
            let t1 = transformPoint(i, -5, spaceMatrix); let t2 = transformPoint(i, 5, spaceMatrix);
            let s1 = toScreen(t1.tx, t1.ty); let s2 = toScreen(t2.tx, t2.ty);
            ctx.moveTo(s1.sx, s1.sy); ctx.lineTo(s2.sx, s2.sy);

            // horizontal lines
            let t3 = transformPoint(-5, i, spaceMatrix); let t4 = transformPoint(5, i, spaceMatrix);
            let s3 = toScreen(t3.tx, t3.ty); let s4 = toScreen(t4.tx, t4.ty);
            ctx.moveTo(s3.sx, s3.sy); ctx.lineTo(s4.sx, s4.sy);
        }
        ctx.stroke();

        // 3. axis drawing
        drawArrow(-5, 0, 5, 0, 'rgba(74, 85, 104, 0.3)', 1.5);
        drawArrow(0, -5, 0, 5, 'rgba(74, 85, 104, 0.3)', 1.5);

        // 4.gain initial v0 input
        const v0_x = parseFloat(inputX.value) || 0;
        const v0_y = parseFloat(inputY.value) || 0;

        // 5. calculate v_current = spaceMatrix * v0
        const vCurr = transformPoint(v0_x, v0_y, spaceMatrix);

        // 6.Test whether v0 is near eigenvector 
        // cross = x * (A*y) - y * (A*x)
        const vNext_from_A = {
            x: matrixA[0][0] * v0_x + matrixA[0][1] * v0_y,
            y: matrixA[1][0] * v0_x + matrixA[1][1] * v0_y
        };
        const crossProduct = v0_x * vNext_from_A.y - v0_y * vNext_from_A.x;
        const vLen = Math.sqrt(v0_x**2 + v0_y**2);

        // update information
        if (transformCount === 0) {
            if (vLen > 0.1 && Math.abs(crossProduct) < 0.05) {
                statusVal.innerText = "✨ Invariant Trajectory! v0 is an Eigenvector.";
                statusVal.className = "status-value success";
            } else {
                statusVal.innerText = "Space is Uniform (n = 0). Click Transform!";
                statusVal.className = "status-value searching";
            }
        } else {
            if (vLen > 0.1 && Math.abs(crossProduct) < 0.05) {
                statusVal.innerText = `Powered Scaling (A^${transformCount})`;
                statusVal.className = "status-value success";
            } else {
                statusVal.innerText = `Transformed Space Matrix to A^${transformCount}. Vector rotated.`;
                statusVal.className = "status-value searching";
            }
        }

        // 7. draw the remapped blue vector
        if (vLen > 0.01) {
            drawArrow(0, 0, vCurr.tx, vCurr.ty, '#3182ce', 3.5);
            
            // dot at the end of the blue vector
            const tip = toScreen(vCurr.tx, vCurr.ty);
            ctx.beginPath();
            ctx.arc(tip.sx, tip.sy, 5, 0, Math.PI * 2);
            ctx.fillStyle = '#3182ce';
            ctx.fill();
        }
    }

    // interactions

    // transform
    transBtn.addEventListener('click', () => {
        spaceMatrix = multiplyMatrices(matrixA, spaceMatrix);
        transformCount++;
        renderEngine();
    });

    // reset
    resetBtn.addEventListener('click', () => {
        spaceMatrix = [
            [1, 0],
            [0, 1]
        ];
        transformCount = 0;
        inputX.value = "1.0";
        inputY.value = "1.0";
        renderEngine();
    });

    // input vector
    inputX.addEventListener('input', renderEngine);
    inputY.addEventListener('input', renderEngine);

    renderEngine();
}

// ==========================================
// 4. Level 2: Nonlinear Eigenvalue Engine (NEPv) & SCF Tracker
// ==========================================
function initLevel2Canvas() {
    const canvas = document.getElementById('nepvCanvas');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    
    // UI
    const elVx = document.getElementById('dyn-vx');
    const elVy = document.getElementById('dyn-vy');
    const elHVal = document.getElementById('dyn-h-val');
    const elUx = document.getElementById('dyn-ux');
    const elUy = document.getElementById('dyn-uy');
    const elLambda = document.getElementById('dyn-lambda');
    
    const alphaSlider = document.getElementById('alpha-slider');
    const alphaDisplay = document.getElementById('alpha-display');
    const stepBtn = document.getElementById('step-scf-btn');
    const resetBtn = document.getElementById('reset-scf-btn');
    const logContainer = document.getElementById('scf-log-container');
    const logPlaceholder = document.getElementById('scf-log-placeholder');

    // coordinates
    const scale = 300; 
    const originX = 60;  
    const originY = canvas.height - 40;

    // SCF 
    let v_input = { x: 0.5, y: 0.5 };
    let scfStepCount = 0;
    let isDragging = false;

    function toScreen(x, y) {
        return { sx: originX + x * scale, sy: originY - y * scale };
    }

    function drawArrow(fromX, fromY, toX, toY, color, width) {
        const p0 = toScreen(fromX, fromY);
        const p1 = toScreen(toX, toY);
        const headLen = 10;
        const angle = Math.atan2(p1.sy - p0.sy, p1.sx - p0.sx);

        ctx.beginPath();
        ctx.moveTo(p0.sx, p0.sy);
        ctx.lineTo(p1.sx, p1.sy);
        ctx.lineTo(p1.sx - headLen * Math.cos(angle - Math.PI / 6), p1.sy - headLen * Math.sin(angle - Math.PI / 6));
        ctx.moveTo(p1.sx, p1.sy);
        ctx.lineTo(p1.sx - headLen * Math.cos(angle + Math.PI / 6), p1.sy - headLen * Math.sin(angle + Math.PI / 6));
        ctx.strokeStyle = color;
        ctx.lineWidth = width;
        ctx.stroke();
    }

    // Core engine
    function computeSystem(x) {
        const alpha = parseFloat(alphaSlider.value) || 5.0; 
        const h_val = 1.5 * Math.exp(-alpha * x);
        const lambda = (0.8 + Math.sqrt(0.64 + 4 * h_val)) / 2;
        const uy = 1 / (lambda + 1);
        const ux = lambda / (lambda + 1);
        return { h_val, lambda, ux, uy };
    }

    function renderEngine() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // background and axis
        drawArrow(-0.1, 0, 1.2, 0, 'rgba(74, 85, 104, 0.3)', 2); // X
        drawArrow(0, -0.1, 0, 1.2, 'rgba(74, 85, 104, 0.3)', 2); // Y
        
        ctx.fillStyle = "#718096"; 
        ctx.font = "12px monospace";
        ctx.fillText("x (Adult Ratio)", toScreen(1.05, -0.1).sx, originY + 15);
        ctx.fillText("y (Youth Ratio)", originX - 45, toScreen(0, 1.1).sy);

        // draw x+y=1 constraint line
        ctx.beginPath();
        ctx.setLineDash([5, 5]);
        const pStart = toScreen(1, 0); const pEnd = toScreen(0, 1);
        ctx.moveTo(pStart.sx, pStart.sy); ctx.lineTo(pEnd.sx, pEnd.sy);
        ctx.strokeStyle = 'rgba(74, 85, 104, 0.5)'; // 虚线改成深灰色
        ctx.lineWidth = 2;
        ctx.stroke();
        ctx.setLineDash([]);

        // compute current system
        const sys = computeSystem(v_input.x);

        // update UI
        elVx.innerText = v_input.x.toFixed(3);
        elVy.innerText = v_input.y.toFixed(3);
        elHVal.innerText = sys.h_val.toFixed(3);
        elUx.innerText = sys.ux.toFixed(3);
        elUy.innerText = sys.uy.toFixed(3);
        elLambda.innerText = sys.lambda.toFixed(3);

        // draw V1 red vector
        drawArrow(0, 0, sys.ux, sys.uy, '#e53e3e', 3);
        
        // draw input V0 blue vector
        drawArrow(0, 0, v_input.x, v_input.y, '#3182ce', 4);

        // draw handle
        const handle = toScreen(v_input.x, v_input.y);
        ctx.beginPath();
        ctx.arc(handle.sx, handle.sy, 8, 0, Math.PI * 2);
        ctx.fillStyle = '#ffffff';
        ctx.strokeStyle = '#3182ce';
        ctx.lineWidth = 3;
        ctx.fill();
        ctx.stroke();

        return sys; 
    }

    function addLogEntry(sys) {
        if (logPlaceholder) logPlaceholder.style.display = 'none';
        
        // test convergence
        const error = Math.abs(v_input.x - sys.ux);
        const isConverged = error < 0.001;

        const logRow = document.createElement('div');
        logRow.style.display = 'flex';
        logRow.style.borderBottom = '1px solid #e2e8f0';
        logRow.style.padding = '6px 0';
        if (isConverged) logRow.style.backgroundColor = '#e6fffa'; // background lightens

        logRow.innerHTML = `
            <span style="width: 35px; font-weight: bold; color: var(--text-primary);">#${scfStepCount}</span>
            <span style="flex: 1; color: #3182ce;">in:[${v_input.x.toFixed(3)}, ${v_input.y.toFixed(3)}]</span>
            <span style="flex: 1; color: #dd6b20;">H₁₂:${sys.h_val.toFixed(3)}</span>
            <span style="flex: 1; color: #38a169; font-weight:bold;">λ:${sys.lambda.toFixed(3)}</span>
            <span style="flex: 1; color: #e53e3e;">out:[${sys.ux.toFixed(3)}, ${sys.uy.toFixed(3)}]</span>
        `;
        
        logContainer.appendChild(logRow);
        
        // if converged message
        if (isConverged) {
            const successRow = document.createElement('div');
            successRow.style.padding = '8px 0';
            successRow.style.color = '#38a169';
            successRow.style.fontWeight = 'bold';
            successRow.style.textAlign = 'center';
            successRow.innerText = "✨ SCF Converged! Self-Consistency Achieved. ✨";
            logContainer.appendChild(successRow);
        }

  
        logContainer.scrollTop = logContainer.scrollHeight;
    }

    // interactions
    
    // SCF step
    stepBtn.addEventListener('click', () => {
        scfStepCount++;
        const currentSys = renderEngine(); 
        addLogEntry(currentSys); 
        
        // output to input
        v_input.x = currentSys.ux;
        v_input.y = currentSys.uy;
        
        renderEngine(); 
    });

    // reset
    resetBtn.addEventListener('click', () => {
        v_input = { x: 0.5, y: 0.5 };
        scfStepCount = 0;
        logContainer.innerHTML = ''; 
        if (logPlaceholder) logContainer.appendChild(logPlaceholder);
        logPlaceholder.style.display = 'block';
        renderEngine();
    });

    // mouse drag
    canvas.addEventListener('mousedown', () => isDragging = true);
    canvas.addEventListener('mousemove', (e) => {
        if (!isDragging) return;
        const rect = canvas.getBoundingClientRect();
        const mX = e.clientX - rect.left; const mY = e.clientY - rect.top;
        const mathX = (mX - originX) / scale; const mathY = (originY - mY) / scale;
        
        let projectedX = (mathX - mathY + 1) / 2;
        v_input.x = Math.max(0, Math.min(1, projectedX));
        v_input.y = 1 - v_input.x; 
        
        renderEngine();
    });
    window.addEventListener('mouseup', () => isDragging = false);

    // Alpha block
    alphaSlider.addEventListener('input', (e) => {
        alphaDisplay.innerText = parseFloat(e.target.value).toFixed(1);
        renderEngine();
    });

    renderEngine();
}