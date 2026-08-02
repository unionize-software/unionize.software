import http from "node:http";
import type { IncomingMessage, ServerResponse } from "node:http";
import { URL } from "node:url";

import { decryptCiphertext } from "./decryptLocal";
import { getIntakeById, listIntakes, openLocalIntakeDb, setIntakeStatus } from "./localDb";

function json(res: ServerResponse, status: number, body: unknown) {
  const payload = JSON.stringify(body);
  res.writeHead(status, {
    "Content-Type": "application/json",
    "Cache-Control": "no-store",
  });
  res.end(payload);
}

async function readJsonBody(req: IncomingMessage) {
  const chunks: Buffer[] = [];
  for await (const chunk of req) {
    chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk));
  }
  const raw = Buffer.concat(chunks).toString("utf8");
  if (!raw.trim()) return null;
  return JSON.parse(raw) as unknown;
}

function pageHtml() {
  return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>Unionize Intake Dashboard (Local)</title>
    <style>
      :root { color-scheme: light dark; }
      body { font-family: ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Arial, sans-serif; margin: 24px; }
      h1 { margin: 0 0 8px 0; }
      .muted { opacity: 0.75; }
      .row { display: flex; gap: 12px; flex-wrap: wrap; align-items: end; margin: 16px 0; }
      label { font-size: 12px; display: block; margin-bottom: 4px; }
      input, select, button, textarea { font: inherit; padding: 8px; border-radius: 8px; border: 1px solid rgba(127,127,127,.4); background: transparent; }
      button { cursor: pointer; }
      table { width: 100%; border-collapse: collapse; margin-top: 12px; }
      th, td { text-align: left; padding: 8px; border-bottom: 1px solid rgba(127,127,127,.25); vertical-align: top; }
      tr:hover { background: rgba(127,127,127,.08); }
      .mono { font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace; }
      .split { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin-top: 16px; }
      @media (max-width: 900px) { .split { grid-template-columns: 1fr; } }
      pre { padding: 12px; border-radius: 8px; border: 1px solid rgba(127,127,127,.25); overflow: auto; }
      textarea { width: 100%; min-height: 220px; }
    </style>
  </head>
  <body>
    <h1>Intake Dashboard (Local)</h1>
    <div class="muted">Reads from <span class="mono">~/.unionize/intakes.sqlite</span>. Decrypt happens on this machine only.</div>

    <div class="row">
      <div>
        <label>Status</label>
        <select id="status">
          <option value="">(any)</option>
          <option value="new">new</option>
          <option value="triaged">triaged</option>
          <option value="closed">closed</option>
          <option value="expired">expired</option>
        </select>
      </div>
      <div>
        <label>Urgency</label>
        <input id="urgency" placeholder="low / medium / high / retaliation-risk" />
      </div>
      <div>
        <label>Region</label>
        <input id="region" placeholder="California" />
      </div>
      <div>
        <label>Work type</label>
        <input id="workType" placeholder="game dev" />
      </div>
      <div>
        <label>Limit</label>
        <input id="limit" type="number" value="50" min="1" max="500" />
      </div>
      <button id="refresh">Refresh</button>
    </div>

    <table>
      <thead>
        <tr>
          <th>ID</th>
          <th>Received</th>
          <th>Urgency</th>
          <th>Region</th>
          <th>Work</th>
          <th>Status</th>
        </tr>
      </thead>
      <tbody id="rows"></tbody>
    </table>

    <div class="split">
      <div>
        <h2>Metadata</h2>
        <pre id="meta" class="mono">{}</pre>
        <div class="row">
          <button id="markTriaged">Mark triaged</button>
          <button id="markClosed">Mark closed</button>
          <button id="markNew">Mark new</button>
        </div>
      </div>
      <div>
        <h2>Decrypted plaintext</h2>
        <div class="muted">Requires starting the dashboard with <span class="mono">--private-key</span>.</div>
        <div class="row">
          <button id="decrypt">Decrypt selected</button>
        </div>
        <textarea id="plaintext" placeholder="(decrypted text will appear here)" readonly></textarea>
      </div>
    </div>

    <script>
      const rowsEl = document.getElementById('rows');
      const metaEl = document.getElementById('meta');
      const plaintextEl = document.getElementById('plaintext');
      let selectedId = null;

      function q() {
        const params = new URLSearchParams();
        const status = document.getElementById('status').value.trim();
        const urgency = document.getElementById('urgency').value.trim();
        const region = document.getElementById('region').value.trim();
        const workType = document.getElementById('workType').value.trim();
        const limit = document.getElementById('limit').value.trim();
        if (status) params.set('status', status);
        if (urgency) params.set('urgency', urgency);
        if (region) params.set('region', region);
        if (workType) params.set('workType', workType);
        if (limit) params.set('limit', limit);
        return params.toString();
      }

      async function refresh() {
        const res = await fetch('/api/intakes?' + q());
        const data = await res.json();
        rowsEl.innerHTML = '';
        for (const row of data) {
          const tr = document.createElement('tr');
          tr.innerHTML = \`
            <td class="mono">\${row.id}</td>
            <td class="mono">\${row.received_at}</td>
            <td>\${row.urgency}</td>
            <td>\${row.coarse_region ?? '-'}</td>
            <td>\${row.work_type ?? '-'}</td>
            <td>\${row.status}</td>\`;
          tr.addEventListener('click', () => select(row.id));
          rowsEl.appendChild(tr);
        }
      }

      async function select(id) {
        selectedId = id;
        plaintextEl.value = '';
        const res = await fetch('/api/intakes/' + encodeURIComponent(id));
        const data = await res.json();
        metaEl.textContent = JSON.stringify(data, null, 2);
      }

      async function setStatus(status) {
        if (!selectedId) return;
        await fetch('/api/intakes/' + encodeURIComponent(selectedId) + '/status', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ status })
        });
        await select(selectedId);
        await refresh();
      }

      async function decryptSelected() {
        if (!selectedId) return;
        const res = await fetch('/api/intakes/' + encodeURIComponent(selectedId) + '/decrypt', { method: 'POST' });
        const data = await res.json();
        if (!res.ok) {
          plaintextEl.value = data?.error ?? 'Decrypt failed';
          return;
        }
        plaintextEl.value = data.plaintext;
      }

      document.getElementById('refresh').addEventListener('click', refresh);
      document.getElementById('markTriaged').addEventListener('click', () => setStatus('triaged'));
      document.getElementById('markClosed').addEventListener('click', () => setStatus('closed'));
      document.getElementById('markNew').addEventListener('click', () => setStatus('new'));
      document.getElementById('decrypt').addEventListener('click', decryptSelected);

      refresh().catch(err => {
        metaEl.textContent = 'Failed to load: ' + String(err?.message ?? err);
      });
    </script>
  </body>
</html>`;
}

export async function startLocalIntakeDashboard(opts: {
  port: number;
  hostname?: string;
  privateKeyPath?: string;
}) {
  const hostname = opts.hostname ?? "127.0.0.1";
  const db = await openLocalIntakeDb();

  const server = http.createServer(async (req, res) => {
    try {
      const url = new URL(req.url ?? "/", `http://${hostname}:${opts.port}`);
      const method = req.method ?? "GET";

      if (method === "GET" && url.pathname === "/") {
        res.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });
        res.end(pageHtml());
        return;
      }

      if (method === "GET" && url.pathname === "/api/intakes") {
        const status = url.searchParams.get("status") ?? undefined;
        const urgency = url.searchParams.get("urgency") ?? undefined;
        const region = url.searchParams.get("region") ?? undefined;
        const workType = url.searchParams.get("workType") ?? undefined;
        const limit = url.searchParams.get("limit");
        const rows = listIntakes(db, {
          status: status || undefined,
          urgency: urgency || undefined,
          region: region || undefined,
          workType: workType || undefined,
          limit: limit ? Number(limit) : 50,
        });
        json(res, 200, rows);
        return;
      }

      const intakeIdMatch = url.pathname.match(/^\/api\/intakes\/([^/]+)$/);
      if (method === "GET" && intakeIdMatch) {
        const id = decodeURIComponent(intakeIdMatch[1]);
        const row = getIntakeById(db, id);
        if (!row) {
          json(res, 404, { error: "Not found" });
          return;
        }
        json(res, 200, row);
        return;
      }

      const statusMatch = url.pathname.match(/^\/api\/intakes\/([^/]+)\/status$/);
      if (method === "POST" && statusMatch) {
        const id = decodeURIComponent(statusMatch[1]);
        const row = getIntakeById(db, id);
        if (!row) {
          json(res, 404, { error: "Not found" });
          return;
        }

        const body = (await readJsonBody(req)) as { status?: string } | null;
        const status = body?.status;
        if (status !== "new" && status !== "triaged" && status !== "closed" && status !== "expired") {
          json(res, 400, { error: "Invalid status" });
          return;
        }

        setIntakeStatus(db, id, status);
        json(res, 200, { ok: true });
        return;
      }

      const decryptMatch = url.pathname.match(/^\/api\/intakes\/([^/]+)\/decrypt$/);
      if (method === "POST" && decryptMatch) {
        const id = decodeURIComponent(decryptMatch[1]);
        const row = getIntakeById(db, id);
        if (!row) {
          json(res, 404, { error: "Not found" });
          return;
        }
        if (!opts.privateKeyPath) {
          json(res, 400, { error: "Dashboard started without --private-key; decrypt disabled." });
          return;
        }
        const plaintext = await decryptCiphertext({
          ciphertextBase64: row.ciphertext,
          privateKeyPath: opts.privateKeyPath,
        });
        json(res, 200, { plaintext });
        return;
      }

      json(res, 404, { error: "Not found" });
    } catch (error) {
      json(res, 500, { error: error instanceof Error ? error.message : "Server error" });
    }
  });

  await new Promise<void>((resolve) => {
    server.listen(opts.port, hostname, () => resolve());
  });

  const address = `http://${hostname}:${opts.port}`;
  // eslint-disable-next-line no-console
  console.log(`Local intake dashboard running at ${address}`);
  // eslint-disable-next-line no-console
  console.log(`Press Ctrl+C to stop.`);

  return server;
}
