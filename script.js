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

            // Inject active metrics to targeted block
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

    // 确保元素存在，防止页面加载报错
    if (!monthInput || !calcBtn || !rabbitCount) return;

    // 核心计算与更新逻辑
    function calculateRabbits() {
        const n = parseInt(monthInput.value, 10);
        
        // 输入合法性校验
        if (isNaN(n) || n < 1) {
            rabbitCount.innerText = "N/A";
            return;
        }

        // Binet公式中的关键常量
        const sqrt5 = Math.sqrt(5);
        const lambda1 = (1 + sqrt5) / 2; // 黄金分割比例 (约 1.618)
        const lambda2 = (1 - sqrt5) / 2; // (约 -0.618)

        // 核心公式: Rn = 1/√5 * (λ1^n - λ2^n)
        const result = (Math.pow(lambda1, n) - Math.pow(lambda2, n)) / sqrt5;

        // JS浮点运算会产生精度溢出 (如144.00000000000003)，必须使用 Math.round() 规整
        const finalCount = Math.round(result);

        // 更新UI，toLocaleString()可以自动给大数字加千分位逗号 (如 10,946)
        rabbitCount.innerText = finalCount.toLocaleString();
    }

    // 绑定点击事件
    calcBtn.addEventListener('click', calculateRabbits);

    // 锦上添花：允许用户在输入框内按 Enter 键触发计算
    monthInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            calculateRabbits();
        }
    });
}
// ==========================================
// 3. Level 1: Standard Eigenvalue Engine (SEP)
// ==========================================
function initLevel1Canvas() {
    const canvas = document.getElementById('sepCanvas');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    const statusVal = document.getElementById('sep-status');
    
    // 获取交互控件
    const inputX = document.getElementById('vec-x');
    const inputY = document.getElementById('vec-y');
    const transBtn = document.getElementById('trans-btn');
    const resetBtn = document.getElementById('reset-btn');

    // 坐标系物理参数
    const originX = canvas.width / 2;
    const originY = canvas.height / 2;
    const scale = 50; 

    // 核心数学配置：经典的斐波那契转移矩阵 A
    const matrixA = [
        [1, 1],
        [1, 0]
    ];

    // 系统动态状态变量
    let transformCount = 0; // 记录变换了多少次 (矩阵的幂次 n)
    
    // 当前空间的累计变换矩阵 (初始化为单位矩阵 Identity Matrix)
    let spaceMatrix = [
        [1, 0],
        [0, 1]
    ];

    // 矩阵乘法辅助函数: C = M1 * M2
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

    // 坐标转换：数学坐标 -> 屏幕像素坐标
    function toScreen(x, y) {
        return {
            sx: originX + x * scale,
            sy: originY - y * scale
        };
    }

    // 核心物理映射：应用当前的累计变换矩阵作用于任意点 (x, y)
    function transformPoint(x, y, matrix) {
        return {
            tx: matrix[0][0] * x + matrix[0][1] * y,
            ty: matrix[1][0] * x + matrix[1][1] * y
        };
    }

    // 绘制带箭头的向量
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

    // 核心渲染引擎
    function renderEngine() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // 1. 绘制静态背景参考网格 (淡灰色直角坐标网格)
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

        // 2. 绘制经 spaceMatrix 变形后的网格 (3B1B 风格的浅蓝色平行四边形网格)
        ctx.strokeStyle = 'rgba(49, 130, 206, 0.2)';
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        for (let i = -5; i <= 5; i++) {
            // 变形后的纵向网格线
            let t1 = transformPoint(i, -5, spaceMatrix); let t2 = transformPoint(i, 5, spaceMatrix);
            let s1 = toScreen(t1.tx, t1.ty); let s2 = toScreen(t2.tx, t2.ty);
            ctx.moveTo(s1.sx, s1.sy); ctx.lineTo(s2.sx, s2.sy);

            // 变形后的横向网格线
            let t3 = transformPoint(-5, i, spaceMatrix); let t4 = transformPoint(5, i, spaceMatrix);
            let s3 = toScreen(t3.tx, t3.ty); let s4 = toScreen(t4.tx, t4.ty);
            ctx.moveTo(s3.sx, s3.sy); ctx.lineTo(s4.sx, s4.sy);
        }
        ctx.stroke();

        // 3. 绘制基础坐标轴线
        drawArrow(-5, 0, 5, 0, 'rgba(74, 85, 104, 0.3)', 1.5);
        drawArrow(0, -5, 0, 5, 'rgba(74, 85, 104, 0.3)', 1.5);

        // 4. 获取用户输入的初始向量 v0
        const v0_x = parseFloat(inputX.value) || 0;
        const v0_y = parseFloat(inputY.value) || 0;

        // 5. 计算经过当前累计矩阵变形后的向量 v_current = spaceMatrix * v0
        const vCurr = transformPoint(v0_x, v0_y, spaceMatrix);

        // 6. 核心逻辑检测：检查用户输入的 v0 是否正好处在特征向量（黄金分割线）上
        // 利用初始矩阵 A 与 v0 的叉乘检测共线：cross = x * (A*y) - y * (A*x)
        const vNext_from_A = {
            x: matrixA[0][0] * v0_x + matrixA[0][1] * v0_y,
            y: matrixA[1][0] * v0_x + matrixA[1][1] * v0_y
        };
        const crossProduct = v0_x * vNext_from_A.y - v0_y * vNext_from_A.x;
        const vLen = Math.sqrt(v0_x**2 + v0_y**2);

        // 状态信息面板更新
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

        // 7. 绘制被空间矩阵同步扭曲后的向量（显示为亮蓝色）
        if (vLen > 0.01) {
            drawArrow(0, 0, vCurr.tx, vCurr.ty, '#3182ce', 3.5);
            
            // 在向量末端画一个醒目的小几何圆点
            const tip = toScreen(vCurr.tx, vCurr.ty);
            ctx.beginPath();
            ctx.arc(tip.sx, tip.sy, 5, 0, Math.PI * 2);
            ctx.fillStyle = '#3182ce';
            ctx.fill();
        }
    }

    // --- 按钮交互事件响应监听 ---

    // 变换按钮点击：让当前的整个空间矩阵乘以矩阵 A
    transBtn.addEventListener('click', () => {
        spaceMatrix = multiplyMatrices(matrixA, spaceMatrix);
        transformCount++;
        renderEngine();
    });

    // 还原按钮点击：将矩阵恢复为单位矩阵，次数归零，并重置输入
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

    // 当用户手动修改输入框的数字时，画布实时刷新
    inputX.addEventListener('input', renderEngine);
    inputY.addEventListener('input', renderEngine);

    // 首次运行，初始化执行绘图
    renderEngine();
}

