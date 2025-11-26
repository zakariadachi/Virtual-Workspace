let employees = [
    {
        id: 1,
        name: "Alice Martin",
        role: "Manager",
        location: "Unassigned",
        photo: "https://static.vecteezy.com/system/resources/thumbnails/026/570/649/small/close-up-profile-view-of-pensive-upset-african-american-man-look-in-distance-thinking-of-personal-problems-thoughtful-sad-biracial-male-feel-depressed-lost-in-thoughts-pondering-having-dilemma-photo.jpg",
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
        photo: "https://media.gettyimages.com/id/154956399/fr/photo/anonyme-sur-le-devant.jpg?s=612x612&w=0&k=20&c=eIAXsq9G7KcxHqT1WzwdRAEJ8pM8zkPRaU2oIy-kotw=",
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
    {
        id: 3,
        name: "Sophie Dubois",
        role: "Agent de sécurité",
        location: "Unassigned",
        photo: "https://media.gettyimages.com/id/154956399/fr/photo/anonyme-sur-le-devant.jpg?s=612x612&w=0&k=20&c=eIAXsq9G7KcxHqT1WzwdRAEJ8pM8zkPRaU2oIy-kotw=",
        email: "sophie.dubois@email.com",
        phone: "+212 6 23 45 67 89",
        experiences: [
            {
                company: "WebTech Maroc",
                position: "Développeuse Frontend",
                from: "2021-02-10",
                to: "2023-08-15"
            }
        ]
    },
    {
        id: 4,
        name: "Mehdi El Fassi",
        role: "Nettoyage",
        location: "Unassigned",
        photo: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
        email: "mehdi.elfassi@email.com",
        phone: "+212 6 34 56 78 90",
        experiences: [
            {
                company: "SalesPro Maroc",
                position: "Commercial B2B",
                from: "2020-03-01",
                to: "2022-11-30"
            }
        ]
    },
    {
        id: 5,
        name: "Lina Toumi",
        role: "Réceptionniste",
        location: "Unassigned",
        photo: "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=150&h=150&fit=crop&crop=face",
        email: "lina.toumi@email.com",
        phone: "+212 6 45 67 89 01",
        experiences: [
            {
                company: "Creative Agency",
                position: "Designer Graphique",
                from: "2019-09-15",
                to: "2022-05-20"
            }
        ]
    },
    {
        id: 6,
        name: "Youssef Alaoui",
        role: "Nettoyage",
        location: "Unassigned",
        photo: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
        email: "youssef.alaoui@email.com",
        phone: "+212 6 56 78 90 12",
        experiences: [
            {
                company: "Projet Solutions",
                position: "Assistant Chef de Projet",
                from: "2020-07-01",
                to: "2023-01-15"
            }
        ]
    },
];
let all_roms_ids=[]

const roomRestrictions = {
    "Conference Room": ["Manager", "Réceptionniste", "Technicien IT", "Agent de sécurité", "Nettoyage"],
    "Reception": ["Réceptionniste","Manager","Nettoyage"],
    "Server Room": ["Nettoyage","Technicien IT","Manager"],
    "Security Room": ["Agent de sécurité","Manager","Nettoyage"],
    "Staff Room": ["Manager", "Réceptionniste", "Technicien IT", "Agent de sécurité", "Nettoyage"],
    "Archive Room": ["Manager"],
};

//init
document.addEventListener('DOMContentLoaded', function() {
    initApp();
});

function initApp() {
    loadEmployees();
    setupEventListeners();
}

// écouteurs d'événements
function setupEventListeners() {
    const addWorkerBtn = document.getElementById('addWorkerBtn');
    if (addWorkerBtn) {
        addWorkerBtn.addEventListener('click', showAddEmployeeModal);
    }

const buttons = document.querySelectorAll('.add-to-room-btn');
for (let i = 0; i < buttons.length; i++) {
    const btn = buttons[i];
    btn.addEventListener('click', function() {
    const roomId = this.getAttribute('data-room');
    openRoomAssignment(roomId);
    });
}

    // fermer modale
    const closeModalBtn = document.getElementById('closeModalBtn');
    if (closeModalBtn) {
        closeModalBtn.addEventListener('click', hideAddEmployeeModal);
    }

    // fermer profile
    const closeProfileBtn = document.getElementById('closeProfileBtn');
    if (closeProfileBtn) {
        closeProfileBtn.addEventListener('click', hideEmployeeProfile);
    }

    // ajouter employee btn
    const addEmployeeForm = document.getElementById('addEmployeeForm');
    if (addEmployeeForm) {
        addEmployeeForm.addEventListener('submit', handleAddEmployee);
    }
    // ajouter exp btn
    const addExpBtn = document.getElementById('addExpBtn');
    if (addExpBtn) {
        addExpBtn.addEventListener('click', addExperienceField);
    }
}

// Charge employee
function loadEmployees() {
    loadUnassignedStaff();
    loadAssignedStaff();
}
// Charge staff non assigne
function loadUnassignedStaff() {
    const staffList = document.getElementById('staffList');
    if (!staffList) return;

const unassignedEmployees = [];
for (let i = 0; i < employees.length; i++) {
    const emp = employees[i];    
    if (emp.location === 'Unassigned') {
        unassignedEmployees.push(emp);
    }
}

    if (unassignedEmployees.length === 0) {
        staffList.innerHTML = '<div class="empty-message">Aucun employé non assigné</div>';
        return;
    }

staffList.innerHTML = '';

for (let i = 0; i < unassignedEmployees.length; i++) {
    const emp = unassignedEmployees[i];
    const staffItem = document.createElement('div');
    staffItem.className = 'staff-item';
        staffItem.onclick = function() {
        showEmployeeProfile(emp.id);
    };

    const avatar = document.createElement('div');
    avatar.className = 'staff-avatar';
    if (emp.photo) {
        const img = document.createElement('img');
        img.src = emp.photo;
        img.alt = emp.name;
        avatar.appendChild(img);
    } else {
        const icon = document.createElement('i');
        icon.className = 'fas fa-user';
        avatar.appendChild(icon);
    }
    const staffInfo = document.createElement('div');
    staffInfo.className = 'staff-info';
    
    const name = document.createElement('h4');
    name.textContent = emp.name;
    
    const role = document.createElement('p');
    role.textContent = emp.role;
    staffInfo.appendChild(name);
    staffInfo.appendChild(role);
    
    staffItem.appendChild(avatar);
    staffItem.appendChild(staffInfo);
    staffList.appendChild(staffItem);
}
}

// Chargement du staff assigné
function loadAssignedStaff() {
    for (let i = 1; i <= 6; i++) {
        const staffRoom = document.getElementById(`staffRoom${i}`);
        if (staffRoom) {
            staffRoom.innerHTML = '';
        }
    }

    // Assigner les employes aux salles
 for (let i = 0; i < employees.length; i++) {
    const emp = employees[i];
    
    if (emp.location !== 'Unassigned') {
        const roomElement = document.querySelector('[data-room="' + emp.location + '"]');
        
        if (roomElement) {
            const roomId = roomElement.id;
            const roomNumber = roomId.replace('room', '');
            const staffRoom = document.getElementById('staffRoom' + roomNumber);
            
            if (staffRoom) {
                const staffItem = document.createElement('div');
                staffItem.className = 'staff-item';
                
                let avatarContent = '';
                if (emp.photo) {
                    avatarContent = '<img src="' + emp.photo + '" alt="' + emp.name + '">';
                } else {
                    avatarContent = '<i class="fas fa-user"></i>';
                }
                
                staffItem.innerHTML = 
                    '<div class="staff-avatar">' + avatarContent + '</div>' +
                    '<div class="staff-info">' +
                    '<h4>' + emp.name + '</h4>' +
                    '<p>' + emp.role + '</p>' +
                    '</div>' +
                    '<button class="remove-staff-btn" onclick="removeFromRoom(' + emp.id + ')">' +
                    '<i class="fas fa-times"></i>' +
                    '</button>';
                
                staffRoom.appendChild(staffItem);
            }
        }
    }
 }

    
    // red background pour les salles vides
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

for (let i = 0; i < all_roms_ids.length; i++) {
    let roomId = all_roms_ids[i];
    let room = document.getElementById(roomId);
    
    if (room.querySelector(".staff-item") !== null) {
        room.parentElement.style.background = "none";
    }
}
}



// ouvrir l'assignation a une salle
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
    
    // employes disponibles pour salle
   function loadAvailableEmployees() {
    const availableEmployees = [];
    
    for (let i = 0; i < employees.length; i++) {
        const emp = employees[i];
        
        if (emp.location === 'Unassigned' && canAssignToRoom(emp.role, roomName)) {
            availableEmployees.push(emp);
        }
    }
    displayEmployeesList(availableEmployees, roomName);
    }
    
    // liste des employee
    function displayEmployeesList(employeesList, roomName) {
        const employeesListContainer = modal.querySelector('#employeesList');
        
        if (employeesList.length === 0) {
            modal.style.display="none"
            return;
        }
        
       employeesListContainer.innerHTML = '';

        for (let i = 0; i < employeesList.length; i++) {
           const emp = employeesList[i];
           
           employeesListContainer.innerHTML += `
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
           `;
        }
    }
    
    // evenements de fermeture
    modal.querySelector('.close-modal').addEventListener('click', () => {
        modal.remove();
    });
    
    modal.querySelector('.btn-cancel').addEventListener('click', () => {
        modal.remove();
    });
    
    // Fermer en cliquant a l'exterieur
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.remove();
        }
    });
    
    // Charger initialement
    loadAvailableEmployees();
}

