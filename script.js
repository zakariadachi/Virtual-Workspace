// Données des employés
let employees = [
    {
        id: 1,
        name: "Alice Martin",
        role: "Manager",
        location: "Unassigned",
        photo: "",
        email: "alice.martin@email.com",
        phone: "+212 6 12 34 56 78",
        experiences: [
            {
                company: "Hôtel Plaza",
                position: "Réceptionniste",
                from: "2020-01-15",
                to: "2022-03-20"
            }
        ]
    },
    {
        id: 2,
        name: "Karim Benjelloun",
        role: "Technicien IT",
        location: "Unassigned",
        photo: "",
        email: "karim.benjelloun@email.com",
        phone: "+212 6 98 76 54 32",
        experiences: [
            {
                company: "Tech Solutions SARL",
                position: "Technicien réseau",
                from: "2019-06-01",
                to: "2021-12-15"
            }
        ]
    },
];
let all_roms_ids=[]
// Restrictions par salle
const roomRestrictions = {
    "Conference Room": ["Manager", "Réceptionniste", "Technicien IT", "Agent de sécurité", "Nettoyage","other"],
    "Reception": ["Réceptionniste","Manager","Nettoyage"],
    "Server Room": ["Nettoyage","Technicien IT","Manager"],
    "Security Room": ["Agent de sécurité","Manager","Nettoyage"],
    "Staff Room": ["Manager", "Réceptionniste", "Technicien IT", "Agent de sécurité", "Nettoyage","other"],
    "Archive Room": ["Manager"],
};

// Initialisation
document.addEventListener('DOMContentLoaded', function() {
    initApp();
});

function initApp() {
    loadEmployees();
    setupEventListeners();
}

// Configuration des écouteurs d'événements
function setupEventListeners() {
    // Bouton d'ajout d'employé
    const addWorkerBtn = document.getElementById('addWorkerBtn');
    if (addWorkerBtn) {
        addWorkerBtn.addEventListener('click', showAddEmployeeModal);
    }

    // Boutons d'ajout aux salles
    document.querySelectorAll('.add-to-room-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const roomId = this.getAttribute('data-room');
            openRoomAssignment(roomId);
        });
    });

    // Bouton de fermeture modale
    const closeModalBtn = document.getElementById('closeModalBtn');
    if (closeModalBtn) {
        closeModalBtn.addEventListener('click', hideAddEmployeeModal);
    }

    // Bouton de fermeture profil
    const closeProfileBtn = document.getElementById('closeProfileBtn');
    if (closeProfileBtn) {
        closeProfileBtn.addEventListener('click', hideEmployeeProfile);
    }

    // Formulaire d'ajout d'employé
    const addEmployeeForm = document.getElementById('addEmployeeForm');
    if (addEmployeeForm) {
        addEmployeeForm.addEventListener('submit', handleAddEmployee);
    }
    // Bouton d'ajout d'expérience
    const addExpBtn = document.getElementById('addExpBtn');
    if (addExpBtn) {
        addExpBtn.addEventListener('click', addExperienceField);
    }
}

// Chargement des employés
function loadEmployees() {
    loadUnassignedStaff();
    loadAssignedStaff();
}

// Chargement du staff non assigné
function loadUnassignedStaff() {
    const staffList = document.getElementById('staffList');
    if (!staffList) return;

    const unassignedEmployees = employees.filter(emp => emp.location === 'Unassigned');

    if (unassignedEmployees.length === 0) {
        staffList.innerHTML = '<div class="empty-message">Aucun employé non assigné</div>';
        return;
    }

    staffList.innerHTML = unassignedEmployees.map(emp => `
        <div class="staff-item" onclick="showEmployeeProfile(${emp.id})">
            <div class="staff-avatar">
                ${emp.photo ? `<img src="${emp.photo}" alt="${emp.name}">` : '<i class="fas fa-user"></i>'}
            </div>
            <div class="staff-info">
                <h4>${emp.name}</h4>
                <p>${emp.role}</p>
            </div>
        </div>
    `).join('');
}

