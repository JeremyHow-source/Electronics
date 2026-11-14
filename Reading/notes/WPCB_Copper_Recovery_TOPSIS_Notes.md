# ♻️ From E-Waste to Resource: Identifying the Optimal Pre-Treatment for Copper Recovery from Waste PCBs

> **Authors**: Moisés Gómez (*Tsinghua University*), Daniel Peña-Torres (*Aalto University*), Melanie Colet-Lagrille (*Universidad de Chile*), Katherine Jaramillo (*CNP Chile*), I.M.S.K. Ilankoon (*Monash University Malaysia*), and Xianlai Zeng (*Tsinghua University*)
> **Publication**: *Resources, Conservation & Recycling*, Vol. 228 (2026) 108821 (DOI: `10.1016/j.resconrec.2026.108821`)
> **Source PDF**: [optimal pre-treatment for copper recovery from waste PCBs.pdf](Reading/optimal%20pre-treatment%20for%20copper%20recovery%20from%20waste%20PCBs.pdf)

---

## 1. Executive Summary & Urban Mining Context

- **Global E-Waste Surge**: Reached **62 Mt in 2022** and is projected to hit **82 Mt by 2030** ($+2.5\text{ Mt/yr}$), yet only **22.3%** is formally collected and recycled.
- **Waste Printed Circuit Boards (WPCBs)**: Account for **3–7% (average 5%)** of total e-waste ($1.5\text{--}2\text{ Mt/yr}$) and contain **20–35 wt.% Copper** ($\approx 280\text{ kg Cu per tonne of WPCBs}$)—**10 to 26 times richer** than natural copper ores!
- **2050 Cumulative Outlook**: Using Gompertz S-curve modeling, cumulative WPCB generation reaches **184.5 Mt by 2050** ($6.9\text{ Mt/yr}$ annual in 2050), containing **$50.7 \pm 3.4\text{ Mt}$ of recoverable Copper** (more than **twice** the entire 2024 global primary copper mine production of $23\text{ Mt}$), valued at **USD 592.9 Billion** (at Dec 2025 LME prices).
- **Resource Efficiency**: Recycling Cu from WPCBs saves **75–95% of energy** and **up to 65% of water**, avoiding $>120\text{ tonnes}$ of mined ore waste per tonne of copper.

![Fig. 1: Characterisation of PCBs: (a) Average material content in PCBs (wt.%), (b) average material distribution treemap, (c) multi-layered FR-4 PCB cross-section, and (d) e-waste separation & 5 primary EC connection types (SMT, THT, Screw joint, Rivet, Socket pedestal).](Reading/figures/cu_p5_img1_2100x2640.png)

---

## 2. Forecasting Models (Logistic & Gompertz) & TOPSIS Methodology (Eq. 1–7)

### 2.1 S-Curve WPCB Forecasting Equations (Eq. 1–2)
1. **Generalised Logistic Growth Model** ($R^2 = 0.9962$, predicts $109.7\text{ Mt}$ total e-waste by 2050):
$$f_{\text{Logistic}}(x) = \frac{A_1 - A_2}{1 + (x / x_0)^k} + A_2 \qquad \text{(1)}$$

2. **Gompertz Growth Model** ($R^2 = 0.9950$, preferred model aligning with 2030 UN projections; predicts $137.4\text{ Mt}$ e-waste / $6.9\text{ Mt/yr}$ WPCBs by 2050):
$$f_{\text{Gompertz}}(x) = A\,e^{-e^{-k(x - x_0)}} \qquad \text{(2)}$$

![Fig. 2: Outlook of WPCBs (2000–2050): (a) Logistic and Gompertz projections, (b) annual and cumulative WPCB quantities, (c) 2024 global mined copper (23 Mt) vs. cumulative recoverable WPCB copper by 2050 (50.7 Mt), and (d) sensitivity to PCB share in e-waste (3% to 7%).](Reading/figures/cu_p6_img1_2100x1453.png)

