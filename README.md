# CalcMentor — MTH 121 Calculus I | Spring Hill College

An interactive Calculus I problem-practice website created by **Priyojit Palit** in the **Department of Mathematics and Computer Science**, for students at **Spring Hill College**.

This is an independently developed course resource hosted on GitHub Pages; it is not the College’s official website.

**Website:** https://priyojitpalit.github.io/calcmentor/

## Course and author

- **Institution:** Spring Hill College, Mobile, Alabama
- **Course:** MTH 121 — Calculus I
- **Created by:** Priyojit Palit
- **Department:** Mathematics and Computer Science
- **Course practice website:** https://priyojitpalit.github.io/calcmentor/

## What students can do

- Practice **218 distinct original problem families** across six course units (36 function/review, 36 limits/continuity, 45 differentiation, 38 derivative applications, 39 integration, and 24 integral applications).
- Generate new variants with different numerical parameters.
- Switch between **guided mode** (an assessed sequence of intermediate steps) and **independent mode** (the final task).
- Ask for two progressively more specific hints or open **Solution steps**. Forty selected families have explicit, parameter-specific algebraic and calculus derivations; the remaining 178 show the available method, intermediate assessed answers, and explanations as solution outlines. Students can review solutions after completing a problem.
- Enter algebraic answers checked against the expected result at multiple test points, with tighter checks for expressions than for approximate numbers. Indefinite antiderivatives accept arbitrary additive constants. Numerical agreement is **not** a symbolic proof of identity.
- Investigate two interactive visual labs: a secant slope approaching a derivative, and right-endpoint Riemann sums approaching a definite integral.
- Keep progress locally, identify practiced problem families, review recent work, and export practice records as CSV.
- Share a deterministic problem variation with a URL containing a family and seed.

These are **original problem generators**, not copies of copyrighted exercise statements or answer keys. The expansion was designed after reviewing the topic organization, exercise styles, and conceptual coverage of the following calculus resources:

- [OpenStax Calculus, Volume 1](https://openstax.org/books/calculus-volume-1/pages/1-introduction) — Gilbert Strang and Edwin Herman; [Creative Commons Attribution 4.0](https://creativecommons.org/licenses/by/4.0/).
- [Active Calculus, Single Variable (second edition)](https://activecalculus.org/acs2e/) — Matthew Boelkins and collaborators; Creative Commons Attribution-ShareAlike 4.0.
- [Paul's Online Math Notes: Calculus I](https://tutorial.math.lamar.edu/Classes/CalcI/CalcI.aspx) — used as a topic-coverage reference, without importing exercises or solutions.

No external exercise-bank content is redistributed. These sites and authors have not endorsed CalcMentor.

## Independent mathematical verification

All **218 problem families** have been checked against independent mathematical references on **30 widely distributed generated parameter seeds per family** (6,540 unique family/seed instances). The reference suites use independent substitution, differentiation, integration, limit estimates, geometry and theorem checks rather than the site's own answer-key equivalence routine.

This work identified and corrected an actual wrong answer key in the final-position motion problem. The suite is automatically run before site publication; an error prevents deployment.

See [Independent Mathematical Verification](docs/independent-math-verification.md) for the full methodology, verified families and remaining limitations. This is **sample-based mathematical verification**, not a formal proof of all possible parameter combinations, intermediate steps or student responses.

## Solution explanations

CalcMentor distinguishes **worked mathematical derivations** from **solution outlines**.

- For 40 selected families, the solution view constructs an explicit mathematical path from the given data to the result: setting up constraints or integrals, applying rules, simplifying and evaluating. The values update with every generated problem version.
- For the other 178 families, it presents the available hints, reasoning, assessed intermediate answers, and final answer in order, while clearly labeling the display a **solution outline**, not a full derivation.
- Revealing a solution during an attempt counts as supported practice. Students can review solutions again after completing the problem.
- `tests/worked-solutions.test.cjs` validates that explanations are present and parameter-dependent across all 218 families.

**Remaining authoring work:** Produce individually written, independently reviewed full derivations for the other families, including explicit intermediate equations and explanations of common wrong turns. The solutions should not be presented as complete until this is done.

## Access and operating costs

The site runs entirely in a web browser with standard HTML/CSS/JavaScript. There are no API calls, accounts, database, advertising, or subscription fees. GitHub Pages hosting is free for this public repository. A standard browser is sufficient; **no generative AI API is used**.

## Website files

| File | Purpose |
| --- | --- |
| `index.html` | Semantic page layout and user interface |
| `styles.css` | Responsive academic styling |
| `math-engine.js` | Safe expression parser, answer equivalence and deterministic randomness |
| `problem-bank.js` | 59 original foundation problem families |
| `extra-functions.js` | 33 additional composition, inversion, and domain structures |
| `extra-limits.js` | 25 additional limit and continuity structures |
| `extra-derivatives.js` | 30 additional differentiation structures |
| `extra-applications.js` | 25 additional optimization, related-rates, and modeling structures |
| `extra-integrals.js` | 35 additional integration and application structures |
| `extra-integral-applications.js` | 11 additional applied-integration structures |
| `grading-categories.js` | Explicit antiderivative answer classifications, distinct from ordinary algebra |
| `worked-solutions.js` | Explicit and fallback structured mathematics solution displays |
| `tests/worked-solutions.test.cjs` | Regression tests for parametrized explanations |
| `app.js` | Topic browser, answer flow, learning record and visual laboratories |
| `tests/smoke.test.cjs` | Automated expected-answer and checker regression tests |
| `tests/independent-*.test.cjs` | Independent mathematical reference checks across all six units |
| `.github/workflows/deploy-pages.yml` | Tests and GitHub Pages publication |

## Run and deploy

**On your computer:** Download all the HTML, CSS and JS website files to the same directory and open `index.html` in a modern browser. There are no JavaScript modules or external assets, so `file://` loading works.

**On GitHub Pages:** The existing GitHub Actions workflow runs tests and deploys the site when changes are pushed to `main`. No build tools are required for the site itself.

**Run automated tests manually** (if you have Node.js installed):

```bash
node tests/smoke.test.cjs
node tests/independent-calculus.test.cjs
node tests/independent-limits.test.cjs
node tests/independent-integrals.test.cjs
node tests/independent-functions.test.cjs
node tests/independent-applications.test.cjs
node tests/independent-ftc.test.cjs
```

## Accuracy and appropriate use

The expression equivalence checker tests expressions at multiple sample points, rather than performing a formal symbolic proof. As of October 21, 2026, previously reproduced defects accepting `x+0.00001` as exactly equal to `x` and rejecting legitimate antiderivatives such as `x²/2+7` have been addressed in the typed checker. Numerical sampling may not recognize every correct form, detect every domain restriction, or distinguish expressions that agree only at the selected points. Please report any incorrectly graded examples by opening a GitHub issue and including the problem URL and the submitted answer.

Some problems accept numerical answers to a tolerance. For the 21 explicitly classified antiderivative families, any additive constant is permitted, including `+C` or a fixed numeric constant. Definite-integral results do not permit an arbitrary additive constant. Learners should check mathematical domain restrictions and physical units. This is intended as guided practice, **not an instructor-managed assessment system**. Local progress can be erased by clearing browser data, and it does not synchronize between devices.

## License

Original code and exercise templates: MIT License (see [LICENSE](LICENSE)). Third-party course materials are not included or relicensed.
