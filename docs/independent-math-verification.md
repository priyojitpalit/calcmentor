# Independent Mathematical Verification — CalcMentor MTH 121

**Date:** October 21, 2026  
**Repository:** https://github.com/priyojitpalit/calcmentor  
**Deployment:** https://priyojitpalit.github.io/calcmentor/

## Scope and outcome

The 218 original Calculus I problem-generating families were reviewed by topic and independently tested using 30 **widely separated pseudorandom seeds per family**, or **6,540 family/seed instances**. At least one mathematical result or conceptual conclusion was independently checked for **every family**, rather than merely asking CalcMentor to accept its own generated answer key. Many families have multiple steps; **not every intermediate step or hint was independently certified**.

A genuine wrong numerical answer key was discovered and corrected:

- **Family:** \`extra-integral-particle-position\`, in \`extra-integrals.js\`.
- **Prompt example:** Initial position 5 m, velocity \`v(t)=8t+6\` m/s, over \`[0,7]\`.
- **Actual answer:** \`5 + integral_0^7 (8t+6)dt = 243\` m.
- **Original erroneous answer:** \`240.5\` m. The expression grouped the initial position incorrectly into the numerator of the quadratic displacement term.
- **Correction:** \`s0+"+"+a*L*L+"/2+"+b*L\`, with a permanent independent motion/integration regression test.

Following the correction, all independent suites passed on the 30-seed samples.

## Verification by course unit

| Course unit | Independently checked families | Reference approach |
|---|---:|---|
| Functions, inverses and domains | **36 / 36** | Apply the stated outer/inner functions separately, compose numerically, check inverses by substitution and test real-domain boundaries |
| Limits and continuity | **36 / 36** | Evaluate expressions close to the specified approach point or at large magnitudes; independently check one-sided and theorem conditions |
| Differentiation | **45 / 45** | Derive numerical derivatives directly from original functions; check implicit partial derivatives, higher derivatives, tangent lines, corners and nested chain formulas |
| Derivative applications | **38 / 38** | Derive related rates, optimization results, extrema, MVT points, linear approximations and Newton steps from the problem statements |
| Integration | **39 / 39** | Numerically differentiate purported primitives and compare to original integrands; independently integrate definite integrals, calculate Riemann sums and apply the Fundamental Theorem |
| Applications of integrals | **24 / 24** | Derive geometry, force, work, area, volume and motion integrands from the prompts and independently integrate them numerically |
| **Total** | **218 / 218** | At least one independently checked mathematical result per problem family |

### Independent test cases

- \`tests/independent-calculus.test.cjs\`: **21** antiderivative families, **45** differentiation families; includes implicit differentiation and 30 corrected final-position cases.
- \`tests/independent-limits.test.cjs\`: **36** limit/continuity families with mathematical and conceptual checks.
- \`tests/independent-integrals.test.cjs\`: **24** integral-application families, **7** definite-integral families and **7** other sum/accumulation families.
- \`tests/independent-functions.test.cjs\`: **36** function/composition/inverse/domain families.
- \`tests/independent-applications.test.cjs\`: **38** derivative-application families.
- \`tests/independent-ftc.test.cjs\`: **5** variable-limit Fundamental Theorem families.
- \`tests/smoke.test.cjs\`: existing expected-answer regression and parser checks, including adversarial wrong answers. These are complementary *self-consistency* tests, not independent mathematical derivations.

One family (\`int-definite-poly\`) is covered both in antiderivative and definite-integral checks; some motion examples are similarly cross-checked. Counting **unique problem family/seed instances** avoids double-counting overlapping checks.

## What "independently checked" means

- The reference checks use **new test-side mathematical expressions and computations**, such as differentiation from the prompt using finite differences, direct substitution, textbook geometric formulas, and independently constructed numerical quadrature. They do **not** use \`CalcMath.check\` to decide whether an answer key is true.
- For limits and integrals, the reference calculations use finite numerical precision and tolerance; theorem-based checks apply to selected conceptual families.
- Some high-frequency composite trigonometric derivatives are checked against explicit independent chain-rule formulas to avoid misleading finite-difference cancellation.
- Seed samples are distributed across the 32-bit generator range rather than drawing adjacent seed integers, which often yield nearly identical coefficients.
- GitHub Actions runs **all independent test suites before GitHub Pages deployment**. A failed check blocks deployment of that commit.

## Explicit limitations

This is a **substantial mathematical regression review, not a formal verification theorem**.

1. Tests examine **30 generated instances per family**, not every possible parameter combination or every arbitrary student response.
2. The audit establishes correctness of at least one independently derived result per family; not all intermediate answers, hints, worked explanations, assumptions, formatting and units have been separately proven.
3. Numerical finite differentiation/integration and asymptotic sampling can miss mathematical subtleties involving singular points, domain restrictions, catastrophic cancellation and coincidental numerical agreement.
4. The live student answer checker still relies on numerical sampling; passing independent answer-key tests does not convert it into a symbolic algebra system.
5. Syllabus completeness, graph-based assessment, diverse conceptual tasks, accessibility and classroom reliability remain separate open audit items.

**Conclusion:** All **218 families** have independently sampled mathematical coverage and the identified final-position key has been corrected. The remaining work is a detailed proof-and-pedagogy review of intermediate steps/hints and a classroom pilot, not further increasing the raw template count.
