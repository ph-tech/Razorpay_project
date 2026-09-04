# RiskLens

RiskLens is an explainable merchant-risk operations dashboard for payment platforms. It helps an operations reviewer understand not only that an event was flagged, but also the merchant-relative evidence, weighted contribution, confidence, and recommended response.

## Product framing

This is a strong portfolio direction because it makes a deliberate product argument: in a regulated payments workflow, a risk score without evidence is not sufficient for a human to take action. RiskLens is therefore a decision-support system rather than a generic AI assistant.

## Transparent scoring model

Each alert is represented as an additive score:

```text
risk score = baseline risk + settlement failure impact
           + velocity deviation impact + compliance impact
           + payment anomaly impact
```

Every impact is capped, normalized against the merchant's 90-day baseline, and shown in the score-contributor panel. The severity tiers are:

| Score | Tier |
| --- | --- |
| 0–39 | Low |
| 40–59 | Medium |
| 60–79 | High |
| 80–100 | Critical |

The displayed confidence indicates signal coverage and consistency, not a claim that a trained model produced a certain probability. This distinction keeps the demo honest and gives reviewers a concrete way to audit or tune weights.

## Included workflow

- Risk feed with severity filters and plain-language summaries
- Alert drill-down with weighted evidence and confidence
- Merchant baseline versus current risk trajectory
- Policy-aligned recommended actions
- Actionable alert resolution state
- Decision-quality metrics for false positives, catch rate, and triage time

## Local development

```bash
npm install
npm run dev
```

Use `npm run build` to generate a production bundle.
