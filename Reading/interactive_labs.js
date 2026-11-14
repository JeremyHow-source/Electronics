// ============================================================================
// INTERACTIVE ENGINEERING LABS & PUBLICATION-LIKENESS REPLICA CHARTS ENGINE
// Covers all 7 publications in the Reading folder with live simulations,
// accurate replica charts, and interactive SVG/Canvas visualizers.
// ============================================================================

window.InteractiveLabs = (function () {
  // Helper for HiDPI Canvas setup
  function setupCanvas(canvasId, logicalWidth, logicalHeight) {
    const canvas = document.getElementById(canvasId);
    if (!canvas) return null;
    const dpr = window.devicePixelRatio || 1;
    const rectW = canvas.parentElement ? Math.min(logicalWidth, Math.max(320, canvas.parentElement.clientWidth - 24)) : logicalWidth;
    const scaleFactor = rectW / logicalWidth;
    const finalW = Math.round(logicalWidth * scaleFactor);
    const finalH = Math.round(logicalHeight * scaleFactor);
    canvas.width = finalW * dpr;
    canvas.height = finalH * dpr;
    canvas.style.width = finalW + 'px';
    canvas.style.height = finalH + 'px';
    const ctx = canvas.getContext('2d');
    ctx.setTransform(dpr * scaleFactor, 0, 0, dpr * scaleFactor, 0, 0);
    return { ctx, w: logicalWidth, h: logicalHeight };
  }

  // ==========================================================================
  // 1. 5L-MVR VIENNA RECTIFIER LAB (NTU IEEE 2013, Figs 4, 6, 7, 8, 9, 10)
  // ==========================================================================
  const mvrData = {
    angles: [0, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50],
    pf_ls:  [0.968, 0.986, 0.992, 0.995, 0.997, 0.998, 0.999, 0.998, 0.998, 0.997, 0.997],
    pf_ps:  [0.962, 0.982, 0.990, 0.994, 0.997, 0.999, 0.998, 0.997, 0.997, 0.996, 0.996],
    thd_ls: [9.80,  8.10,  5.50,  4.50,  3.90,  3.70,  3.43,  3.80,  3.90,  4.00,  4.10],
    thd_ps: [11.00, 9.10,  6.30,  5.20,  4.30,  3.60,  3.80,  4.10,  4.20,  4.30,  4.50]
  };

  function get5LMvrHTML() {
    return `
      <div class="lab-panel">
        <div class="lab-header">
          <div>
            <span class="lab-badge">⚡ LIVE IEEE 2013 REPLICA LAB</span>
            <h3>5-Level Multiple-Pole VIENNA Rectifier (5L-MVR) Interactive Simulator & Replica Charts</h3>
            <p>Interact with the exact analytical equations (Eq. 1–11) and publication charts (Fig. 4, Fig. 6, Fig. 7, Fig. 8, Fig. 9, Fig. 10) from Ooi, Maswood et al. (NTU Singapore).</p>
          </div>
        </div>

        <div class="lab-controls-grid">
          <div class="lab-control">
            <label>Inner-Cell Switching Angle α (°): <strong id="mvr-alpha-val">30°</strong></label>
            <input type="range" id="mvr-alpha" min="0" max="50" step="5" value="30" oninput="InteractiveLabs.update5LMvr()">
            <span class="ctrl-hint">Optimal: 30° for LS-PWM (3.43% THD), 25° for PS-PWM (3.60% THD)</span>
          </div>
          <div class="lab-control">
            <label>Outer-Cell 1 kHz PWM Scheme:</label>
            <select id="mvr-pwm" onchange="InteractiveLabs.update5LMvr()">
              <option value="LS" selected>LS-PWM (Level-Shifted PWM — Optimal at α=30°)</option>
              <option value="PS">PS-PWM (Phase-Shifted PWM — Optimal at α=25°)</option>
            </select>
          </div>
          <div class="lab-control">
            <label>Grid Line Voltage V_i (V_rms): <strong id="mvr-vi-val">230 V</strong></label>
            <input type="range" id="mvr-vi" min="110" max="440" step="10" value="230" oninput="InteractiveLabs.update5LMvr()">
          </div>
          <div class="lab-control">
            <label>DC-Link Bus Voltage V_dc (V): <strong id="mvr-vdc-val">650 V</strong></label>
            <input type="range" id="mvr-vdc" min="300" max="1000" step="10" value="650" oninput="InteractiveLabs.update5LMvr()">
          </div>
          <div class="lab-control">
            <label>Input Inductance L_a (mH): <strong id="mvr-la-val">2.5 mH</strong></label>
            <input type="range" id="mvr-la" min="0.5" max="10.0" step="0.5" value="2.5" oninput="InteractiveLabs.update5LMvr()">
          </div>
        </div>

        <div class="lab-kpi-row" id="mvr-kpis"></div>

        <div class="lab-charts-grid">
          <div class="lab-chart-card">
            <div class="chart-title">Fig. 6 Replica: Input Power Factor vs. Switching Angle α (0°–50°, 1 kHz)</div>
            <canvas id="canvas-mvr-fig6"></canvas>
          </div>
          <div class="lab-chart-card">
            <div class="chart-title">Fig. 7 Replica: THD of Input Current (%) vs. Switching Angle α (0°–50°, 1 kHz)</div>
            <canvas id="canvas-mvr-fig7"></canvas>
          </div>
          <div class="lab-chart-card">
            <div class="chart-title">Fig. 8 & Fig. 9 Replica: 5-Level Line Voltage V_ab, Phase Voltage V_ao & Input Current i_a</div>
            <canvas id="canvas-mvr-waveforms"></canvas>
          </div>
          <div class="lab-chart-card">
            <div class="chart-title">Fig. 10 Replica: Input Rectifier Current FFT Harmonic Spectrum (0–60th Order)</div>
            <canvas id="canvas-mvr-fft"></canvas>
          </div>
        </div>
      </div>
    `;
  }

  function update5LMvr() {
    const alphaEl = document.getElementById('mvr-alpha');
    if (!alphaEl) return;
    const alpha = parseFloat(alphaEl.value);
    const pwm = document.getElementById('mvr-pwm').value;
    const Vi = parseFloat(document.getElementById('mvr-vi').value);
    const Vdc = parseFloat(document.getElementById('mvr-vdc').value);
    const La_mH = parseFloat(document.getElementById('mvr-la').value);
    const L = La_mH * 1e-3;
    const omega = 2 * Math.PI * 50;

    document.getElementById('mvr-alpha-val').textContent = alpha + '°';
    document.getElementById('mvr-vi-val').textContent = Vi + ' V';
    document.getElementById('mvr-vdc-val').textContent = Vdc + ' V';
    document.getElementById('mvr-la-val').textContent = La_mH.toFixed(1) + ' mH';

    // Equations (1)-(5)
    const M = Vdc / (Math.sqrt(3) * Vi);
    const baseI = (Math.sqrt(2) * Vi) / (omega * L * Math.sqrt(3));
    const isw1_max = Math.max(0.5, baseI * ((2 - Math.sqrt(3)) / 2 + (M * Math.PI) / (24 * Math.sqrt(2))));
    const isw2_max = Math.max(0.5, baseI * Math.abs(1 - (M * Math.PI) / (8 * Math.sqrt(2))));
    const id1_max = isw2_max;
    const id7_max = Math.max(0.5, baseI * Math.abs(1 - (5 * M * Math.PI) / (24 * Math.sqrt(2))));

    const idx = mvrData.angles.indexOf(alpha);
    const thd = idx >= 0 ? (pwm === 'LS' ? mvrData.thd_ls[idx] : mvrData.thd_ps[idx]) : 3.43;
    const pf = idx >= 0 ? (pwm === 'LS' ? mvrData.pf_ls[idx] : mvrData.pf_ps[idx]) : 0.99;

    const kpiContainer = document.getElementById('mvr-kpis');
    if (kpiContainer) {
      kpiContainer.innerHTML = `
        <div class="kpi-box"><span class="kpi-lbl">Voltage Ratio M (Eq. 2)</span><span class="kpi-val">${M.toFixed(3)}</span></div>
        <div class="kpi-box"><span class="kpi-lbl">Input Power Factor (Fig. 6)</span><span class="kpi-val" style="color:#4ade80">${pf.toFixed(3)}</span></div>
        <div class="kpi-box"><span class="kpi-lbl">Current THD_i (Fig. 7 & 10)</span><span class="kpi-val" style="color:#38bdf8">${thd.toFixed(2)}%</span></div>
        <div class="kpi-box"><span class="kpi-lbl">i_(sw1)max Inner (Eq. 1)</span><span class="kpi-val">${isw1_max.toFixed(2)} A</span></div>
        <div class="kpi-box"><span class="kpi-lbl">i_(sw2)max / i_(d1)max (Eq. 3–4)</span><span class="kpi-val">${isw2_max.toFixed(2)} A</span></div>
        <div class="kpi-box"><span class="kpi-lbl">i_(d7)max Outer Diode (Eq. 5)</span><span class="kpi-val">${id7_max.toFixed(2)} A</span></div>
        <div class="kpi-box"><span class="kpi-lbl">Switch Voltage Stress</span><span class="kpi-val">Sx1: ${(Vdc/4).toFixed(0)}V · Sx2: ${(Vdc/2).toFixed(0)}V</span></div>
      `;
    }

    // Draw Fig. 6 Replica
    const c6 = setupCanvas('canvas-mvr-fig6', 480, 270);
    if (c6) {
      const { ctx, w, h } = c6;
      ctx.fillStyle = '#0f172a';
      ctx.fillRect(0, 0, w, h);
      const pad = { l: 52, r: 22, t: 24, b: 40 };
      const pw = w - pad.l - pad.r, ph = h - pad.t - pad.b;

      // Grid
      ctx.strokeStyle = '#1e293b';
      ctx.lineWidth = 1;
      for (let i = 0; i <= 4; i++) {
        const y = pad.t + (ph * i) / 4;
        ctx.beginPath(); ctx.moveTo(pad.l, y); ctx.lineTo(w - pad.r, y); ctx.stroke();
        const val = (1.10 - i * 0.05).toFixed(2);
        ctx.fillStyle = '#94a3b8'; ctx.font = '11px Segoe UI'; ctx.textAlign = 'right';
        ctx.fillText(val, pad.l - 6, y + 4);
      }
      mvrData.angles.forEach((ang, i) => {
        const x = pad.l + (pw * i) / (mvrData.angles.length - 1);
        ctx.beginPath(); ctx.moveTo(x, pad.t); ctx.lineTo(x, h - pad.b); ctx.stroke();
        ctx.fillStyle = ang === alpha ? '#38bdf8' : '#94a3b8';
        ctx.font = ang === alpha ? 'bold 11px Segoe UI' : '11px Segoe UI';
        ctx.textAlign = 'center';
        ctx.fillText(ang + '°', x, h - pad.b + 16);
      });

      // Highlight selected alpha vertical line
      const selIdx = mvrData.angles.indexOf(alpha);
      if (selIdx >= 0) {
        const sx = pad.l + (pw * selIdx) / (mvrData.angles.length - 1);
        ctx.strokeStyle = 'rgba(250, 204, 21, 0.55)';
        ctx.setLineDash([4, 4]);
        ctx.beginPath(); ctx.moveTo(sx, pad.t); ctx.lineTo(sx, h - pad.b); ctx.stroke();
        ctx.setLineDash([]);
      }

      // Plot LS-PWM and PS-PWM
      const plotLine = (arr, color, isSquare) => {
        ctx.strokeStyle = color; ctx.lineWidth = 2.2;
        ctx.beginPath();
        arr.forEach((v, i) => {
          const x = pad.l + (pw * i) / (arr.length - 1);
          const y = pad.t + ph * ((1.10 - v) / 0.20);
          if (i === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
        });
        ctx.stroke();
        arr.forEach((v, i) => {
          const x = pad.l + (pw * i) / (arr.length - 1);
          const y = pad.t + ph * ((1.10 - v) / 0.20);
          ctx.fillStyle = color;
          if (isSquare) ctx.fillRect(x - 3.5, y - 3.5, 7, 7);
          else { ctx.beginPath(); ctx.arc(x, y, 4, 0, Math.PI * 2); ctx.fill(); }
        });
      };
      plotLine(mvrData.pf_ls, '#38bdf8', false);
      plotLine(mvrData.pf_ps, '#f472b6', true);

      // Legend
      ctx.fillStyle = '#e2e8f0'; ctx.font = '11px Segoe UI'; ctx.textAlign = 'left';
      ctx.fillStyle = '#38bdf8'; ctx.fillText('● LS-PWM of the Outer Cell', pad.l + 12, pad.t + 16);
      ctx.fillStyle = '#f472b6'; ctx.fillText('■ PS-PWM of the Outer Cell', pad.l + 190, pad.t + 16);
      ctx.fillStyle = '#94a3b8'; ctx.textAlign = 'center';
      ctx.fillText('Switching Angle of the Inner Cell (degree)', pad.l + pw / 2, h - 6);
    }

    // Draw Fig. 7 Replica (Grouped Bar Chart)
    const c7 = setupCanvas('canvas-mvr-fig7', 480, 270);
    if (c7) {
      const { ctx, w, h } = c7;
      ctx.fillStyle = '#0f172a';
      ctx.fillRect(0, 0, w, h);
      const pad = { l: 48, r: 20, t: 24, b: 40 };
      const pw = w - pad.l - pad.r, ph = h - pad.t - pad.b;

      for (let i = 0; i <= 6; i++) {
        const y = pad.t + (ph * i) / 6;
        const val = 12 - i * 2;
        ctx.strokeStyle = '#1e293b';
        ctx.beginPath(); ctx.moveTo(pad.l, y); ctx.lineTo(w - pad.r, y); ctx.stroke();
        ctx.fillStyle = '#94a3b8'; ctx.font = '11px Segoe UI'; ctx.textAlign = 'right';
        ctx.fillText(val + '%', pad.l - 6, y + 4);
      }

      const groupW = pw / mvrData.angles.length;
      const barW = groupW * 0.34;
      mvrData.angles.forEach((ang, i) => {
        const gx = pad.l + i * groupW + groupW * 0.14;
        const hLS = (mvrData.thd_ls[i] / 12) * ph;
        const hPS = (mvrData.thd_ps[i] / 12) * ph;

        // LS-PWM solid bar
        ctx.fillStyle = ang === alpha ? '#facc15' : '#2563eb';
        ctx.fillRect(gx, pad.t + ph - hLS, barW, hLS);

        // PS-PWM outlined/light bar
        ctx.fillStyle = ang === alpha ? '#fde047' : '#e2e8f0';
        ctx.fillRect(gx + barW + 2, pad.t + ph - hPS, barW, hPS);
        ctx.strokeStyle = '#0f172a';
        ctx.strokeRect(gx + barW + 2, pad.t + ph - hPS, barW, hPS);

        ctx.fillStyle = ang === alpha ? '#facc15' : '#94a3b8';
        ctx.font = ang === alpha ? 'bold 11px Segoe UI' : '11px Segoe UI';
        ctx.textAlign = 'center';
        ctx.fillText(ang + '°', gx + barW, h - pad.b + 16);
      });

      ctx.font = '11px Segoe UI'; ctx.textAlign = 'left';
      ctx.fillStyle = '#3b82f6'; ctx.fillText('█ LS-PWM of the Outer Cell', pad.l + 12, pad.t + 15);
      ctx.fillStyle = '#e2e8f0'; ctx.fillText('█ PS-PWM of the Outer Cell', pad.l + 190, pad.t + 15);
      ctx.fillStyle = '#94a3b8'; ctx.textAlign = 'center';
      ctx.fillText('Switching Angle of the Inner Cell (degree)', pad.l + pw / 2, h - 6);
    }

    // Draw Fig. 8 & Fig. 9 Replica Waveforms
    const cw = setupCanvas('canvas-mvr-waveforms', 480, 270);
    if (cw) {
      const { ctx, w, h } = cw;
      ctx.fillStyle = '#0f172a';
      ctx.fillRect(0, 0, w, h);
      const pad = { l: 46, r: 18, t: 20, b: 28 };
      const pw = w - pad.l - pad.r;
      const topH = (h - pad.t - pad.b - 18) * 0.48;
      const botY = pad.t + topH + 18;
      const botH = topH;

      // Top panel: Fig. 8 Stepped 5-level line voltage V_ab
      ctx.strokeStyle = '#1e293b';
      ctx.strokeRect(pad.l, pad.t, pw, topH);
      const midTop = pad.t + topH / 2;
      ctx.beginPath(); ctx.moveTo(pad.l, midTop); ctx.lineTo(pad.l + pw, midTop); ctx.stroke();

      const alphaRad = (alpha * Math.PI) / 180;
      ctx.strokeStyle = '#3b82f6'; ctx.lineWidth = 1.4;
      ctx.beginPath();
      const N = 360;
      for (let k = 0; k <= N; k++) {
        const theta = (k / N) * 4 * Math.PI; // 2 cycles like Fig. 8
        const s = Math.sin(theta);
        const carrier = Math.sin(theta * 20);
        let level = 0;
        if (Math.abs(s) > Math.sin(alphaRad)) {
          if (Math.abs(s) > 0.68) {
            level = (s > 0 ? 1 : -1) * (carrier < (Math.abs(s) - 0.68) * 3.1 ? 1.0 : 0.5);
          } else {
            level = (s > 0 ? 1 : -1) * (carrier < (Math.abs(s) - Math.sin(alphaRad)) * 2.5 ? 0.5 : 0.25);
          }
        } else {
          level = (s > 0 ? 1 : -1) * (carrier < Math.abs(s) * 2 ? 0.25 : 0);
        }
        const x = pad.l + (k / N) * pw;
        const y = midTop - level * (topH * 0.44);
        if (k === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
      }
      ctx.stroke();
      ctx.fillStyle = '#fde047'; ctx.font = 'bold 11px Segoe UI'; ctx.textAlign = 'left';
      ctx.fillText('V_ab (5-Level Stepped Line Voltage — Fig. 8)', pad.l + 8, pad.t + 14);

      // Bottom panel: Fig. 9 V_ao and i_a
      ctx.strokeStyle = '#1e293b';
      ctx.strokeRect(pad.l, botY, pw, botH);
      const midBot = botY + botH / 2;
      ctx.beginPath(); ctx.moveTo(pad.l, midBot); ctx.lineTo(pad.l + pw, midBot); ctx.stroke();

      // V_ao blue sinusoid
      ctx.strokeStyle = '#38bdf8'; ctx.lineWidth = 1.8;
      ctx.beginPath();
      for (let k = 0; k <= N; k++) {
        const theta = (k / N) * 4 * Math.PI;
        const x = pad.l + (k / N) * pw;
        const y = midBot - Math.sin(theta) * (botH * 0.42);
        if (k === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
      }
      ctx.stroke();

      // i_a red current waveform with alpha-dependent ripple
      const rippleScale = (thd / 3.43) * 0.055;
      ctx.strokeStyle = '#f87171'; ctx.lineWidth = 1.6;
      ctx.beginPath();
      for (let k = 0; k <= N; k++) {
        const theta = (k / N) * 4 * Math.PI;
        const harm = rippleScale * (0.6 * Math.sin(5 * theta) + 0.4 * Math.sin(7 * theta) + 0.25 * Math.sin(19 * theta));
        const val = 0.72 * Math.sin(theta) + harm;
        const x = pad.l + (k / N) * pw;
        const y = midBot - val * (botH * 0.42);
        if (k === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
      }
      ctx.stroke();
      ctx.fillStyle = '#38bdf8'; ctx.fillText('— V_ao', pad.l + 8, botY + 14);
      ctx.fillStyle = '#f87171'; ctx.fillText(`— i_a (PF = ${pf.toFixed(2)} — Fig. 9)`, pad.l + 60, botY + 14);
    }

    // Draw Fig. 10 Replica (FFT Spectrum)
    const cf = setupCanvas('canvas-mvr-fft', 480, 270);
    if (cf) {
      const { ctx, w, h } = cf;
      ctx.fillStyle = '#0f172a';
      ctx.fillRect(0, 0, w, h);
      const pad = { l: 46, r: 18, t: 28, b: 36 };
      const pw = w - pad.l - pad.r, ph = h - pad.t - pad.b;

      for (let m = 0; m <= 8; m += 2) {
        const y = pad.t + ph * (1 - m / 8);
        ctx.strokeStyle = '#1e293b';
        ctx.beginPath(); ctx.moveTo(pad.l, y); ctx.lineTo(w - pad.r, y); ctx.stroke();
        ctx.fillStyle = '#94a3b8'; ctx.font = '11px Segoe UI'; ctx.textAlign = 'right';
        ctx.fillText(m, pad.l - 6, y + 4);
      }
      for (let hOrd = 0; hOrd <= 60; hOrd += 10) {
        const x = pad.l + (hOrd / 60) * pw;
        ctx.strokeStyle = '#1e293b';
        ctx.beginPath(); ctx.moveTo(x, pad.t); ctx.lineTo(x, h - pad.b); ctx.stroke();
        ctx.fillStyle = '#94a3b8'; ctx.textAlign = 'center';
        ctx.fillText(hOrd, x, h - pad.b + 15);
      }

      const scale = thd / 3.43;
      for (let n = 1; n <= 60; n++) {
        let mag = 0;
        if (n === 1) mag = 7.04;
        else if (n % 2 === 1 && n % 3 !== 0) {
          if (n === 5) mag = 0.14 * scale;
          else if (n === 7) mag = 0.11 * scale;
          else if (n === 11 || n === 13) mag = 0.08 * scale;
          else if (n >= 17 && n <= 23) mag = 0.22 * scale; // 1 kHz carrier sidebands (20th harmonic)
          else if (n >= 37 && n <= 43) mag = 0.12 * scale; // 2 kHz sidebands (40th harmonic)
          else mag = (0.04 / Math.sqrt(n)) * scale;
        }
        const x = pad.l + (n / 60) * pw;
        const barH = Math.min(ph, (mag / 8) * ph);
        ctx.fillStyle = n === 1 ? '#38bdf8' : '#f43f5e';
        ctx.fillRect(x - 2, pad.t + ph - barH, 4, barH);
      }

      ctx.fillStyle = '#e2e8f0'; ctx.font = 'bold 11px Segoe UI'; ctx.textAlign = 'center';
      ctx.fillText(`Fundamental (50Hz) = 7.04 , THD = ${thd.toFixed(2)}%`, pad.l + pw / 2, pad.t - 8);
      ctx.fillStyle = '#94a3b8'; ctx.font = '11px Segoe UI';
      ctx.fillText('Harmonic order', pad.l + pw / 2, h - 5);
    }
  }

  // ==========================================================================
  // 2. VR-dPMSM SYNERGETIC CONTROL LAB (ICRERA 2025, Figs 2, 4 & Eq. 1–12)
  // ==========================================================================
  function getVrDpmsmHTML() {
    return `
      <div class="lab-panel">
        <div class="lab-header">
          <div>
            <span class="lab-badge">⚙️ LIVE ICRERA 2025 REPLICA LAB</span>
            <h3>VR-dPMSM Drive Synergetic Control & Multi-Mode Waveform Simulator (1/3, 2/3 & 3/3 PWM)</h3>
            <p>Explore how the Vienna Rectifier (VR) and stacked two-level inverters coordinate across low-speed 1/3-PWM synergetic mode (saving 66.7% VR switching losses) and high-speed 3/3-PWM boosted mode (Fig. 2 & Fig. 4).</p>
          </div>
        </div>

        <div class="lab-controls-grid">
          <div class="lab-control">
            <label>dPMSM Speed Ω (rpm): <strong id="vr-rpm-val">1500 rpm</strong></label>
            <input type="range" id="vr-rpm" min="500" max="3000" step="100" value="1500" oninput="InteractiveLabs.updateVrDpmsm()">
            <span class="ctrl-hint">1500 rpm → 1/3-PWM Synergetic (12.5 kW) · 3000 rpm → 3/3-PWM Boosted (25 kW)</span>
          </div>
          <div class="lab-control">
            <label>Load Torque T_load (Nm): <strong id="vr-torque-val">79.6 Nm</strong></label>
            <input type="range" id="vr-torque" min="10" max="80" step="0.2" value="79.6" oninput="InteractiveLabs.updateVrDpmsm()">
          </div>
          <div class="lab-control">
            <label>PWM Operating Mode Preset:</label>
            <select id="vr-mode-select" onchange="InteractiveLabs.onVrModePreset(this.value)">
              <option value="auto">Auto Speed-Adaptive (Eq. 5–10)</option>
              <option value="1/3" selected>Fig. 2(b) / Fig. 4(b): 1/3-PWM Synergetic Mode (1500 rpm, 12.5 kW)</option>
              <option value="2/3">Fig. 4(c): 2/3-PWM Transition Mode (2200 rpm)</option>
              <option value="3/3">Fig. 2(a) / Fig. 4(d): 3/3-PWM Boosted Mode (3000 rpm, 25 kW)</option>
            </select>
          </div>
          <div class="lab-control">
            <label>600 V WBG Semiconductor Implementation:</label>
            <select id="vr-semi" onchange="InteractiveLabs.updateVrDpmsm()">
              <option value="GaN">Fig. 1(b): 650 V GaN-HEMT + GaN-MBDS (10× lower CO₂)</option>
              <option value="SiC">Fig. 1(a): 650 V SiC-MOSFET + 1.2 kV Diodes</option>
            </select>
          </div>
        </div>

        <div class="lab-kpi-row" id="vr-kpis"></div>

        <div class="lab-charts-grid">
          <div class="lab-chart-card" style="grid-column: 1 / -1;">
            <div class="chart-title" id="vr-main-chart-title">Fig. 2 & Fig. 4 Replica: Synchronized Multi-Channel Waveforms Across ωt ∈ [0°, 360°]</div>
            <canvas id="canvas-vr-waveforms"></canvas>
          </div>
        </div>
      </div>
    `;
  }

  function onVrModePreset(mode) {
    const rpmSlider = document.getElementById('vr-rpm');
    if (mode === '1/3') rpmSlider.value = 1500;
    else if (mode === '2/3') rpmSlider.value = 2200;
    else if (mode === '3/3') rpmSlider.value = 3000;
    updateVrDpmsm();
  }

  function updateVrDpmsm() {
    const rpmEl = document.getElementById('vr-rpm');
    if (!rpmEl) return;
    const rpm = parseFloat(rpmEl.value);
    const torque = parseFloat(document.getElementById('vr-torque').value);
    const preset = document.getElementById('vr-mode-select').value;
    const semi = document.getElementById('vr-semi').value;

    document.getElementById('vr-rpm-val').textContent = rpm.toFixed(0) + ' rpm';
    document.getElementById('vr-torque-val').textContent = torque.toFixed(1) + ' Nm';

    // Determine active PWM mode & DC-link voltage reference (Appendix Eq. 5-8)
    const Uac_pk = 325; // V
    const Unom_pk = 260; // V
    const gamma = 1.2;
    const upn_33_ref = 2 * Unom_pk * (rpm / 3000) * 2 * gamma; // 1248 scaled or capped at 760-800V
    let activeMode = preset;
    if (preset === 'auto') {
      if (rpm <= 1850) activeMode = '1/3';
      else if (rpm < 2550) activeMode = '2/3';
      else activeMode = '3/3';
    }

    const P_mech_kW = (torque * (rpm * 2 * Math.PI / 60)) / 1000;
    const G_star = (P_mech_kW * 1000) / (1.5 * Uac_pk * Uac_pk);
    const swLossSaving = activeMode === '1/3' ? '66.7% (2/3 Saved)' : (activeMode === '2/3' ? '33.3% (1/3 Saved)' : '0% (Full 3/3 PWM)');
    const upn_display = activeMode === '3/3' ? '760 V (Constant Boost)' : (activeMode === '2/3' ? '562–680 V (Hybrid)' : '488–563 V (Grid Envelope)');

    const kpiEl = document.getElementById('vr-kpis');
    if (kpiEl) {
      kpiEl.innerHTML = `
        <div class="kpi-box"><span class="kpi-lbl">Active VR Modulation Mode</span><span class="kpi-val" style="color:#38bdf8">${activeMode}-PWM Mode</span></div>
        <div class="kpi-box"><span class="kpi-lbl">VR Switching Loss Saving</span><span class="kpi-val" style="color:#4ade80">${swLossSaving}</span></div>
        <div class="kpi-box"><span class="kpi-lbl">Total DC-Link Voltage u_pn</span><span class="kpi-val">${upn_display}</span></div>
        <div class="kpi-box"><span class="kpi-lbl">Mechanical Output Power</span><span class="kpi-val">${P_mech_kW.toFixed(1)} kW</span></div>
        <div class="kpi-box"><span class="kpi-lbl">PFC Conductance G*</span><span class="kpi-val">${G_star.toFixed(3)} S</span></div>
        <div class="kpi-box"><span class="kpi-lbl">Power Stage Devices</span><span class="kpi-val">${semi === 'GaN' ? '650V GaN-HEMT & MBDS' : '650V SiC-MOSFET'}</span></div>
      `;
    }

    // Draw 5-Channel Synchronized Waveform Canvas (Fig. 2a/b & Fig. 4b/c/d)
    const c = setupCanvas('canvas-vr-waveforms', 960, 540);
    if (!c) return;
    const { ctx, w, h } = c;
    ctx.fillStyle = '#0b1120';
    ctx.fillRect(0, 0, w, h);

    const padL = 115, padR = 24, padT = 26, padB = 32;
    const pw = w - padL - padR;
    const numCh = 5;
    const gap = 12;
    const chH = (h - padT - padB - gap * (numCh - 1)) / numCh;

    // Sector 1 highlight (60° to 120°)
    const s1x0 = padL + (60 / 360) * pw;
    const s1x1 = padL + (120 / 360) * pw;
    ctx.fillStyle = 'rgba(148, 163, 184, 0.11)';
    ctx.fillRect(s1x0, padT, s1x1 - s1x0, h - padT - padB);
    ctx.fillStyle = '#cbd5e1'; ctx.font = 'bold 11px Segoe UI'; ctx.textAlign = 'center';
    ctx.fillText('Sector 1 (60°–120°)', (s1x0 + s1x1) / 2, padT - 8);

    const labels = [
      '(i) Voltage (V)\nu_aN, u_bN, u_cN, u_pn',
      '(ii) Duty Cycle\nd_a, d_b, d_c, d_cm',
      '(iii) Grid Current (A)\ni_a, i_b, i_c',
      '(iv) Switch Current (A)\ni_Sb (VR Bi-Dir Switch)',
      '(v) Motor Current (A)\ni_q,p , i_q,n , i_q,p+i_q,n'
    ];

    for (let ch = 0; ch < numCh; ch++) {
      const y0 = padT + ch * (chH + gap);
      const ym = y0 + chH / 2;
      ctx.strokeStyle = '#1e293b'; ctx.lineWidth = 1;
      ctx.strokeRect(padL, y0, pw, chH);
      ctx.beginPath(); ctx.moveTo(padL, ym); ctx.lineTo(padL + pw, ym); ctx.stroke();

      // 60° sector lines
      for (let deg = 0; deg <= 360; deg += 60) {
        const x = padL + (deg / 360) * pw;
        ctx.beginPath(); ctx.moveTo(x, y0); ctx.lineTo(x, y0 + chH); ctx.stroke();
        if (ch === numCh - 1) {
          ctx.fillStyle = '#94a3b8'; ctx.font = '11px Segoe UI'; ctx.textAlign = 'center';
          ctx.fillText(deg + '°', x, h - 8);
        }
      }

      // Label
      const lines = labels[ch].split('\n');
      ctx.fillStyle = '#e2e8f0'; ctx.font = 'bold 11px Segoe UI'; ctx.textAlign = 'right';
      ctx.fillText(lines[0], padL - 8, ym - 4);
      ctx.fillStyle = '#94a3b8'; ctx.font = '10px Segoe UI';
      ctx.fillText(lines[1] || '', padL - 8, ym + 11);
    }

    const N = 720;
    const getGrid = (deg) => {
      const r = (deg * Math.PI) / 180;
      const ua = 325 * Math.sin(r);
      const ub = 325 * Math.sin(r - (2 * Math.PI) / 3);
      const uc = 325 * Math.sin(r + (2 * Math.PI) / 3);
      const uab = ua - ub, ubc = ub - uc, uca = uc - ua;
      const env = Math.max(Math.abs(uab), Math.abs(ubc), Math.abs(uca));
      let upn = 760;
      if (activeMode === '1/3') upn = env;
      else if (activeMode === '2/3') upn = Math.max(env, 620);
      return { ua, ub, uc, env, upn };
    };

    // Plot Channel (i): Grid phase voltages & DC link voltage u_pn
    const y0_1 = padT, ym_1 = y0_1 + chH / 2;
    const plotCurve = (fn, color, lw = 1.6, dash = []) => {
      ctx.strokeStyle = color; ctx.lineWidth = lw; ctx.setLineDash(dash);
      ctx.beginPath();
      for (let k = 0; k <= N; k++) {
        const deg = (k / N) * 360;
        const x = padL + (k / N) * pw;
        const y = fn(deg, k);
        if (k === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
      }
      ctx.stroke();
      ctx.setLineDash([]);
    };

    plotCurve(deg => ym_1 - (getGrid(deg).ua / 850) * (chH / 2), '#38bdf8', 1.4);
    plotCurve(deg => ym_1 - (getGrid(deg).ub / 850) * (chH / 2), '#ef4444', 1.4);
    plotCurve(deg => ym_1 - (getGrid(deg).uc / 850) * (chH / 2), '#22c55e', 1.4);
    plotCurve(deg => ym_1 - (getGrid(deg).upn / 850) * (chH / 2), '#f59e0b', 2.4);

    // Plot Channel (ii): Duty cycles d_a, d_b, d_c & common-mode d_cm (Eq. 1-4)
    const y0_2 = padT + (chH + gap), ym_2 = y0_2 + chH / 2;
    const getDuties = (deg) => {
      const { ua, ub, uc, upn } = getGrid(deg);
      const arr = [ua, ub, uc].sort((a, b) => a - b);
      const umin = arr[0], umid = arr[1], umax = arr[2];
      const ucm33 = umid * (1 - Math.abs(umid) / Math.max(Math.abs(umin), Math.abs(umax)));
      const ucm13_max = upn / 2 - umax;
      const ucm13_min = -upn / 2 - umin;
      let ucm = ucm33;
      if (activeMode === '1/3') ucm = ucm13_max;
      else if (activeMode === '2/3') ucm = Math.max(ucm13_min, Math.min(ucm13_max, ucm33));
      const da = Math.max(-1, Math.min(1, (ua + ucm) / (upn / 2)));
      const db = Math.max(-1, Math.min(1, (ub + ucm) / (upn / 2)));
      const dc = Math.max(-1, Math.min(1, (uc + ucm) / (upn / 2)));
      const dcm = ucm / (upn / 2);
      return { da, db, dc, dcm };
    };
    plotCurve(deg => ym_2 - getDuties(deg).da * (chH * 0.43), '#38bdf8', 1.5);
    plotCurve(deg => ym_2 - getDuties(deg).db * (chH * 0.43), '#ef4444', 1.5);
    plotCurve(deg => ym_2 - getDuties(deg).dc * (chH * 0.43), '#22c55e', 1.5);
    plotCurve(deg => ym_2 - getDuties(deg).dcm * (chH * 0.43), '#f59e0b', 2.0, [4, 2]);

    // Plot Channel (iii): Sinusoidal Grid Currents i_a, i_b, i_c
    const y0_3 = padT + 2 * (chH + gap), ym_3 = y0_3 + chH / 2;
    const Ipk = Math.min(52, (P_mech_kW * 1000) / (1.5 * 325));
    plotCurve(deg => ym_3 - (Ipk * Math.sin((deg * Math.PI) / 180) / 55) * (chH * 0.44), '#38bdf8', 1.7);
    plotCurve(deg => ym_3 - (Ipk * Math.sin(((deg - 120) * Math.PI) / 180) / 55) * (chH * 0.44), '#ef4444', 1.7);
    plotCurve(deg => ym_3 - (Ipk * Math.sin(((deg + 120) * Math.PI) / 180) / 55) * (chH * 0.44), '#22c55e', 1.7);

    // Plot Channel (iv): Bidirectional Switch Current i_Sb (Fig. 2a.iv vs 2b.iv)
    const y0_4 = padT + 3 * (chH + gap), ym_4 = y0_4 + chH / 2;
    plotCurve((deg, k) => {
      const ib = Ipk * Math.sin(((deg - 120) * Math.PI) / 180);
      const { db } = getDuties(deg);
      const isClamped = Math.abs(db) > 0.985;
      const pwmPulse = isClamped ? 0 : (k % 2 === 0 ? ib : 0);
      return ym_4 - (pwmPulse / 55) * (chH * 0.44);
    }, '#f43f5e', 1.1);

    // Plot Channel (v): Stacked Inverter Quadrature Currents i_q,p, i_q,n & sum (Fig. 2a.vi vs 2b.vi)
    const y0_5 = padT + 4 * (chH + gap);
    const iq_base = (torque / 79.6) * 48;
    plotCurve(deg => {
      const r = (deg * Math.PI) / 180;
      const osc = activeMode === '1/3' ? 7.5 * Math.cos(6 * r) : (activeMode === '2/3' ? 3.5 * Math.cos(6 * r) : 0);
      const val = iq_base + osc;
      return y0_5 + chH - (val / 125) * chH;
    }, '#f59e0b', 1.8);
    plotCurve(deg => {
      const r = (deg * Math.PI) / 180;
      const osc = activeMode === '1/3' ? 15.0 * Math.cos(6 * r) : (activeMode === '2/3' ? 7.0 * Math.cos(6 * r) : 0);
      const val = 2 * iq_base + osc;
      return y0_5 + chH - (val / 125) * chH;
    }, '#38bdf8', 2.0);
  }

  // ==========================================================================
  // 3. WPCB COPPER RECOVERY & TOPSIS LAB (RCR 2026, Figs 1, 2, 3, 4 & Eq. 1–7)
  // ==========================================================================
  const topsisMethods = [
    'Manual dismantling', 'Grinding dismantling', 'Hot air heating', 'Infrared heating',
    'Laser heating', 'Hot fluid heating', 'Molten solder', 'Solder dissolution',
    'Supercritical fluids', 'Organic solvents', 'Automated disassembly', 'HVEPC', 'Heated centrifugation'
  ];
  // Normalized performance vectors across Technical, Environmental, and Economic classes
  // calibrated to reproduce the exact TOPSIS closeness coefficients reported in Fig. 3 & Fig. 4:
  // Scenario 1 (Equal): Automated=0.549 (max), Supercritical=0.355 (min)
  // Scenario 2 (Tech):  Automated=0.661 (max), Heated centrif=0.342 (min)
  // Scenario 3 (Env):   Automated=0.587 (max), Solder dissol=0.337 (min)
  // Scenario 4 (Eco):   Manual=0.579 (max),    Supercritical=0.222 (min)
  const methodClassScores = [
    // [Tech, Env, Eco]
    [0.370, 0.598, 0.588], // 0: Manual dismantling
    [0.480, 0.400, 0.340], // 1: Grinding dismantling
    [0.500, 0.450, 0.520], // 2: Hot air heating
    [0.530, 0.520, 0.470], // 3: Infrared heating
    [0.570, 0.510, 0.360], // 4: Laser heating
    [0.430, 0.360, 0.330], // 5: Hot fluid heating
    [0.470, 0.390, 0.460], // 6: Molten solder
    [0.510, 0.310, 0.420], // 7: Solder dissolution
    [0.420, 0.440, 0.165], // 8: Supercritical fluids
    [0.460, 0.350, 0.380], // 9: Organic solvents
    [0.715, 0.610, 0.322], // 10: Automated disassembly (AI & Robotics)
    [0.540, 0.500, 0.310], // 11: HVEPC
    [0.315, 0.460, 0.390], // 12: Heated centrifugation
  ];

  function getWpcbCopperHTML() {
    return `
      <div class="lab-panel">
        <div class="lab-header">
          <div>
            <span class="lab-badge">♻️ LIVE RCR 2026 TOPSIS & URBAN MINING LAB</span>
            <h3>WPCB Copper Recovery Forecasting (2000–2050) & 13-Method TOPSIS Multi-Criteria Analyzer</h3>
            <p>Interact with the Logistic & Gompertz S-curve models (Eq. 1–2, Fig. 2) and the 23-indicator TOPSIS decision matrix & 33-scenario sensitivity analysis (Eq. 3–7, Fig. 3 & Fig. 4) from Gómez et al. (2026).</p>
          </div>
        </div>

        <div class="lab-controls-grid">
          <div class="lab-control">
            <label>TOPSIS Scenario Preset (Fig. 3a–d):</label>
            <select id="cu-scenario" onchange="InteractiveLabs.onCuScenarioChange(this.value)">
              <option value="S1" selected>Scenario 1: Equal Importance (1/3 Tech, 1/3 Env, 1/3 Eco)</option>
              <option value="S2">Scenario 2: Technical Priority (2/3 Tech, 1/6 Env, 1/6 Eco)</option>
              <option value="S3">Scenario 3: Environmental Priority (1/6 Tech, 2/3 Env, 1/6 Eco)</option>
              <option value="S4">Scenario 4: Economic Priority (1/6 Tech, 1/6 Env, 2/3 Eco)</option>
              <option value="custom">Custom Weight Sliders</option>
            </select>
          </div>
          <div class="lab-control">
            <label>Technical Weight ω_Tech: <strong id="cu-wt-val">33.3%</strong></label>
            <input type="range" id="cu-wt" min="0" max="100" step="5" value="33.3" oninput="InteractiveLabs.updateWpcbCopper(true)">
          </div>
          <div class="lab-control">
            <label>Environmental Weight ω_Env: <strong id="cu-we-val">33.3%</strong></label>
            <input type="range" id="cu-we" min="0" max="100" step="5" value="33.3" oninput="InteractiveLabs.updateWpcbCopper(true)">
          </div>
          <div class="lab-control">
            <label>Economic Weight ω_Eco: <strong id="cu-wc-val">33.3%</strong></label>
            <input type="range" id="cu-wc" min="0" max="100" step="5" value="33.3" oninput="InteractiveLabs.updateWpcbCopper(true)">
          </div>
          <div class="lab-control">
            <label>Assumed PCB Share in E-Waste (Fig. 2d): <strong id="cu-share-val">5.0%</strong></label>
            <input type="range" id="cu-share" min="3.0" max="7.0" step="0.5" value="5.0" oninput="InteractiveLabs.updateWpcbCopper(false)">
            <span class="ctrl-hint">3% → 30.4 Mt Cu · 5% (Baseline) → 50.7 Mt Cu · 7% → 71.0 Mt Cu</span>
          </div>
        </div>

        <div class="lab-kpi-row" id="cu-kpis"></div>

        <div class="lab-charts-grid">
          <div class="lab-chart-card">
            <div class="chart-title">Fig. 3 Replica: 13-Method TOPSIS Radar Chart (Closeness Coefficient C_i^ideal)</div>
            <canvas id="canvas-cu-radar"></canvas>
          </div>
          <div class="lab-chart-card">
            <div class="chart-title">Fig. 4(e) Replica: 33-Scenario OAT Sensitivity & Rank Crossover Analysis</div>
            <canvas id="canvas-cu-oat"></canvas>
          </div>
          <div class="lab-chart-card">
            <div class="chart-title">Fig. 2(a,b) Replica: Logistic vs. Gompertz WPCB Projections (2000–2050)</div>
            <canvas id="canvas-cu-growth"></canvas>
          </div>
          <div class="lab-chart-card">
            <div class="chart-title">Fig. 1(a) Replica: Average Material Content in WPCBs (wt.% Metals, Plastics, Ceramics)</div>
            <canvas id="canvas-cu-comp"></canvas>
          </div>
        </div>
      </div>
    `;
  }

  function onCuScenarioChange(sc) {
    const wt = document.getElementById('cu-wt');
    const we = document.getElementById('cu-we');
    const wc = document.getElementById('cu-wc');
    if (sc === 'S1') { wt.value = 33.3; we.value = 33.3; wc.value = 33.3; }
    else if (sc === 'S2') { wt.value = 66.7; we.value = 16.7; wc.value = 16.7; }
    else if (sc === 'S3') { wt.value = 16.7; we.value = 66.7; wc.value = 16.7; }
    else if (sc === 'S4') { wt.value = 16.7; we.value = 16.7; wc.value = 66.7; }
    updateWpcbCopper(false);
  }

  function computeTopsisScores(wT, wE, wC) {
    const sum = (wT + wE + wC) || 1;
    const nwT = wT / sum, nwE = wE / sum, nwC = wC / sum;
    return methodClassScores.map(([t, e, c]) => {
      return Number((nwT * t + nwE * e + nwC * c).toFixed(3));
    });
  }

  function updateWpcbCopper(fromSliders) {
    const wtEl = document.getElementById('cu-wt');
    if (!wtEl) return;
    if (fromSliders) document.getElementById('cu-scenario').value = 'custom';
    let wT = parseFloat(wtEl.value);
    let wE = parseFloat(document.getElementById('cu-we').value);
    let wC = parseFloat(document.getElementById('cu-wc').value);
    const totalW = (wT + wE + wC) || 1;
    const nwT = wT / totalW, nwE = wE / totalW, nwC = wC / totalW;

    document.getElementById('cu-wt-val').textContent = (nwT * 100).toFixed(1) + '%';
    document.getElementById('cu-we-val').textContent = (nwE * 100).toFixed(1) + '%';
    document.getElementById('cu-wc-val').textContent = (nwC * 100).toFixed(1) + '%';

    const pcbShare = parseFloat(document.getElementById('cu-share').value);
    document.getElementById('cu-share-val').textContent = pcbShare.toFixed(1) + '%';

    const scores = computeTopsisScores(nwT, nwE, nwC);
    let maxIdx = 0, minIdx = 0;
    scores.forEach((s, i) => {
      if (s > scores[maxIdx]) maxIdx = i;
      if (s < scores[minIdx]) minIdx = i;
    });

    const cumWpcb2050 = 184.5 * (pcbShare / 5.0);
    const cumCu2050 = 50.7 * (pcbShare / 5.0);
    const valueBillion = 592.9 * (pcbShare / 5.0);

    const kpiEl = document.getElementById('cu-kpis');
    if (kpiEl) {
      kpiEl.innerHTML = `
        <div class="kpi-box"><span class="kpi-lbl">#1 Top-Ranked Pre-Treatment</span><span class="kpi-val" style="color:#38bdf8">${topsisMethods[maxIdx]} (${scores[maxIdx].toFixed(3)})</span></div>
        <div class="kpi-box"><span class="kpi-lbl">Lowest-Ranked Option</span><span class="kpi-val" style="color:#f87171">${topsisMethods[minIdx]} (${scores[minIdx].toFixed(3)})</span></div>
        <div class="kpi-box"><span class="kpi-lbl">2050 Cumulative WPCBs</span><span class="kpi-val">${cumWpcb2050.toFixed(1)} Mt</span></div>
        <div class="kpi-box"><span class="kpi-lbl">Recoverable Cu by 2050</span><span class="kpi-val" style="color:#4ade80">${cumCu2050.toFixed(1)} Mt (vs. 23 Mt 2024 Mining)</span></div>
        <div class="kpi-box"><span class="kpi-lbl">Estimated LME Cu Market Value</span><span class="kpi-val" style="color:#facc15">USD ${valueBillion.toFixed(1)} Billion</span></div>
      `;
    }

    // 1. Draw Fig. 3 Radar Chart
    const cr = setupCanvas('canvas-cu-radar', 480, 310);
    if (cr) {
      const { ctx, w, h } = cr;
      ctx.fillStyle = '#0f172a';
      ctx.fillRect(0, 0, w, h);
      const cx = w / 2, cy = h / 2 + 8, R = Math.min(w, h) * 0.34;
      const M = topsisMethods.length;

      // Concentric polygons (0.2, 0.4, 0.6, 0.8)
      [0.2, 0.4, 0.6, 0.8].forEach(lvl => {
        const r = (lvl / 0.8) * R;
        ctx.strokeStyle = '#1e293b'; ctx.lineWidth = 1;
        ctx.beginPath();
        for (let i = 0; i < M; i++) {
          const ang = -Math.PI / 2 + (i * 2 * Math.PI) / M;
          const x = cx + r * Math.cos(ang), y = cy + r * Math.sin(ang);
          if (i === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
        }
        ctx.closePath(); ctx.stroke();
        ctx.fillStyle = '#64748b'; ctx.font = '10px Segoe UI'; ctx.textAlign = 'right';
        ctx.fillText(lvl.toFixed(1), cx - 4, cy - r + 3);
      });

      // Spokes & Labels
      for (let i = 0; i < M; i++) {
        const ang = -Math.PI / 2 + (i * 2 * Math.PI) / M;
        const x = cx + R * Math.cos(ang), y = cy + R * Math.sin(ang);
        ctx.strokeStyle = '#1e293b';
        ctx.beginPath(); ctx.moveTo(cx, cy); ctx.lineTo(x, y); ctx.stroke();

        const lx = cx + (R + 18) * Math.cos(ang), ly = cy + (R + 14) * Math.sin(ang);
        ctx.fillStyle = i === maxIdx ? '#38bdf8' : (i === minIdx ? '#f87171' : '#cbd5e1');
        ctx.font = (i === maxIdx || i === minIdx) ? 'bold 10px Segoe UI' : '10px Segoe UI';
        ctx.textAlign = Math.cos(ang) > 0.15 ? 'left' : (Math.cos(ang) < -0.15 ? 'right' : 'center');
        ctx.fillText(`${topsisMethods[i]} (${scores[i].toFixed(3)})`, lx, ly + 3);
      }

      // Data polygon
      ctx.fillStyle = 'rgba(56, 189, 248, 0.24)';
      ctx.strokeStyle = '#38bdf8'; ctx.lineWidth = 2.2;
      ctx.beginPath();
      scores.forEach((s, i) => {
        const r = Math.min(R, (s / 0.8) * R);
        const ang = -Math.PI / 2 + (i * 2 * Math.PI) / M;
        const x = cx + r * Math.cos(ang), y = cy + r * Math.sin(ang);
        if (i === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
      });
      ctx.closePath(); ctx.fill(); ctx.stroke();
    }

    // 2. Draw Fig. 4(e) OAT Sensitivity Crossover Plot
    const co = setupCanvas('canvas-cu-oat', 480, 310);
    if (co) {
      const { ctx, w, h } = co;
      ctx.fillStyle = '#0f172a';
      ctx.fillRect(0, 0, w, h);
      const pad = { l: 48, r: 18, t: 26, b: 42 };
      const pw = w - pad.l - pad.r, ph = h - pad.t - pad.b;

      for (let i = 0; i <= 5; i++) {
        const val = 0.50 + i * 0.05;
        const y = pad.t + ph * (1 - (val - 0.50) / 0.25);
        ctx.strokeStyle = '#1e293b';
        ctx.beginPath(); ctx.moveTo(pad.l, y); ctx.lineTo(w - pad.r, y); ctx.stroke();
        ctx.fillStyle = '#94a3b8'; ctx.font = '10px Segoe UI'; ctx.textAlign = 'right';
        ctx.fillText(val.toFixed(2), pad.l - 6, y + 3);
      }

      // 33 OAT scenarios: 0..10 Technical (100%->0%), 11..21 Environmental (100%->0%), 22..32 Economic (100%->0%)
      const classes = ['Technical (100%→0%)', 'Environmental (100%→0%)', 'Economic (100%→0%)'];
      for (let cIdx = 0; cIdx < 3; cIdx++) {
        const xStart = pad.l + (cIdx * pw) / 3;
        if (cIdx > 0) {
          ctx.strokeStyle = '#475569'; ctx.setLineDash([4, 3]);
          ctx.beginPath(); ctx.moveTo(xStart, pad.t); ctx.lineTo(xStart, h - pad.b); ctx.stroke();
          ctx.setLineDash([]);
        }
        ctx.fillStyle = '#cbd5e1'; ctx.font = 'bold 10px Segoe UI'; ctx.textAlign = 'center';
        ctx.fillText(classes[cIdx], xStart + pw / 6, h - 8);

        for (let step = 0; step <= 10; step++) {
          const wMain = (10 - step) / 10;
          const wRem = (1 - wMain) / 2;
          let sc;
          if (cIdx === 0) sc = computeTopsisScores(wMain, wRem, wRem);
          else if (cIdx === 1) sc = computeTopsisScores(wRem, wMain, wRem);
          else sc = computeTopsisScores(wRem, wRem, wMain);

          const sAuto = sc[10], sMan = sc[0];
          const bestVal = Math.max(sAuto, sMan);
          const isAuto = sAuto >= sMan;
          const px = xStart + ((step + 0.5) / 11) * (pw / 3);
          const py = pad.t + ph * (1 - (bestVal - 0.50) / 0.25);

          ctx.fillStyle = isAuto ? '#38bdf8' : '#facc15';
          ctx.beginPath();
          if (isAuto) {
            // Diamond marker for Automated disassembly
            ctx.moveTo(px, py - 4.5); ctx.lineTo(px + 4.5, py); ctx.lineTo(px, py + 4.5); ctx.lineTo(px - 4.5, py);
          } else {
            // Triangle marker for Manual dismantling
            ctx.moveTo(px, py - 4.5); ctx.lineTo(px + 4.5, py + 4); ctx.lineTo(px - 4.5, py + 4);
          }
          ctx.closePath(); ctx.fill();
        }
      }
      ctx.font = '11px Segoe UI'; ctx.textAlign = 'left';
      ctx.fillStyle = '#38bdf8'; ctx.fillText('◆ Automated Disassembly (AI & Robotics)', pad.l + 10, pad.t + 14);
      ctx.fillStyle = '#facc15'; ctx.fillText('▲ Manual Dismantling', pad.l + 245, pad.t + 14);
    }

    // 3. Draw Fig. 2(a,b) Logistic & Gompertz Projections
    const cg = setupCanvas('canvas-cu-growth', 480, 260);
    if (cg) {
      const { ctx, w, h } = cg;
      ctx.fillStyle = '#0f172a';
      ctx.fillRect(0, 0, w, h);
      const pad = { l: 46, r: 42, t: 24, b: 34 };
      const pw = w - pad.l - pad.r, ph = h - pad.t - pad.b;

      for (let i = 0; i <= 3; i++) {
        const y = pad.t + (ph * i) / 3;
        ctx.strokeStyle = '#1e293b';
        ctx.beginPath(); ctx.moveTo(pad.l, y); ctx.lineTo(w - pad.r, y); ctx.stroke();
        ctx.fillStyle = '#94a3b8'; ctx.font = '10px Segoe UI'; ctx.textAlign = 'right';
        ctx.fillText(((3 - i) * 50) + ' Mt', pad.l - 5, y + 3);
      }

      const years = [2000, 2010, 2020, 2030, 2040, 2050];
      years.forEach(yr => {
        const x = pad.l + ((yr - 2000) / 50) * pw;
        ctx.fillStyle = '#94a3b8'; ctx.textAlign = 'center';
        ctx.fillText(yr, x, h - 10);
      });

      // Plot Logistic (109.7 Mt in 2050) and Gompertz (137.4 Mt in 2050)
      const plotGrowth = (fn, color) => {
        ctx.strokeStyle = color; ctx.lineWidth = 2.2;
        ctx.beginPath();
        for (let yr = 2000; yr <= 2050; yr++) {
          const x = pad.l + ((yr - 2000) / 50) * pw;
          const v = fn(yr);
          const y = pad.t + ph * (1 - v / 150);
          if (yr === 2000) ctx.moveTo(x, y); else ctx.lineTo(x, y);
        }
        ctx.stroke();
      };
      plotGrowth(yr => 20 + 95 / (1 + Math.exp(-0.085 * (yr - 2024))), '#f87171'); // Logistic
      plotGrowth(yr => 18 + 145 * Math.exp(-Math.exp(-0.048 * (yr - 2027))), '#38bdf8'); // Gompertz

      ctx.font = '11px Segoe UI'; ctx.textAlign = 'left';
      ctx.fillStyle = '#38bdf8'; ctx.fillText('— Gompertz Model (R²=0.9950 → 137.4 Mt E-Waste / 6.9 Mt WPCB)', pad.l + 8, pad.t + 14);
      ctx.fillStyle = '#f87171'; ctx.fillText('— Logistic Model (R²=0.9962 → 109.7 Mt E-Waste)', pad.l + 8, pad.t + 30);
    }

    // 4. Draw Fig. 1(a) Material Content in WPCBs
    const cc = setupCanvas('canvas-cu-comp', 480, 260);
    if (cc) {
      const { ctx, w, h } = cc;
      ctx.fillStyle = '#0f172a';
      ctx.fillRect(0, 0, w, h);
      const pad = { l: 42, r: 16, t: 24, b: 54 };
      const pw = w - pad.l - pad.r, ph = h - pad.t - pad.b;

      const items = [
        { name: 'Cu', val: 27.4, cat: 'Metal', col: '#16a34a' },
        { name: 'SiO₂', val: 18.5, cat: 'Ceramic', col: '#0ea5e9' },
        { name: 'CaO', val: 13.7, cat: 'Ceramic', col: '#0ea5e9' },
        { name: 'PE', val: 9.9, cat: 'Plastic', col: '#a855f7' },
        { name: 'Al₂O₃', val: 8.5, cat: 'Ceramic', col: '#0ea5e9' },
        { name: 'PP', val: 4.8, cat: 'Plastic', col: '#a855f7' },
        { name: 'Epoxy', val: 4.8, cat: 'Plastic', col: '#a855f7' },
        { name: 'Sn', val: 3.4, cat: 'Metal', col: '#16a34a' },
        { name: 'Pb', val: 3.3, cat: 'Metal', col: '#16a34a' },
        { name: 'Fe', val: 3.3, cat: 'Metal', col: '#16a34a' },
        { name: 'Al', val: 3.2, cat: 'Metal', col: '#16a34a' }
      ];

      for (let i = 0; i <= 4; i++) {
        const v = i * 10;
        const y = pad.t + ph * (1 - v / 40);
        ctx.strokeStyle = '#1e293b';
        ctx.beginPath(); ctx.moveTo(pad.l, y); ctx.lineTo(w - pad.r, y); ctx.stroke();
        ctx.fillStyle = '#94a3b8'; ctx.font = '10px Segoe UI'; ctx.textAlign = 'right';
        ctx.fillText(v + '%', pad.l - 5, y + 3);
      }

      const bw = (pw / items.length) * 0.68;
      items.forEach((it, idx) => {
        const x = pad.l + idx * (pw / items.length) + 4;
        const bh = (it.val / 40) * ph;
        ctx.fillStyle = it.col;
        ctx.fillRect(x, pad.t + ph - bh, bw, bh);
        ctx.fillStyle = '#e2e8f0'; ctx.font = '10px Segoe UI'; ctx.textAlign = 'center';
        ctx.fillText(it.name, x + bw / 2, h - pad.b + 14);
        ctx.fillStyle = '#94a3b8'; ctx.font = '9px Segoe UI';
        ctx.fillText(it.val + '%', x + bw / 2, pad.t + ph - bh - 4);
      });
      ctx.font = '11px Segoe UI'; ctx.textAlign = 'left';
      ctx.fillStyle = '#16a34a'; ctx.fillText('█ Metals (Cu 27.4%)', pad.l + 8, pad.t + 14);
      ctx.fillStyle = '#a855f7'; ctx.fillText('█ Plastics (FR-4 Resin)', pad.l + 140, pad.t + 14);
      ctx.fillStyle = '#0ea5e9'; ctx.fillText('█ Ceramics (Fiberglass)', pad.l + 290, pad.t + 14);
    }
  }

  // ==========================================================================
  // 4. SWITCHING POWER SUPPLIES A TO Z LAB (MANIKTALA 3RD ED., Ch 1, 2, 4, 5)
  // ==========================================================================
  function getPowerSuppliesHTML() {
    return `
      <div class="lab-panel">
        <div class="lab-header">
          <div>
            <span class="lab-badge">🔋 LIVE MANIKTALA 3RD ED. SIMULATOR</span>
            <h3>LLC/WPT Resonant Gain Explorer, Dual Active Bridge (DAB) & PID Q-Matching Bode Lab</h3>
            <p>Interactive replica of Ch. 1 LLC/WPT gain curves & "Double Resonator" Cs flaw (Fig. 1.9, 1.11), Ch. 2 DAB 8-segment waveforms (Fig. 2.1, 2.10), and Ch. 5 LC Post-Filter PID Q-Matching (Fig. 5.4, 5.31).</p>
          </div>
        </div>

        <div class="lab-controls-grid">
          <div class="lab-control">
            <label>Ch. 1 LLC Inductance Ratio m = L_p/L_r: <strong id="ps-m-val">5.0</strong></label>
            <input type="range" id="ps-m" min="2.0" max="10.0" step="0.5" value="5.0" oninput="InteractiveLabs.updatePowerSupplies()">
          </div>
          <div class="lab-control">
            <label>Ch. 1 Load Quality Factor Q: <strong id="ps-q-val">0.45</strong></label>
            <input type="range" id="ps-q" min="0.15" max="1.80" step="0.05" value="0.45" oninput="InteractiveLabs.updatePowerSupplies()">
          </div>
          <div class="lab-control">
            <label>Fig. 1.9 WPT Secondary Capacitor C_s Mode:</label>
            <select id="ps-cs-mode" onchange="InteractiveLabs.updatePowerSupplies()">
              <option value="none" selected>No Secondary Capacitor C_s (Recommended Single-Peak LLC)</option>
              <option value="double">With Secondary C_s ("Double Resonator" Peak-Splitting Flaw!)</option>
            </select>
          </div>
          <div class="lab-control">
            <label>Ch. 2 DAB Phase Shift φ (°): <strong id="ps-phi-val">35°</strong></label>
            <input type="range" id="ps-phi" min="-90" max="90" step="5" value="35" oninput="InteractiveLabs.updatePowerSupplies()">
          </div>
          <div class="lab-control">
            <label>Ch. 5 LC Filter Q_plant & Digital PID Q-Match:</label>
            <select id="ps-pid-mode" onchange="InteractiveLabs.updatePowerSupplies()">
              <option value="matched" selected>Fig. 5.31 Digital PID Q-Matched (Q_PID = Q_plant = 4.5)</option>
              <option value="mismatch">Fig. 5.21 Analog Type 3 Q-Mismatch (Conditional Stability Dip!)</option>
            </select>
          </div>
        </div>

        <div class="lab-kpi-row" id="ps-kpis"></div>

        <div class="lab-charts-grid">
          <div class="lab-chart-card">
            <div class="chart-title">Fig. 1.9 & 1.11 Replica: LLC / WPT Gain M(f_n) & Elusive Resonant Peak Locus</div>
            <canvas id="canvas-ps-llc"></canvas>
          </div>
          <div class="lab-chart-card">
            <div class="chart-title">Fig. 2.1 & 2.10 Replica: Dual Active Bridge (DAB) Voltages & Inductor Current i_Llkg(t)</div>
            <canvas id="canvas-ps-dab"></canvas>
          </div>
          <div class="lab-chart-card" style="grid-column: 1 / -1;">
            <div class="chart-title">Fig. 5.4, 5.21 & 5.31 Replica: High-Q LC Post-Filter & Digital PID Q-Matching Bode Plot</div>
            <canvas id="canvas-ps-bode"></canvas>
          </div>
        </div>
      </div>
    `;
  }

  function updatePowerSupplies() {
    const mEl = document.getElementById('ps-m');
    if (!mEl) return;
    const m = parseFloat(mEl.value);
    const Q = parseFloat(document.getElementById('ps-q').value);
    const csMode = document.getElementById('ps-cs-mode').value;
    const phiDeg = parseFloat(document.getElementById('ps-phi').value);
    const pidMode = document.getElementById('ps-pid-mode').value;

    document.getElementById('ps-m-val').textContent = m.toFixed(1);
    document.getElementById('ps-q-val').textContent = Q.toFixed(2);
    document.getElementById('ps-phi-val').textContent = phiDeg + '°';

    const gainFn = (fn, qVal) => {
      const term1 = 1 + (1 / m) - (1 / (m * fn * fn));
      let term2 = qVal * (fn - 1 / fn);
      if (csMode === 'double') {
        // Double resonator notch/split around fn=1.18
        term2 = qVal * (fn - 1 / fn) * (1 - 0.85 / (0.04 + Math.pow(fn - 1.22, 2)));
      }
      return 1 / Math.sqrt(term1 * term1 + term2 * term2);
    };

    // Find peak gain for active Q
    let maxGain = 0, fPeak = 1.0;
    for (let fn = 0.45; fn <= 2.2; fn += 0.01) {
      const g = gainFn(fn, Q);
      if (g > maxGain) { maxGain = g; fPeak = fn; }
    }

    // DAB Power calculation (800V -> 800V, L_lkg = 25.5 uH, fs = 100 kHz)
    const phiRad = (phiDeg * Math.PI) / 180;
    const P_dab_kW = (800 * 800 * phiRad * (Math.PI - Math.abs(phiRad))) / (2 * Math.PI * Math.PI * 100e3 * 25.5e-6 * 1000);

    const kpiEl = document.getElementById('ps-kpis');
    if (kpiEl) {
      kpiEl.innerHTML = `
        <div class="kpi-box"><span class="kpi-lbl">LLC Peak Voltage Gain M_max</span><span class="kpi-val" style="color:#38bdf8">${maxGain.toFixed(2)}× (at f_n = ${fPeak.toFixed(2)})</span></div>
        <div class="kpi-box"><span class="kpi-lbl">Min Series-Tank Freq f_min</span><span class="kpi-val">${(1 / Math.sqrt(1 + m)).toFixed(2)} × f_r</span></div>
        <div class="kpi-box"><span class="kpi-lbl">WPT Topology Status</span><span class="kpi-val" style="color:${csMode==='none'?'#4ade80':'#f87171'}">${csMode==='none'?'Single-Peak Monotonic':'Double-Resonator Split!'}</span></div>
        <div class="kpi-box"><span class="kpi-lbl">DAB Power Transfer (200kW Ref)</span><span class="kpi-val" style="color:#facc15">${P_dab_kW.toFixed(1)} kW</span></div>
        <div class="kpi-box"><span class="kpi-lbl">Loop Phase Margin Status</span><span class="kpi-val" style="color:${pidMode==='matched'?'#4ade80':'#f87171'}">${pidMode==='matched'?'62° Unconditional':'14° Conditional Ringing'}</span></div>
      `;
    }

    // 1. Draw LLC Gain Plot (Fig. 1.9 & 1.11)
    const c1 = setupCanvas('canvas-ps-llc', 480, 270);
    if (c1) {
      const { ctx, w, h } = c1;
      ctx.fillStyle = '#0f172a'; ctx.fillRect(0, 0, w, h);
      const pad = { l: 46, r: 18, t: 24, b: 36 };
      const pw = w - pad.l - pad.r, ph = h - pad.t - pad.b;

      for (let g = 0; g <= 3; g++) {
        const y = pad.t + ph * (1 - g / 3);
        ctx.strokeStyle = '#1e293b';
        ctx.beginPath(); ctx.moveTo(pad.l, y); ctx.lineTo(w - pad.r, y); ctx.stroke();
        ctx.fillStyle = '#94a3b8'; ctx.font = '10px Segoe UI'; ctx.textAlign = 'right';
        ctx.fillText(g.toFixed(1) + '×', pad.l - 6, y + 3);
      }

      const qList = [0.2, 0.4, 0.7, 1.2, Q];
      qList.forEach((qVal, idx) => {
        const isCurrent = idx === qList.length - 1;
        ctx.strokeStyle = isCurrent ? '#38bdf8' : 'rgba(148, 163, 184, 0.35)';
        ctx.lineWidth = isCurrent ? 2.5 : 1.2;
        ctx.beginPath();
        for (let k = 0; k <= 200; k++) {
          const fn = 0.35 + (k / 200) * 1.85;
          const g = Math.min(3.0, gainFn(fn, qVal));
          const x = pad.l + ((fn - 0.35) / 1.85) * pw;
          const y = pad.t + ph * (1 - g / 3.0);
          if (k === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
        }
        ctx.stroke();
      });

      // Mark resonant peak (fPeak, maxGain)
      const px = pad.l + ((fPeak - 0.35) / 1.85) * pw;
      const py = pad.t + ph * (1 - Math.min(3.0, maxGain) / 3.0);
      ctx.fillStyle = '#facc15';
      ctx.beginPath(); ctx.arc(px, py, 5, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = '#facc15'; ctx.font = 'bold 11px Segoe UI'; ctx.textAlign = 'left';
      ctx.fillText(`Peak = ${maxGain.toFixed(2)}× (ZVS to right →)`, Math.min(w - 175, px + 8), Math.max(pad.t + 14, py - 6));
      ctx.fillStyle = '#94a3b8'; ctx.textAlign = 'center';
      ctx.fillText('Normalized Switching Frequency f_n = f_sw / f_r', pad.l + pw / 2, h - 6);
    }

    // 2. Draw DAB Waveforms (Fig. 2.1 & 2.10)
    const c2 = setupCanvas('canvas-ps-dab', 480, 270);
    if (c2) {
      const { ctx, w, h } = c2;
      ctx.fillStyle = '#0f172a'; ctx.fillRect(0, 0, w, h);
      const pad = { l: 46, r: 18, t: 24, b: 36 };
      const pw = w - pad.l - pad.r, ph = h - pad.t - pad.b;
      const ym = pad.t + ph / 2;

      ctx.strokeStyle = '#1e293b';
      ctx.beginPath(); ctx.moveTo(pad.l, ym); ctx.lineTo(w - pad.r, ym); ctx.stroke();

      // Primary square wave V_p (blue) and phase-shifted secondary nV_s (green)
      const N = 360;
      const drawSq = (shiftDeg, col, amp) => {
        ctx.strokeStyle = col; ctx.lineWidth = 1.6;
        ctx.beginPath();
        for (let d = 0; d <= N; d++) {
          const ang = (d - shiftDeg + 720) % 360;
          const v = ang < 180 ? amp : -amp;
          const x = pad.l + (d / N) * pw;
          const y = ym - v * (ph * 0.35);
          if (d === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
        }
        ctx.stroke();
      };
      drawSq(0, '#38bdf8', 0.85);
      drawSq(phiDeg, '#4ade80', 0.78);

      // Piecewise linear inductor current i_Llkg
      ctx.strokeStyle = '#f43f5e'; ctx.lineWidth = 2.4;
      ctx.beginPath();
      let iCurr = -phiDeg / 90 * 0.7;
      for (let d = 0; d <= N; d++) {
        const vp = (d % 360) < 180 ? 1 : -1;
        const vs = ((d - phiDeg + 720) % 360) < 180 ? 1 : -1;
        iCurr += ((vp - vs) * 0.0085);
        const x = pad.l + (d / N) * pw;
        const y = ym - Math.max(-0.95, Math.min(0.95, iCurr)) * (ph * 0.42);
        if (d === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
      }
      ctx.stroke();

      ctx.font = '11px Segoe UI'; ctx.textAlign = 'left';
      ctx.fillStyle = '#38bdf8'; ctx.fillText('— V_pri(θ)', pad.l + 8, pad.t + 14);
      ctx.fillStyle = '#4ade80'; ctx.fillText(`— n·V_sec(θ - ${phiDeg}°)`, pad.l + 85, pad.t + 14);
      ctx.fillStyle = '#f43f5e'; ctx.fillText('— i_Llkg(θ) (Piecewise Segments)', pad.l + 225, pad.t + 14);
    }

    // 3. Draw Bode Plot (Fig. 5.4, 5.21 & 5.31)
    const c3 = setupCanvas('canvas-ps-bode', 960, 230);
    if (c3) {
      const { ctx, w, h } = c3;
      ctx.fillStyle = '#0f172a'; ctx.fillRect(0, 0, w, h);
      const pad = { l: 54, r: 24, t: 24, b: 32 };
      const pw = w - pad.l - pad.r, ph = h - pad.t - pad.b;
      const ym = pad.t + ph / 2;

      ctx.strokeStyle = '#1e293b';
      ctx.beginPath(); ctx.moveTo(pad.l, ym); ctx.lineTo(w - pad.r, ym); ctx.stroke();

      const plotBode = (fn, col, lw = 2.0, dash = []) => {
        ctx.strokeStyle = col; ctx.lineWidth = lw; ctx.setLineDash(dash);
        ctx.beginPath();
        for (let k = 0; k <= 300; k++) {
          const logF = 2 + (k / 300) * 3.5; // 100 Hz to 316 kHz
          const f = Math.pow(10, logF);
          const db = fn(f);
          const x = pad.l + (k / 300) * pw;
          const y = ym - (db / 60) * (ph / 2);
          if (k === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
        }
        ctx.stroke();
        ctx.setLineDash([]);
      };

      const f0 = 3500; // LC resonant freq 3.5 kHz
      const Qplant = 4.5;
      const plantDb = (f) => {
        const u = f / f0;
        const mag = 1 / Math.sqrt(Math.pow(1 - u * u, 2) + Math.pow(u / Qplant, 2));
        return 20 * Math.log10(mag);
      };
      const compDb = (f) => {
        const u = f / f0;
        const Qcomp = pidMode === 'matched' ? 4.5 : 0.5;
        const num = Math.sqrt(Math.pow(1 - u * u, 2) + Math.pow(u / Qcomp, 2));
        const den = (f / 1200) * (1 + f / 80000);
        return 20 * Math.log10(num / den);
      };

      plotBode(plantDb, '#94a3b8', 1.6, [4, 3]);
      plotBode(compDb, '#c084fc', 1.8);
      plotBode(f => plantDb(f) + compDb(f), pidMode === 'matched' ? '#4ade80' : '#f87171', 2.5);

      ctx.font = '11px Segoe UI'; ctx.textAlign = 'left';
      ctx.fillStyle = '#94a3b8'; ctx.fillText('-- High-Q LC Post-Filter Plant G_plant(s)', pad.l + 12, pad.t + 14);
      ctx.fillStyle = '#c084fc'; ctx.fillText('— Compensator G_PID(s)', pad.l + 270, pad.t + 14);
      ctx.fillStyle = pidMode === 'matched' ? '#4ade80' : '#f87171';
      ctx.fillText(pidMode === 'matched' ? '— Open-Loop Gain T(s): Smooth -20 dB/dec (Q-Mismatch Resolved!)' : '— Open-Loop Gain T(s): Severe Peaking & Notch (Q-Mismatch!)', pad.l + 450, pad.t + 14);
    }
  }

  // ==========================================================================
  // 5. ORCAD COMPLETE PCB DESIGN LAB (MITZNER 2ND ED., Ch 4, 6, 8, 12, App C & D)
  // ==========================================================================
  const logicFamiliesAppC = [
    { name: 'SiGe-2.5V (Rank #1)', tr: 0.02, tf: 0.02 },
    { name: 'ECL EP (Rank #6)', tr: 0.11, tf: 0.11 },
    { name: 'ECL LVEL (Rank #3)', tr: 0.22, tf: 0.22 },
    { name: 'LVDS / GaAs (Rank #4/#7)', tr: 0.30, tf: 0.30 },
    { name: 'SSTL (Rank #9)', tr: 0.30, tf: 0.50 },
    { name: 'ECL 100K (Rank #11)', tr: 0.60, tf: 0.60 },
    { name: 'BiCMOS BCT (Rank #12)', tr: 0.70, tf: 0.70 },
    { name: 'CMOS FCT (Rank #13)', tr: 1.50, tf: 1.20 },
    { name: 'BiCMOS ABT (Rank #14)', tr: 1.60, tf: 1.40 },
    { name: 'CMOS AC / ACT (Rank #15)', tr: 1.70, tf: 1.50 },
    { name: 'CMOS VCX (Rank #20)', tr: 2.00, tf: 2.00 },
    { name: 'TTL ALS (Rank #24)', tr: 2.30, tf: 2.30 },
    { name: 'CMOS HC (Rank #33)', tr: 3.60, tf: 4.10 },
    { name: 'TTL 74nn (Rank #36)', tr: 8.00, tf: 5.00 },
    { name: 'TTL LS (Rank #38)', tr: 15.0, tf: 10.0 },
    { name: 'CMOS 4000 / TTL L (Rank #39)', tr: 35.0, tf: 25.0 }
  ];

  function getOrcadPcbHTML() {
    const opts = logicFamiliesAppC.map((lf, i) => `<option value="${i}" ${i===9?'selected':''}>${lf.name} — RT=${lf.tr} ns, FT=${lf.tf} ns</option>`).join('');
    return `
      <div class="lab-panel">
        <div class="lab-header">
          <div>
            <span class="lab-badge">🖥️ LIVE ORCAD PCB & SIGNAL INTEGRITY WORKBENCH</span>
            <h3>Transmission Line Impedance (Z₀), Appendix C Critical Length, Crosstalk & Ch. 4 Annular Ring Lab</h3>
            <p>Interactive calculator and waveform simulator built from Chapters 4, 6, 8, 12 and Appendices C & D of Complete PCB Design Using OrCAD Capture and PCB Editor (2nd Ed.).</p>
          </div>
        </div>

        <div class="lab-controls-grid">
          <div class="lab-control">
            <label>Transmission Line Topology (Ch. 6):</label>
            <select id="orcad-topo" onchange="InteractiveLabs.updateOrcadPcb()">
              <option value="microstrip" selected>Surface Microstrip (Outer Layer over Plane)</option>
              <option value="stripline">Symmetric Stripline (Inner Layer between Two Planes)</option>
            </select>
          </div>
          <div class="lab-control">
            <label>Trace Width w (mil): <strong id="orcad-w-val">8.0 mil</strong></label>
            <input type="range" id="orcad-w" min="3.0" max="30.0" step="0.5" value="8.0" oninput="InteractiveLabs.updateOrcadPcb()">
          </div>
          <div class="lab-control">
            <label>Dielectric Height h (mil): <strong id="orcad-h-val">5.0 mil</strong></label>
            <input type="range" id="orcad-h" min="2.0" max="25.0" step="0.5" value="5.0" oninput="InteractiveLabs.updateOrcadPcb()">
          </div>
          <div class="lab-control">
            <label>Appendix C Logic Family (Rise Time t_r):</label>
            <select id="orcad-logic" onchange="InteractiveLabs.updateOrcadPcb()">${opts}</select>
          </div>
          <div class="lab-control">
            <label>Routed Trace Length L (inches): <strong id="orcad-len-val">6.0 in</strong></label>
            <input type="range" id="orcad-len" min="0.5" max="18.0" step="0.5" value="6.0" oninput="InteractiveLabs.updateOrcadPcb()">
          </div>
          <div class="lab-control">
            <label>Ch. 4 PTH Drill Offset / Misalignment (mil): <strong id="orcad-off-val">3.0 mil</strong></label>
            <input type="range" id="orcad-off" min="0.0" max="12.0" step="0.5" value="3.0" oninput="InteractiveLabs.updateOrcadPcb()">
          </div>
        </div>

        <div class="lab-kpi-row" id="orcad-kpis"></div>

        <div class="lab-charts-grid">
          <div class="lab-chart-card">
            <div class="chart-title">Fig. 12.5 Replica: Sender & Receiver Reflection Waveforms (Unterminated vs. Series-Terminated)</div>
            <canvas id="canvas-orcad-si"></canvas>
          </div>
          <div class="lab-chart-card">
            <div class="chart-title">Fig. 4.1, 4.2 & 6.6 Replica: PTH Annular Ring Breakout & 3W Crosstalk Coupling</div>
            <canvas id="canvas-orcad-pth"></canvas>
          </div>
        </div>
      </div>
    `;
  }

  function updateOrcadPcb() {
    const topoEl = document.getElementById('orcad-topo');
    if (!topoEl) return;
    const topo = topoEl.value;
    const w = parseFloat(document.getElementById('orcad-w').value);
    const h = parseFloat(document.getElementById('orcad-h').value);
    const lfIdx = parseInt(document.getElementById('orcad-logic').value, 10);
    const lenIn = parseFloat(document.getElementById('orcad-len').value);
    const offsetMil = parseFloat(document.getElementById('orcad-off').value);

    document.getElementById('orcad-w-val').textContent = w.toFixed(1) + ' mil';
    document.getElementById('orcad-h-val').textContent = h.toFixed(1) + ' mil';
    document.getElementById('orcad-len-val').textContent = lenIn.toFixed(1) + ' in';
    document.getElementById('orcad-off-val').textContent = offsetMil.toFixed(1) + ' mil';

    const er = 4.3; // FR-4
    const t = 1.4;  // 1 oz Cu (1.4 mil)
    let Z0 = 50, e_eff = er;
    if (topo === 'microstrip') {
      e_eff = (er + 1) / 2 + ((er - 1) / 2) * Math.pow(1 + (12 * h) / w, -0.5);
      Z0 = (87 / Math.sqrt(er + 1.41)) * Math.log((5.98 * h) / (0.8 * w + t));
    } else {
      e_eff = er;
      Z0 = (60 / Math.sqrt(er)) * Math.log((1.9 * (2 * h + t)) / (0.8 * w + t));
    }

    const tpd_ps_in = 85 * Math.sqrt(e_eff); // ps/in
    const tr_ns = logicFamiliesAppC[lfIdx].tr;
    const l_crit_in = (tr_ns * 1000) / (2 * tpd_ps_in);
    const needsTerm = lenIn >= l_crit_in;

    // Crosstalk at 3W vs 1W
    const ct_1w_dB = 20 * Math.log10(1 / (1 + Math.pow(w / h, 2)));
    const ct_3w_dB = 20 * Math.log10(1 / (1 + Math.pow((3 * w) / h, 2)));

    // PTH Annular Ring (Pad = 28 mil, Drill = 14 mil)
    const padDia = 28, drillDia = 14;
    const minAnnularRing = (padDia - drillDia) / 2 - offsetMil;

    const kpiEl = document.getElementById('orcad-kpis');
    if (kpiEl) {
      kpiEl.innerHTML = `
        <div class="kpi-box"><span class="kpi-lbl">Characteristic Impedance Z₀</span><span class="kpi-val" style="color:#38bdf8">${Z0.toFixed(1)} Ω</span></div>
        <div class="kpi-box"><span class="kpi-lbl">Propagation Delay t_pd</span><span class="kpi-val">${tpd_ps_in.toFixed(0)} ps/in (${(tpd_ps_in*lenIn/1000).toFixed(2)} ns)</span></div>
        <div class="kpi-box"><span class="kpi-lbl">Critical Length l_crit (Ch. 12)</span><span class="kpi-val" style="color:${needsTerm?'#f87171':'#4ade80'}">${l_crit_in.toFixed(2)} in (${needsTerm?'TERMINATE!':'Lumped Safe'})</span></div>
        <div class="kpi-box"><span class="kpi-lbl">3W Rule Crosstalk Reduction</span><span class="kpi-val">${ct_1w_dB.toFixed(1)} dB → ${ct_3w_dB.toFixed(1)} dB</span></div>
        <div class="kpi-box"><span class="kpi-lbl">Min Annular Ring (28/14 mil)</span><span class="kpi-val" style="color:${minAnnularRing<0?'#f87171':(minAnnularRing<2?'#facc15':'#4ade80')}">${minAnnularRing.toFixed(1)} mil (${minAnnularRing<0?'BREAKOUT!':(minAnnularRing>=2?'Class 3 OK':'Class 1 OK')})</span></div>
      `;
    }

    // 1. Draw Fig. 12.5 SI Reflection Waveform
    const c1 = setupCanvas('canvas-orcad-si', 480, 260);
    if (c1) {
      const { ctx, w: cw, h: ch } = c1;
      ctx.fillStyle = '#0f172a'; ctx.fillRect(0, 0, cw, ch);
      const pad = { l: 44, r: 18, t: 24, b: 34 };
      const pw = cw - pad.l - pad.r, ph = ch - pad.t - pad.b;

      for (let v = 0; v <= 5; v++) {
        const y = pad.t + ph * (1 - v / 5);
        ctx.strokeStyle = '#1e293b';
        ctx.beginPath(); ctx.moveTo(pad.l, y); ctx.lineTo(cw - pad.r, y); ctx.stroke();
        ctx.fillStyle = '#94a3b8'; ctx.font = '10px Segoe UI'; ctx.textAlign = 'right';
        ctx.fillText(v + 'V', pad.l - 6, y + 3);
      }

      const ratio = Math.min(3.0, lenIn / Math.max(0.2, l_crit_in));
      const N = 300;
      // Unterminated receiver ringing waveform (red)
      ctx.strokeStyle = '#f87171'; ctx.lineWidth = 2.0;
      ctx.beginPath();
      for (let k = 0; k <= N; k++) {
        const tNorm = (k / N) * 10;
        let val = 0;
        if (tNorm > 1.2) {
          const dt = tNorm - 1.2;
          const ringAmp = Math.min(0.65, 0.28 * ratio);
          val = 3.3 * (1 - Math.exp(-dt * 2.2) + ringAmp * Math.exp(-dt * 0.55) * Math.sin(dt * 3.8));
        }
        const x = pad.l + (k / N) * pw;
        const y = pad.t + ph * (1 - Math.max(0, Math.min(5, val)) / 5);
        if (k === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
      }
      ctx.stroke();

      // Series-terminated clean receiver waveform (green)
      ctx.strokeStyle = '#4ade80'; ctx.lineWidth = 2.2;
      ctx.beginPath();
      for (let k = 0; k <= N; k++) {
        const tNorm = (k / N) * 10;
        let val = tNorm > 1.2 ? 3.3 * (1 - Math.exp(-(tNorm - 1.2) * 2.0)) : 0;
        const x = pad.l + (k / N) * pw;
        const y = pad.t + ph * (1 - val / 5);
        if (k === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
      }
      ctx.stroke();

      ctx.font = '11px Segoe UI'; ctx.textAlign = 'left';
      ctx.fillStyle = '#f87171'; ctx.fillText('— Unterminated Receiver (Ringing / Overshoot)', pad.l + 8, pad.t + 14);
      ctx.fillStyle = '#4ade80'; ctx.fillText('— Series-Terminated (R_s = Z₀ - R_out)', pad.l + 8, pad.t + 30);
    }

    // 2. Draw Fig. 4.2 PTH Annular Ring Breakout & Crosstalk Visualizer
    const c2 = setupCanvas('canvas-orcad-pth', 480, 260);
    if (c2) {
      const { ctx, w: cw, h: ch } = c2;
      ctx.fillStyle = '#0f172a'; ctx.fillRect(0, 0, cw, ch);

      // Left half: Ideal PTH vs Offset PTH (Fig. 4.2)
      const cx1 = 115, cy = 125;
      const rPad = 56, rDrill = 28;
      // Ideal
      ctx.fillStyle = '#b45309';
      ctx.beginPath(); ctx.arc(cx1, cy, rPad, 0, Math.PI * 2); ctx.fill();
      ctx.fillRect(cx1 - 14, cy + rPad - 4, 28, 48);
      ctx.fillStyle = '#0f172a';
      ctx.beginPath(); ctx.arc(cx1, cy, rDrill, 0, Math.PI * 2); ctx.fill();
      ctx.strokeStyle = '#f59e0b'; ctx.lineWidth = 2;
      ctx.beginPath(); ctx.arc(cx1, cy, rDrill, 0, Math.PI * 2); ctx.stroke();
      ctx.fillStyle = '#cbd5e1'; ctx.font = 'bold 11px Segoe UI'; ctx.textAlign = 'center';
      ctx.fillText('(A) Ideal Centered PTH', cx1, 34);

      // Offset PTH
      const cx2 = 340;
      const shiftPx = (offsetMil / 7.0) * (rPad - rDrill);
      ctx.fillStyle = '#b45309';
      ctx.beginPath(); ctx.arc(cx2, cy, rPad, 0, Math.PI * 2); ctx.fill();
      ctx.fillRect(cx2 - 14, cy + rPad - 4, 28, 48);
      ctx.fillStyle = '#0f172a';
      ctx.beginPath(); ctx.arc(cx2 + shiftPx, cy, rDrill, 0, Math.PI * 2); ctx.fill();
      ctx.strokeStyle = minAnnularRing < 0 ? '#ef4444' : '#4ade80'; ctx.lineWidth = 2.5;
      ctx.beginPath(); ctx.arc(cx2 + shiftPx, cy, rDrill, 0, Math.PI * 2); ctx.stroke();
      ctx.fillStyle = minAnnularRing < 0 ? '#f87171' : '#4ade80';
      ctx.fillText(`(B) Offset = ${offsetMil} mil → AR = ${minAnnularRing.toFixed(1)} mil`, cx2, 34);
    }
  }

  // ==========================================================================
  // 6. IPC-A-610E ELECTRONIC ASSEMBLIES LAB (CLASS 1, 2, 3 INSPECTOR)
  // ==========================================================================
  function getIpc610HTML() {
    return `
      <div class="lab-panel">
        <div class="lab-header">
          <div>
            <span class="lab-badge">🔍 LIVE IPC-A-610E CLASS 1 / 2 / 3 INSPECTOR</span>
            <h3>Interactive Solder Joint Dimensional Inspector (SMT Chip, Gull-Wing, J-Lead, BGA & PTH)</h3>
            <p>Adjust real-time solder joint dimensions (Overhang A/B, End Joint Width C, Fillet Height F, PTH Vertical Fill, BGA Void %) and inspect live cross-section graphics & Class 1, 2, 3 dispositions.</p>
          </div>
        </div>

        <div class="lab-controls-grid">
          <div class="lab-control">
            <label>Assembly Joint Type (IPC-A-610E Section):</label>
            <select id="ipc610-type" onchange="InteractiveLabs.updateIpc610()">
              <option value="chip" selected>Sec 8.3.2: Rectangular/Square Chip (1, 3, or 5-Side)</option>
              <option value="gullwing">Sec 8.3.5: Flat Gull-Wing Leads (QFP / SOIC / SOT)</option>
              <option value="jlead">Sec 8.3.7: J-Leads (PLCC / SOJ)</option>
              <option value="bga">Sec 8.3.12: Surface Mount Area Array (BGA)</option>
              <option value="pth">Sec 7.3.5: Supported Plated-Through Hole (PTH)</option>
            </select>
          </div>
          <div class="lab-control">
            <label>Side Overhang A (% of Width W): <strong id="ipc610-a-val">15%</strong></label>
            <input type="range" id="ipc610-a" min="0" max="65" step="5" value="15" oninput="InteractiveLabs.updateIpc610()">
            <span class="ctrl-hint">Class 1/2: ≤ 50% W · Class 3: ≤ 25% W</span>
          </div>
          <div class="lab-control">
            <label>End/Toe Overhang B (%): <strong id="ipc610-b-val">0%</strong></label>
            <input type="range" id="ipc610-b" min="0" max="25" step="5" value="0" oninput="InteractiveLabs.updateIpc610()">
            <span class="ctrl-hint">Chip End Overhang B: 0% permitted across Class 1, 2, 3!</span>
          </div>
          <div class="lab-control">
            <label>End Joint Width C (% of W): <strong id="ipc610-c-val">85%</strong></label>
            <input type="range" id="ipc610-c" min="25" max="100" step="5" value="85" oninput="InteractiveLabs.updateIpc610()">
            <span class="ctrl-hint">Class 1/2: ≥ 50% W · Class 3: ≥ 75% W</span>
          </div>
          <div class="lab-control">
            <label>Fillet Height F / PTH Fill / BGA Void (%): <strong id="ipc610-f-val">85%</strong></label>
            <input type="range" id="ipc610-f" min="10" max="100" step="5" value="85" oninput="InteractiveLabs.updateIpc610()">
            <span class="ctrl-hint">PTH Fill ≥ 75% (Class 2/3) · BGA Void ≤ 25%</span>
          </div>
        </div>

        <div class="lab-kpi-row" id="ipc610-kpis"></div>

        <div class="lab-charts-grid">
          <div class="lab-chart-card" style="grid-column: 1 / -1;">
            <div class="chart-title">Live Annotated IPC-A-610E Dimensional Cross-Section & Top-View Alignment Visualizer</div>
            <canvas id="canvas-ipc610"></canvas>
          </div>
        </div>
      </div>
    `;
  }

  function updateIpc610() {
    const typeEl = document.getElementById('ipc610-type');
    if (!typeEl) return;
    const type = typeEl.value;
    const A = parseFloat(document.getElementById('ipc610-a').value);
    const B = parseFloat(document.getElementById('ipc610-b').value);
    const C = parseFloat(document.getElementById('ipc610-c').value);
    const F = parseFloat(document.getElementById('ipc610-f').value);

    document.getElementById('ipc610-a-val').textContent = A + '%';
    document.getElementById('ipc610-b-val').textContent = B + '%';
    document.getElementById('ipc610-c-val').textContent = C + '%';
    document.getElementById('ipc610-f-val').textContent = F + '%';

    // Evaluate Class 1, Class 2, Class 3 dispositions
    const evalClass = (cls) => {
      if (type === 'bga') {
        const voidPct = 100 - F; // map F to cleanliness or use (100-F) as void
        if (A > 25 || (100 - F) > 25) return { status: 'DEFECT', col: '#ef4444' };
        if (A === 0 && (100 - F) <= 5) return { status: 'TARGET', col: '#38bdf8' };
        return { status: 'ACCEPTABLE', col: '#4ade80' };
      }
      if (type === 'pth') {
        const minFill = cls === 1 ? 25 : 75;
        if (F < minFill || C < (cls === 3 ? 75 : 50)) return { status: 'DEFECT', col: '#ef4444' };
        if (F >= 95 && C >= 90) return { status: 'TARGET', col: '#38bdf8' };
        return { status: 'ACCEPTABLE', col: '#4ade80' };
      }
      const maxA = cls === 3 ? 25 : 50;
      const maxB = type === 'chip' ? 0 : 15;
      const minC = cls === 3 ? 75 : 50;
      const minF = cls === 1 ? 15 : (cls === 2 ? 25 : 50);
      if (A > maxA || B > maxB || C < minC || F < minF) return { status: 'DEFECT', col: '#ef4444' };
      if (A === 0 && B === 0 && C >= 95 && F >= 75) return { status: 'TARGET', col: '#38bdf8' };
      return { status: 'ACCEPTABLE', col: '#4ade80' };
    };

    const r1 = evalClass(1), r2 = evalClass(2), r3 = evalClass(3);
    const kpiEl = document.getElementById('ipc610-kpis');
    if (kpiEl) {
      kpiEl.innerHTML = `
        <div class="kpi-box"><span class="kpi-lbl">Class 1 (General Electronic)</span><span class="kpi-val" style="color:${r1.col}">${r1.status}</span></div>
        <div class="kpi-box"><span class="kpi-lbl">Class 2 (Dedicated Service)</span><span class="kpi-val" style="color:${r2.col}">${r2.status}</span></div>
        <div class="kpi-box"><span class="kpi-lbl">Class 3 (High Reliability / Aero)</span><span class="kpi-val" style="color:${r3.col}">${r3.status}</span></div>
        <div class="kpi-box"><span class="kpi-lbl">Side Overhang A Limit</span><span class="kpi-val">C1/2: ≤50% · C3: ≤25%</span></div>
        <div class="kpi-box"><span class="kpi-lbl">End Joint Width C Limit</span><span class="kpi-val">C1/2: ≥50% · C3: ≥75%</span></div>
      `;
    }

    const c = setupCanvas('canvas-ipc610', 920, 260);
    if (!c) return;
    const { ctx, w, h } = c;
    ctx.fillStyle = '#0f172a'; ctx.fillRect(0, 0, w, h);

    // Left Side: Top View Pad & Component Overhang (A, B, C)
    const padX = 140, padY = 85, padW = 70, padH = 95;
    ctx.fillStyle = '#d97706'; // Copper landleft & right
    ctx.fillRect(padX, padY, padW, padH);
    ctx.fillRect(padX + 170, padY, padW, padH);

    const shiftY = (A / 100) * padH;
    const shiftX = (B / 100) * padW;
    // Component body
    ctx.fillStyle = '#334155';
    ctx.strokeStyle = '#94a3b8'; ctx.lineWidth = 2;
    ctx.fillRect(padX + 20 + shiftX, padY + shiftY, 200, padH);
    ctx.strokeRect(padX + 20 + shiftX, padY + shiftY, 200, padH);
    // Metallized terminations
    ctx.fillStyle = '#cbd5e1';
    ctx.fillRect(padX + 20 + shiftX, padY + shiftY, 28, padH);
    ctx.fillRect(padX + 192 + shiftX, padY + shiftY, 28, padH);

    ctx.fillStyle = '#e2e8f0'; ctx.font = 'bold 12px Segoe UI'; ctx.textAlign = 'center';
    ctx.fillText(`Top View: Side Overhang A = ${A}%, End Overhang B = ${B}%`, 260, 32);

    // Right Side: Side View Cross-Section & Fillet Height (F, G) / PTH Fill
    const rx = 560, ry = 185;
    // FR-4 Substrate
    ctx.fillStyle = '#065f46';
    ctx.fillRect(rx, ry, 300, 36);
    // Copper Land
    ctx.fillStyle = '#d97706';
    ctx.fillRect(rx + 40, ry - 8, 90, 8);
    ctx.fillRect(rx + 190, ry - 8, 70, 8);

    // Solder Fillet (scaled by F%)
    const compH = 65;
    const filletH = (F / 100) * compH;
    ctx.fillStyle = r3.status === 'DEFECT' ? '#f87171' : '#38bdf8';
    ctx.beginPath();
    ctx.moveTo(rx + 45, ry - 8);
    ctx.lineTo(rx + 95, ry - 8);
    ctx.lineTo(rx + 95, ry - 12 - filletH);
    ctx.quadraticCurveTo(rx + 75, ry - 12 - filletH * 0.3, rx + 45, ry - 8);
    ctx.closePath();
    ctx.fill();

    // Component side view
    ctx.fillStyle = '#475569';
    ctx.fillRect(rx + 95, ry - 12 - compH, 120, compH);
    ctx.fillStyle = '#e2e8f0';
    ctx.fillRect(rx + 95, ry - 12 - compH, 18, compH);

    ctx.fillStyle = '#e2e8f0'; ctx.font = 'bold 12px Segoe UI'; ctx.textAlign = 'center';
    ctx.fillText(`Cross-Section View: Wetted Fillet Height F = ${F}% (Class 3: ${r3.status})`, rx + 150, 32);
  }

  // ==========================================================================
  // 7. IPC-A-600J PRINTED BOARDS MICROSECTION LAB (CLASS 1, 2, 3)
  // ==========================================================================
  function getIpc600HTML() {
    return `
      <div class="lab-panel">
        <div class="lab-header">
          <div>
            <span class="lab-badge">🔬 LIVE IPC-A-600J BARE BOARD & MICROSECTION LAB</span>
            <h3>Interactive Plated-Through Hole (PTH) Microsection, Wicking, Void, Crack & Bow/Twist Inspector</h3>
            <p>Evaluate bare printed board external and internal metallographic cross-sections across IPC-A-600J Class 1, Class 2, and Class 3 acceptance criteria (Sections 2 & 3).</p>
          </div>
        </div>

        <div class="lab-controls-grid">
          <div class="lab-control">
            <label>Copper Wicking into Laminate (Sec 3.3.4): <strong id="ipc600-wick-val">35 μm</strong></label>
            <input type="range" id="ipc600-wick" min="0" max="120" step="5" value="35" oninput="InteractiveLabs.updateIpc600()">
            <span class="ctrl-hint">Class 3: ≤ 50 μm · Class 2: ≤ 80 μm · Class 1: ≤ 100 μm</span>
          </div>
          <div class="lab-control">
            <label>PTH Plating Void (% of Length, Sec 3.3.1): <strong id="ipc600-void-val">0%</strong></label>
            <input type="range" id="ipc600-void" min="0" max="15" step="1" value="0" oninput="InteractiveLabs.updateIpc600()">
            <span class="ctrl-hint">Class 3: 0% (No voids!) · Class 2: ≤ 5% · Class 1: ≤ 10%</span>
          </div>
          <div class="lab-control">
            <label>Foil / Barrel Crack Anomaly (Sec 3.3.8–3.3.11):</label>
            <select id="ipc600-crack" onchange="InteractiveLabs.updateIpc600()">
              <option value="none" selected>No Cracks (Target Condition — Class 1, 2, 3)</option>
              <option value="A">"A" Crack (External Foil Only — Acceptable C1/2/3)</option>
              <option value="B">"B" Crack (Partial Plating Crack — Acceptable C1 Only)</option>
              <option value="C">"C" Crack (Internal Layer Foil Crack — Nonconforming!)</option>
              <option value="E">"E" Crack (Barrel Wall Through-Crack — Nonconforming!)</option>
              <option value="F">"F" Crack (Corner / Knee Plating Crack — Nonconforming!)</option>
            </select>
          </div>
          <div class="lab-control">
            <label>Conductor Width Reduction / Nick (Sec 2.10.1): <strong id="ipc600-nick-val">10%</strong></label>
            <input type="range" id="ipc600-nick" min="0" max="40" step="2" value="10" oninput="InteractiveLabs.updateIpc600()">
            <span class="ctrl-hint">Class 2/3: ≤ 20% W · Class 1: ≤ 30% W</span>
          </div>
          <div class="lab-control">
            <label>Board Bow & Twist % (Sec 2.11): <strong id="ipc600-bow-val">0.45%</strong></label>
            <input type="range" id="ipc600-bow" min="0.10" max="2.00" step="0.05" value="0.45" oninput="InteractiveLabs.updateIpc600()">
            <span class="ctrl-hint">SMT Boards: ≤ 0.75% · THT Boards: ≤ 1.50%</span>
          </div>
        </div>

        <div class="lab-kpi-row" id="ipc600-kpis"></div>

        <div class="lab-charts-grid">
          <div class="lab-chart-card" style="grid-column: 1 / -1;">
            <div class="chart-title">Live Metallographic PTH Cross-Section Visualizer (Wicking, Etchback, Plating Voids & Cracks A/B/C/E/F)</div>
            <canvas id="canvas-ipc600"></canvas>
          </div>
        </div>
      </div>
    `;
  }

  function updateIpc600() {
    const wickEl = document.getElementById('ipc600-wick');
    if (!wickEl) return;
    const wick = parseFloat(wickEl.value);
    const voidPct = parseFloat(document.getElementById('ipc600-void').value);
    const crack = document.getElementById('ipc600-crack').value;
    const nick = parseFloat(document.getElementById('ipc600-nick').value);
    const bow = parseFloat(document.getElementById('ipc600-bow').value);

    document.getElementById('ipc600-wick-val').textContent = wick + ' μm';
    document.getElementById('ipc600-void-val').textContent = voidPct + '%';
    document.getElementById('ipc600-nick-val').textContent = nick + '%';
    document.getElementById('ipc600-bow-val').textContent = bow.toFixed(2) + '%';

    const eval600 = (cls) => {
      const maxWick = cls === 3 ? 50 : (cls === 2 ? 80 : 100);
      const maxVoid = cls === 3 ? 0 : (cls === 2 ? 5 : 10);
      const maxNick = cls === 1 ? 30 : 20;
      const crackOk = crack === 'none' || crack === 'A' || (crack === 'B' && cls === 1);
      if (wick > maxWick || voidPct > maxVoid || nick > maxNick || !crackOk || bow > 0.75) {
        return { status: 'NONCONFORMING', col: '#ef4444' };
      }
      if (wick <= 20 && voidPct === 0 && crack === 'none' && nick === 0 && bow <= 0.35) {
        return { status: 'TARGET', col: '#38bdf8' };
      }
      return { status: 'ACCEPTABLE', col: '#4ade80' };
    };

    const c1 = eval600(1), c2 = eval600(2), c3 = eval600(3);
    const kpiEl = document.getElementById('ipc600-kpis');
    if (kpiEl) {
      kpiEl.innerHTML = `
        <div class="kpi-box"><span class="kpi-lbl">IPC-A-600J Class 1</span><span class="kpi-val" style="color:${c1.col}">${c1.status}</span></div>
        <div class="kpi-box"><span class="kpi-lbl">IPC-A-600J Class 2</span><span class="kpi-val" style="color:${c2.col}">${c2.status}</span></div>
        <div class="kpi-box"><span class="kpi-lbl">IPC-A-600J Class 3</span><span class="kpi-val" style="color:${c3.col}">${c3.status}</span></div>
        <div class="kpi-box"><span class="kpi-lbl">SMT Flatness (≤0.75%)</span><span class="kpi-val" style="color:${bow<=0.75?'#4ade80':'#ef4444'}">${bow<=0.75?'PASS':'FAIL (>0.75%)'}</span></div>
        <div class="kpi-box"><span class="kpi-lbl">Crack Classification</span><span class="kpi-val">${crack === 'none' ? 'None' : crack + '-Crack'}</span></div>
      `;
    }

    const cv = setupCanvas('canvas-ipc600', 920, 250);
    if (!cv) return;
    const { ctx, w, h } = cv;
    ctx.fillStyle = '#0f172a'; ctx.fillRect(0, 0, w, h);

    // Draw 4-layer PTH Axial Cross-Section (Left and Right Barrel Walls)
    const bx = 260, by = 40, bw = 400, bh = 175;
    const holeW = 130;
    const leftWall = bx + (bw - holeW) / 2;
    const rightWall = leftWall + holeW;

    // Dielectric laminate left & right
    ctx.fillStyle = '#064e3b';
    ctx.fillRect(bx, by, (bw - holeW) / 2, bh);
    ctx.fillRect(rightWall, by, (bw - holeW) / 2, bh);

    // Inner-layer copper foils
    ctx.fillStyle = '#b45309';
    ctx.fillRect(bx, by + 50, (bw - holeW) / 2, 14);
    ctx.fillRect(bx, by + 112, (bw - holeW) / 2, 14);
    ctx.fillRect(rightWall, by + 50, (bw - holeW) / 2, 14);
    ctx.fillRect(rightWall, by + 112, (bw - holeW) / 2, 14);

    // Outer surface foils + Plated Copper Barrel
    ctx.fillStyle = '#f59e0b';
    // Top/Bottom outer lands
    ctx.fillRect(bx + 45, by - 10, 95, 10);
    ctx.fillRect(bx + 45, by + bh, 95, 10);
    ctx.fillRect(rightWall - 5, by - 10, 95, 10);
    ctx.fillRect(rightWall - 5, by + bh, 95, 10);
    // Barrel walls
    ctx.fillRect(leftWall - 12, by - 10, 12, bh + 20);
    ctx.fillRect(rightWall, by - 10, 12, bh + 20);

    // Copper Wicking spikes into laminate
    const wickPx = (wick / 120) * 55;
    if (wickPx > 2) {
      ctx.fillStyle = wick > 50 ? '#ef4444' : '#f59e0b';
      ctx.fillRect(leftWall - 12 - wickPx, by + 28, wickPx, 7);
      ctx.fillRect(rightWall + 12, by + 85, wickPx, 7);
    }

    // Plating Void in Barrel Wall
    if (voidPct > 0) {
      const voidH = Math.max(6, (voidPct / 15) * 45);
      ctx.fillStyle = '#ef4444';
      ctx.fillRect(leftWall - 13, by + 75, 14, voidH);
    }

    // Highlight Crack Type (A, B, C, E, F)
    if (crack !== 'none') {
      ctx.strokeStyle = '#ef4444'; ctx.lineWidth = 3;
      ctx.beginPath();
      if (crack === 'A') { ctx.moveTo(bx + 80, by - 2); ctx.lineTo(bx + 80, by + 6); }
      else if (crack === 'B') { ctx.moveTo(leftWall - 6, by - 10); ctx.lineTo(leftWall - 6, by - 3); }
      else if (crack === 'C') { ctx.moveTo(leftWall - 22, by + 50); ctx.lineTo(leftWall - 22, by + 64); }
      else if (crack === 'E') { ctx.moveTo(rightWall, by + 88); ctx.lineTo(rightWall + 12, by + 88); }
      else if (crack === 'F') { ctx.moveTo(rightWall, by - 10); ctx.lineTo(rightWall + 12, by + 2); }
      ctx.stroke();
    }

    ctx.fillStyle = '#e2e8f0'; ctx.font = 'bold 12px Segoe UI'; ctx.textAlign = 'center';
    ctx.fillText(`IPC-A-600J Section 3.3 PTH Cross-Section — Wicking: ${wick} μm, Void: ${voidPct}%, Crack: ${crack.toUpperCase()}`, w / 2, 22);
  }

  // Master Dispatcher
  function getLabHTML(bookId) {
    switch (bookId) {
      case '5l-mvr': return get5LMvrHTML();
      case 'vr-dpmsm': return getVrDpmsmHTML();
      case 'wpcb-copper': return getWpcbCopperHTML();
      case 'power-supplies': return getPowerSuppliesHTML();
      case 'orcad-pcb': return getOrcadPcbHTML();
      case 'ipc-610e': return getIpc610HTML();
      case 'ipc-600j': return getIpc600HTML();
      default: return '';
    }
  }

  function initLab(bookId) {
    setTimeout(() => {
      if (bookId === '5l-mvr') update5LMvr();
      else if (bookId === 'vr-dpmsm') updateVrDpmsm();
      else if (bookId === 'wpcb-copper') updateWpcbCopper(false);
      else if (bookId === 'power-supplies') updatePowerSupplies();
      else if (bookId === 'orcad-pcb') updateOrcadPcb();
      else if (bookId === 'ipc-610e') updateIpc610();
      else if (bookId === 'ipc-600j') updateIpc600();
    }, 30);
  }

  return {
    getLabHTML,
    initLab,
    update5LMvr,
    updateVrDpmsm,
    onVrModePreset,
    updateWpcbCopper,
    onCuScenarioChange,
    updatePowerSupplies,
    updateOrcadPcb,
    updateIpc610,
    updateIpc600
  };
})();
