// app.js
// Dashboard ka saara interactive logic -- episodes fetch karna, table banana,
// status dropdown, voice/render buttons, add-episode form, CSV upload, sheet sync.
// Koi framework nahi -- plain JS, taake koi build-step na chahiye ho.

const STATUS_LABELS = {
  draft: "Draft",
  script_ready: "Script Ready",
  voice_ready: "Voice Ready",
  video_rendered: "Video Rendered",
  uploaded: "Uploaded",
};

async function fetchEpisodes() {
  const res = await fetch("/api/episodes");
  return res.json();
}

function renderStats(episodes) {
  const counts = {};
  for (const status of Object.keys(STATUS_LABELS)) counts[status] = 0;
  episodes.forEach((e) => (counts[e.status] = (counts[e.status] || 0) + 1));

  const statsEl = document.getElementById("stats");
  statsEl.innerHTML = Object.entries(STATUS_LABELS)
    .map(
      ([key, label]) => `
      <div class="stat-card">
        <div class="count">${counts[key] || 0}</div>
        <div class="label">${label}</div>
      </div>`
    )
    .join("") +
    `<div class="stat-card"><div class="count">${episodes.length}</div><div class="label">Total Episodes</div></div>`;
}

function renderTable(episodes) {
  const body = document.getElementById("episode-body");
  body.innerHTML = episodes
    .map(
      (ep) => `
    <tr data-id="${ep.id}">
      <td>${ep.id}</td>
      <td>${ep.date}</td>
      <td>${ep.title}</td>
      <td>
        <select class="status-select" data-id="${ep.id}">
          ${Object.entries(STATUS_LABELS)
            .map(([key, label]) => `<option value="${key}" ${ep.status === key ? "selected" : ""}>${label}</option>`)
            .join("")}
        </select>
      </td>
      <td><button class="btn btn-outline btn-small btn-voice" data-id="${ep.id}">🎙️ Generate</button></td>
      <td><button class="btn btn-outline btn-small btn-render" data-id="${ep.id}">🎬 Render</button></td>
      <td class="notes-cell">${ep.notes || ""}</td>
      <td><button class="btn btn-outline btn-small btn-delete" data-id="${ep.id}">🗑</button></td>
    </tr>`
    )
    .join("");

  // Status dropdown change -> update via API
  body.querySelectorAll(".status-select").forEach((el) => {
    el.addEventListener("change", async (e) => {
      await fetch(`/api/episodes/${e.target.dataset.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: e.target.value }),
      });
      loadAndRender();
    });
  });

  body.querySelectorAll(".btn-voice").forEach((btn) => {
    btn.addEventListener("click", async (e) => {
      const id = e.target.dataset.id;
      e.target.textContent = "⏳ Generating...";
      const res = await fetch(`/api/generate-voice/${id}`, { method: "POST" });
      const data = await res.json();
      if (!data.success) alert(`Voice generation fail hui:\n${data.log}`);
      loadAndRender();
    });
  });

  body.querySelectorAll(".btn-render").forEach((btn) => {
    btn.addEventListener("click", async (e) => {
      const id = e.target.dataset.id;
      e.target.textContent = "⏳ Rendering...";
      const res = await fetch(`/api/render/${id}`, { method: "POST" });
      const data = await res.json();
      if (!data.success) alert(`Render fail hui:\n${data.log}`);
      loadAndRender();
    });
  });

  body.querySelectorAll(".btn-delete").forEach((btn) => {
    btn.addEventListener("click", async (e) => {
      if (!confirm("Ye episode delete karna hai?")) return;
      await fetch(`/api/episodes/${e.target.dataset.id}`, { method: "DELETE" });
      loadAndRender();
    });
  });
}

async function loadAndRender() {
  const episodes = await fetchEpisodes();
  renderStats(episodes);
  renderTable(episodes);
}

// --- Add Episode Modal ---
const modal = document.getElementById("modal");
document.getElementById("btn-add").addEventListener("click", () => modal.classList.remove("hidden"));
document.getElementById("btn-cancel").addEventListener("click", () => modal.classList.add("hidden"));

document.getElementById("episode-form").addEventListener("submit", async (e) => {
  e.preventDefault();
  const form = new FormData(e.target);
  const body = Object.fromEntries(form.entries());
  await fetch("/api/episodes", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  modal.classList.add("hidden");
  e.target.reset();
  loadAndRender();
});

// --- CSV Upload ---
const csvInput = document.getElementById("csv-input");
document.getElementById("btn-upload").addEventListener("click", () => csvInput.click());
csvInput.addEventListener("change", async () => {
  if (!csvInput.files[0]) return;
  const formData = new FormData();
  formData.append("file", csvInput.files[0]);
  const res = await fetch("/api/upload-csv", { method: "POST", body: formData });
  const data = await res.json();
  if (data.error) alert(`Upload fail: ${data.error}`);
  else alert(`✅ ${data.imported} episodes imported!`);
  csvInput.value = "";
  loadAndRender();
});

// --- Google Sheet Sync ---
const sheetModal = document.getElementById("sheet-modal");
document.getElementById("btn-sync").addEventListener("click", () => sheetModal.classList.remove("hidden"));
document.getElementById("btn-sheet-cancel").addEventListener("click", () => sheetModal.classList.add("hidden"));
document.getElementById("btn-sheet-sync").addEventListener("click", async () => {
  const url = document.getElementById("sheet-url").value.trim();
  if (!url) return;
  const res = await fetch("/api/sync-sheet", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ url }),
  });
  const data = await res.json();
  if (data.error) alert(`Sync fail: ${data.error}`);
  else alert(`✅ ${data.synced} episodes synced from Google Sheet!`);
  sheetModal.classList.add("hidden");
  loadAndRender();
});

loadAndRender();
