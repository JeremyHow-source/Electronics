# 🔍 IPC-A-610E: Acceptability of Electronic Assemblies — Complete Class 1, 2 & 3 Visual Inspection & Criteria Reference

> **Standard**: ANSI/IPC-A-610E (*Acceptability of Electronic Assemblies*, 417 Pages, Sections 1–12 + Appendix A)
> **Source PDF**: [561401556-IPC-A-610E.pdf](Reading/561401556-IPC-A-610E.pdf)

---

## 1. IPC Product Classes & Four-Tier Inspection Disposition Hierarchy (Section 1)

### 1.1 Three Product Classifications (Section 1.3)
| Class | Designation | Typical End-Use Products | Reliability & Inspection Philosophy |
| :--- | :--- | :--- | :--- |
| **Class 1** | **General Electronic Products** | Consumer electronics, toys, low-cost peripherals | Cosmetic imperfections acceptable; primary requirement is **electrical & mechanical function** of the completed assembly. |
| **Class 2** | **Dedicated Service Electronic Products** | Industrial automation, telecom infrastructure, servers, test instruments | Extended life and uninterrupted service desired, though non-critical environment; some cosmetic/dimensional latitude allowed. |
| **Class 3** | **High Performance / Harsh Environment Electronic Products** | Aerospace, avionics, military defense, implantable/life-support medical, automotive safety | **Continued performance or performance-on-demand is critical**; equipment downtime cannot be tolerated; stringent dimensional & wetting limits. |

### 1.2 Four Levels of Acceptance Criteria (Section 1.4.1)
1. **Target Condition**: Close-to-perfect/preferred condition; desirable goal but not mandatory for service acceptance.
2. **Acceptable Condition**: Assembly meets reliability requirements for its designated Class (1, 2, or 3) and must be accepted.
3. **Process Indicator Condition**: Material/workmanship anomaly that **does not affect form, fit, function, or reliability** (therefore *not* a defect and shall not be rejected), but indicates process variation that should be monitored/corrected in statistical process control (SPC).
4. **Defect Condition**: Insufficient form, fit, function, or reliability for the designated Class; **must be reworked, repaired, scrapped, or dispositioned via MRB**.

### 1.3 Inspection Magnification Rules (Section 1.9, Table 1-2)
| Land Width / Feature Size | Inspection Magnification | Referee Magnification (Max) |
| :--- | :--- | :--- |
| $> 1.0\text{ mm}$ ($0.0394\text{ in}$) | $1.75\times$ | $4\times$ |
| $0.5\text{ to }1.0\text{ mm}$ ($0.0197\text{--}0.0394\text{ in}$) | $4\times$ | $10\times$ |
| $0.25\text{ to }0.5\text{ mm}$ ($0.00984\text{--}0.0197\text{ in}$) | $10\times$ | $20\times$ |
| $< 0.25\text{ mm}$ ($0.00984\text{ in}$) | $20\times$ | $40\times$ |

![Section 1.5: Primary Side vs. Secondary Side and Solder Source Side vs. Solder Destination Side definitions.](Reading/figures/ipc610_sec1_board_orientation.png)

---

## 2. EOS/ESD Protection, Hardware Installation & Soldering Anomalies (Sections 3–5)

- **Section 3 (EOS/ESD Prevention)**: EPA workstation wrist-strap ($1\text{ M}\Omega$ current-limiting resistor), dissipative mat ($10^6\text{--}10^9\text{ }\Omega/\text{sq}$), relative humidity $>30\%$, no static-generating plastics/styrofoam within $30\text{ cm}$ ($12\text{ in}$) of ESDS assemblies.
- **Section 4 (Hardware Installation)**:
  - **Threaded Fasteners**: Minimum **1.5 threads** protruding beyond locking nut (up to $3\text{ mm}$ plus 1 thread max unless interfering). Split-ring lock washers must be compressed flat with no cracking.
  - **Heatsinks**: Must be flush and uniformly coated with thermal interface compound without contaminating solderable pads.
- **Section 5 (Soldering Acceptability & Anomalies)**:
  - **Nonwetting / Dewetting (Sec 5.2.4 / 5.2.6)**: Defect across Classes 1, 2, 3 whenever required minimum solder joint wetting criteria are violated.
  - **Solder Balls / Fines (Sec 5.2.7.1)**: Defect (Class 1, 2, 3) if **unattached/loose** OR if violating minimum electrical clearance ($<0.13\text{ mm}$ / $5\text{ mil}$ or $>5$ balls within $600\text{ mm}^2$ in No-Clean processes).
  - **Lead-Free (SAC305) Appearance (Sec 5.1)**: Dull, matte, grainy, and slightly higher contact angle than Sn63Pb37 are **normal acceptable characteristics** of Pb-free alloys; inspection criteria for wetting and dimensional fill are **identical** for SnPb and Pb-free!