// ==========================================
// 4. Level 2: Nonlinear Eigenvalue Engine (NEPv) & SCF Tracker
// ==========================================
function initLevel2Canvas() {
    const canvas = document.getElementById('nepvCanvas');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    
    // UI 控制元素
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

    // 画布坐标系物理参数
    const scale = 300; 
    const originX = 60;  
    const originY = canvas.height - 40;

    // SCF 系统状态
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

    // 核心物理引擎
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

        // --- 画背景与坐标轴 ---
        drawArrow(-0.1, 0, 1.2, 0, 'rgba(74, 85, 104, 0.3)', 2); // X轴
        drawArrow(0, -0.1, 0, 1.2, 'rgba(74, 85, 104, 0.3)', 2); // Y轴
        
        ctx.fillStyle = "#718096"; // 文字也改成深灰色
        ctx.font = "12px monospace";
        ctx.fillText("x (Adult Ratio)", toScreen(1.05, -0.1).sx, originY + 15);
        ctx.fillText("y (Youth Ratio)", originX - 45, toScreen(0, 1.1).sy);

        // 画 x+y=1 的约束虚线
        ctx.beginPath();
        ctx.setLineDash([5, 5]);
        const pStart = toScreen(1, 0); const pEnd = toScreen(0, 1);
        ctx.moveTo(pStart.sx, pStart.sy); ctx.lineTo(pEnd.sx, pEnd.sy);
        ctx.strokeStyle = 'rgba(74, 85, 104, 0.5)'; // 虚线改成深灰色
        ctx.lineWidth = 2;
        ctx.stroke();
        ctx.setLineDash([]);

        // 计算当前系统
        const sys = computeSystem(v_input.x);

        // 更新 UI 数据面板
        elVx.innerText = v_input.x.toFixed(3);
        elVy.innerText = v_input.y.toFixed(3);
        elHVal.innerText = sys.h_val.toFixed(3);
        elUx.innerText = sys.ux.toFixed(3);
        elUy.innerText = sys.uy.toFixed(3);
        elLambda.innerText = sys.lambda.toFixed(3);

        // 绘制红色输出向量（目标 Eigenvector）
        drawArrow(0, 0, sys.ux, sys.uy, '#e53e3e', 3);
        
        // 绘制蓝色输入向量
        drawArrow(0, 0, v_input.x, v_input.y, '#3182ce', 4);

        // 画把手
        const handle = toScreen(v_input.x, v_input.y);
        ctx.beginPath();
        ctx.arc(handle.sx, handle.sy, 8, 0, Math.PI * 2);
        ctx.fillStyle = '#ffffff';
        ctx.strokeStyle = '#3182ce';
        ctx.lineWidth = 3;
        ctx.fill();
        ctx.stroke();

        return sys; // 返回系统数据供日志使用
    }

    // --- 日志系统 ---
    function addLogEntry(sys) {
        if (logPlaceholder) logPlaceholder.style.display = 'none';
        
        // 检测是否收敛 (输入和输出的误差极小)
        const error = Math.abs(v_input.x - sys.ux);
        const isConverged = error < 0.001;

        const logRow = document.createElement('div');
        logRow.style.display = 'flex';
        logRow.style.borderBottom = '1px solid #e2e8f0';
        logRow.style.padding = '6px 0';
        if (isConverged) logRow.style.backgroundColor = '#e6fffa'; // 收敛时给一个绿色高亮背景

        logRow.innerHTML = `
            <span style="width: 35px; font-weight: bold; color: var(--text-primary);">#${scfStepCount}</span>
            <span style="flex: 1; color: #3182ce;">in:[${v_input.x.toFixed(3)}, ${v_input.y.toFixed(3)}]</span>
            <span style="flex: 1; color: #dd6b20;">H₁₂:${sys.h_val.toFixed(3)}</span>
            <span style="flex: 1; color: #38a169; font-weight:bold;">λ:${sys.lambda.toFixed(3)}</span>
            <span style="flex: 1; color: #e53e3e;">out:[${sys.ux.toFixed(3)}, ${sys.uy.toFixed(3)}]</span>
        `;
        
        logContainer.appendChild(logRow);
        
        // 如果收敛，追加一条成功信息
        if (isConverged) {
            const successRow = document.createElement('div');
            successRow.style.padding = '8px 0';
            successRow.style.color = '#38a169';
            successRow.style.fontWeight = 'bold';
            successRow.style.textAlign = 'center';
            successRow.innerText = "✨ SCF Converged! Self-Consistency Achieved. ✨";
            logContainer.appendChild(successRow);
        }

        // 自动滚动到最新的一行
        logContainer.scrollTop = logContainer.scrollHeight;
    }

    // --- 按钮与交互事件 ---
    
    // SCF 单步迭代按钮
    stepBtn.addEventListener('click', () => {
        scfStepCount++;
        const currentSys = renderEngine(); // 获取当前状态
        addLogEntry(currentSys); // 写日志
        
        // 【核心动作】让蓝色向量跳到红色向量的位置，成为下一步的输入！
        v_input.x = currentSys.ux;
        v_input.y = currentSys.uy;
        
        renderEngine(); // 画出跳变后的新状态
    });

    // 重置按钮
    resetBtn.addEventListener('click', () => {
        v_input = { x: 0.5, y: 0.5 };
        scfStepCount = 0;
        logContainer.innerHTML = ''; // 清空日志
        if (logPlaceholder) logContainer.appendChild(logPlaceholder);
        logPlaceholder.style.display = 'block';
        renderEngine();
    });

    // 鼠标拖拽实时预览 (手动打破收敛)
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

    // Alpha 滑块改变
    alphaSlider.addEventListener('input', (e) => {
        alphaDisplay.innerText = parseFloat(e.target.value).toFixed(1);
        renderEngine();
    });

    renderEngine();
}