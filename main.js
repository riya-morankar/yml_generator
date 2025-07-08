function generateYAML() {
  const start = document.getElementById("start-date").value;
  const end = document.getElementById("end-date").value;

if (selected.length === 0) {
    alert("Please select at least one repository.");
    return;
  }
if (!start || !end) {
    alert("Please select both start and end dates.");
    return;
  }
 if (new Date(start) > new Date(end)) {
    alert("Start date cannot be after end date.");
    return;
  }

  const checkboxes = document.querySelectorAll(".repo-checkbox");
  const selected = [];
  checkboxes.forEach(cb => {
    if (cb.checked && cb.value !== "select_all") {
      selected.push(cb.value);
    }
  });

  const yamlData = {
    repos: selected.join(","),
    start_date: start,
    end_date: end
  };

  const yamlText = jsyaml.dump(yamlData);

  const yamlOutput = document.getElementById("yaml-output");
  yamlOutput.textContent = yamlText;
  yamlOutput.style.display = "block";

  const blob = new Blob([yamlText], { type: "text/yaml" });
  const link = document.getElementById("download-link");
  link.href = URL.createObjectURL(blob);
  link.style.display = "inline-block";
}

function createRepoCheckboxes(repoMap) {
  const container = document.getElementById("repo-list");
  container.innerHTML = "";

  // Select All on top as a normal checkbox line
  const selectAllLabel = document.createElement("label");
  selectAllLabel.innerHTML = `<input type="checkbox" id="select-all" class="repo-checkbox" value="select_all"> <strong>Select All</strong>`;
  container.appendChild(selectAllLabel);

  Object.entries(repoMap).forEach(([short, full]) => {
    const label = document.createElement("label");
    label.innerHTML = `<input type="checkbox" class="repo-checkbox" value="${short}"> ${short} — ${full}`;
    container.appendChild(label);
  });

  document.getElementById("select-all").addEventListener("change", (e) => {
    const all = document.querySelectorAll(".repo-checkbox");
    all.forEach(cb => {
      cb.checked = e.target.checked;
    });
  });

  container.addEventListener("change", () => {
    const checkboxes = document.querySelectorAll(".repo-checkbox");
    const selectAllBox = document.getElementById("select-all");
    const otherBoxes = [...checkboxes].filter(cb => cb.value !== "select_all");
    const allChecked = otherBoxes.every(cb => cb.checked);
    selectAllBox.checked = allChecked;
  });
}

// Load YAML manifest
fetch('manifest.yaml?cache=' + new Date().getTime())
  .then(res => res.text())
  .then(yamlText => {
    const manifest = jsyaml.load(yamlText);
    createRepoCheckboxes(manifest.repos || {});
  })
  .catch(err => {
    alert("Failed to load manifest.yaml: " + err);
  });
