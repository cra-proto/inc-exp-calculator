# Monthly net income and expense worksheet

## Overview

This repository was created via the **Design Assistant**.  
It contains the template files and in-scope pages needed to get started.

GitHub Pages: [https://cra-proto.github.io/inc-exp-calculator](https://cra-proto.github.io/inc-exp-calculator)

---
## Update procedures

Add information on how to manage your repo here.

---
## Design phase roadmap:

- [x] Initial content inventory and repo setup
- [x] Prototype: co-design navigation and content
- [ ] SME review and accuracy check
- [ ] Validation usability testing (including accessibility review)
- [ ] Refine prototype (if required)
- [ ] Spot check usability (if required)

**Updated:**  2026-03-03

## Information Architecture
```mermaid
flowchart TD;
    node1(Canada.ca)
    node2(Canada Revenue Agency #40;CRA#41;)
    node3(CRA compliance and enforcement)
    node4(Debt collection at the CRA)
    node5(Monthly net income and expense worksheet)
    node1 --x node2
    node2 --> node3
    node3 --> node4
    node4 --> node5
    click node1 "https://www.canada.ca/en.html" _blank
    click node2 "https://www.canada.ca/en/revenue-agency.html" _blank
    click node3 "https://www.canada.ca/en/revenue-agency/programs/about-canada-revenue-agency-cra/compliance.html" _blank
    click node4 "https://www.canada.ca/en/revenue-agency/services/about-canada-revenue-agency-cra/when-you-money-collections-cra.html" _blank
    click node5 "https://www.canada.ca/en/revenue-agency/services/about-canada-revenue-agency-cra/when-you-money-collections-cra/worksheet-disclaimer.html" _blank
    classDef inscope stroke:#7636ab,stroke-width:3px
    class node5 inscope
```
