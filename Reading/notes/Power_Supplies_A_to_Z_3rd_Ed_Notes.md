# 🔋 Switching Power Supplies A to Z (3rd Edition Add-On) — Resonant LLC/WPT, Dual Active Bridge, PWM Switch & Digital PID Control

> **Authors**: Sanjaya Maniktala and Nicola Rosano (ISBN: `9798588905015`, 305 Pages, 5 Chapters)
> **Source PDF**: [Power Supplies A to Z 3rd Edition Maniktala Rosano.pdf](Reading/Power%20Supplies%20A%20to%20Z%203rd%20Edition%20Maniktala%20Rosano.pdf)

---

## 1. Master Architecture & Chapter Overview

| Chapter | Title | Core Engineering Focus & Analytical Highlights | Pages |
| :--- | :--- | :--- | :--- |
| **Ch. 1** | **Resonant Power: LC to WPT & LLC** | Parallel/Series LC energy sloshing ($\frac{1}{2}LI^2 \iff \frac{1}{2}CV^2$), First Harmonic Approximation (FHA), why WPT is a loosely-coupled LLC (and why secondary series $C_s$ "double resonator" fails!), resonant peak shift locus, 900W wide-input LLC design, Universal Scaling Curves ($m = L_2/L_1$), discrete & hybrid frequency/phase-shift modulators | pp. 8–77 |
| **Ch. 2** | **The Dual Active Bridge (DAB)** | Isolated bidirectional DC-DC topology, transformer leakage inductance $L_{\text{lkg}}$ energy transfer, 8-segment piecewise linear inductor current analysis (Case 1: $D_1+D_2 \ge 1$ vs. Case 2: $D_1+D_2 < 1$), SIMPLIS & Mathcad validation, ZVS boundaries, 200 kW EV/grid DAB design | pp. 78–119 |
| **Ch. 3** | **Small Signal Modeling (Guest Chapter)** | Vorpérian 3-terminal invariant PWM switch cell in Voltage Mode (VMC) & Peak Current Mode Control (PCMC), subharmonic instability & slope compensation ramp, audiosusceptibility $G_{vg}(s)$ & control-to-output $G_{vd}(s)$ in TINA/SPICE & Octave | pp. 120–185 |
| **Ch. 4** | **Loop Compensation & Bench Bode Analysis** | Inductor re-initialization during load transients, voltage positioning, Type 1 / Type 2 / Type 3 analog compensators, $k$-factor vs. manual pole-zero placement, Buck/Boost/Buck-Boost VMC & CMC plant transfer functions, closed-loop bench Bode injection | pp. 186–238 |
| **Ch. 5** | **PID and Digital Control Loops** | High-$Q$ LC post-filter ringing & conditional stability at light load, Laplace/Z-domain pole-zero splitting ($Q < 0.5$ vs. $Q > 0.5$), the **Grand Analogy** between capacitor impedance $Z_C(s) = R_{\text{ESR}} + \frac{1}{sC} + sL_{\text{ESL}}$ and PID controller $G_{\text{PID}}(s) = K_P + \frac{K_I}{s} + sK_D$, **Q-Mismatch Resolution** | pp. 239–305 |

---

## 2. Chapter 1: Resonant Power — From LC Tank to LLC & Wireless Power Transfer (WPT)

### 2.1 LC Tank Energy Exchange & First Harmonic Approximation (FHA)
At the natural resonant frequency $f_0 = \frac{1}{2\pi\sqrt{LC}}$, inductive reactance $X_L = 2\pi f_0 L$ matches capacitive reactance $X_C = \frac{1}{2\pi f_0 C}$, and stored energy sloshes continuously between $L$ and $C$:
$$\frac{1}{2}L I_{\text{pk}}^2 \Longleftrightarrow \frac{1}{2}C V_{\text{pk}}^2, \qquad Z_0 = \sqrt{\frac{L}{C}}, \qquad f_0 = \frac{1}{2\pi\sqrt{LC}}$$

![Figure 1.1: How inductors and capacitors store and return energy, and how they pair up.](Reading/figures/ps_fig1_1_lc_energy.png)

