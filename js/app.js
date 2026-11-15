const STORAGE_KEY = "civictrack_complaints_v1";
const STATUSES = ["Submitted", "Under Review", "In Progress", "Resolved", "Rejected"];
const $ = (id) => document.getElementById(id);

function loadComplaints() {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
    return Array.isArray(saved) ? saved : [];
  } catch {
    return [];
  }
}
let complaints = loadComplaints();

function saveComplaints() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(complaints));
}
function escapeHTML(value) {
  return String(value ?? "").replace(/[&<>"']/g, ch => ({
    "&":"&amp;", "<":"&lt;", ">":"&gt;", '"':"&quot;", "'":"&#39;"
  }[ch]));
}
function makeReference() {
  return "CT-" + Math.random().toString(16).slice(2, 8).toUpperCase();
}
function statusClass(status) {
  return "status-" + status.toLowerCase().replaceAll(" ", "-");
}
function showToast(message) {
  const toast = $("toast");
  toast.textContent = message;
  toast.classList.add("show");
  clearTimeout(showToast.timer);
  showToast.timer = setTimeout(() => toast.classList.remove("show"), 2600);
}

document.querySelectorAll(".tab").forEach(button => {
  button.addEventListener("click", () => {
    document.querySelectorAll(".tab").forEach(tab => tab.classList.remove("active"));
    button.classList.add("active");
    const municipal = button.dataset.view === "municipal";
    $("citizenView").classList.toggle("hidden", municipal);
    $("municipalView").classList.toggle("hidden", !municipal);
    renderAll();
  });
});

$("complaintForm").addEventListener("submit", event => {
  event.preventDefault();
  const complaint = {
    id: makeReference(),
    name: $("citizenName").value.trim(),
    category: $("category").value,
    location: $("location").value.trim(),
    title: $("title").value.trim(),
    description: $("description").value.trim(),
    status: "Submitted",
    createdAt: new Date().toISOString()
  };
  if (!complaint.name || !complaint.category || !complaint.location || !complaint.title || !complaint.description) {
    showToast("Please complete all fields.");
    return;
  }
  complaints.unshift(complaint);
  saveComplaints();
  event.target.reset();
  renderAll();
  showToast("Complaint submitted. Reference: " + complaint.id);
});

$("statusFilter").addEventListener("change", renderMunicipal);

function renderCitizen() {
  const list = $("citizenComplaints");
  $("citizenCount").textContent = `${complaints.length} report${complaints.length === 1 ? "" : "s"}`;
  if (!complaints.length) {
    list.innerHTML = '<div class="empty-state">No complaints submitted yet. Your reports will appear here.</div>';
    return;
  }
  list.innerHTML = complaints.map(item => `
    <article class="complaint-card">
      <div>
        <span class="reference">${escapeHTML(item.id)} · ${escapeHTML(item.category)}</span>
        <h4>${escapeHTML(item.title)}</h4>
        <p>${escapeHTML(item.location)} · Submitted by ${escapeHTML(item.name)}</p>
        <p>${escapeHTML(item.description)}</p>
      </div>
      <span class="status ${statusClass(item.status)}">${escapeHTML(item.status)}</span>
    </article>`).join("");
}

function renderMunicipal() {
  const all = complaints;
  $("statTotal").textContent = all.length;
  $("statReview").textContent = all.filter(x => x.status === "Under Review").length;
  $("statProgress").textContent = all.filter(x => x.status === "In Progress").length;
  $("statResolved").textContent = all.filter(x => x.status === "Resolved").length;

  const filter = $("statusFilter").value;
  const shown = filter === "All" ? all : all.filter(x => x.status === filter);
  const target = $("municipalComplaints");
  if (!shown.length) {
    target.innerHTML = '<div class="empty-state">No complaints match this filter.</div>';
    return;
  }
  target.innerHTML = `<table>
    <thead><tr><th>Reference / Issue</th><th>Citizen</th><th>Category</th><th>Location</th><th>Status</th><th>Update status</th></tr></thead>
    <tbody>${shown.map(item => `<tr>
      <td><strong>${escapeHTML(item.title)}</strong><small>${escapeHTML(item.id)}</small></td>
      <td>${escapeHTML(item.name)}</td>
      <td>${escapeHTML(item.category)}</td>
      <td>${escapeHTML(item.location)}</td>
      <td><span class="status ${statusClass(item.status)}">${escapeHTML(item.status)}</span></td>
      <td><select class="status-select" data-id="${escapeHTML(item.id)}" aria-label="Update status for ${escapeHTML(item.id)}">
        ${STATUSES.map(status => `<option ${item.status === status ? "selected" : ""}>${status}</option>`).join("")}
      </select></td>
    </tr>`).join("")}</tbody></table>`;

  target.querySelectorAll(".status-select").forEach(select => {
    select.addEventListener("change", () => {
      const item = complaints.find(x => x.id === select.dataset.id);
      if (!item) return;
      item.status = select.value;
      saveComplaints();
      renderAll();
      showToast(`${item.id} updated to ${item.status}.`);
    });
  });
}

function renderAll() {
  renderCitizen();
  renderMunicipal();
}
renderAll();
