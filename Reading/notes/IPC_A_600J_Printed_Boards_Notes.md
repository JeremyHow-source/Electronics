# 🔬 IPC-A-600J: Acceptability of Printed Boards — Bare Board External & Internal Microsection Atlas

> **Standard**: ANSI/IPC-A-600J (*Acceptability of Printed Boards*, May 2016, 200 Pages, Sections 1–5)
> **Source PDF**: [894923540-IPC-A-600J-Acceptability-of-Printed-Boards-英文版.pdf](Reading/894923540-IPC-A-600J-Acceptability-of-Printed-Boards-%E8%8B%B1%E6%96%87%E7%89%88.pdf)

---

## 1. Scope, Product Classes & Three-Tier Acceptance Criteria (Section 1)

Unlike IPC-A-610 (which covers populated electronic assemblies), **IPC-A-600J** defines visual and metallographic cross-section acceptance criteria for **unpopulated (bare) rigid, flexible, rigid-flex, HDI, and metal-core printed boards**:
- **Three Acceptance Tiers (Section 1.5)**:
  1. **Target Condition**: Ideal/preferred manufacturing condition.
  2. **Acceptable Condition**: Meets IPC-6011/6012/6013 performance specification for Class 1, Class 2, or Class 3.
  3. **Nonconforming Condition**: Fails to meet or exceeds the maximum allowable defect criteria for the designated Class.

---

## 2. Externally Observable Characteristics (Section 2)

| Section | Characteristic | Class 1 Criteria | Class 2 Criteria | Class 3 Criteria |
| :--- | :--- | :--- | :--- | :--- |
| **2.1.3** | **Edge Haloing & Nicks** | Penetration $\le 50\%$ of edge-to-conductor distance or $\le 2.5\text{ mm}$ | Penetration $\le 50\%$ of edge-to-conductor distance or $\le 2.5\text{ mm}$ | Penetration $\le 50\%$ of edge-to-conductor distance or $\le 2.5\text{ mm}$ |
| **2.2.1** | **Weave Exposure / Weave Texture** | Weave exposure acceptable if spacing met | No unbroken glass fibers bridged between conductors | No weave exposure reducing dielectric spacing below minimum |
| **2.3.1–2.3.3** | **Measling, Crazing & Delamination/Blistering** | Measling acceptable; blistering/delamination $\le 1\%$ area, bridges $\le 25\%$ conductor spacing | Crazing/blistering $\le 25\%$ of distance between plated holes/conductors | **Blistering/delamination bridging $>25\%$ of dielectric spacing is Nonconforming** |
| **2.5.3** | **PTH Copper Plating Voids (Visual)** | $\le 3$ voids per hole; $\le 10\%$ of holes | **$\le 1$ void per hole**; $\le 5\%$ of holes; length $\le 5\%$ of board thickness, $<90^\circ$ circumference | **No copper plating voids permitted ($0\text{ voids}$)** |
| **2.9** | **Solder Mask Registration & Webs** | Misregistration permitted if electrical function intact | No solder mask onto SMT lands exceeding max encroachment ($0.05\text{ mm}$); no exposed copper on adjacent traces risking bridging | **Zero solder mask encroachment onto critical wire-bond / fine-pitch lands** |
| **2.10.1** | **Conductor Width Reduction (Nicks/Pinholes)** | Isolated reduction **$\le 30\%$** of minimum conductor width ($W$) | Isolated reduction **$\le 20\%$** of minimum width $W$ (length $\le W$ or $3.0\text{ mm}$) | Isolated reduction **$\le 20\%$** of minimum width $W$ |
| **2.10.2–2.10.4** | **External Annular Ring (Supported PTH / Unsupported)** | **$90^\circ$ breakout permitted** if conductor-to-land junction $\ge 0.05\text{ mm}$ ($2\text{ mil}$) or $50\%\,W$ | **$90^\circ$ breakout permitted** in non-critical areas (or $\ge 0.05\text{ mm}$ per IPC-6012); Unsupported hole $\ge 0.15\text{ mm}$ ($6\text{ mil}$) | **Minimum $0.05\text{ mm}$ ($2\text{ mil}$) external annular ring required ($0^\circ$ breakout permitted)** |
| **2.11** | **Bow and Twist (Flatness)** | $\le 1.5\%$ (THT) / $\le 0.75\%$ (SMT) | **$\le 0.75\%$ for boards with SMT components**; $\le 1.5\%$ without SMT | **$\le 0.75\%$ for SMT**; $\le 1.5\%$ without SMT |

![Section 2.1.3: Haloing along board edges and non-plated holes.](Reading/figures/ipc600_sec2_1_haloing_burrs.png)

![Section 2.3.1: Subsurface Measling vs. Crazing and Delamination.](Reading/figures/ipc600_sec2_3_measling_crazing.png)

![Section 2.5.3: Plated-Through Hole (PTH) visual copper plating voids.](Reading/figures/ipc600_sec2_5_pth_copper_voids.png)

