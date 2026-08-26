# Security Specification: BADEENDLYMPICS 2027

## 1. Data Invariants & Collections
- `/teams/{teamId}`: Contains registered teams. Public read access is enabled so visitors can view participating teams and the leaderboard. Create and update validate required attributes, string lengths, and 4 member count bounds.
- `/scores/{scoreId}`: Contains game score entries. Public read access is enabled for the live leaderboard. Write operations validate team names, game identifiers, point ranges, and timestamp fields.

## 2. The Dirty Dozen Payloads (Target Rejections)
1. Team with empty name (`name: ""`) -> Reject
2. Team with oversized name (`name.size() > 100`) -> Reject
3. Team with invalid members list (`members.size() > 10`) -> Reject
4. Team with malicious script in email -> Reject format validation
5. Score entry with negative or non-number points -> Reject
6. Score entry with points exceeding maximum game limit (`points > 10000`) -> Reject
7. Score entry missing `spelId` -> Reject
8. Score with oversized `spelName` -> Reject
9. Team update injecting unwhitelisted ghost fields -> Reject
10. Malformed team ID path injection (`../evil-doc`) -> Reject via `isValidId()`
11. Unauthenticated write to admin configuration paths -> Reject via default deny
12. Attempt to bypass schema rules via raw payload manipulation -> Reject
