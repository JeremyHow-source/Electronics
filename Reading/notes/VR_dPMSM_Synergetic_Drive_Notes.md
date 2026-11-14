# ⚙️ Vienna Rectifier Front-End Dual Three-Phase PMSM Drive with Synergetic Control

> **Authors**: Takanobu Ohno (*University of Innsbruck*), Michael Haider (*Bern, Switzerland*), and Spasoje Mirić (*University of Innsbruck, Austria*)
> **Publication**: 2025 14th International Conference on Renewable Energy Research and Applications (ICRERA), Vienna, Austria, pp. 788–796 (DOI: `10.1109/ICRERA66237.2025.11283706`)
> **Source PDF**: [Vienna_Rectifier_Front_End_Dual_Three_Phase_PMSM_Drive_with_Synergetic.pdf](Reading/Vienna_Rectifier_Front_End_Dual_Three_Phase_PMSM_Drive_with_Synergetic.pdf)

---

## 1. Executive Summary & System Architecture

Conventional $3\Phi\text{ }400\text{ V}_{\text{rms}}$ industrial motor drives rectify the grid to an $800\text{ V}_{dc}$ bus, requiring **1.2 kV power semiconductors** in both the front-end rectifier and back-end inverters. For **dual three-phase permanent magnet synchronous machines (dPMSMs)**—which feature two electrically isolated three-phase stator winding sets shifted by $30^\circ$—conventional solutions use either two parallel 2-level inverters on a single $800\text{ V}$ bus or two separate rectifiers, both requiring 1.2 kV switches and bulky electrolytic DC-link capacitors.

### Key Innovations of the Proposed VR-dPMSM Drive
1. **Single Vienna Rectifier + Two Series-Stacked Two-Level Inverters (Fig. 1)**:
   - The Vienna Rectifier (VR) naturally partitions the DC link into two symmetric rails ($u_{pm}$ and $u_{mn}$, each $\le 400\text{ V}$), directly feeding the upper inverter ($S_{uph}\text{--}S_{wpl}$) and lower inverter ($S_{unh}\text{--}S_{wnl}$).
   - **Exclusive Use of 600 V / 650 V Wide-Bandgap Devices**: Enables full implementation with **650 V SiC MOSFETs (Fig. 1a)** or **650 V GaN-HEMTs + GaN Monolithic Bidirectional Switches (GaN-MBDS, Fig. 1b)**, cutting manufacturing $\text{CO}_2$ footprint by up to $10\times$ and end-application volume by $30\%$.
2. **Film / Ceramic DC-Link Capacitors ($C_p = C_n = 10\text{ }\mu\text{F}$)**: Partitioned DC bus and synergetic power flow minimize capacitance requirements.
3. **Synergetic Control & 1/3-PWM Mode**:
   - Coordinates the VR and stacked inverters across **1/3-PWM** (low speed), **2/3-PWM** (transition), and **3/3-PWM** (high speed) modes.
   - In **1/3-PWM mode**, the VR switches only during **one-third of the fundamental period** (the middle phase crossing zero), **reducing VR switching losses by 2/3 (66.7%)**, while the stacked inverters shape the DC-link voltage to follow the grid line-to-line envelope using the mechanical inertia of the dPMSM!

```mermaid
flowchart LR
    Grid["3Φ 400Vrms Grid\n(f_g = 50 Hz, L = 100 μH)"] --> VR["Vienna Rectifier Front-End\n650V SiC-MOSFET or GaN-MBDS\n1/3-PWM, 2/3-PWM, 3/3-PWM"]
    VR -->|Upper Rail u_pm (280–400V)\nC_p = 10 μF| InvP["Upper 3Φ Inverter (650V SiC/GaN)\nStator Winding Set p (i_uvw,p)"]
    VR -->|Midpoint m (i_m = 0)| Mid["Shared Neutral Point m"]
    VR -->|Lower Rail u_mn (280–400V)\nC_n = 10 μF| InvN["Lower 3Φ Inverter (650V SiC/GaN)\nStator Winding Set n (i_uvw,n, 30° shift)"]
    InvP --> Motor["Dual Three-Phase PMSM\n25 kW, 3000 rpm, 79.6 Nm"]
    InvN --> Motor
```

![Fig. 1: Circuit diagram of the proposed Vienna rectifier-based dual three-phase PMSM (VR-dPMSM) drive system: (a) 600 V SiC-MOSFET implementation, (b) 600 V GaN-HEMT and GaN-MBDS implementation.](Reading/figures/vrdpmsm_fig1_circuit_sic_gan.png)

---

## 2. Operating Modes: 3/3-PWM (High Speed) vs. 1/3-PWM Synergetic (Low Speed)

