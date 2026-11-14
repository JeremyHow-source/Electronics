# 🔍 Electronic Assembly Quality & Solder Joint Inspection: Applied IPC-A-610E Playbook

> **Primary Reference**: IPC-A-610E, *"Acceptability of Electronic Assemblies,"* Association Connecting Electronics Industries.

---

## 1. Product Class & Four-Tier Disposition Framework

| Product Class | Typical End-Use | Inspection Philosophy |
| :--- | :--- | :--- |
| **Class 1** | Consumer electronics, toys, non-critical peripherals | Primary requirement is electrical/mechanical function; cosmetic latitude allowed. |
| **Class 2** | Industrial controls, servers, telecom, test equipment | Extended life and uninterrupted service desired; moderate dimensional/wetting limits. |
| **Class 3** | Aerospace, avionics, defense, medical life-support, automotive safety | Continued performance-on-demand is critical; zero tolerance for marginal wetting or breakout. |

**Disposition Hierarchy**: **Target** (Preferred) $\rightarrow$ **Acceptable** (Pass) $\rightarrow$ **Process Indicator** (Pass, monitor SPC) $\rightarrow$ **Defect** (Reject / Rework / MRB).

---

## 2. SMT Dimensional Inspection Criteria (Quick Reference)

### 2.1 Rectangular / Square Chip Components (0201, 0402, 0603, 0805, 1206)
| Criterion | Symbol | Class 1 | Class 2 | Class 3 |
| :--- | :---: | :--- | :--- | :--- |
| **Max Side Overhang** | $A$ | $\le 50\%\,W$ or $50\%\,P$ | $\le 50\%\,W$ or $50\%\,P$ | **$\le 25\%\,W$ or $25\%\,P$** |
| **Max End Overhang** | $B$ | **Not permitted ($0$)** | **Not permitted ($0$)** | **Not permitted ($0$)** |
| **Min End Joint Width** | $C$ | $\ge 50\%\,W$ or $50\%\,P$ | $\ge 50\%\,W$ or $50\%\,P$ | **$\ge 75\%\,W$ or $75\%\,P$** |
| **Min Fillet Height** | $F$ | Wetting evident | $\ge G + 25\%\,H$ or $G + 0.5\text{ mm}$ | $\ge G + 25\%\,H$ or $G + 0.5\text{ mm}$ |

### 2.2 Flat Gull-Wing Leads (QFP, SOIC, SOT, TSOP)
| Criterion | Symbol | Class 1 | Class 2 | Class 3 |
| :--- | :---: | :--- | :--- | :--- |
| **Max Side Overhang** | $A$ | $\le 50\%\,W$ or $0.5\text{ mm}$ | $\le 50\%\,W$ or $0.5\text{ mm}$ | **$\le 25\%\,W$ or $0.5\text{ mm}$** |
| **Min End Joint Width** | $C$ | $\ge 50\%\,W$ | $\ge 50\%\,W$ | **$\ge 75\%\,W$** |
| **Min Heel Fillet Height** | $F$ | Wetting evident | **$G + 50\%\,T$** (mid-lead) | **$G + T$** (top of lead at heel) |

### 2.3 BGA Area Array & Lead-Free (SAC305) Notes
- **BGA Voiding**: Defect in all classes if X-ray void area in any solder ball exceeds **$25\%$ of ball projection area** ($\sim 50\%$ void diameter).
- **Lead-Free Appearance**: Dull, matte, or grainy surface texture and slightly steeper wetting angle are **normal and acceptable** for SAC alloys; dimensional fill rules remain identical to SnPb.

---

## 3. Through-Hole Technology (THT) Supported PTH Criteria

| PTH Parameter | Class 1 | Class 2 | Class 3 |
| :--- | :--- | :--- | :--- |
| **Vertical Solder Fill ($A$)** | Wetting evident | **$\ge 75\%$** ($\ge 50\%$ on heavy internal ground planes) | **$\ge 75\%$** |
| **Primary Side Barrel Wetting ($B$)** | Wetting evident | **$\ge 180^\circ$** | **$\ge 270^\circ$** |
| **Secondary Side Barrel Wetting ($D$)** | $\ge 270^\circ$ | $\ge 270^\circ$ | **$\ge 330^\circ$** |
| **Secondary Side Land Coverage ($E$)** | $\ge 75\%$ | $\ge 75\%$ | **$\ge 75\%$** |
| **Lead Protrusion ($L$)** | $\le 2.5\text{ mm}$ | $\le 1.5\text{ mm}$ | $\le 1.5\text{ mm}$ (lead end discernible) |

---

## 4. Applied Shop-Floor Inspection Workflow

1. **Select Magnification by Land Width**: $>1.0\text{ mm} \rightarrow 1.75\times$; $0.5\text{--}1.0\text{ mm} \rightarrow 4\times$; $0.25\text{--}0.5\text{ mm} \rightarrow 10\times$; $<0.25\text{ mm} \rightarrow 20\times$.
2. **Verify EPA Workstation**: Wrist strap ($1\text{ M}\Omega$ series resistor), dissipative mat ($10^6\text{--}10^9\;\Omega/\text{sq}$), no ungrounded plastics within $30\text{ cm}$.
3. **Use the Live Joint Inspector Above** to evaluate side overhang, heel fillet height, and PTH fill against Class 1 / 2 / 3 thresholds.
