// Données et état de l'application
let employees = JSON.parse(localStorage.getItem('employees')) || [];
let nextId = parseInt(localStorage.getItem('nextId')) || 1;

// Règles d'accès par rôle
const roomRestrictions = {
    'Conference Room': ['Manager', 'Developer', 'Designer', 'Analyst', 'IT Technician', 'Security Agent', 'Receptionist', 'Cleaner'],
    'Reception': ['Receptionist', 'Manager', 'Cleaner'],
    'Server Room': ['IT Technician', 'Manager'],
    'Security Room': ['Security Agent', 'Manager'],
    'Staff Room': ['Manager', 'Developer', 'Designer', 'Analyst', 'IT Technician', 'Security Agent', 'Receptionist', 'Cleaner'],
    'Archive Room': ['Manager', 'Developer', 'Designer', 'Analyst', 'IT Technician', 'Security Agent', 'Receptionist']
};

// Éléments DOM
const addWorkerBtn = document.getElementById('addWorkerBtn');
const addEmployeeModal = document.getElementById('addEmployeeModal');
const employeeProfileModal = document.getElementById('employeeProfileModal');
const closeModalBtn = document.getElementById('closeModalBtn');
const closeProfileBtn = document.getElementById('closeProfileBtn');
const addEmployeeForm = document.getElementById('addEmployeeForm');
const photoInput = document.getElementById('photoInput');
const photoPreview = document.getElementById('photoPreview');
const addExpBtn = document.getElementById('addExpBtn');
const experiencesList = document.getElementById('experiencesList');
const staffList = document.getElementById('staffList');

// Initialisation
document.addEventListener('DOMContentLoaded', () => {
    initializeApp();
});

function initializeApp() {
    loadEmployees();
    addExperience();
    
    // Événements des boutons d'ajout aux salles
    document.querySelectorAll('.add-to-room-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            const roomId = e.currentTarget.dataset.room;
            if (roomId) {
                openRoomAssignment(roomId);
            }
        });
    });
    
    // Validation des dates
    document.getElementById('startDate').addEventListener('change', validateDates);
    document.getElementById('endDate').addEventListener('change', validateDates);
    
    // Vérifier les données exemple
    if (employees.length === 0) {
        loadSampleData();
    }
}

// Ouvrir la modale d'ajout d'employé
addWorkerBtn.addEventListener('click', () => {
    addEmployeeModal.classList.add('show');
});

// Fermer les modales
closeModalBtn.addEventListener('click', () => {
    addEmployeeModal.classList.remove('show');
});

closeProfileBtn.addEventListener('click', () => {
    employeeProfileModal.classList.remove('show');
});

// Fermer les modales en cliquant à l'extérieur
[addEmployeeModal, employeeProfileModal].forEach(modal => {
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.classList.remove('show');
        }
    });
});

// Prévisualisation de la photo
photoInput.addEventListener('input', () => {
    const photoUrl = photoInput.value.trim();
    updatePhotoPreview(photoPreview, photoUrl);
});

function updatePhotoPreview(element, photoUrl) {
    if (photoUrl) {
        element.innerHTML = `<img src="${photoUrl}" alt="Preview" onerror="handleImageError(this)">`;
    } else {
        element.innerHTML = '<i class="fas fa-user"></i>';
    }
}

function handleImageError(img) {
    img.style.display = 'none';
    const parent = img.parentElement;
    if (parent) {
        parent.innerHTML = '<i class="fas fa-user"></i>';
    }
}

// Gestion des expériences
addExpBtn.addEventListener('click', () => {
    addExperience();
});

function addExperience(experience = '') {
    const experienceItem = document.createElement('div');
    experienceItem.className = 'experience-item';
    
    experienceItem.innerHTML = `
        <input type="text" placeholder="Ex: Front-End Developer at Google (2020-2022)" value="${experience}">
        <button type="button" class="remove-exp-btn">
            <i class="fas fa-times"></i>
        </button>
    `;
    
    experiencesList.appendChild(experienceItem);
    
    const removeBtn = experienceItem.querySelector('.remove-exp-btn');
    removeBtn.addEventListener('click', () => {
        experienceItem.remove();
    });
}

// Validation des dates
function validateDates() {
    const startDate = document.getElementById('startDate').value;
    const endDate = document.getElementById('endDate').value;
    
    if (startDate && endDate && startDate > endDate) {
        alert('End date cannot be before start date!');
        document.getElementById('endDate').value = '';
        return false;
    }
    return true;
}