![Section 3: EOS/ESD Safe Workstation (EPA) grounding and handling.](Reading/figures/ipc610_sec3_eos_esd_workstation.png)

![Section 4: Hardware installation and heatsink thermal compound contact.](Reading/figures/ipc610_sec4_hardware_heatsinks.png)

![Section 5: Soldering acceptability — SnPb vs. Lead-Free (SAC) appearance and wetting angle.](Reading/figures/ipc610_sec5_soldering_acceptability.png)

![Section 5.2.6: Dewetting and Nonwetting defect conditions.](Reading/figures/ipc610_sec5_dewetting_nonwetting.png)

---

## 3. Terminal Connections & Through-Hole Technology (Sections 6 & 7)

### 3.1 Terminal Wire Wrap & Solder Criteria (Section 6)
| Terminal Type | Class 1 Wrap | Class 2 Wrap | Class 3 Wrap | Wetting Requirement |
| :--- | :--- | :--- | :--- | :--- |
| **Turret & Straight Pin (6.8)** | $\ge 90^\circ$ (or mechanical secure) | $\ge 180^\circ$ | $\ge 180^\circ$ ($\le 360^\circ$ no overlap) | Visible wetted fillet along wire-to-post contact ($\ge 75\%$ Class 2/3) |
| **Bifurcated Terminal (6.9)** | $\ge 90^\circ$ (side/bottom route) | $\ge 90^\circ$ | $\ge 90^\circ$ past post edge | Wire sits flush against base or previous turn; $\ge 75\%$ fillet |
| **Hook Terminal (6.12)** | $\ge 90^\circ$ | $\ge 180^\circ$ | $\ge 180^\circ$ to $270^\circ$ | No wire extending past hook tip by $>1$ wire diameter |
| **Pierced / Perforated (6.11)** | Pass through eye | $>90^\circ$ contact | $\ge 180^\circ$ contact | Wire contacts almeno 2 surfaces of terminal |
| **Solder Cup (6.13)** | Inserted to full depth | Full depth, $\le 1\text{ dia}$ gap | Full depth, flush to back wall | Solder fills cup ($\ge 75\%$ Class 2, $100\%$ Class 3) without excess wick |

![Section 6.8: Turret and Straight Pin terminal wire placement and soldering.](Reading/figures/ipc610_sec6_turret_terminals.png)

### 3.2 Supported Plated-Through Hole (PTH) Soldering Criteria (Section 7.3.5, Table 7-4)
| PTH Parameter | Symbol | Class 1 | Class 2 | Class 3 |
| :--- | :--- | :--- | :--- | :--- |
| **A. Vertical Solder Fill** | $A$ | Not specified (wetting evident) | **$\ge 75\%$** (Up to $25\%$ recession total between primary & secondary; $\ge 50\%$ for heavy thermal planes) | **$\ge 75\%$** (Up to $25\%$ recession total) |
| **B. Primary Side (Destination) Lead-to-Barrel Wetting** | $B$ | Wetting evident | **$\ge 180^\circ$** | **$\ge 270^\circ$** |
| **C. Primary Side Land Area Coverage** | $C$ | $0\%$ | $0\%$ (wetted in barrel) | $0\%$ |
| **D. Secondary Side (Source) Lead-to-Barrel Wetting** | $D$ | **$\ge 270^\circ$** | **$\ge 270^\circ$** | **$\ge 330^\circ$** |
| **E. Secondary Side Land Area Coverage** | $E$ | **$\ge 75\%$** | **$\ge 75\%$** | **$\ge 75\%$** |
| **Lead Protrusion ($L$)** | $L$ | Flush to $2.5\text{ mm}$ (no short) | Flush to **$1.5\text{ mm}$** | Flush to **$1.5\text{ mm}$** (lead end discernible in solder) |

![Section 7.3.5: Plated-Through Hole (PTH) Vertical Fill (A) and Wetting Criteria.](Reading/figures/ipc610_sec7_tht_vertical_fill.png)

---

## 4. Surface Mount Assemblies Complete Dimensional Criteria Matrix (Section 8)

### 4.1 Rectangular/Square Chip Components (1, 3, or 5-Side Terminations — Section 8.3.2, Table 8-2)
| Dimension | Description | Class 1 | Class 2 | Class 3 |
| :--- | :--- | :--- | :--- | :--- |
| **A** | **Maximum Side Overhang** | $\le 50\%\,W$ or $50\%\,P$ | **$\le 50\%\,W$ or $50\%\,P$** | **$\le 25\%\,W$ or $25\%\,P$** (whichever is less) |
| **B** | **Maximum End Overhang** | **Not permitted ($0$)** | **Not permitted ($0$)** | **Not permitted ($0$)** |
| **C** | **Minimum End Joint Width** | $\ge 50\%\,W$ or $50\%\,P$ | **$\ge 50\%\,W$ or $50\%\,P$** | **$\ge 75\%\,W$ or $75\%\,P$** (whichever is less) |
| **D** | **Minimum Side Joint Length** | Wetting evident | Wetting evident | Wetting evident |
| **E** | **Maximum Fillet Height** | May overhang land/top of metallization (no contact with body) | Same as Class 1 | Same as Class 1 |
| **F** | **Minimum Fillet Height** | Proper wetting evident | **$\ge G + 25\%\,H$ or $G + 0.5\text{ mm}$** (whichever is less) | **$\ge G + 25\%\,H$ or $G + 0.5\text{ mm}$** (whichever is less) |
| **G** | **Solder Thickness** | Wetting evident | Wetting evident | Wetting evident |

