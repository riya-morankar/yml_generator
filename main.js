async function loadRepos() {
  const response = await fetch('manifest.yaml');
  const text = await response.text();
  const manifest = jsyaml.load(text);
  const repos = manifest.repos || {};

  const container = document.getElementById('repoContainer');
  for (const [short, full] of Object.entries(repos)) {
    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.value = short;
    checkbox.className = 'repo-checkbox';

    const label = document.createElement('label');
    label.className = 'checkbox';
    label.appendChild(checkbox);
    label.append(` ${short} → ${full}`);
    container.appendChild(label);
  }

  document.getElementById('selectAll').addEventListener('change', function () {
    const checked = this.checked;
    document.querySelectorAll('.repo-checkbox').forEach(cb => cb.checked = checked);
  });
}

function generateYAML() {
  const selected = [...document.querySelectorAll('.repo-checkbox')]
    .filter(cb => cb.checked)
    .map(cb => cb.value);

  const startDate = document.getElementById('startDate').value;
  const endDate = document.getElementById('endDate').value;
  const errorBox = document.getElementById('errorMsg');

  if (!selected.length) {
    errorBox.textContent = "Please select at least one repository.";
    return;
  }
  if (!startDate || !endDate) {
    errorBox.textContent = "Start and End dates are required.";
    return;
  }

  const yamlContent = jsyaml.dump({
    repos: selected.join(","),
    start_date: startDate,
    end_date: endDate
  });

  const blob = new Blob([yamlContent], { type: 'text/yaml' });
  const url = URL.createObjectURL(blob);

  const a = document.createElement('a');
  a.href = url;
  a.download = 'workflow_input.yaml';
  a.click();

  errorBox.textContent = "";
}

// Load repos from manifest.yaml on page load
loadRepos();