### 2.2 TOPSIS Multi-Criteria Decision Analysis (Eq. 3–7)
Evaluates $m = 13$ pre-treatment pathways across $n = 23$ indicators grouped into **Technical (11)**, **Environmental (7)**, and **Economic (5)** classes (scored 1 to 5):
3. **Vector Normalisation**:
$$r_{ij} = \frac{x_{ij}}{\sqrt{\sum_{i=1}^{m} x_{ij}^2}} \qquad \text{(3)}$$
4. **Weighted Normalised Decision Matrix**:
$$v_{ij} = \omega_j \times r_{ij} \qquad \text{(4)}$$
5–6. **Euclidean Distances to Positive-Ideal ($A^{\text{ideal}}$) and Negative-Ideal ($A^{\text{worst}}$) Solutions**:
$$S_i^{\text{ideal}} = \sqrt{\sum_{j=1}^{n} \left(v_j^{\text{ideal}} - v_{ij}\right)^2} \quad\text{(5)}, \qquad S_i^{\text{worst}} = \sqrt{\sum_{j=1}^{n} \left(v_j^{\text{worst}} - v_{ij}\right)^2} \quad\text{(6)}$$
7. **Relative Closeness Coefficient ($C_i^{\text{ideal}}$)**:
$$C_i^{\text{ideal}} = \frac{S_i^{\text{worst}}}{S_i^{\text{ideal}} + S_i^{\text{worst}}} \in [0, 1] \qquad \text{(7)}$$

---

## 3. Comprehensive Comparison of 13 WPCB Pre-Treatment Technologies (Tables 1 & 2)

| # | Category | Pre-Treatment Method | Key Advantages | Limitations & Challenges | Typical Process Parameters & Disassembly Efficiency |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **1** | **Mechanical** | **Manual Dismantling** | Lowest CAPEX/OPEX; simple small-scale deployment; **#1 in Scenario 4 ($C_i=0.579$)** | Low throughput; worker hazard (toxic fumes, lead, sharp edges) | Soldering irons / heat guns / chisels |
| **2** | **Mechanical** | **Grinding Dismantling** | High EC separation speed; automation-ready | Component damage; high tool wear; hazardous dust | 4 diamond grinders ($1.5\text{ mm}$, $5500\text{ rpm}$, $1\text{--}5\text{ cm/s}$, 3 cycles) $\to \mathbf{98\%}$ (Lee et al., 2012) |
| **3** | **Thermal** | **Hot Air Heating** | Uniform heating; scalable industrial batching | Component oxidation & thermal stress | Cylindrical air heater + vibration ($265^\circ\text{C}$, $10\text{ rpm}$, $8\text{ min}$) $\to \mathbf{\sim 100\%}$ (Wang et al., 2016) |
| **4** | **Thermal** | **Infrared (IR) Heating** | Localized energy-efficient desoldering | Uneven heating on reflective surfaces; thermal shock | IR heaters + steel brushes ($0.33\text{ cm/s}$, $250^\circ\text{C}$, $70\text{ s/PCB}$) $\to \mathbf{\sim 94\%}$ (Park et al., 2015) |
| **5** | **Thermal** | **Laser Heating** | Ultra-high precision; minimal collateral damage | High CAPEX; skilled calibration; limited throughput | Targeted laser solder reflow + ventilation |
| **6** | **Thermal** | **Hot Fluid Heating** | Uniform heat transfer via oil/molten salt/ionic liquid | Fluid contamination & disposal cost | Water-soluble ionic liquid $[\text{BMIm}]\text{BF}_4$ ($250^\circ\text{C}$, $12\text{ min}$, $45\text{ rpm}$) $\to \mathbf{\sim 90\%}$ (Zeng et al., 2013) |
| **7** | **Thermal** | **Molten Solder Bath** | Fast simultaneous batch desoldering | High thermal energy; solder bath contamination & PCB warping | Molten solder wave/bath ($>230^\circ\text{C}$) |
| **8** | **Chemical** | **Solder Dissolution** | Selective chemical leaching of Sn/Pb solder | Corrosive acids/oxidants; hazardous effluent treatment | $3.5\text{ M }\text{CH}_4\text{O}_3\text{S} + 0.5\text{ M }\text{H}_2\text{O}_2$ ($20^\circ\text{C}$, $45\text{ min}$) or $2.5\text{ M }\text{HBF}_4 + 0.4\text{ M }\text{H}_2\text{O}_2$ ($35\text{ min}$) $\to \mathbf{\sim 100\%}$ (Zhang et al.) |
| **9** | **Chemical** | **Supercritical Fluids** | Eco-friendly solvent reuse; degrades resin & solder | Very high pressure/energy CAPEX & OPEX | Supercritical water / $\text{CO}_2$ autoclave |
| **10** | **Chemical** | **Organic Solvent Treatment** | Delaminates multi-layer FR-4 brominated epoxy | Toxic organic solvent fumes & effluent recovery | DMAc / DMSO / $1\text{ M }\text{NaOH}$ ($280^\circ\text{C}$, $15\text{ min}$) $\to \mathbf{\sim 100\%}$ (Pinho et al., 2018) |
| **11** | **Innovative** | **Automated Disassembly (AI & Robotics)** | **#1 in Scenarios 1, 2, 3 ($C_i = 0.549, 0.661, 0.587$)**; non-destructive, safe, selective | High initial AI training & robotics CAPEX | YOLOv3 computer vision EC/IC classification ($52\text{--}100\%$) + robotic desoldering (Lu et al., 2022) |
| **12** | **Innovative** | **High-Voltage Electric Pulse Crushing (HVEPC)** | Selective fragmentation along material boundaries; low dust | High electrical pulse energy & specialized HV equipment | High-voltage electrical discharge liberation (Duan et al., 2015) |
| **13** | **Innovative** | **Heated Centrifugation** | Combines thermal solder melting + centrifugal detachment | High setup cost; risk of fragile component fracture | Heated drum + centrifugal rotor |

