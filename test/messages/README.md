# What's this?

Drop message ndjson files in this directory (with `.ndjson` extension).
They will be picked up by `acceptance.spec.tsx` which will try to render them.

This is useful whenever we come across a message stream that causes a runtime error
in HTML Reporter or any other tool depending on `@cucumber/react` so we can diagnose
and fix any issues.

Sometimes we will get message files from users that might be useful for reproducing a bug.
Put these in `./production` - they will not be added to git.
