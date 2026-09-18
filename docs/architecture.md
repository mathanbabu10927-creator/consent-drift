# Consent Drift architecture

The planned pipeline for the project is:

```text
APK v1 + APK v2
        ↓
APK Analyzer
        ↓
Permission Diff
        +
Sensitive API / Capability Diff
        ↓
Risk Engine
        ↓
Explanation Engine
        ↓
Privacy Changelog
        ↓
User Review
```

## Overview

Consent Drift compares two APK versions to detect changes in app behavior and privacy risk. It will evaluate permission changes and sensitive capability changes, then combine those results into an understandable privacy summary for review.

## Key stages

1. APK Analyzer
   - Extracts app metadata and app-level capabilities from each APK.
2. Permission Diff
   - Compares permissions granted or removed between versions.
3. Sensitive API / Capability Diff
   - Detects use of privacy-sensitive APIs, data access patterns, or capability changes.
4. Risk Engine
   - Scores the magnitude and severity of each change.
5. Explanation Engine
   - Converts technical diffs into human-readable explanations.
6. Privacy Changelog
   - Produces a timeline or summary of privacy-related changes.
7. User Review
   - Presents the findings for human review and decision-making.

This foundation keeps the system modular so each stage can be implemented and tested independently.
