# Atomic Course Purchase and Bonus Coin Attribution

## Context
Courses are sold directly in THB and bundled with Bonus Coins to encourage immediate hands-on practice in Video Studio.

## Decision
Upon automated verification of a course payment slip via SlipOK, a database transaction performs two simultaneous atomic mutations:
1. Inserts a record in `course_entitlements` granting instant access to course lessons.
2. Credits the associated bonus Coins to the user's `wallets` and appends a `bonus_course_grant` entry in `coin_transactions`.

## Rationale
- Zero latency between purchasing a course and receiving bonus video generation capability.
- Prevents partial failure scenarios where course is unlocked but coins fail to credit.
