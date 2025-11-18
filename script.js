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