// Chargement du staff assigné
function loadAssignedStaff() {
    // Réinitialiser toutes les salles
    for (let i = 1; i <= 6; i++) {
        const staffRoom = document.getElementById(`staffRoom${i}`);
        if (staffRoom) {
            staffRoom.innerHTML = '';
        }
    }

    // Assigner les employés aux salles
    employees.forEach(emp => {
        if (emp.location !== 'Unassigned') {
            const roomElement = document.querySelector(`[data-room="${emp.location}"]`);
            if (roomElement) {
                const roomId = roomElement.id;
                const staffRoom = document.getElementById(`staffRoom${roomId.replace('room', '')}`);
             
                if (staffRoom) {
                    const staffItem = document.createElement('div');
                    staffItem.className = 'staff-item';
                    staffItem.innerHTML = `
                        <div class="staff-avatar">
                            ${emp.photo ? `<img src="${emp.photo}" alt="${emp.name}">` : '<i class="fas fa-user"></i>'}
                        </div>
                        <div class="staff-info">
                            <h4>${emp.name}</h4>
                            <p>${emp.role}</p>
                        </div>
                        <button class="remove-staff-btn" onclick="removeFromRoom(${emp.id})">
                            <i class="fas fa-times"></i>
                        </button>
                    `;
                    staffRoom.appendChild(staffItem);
               
                }
            }
        }
    });

    
    // Afficher red background pour les salles vides
    for (let i = 1; i <= 6; i++) {
        const staffRoom = document.getElementById(`staffRoom${i}`);
        all_roms_ids.push(staffRoom.id)
        let conference=document.getElementById("room1"), reception=document.getElementById("room5");
        if(staffRoom.parentElement!=conference && staffRoom.parentElement!=reception){
                    
            for(e of employees){           
                if (staffRoom && staffRoom.children.length == 0) {
                staffRoom.parentElement.style.backgroundColor="#ff000054";
            }

        }
        } 
    }

    for(r of all_roms_ids){
    let room = document.getElementById(r)

    if(room.querySelector(".staff-item")!=null){
    room.parentElement.style.background="none";
    }
}
}



// Ouvrir l'assignation à une salle
function openRoomAssignment(roomId) {
    const roomElement = document.getElementById(roomId);
    if (!roomElement) {
        console.error(`Room element with id ${roomId} not found`);
        return;
    }
    
    const roomName = roomElement.dataset.room;
    showEmployeeAssignmentModal(roomName);
}

// Afficher la modale d'assignation
function showEmployeeAssignmentModal(roomName) {
    // Supprimer toute modale existante
    const existingModal = document.querySelector('.assignment-modal');
    if (existingModal) {
        existingModal.remove();
    }

    // Créer la modale
    const modal = document.createElement('div');
    modal.className = 'assignment-modal';
    modal.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0,0,0,0.5);
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 1000;
    `;

    modal.innerHTML = `
        <div class="modal-content" style="
            background: white;
            border-radius: 10px;
            width: 90%;
            max-width: 500px;
            max-height: 80vh;
            display: flex;
            flex-direction: column;
        ">
            <div class="modal-header" style="
                padding: 20px;
                border-bottom: 1px solid #eee;
                display: flex;
                justify-content: space-between;
                align-items: center;
            ">
                <h3 style="margin: 0;">Assigner un employé à ${roomName}</h3>
                <span class="close-modal" style="font-size: 24px; cursor: pointer; color: #666;">&times;</span>
            </div>
            <div class="modal-body" style="padding: 20px; flex: 1; overflow-y: auto;">
                <div class="employees-list" id="employeesList" style="display: flex; flex-direction: column; gap: 10px;">
                    <!-- Liste des employés sera générée ici -->
                </div>
            </div>
            <div class="modal-footer" style="padding: 20px; border-top: 1px solid #eee; text-align: right;">
                <button class="btn-cancel" style="background: #6c757d; color: white; border: none; padding: 10px 20px; border-radius: 5px; cursor: pointer;">Annuler</button>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    // Charger les employés disponibles pour cette salle
    function loadAvailableEmployees() {
        const availableEmployees = employees.filter(emp => 
            emp.location === 'Unassigned' && 
            canAssignToRoom(emp.role, roomName)
        );
        
        displayEmployeesList(availableEmployees, roomName);
    }
    
    // Afficher la liste des employés
    function displayEmployeesList(employeesList, roomName) {
        const employeesListContainer = modal.querySelector('#employeesList');
        
        if (employeesList.length === 0) {
            modal.style.display="none"
            return;
        }
        
        employeesListContainer.innerHTML = employeesList.map(emp => `
            <div class="employee-item" style="display: flex; justify-content: space-between; align-items: center; padding: 15px; border: 1px solid #eee; border-radius: 8px; background: #f9f9f9;">
                <div class="employee-info" style="flex: 1;">
                    <div class="employee-name" style="font-weight: bold; margin-bottom: 5px;">${emp.name}</div>
                    <div class="employee-role" style="color: #666; font-size: 14px; margin-bottom: 3px;">${emp.role}</div>
                    <div class="employee-status" style="color: #888; font-size: 12px;">Non assigné</div>
                </div>
                <button class="btn-assign" onclick="assignEmployeeToRoom(${emp.id}, '${roomName}')" style="background: #28a745; color: white; border: none; padding: 8px 15px; border-radius: 5px; cursor: pointer;">
                    Assigner
                </button>
            </div>
        `).join('');
    }
    
    // Événements de fermeture
    modal.querySelector('.close-modal').addEventListener('click', () => {
        modal.remove();
    });
    
    modal.querySelector('.btn-cancel').addEventListener('click', () => {
        modal.remove();
    });
    
    // Fermer en cliquant à l'extérieur
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.remove();
        }
    });
    
    // Charger initialement
    loadAvailableEmployees();
}

