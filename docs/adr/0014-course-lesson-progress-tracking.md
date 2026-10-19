# Course Lesson Progress Tracking

## Context
Users consume video course lessons across multiple sessions and devices (mobile and desktop).

## Decision
We maintain a dedicated `lesson_progress` table tracking each user's latest playback timestamp, highest timestamp reached, and boolean completion status per lesson.

## Rationale
- Allows seamless "Resume Video" functionality across mobile and desktop.
- Gives users visual progress bars and completion percentages per course.
