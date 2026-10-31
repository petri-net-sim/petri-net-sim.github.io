import { test } from 'node:test';
import assert from 'node:assert/strict';
import { rewriteLinks, route } from './sync.mjs';
import { validateTranslation } from './translate.mjs';
test('Markdown links resolve within the source tree and preserve source provenance', () => {
  const files = new Set(['docs/a.md', 'docs/b.md']);
  const result = rewriteLinks('[Other](b.md#run) ![Screenshot](assets/editor.png) [Code](../backend/main.py) [Web](https://example.com)', 'web', 'docs/a.md', files, 'owner/repo', 'abc123');
  assert.match(result, /\(\/web\/docs\/b\/#run\)/);
  assert.match(result, /\(\/upstream\/web\/docs\/assets\/editor.png\)/);
  assert.match(result, /github.com\/owner\/repo\/blob\/abc123\/backend\/main.py/);
  assert.match(result, /\(https:\/\/example.com\)/);
  assert.equal(route('web', 'README.md'), 'web/overview');
});
test('translation rejects changed commands, links and code', () => {
  const original = 'Text `GET /api/v1/config`. [Guide](/start/)\n```bash\ndocker run example\n```';
  assert.doesNotThrow(() => validateTranslation(original, { title: 'Назва', body: original.replace('Text', 'Текст') }));
  assert.throws(() => validateTranslation(original, { title: 'Назва', body: original.replace('docker run', 'docker build') }));
  assert.throws(() => validateTranslation(original, { title: 'Назва', body: original.replace('/start/', '/wrong/') }));
});