// roles autorises pour une salle
function getAllowedRoles(roomName) {
    const restrictions = roomRestrictions[roomName];
    if (!restrictions || restrictions.length === 0) return 'Tous les rôles';
    return restrictions.join(', ');
}

// Assigner employee à salle
function assignEmployeeToRoom(employeeId, roomName) {
    let employee = null;
    for (let i = 0; i < employees.length; i++) {
        if (employees[i].id === employeeId) {
            employee = employees[i];
            break;
        }
    }
    if (!employee) {
        return;
    }
    
    // la limite de la salle
    const roomLimits = {
        "Conference Room": 7,
        "Archive Room": 2,
        "Security Room": 3,
        "Reception": 4,
        "Staff Room": 5,
        "Server Room": 2
    };
    
    let currentCount = 0;
    for (let i = 0; i < employees.length; i++) {
        if (employees[i].location === roomName) {
            currentCount++;
        }
    }
    
    if (currentCount >= roomLimits[roomName]) {
        alert("Cette salle a atteint sa limite maximale");
        return;
    }
    
    if (canAssignToRoom(employee.role, roomName)) {
        employee.location = roomName;
        loadEmployees();
        
        const modals = document.querySelectorAll('.assignment-modal');
        for (let i = 0; i < modals.length; i++) {
            modals[i].remove();
        }
    }
}

