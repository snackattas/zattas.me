# Gallery Scripts

These are the automation scripts shown to visitors on the site. Each script navigates to zattas.me, sets two cookies (`automation_user` and `automation_language`), and keeps the browser open for 5 minutes so the site can detect the tool and serve a haiku.

## Naming convention

```
{language}-{tool}-fun.{ext}
```

Each file starts with a comment declaring its filename and language — the site's code display uses this to label the snippet.

## How transform.sh uses these

`transform.sh` takes a gallery script and produces a CI-runnable version by:

1. Replacing `https://zattas.me` with the test server URL
2. Switching headless mode to `true`
3. Replacing the "Keep open for 5 minutes" line with the matching assertion from `scripts/assertions/`

The gallery scripts are also loaded at build time by `scripts/generate-gallery-data.js` and embedded into the site as static data.
