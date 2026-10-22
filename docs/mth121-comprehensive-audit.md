# CalcMentor MTH 121 — Curriculum, Mathematics, and Software Audit

**Date:** October 21, 2026  
**Status:** Independent source-code and curriculum coverage review; not a classroom field trial  
**Audited system:** CalcMentor, 218 generated problem families on the public \`main\` branch  
**Course:** Spring Hill College MTH 121 Calculus I  
**Disposition:** **Useful supplementary practice; not yet a comprehensive, independently validated sole practice resource.**

## Independent verification update — October 21, 2026

A separate mathematical reference suite now covers **all 218 problem families** with **30 widely distributed parameter seeds per family** (6,540 distinct family/seed test instances). It derives expected values from the problem statements using function substitution, the derivative and integral definitions, geometric formulas, and relevant calculus theorems. The first audited incorrect numerical key was corrected: `extra-integral-particle-position` incorrectly reported 240.5 m instead of 243 m for the example with initial position 5 m and velocity `8t+6` m/s over seven seconds. GitHub's independent test suites all passed after that correction.

**This does not amount to a formal proof of every generator or verification of every intermediate answer and hint.** It also does not remove the limitations of the live numerical-equivalence checker. Full methodology, category-by-category coverage, and residual risks: [Independent Mathematical Verification](independent-math-verification.md).

The following baseline sections describe the original audit; retain their recommendations concerning graph/data problems, feedback, proof quality and curriculum completeness.

---

## Remediation update — October 21, 2026

**This document records the original audit baseline.** The findings in Sections 1–7 describe problems as found *before* the following corrections; interpret their "currently" claims historically.

| Finding | Updated status | Evidence |
|---|---|---|
| P0 A — correct indefinite integrals rejected for having an arbitrary constant | **Corrected for the 21 explicitly classified antiderivative families** | \`grading-categories.js\` tags the relevant steps; \`math-engine.js\` now checks whether the proposed antiderivative differs from the key by a constant at sampled inputs. Regression tests accept \`x^2/2+7\`, \`x^2/2+2*pi\`, and \`x^2/2+C\`, and reject \`x^2/2+C*x\`. |
| P0 B — incorrect algebraic offset accepted | **Specific reproduced defect corrected; broader numeric equivalence limitation remains** | Tighter expression comparison now rejects \`x+0.00001\` against \`x\`. The checker still uses finite-point numerical tests and cannot rigorously certify algebraic identities or all domain restrictions. |
| P0 C — no independent mathematical proofs of all generated answer keys | **Independent seeded checks completed; full formal proof and intermediate-step audit remain open** | All 218 families now have independent mathematical reference checks across 30 widely distributed generated instances; see [verification report](independent-math-verification.md). |
| P1 E — radical-domain wording did not match its numeric expected response | **Corrected** | The prompt now asks for the minimum permitted radicand value rather than an inequality. |
| Missing graphical/data exercises, extended modeling, proofs and calibrated difficulty | **Still open** | Next phase of curriculum work, after additional mathematical validation. |

**Deployment tests:** The GitHub Pages workflow runs \`tests/smoke.test.cjs\`, including the generated-answer checks and known-grading-regression cases. This does not constitute formal correctness certification.

---

## 1. Scope and standards

This review read the problem-generation and checking code in \`problem-bank.js\`, \`extra-functions.js\`, \`extra-limits.js\`, \`extra-derivatives.js\`, \`extra-applications.js\`, \`extra-integrals.js\`, \`extra-integral-applications.js\`, and \`math-engine.js\`, and reviewed relevant UI code.

Course anchors:

1. **Spring Hill College, 2021 Traditional Undergraduate Bulletin, printed p. 194:** MTH 121 covers analytic geometry, functions, limits, continuity, the derivative and applications, and the integral and applications. MTH 122 separately includes further integral applications, transcendental functions, integration techniques, indeterminate limit forms, improper integrals and series. This is *older published catalog evidence*, not a verified 2026 course syllabus. https://www.shc.edu/wp-content/uploads/2021/08/2021-Bulletin-Traditional-Undergraduate-Programs.pdf
2. **SHC's Spring 2026 course schedule:** MTH 121 is a four-credit Calculus I course and MTH 122 is the subsequent Calculus II course. https://badgerweb.shc.edu/ICS/Portlets/ICS/Portlet.Resources/ViewHandler.ashx?id=34d46b97-a59b-4ab2-b077-b87c1eff5522
3. **OpenStax Calculus Volume 1**, chapters 1–6: functions; limits; derivatives; applications of derivatives; integration; and applications of integration. https://openstax.org/books/calculus-volume-1/pages/preface
4. **Active Calculus, Single Variable, 2e:** the workbook's chapters 1–4 are intended for Calculus 1 and use conceptual preview activities and interactive exercises. https://activecalculus.org/acs2e/
5. **Paul's Online Math Notes, Calculus I:** conventional detailed skills sequence including the precise limit definition, rates, graph analysis, optimization, and integration. Used for coverage benchmarking only. https://tutorial.math.lamar.edu/Classes/CalcI/CalcI.aspx

**Important boundary:** The actual syllabus, textbook, exam scope and course outcomes of Spring Hill College's current MTH 121 offering were not supplied or independently located. Thus this is a **catalog-and-textbook-aligned provisional audit**, not a claim of exact Fall 2026 instructor alignment. Sections such as L'Hôpital's rule, complex antiderivatives, advanced solids, and some applications of integration may be assigned to MTH 122.

**Review limits:** Template and code inspection, parameter-sample counts, and targeted answer-checker experiments are *not* the same as manually proving every answer key. The existing regression suite verifies that each expected answer is accepted by the *same* engine; it does not independently certify mathematical truth. No classroom testing, accessibility evaluation with assistive technology, or complete similarity comparison with published exercise banks was performed.

## 2. Quantitative findings

| Measurement | Audited value | Interpretation |
|---|---:|---|
| Distinct implemented problem generators | **218** | Separate source-level families, not a count of independent mathematical learning objectives |
| Functions and review | 36 | Many are variations of substitution/outer-function choice |
| Limits and continuity | 36 | Formula limits emphasized |
| Differentiation | 45 | Strongest range of procedural rules |
| Applications of derivatives | 38 | Many familiar, explicitly cued standard models |
| Integration | 39 | Formulas and substitution emphasized |
| Applications of integrals | 24 | Several may be Calculus II depending on the local syllabus |
| Families with 1 assessed step | **124 / 218 (56.9%)** | Shallow guided scaffolding across much of the collection |
| Families with 2 assessed steps | 90 / 218 (41.3%) | Moderate procedural scaffolding |
| Families with 3 assessed steps | 4 / 218 (1.8%) | Almost no extended modeling/scaffold tasks |
| Total assessed steps for one version of all families | **316** | 149 expression steps, 132 numeric steps, 35 multiple-choice steps |
| Family difficulty tagged "Level 4" | **134 / 218 (61.5%)** | Self-assigned difficulty labels do not demonstrate rigor |
| Families with fewer than 100 distinct question *statements* in a 300-seed sample | **173 / 218** | Random numerical versions are often narrow; many have far fewer than 100 meaningful distinct instances |
| Graph- or table-based questions inside the problem engine | **0 identified** | Two interactive visual labs exist, but they are separate from assessed question families |
| Existing interactive mathematical labs | 2 | Secant/tangent and Riemann rectangles |

**How variation was checked:** For each of the 218 families, 300 deterministic pseudorandom seeds were applied; distinct rendered question statements were counted. This is a sampling result, **not** a proof of the maximum number of possible variants. A one-parameter family such as a secant-limit problem will naturally repeat statements even if different seeds are supplied. Low variation is a pedagogical limitation only if treated as full exercise-bank diversity.

## 3. Syllabus-to-bank coverage matrix

**Ratings:** S = substantive procedural practice; P = partially covered; M = missing/too thin as independent skill. Ratings are *qualitative* and do not indicate independently verified mathematical correctness.

| Unit and learning objective | Rating | Evidence, shortfall, or suggested addition |
|---|---|---|
| Functions: evaluate and compose algebraic functions | **S** | 36 review families include many composition forms; however, a high proportion are one-step substitution |
| Functions: domains of algebraic/transcendental compositions | **P** | Radical, log and rational exclusions appear, but domain reporting is inconsistent |
| Functions: inverses, restricted-domain inverses | **P** | Linear, quadratic and reciprocal cases; add graphs, ranges and inverse-existence reasoning |
| Functions: graphs, transformations, symmetry, inverse graphs | **M** | No assessed graph-interpreting questions; needs actual plots |
| Functions: trig/algebra/log prerequisites | **M** | No substantive independent unit-circle, trig-equation, identities, or equation-solving review |
| Limits: laws, factoring, rationalizing, special trig limits | **S** | Many distinct symbolic forms |
| Limits: one-sided, infinite and infinity limits | **S** | Several symbolic and multiple-choice forms |
| Limits: continuity, holes, jumps, IVT | **P** | Mostly expression- and label-based; needs graphical/numerical analysis and multi-parameter piecewise cases |
| Limits: tables, graph estimation and interpretation | **M** | No assessed graphical/table question formats |
| Limits: formal epsilon-delta definition | **M** | No family devoted to constructing/bounding δ for a given ε |
| Limits: asymptote analysis and behavior combinations | **P** | Elementary algebraic cases; limited nuanced interpretation |
| Derivatives: limit definition at general points | **P** | Difference-quotient exercise exists; graph/table/one-sided differentiability thin |
| Derivatives: algebraic, trig, inverse trig, exp/log differentiation | **S** | Broad formula coverage, including many compound expressions |
| Derivatives: product, quotient, multi-layer chain rules | **S** | Numerous template types |
| Derivatives: implicit and logarithmic differentiation | **P** | Core computations present; more subtle domains and mixed equations needed |
| Derivatives: higher derivatives | **P** | A few second/third-derivative problems |
| Derivatives: interpreting f', f'' from function graphs, derivative graphs or data | **M** | No assessed graph/data reasoning |
| Derivatives: differentiability versus continuity, corners and cusps | **P** | One corner-style multiple-choice family, very narrow |
| Applications: velocity, acceleration, position | **P** | Several straightforward formulas; little data/table reasoning or event selection |
| Applications: related rates | **P** | Circles, spheres, rectangles, ladder, cubes, tanks; many only plug values into a known relation |
| Applications: optimization and constraints | **P** | Many familiar rectangle/box/pricing cases; few unfamiliar full-modeling tasks |
| Applications: critical points, first/second derivative tests | **P** | Isolated examples; need full sign-chart and justified classification |
| Applications: complete curve sketching | **M** | No integrated asymptote, intercept, monotonicity, concavity and inflection assessment |
| Applications: MVT, Rolle's theorem, IVT justification | **P** | Few numerical/choice examples; little checking hypotheses or interpreting counterexamples |
| Applications: linearization, differentials and propagation of error | **P/M** | Linear approximation covered; explicit differential/error tasks absent |
| Applications: Newton's method | **P** | Single iterations; convergence, stopping conditions and failure cases absent |
| Integration: antiderivative formulas and initial conditions | **P** | Many primitives, but no substantial initial-value differential problems |
| Integration: Riemann sums, partitions and sigma notation | **P/M** | Left/right/midpoint examples; sigma limits, arbitrary partitions and sum derivations missing |
| Integration: definite integral, sign, symmetry, average value | **S/P** | Basic skills present; little graphical and conceptual interpretation |
| Integration: Fundamental Theorem of Calculus | **S** | Both variable-bound and upper/lower-bound families |
| Integration: substitution and bounds transformation | **S** | Many algebraically directed examples; technique-selection cases limited |
| Integration: net change, motion and data-derived integrals | **P** | Simple rate/velocity formulas; tables and nonformula data absent |
| Integration applications: area between intersecting curves | **P** | Simple one-intersection pair cases; piecewise switching and x-versus-y setup absent |
| Integration applications: slicing, disk, washer, shell volumes | **S/P** | All named methods represented, mostly easy analytic regions; method-choice reasoning weak |
| Integration applications: work, mass, density | **P** | Simplified force, density and Hooke's law |
| Extension topics: arc length, surface area, hydrostatic force, moments/centroids, advanced growth-decay | **M** | OpenStax Volume 1 discusses these, but local MTH 122 may own part of the material. Do not force into MTH 121 without current syllabus. |

### Specific problem-family examples

- **Composition:** \`functions-composition\` and \`extra-log-quadratic\` show distinct outer functions, but both reduce largely to placing one expression inside another; many new 'structures' still involve the same immediate reasoning step.
- **Limits:** \`extra-limit-fourth-power\`, \`extra-limit-difference-cubes\`, and \`extra-limit-slope-secant\` all essentially reuse one cancellation/derivative-limit idea in different polynomial contexts.
- **Derivatives:** \`extra-deriv-sec\`, \`extra-deriv-csc\`, and \`extra-deriv-cot\` broaden rule fluency but are mostly one-rule exercises despite many being labeled Level 4.
- **Optimization:** \`extra-opt-river\`, \`extra-opt-fixed-sum\`, and \`apps-opt-rectangle\` typically provide both a familiar configuration and easy algebra; they are not replacements for multi-stage, ambiguous modeling.
- **Integration:** \`extra-integral-sub-cubic\`, \`extra-integral-sub-expsquare\`, and \`int-sub-power\` usually signal the substitution by supplying an exact inner derivative.
- **Graph/data problem gap:** The assessed problem UI draws no graph or data table for students to read or annotate. The two visual labs are not tied to graded problem families.

## 4. Answer-checking and correctness audit

### P0 — Definite user-facing correctness defects

**A. Rejects valid indefinite integrals that differ by a constant.**

Directly reproduced against \`CalcMath.check\`:

- Expected \`x^2/2\`, entered \`x^2/2+C\`: **accepted** (because \`C\` is evaluated as zero internally).
- Expected \`x^2/2\`, entered \`x^2/2+7\`: **rejected**, although all such antiderivatives have derivative x.
- Expected \`x^2/2\`, entered \`x^2/2+2*pi\`: **rejected**.

This is a grading error for an indefinite-integral exercise. A proper integral-answer type should validate the derivative of the submission against the integrand and allow arbitrary additive constants, with domain awareness.

**B. Accepts mathematically inequivalent expressions inside an equivalence tolerance.**

Directly reproduced: expected \`x\`, entered \`x+0.00001\`: **accepted as "Mathematically equivalent."** They are not equal functions. An approximate *numerical* answer should have a tolerance, but algebraic identity should not be represented as proven by a few sample values.

**C. Current tests are self-consistency checks, not independent proofs.**

The automated regression suite calls the same \`CalcMath.check\` on each expected answer generated by the bank. It therefore catches syntax and grader/key incompatibilities, but does not detect a mathematically wrong generated answer when both the template and checker agree. Independently derived results, algebraic identities, symbolic derivative/integral checks, or vetted golden examples are needed.

### P1 — Mathematical communication and pedagogy

**D. Domain restrictions are inconsistently assessed.** An expression may be algebraically right on its natural domain but incomplete as a function specification. For example, composing logarithms, reciprocals, and radicals often asks only for a formula without requiring the domain. Add a separate domain field or a final domain subquestion where appropriate.

**E. Some assessed-step wording is mathematically misleading.** In \`functions-domain\`, the step **"What condition must the radicand satisfy?"** expects the numeric response \`0\` rather than the condition \`ax-b≥0\`. The answer is a boundary value, not the condition asked for. Rename the step to "What is the smallest allowable value of the radicand?" or accept a mathematical inequality.

**F. "Worked solution" frequently means a terse single sentence.** Examples such as "Use the chain rule" or "substitute the input" may be appropriate hints, but they do not constitute explanatory solutions of complex problems. Hard problems need assumptions, setup, reasoning, justified choice of rule, derivation, checks and interpretation.

**G. Difficulty levels are uncalibrated.** 134 families carry the highest existing difficulty level (Level 4), including routine inverse-trigonometric differentiation, trig-formula recall, and one-iteration Newton problems. Teacher-calibrated levels and difficulty *within* a family are preferable to tagging almost two thirds as hard.

### P2 — Software features and usability

**H. No assessed graphs or tables.** Both mathematical plots live in the separate laboratory; students cannot answer graphical limit, slope, sign-chart, derivative-graph, shaded-area or graph-selected integral questions.

**I. No instructor-controlled progression.** No assignment sets, prerequisite enforcement, course-week mapping, answer-review queue, or sharable teacher-defined practice collections.

**J. Limited answer modes.** The system handles expressions, numbers and multiple choice, but not a typed inequality, set/interval notation, multi-root sets, proof/explanation, sketch, graph click, plotting or structured modeling constraints.

**K. Limited misconception diagnosis.** The checker mostly verifies equivalence; a wrong answer is not systematically classified as a power-rule error, missing chain-rule factor, derivative sign reversal, incorrect integration bounds, failure to distinguish displacement from distance, or an extraneous solution.

**L. Progress is browser-local.** Useful for privacy and no-cost operation, but it is not a teacher-visible learning record and is vulnerable to clearing local storage.

## 5. Recommended action plan (priority order)

### Release gate 1: mathematical reliability — do this first
1. Introduce distinct answer types for **identity**, **numeric approximation**, **indefinite integral**, **domain/interval**, **set of roots**, and **choice**, rather than applying the same sample-based check everywhere.
2. Fix \`+C\`/arbitrary constant grading for indefinite integrals; verify by differentiation, respecting domain restrictions.
3. Replace unqualified "mathematically equivalent" messages with precise behavior (symbolic verification when available; numeric sample agreement clearly marked otherwise).
4. Build an independent bank of at least 5 worked, mathematically verified instances per family and adversarial incorrect submissions. Include actual theoretical justifications for each family.
5. Review all wording, units, domain hypotheses and generated coefficients; reject degenerate parameters that alter the intended difficulty or make a prompt false.
6. Add automated regression cases for every corrected user-facing bug.

### Release gate 2: core MTH 121 completeness
1. Add real **graph- and table-based assessed exercises** for function graphs, one-sided limits, differentiability, f' and f'' signs, and definite integral interpretation.
2. Add **sigma-notation** problems translating sums to definite integrals and taking Riemann-sum limits.
3. Add **initial-value problems** recovering position/function from a derivative plus a condition.
4. Add **multi-step curve-analysis** problems combining roots, asymptotes, critical numbers, derivative sign charts, concavity and graph choice.
5. Add **multi-stage modeling** tasks for optimization/related rates with constraints, valid domains, justifications and units not provided upfront.
6. Add **error analysis and differentials** including absolute/relative error and linear approximation.
7. Add more **qualitative/proof-aware** questions about continuity, differentiability, hypotheses of IVT/MVT, and failure cases.
8. Tag some current integration and L'Hôpital topics as **optional/Calculus II boundary** until compared with the current MTH 121 syllabus.

### Release gate 3: serious independent practice
1. Introduce a course-unit **learning-objective map** with balanced computational, conceptual, graphical and applied tasks.
2. Add deliberate, teacher-reviewed misconceptions and answer-specific feedback.
3. Create cumulative, mixed-technique exam-style sets where the technique is *not named* by the prompt.
4. Provide full solutions for hard problems, including model setup and verification; preserve hints that reveal one idea at a time.
5. Recalibrate difficulty on actual effort and student performance, rather than formula complexity.
6. Invite faculty review and pilot with real MTH 121 students; collect anonymous mistaken-answer patterns before claiming full adequacy.

## 6. Proposed readiness rubric

A problem bank is *ready as the main independent practice resource* only when:

- Every required objective on the **current** instructor's MTH 121 syllabus has several **meaningfully distinct, vetted** tasks.
- Every core objective is assessed computationally and, where sensible, conceptually and graphically.
- All answer keys have independent justification; no known accepted-wrong or rejected-right grading bugs remain.
- Indefinite integrals, interval/domain responses, multiple roots and units are graded correctly.
- Major application units contain complete 4–8 stage tasks, not only recall or single-formula substitution.
- Difficulty is calibrated and examples are sufficiently diverse for cumulative practice.
- Incorrect answers receive specific, accurate feedback and hard tasks show complete solutions.
- Accessible keyboard, screen-reader and mobile interactions have been tested.
- At least one instructor has used and reviewed a complete representative exam-style set, and the most common errors have been resolved.

## 7. Audit conclusion

The site has achieved **breadth of procedural coverage** but not **pedagogical completeness, graph/data representation, independent correctness verification, or assessment-level reliability**. The number 218 should not be used as a proxy for 218 mastered calculus ideas.

**Recommended designation for now:** *Supplementary Calculus I practice for Spring Hill College MTH 121.*  
**Not yet warranted:** *Complete standalone Calculus I mastery or exam-preparation system.*

**Scope note:** This document records defects and planned corrective work. It **does not** assert that any of the identified software defects were fixed, nor that every existing template was independently proven correct.
