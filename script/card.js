const issueContainer = document.getElementById('issue-container');
const issueCount = document.getElementById('issue-count');
const loader = document.getElementById('loader');
const inputSearch = document.getElementById('input-search');
const btnSearch = document.getElementById('btn-search');


const displayIssues = (issues) => {

    issueContainer.innerHTML = "";
    issueCount.innerText = issues.length;

    issues.forEach(issue => {

   const topBorder =
    issue.status.toLowerCase() === "open"
        ? "border-green-500"
        : "border-purple-500";

const icon =
    issue.status.toLowerCase().includes("open")
        ? "./assets/Open-Status.png"
        : "./assets/Closed- Status .png";

const card = document.createElement("div");

card.className = `bg-white p-5 rounded-xl shadow-sm border border-gray-100 border-t-4 ${topBorder}`;

card.innerHTML = `
<div class="flex justify-between items-center mb-4">

    <img class="w-8 h-8" src="${icon}" alt="status icon"/>

    <span class="px-3 py-1 rounded-full text-xs font-semibold
        ${issue.priority === "high" ? "bg-red-100 text-red-500" : ""}
        ${issue.priority === "medium" ? "bg-yellow-100 text-yellow-600" : ""}
        ${issue.priority === "low" ? "bg-gray-200 text-gray-500" : ""}
    ">
        ${issue.priority.toUpperCase()}
    </span>

</div>



        <h3 class="font-semibold text-gray-800 text-[16px] mb-2">
            ${issue.title}
        </h3>


        <p class="text-sm text-gray-500 mb-4">
            ${issue.description}
        </p>


        <div class="flex gap-2 mb-5">

            <span class="text-xs bg-red-100 text-red-500 px-3 py-1 rounded-full font-medium">
                BUG
            </span>

            <span class="text-xs bg-yellow-100 text-yellow-600 px-3 py-1 rounded-full font-medium">
                HELP WANTED
            </span>

        </div>


        <hr class="mb-3">


        <div class="text-xs text-gray-400 flex flex-col gap-1">
            <span>#${issue.id} by ${issue.author}</span>
            <span>${new Date(issue.createdAt).toLocaleDateString()}</span>
        </div>
        `;

        issueContainer.appendChild(card);
    });
};


const loadIssues = async (status = 'all') => {

    loader.classList.remove('hidden');
    issueContainer.innerHTML = "";

    try {

        const res = await fetch('https://phi-lab-server.vercel.app/api/v1/lab/issues');
        const result = await res.json();

        const issues = result.data;

        let filteredData = issues;

        if (status !== 'all') {
            filteredData = issues.filter(issue =>
                issue.status.toLowerCase() === status.toLowerCase()
            );
        }

        displayIssues(filteredData);

    } catch (error) {

        console.log("Error loading issues:", error);

    } finally {

        loader.classList.add('hidden');
    }
};


btnSearch.addEventListener('click', async () => {

    const searchText = inputSearch.value.trim();

    if (!searchText) {
        loadIssues();
        return;
    }

    loader.classList.remove('hidden');
    issueContainer.innerHTML = "";

    try {

        const res = await fetch(`https://phi-lab-server.vercel.app/api/v1/lab/issues/search?q=${searchText}`);

        const result = await res.json();

        displayIssues(result.data);

    } catch (error) {

        console.log("Search error:", error);

    } finally {

        loader.classList.add('hidden');
    }

});



const handleButtonClick = (btnId, status) => {

    document.querySelectorAll('#btn-all, #btn-open, #btn-closed').forEach(btn => {

        btn.classList.remove('btn-primary');
        btn.classList.add('btn-outline');

    });

    const clickedBtn = document.getElementById(btnId);

    clickedBtn.classList.add('btn-primary');
    clickedBtn.classList.remove('btn-outline');

    loadIssues(status);
};


document
    .getElementById('btn-all')
    .addEventListener('click', () => handleButtonClick('btn-all', 'all'));

document
    .getElementById('btn-open')
    .addEventListener('click', () => handleButtonClick('btn-open', 'open'));

document
    .getElementById('btn-closed')
    .addEventListener('click', () => handleButtonClick('btn-closed', 'closed'));



loadIssues();