---

## 4. TOPSIS Multi-Scenario Rankings & 33-Scenario Sensitivity Analysis (Fig. 3 & Fig. 4)

| Scenario | Weighting Scheme ($\omega_{\text{Tech}}, \omega_{\text{Env}}, \omega_{\text{Eco}}$) | Top-Ranked Method ($\max C_i^{\text{ideal}}$) | Lowest-Ranked Method ($\min C_i^{\text{ideal}}$) | Strategic Takeaway |
| :--- | :--- | :--- | :--- | :--- |
| **Scenario 1** | Equal Importance ($1/3, 1/3, 1/3$) | **Automated Disassembly ($0.549$)** | Supercritical Fluids ($0.355$) | Best overall balance across all 23 indicators |
| **Scenario 2** | Technical Priority ($2/3, 1/6, 1/6$) | **Automated Disassembly ($0.661$)** | Heated Centrifugation ($0.342$) | AI & Robotics excels in selectivity, speed & component integrity |
| **Scenario 3** | Environmental Priority ($1/6, 2/3, 1/6$) | **Automated Disassembly ($0.587$)** | Solder Dissolution ($0.337$) | Avoids toxic acid effluents and high thermal emissions |
| **Scenario 4** | Economic Priority ($1/6, 1/6, 2/3$) | **Manual Dismantling ($0.579$)** | Supercritical Fluids ($0.222$) | Low CAPEX/OPEX favors manual dismantling under tight budgets |

![Fig. 3: Radar charts illustrating TOPSIS closeness coefficients across Scenarios 1–4.](Reading/figures/cu_p9_img1_2100x1634.png)

![Fig. 4: One-At-a-Time (OAT) sensitivity analysis across 33 weighting scenarios (0% to 100% in 10% increments) showing rank crossovers between Automated Disassembly and Manual Dismantling.](Reading/figures/cu_p10_img1_2100x2032.png)
