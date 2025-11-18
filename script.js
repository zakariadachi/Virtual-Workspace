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