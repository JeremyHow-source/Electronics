# ⚡ Electronics Engineering & Reliability Knowledge Base

[![Live Applied Engineering Workbench](https://img.shields.io/badge/🌐_Live_Applied_Engineering_Workbench-GitHub_Pages-00f5d4?style=for-the-badge)](https://jeremyhow-source.github.io/Electronics/)
[![Ko-fi](https://img.shields.io/badge/Ko--fi-Support%20Me%20☕-FF5E5B?style=for-the-badge&logo=ko-fi&logoColor=white)](https://ko-fi.com/jeremyhow)

A comprehensive repository for electronics engineering, power conversion, motor drives, PCB signal integrity, IPC acceptability standards, ESD selection guides, failure analysis, and reliability handbooks.

---

## 🌐 Live Applied Engineering Workbench (`Reading/`)

👉 **Launch Live Workbench:** **[https://jeremyhow-source.github.io/Electronics/](https://jeremyhow-source.github.io/Electronics/)** *(also accessible at [`/Electronics/Reading/`](https://jeremyhow-source.github.io/Electronics/Reading/))*

Designed as a functional engineering workspace where theory meets practical application, the live site provides **21 original code-rendered HTML5 Canvas simulators, first-principles calculators, and commissioning playbooks** across **7 engineering domains**:

| # | Engineering Workbench Module | Primary Citation | Interactive Engineering Capabilities | Applied Playbook |
| :- | :--- | :--- | :--- | :--- |
| **1** | **5-Level Multiple-Pole VIENNA Rectifier (5L-MVR) Design Lab** | Ooi, Maswood et al. (NTU Singapore, IEEE 2013) | Tune inner-cell firing angle $\alpha$ ($0^\circ\text{--}50^\circ$), modulation index $M$, and LS/PS-PWM; inspect $\text{PF}/\text{THD}_i$ curves, 5-level $V_{aN}/V_{ab}$ waveforms, and IEEE 519 FFT spectrum | [5L_MVR_Vienna_Rectifier_Notes.md](Reading/notes/5L_MVR_Vienna_Rectifier_Notes.md) |
| **2** | **Vienna Rectifier + Dual 3-Phase PMSM Synergetic Control Lab** | Ohno, Haider, Mirić (Univ. of Innsbruck, IEEE ICRERA 2025) | Compare $3/3$ vs. $1/3$ six-step clamping PWM switching losses and tune Synergetic Control time constant $T$ vs. PI step & $300\text{ Hz}$ sinusoidal tracking | [VR_dPMSM_Synergetic_Drive_Notes.md](Reading/notes/VR_dPMSM_Synergetic_Drive_Notes.md) |
| **3** | **Waste PCB Copper Recovery & TOPSIS Process Optimizer** | Gómez et al. (*Resour. Conserv. Recycl.* 228, 2026) | Adjust 5 plant KPI weights ($w_{\text{purity}}, w_{\text{yield}}, w_{\text{time}}, w_{\text{cost}}, w_{\text{env}}$), compare $\text{HCl}$ vs. $\text{H}_2\text{SO}_4\text{-H}_2\text{O}_2$ kinetics, and rank routes via $C_i^*$ | [WPCB_Copper_Recovery_TOPSIS_Notes.md](Reading/notes/WPCB_Copper_Recovery_TOPSIS_Notes.md) |
| **4** | **Resonant LLC, Dual Active Bridge (DAB) & Loop Compensation Lab** | Maniktala & Rosano (*Switching Power Supplies A to Z*, 3rd Ed.) | 3-Tab Lab: Plot LLC FHA gain $M(f_n, \kappa, Q)$ & ZVS boundaries, simulate $200\text{ kW}$ DAB phase-shift $\phi$ tank currents, and design Buck Type-III Bode margins | [Power_Supplies_A_to_Z_3rd_Ed_Notes.md](Reading/notes/Power_Supplies_A_to_Z_3rd_Ed_Notes.md) |
| **5** | **High-Speed PCB Impedance, Critical Length & Trace Current Calculator** | Mitzner et al. (*Complete PCB Design Using OrCAD*, 2nd Ed., 2019) | Size microstrip/stripline $Z_0$, evaluate rise-time critical length $l_{\text{crit}}$ & $3W$ crosstalk $K_b$, and visualize IPC-2152 trace ampacity | [OrCAD_Complete_PCB_Design_Notes.md](Reading/notes/OrCAD_Complete_PCB_Design_Notes.md) |
| **6** | **Electronic Assembly Solder Joint Inspector (Class 1 / 2 / 3)** | IPC-A-610E Standard | Real-time Class 1 / 2 / 3 pass/defect evaluator for SMT chip overhang, gull-wing heel fillet height, and THT PTH barrel fill with live cross-section rendering | [IPC_A_610E_Electronic_Assemblies_Notes.md](Reading/notes/IPC_A_610E_Electronic_Assemblies_Notes.md) |
| **7** | **Bare-Board Annular Ring & PTH Microsection Inspector (Class 1 / 2 / 3)** | IPC-A-600J Standard | Real-time Class 1 / 2 / 3 drill breakout calculator and PTH barrel microsection crack (`A/B/C/E/F`), plating void, and wicking inspector | [IPC_A_600J_Printed_Boards_Notes.md](Reading/notes/IPC_A_600J_Printed_Boards_Notes.md) |

> **Academic Attribution & Fair-Use Notice:** All interactive simulators, waveforms, calculators, diagrams, and design playbooks on the live site are original educational implementations synthesized from first-principles engineering equations and industry practices. No copyrighted source texts or verbatim publisher figures are redistributed on the web page; primary papers, textbooks, and IPC standards are cited for scholarly attribution.

---

## 📚 Additional Repository Contents

- **Reliability & Standards**: Reliability handbooks, standards tree, ESD selection guides
- **Hardware & Microcontrollers**: Wireless power transmitters, nRF Connect, J-Link/J-Flash documentation
- **Simulation & Analysis**: PLECS simulation models, MTBF calculators, Wintech Nano extracts

## ☕ Support This Repository

If you find these electronics resources, simulations, and notes helpful, please consider supporting me on Ko-fi!

<p align="center">
  <a href="https://ko-fi.com/jeremyhow" target="_blank">
    <img src="https://storage.ko-fi.com/cdn/kofi2.png?v=3" alt="Buy Me a Coffee at ko-fi.com" height="50">
  </a>
</p>

---

<p align="center">
  Made with ❤️ by <a href="https://ko-fi.com/jeremyhow">Jeremy</a>
</p>
