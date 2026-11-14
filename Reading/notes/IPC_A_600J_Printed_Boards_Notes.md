# 🔬 Bare-Board Fabrication & Microsection Quality: Applied IPC-A-600J Playbook

> **Primary Reference**: IPC-A-600J, *"Acceptability of Printed Boards,"* Association Connecting Electronics Industries.

---

## 1. External Bare-Board Acceptance Criteria (Class 1 / 2 / 3)

| Characteristic | Class 1 | Class 2 | Class 3 |
| :--- | :--- | :--- | :--- |
| **External Annular Ring (Supported PTH)** | $90^\circ$ breakout permitted if junction $\ge 0.05\text{ mm}$ | $90^\circ$ breakout permitted in non-critical areas (or $\ge 0.05\text{ mm}$) | **$\ge 0.05\text{ mm}$ ($2\text{ mil}$) minimum; $0^\circ$ breakout** |
| **PTH Visual Plating Voids** | $\le 3$ voids/hole, $\le 10\%$ of holes | $\le 1$ void/hole, $\le 5\%$ of holes, $<90^\circ$ arc | **Zero ($0$) plating voids permitted** |
| **Conductor Width Reduction (Nicks)** | $\le 30\%$ of minimum width $W$ | $\le 20\%$ of minimum width $W$ | $\le 20\%$ of minimum width $W$ |
| **Measling / Delamination** | Blistering $\le 1\%$ area, $\le 25\%$ spacing bridge | Blistering $\le 25\%$ of conductor spacing | **Delamination $>25\%$ spacing is Nonconforming** |
| **Bow & Twist (SMT Boards)** | $\le 0.75\%$ | $\le 0.75\%$ | $\le 0.75\%$ |

---

## 2. Internal Microsection Acceptance Criteria ($288^\circ\text{C} / 10\text{ s}$ Thermal Stress)

Cross-sectional metallography verifies internal copper-to-barrel interconnect integrity after thermal shock:

| Microsection Feature | Class 1 | Class 2 | Class 3 |
| :--- | :--- | :--- | :--- |
| **Internal Annular Ring** | $90^\circ$ breakout acceptable | Tangency ($0\text{ mm}$) or $90^\circ$ per spec | **$\ge 0.025\text{ mm}$ ($1.0\text{ mil}$) minimum; $0^\circ$ breakout** |
| **PTH Copper Plating Thickness** | $\ge 20\;\mu\text{m}$ avg ($18\;\mu\text{m}$ min) | $\ge 20\;\mu\text{m}$ avg ($18\;\mu\text{m}$ min) | **$\ge 25\;\mu\text{m}$ ($1.0\text{ mil}$) avg, $20\;\mu\text{m}$ min** |
| **Copper Wicking** | $\le 125\;\mu\text{m}$ ($5.0\text{ mil}$) | $\le 100\;\mu\text{m}$ ($4.0\text{ mil}$) | **$\le 80\;\mu\text{m}$ ($3.15\text{ mil}$)** (never violates min dielectric spacing) |
| **Positive Etchback** | Optional | $0.005\text{--}0.080\text{ mm}$ if specified | $0.005\text{--}0.080\text{ mm}$ ($0.2\text{--}3.15\text{ mil}$) without shadowing |
| **Foil / Barrel Cracks (A, B, C, E, F)** | Surface foil "A" crack permitted if non-propagating | **Barrel "E" & Corner "F" cracks Nonconforming** | **All Barrel "E", Corner "F" & Inner-Layer "B" cracks Nonconforming** |

---

## 3. Failure-Mode Root-Cause Matrix for Bare-Board QA

| Microsection Defect | Probable Fabrication Root Cause | Corrective Engineering Action |
| :--- | :--- | :--- |
| **Inner-Layer Separation ("B" / Smear)** | Incomplete desmear or excessive drill heat smearing epoxy over inner copper | Tune plasma/permanganate desmear cycle; reduce drill chipload |
| **Corner "F" / Barrel "E" Cracks** | Low copper elongation ($<12\text{--}18\%$) or high Z-axis CTE mismatch during $288^\circ\text{C}$ solder shock | Increase acid-copper bath organic brightener control; use high-$T_g$ ($\ge 170^\circ\text{C}$) laminate |
| **Excessive Annular Ring Breakout** | Drill wander, inner-layer artwork scaling mismatch, or undersized padstack | Increase padstack diameter ($D_{\text{pad}} = D_{\text{drill}} + 2\cdot AR_{\min} + T_{\text{fab}}$) or add teardrops |
| **Excessive Copper Wicking** | Aggressive glass-weave fracturing during drilling + excessive etchback | Reduce drill feed rate / replace worn drill bits; tighten etchback dwell |