// Obtenir les rôles autorisés pour une salle
function getAllowedRoles(roomName) {
    const restrictions = roomRestrictions[roomName];
    if (!restrictions || restrictions.length === 0) return 'Tous les rôles';
    return restrictions.join(', ');
}

// Assigner un employé à une salle
function assignEmployeeToRoom(employeeId, roomName) {
    const employee = employees.find(emp => emp.id === employeeId);
    
    if (!employee) {
        return;
    }
    
    if (canAssignToRoom(employee.role, roomName)) {
        employee.location = roomName;
        loadEmployees();
        
        // Fermer toutes les modales
        document.querySelectorAll('.assignment-modal').forEach(modal => {
            modal.remove();
        });
    }
}

// Retirer un employé d'une salle
function removeFromRoom(employeeId) {
    const employee = employees.find(emp => emp.id === employeeId);
    if (employee) {
        employee.location = 'Unassigned';
        loadEmployees();
    }
}

// Vérifier si un rôle peut être assigné à une salle
function canAssignToRoom(role, roomName) {
    const restrictions = roomRestrictions[roomName];
    if (!restrictions || restrictions.length === 0) return true;
    return restrictions.includes(role);
}

// Gestion de la modale d'ajout d'employé
function showAddEmployeeModal() {
    const modal = document.getElementById('addEmployeeModal');
    if (modal) {
        modal.classList.add('show');
    }
}

function hideAddEmployeeModal() {
    const modal = document.getElementById('addEmployeeModal');
    if (modal) {
        modal.classList.remove('show');
        // Réinitialiser le formulaire
        document.getElementById('addEmployeeForm').reset();
        resetExperienceFields();
    }
}

// Gestion du profil employé
function showEmployeeProfile(employeeId) {
    const employee = employees.find(emp => emp.id === employeeId);
    if (!employee) return;

    const modal = document.getElementById('employeeProfileModal');
    if (!modal) return;

    // Remplir les informations
    document.getElementById('profileName').textContent = employee.name;
    document.getElementById('profileRole').textContent = employee.role;
    document.getElementById('profileLocation').textContent = `Salle: ${employee.location}`;
    document.getElementById('profileEmail').textContent = employee.email || 'Non renseigné';
    document.getElementById('profilePhone').textContent = employee.phone || 'Non renseigné';

    // Photo
    const profilePhoto = document.getElementById('profilePhoto');
    if (employee.photo) {
        profilePhoto.innerHTML = `<img src="${employee.photo}" alt="${employee.name}">`;
    } else {
        profilePhoto.innerHTML = '<i class="fas fa-user"></i>';
    }

    // Expériences
    const experiencesList = document.getElementById('profileExperiences');
    if (employee.experiences && employee.experiences.length > 0) {
        experiencesList.innerHTML = employee.experiences.map(exp => `
            <li>
                <strong>${exp.company}</strong> - ${exp.position}<br>
                ${formatDate(exp.from)} - ${formatDate(exp.to)}
            </li>
        `).join('');
    } else {
        experiencesList.innerHTML = '<li>Aucune expérience professionnelle</li>';
    }

    modal.classList.add('show');
}