### 2.1 High-Speed Non-Synergistic Operation: 3/3-PWM Mode (Fig. 2a)
At nominal speed ($3000\text{ rpm}$, $25\text{ kW}$), elevated dPMSM back-EMF requires a boosted constant total DC-link voltage $u_{pn} = u_{pm} + u_{mn} = 760\text{ V}$ ($380\text{ V}$ per rail).
- All three VR bidirectional switches ($S_a, S_b, S_c$) are pulse-width modulated across the entire $360^\circ$ mains period (**3/3-PWM**).
- Zero average midpoint current ($\bar{i}_m = 0$) is maintained by injecting the **3/3-PWM Common-Mode Voltage (Eq. 1)**:
$$u_{cm,3/3} = u_{\text{mid}}\left(1 - \frac{|u_{\text{mid}}|}{\max(|u_{\min}|, |u_{\max}|)}\right) \qquad \text{(1)}$$
where $u_{\max} > u_{\text{mid}} > u_{\min}$ are the sorted local-average VR switching node voltages $\{\bar{u}_{\bar{a}}, \bar{u}_{\bar{b}}, \bar{u}_{\bar{c}}\}$.

### 2.2 Low-Speed Synergetic Operation: 1/3-PWM Mode (Fig. 2b)
At lower speeds (e.g., $1500\text{ rpm}$, $12.5\text{ kW}$), back-EMF is lower, allowing $u_{pn}$ to be lowered to follow the **6-pulse line-to-line grid voltage envelope** ($\max(|u_{ab}|, |u_{bc}|, |u_{ca}|)$).
- Within each $60^\circ$ sector (e.g., **Sector 1**, $\omega t \in [60^\circ, 120^\circ]$ where $u_a > 0 > u_c$ and $u_b$ is the middle phase):
  - Phase $a$ diode clamps to positive rail $p$ ($d_a = +1$, no switching!).
  - Phase $c$ diode clamps to negative rail $n$ ($d_c = -1$, no switching!).
  - **Only the middle phase switch $S_b$ is modulated** to impress the quasi-triangular middle-phase current $i_b$, while the upper and lower stacked inverters alternate every $30^\circ$ to regulate $i_a$ and $i_c$ (with the third current fixed by KCL: $i_a + i_b + i_c = 0$).
- **1/3-PWM Common-Mode Voltage (Eq. 2–3)**:
$$u_{cm,1/3} = u_{cm,1/3,\max} = u_{cm,1/3,\min} \qquad \text{(2)}$$
$$u_{cm,1/3,\max} = \frac{u_{pn}}{2} - u_{\max}, \qquad u_{cm,1/3,\min} = -\frac{u_{pn}}{2} - u_{\min} \qquad \text{(3)}$$
- **Universal Common-Mode Voltage Expression Valid Across 1/3, 2/3, and 3/3 PWM Modes (Eq. 4)**:
$$u_{cm} = \max\Big(u_{cm,1/3,\min},\; \min\big(u_{cm,1/3,\max},\; u_{cm,3/3}\big)\Big) \qquad \text{(4)}$$

![Fig. 2: Characteristic waveforms for (a) high-speed operation with fully boosted DC-link voltage by VR of 3/3-PWM mode at 25 kW, and (b) low-speed operation with partially DC-link current controlled by stacked inverters (1/3-PWM mode) at 12.5 kW.](Reading/figures/vrdpmsm_fig2_waveforms_33_13_pwm.png)

---

## 3. Cascaded Control Structure & Appendix Reference Equations (Eq. 5–12)

The cascaded control loop (**Fig. 3**) features bandwidth separation of $1 : 5 : 25$:
1. **Outer Speed Loop ($f_{\text{bw,speed}} = 400\text{ Hz}$, Fig. 3b.i)**: PI controller computes torque reference $T^*$ from $\Omega^* - \Omega$, yielding VR power reference $P^*_{VR} = \Omega^* T^*$.
2. **Intermediate DC-Link Voltage Loop ($f_{\text{bw,voltage}} = 2\text{ kHz}$, Fig. 3b.iii)**: Regulates $u_{pm}$ and $u_{mn}$ via PI controllers generating capacitor power demands $p^*_{c,p}$ and $p^*_{c,n}$. Subtracting these from $P^*_{VR}/2$ yields stacked inverter power references:
$$P^*_{si,p} = \frac{P^*_{VR}}{2} - p^*_{c,p}, \qquad P^*_{si,n} = \frac{P^*_{VR}}{2} - p^*_{c,n}, \qquad T^*_{p,n} = \frac{P^*_{si,p,n}}{\Omega}$$
3. **Inner Grid Current & Motor FOC Loops ($f_{\text{bw,vr}} = f_{\text{bw,dq}} = 10\text{ kHz}$, Fig. 3b.ii & 3b.iv)**:
   - Grid conductance reference: $G^* = \frac{P^*_{VR}}{\frac{3}{2}\hat{U}_{ac}^2}$, phase current references $i^*_{a,b,c} = G^* u_{a,b,c}$, and switching-node voltage references $u^*_{\bar{x}} = u_x - u^*_{Lx}$.