// Soumission du formulaire d'ajout d'employé
addEmployeeForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    if (!validateDates()) {
        return;
    }
    
    const formData = new FormData(addEmployeeForm);
    const experiences = Array.from(document.querySelectorAll('.experience-item input'))
        .map(input => input.value.trim())
        .filter(exp => exp !== '');
    
    const newEmployee = {
        id: nextId++,
        name: formData.get('name'),
        role: formData.get('role'),
        photo: formData.get('photo'),
        startDate: formData.get('startDate'),
        endDate: formData.get('endDate'),
        email: formData.get('email'),
        phone: formData.get('phone'),
        experiences: experiences,
        location: 'Unassigned'
    };
    
    employees.push(newEmployee);
    saveToLocalStorage();
    loadEmployees();
    
    // Réinitialiser le formulaire
    addEmployeeForm.reset();
    experiencesList.innerHTML = '';
    addExperience();
    updatePhotoPreview(photoPreview, '');
    addEmployeeModal.classList.remove('show');
    
    alert('Employee added successfully!');
});

// Charger et afficher les employés
function loadEmployees() {
    updateStaffList();
    updateRooms();
}

function updateStaffList() {
    staffList.innerHTML = '';
    
    const unassignedEmployees = employees.filter(emp => emp.location === 'Unassigned');
    
    if (unassignedEmployees.length === 0) {
        const emptyMessage = document.createElement('div');
        emptyMessage.className = 'empty-message';
        emptyMessage.textContent = 'No unassigned employees';
        staffList.appendChild(emptyMessage);
        return;
    }
    
    unassignedEmployees.forEach(employee => {
        const staffItem = createStaffElement(employee);
        staffList.appendChild(staffItem);
    });
}

function createStaffElement(employee) {
    const staffItem = document.createElement('div');
    staffItem.className = 'staff-item';
    staffItem.dataset.id = employee.id;
    
    staffItem.innerHTML = `
        <div class="staff-avatar">
            ${employee.photo ? 
                `<img src="${employee.photo}" alt="${employee.name}" onerror="handleImageError(this)">` : 
                '<i class="fas fa-user"></i>'
            }
        </div>
        <div class="staff-info">
            <h4>${employee.name}</h4>
            <p>${employee.role}</p>
        </div>
    `;
    
    staffItem.addEventListener('click', () => {
        openEmployeeProfile(employee.id);
    });
    
    return staffItem;
}

// Mettre à jour l'affichage des salles
function updateRooms() {
    for (let i = 1; i <= 6; i++) {
        const roomElement = document.getElementById(`room${i}`);
        const staffContainer = document.getElementById(`staffRoom${i}`);
        
        if (!roomElement || !staffContainer) {
            console.warn(`Room elements for room${i} not found`);
            continue;
        }
        
        const roomName = roomElement.dataset.room;
        staffContainer.innerHTML = '';
        
        const roomEmployees = employees.filter(emp => emp.location === roomName);
        
        roomEmployees.forEach(employee => {
            const assignedStaff = createAssignedStaffElement(employee);
            staffContainer.appendChild(assignedStaff);
        });
    }
}

function createAssignedStaffElement(employee) {
    const assignedStaff = document.createElement('div');
    assignedStaff.className = 'staff-item';
    assignedStaff.dataset.id = employee.id;
    
    assignedStaff.innerHTML = `
        <div class="staff-avatar">
            ${employee.photo ? 
                `<img src="${employee.photo}" alt="${employee.name}" onerror="handleImageError(this)">` : 
                '<i class="fas fa-user"></i>'
            }
        </div>
        <div class="staff-info">
            <h4>${employee.name}</h4>
            <p>${employee.role}</p>
        </div>
        <button class="remove-staff-btn" onclick="removeFromRoom(${employee.id}, event)">
            <i class="fas fa-times"></i>
        </button>
    `;
    
    assignedStaff.addEventListener('click', (e) => {
        if (!e.target.closest('.remove-staff-btn')) {
            openEmployeeProfile(employee.id);
        }
    });
    
    return assignedStaff;
}