function hideEmployeeProfile() {
    const modal = document.getElementById('employeeProfileModal');
    if (modal) {
        modal.classList.remove('show');
    }
}

// Gestion du formulaire d'ajout d'employé
function handleAddEmployee(e) {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    const experiences = getExperiencesFromForm();
    
    const newEmployee = {
        id: generateId(),
        name: formData.get('name'),
        role: formData.get('role'),
        location: 'Unassigned',
        photo: formData.get('photo') || '',
        email: formData.get('email') || '',
        phone: formData.get('phone') || '',
        experiences: experiences
    };
    
    employees.push(newEmployee);
    loadEmployees();
    hideAddEmployeeModal();
}

// Génération d'ID
function generateId() {
    return employees.length > 0 ? Math.max(...employees.map(emp => emp.id)) + 1 : 1;
}

// Gestion des expériences professionnelles
function addExperienceField() {
    const experiencesList = document.getElementById('experiencesList');
    const newExperience = document.createElement('div');
    newExperience.className = 'experience-item flex flex-col p-3 rounded-lg border border-gray-300 bg-gray-50';
    newExperience.innerHTML = `
        <label class="font-semibold text-gray-700">Company</label>
        <input type="text" class="exp-company p-1 border rounded mb-2 text-black">
        
        <label class="font-semibold text-gray-700">Post</label>
        <input type="text" class="exp-position p-1 border rounded mb-2 text-black">
        
        <div class="flex gap-2 text-black">
            <div class="w-1/2">
                <label class="font-semibold text-gray-700">From</label>
                <input type="date" class="exp-from w-full p-1 border rounded text-black">
            </div>
            <div class="w-1/2">
                <label class="font-semibold text-gray-700">To</label>
                <input type="date" class="exp-to w-full p-1 border rounded text-black">
            </div>
        </div>
        <button type="button" class="remove-exp-btn" onclick="this.parentElement.remove()">
            <i class="fas fa-times"></i>
        </button>
    `;
    experiencesList.appendChild(newExperience);
}

function resetExperienceFields() {
    const experiencesList = document.getElementById('experiencesList');
    experiencesList.innerHTML = `
        <div class="experience-item flex flex-col p-3 rounded-lg border border-gray-300 bg-gray-50">
            <label class="font-semibold text-gray-700">Company</label>
            <input type="text" class="exp-company p-1 border rounded mb-2 text-black">
            
            <label class="font-semibold text-gray-700">Post</label>
            <input type="text" class="exp-position p-1 border rounded mb-2 text-black">
            
            <div class="flex gap-2 text-black">
                <div class="w-1/2">
                    <label class="font-semibold text-gray-700">From</label>
                    <input type="date" class="exp-from w-full p-1 border rounded text-black">
                </div>
                <div class="w-1/2">
                    <label class="font-semibold text-gray-700">To</label>
                    <input type="date" class="exp-to w-full p-1 border rounded text-black">
                </div>
            </div>
        </div>
    `;
}

function getExperiencesFromForm() {
    const experiences = [];
    const experienceItems = document.querySelectorAll('.experience-item');
    
    experienceItems.forEach(item => {
        const company = item.querySelector('.exp-company').value;
        const position = item.querySelector('.exp-position').value;
        const from = item.querySelector('.exp-from').value;
        const to = item.querySelector('.exp-to').value;
        
        if (company && position && from) {
            experiences.push({
                company,
                position,
                from,
                to: to || 'Present'
            });
        }
    });
    
    return experiences;
}
