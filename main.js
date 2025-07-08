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
  
  if (start > end) {
    alert("Please select valid dates.");
    return;
  }

  const checkboxes = document.querySelectorAll(".repo-checkbox");
  const selected = [];
  checkboxes.forEach(cb => {
    if (cb.checked && cb.dataset.short !== "select_all") {
      selected.push(cb.dataset.short);
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

  const selectAll = document.createElement("label");
  selectAll.innerHTML = `<input type="checkbox" id="select-all" class="repo-checkbox" data-short="select_all"> <strong>Select All</strong>`;
  container.appendChild(selectAll);

  for (const [short, full] of Object.entries(repoMap)) {
    const label = document.createElement("label");
    label.innerHTML = `<input type="checkbox" class="repo-checkbox" data-short="${short}" value="${full}"> ${full}`;
    container.appendChild(label);
  }

  document.getElementById("select-all").addEventListener("change", (e) => {
    const all = document.querySelectorAll(".repo-checkbox");
    all.forEach(cb => {
      cb.checked = e.target.checked;
    });
  });

  container.addEventListener("change", () => {
    const checkboxes = document.querySelectorAll(".repo-checkbox");
    const selectAllBox = document.getElementById("select-all");
    const otherBoxes = [...checkboxes].filter(cb => cb.dataset.short !== "select_all");

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
