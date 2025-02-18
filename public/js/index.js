function copyToClipboard(event) {
    const button = event.currentTarget; // Get the clicked button
    const commandInput = button.previousElementSibling; // Get the corresponding input field

    if (commandInput && commandInput.tagName === "INPUT") {
        navigator.clipboard.writeText(commandInput.value)
            .then(() => {
                console.log("Text copied successfully!");
            })
            .catch(err => {
                console.error("Failed to copy text: ", err);
            });
    }
}



// JavaScript to handle "Select All" checkbox
document.getElementById('checkbox-all-search').addEventListener('change', function () {
    const isChecked = this.checked;
    const checkboxes = document.querySelectorAll('.app-checkbox');
    checkboxes.forEach(checkbox => {
        checkbox.checked = isChecked;
    });
});

// Function to get selected students
function getSelectedStudents() {
    const checkboxes = document.querySelectorAll('.app-checkbox:checked');
    let selectedStudents = [];
    checkboxes.forEach(checkbox => {
        selectedStudents.push({
            id: checkbox.getAttribute('data-id')
        });
    });
    return selectedStudents;
}

// windows Search
document.getElementById("windows_search").addEventListener("submit", async (event) => {
    event.preventDefault();
    const appName = document.getElementById("windows-search").value;

    console.log(appName);
    const res = await get_windows_apps(appName);
    if (res) {
        const data = await res.json();
        showReceivedData(data.result);
    } else {
        console.error("Failed to fetch windows apps");
    }

})

function showReceivedData(data) {
    const resultsContainer = document.getElementById('results-container');
    resultsContainer.innerHTML = ''; // Clear previous results

    data.forEach(app => {
        const row = document.createElement('tr');
        row.classList.add('bg-white', 'border-b', 'dark:bg-gray-800', 'dark:border-gray-700', 'border-gray-200', 'hover:bg-gray-50', 'dark:hover:bg-gray-600');

        // Checkbox Column
        const checkboxCell = document.createElement('td');
        checkboxCell.classList.add('w-4', 'p-4');
        const checkboxDiv = document.createElement('div');
        checkboxDiv.classList.add('flex', 'items-center');
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.classList.add('app-checkbox', 'w-4', 'h-4', 'text-blue-600', 'bg-gray-100', 'border-gray-300', 'rounded-sm', 'focus:ring-blue-500', 'dark:focus:ring-blue-600', 'dark:ring-offset-gray-800', 'dark:focus:ring-offset-gray-800', 'focus:ring-2', 'dark:bg-gray-700', 'dark:border-gray-600');
        checkbox.setAttribute('data-id', app.id);
        checkboxDiv.appendChild(checkbox);
        checkboxCell.appendChild(checkboxDiv);
        row.appendChild(checkboxCell);

        // Name Column
        const nameCell = document.createElement('th');
        nameCell.scope = 'row';
        nameCell.classList.add('px-6', 'py-4', 'font-medium', 'text-gray-900', 'whitespace-nowrap', 'dark:text-white', 'max-w-40', 'overflow-x-hidden');
        nameCell.textContent = app.name;
        row.appendChild(nameCell);

        // ID Column
        const idCell = document.createElement('td');
        idCell.classList.add('pl-4', 'py-4');
        idCell.textContent = app.id;
        row.appendChild(idCell);

        // Version Column
        // const versionCell = document.createElement('td');
        // versionCell.classList.add('px-6', 'py-1');
        // versionCell.textContent = app.version;
        // row.appendChild(versionCell);

        // Command Input & Copy Button
        const commandCell = document.createElement('td');
        commandCell.classList.add('flex', 'items-center', 'px-6', 'py-4');

        const commandInput = document.createElement('input');
        commandInput.type = 'text';
        commandInput.value = `winget install --id ${app.id}`;
        commandInput.readOnly = true;
        commandInput.classList.add('block', 'w-full', 'p-2', 'text-gray-900', 'border', 'border-gray-300', 'rounded-lg', 'bg-gray-50', 'text-xs', 'focus:ring-blue-500', 'focus:border-blue-500', 'dark:bg-gray-700', 'dark:border-gray-600', 'dark:placeholder-gray-400', 'dark:text-white', 'dark:focus:ring-blue-500', 'dark:focus:border-blue-500', 'min-w-60');

        // Remove duplicate ID, now using class instead
        // commandInput.id = 'command-input'; // Remove this line

        commandCell.appendChild(commandInput);

        // Copy Button
        const copyButton = document.createElement('button');
        copyButton.classList.add('ml-2', 'cursor-pointer', 'hover:text-blue-200');
        copyButton.onclick = copyToClipboard;
        copyButton.innerHTML = `<svg width="25px" height="25px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M6 11C6 8.17157 6 6.75736 6.87868 5.87868C7.75736 5 9.17157 5 12 5H15C17.8284 5 19.2426 5 20.1213 5.87868C21 6.75736 21 8.17157 21 11V16C21 18.8284 21 20.2426 20.1213 21.1213C19.2426 22 17.8284 22 15 22H12C9.17157 22 7.75736 22 6.87868 21.1213C6 20.2426 6 18.8284 6 16V11Z" stroke="#1C274C" stroke-width="1.5" />
                                    <path d="M6 19C4.34315 19 3 17.6569 3 16V10C3 6.22876 3 4.34315 4.17157 3.17157C5.34315 2 7.22876 2 11 2H15C16.6569 2 18 3.34315 18 5" stroke="#1C274C" stroke-width="1.5" />
                                </svg>`;

        commandCell.appendChild(copyButton);
        row.appendChild(commandCell);

        resultsContainer.appendChild(row);
    });
}

document.getElementById("window_download_btn").addEventListener("click", async (event) => {
    event.preventDefault();

    let selectedApps = getSelectedStudents().map((value) => value.id);

    if (selectedApps.length === 0) {
        alert("Please select at least one app.");
        return;
    }

    console.log("Selected Apps:", selectedApps);

    try {
        const response = await fetch("/windows/generate", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ selectedApps })
        });

        if (!response.ok) {
            throw new Error("Failed to generate script");
        }

        // Convert response to a Blob and trigger download
        const blob = await response.blob();
        const downloadUrl = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = downloadUrl;
        a.download = "install_package.zip";
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);

    } catch (error) {
        console.error("Error:", error);
        alert("An error occurred while generating the script.");
    }
});


// send request to  fetch search data 
async function get_windows_apps(search_value) {
    const response = await fetch('/windows/search', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            search_value: search_value.toLowerCase()
        })
    });
    if (response.ok) {
        return response;
    }
    else {
        return null;
    }
}