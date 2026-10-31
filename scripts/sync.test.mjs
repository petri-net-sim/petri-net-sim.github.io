import { test } from 'node:test';
import assert from 'node:assert/strict';
import { rewriteLinks, route } from './sync.mjs';
import { prepareUkrainian, sourceHash } from './localize.mjs';
test('Markdown links resolve within the source tree and preserve source provenance', () => {
  const files = new Set(['docs/a.md', 'docs/b.md']);
  const result = rewriteLinks('[Other](b.md#run) ![Screenshot](assets/editor.png) [Code](../backend/main.py) [Web](https://example.com)', 'web', 'docs/a.md', files, 'owner/repo', 'abc123');
  assert.match(result, /\(\/web\/docs\/b\/#run\)/);
  assert.match(result, /\(\/upstream\/web\/docs\/assets\/editor.png\)/);
  assert.match(result, /github.com\/owner\/repo\/blob\/abc123\/backend\/main.py/);
  assert.match(result, /\(https:\/\/example.com\)/);
  assert.equal(route('web', 'README.md'), 'web/overview');
  assert.equal(rewriteLinks('![Simulation](assets/simulation.gif)', 'web', 'docs/simulation.md', files, 'owner/repo', 'abc123'), '![Simulation](/showcase/pns/simulation.png)');
});
test('source updates preserve agent-authored Ukrainian pages exactly', () => {
  const original = '---\ntitle: "Guide"\n---\nUpdated English text';
  const authored = '---\ntitle: Посібник\n---\nУкраїнський текст, написаний агентом.';
  assert.equal(prepareUkrainian(original, authored), authored);
});
test('missing translations use an explicit English fallback with Ukrainian links', () => {
  const original = '---\ntitle: "Guide"\n---\n[Next](/web/docs/running/)\n```bash\ndocker run example\n```';
  const fallback = prepareUkrainian(original, null);
  assert.match(fallback, /англійський оригінал/);
  assert.match(fallback, /\(\/uk\/web\/docs\/running\/\)/);
  assert.match(fallback, /docker run example/);
  assert.equal(prepareUkrainian(original, fallback), fallback);
  assert.equal(sourceHash(original), sourceHash(original.replaceAll('\n', '\r\n')));
});