![Section 2.9.3: Solder-Mask-Defined (SMD) vs. Copper-Defined (NSMD) BGA Lands.](Reading/figures/ipc600_sec2_9_bga_smd_vs_nsmd.png)

![Section 2.10.2 & 2.10.3: External Annular Ring measurement and Supported PTH criteria.](Reading/figures/ipc600_sec2_10_ext_annular_ring.png)

---

## 3. Internally Observable Microsection Characteristics (Section 3)

Metallographic cross-sectioning (vertical/axial and horizontal/transverse microsections, often after $288^\circ\text{C}$ $10\text{ s}$ thermal stress testing) evaluates internal multilayer integrity:

### 3.1 Dielectric Etchback, Smear Removal & Resin Recession (Section 3.1.5–3.1.8)
- **Positive Etchback (Sec 3.1.5.1)**: Controlled chemical removal of resin and glass fibers so inner-layer copper foil protrudes into the PTH barrel for **3-point interconnect bonding** (Acceptable Class 3: $0.005\text{ mm}$ to $0.080\text{ mm}$ / $0.2\text{--}3.15\text{ mil}$ without shadowing).
- **Smear Removal / Desmear (Sec 3.1.5.2)**: Complete removal of drill-smeared epoxy resin from the inner-layer copper interconnect face is mandatory across Classes 1, 2, 3.
- **Negative Etchback (Sec 3.1.5.3)**: Inner-layer copper recessed back from the hole wall; acceptable up to $\le 0.013\text{ mm}$ ($0.5\text{ mil}$) if specified, otherwise nonconforming if excessive.
- **Resin Recession (Sec 3.1.8)**: Voids between the PTH copper barrel wall and surrounding dielectric after thermal stress: acceptable if $\le 40\%$ of total dielectric thickness and not bridging conductively.

![Section 3.1.5: Microsection verification of Positive Etchback, Desmear, and Negative Etchback.](Reading/figures/ipc600_sec3_1_etchback_smear.png)

### 3.2 PTH Copper Plating Voids, Wicking, Foil & Barrel Cracks (Section 3.3)
| Microsection Defect | IPC-A-600J Code / Definition | Class 1 | Class 2 | Class 3 |
| :--- | :--- | :--- | :--- | :--- |
| **Copper Plating Voids (3.3.1)** | Void in PTH barrel wall (evaluated in vertical cross-section) | $\le 3$ voids; total length $\le 10\%$ board thickness | $\le 1$ void in any plane; length $\le 5\%$ of board thickness; none at innerlayer junction | **Zero copper plating voids allowed ($0\text{ voids}$)** |
| **Copper Wicking (3.3.4)** | Extension of copper plating along glass fibers into laminate | $\le 100\text{ }\mu\text{m}$ ($3.94\text{ mil}$) if spacing met | **$\le 80\text{ }\mu\text{m}$ ($3.15\text{ mil}$)** (and $\le 100\text{ }\mu\text{m}$ into clearance hole) | **$\le 50\text{ }\mu\text{m}$ ($1.97\text{ mil}$)** (never violating min dielectric spacing) |
| **Foil Crack "A" / "B" (3.3.9)** | "A": Crack in external foil only; "B": Partial crack not breaking minimum plating | Acceptable | "A" Acceptable; "B" Nonconforming | "A" Acceptable; "B" Nonconforming |
| **Internal Foil "C" Crack (3.3.8)** | Crack in internal copper foil at thermal stress zone | Nonconforming | **Nonconforming** | **Nonconforming** |
| **Barrel "E" Crack (3.3.10)** | Crack through PTH copper plating barrel wall | Nonconforming | **Nonconforming** | **Nonconforming** |
| **Corner "F" Crack (3.3.11)** | Crack in PTH copper plating at knee/surface land corner | Nonconforming | **Nonconforming** | **Nonconforming** |
| **Internal Annular Ring (3.3.12)** | Innerlayer land width around drilled PTH | $90^\circ$ breakout acceptable | Tangency ($0\text{ mm}$) or $90^\circ$ breakout per spec | **$\ge 0.025\text{ mm}$ ($1.0\text{ mil}$) minimum internal annular ring ($0^\circ$ breakout)** |
| **Microvia Target Land Contact (3.3.13–3.3.15)** | Laser/photo microvia bottom interface to target pad | Full contact without separation | Full metallic bond; penetration $\le 50\%$ of target foil | Full dimple/flat contact; zero separation after thermal stress |

![Section 3.3.1: Microsection Copper Plating Voids in Plated-Through Holes.](Reading/figures/ipc600_sec3_3_plating_voids.png)

![Section 3.3.9: Foil and Plating Cracks (A, B, D, E, F cracks) in cross-section.](Reading/figures/ipc600_sec3_3_barrel_corner_cracks.png)

![Section 3.3.12: Internal Layer Annular Ring microsection measurement.](Reading/figures/ipc600_sec3_3_int_annular_ring.png)

![Section 3.3.14: Microvia Target Land Contact Dimension and Penetration.](Reading/figures/ipc600_sec3_3_microvia_target_land.png)
