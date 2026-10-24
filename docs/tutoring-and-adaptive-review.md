# CalcMentor — Error Feedback, Mastery and Review

October 23, 2026 · Spring Hill College · MTH 121 Calculus I

## What was implemented

CalcMentor remains a static, browser-based course practice system. It now adds a deterministic teaching and review layer:

1. **Misconception-aware feedback:** Explicit mathematical rules recognize selected wrong answers. Examples include omitted chain-rule factors, missing terms in the product rule, reversed coefficients in sine limits, and omitted division in reverse power integration. The explanation describes the verified pattern rather than simply showing the answer.
2. **One-step corrective exercises:** A student with a recognized mistake can solve a smaller, targeted mathematical question (for example, differentiating the inner function), see precise feedback, then retry the original question. The smaller exercise does **not** replace successful solution of the original problem.
3. **Skill-level learning record:** All 218 generators are assigned to one of 23 coarse-grained skills, with prerequisites and counts for independent attempts, assisted attempts, and recognized misconceptions.
4. **Review scheduling:** Independently successful **new parameter versions** increase a provisional skill level and schedule suggested reviews after approximately 1, 3, 7 or 14 days. Assisted work or errors lead to more immediate review. Replaying the exact same family/seed does not raise proficiency or postpone an already-due review.
5. **Adaptive practice selection:** Review-due skills are considered first, followed by a weak prerequisite when applicable, then demonstrated weaknesses, then unpracticed skills. Recommended exercises use guided steps for developing skills and independent final-answer practice for stronger skills. Students can still choose any topic or practice mode.
6. **Progress interface:** The course overview offers recommended practice and due reviews; progress lists each skill, independent/supported attempts and next review date. All data stays in browser local storage, can be cleared, and does not create student accounts.

## A concrete teaching sequence

If a student enters \`5(3x^2+2)^4\` instead of the derivative of \`(3x^2+2)^5\`, the explicit chain-rule pattern recognizes the missing \`6x\` factor and asks for \`d/dx(3x^2+2)\`. If this smaller question is answered correctly, the student is invited to return to the original answer and include the inner derivative. A supported success is **not** marked as an independent mastery demonstration. The next recommended practice may cover a prerequisite power-rule question if the record indicates that prerequisite has not been demonstrated.

For unrecognized wrong expressions, CalcMentor **does not fabricate a psychological or mathematical diagnosis**. It offers the original problem's authored hints instead.

## What the proficiency measure means

The stored level (0–4) is a deterministic practice heuristic, **not** a validated mastery metric. An unaided answer on a new family/seed may raise the level, but that alone does not prove long-term retention. The progress label distinguishes initial confidence from a review completed when due. There is no grade assignment, instructor surveillance, cloud synchronization, or reminder/notification outside the open website.

Intervals are planning heuristics that can be revised after classroom testing. A refresh or different browser may change the visible experience because practice records are device-local.

## Mathematical reliability

Original quality controls remain mandatory before GitHub Pages publication:

- Mathematical answer-key reference checks across all 218 problem families using independently computed differentiation, integration, limits, geometry and application results.
- Explicit worked-solution coverage across all 218 families and seeded structural testing of generated intermediate explanations.
- Independent verification of intermediate equations for ten representative calculus methods across 30 widely distributed generated examples each.
- Diagnostic and correction tests comparing known incorrect expressions with mathematically derived repair questions across randomized problem parameters.
- End-to-end interface tests for incorrect answer → targeted repair → assisted completion → recommended prerequisite practice.
- Tests of review due dates, attempt classifications, exact-repeat restrictions, and the 23-skill mapping.

**Remaining limitations:** These tests are not formal symbolic proofs for every line of every derivation or every possible generated instance. The live answer checker compares expressions at numerical sample points rather than being a full computer algebra system. Error diagnostics currently handle selected identifiable patterns, not arbitrary errors, handwritten work, or free-form mathematical explanations. Skills such as plotting, graphical limit reasoning, and difficult mixed exam problems still require more work.

## Source files

- \`tutor-diagnostics.js\`: recognized mathematical patterns and corrective questions.
- \`tutor-learning.js\`: skill map, attempt records, prerequisites, review scheduling, recommendations.
- \`app.js\`, \`index.html\`, \`styles.css\`: learner interface.
- \`tests/tutor-learning.test.cjs\`: mathematical diagnostics, mastery state and review scheduling.
- \`tests/tutor-ui.test.cjs\`: interactive tutoring session regression.
- \`tests/tutor-diagnostics-bank.test.cjs\`: randomized mathematical diagnosis examples.
- \`tests/intermediate-math.test.cjs\`: independent reference tests for representative worked-equation steps.
- \`tests/full-solution-coverage.test.cjs\` and \`tests/independent-*.test.cjs\`: remaining solution and mathematical coverage gates.

## Classroom review still needed

Instructors should try a representative selection of weaker and stronger student answers, assess whether feedback is clear without leaking complete answers, and watch for false positive/negative error diagnoses. A genuine effectiveness evaluation requires testing against student performance and retention on new problems—not simply checking whether the software accepts generated answer keys. Review scheduling, skill groupings and the difficulty of corrective questions should then be adjusted from evidence.
