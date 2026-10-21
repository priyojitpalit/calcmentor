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

- Practice **59 distinct original problem families** across six course units (functions, limits, differentiation, derivative applications, integration, and integral applications).
- Generate new variants with different numerical parameters.
- Switch between **guided mode** (an assessed sequence of intermediate steps) and **independent mode** (the final task).
- Ask for two progressively more specific hints on each step or review a worked solution.
- Enter algebraic answers, including alternatives that are mathematically equivalent on tested domains (the checker evaluates expressions safely without running student code).
- Investigate two interactive visual labs: a secant slope approaching a derivative, and right-endpoint Riemann sums approaching a definite integral.
- Keep progress locally, identify practiced problem families, review recent work, and export practice records as CSV.
- Share a deterministic problem variation with a URL containing a family and seed.

These are **original template-generated questions**, not a mirror or scrape of third-party problem statements, solutions, or notes. Topic selection reflects conventional university calculus syllabi, including [Paul's Online Math Notes](https://tutorial.math.lamar.edu/Classes/CalcI/CalcI.aspx). This project is independent and is not endorsed by that site's author.

## Access and operating costs

The site runs entirely in a web browser with standard HTML/CSS/JavaScript. There are no API calls, accounts, database, advertising, or subscription fees. GitHub Pages hosting is free for this public repository. A standard browser is sufficient; **no generative AI API is used**.

## Website files

| File | Purpose |
| --- | --- |
| `index.html` | Semantic page layout and user interface |
| `styles.css` | Responsive academic styling |
| `math-engine.js` | Safe expression parser, answer equivalence and deterministic randomness |
| `problem-bank.js` | Original problem families, hints, steps and worked explanations |
| `app.js` | Topic browser, answer flow, learning record and visual laboratories |
| `tests/smoke.test.cjs` | Automated regression tests |
| `.github/workflows/deploy-pages.yml` | Tests and GitHub Pages publication |

## Run and deploy

**On your computer:** Download all five website files to the same directory and open `index.html` in a modern browser. There are no JavaScript modules or external assets, so `file://` loading works.

**On GitHub Pages:** The existing GitHub Actions workflow runs tests and deploys the site when changes are pushed to `main`. No build tools are required for the site itself.

**Run automated tests manually** (if you have Node.js installed):

```bash
node tests/smoke.test.cjs
```

## Accuracy and appropriate use

The expression equivalence checker tests expressions at multiple sample points, rather than performing a formal symbolic proof. Numerical sampling may not recognize every correct form, detect every domain restriction, or distinguish expressions that agree only at the selected points. Please report any incorrectly graded examples by opening a GitHub issue and including the problem URL and the submitted answer.

Some problems accept numerical answers to a tolerance. For antiderivatives, an additive constant is optional in the response. Learners should check mathematical domain restrictions and physical units. This is intended as guided practice, **not an instructor-managed assessment system**. Local progress can be erased by clearing browser data, and it does not synchronize between devices.

## License

Original code and exercise templates: MIT License (see [LICENSE](LICENSE)). Third-party course materials are not included or relicensed.