// Retirer employee d'une salle
function removeFromRoom(employeeId) {
    for (let i = 0; i < employees.length; i++) {
        if (employees[i].id === employeeId) {
            employees[i].location = 'Unassigned';
            loadEmployees();
            break;
        }
    }
}

// si un rôle peut être assigné à une salle or not
function canAssignToRoom(role, roomName) {
    const restrictions = roomRestrictions[roomName];
    if (!restrictions || restrictions.length === 0) return true;
    return restrictions.includes(role);
}

// modale d'ajout d'employee
function showAddEmployeeModal() {
    const modal = document.getElementById('addEmployeeModal');
    if (modal) {
        modal.classList.add('show');
    }
}


// hide modal ajout employee
function hideAddEmployeeModal() {
    const modal = document.getElementById('addEmployeeModal');
    if (modal) {
        modal.classList.remove('show');
        document.getElementById('addEmployeeForm').reset();
        resetExperienceFields();
    }
}

function formatDate(dateString) {
    if (dateString === '' || dateString === null || dateString === 'Present') {
        return 'Present';
    }
     const parts = dateString.split('-');
    
    if (parts.length === 3) {
        const year = parts[0];
        const month = parts[1];
        const day = parts[2];
         return day + '/' + month + '/' + year;
    }
}

// profil employee
function showEmployeeProfile(employeeId) {
    let employee = null;
    for (let i = 0; i < employees.length; i++) {
        if (employees[i].id === employeeId) {
            employee = employees[i];
            break;
        }
    }
    
    if (!employee) return;

    const modal = document.getElementById('employeeProfileModal');
    if (!modal) return;

    document.getElementById('profileName').textContent = employee.name;
    document.getElementById('profileRole').textContent = employee.role;
    document.getElementById('profileEmail').textContent = employee.email || 'Non renseigné';
    document.getElementById('profilePhone').textContent = employee.phone || 'Non renseigné';

    const profilePhoto = document.getElementById('profilePhoto');
    if (employee.photo) {
        profilePhoto.innerHTML = `<img src="${employee.photo}" alt="${employee.name}">`;
    } else {
        profilePhoto.innerHTML = '<i class="fas fa-user"></i>';
    }

    const experiencesList = document.getElementById('profileExperiences');
    if (employee.experiences && employee.experiences.length > 0) {
        experiencesList.innerHTML = '';
        
        for (let i = 0; i < employee.experiences.length; i++) {
            const exp = employee.experiences[i];
            const fromDate = formatDate(exp.from);
            const toDate = formatDate(exp.to);
            
            const experienceItem = document.createElement('li');
            experienceItem.innerHTML = `
                <strong>${exp.company}</strong> - ${exp.position}<br>
                ${fromDate} - ${toDate}
            `;
            
            experiencesList.appendChild(experienceItem);
        }
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

function hideEmployeeProfile() {
    const modal = document.getElementById('employeeProfileModal');
    if (modal) {
        modal.classList.remove('show');
    }
}

// Gestion du formulaire d'ajout d'employé
function handleAddEmployee(e) {
    e.preventDefault();
    if (!validateAddEmployeeForm()) {
        return;
    }
    
    const name = document.getElementById('name').value;
    const role = document.getElementById('role').value;
    const email = document.getElementById('email').value;
    const phone = document.getElementById('phone').value;
    const photo = document.getElementById('photoInput').value;
    const experiences = getExperiencesFromForm();
    
    const newEmployee = {
        id: generateId(),
        name: name,
        role: role,
        location: 'Unassigned',
        photo: photo,
        email: email || '',
        phone: phone || '',
        experiences: experiences
    };
    
    employees.push(newEmployee);
    loadEmployees();
    hideAddEmployeeModal();
}

// generation ID
function generateId() {
    let maxId = 0;
    for (let i = 0; i < employees.length; i++) {
        if (employees[i].id > maxId) {
            maxId = employees[i].id;
        }
    }
    return maxId + 1;
}

// Gestion experience
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
    
    for (let i = 0; i < experienceItems.length; i++) {
        const item = experienceItems[i];
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
    }
    
    return experiences;
}

function validateAddEmployeeForm() {
    const name = document.getElementById('name').value.trim();
    const email = document.getElementById('email').value.trim();
    const phone = document.getElementById('phone').value.trim();
        clearValidationErrors();
    
    let isValid = true;

   const regex = {
        name: /^[a-zA-ZÀ-ÿ\s']{3,50}$/,
        email: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{3,}$/,
        phone: /^\+212\s[6-7]\d{2}\s?\d{2}\s?\d{2}\s?\d{2}\s?$/
    };
    if (name === '') {
        showError('name', 'Le nom est obligatoire');
        isValid = false;
    } else if (!regex.name.test(name)) {
        showError('name', 'Le nom doit contenir entre 2 et 50 caractères (lettres, espaces, traits d\'union)');
        isValid = false;
    }
    if (email !== '') {
        if (!regex.email.test(email)) {
            showError('email', 'Format d\'email invalide (ex: exemple@domaine.com)');
            isValid = false;
        }
    }
    if (phone !== '') {
        if (!regex.phone.test(phone)) {
            showError('phone','Format de téléphone invalide (ex: +212 612345678)');
            isValid = false;
        }
    }
    
    return isValid;
}

function showError(fieldId, message) {
    const field = document.getElementById(fieldId);
    if (!field) return;
    
    field.style.borderColor = '#dc2626';
    field.style.borderWidth = '2px';
    
    let errorElement = field.parentNode.querySelector('.error-message');
    if (!errorElement) {
        errorElement = document.createElement('div');
        errorElement.className = 'error-message';
        errorElement.style.cssText = 'color: #dc2626; font-size: 0.875rem; margin-top: 0.25rem;';
        field.parentNode.appendChild(errorElement);
    }
    errorElement.textContent = message;
}

function clearValidationErrors() {
    const errorMessages = document.querySelectorAll('.error-message');
    for (let i = 0; i < errorMessages.length; i++) {
        errorMessages[i].remove();
    }
    
    // Réinitialiser les bordures
    const inputs = document.querySelectorAll('input, select');
    for (let i = 0; i < inputs.length; i++) {
        inputs[i].style.borderColor = '';
        inputs[i].style.borderWidth = '';
    }
}
