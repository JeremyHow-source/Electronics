# 🔋 Switching Power Supplies A to Z: Resonant (LLC), Dual Active Bridge (DAB) & Loop Compensation Playbook

> **Primary Reference**: S. Maniktala and N. Rosano, *"Switching Power Supplies A to Z (3rd Edition Add-On),"* Chapters 1–5.

---

## 1. Chapter 1: LLC Resonant Converter Design Workflow

The LLC resonant tank uses series inductance $L_r$, resonant capacitor $C_r$, and transformer magnetizing inductance $L_m$ ($\kappa = L_m / L_r$) to achieve **Zero-Voltage Switching (ZVS)** on primary MOSFETs and **Zero-Current Switching (ZCS)** on secondary rectifiers.

### 1.1 First-Harmonic Approximation (FHA) Voltage Gain
Define normalized frequency $f_n = f_{\text{sw}} / f_r$ where $f_r = \frac{1}{2\pi\sqrt{L_r C_r}}$, inductance ratio $\kappa = L_m / L_r$, and quality factor $Q = \frac{\sqrt{L_r / C_r}}{R_{ac}}$ with $R_{ac} = \frac{8 n^2}{\pi^2} R_{\text{load}}$:
$$M(f_n, \kappa, Q) = \frac{1}{\sqrt{\left(1 + \frac{1}{\kappa}\left(1 - \frac{1}{f_n^2}\right)\right)^2 + Q^2\left(f_n - \frac{1}{f_n}\right)^2}}$$

### 1.2 Practical LLC Design Rules
1. **Nominal Operation at $f_n = 1.0$ ($f_{\text{sw}} = f_r$)**: Gain is load-independent ($M = 1.0$), minimizing circulating tank current and maximizing efficiency.
2. **ZVS Inductive Region**: Always keep the minimum operating frequency above the peak gain boundary ($f_{\text{min}} > f_{\text{peak}}(Q_{\text{max}})$) so tank current lags tank voltage ($\text{ZVS}$). Entering the capacitive region causes shoot-through and body-diode reverse-recovery failure.
3. **Choosing $\kappa = L_m / L_r$**: Smaller $\kappa$ ($3\text{--}5$) gives higher boost gain for wide input/hold-up range, at the cost of higher magnetizing circulating current.

---

## 2. Chapter 2: Dual Active Bridge (DAB) Bidirectional Power Transfer

The DAB connects two full bridges across an isolated high-frequency transformer with total leakage inductance $L_s$ and phase-shift angle $\phi$ (Single-Phase Shift, SPS):
$$P_{\text{DAB}}(\phi) = \frac{n V_{\text{in}} V_{\text{out}}}{2 \pi^2 f_{\text{sw}} L_s}\,\phi\left(\pi - |\phi|\right), \qquad -\frac{\pi}{2} \le \phi \le \frac{\pi}{2}$$

- **Peak Power**: Occurs at $|\phi| = 90^\circ$ ($\pi/2$), though practical designs operate at $|\phi| \le 45^\circ\text{--}60^\circ$ to limit RMS circulating current.
- **ZVS Boundary**: Full-range ZVS on both bridges is naturally achieved when the voltage conversion ratio $d = \frac{n V_{\text{out}}}{V_{\text{in}}} \approx 1.0$. At light load or $d \neq 1$, Triangular/Trapezoidal or Dual/Triple Phase Shift (DPS/TPS) restores ZVS.

---

## 3. Chapters 3–5: Small-Signal Modeling, Type-III Compensation & Digital PID Q-Matching

### 3.1 Voltage-Mode Buck Plant ($L C$ Filter)
$$G_{vd}(s) = V_{\text{in}} \frac{1 + s R_{\text{ESR}} C}{1 + s\left(\frac{L}{R_{\text{load}}} + R_{\text{ESR}} C\right) + s^2 L C}, \qquad f_0 = \frac{1}{2\pi\sqrt{L C}}, \qquad f_{\text{ESR}} = \frac{1}{2\pi R_{\text{ESR}} C}$$

### 3.2 K-Factor Type-III Compensator Placement
For a target crossover frequency $f_c$ and phase boost $\phi_{\text{boost}}$:
1. Place an integrator pole at $f = 0$ for zero steady-state DC error.
2. Place **two zeros** at $f_z = f_c / \sqrt{K}$ (typically near $0.5 f_0\text{--}0.8 f_0$) to cancel the $-180^\circ$ phase drop of the LC double pole.
3. Place **two high-frequency poles** at $f_p = f_c \sqrt{K}$ (one cancelling $f_{\text{ESR}}$, one attenuating $f_{\text{sw}}/2$ switching ripple).

### 3.3 Digital PID Q-Matching for Light-Load High-$Q$ LC Filters
Analog Type-III compensators only synthesize real zeros ($Q \le 0.5$). At light load, a low-ESR LC filter has $Q_{\text{plant}} \gg 0.5$, creating a sharp phase dip. In a digital PID controller, $K_P, K_I, K_D$ are independent and can synthesize **complex conjugate zeros** with $Q_{\text{PID}} = Q_{\text{plant}}$:
$$\omega_0 = \sqrt{\frac{K_I}{K_D}}, \qquad Q_{\text{PID}} = \frac{\sqrt{K_I K_D}}{K_P}$$
Use the **3-Tab Interactive Lab** above to plot LLC gain curves, DAB $200\text{ kW}$ waveforms, and Type-III Bode margins in real time.