### 2.2 Why WPT Is an LLC — And the "Double Resonator" ($C_s$) Trap
Maniktala demonstrates that a Wireless Power Transfer (WPT) coupled-coil system is electrically identical to an **LLC resonant converter** where the magnetizing inductance is $L_m = k L_p$ and leakage inductance is $L_r = (1-k)L_p$:
- Using the **First Harmonic Approximation (FHA)**, the AC equivalent load resistance reflected to the tank is:
$$R_{ac} = \frac{8}{\pi^2} n^2 R_{\text{load}} \approx 0.8106\,n^2 R_{\text{load}}$$
- **The WPT "Double Resonator" Mistake (Fig. 1.5 & Fig. 1.9)**: Adding a secondary-side resonant capacitor $C_s$ creates a 4-element double resonator with **two wildly shifting gain peaks** that cause frequency-modulated control loops to lose monotonic "Direction of Correction" (DoC) and lock up! Eliminating $C_s$ reduces WPT to a well-behaved 3-element LLC tank.

![Figure 1.5: Equivalent diagram of LLC and (correct) WPT.](Reading/figures/ps_fig1_5_llc_wpt_equiv.png)

![Figure 1.7: Varying load in an LLC causes a resonant peak frequency shift depending on coupling.](Reading/figures/ps_fig1_7_llc_freq_shift.png)

![Figure 1.9: Mathcad plot of gain for an LLC without Cs (top: clean single peak) vs. with secondary-side capacitor Cs (bottom: chaotic double-resonator peak splitting).](Reading/figures/ps_fig1_9_llc_gain_plot.png)

### 2.3 LLC Voltage Gain Equation & Resonant Peak Locus (900W Design Example)
Defining normalized frequency $f_n = f_{sw} / f_r$, inductance ratio $m = L_p / L_r$, and quality factor $Q = \frac{\sqrt{L_r / C_r}}{R_{ac}}$, the LLC voltage gain magnitude is:
$$M(f_n, Q, m) = \frac{1}{\sqrt{\left(1 + \frac{1}{m} - \frac{1}{m f_n^2}\right)^2 + Q^2\left(f_n - \frac{1}{f_n}\right)^2}}$$
In the **900W Wide-Input LLC Design Example** ($L_p = 57.2\text{ }\mu\text{H}$, $C_p = 225.8\text{ nF}$), operating slightly to the **right of the resonant peak** ($f_{sw} > f_{\text{peak}}$) guarantees inductive tank current for **Zero-Voltage Switching (ZVS)** of the primary half-bridge MOSFETs.

![Figure 1.11: The locus of the elusive resonant peak as load R varies.](Reading/figures/ps_fig1_11_resonant_peak_locus.png)

![Figure 1.12: 900W LLC Design Validation via Simulations.](Reading/figures/ps_fig1_12_900w_llc_sim.png)

![Figure 1.27: Universal LLC Design Curves (m = L2/L1) for target gain > 1.](Reading/figures/ps_fig1_27_universal_llc_curves.png)

---

## 3. Chapter 2: The Dual Active Bridge (DAB)

The **Dual Active Bridge (DAB)** places two active full bridges across a high-frequency isolation transformer with series leakage inductance $L_{\text{lkg}}$. Power flow magnitude and direction are controlled by the primary duty ratio $D_1$ ($\text{Angle 1}$), secondary duty ratio $D_2$ ($\text{Angle 2}$), and inter-bridge phase shift $\phi$:
- **Single Phase-Shift (SPS) Power Transfer Equation** ($D_1 = D_2 = 1$, phase shift $\phi \in [-\pi, \pi]$):
$$P_{\text{DAB}} = \frac{n V_{\text{in}} V_{\text{out}}\,\phi(\pi - |\phi|)}{2\pi^2 f_{sw} L_{\text{lkg}}}$$
- **Piecewise 8-Segment Inductor Current Formulation**: In each switching period $T_{sw}$, the voltage across $L_{\text{lkg}}$ steps through 8 distinct intervals ($V_{L,k} = V_{\text{pri},k} - n V_{\text{sec},k}$), producing 8 linear current segments $\Delta I_k = \frac{V_{L,k}}{L_{\text{lkg}}}\Delta t_k$ under steady-state volt-second balance ($\sum_{k=1}^8 \Delta I_k = 0$).

![Figure 2.1 & 2.2: The Dual Active Bridge schematic and timing diagram.](Reading/figures/ps_fig2_1_dab_schematic_timing.png)

![Figure 2.10: The eight linear current segments of Case 1 in the DAB.](Reading/figures/ps_fig2_10_dab_eight_segments.png)

![Figure 2.24: SIMPLIS simulation of 200 kW DAB converter.](Reading/figures/ps_fig2_24_dab_200kw_sim.png)

---

## 4. Chapters 3–5: Small-Signal PWM Switch, Type 3 Compensation & PID Q-Matching

