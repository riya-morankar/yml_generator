function generateYAML() {
  const start = document.getElementById("startDate").value;
  const end = document.getElementById("endDate").value;

  if (!start || !end) {
    alert("Please select both start and end dates.");
    return;
  }

  const checkboxes = document.querySelectorAll(".repo-checkbox");
  const selected = [];
  checkboxes.forEach(cb => {
    if (cb.checked && cb.dataset.short !== "select_all") {
      selected.push(cb.dataset.short);
    }
  });

  if (selected.length === 0) {
    alert("Please select at least one repository.");
    return;
  }

  const yamlData = {
    repos: selected.join(","),
    start_date: start,
    end_date: end
  };

  const yamlText = jsyaml.dump(yamlData);

  const output = document.getElementById("yamlOutput");
  output.textContent = yamlText;
  output.style.display = "block";

  const blob = new Blob([yamlText], { type: "text/yaml" });
  const link = document.getElementById("downloadLink");
  link.href = URL.createObjectURL(blob);
  link.style.display = "inline-block";
}

function createRepoCheckboxes(repoMap) {
  const container = document.getElementById("repoContainer");

  for (const [short, full] of Object.entries(repoMap)) {
    const label = document.createElement("label");
    label.innerHTML = `<input type="checkbox" class="repo-checkbox" data-short="${short}"> ${short} – ${full}`;
    container.appendChild(label);
  }

  const selectAllBox = document.getElementById("selectAll");

  selectAllBox.addEventListener("change", (e) => {
    const checked = e.target.checked;
    document.querySelectorAll(".repo-checkbox").forEach(cb => cb.checked = checked);
  });

  container.addEventListener("change", () => {
    const boxes = document.querySelectorAll(".repo-checkbox");
    const allChecked = [...boxes].every(cb => cb.checked);
    selectAllBox.checked = allChecked;
  });
}

// Fetch manifest.yaml
fetch('manifest.yaml?cache=' + new Date().getTime())
  .then(res => res.text())
  .then(yamlText => {
    const manifest = jsyaml.load(yamlText);
    createRepoCheckboxes(manifest.repos || {});
  })
  .catch(err => {
    alert("Failed to load manifest.yaml: " + err);
  });
