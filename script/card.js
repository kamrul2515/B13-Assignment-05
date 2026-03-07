const issueContainer = document.getElementById('issue-container'); 
const issueCount = document.getElementById('issue-count');
const loader = document.getElementById('loader');
const inputSearch = document.getElementById('input-search');
const btnSearch = document.getElementById('btn-search');

// Modal elements
const issueModal = document.getElementById('issue-modal');
const modalTitle = document.getElementById('modal-title');
const modalDescription = document.getElementById('modal-description');
const modalStatusBadge = document.getElementById('modal-status-badge');
const modalAuthor = document.getElementById('modal-author');
const modalCreatedAt = document.getElementById('modal-createdAt');
const modalLabels = document.getElementById('modal-labels');
const modalAssignee = document.getElementById('modal-assignee');
const modalPriorityBadge = document.getElementById('modal-priority-badge');
const closeModalBtn = document.getElementById('close-modal');

// Map status to icon
const statusMap = {
    open: { icon: "./assets/Open-Status.png" },
    closed: { icon: "./assets/Closed-Status.png" }
};

// Map priority to color classes for modal badges
const priorityMap = {
    high: "bg-red-500 text-white",
    medium: "bg-yellow-500 text-white",
    low: "bg-purple-500 text-white"
};

// Display issues
const displayIssues = (issues) => {
    issueContainer.innerHTML = "";
    issueCount.innerText = issues.length;

    for (const issue of issues) {
        const priority = issue.priority.toLowerCase();

        // Top border logic
        let topBorder = '';
        if(priority === 'high' || priority === 'medium') topBorder = 'border-t-4 border-green-500';
        else if(priority === 'low') topBorder = 'border-t-4 border-purple-500';

        // Icon logic
        let icon = priority === 'low' ? './assets/Closed-Status.png' : statusMap[issue.status.toLowerCase()]?.icon || statusMap['open'].icon;

        const card = document.createElement("div");
        card.className = `bg-white p-5 rounded-xl shadow-md ${topBorder} cursor-pointer hover:shadow-lg transition-shadow`;

        // Labels HTML
        let labelsHTML = '';
        if(issue.labels){
            for(const lbl of issue.labels){
                const lblClass = lbl.toLowerCase() === 'bug' ? 'bg-red-100 text-red-500' : 'bg-yellow-100 text-yellow-600';
                labelsHTML += `<span class="px-2 py-1 text-xs font-semibold rounded-full ${lblClass}">${lbl.toUpperCase()}</span> `;
            }
        }

        card.innerHTML = `
            <div class="flex justify-between items-center mb-3">
                <img class="w-8 h-8" src="${icon}" alt="status icon"/>
                <span class="px-3 py-1 rounded-full text-xs font-semibold ${priorityMap[priority] || 'bg-gray-500 text-white'}">
                    ${issue.priority.toUpperCase()}
                </span>
            </div>
            <h3 class="font-semibold text-gray-800 text-[16px] mb-2">${issue.title}</h3>
            <p class="text-sm text-gray-500 mb-3">${issue.description}</p>
            <div class="flex gap-2 mb-4">${labelsHTML}</div>
            <hr class="mb-2">
            <div class="text-xs text-gray-400 flex flex-col gap-1">
                <span>#${issue.id} by ${issue.author}</span>
                <span>${new Date(issue.createdAt).toLocaleDateString()}</span>
            </div>
        `;

        card.addEventListener('click', () => openModal(issue));
        issueContainer.appendChild(card);
    }
};

// Modal
const openModal = (issue) => {
    modalTitle.innerText = issue.title;
    modalDescription.innerText = issue.description;
    modalAuthor.innerText = issue.author;
    modalCreatedAt.innerText = new Date(issue.createdAt).toLocaleDateString();
    modalAssignee.innerText = issue.assignee || issue.author;

    modalStatusBadge.innerText = issue.status === 'open' ? 'Opened' : 'Closed';
    modalStatusBadge.className = `px-3 py-1 rounded-full font-medium text-white ${issue.status === 'open' ? 'bg-green-600' : 'bg-purple-600'}`;

    modalPriorityBadge.innerText = issue.priority.toUpperCase();
    modalPriorityBadge.className = `px-3 py-1 rounded-full text-white ${priorityMap[issue.priority.toLowerCase()] || 'bg-gray-500'}`;

    modalLabels.innerHTML = '';
    if(issue.labels){
        for(const lbl of issue.labels){
            const span = document.createElement('span');
            span.innerText = lbl.toUpperCase();
            span.className = `px-2 py-1 text-xs font-semibold rounded-full ${lbl.toLowerCase() === 'bug' ? 'bg-red-100 text-red-500' : 'bg-yellow-100 text-yellow-600'}`;
            modalLabels.appendChild(span);
        }
    }

    issueModal.classList.add('modal-open');
};

closeModalBtn.addEventListener('click', () => issueModal.classList.remove('modal-open'));

// Load issues
const loadIssues = async (status = 'all') => {
    loader.classList.remove('hidden');
    issueContainer.innerHTML = "";

    try {
        const res = await fetch('https://phi-lab-server.vercel.app/api/v1/lab/issues');
        const result = await res.json();
        let issues = result.data || [];

        if(status !== 'all'){
            issues = issues.filter(issue => issue.status.toLowerCase() === status.toLowerCase());
        }

        displayIssues(issues);

    } catch (error) {
        console.error("Error loading issues:", error);
    } finally {
        loader.classList.add('hidden');
    }
};

// Search
btnSearch.addEventListener('click', async () => {
    const searchText = inputSearch.value.trim();

    document.querySelectorAll('#btn-all, #btn-open, #btn-closed').forEach(btn => {
        btn.classList.remove('btn-primary');
        btn.classList.add('btn-outline');
    });

    if(!searchText) return loadIssues();

    loader.classList.remove('hidden');
    issueContainer.innerHTML = "";

    try {
        const res = await fetch(`https://phi-lab-server.vercel.app/api/v1/lab/issues/search?q=${searchText}`);
        const result = await res.json();
        displayIssues(result.data || []);
    } catch (error) {
        console.error("Search error:", error);
    } finally {
        loader.classList.add('hidden');
    }
});

// Tab buttons
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

document.getElementById('btn-all').addEventListener('click', () => handleButtonClick('btn-all', 'all'));
document.getElementById('btn-open').addEventListener('click', () => handleButtonClick('btn-open', 'open'));
document.getElementById('btn-closed').addEventListener('click', () => handleButtonClick('btn-closed', 'closed'));

loadIssues();