// Ouvrir l'assignation à une salle
function openRoomAssignment(roomId) {
    const roomElement = document.getElementById(roomId);
    if (!roomElement) {
        console.error(`Room element with id ${roomId} not found`);
        return;
    }
    
    const roomName = roomElement.dataset.room;
    const unassignedEmployees = employees.filter(emp => emp.location === 'Unassigned');
    
    if (unassignedEmployees.length === 0) {
        alert('No unassigned employees available.');
        return;
    }
    
    // Créer une interface de sélection
    let employeeList = 'Available employees:\n\n';
    unassignedEmployees.forEach((emp, index) => {
        employeeList += `${index + 1}. ${emp.name} (${emp.role})\n`;
    });
    
    employeeList += '\nEnter the number or name of the employee:';
    
    const userInput = prompt(employeeList);
    
    if (!userInput) return;
    
    let selectedEmployee;
    
    // Vérifier si l'utilisateur a entré un numéro
    const inputNumber = parseInt(userInput);
    if (!isNaN(inputNumber) && inputNumber >= 1 && inputNumber <= unassignedEmployees.length) {
        selectedEmployee = unassignedEmployees[inputNumber - 1];
    } else {
        // Chercher par nom
        selectedEmployee = unassignedEmployees.find(emp => 
            emp.name.toLowerCase().includes(userInput.toLowerCase())
        );
    }
    
    if (selectedEmployee) {
        if (canAssignToRoom(selectedEmployee.role, roomName)) {
            selectedEmployee.location = roomName;
            saveToLocalStorage();
            loadEmployees();
            alert(`✅ ${selectedEmployee.name} assigned to ${roomName}`);
        } else {
            const allowedRoles = roomRestrictions[roomName]?.join(', ') || 'All roles';
            alert(`❌ ${selectedEmployee.role} cannot be assigned to ${roomName}\n\nAllowed roles: ${allowedRoles}`);
        }
    } else {
        alert('Employee not found. Please check the name/number and try again.');
    }
}

// Vérifier si un rôle peut être assigné à une salle
function canAssignToRoom(role, room) {
    if (!roomRestrictions[room]) return true;
    return roomRestrictions[room].includes(role);
}

// Retirer un employé d'une salle
function removeFromRoom(employeeId, event) {
    if (event) event.stopPropagation();
    const employee = employees.find(emp => emp.id === employeeId);
    if (employee) {
        employee.location = 'Unassigned';
        saveToLocalStorage();
        loadEmployees();
    }
}

// Ouvrir le profil d'un employé
function openEmployeeProfile(employeeId) {
    const employee = employees.find(emp => emp.id === employeeId);
    if (!employee) return;
    
    document.getElementById('profileName').textContent = employee.name;
    document.getElementById('profileRole').textContent = employee.role;
    document.getElementById('profileLocation').textContent = `Currently in: ${employee.location}`;
    document.getElementById('profileEmail').textContent = employee.email || 'Not specified';
    document.getElementById('profilePhone').textContent = employee.phone || 'Not specified';
    
    const profilePhoto = document.getElementById('profilePhoto');
    updatePhotoPreview(profilePhoto, employee.photo);
    
    // Afficher les dates
    const profileDetails = document.querySelector('.profile-details');
    
    // Supprimer les anciennes dates s'il y en a
    const existingDates = document.querySelectorAll('.dates-item');
    existingDates.forEach(date => date.remove());
    
    // Ajouter les dates si elles existent
    if (employee.startDate || employee.endDate) {
        const datesItem = document.createElement('div');
        datesItem.className = 'dates-item';
        
        const startDate = employee.startDate ? new Date(employee.startDate).toLocaleDateString() : 'Not specified';
        const endDate = employee.endDate ? new Date(employee.endDate).toLocaleDateString() : 'Present';
        
        datesItem.innerHTML = `
            <i class="fas fa-calendar-alt"></i>
            <div class="date-range">
                <span>Employment Period:</span>
                ${startDate} - ${endDate}
            </div>
        `;
        
        // Insérer après les détails existants
        const existingDetails = profileDetails.querySelector('.detail-item:last-child');
        if (existingDetails) {
            existingDetails.parentNode.insertBefore(datesItem, existingDetails.nextSibling);
        } else {
            profileDetails.appendChild(datesItem);
        }
    }

        const experiencesList = document.getElementById('profileExperiences');
    experiencesList.innerHTML = '';
    
    if (employee.experiences && employee.experiences.length > 0) {
        employee.experiences.forEach(exp => {
            const li = document.createElement('li');
            li.textContent = exp;
            experiencesList.appendChild(li);
        });
    } else {
        const li = document.createElement('li');
        li.textContent = 'No experiences listed';
        li.style.color = '#999';
        li.style.fontStyle = 'italic';
        experiencesList.appendChild(li);
    }
    
    employeeProfileModal.classList.add('show');
}