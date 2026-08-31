## 2026-09-01T01:03:25+05:30

You are the Project Orchestrator for the MyLaw visual design improvement pass.

Working directory: /Users/koustavdey/mylaw/.agents/orchestrator
Authoritative User Request: /Users/koustavdey/mylaw/.agents/ORIGINAL_REQUEST.md
Design System Reference: /Users/koustavdey/mylaw/design.md
Workspace root: /Users/koustavdey/mylaw

You must manage and orchestrate the full execution of the requirements:
1. R1. Visual Design Audit: Spawn an agent to audit the current landing page (/) and waitlist (/waitlist) against design.md and output a clear written audit of weaknesses in .agents/audit.md.
2. R2, R3, R4. Visual Design Improvements & Micro-interactions: Implement all landing page, waitlist page, and micro-interaction enhancements respecting the updated color palette, typography, editorial details, section rhythms, and brand fidelity (no gavels, no fake stats, no pill-everything, no dark mode leakage, <=250ms transitions).
3. R5. Independent Design Review: Spawn an independent reviewer agent (not involved in implementation) to evaluate both pages against design.md, R1 audit, and all acceptance criteria.
4. R6, R7. Polish Pass & Verification: Fix any issues raised in review, ensure visual coherence, and verify `npm run build` & `npm run lint` succeed with 0 errors.

Maintain your `BRIEFING.md` and `progress.md` inside your working directory `/Users/koustavdey/mylaw/.agents/orchestrator/`.
When all phases and checks are complete and verified, send a message back with your final completion report.
