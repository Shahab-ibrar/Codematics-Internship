let membersData = [];

document.addEventListener('DOMContentLoaded', () => {
    loadMembers();

    // Search functionality
    document.getElementById('searchInput').addEventListener('input', (e) => {
        const term = e.target.value.toLowerCase();
        const filtered = membersData.filter(m => 
            m.name.toLowerCase().includes(term) || 
            m.id.toLowerCase().includes(term) || 
            m.department.toLowerCase().includes(term)
        );
        renderMembers(filtered);
    });

    // Form submission
    document.getElementById('memberForm').addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const mode = document.getElementById('formMode').value;
        const memberData = {
            id: document.getElementById('memberId').value,
            name: document.getElementById('memberName').value,
            department: document.getElementById('memberDept').value,
            contactInfo: document.getElementById('memberContact').value
        };

        try {
            if (mode === 'add') {
                await API.addMember(memberData);
                window.showToast('Member added successfully');
            } else {
                await API.updateMember(memberData.id, memberData);
                window.showToast('Member updated successfully');
            }
            closeModal();
            loadMembers();
        } catch (err) {
            window.showToast(err.message, 'error');
        }
    });

    // Modal click outside to close
    document.getElementById('memberModalOverlay').addEventListener('click', (e) => {
        if(e.target.id === 'memberModalOverlay') closeModal();
    });
});

async function loadMembers() {
    try {
        membersData = await API.getMembers();
        renderMembers(membersData);
    } catch (err) {
        document.getElementById('membersTableBody').innerHTML = 
            `<tr><td colspan="6" class="p-8 text-center text-red-500">Failed to load members: ${err.message}</td></tr>`;
    }
}

function renderMembers(members) {
    const tbody = document.getElementById('membersTableBody');
    tbody.innerHTML = '';

    if (members.length === 0) {
        tbody.innerHTML = '<tr><td colspan="6" class="p-8 text-center text-slate-500">No members found.</td></tr>';
        return;
    }

    members.forEach(member => {
        const issuedCount = member.issuedBooks ? member.issuedBooks.length : 0;
        const memberJson = encodeURIComponent(JSON.stringify(member));

        tbody.innerHTML += `
            <tr class="hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors group">
                <td class="p-4 font-medium text-slate-900 dark:text-slate-200">#${member.id}</td>
                <td class="p-4 text-slate-800 dark:text-slate-300 font-semibold flex items-center gap-3">
                    <img src="https://ui-avatars.com/api/?name=${encodeURIComponent(member.name)}&background=random&color=fff" class="w-8 h-8 rounded-full shadow-sm" alt="Avatar">
                    ${member.name}
                </td>
                <td class="p-4 text-slate-600 dark:text-slate-400">
                    <span class="px-2 py-1 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-400 rounded-md text-xs font-medium">
                        ${member.department}
                    </span>
                </td>
                <td class="p-4 text-slate-600 dark:text-slate-400">${member.contactInfo}</td>
                <td class="p-4">
                    <span class="px-3 py-1 rounded-full text-xs font-semibold ${issuedCount > 0 ? 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400' : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400'}">
                        ${issuedCount} Books
                    </span>
                </td>
                <td class="p-4 text-right space-x-2">
                    <button onclick="openEditModal('${memberJson}')" class="w-8 h-8 rounded-full bg-blue-50 text-blue-600 hover:bg-blue-600 hover:text-white dark:bg-blue-900/30 dark:text-blue-400 dark:hover:bg-blue-600 dark:hover:text-white transition-colors" title="Edit">
                        <i class="fa-solid fa-pen"></i>
                    </button>
                    <button onclick="deleteMember('${member.id}')" class="w-8 h-8 rounded-full bg-red-50 text-red-600 hover:bg-red-600 hover:text-white dark:bg-red-900/30 dark:text-red-400 dark:hover:bg-red-600 dark:hover:text-white transition-colors" title="Delete">
                        <i class="fa-solid fa-trash"></i>
                    </button>
                </td>
            </tr>
        `;
    });
}

function openAddModal() {
    document.getElementById('formMode').value = 'add';
    document.getElementById('modalTitle').textContent = 'Add New Member';
    document.getElementById('memberId').disabled = false;
    document.getElementById('memberForm').reset();
    showModal();
}

function openEditModal(memberJsonStr) {
    const member = JSON.parse(decodeURIComponent(memberJsonStr));
    document.getElementById('formMode').value = 'edit';
    document.getElementById('modalTitle').textContent = 'Edit Member';
    
    document.getElementById('memberId').value = member.id;
    document.getElementById('memberId').disabled = true; // Cannot edit ID
    
    document.getElementById('memberName').value = member.name;
    document.getElementById('memberDept').value = member.department;
    document.getElementById('memberContact').value = member.contactInfo;
    
    showModal();
}

async function deleteMember(id) {
    if(confirm(`Are you sure you want to delete member #${id}?`)) {
        try {
            await API.deleteMember(id);
            window.showToast('Member deleted successfully');
            loadMembers();
        } catch(err) {
            window.showToast(err.message, 'error');
        }
    }
}

function showModal() {
    const overlay = document.getElementById('memberModalOverlay');
    const modal = document.getElementById('memberModal');
    
    overlay.classList.remove('hidden');
    setTimeout(() => {
        overlay.classList.remove('opacity-0');
        modal.classList.remove('scale-95');
    }, 10);
}

function closeModal() {
    const overlay = document.getElementById('memberModalOverlay');
    const modal = document.getElementById('memberModal');
    
    overlay.classList.add('opacity-0');
    modal.classList.add('scale-95');
    
    setTimeout(() => {
        overlay.classList.add('hidden');
    }, 300);
}