![Fig. 3: Control structure of the VR-dPMSM drive system: (a) schematic with measurement points; (b) cascaded control diagram comprising (b.i) speed control, (b.ii) grid-current control, (b.iii) DC-link capacitor voltage control, and (b.iv) field-oriented control (FOC).](Reading/figures/vrdpmsm_fig3_cascaded_control_foc.png)

### Universal DC-Link Voltage Reference Formulation (Appendix Eq. 5–12)

5. **Master DC-Link Voltage Reference Across All Modes**:
$$u^*_{pn} = \max\left(u^*_{pn,1/3},\; u^*_{pn,3/3},\; u^*_{pn,2/3,\max},\; u^*_{pn,2/3,\min}\right) \qquad \text{(5)}$$

6. **1/3-PWM Line-to-Line Envelope Reference**:
$$u^*_{pn,1/3} = u^*_{\max} - u^*_{\min} \qquad \text{(6)}$$
where $u^*_{\max} = \max(u^*_{\bar{a}}, u^*_{\bar{b}}, u^*_{\bar{c}})$ and $u^*_{\min} = \min(u^*_{\bar{a}}, u^*_{\bar{b}}, u^*_{\bar{c}})$ **(7)**.

8. **3/3-PWM Speed-Adaptive DC-Link Voltage Reference** (with $\gamma = 1.2$ for $20\%$ inductor control margin):
$$u^*_{pn,3/3} = 2\hat{U}_{\text{nom}}\frac{\Omega^*}{\Omega_{\text{nom}}}\cdot 2\cdot\gamma \qquad \text{(8)}$$

9–10. **2/3-PWM Smooth Transition References**:
$$u^*_{pn,2/3,\max} = \frac{2}{1 + \frac{3\hat{U}_{ac}^2 / 2}{|u^*_{\max}||u^*_{pn,3/3}|}}\,u^*_{pn,1/3} \quad\text{(9)}, \qquad u^*_{pn,2/3,\min} = \frac{2}{1 + \frac{3\hat{U}_{ac}^2 / 2}{|u^*_{\min}||u^*_{pn,3/3}|}}\,u^*_{pn,1/3} \quad\text{(10)}$$

11–12. **Common-Mode Voltage Boundary Constraints**:
$$-\frac{u_{pn}}{2} \le \bar{u}_{\{\bar{a},\bar{b},\bar{c}\}} + u_{cm} \le \frac{u_{pn}}{2} \quad\text{(11)} \implies -\frac{u_{pn}}{2} - u_{\min} \le u_{cm} \le \frac{u_{pn}}{2} - u_{\max} \quad\text{(12)}$$

---

## 4. Simulation Parameters (Table I) & Seamless Mode Transition Results (Fig. 4)

![Table I: VR-dPMSM Simulation Parameters.](Reading/figures/vrdpmsm_table1_sim_params.png)

| Subsystem | Parameter | Symbol | Value |
| :--- | :--- | :--- | :--- |
| **Vienna Rectifier** | Grid voltage (line-to-neutral peak) | $\hat{U}_{ac}$ | $325\text{ V}_{\text{pk}}$ ($230\text{ V}_{\text{rms}}$) |
| **Vienna Rectifier** | Grid frequency / Switching frequency | $f_g$ / $f_{sw,vr}$ | $50\text{ Hz}$ / $100\text{ kHz}$ |
| **Vienna Rectifier** | Input inductance / DC-link capacitance | $L_{\{a,b,c\}}$ / $C_p, C_n$ | $100\text{ }\mu\text{H}$ / $10\text{ }\mu\text{F}$ |
| **Vienna Rectifier** | Total DC-link voltage range | $u_{pn}$ | $560\text{ V to }800\text{ V}$ ($u_{pm}, u_{mn} \in [280, 500]\text{ V}$) |
| **Dual 3Φ PMSM** | Flux linkage / Stator inductance / Pole pairs | $\hat{\Phi}$ / $L_s$ / $N_{pp}$ | $0.25\text{ Wb}$ / $2\text{ mH}$ / $2$ |
| **Dual 3Φ PMSM** | Moment of inertia / Nominal phase voltage peak | $J$ / $\hat{U}$ | $0.0446\text{ kg}\cdot\text{m}^2$ / $260\text{ V}$ |
| **Dual 3Φ PMSM** | Nominal torque / power / speed | $T_{\text{load,nom}}$ / $P_{\text{nom}}$ / $n_{\text{nom}}$ | $79.6\text{ Nm}$ / $25\text{ kW}$ / $3000\text{ rpm}$ |
| **Control Loops** | Bandwidths (Speed / Voltage / VR Current / $dq$ Current) | $f_{\text{bw}}$ | $400\text{ Hz}$ / $2\text{ kHz}$ / $10\text{ kHz}$ / $10\text{ kHz}$ |

![Fig. 4: Simulation waveforms of the VR-dPMSM drive system accelerating from 1500 rpm to 3000 rpm across (b) 1/3-PWM, (c) 2/3-PWM, and (d) 3/3-PWM modes.](Reading/figures/vrdpmsm_fig4_dynamic_sim_waveforms.png)
