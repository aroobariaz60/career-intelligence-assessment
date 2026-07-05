/*
# Add quick feedback column to submissions

1. Modified Tables
- `submissions`: Add `feedback_quick` column for the new text feedback question
- Rename existing feedback columns conceptually (feedback_easy -> feedback_easy_to_use, feedback_interesting -> feedback_enjoyed_test)

2. Changes
- Add `feedback_quick` text column for optional quick feedback
*/

ALTER TABLE submissions ADD COLUMN IF NOT EXISTS feedback_quick text;