### 4.1 Vorpérian 3-Terminal PWM Switch & Peak Current Mode Control (Ch. 3)
Replacing the non-linear active/passive switch pair with the invariant 3-terminal **Active (A) – Passive (P) – Common (C)** PWM switch cell yields exact small-signal AC models for Buck, Boost, and Buck-Boost converters in both **Voltage Mode Control (VMC)** and **Peak Current Mode Control (PCMC)**.
- In **PCMC**, subharmonic oscillation occurs for $D > 0.5$ unless stabilizing **artificial ramp slope compensation $m_a$** is added:
$$m_a \ge \frac{1}{2} m_2 \quad \text{(for deadbeat response)}, \qquad Q_p = \frac{1}{\pi\left(m_c D' - 0.5\right)}$$

![Figure 3.6: AC three-terminal invariant PWM switch cell for Voltage Mode CCM.](Reading/figures/ps_fig3_6_pwm_switch_vm_ccm.png)

![Figure 3.17: Universal Peak Current Mode Control (PCMC) small-signal model.](Reading/figures/ps_fig3_17_pcmc_small_signal.png)

### 4.2 Plant Transfer Functions & Type 3 Analog Compensation (Ch. 4)
For a Voltage-Mode Buck converter, the LC output filter introduces a double pole at $f_0 = \frac{1}{2\pi\sqrt{LC}}$ (with quality factor $Q_{\text{plant}}$) and an ESR zero at $f_{\text{esr}} = \frac{1}{2\pi R_{\text{ESR}} C}$:
$$G_{vd}(s) = \frac{V_{\text{in}}}{V_{\text{ramp}}}\cdot\frac{1 + s R_{\text{ESR}} C}{1 + s\left(\frac{L}{R_{\text{load}}} + R_{\text{ESR}}C + R_{\text{DCR}}C\right) + s^2 L C \left(1 + \frac{R_{\text{ESR}}}{R_{\text{load}}}\right)}$$

![Figure 4.23 & 4.24: Type 3 compensator equations, strategy, and Bode response.](Reading/figures/ps_fig4_23_type3_compensator.png)

![Figure 4.31: Buck converter in Voltage Mode Control (VMC) plant transfer function summary.](Reading/figures/ps_fig4_31_buck_vmc_plant.png)

### 4.3 Digital PID Control & Maniktala's "Grand Analogy" for Q-Mismatch Resolution (Ch. 5)
Traditional Type 3 analog compensators place two real (or $Q=0.5$ coincident) zeros near $f_0$, whereas a lightly loaded LC post-filter exhibits a **high-$Q$ complex conjugate pole pair** ($Q_{\text{plant}} \gg 0.5$). This **Q-Mismatch** causes severe phase dip and **conditional stability / output ringing** at light loads (**Fig. 5.4 & 5.21**).
- **The Grand Analogy (Fig. 5.31)**: Comparing the impedance of a real RLC capacitor branch with a PID controller transfer function:
$$Z_{\text{cap}}(s) = R_{\text{ESR}} + \frac{1}{sC} + s L_{\text{ESL}} = \frac{1 + s R_{\text{ESR}}C + s^2 L_{\text{ESL}}C}{sC} \;\Longleftrightarrow\; G_{\text{PID}}(s) = K_P + \frac{K_I}{s} + s K_D = \frac{K_I\left(1 + s\frac{K_P}{K_I} + s^2\frac{K_D}{K_I}\right)}{s}$$
- **Exact Q-Matching PID Coefficients (Fig. 5.32)**: In a digital PID controller, $K_P, K_I, K_D$ are independent numbers and can synthesize **complex conjugate zeros with $Q_{\text{PID}} = Q_{\text{plant}} > 0.5$** that exactly cancel the resonant peaking of the LC filter:
$$\omega_0 = \sqrt{\frac{K_I}{K_D}}, \qquad Q_{\text{PID}} = \frac{\sqrt{K_I K_D}}{K_P} \implies K_P = \frac{2\pi f_0 K_{\text{gain}}}{Q_{\text{target}}}, \quad K_I = (2\pi f_0)^2 K_{\text{gain}}, \quad K_D = K_{\text{gain}}$$

![Figure 5.4: LC post-filter frequency response as load is varied (high Q peaking at light load).](Reading/figures/ps_fig5_4_lc_post_filter_q.png)

![Figure 5.31: The full analogy between a capacitor impedance and a PID compensator for Q-matching.](Reading/figures/ps_fig5_31_pid_q_matching.png)