### 4.2 Flat Gull-Wing Leads (QFP, SOIC, SOT, TSOP — Section 8.3.5, Table 8-5)
| Dimension | Description | Class 1 | Class 2 | Class 3 |
| :--- | :--- | :--- | :--- | :--- |
| **A** | **Maximum Side Overhang** | $\le 50\%\,W$ or $0.5\text{ mm}$ | **$\le 50\%\,W$ or $0.5\text{ mm}$** | **$\le 25\%\,W$ or $0.5\text{ mm}$** (for pitch $\le 0.5\text{ mm}$, no overhang violating clearance) |
| **B** | **Maximum Toe Overhang** | Not violating min electrical clearance | Not violating min electrical clearance | Not violating min electrical clearance |
| **C** | **Minimum End Joint Width** | $\ge 50\%\,W$ | **$\ge 50\%\,W$** | **$\ge 75\%\,W$** |
| **D** | **Minimum Side Joint Length** | Wetting evident ($L \ge 1\,W$ if $L < 3W$, or $\ge 1\,W$) | **$\ge 75\%\,L$** (if $L \le 3W$) or **$\ge 3\,W$** (if $L > 3W$) | **$\ge 75\%\,L$** (if $L \le 3W$) or **$\ge 3\,W$** (if $L > 3W$) |
| **E** | **Maximum Heel Fillet Height** | Must not contact ceramic/metal package body | May touch plastic SOIC body, not lead bend top if shorting | Must not touch lead knee/body on ceramic/metal |
| **F** | **Minimum Heel Fillet Height** | Wetting evident | **$G + 50\%\,T$** (mid-thickness of lead) | **$G + T$** (top of lead thickness at heel) |
| **G** | **Solder Thickness** | Wetting evident | Wetting evident | Wetting evident |

### 4.3 J-Leads (PLCC, SOJ — Section 8.3.7, Table 8-7) & BGA Area Array (Section 8.3.12)
- **J-Leads (Sec 8.3.7)**:
  - Max Side Overhang ($A$): $\le 50\%\,W$ (Class 1/2), $\le 25\%\,W$ (Class 3).
  - Min End Joint Width ($C$): $\ge 50\%\,W$ (Class 1/2), $\ge 75\%\,W$ (Class 3).
  - Min Side Joint Length ($D$): $\ge 1.5\,W$ (Class 1/2), $\ge 1.5\,W$ (Class 3).
  - Min Heel Fillet Height ($F$): $G + 50\%\,T$ (Class 1), $G + T$ (Class 2), $G + 2T$ (Class 3).
- **BGA Surface Mount Area Array (Sec 8.3.12)**:
  - **Alignment**: Solder ball offset $\le 25\%$ of ball diameter (never violating clearance).
  - **Voiding (X-Ray Inspection)**: Defect (Class 1, 2, 3) if **voids in any solder ball exceed $25\%$ of the X-ray image area** ($\le 50\%$ diameter of circular projection).
  - **Head-in-Pillow / Non-wetting / Fractured Ball**: Defect across Classes 1, 2, 3.

![Section 8.3.1.2: Chip components bottom-only termination End Overhang (B) defect.](Reading/figures/ipc610_sec8_smt_chip_overhang.png)

![Section 8.3.5: Flat Gull-Wing Leads dimensional parameters (A, B, C, D, E, F, G).](Reading/figures/ipc610_sec8_smt_gullwing_leads.png)

![Section 8.3.7: J-Leads dimensional parameters and heel fillet criteria.](Reading/figures/ipc610_sec8_smt_j_leads.png)

![Section 8.3.12: Surface Mount Area Array (BGA) solder connection & voiding criteria.](Reading/figures/ipc610_sec8_smt_bga_solder.png)

![Section 9: Component physical damage, chip metallization loss, and body cracks.](Reading/figures/ipc610_sec9_component_damage.png)

![Section 10: Printed circuit board laminate measling, crazing, and delamination criteria.](Reading/figures/ipc610_sec10_measling_delamination.png)

![Section 11: Discrete wiring and solderless wrap (wire-wrap) turn criteria.](Reading/figures/ipc610_sec11_solderless_wrap.png)
