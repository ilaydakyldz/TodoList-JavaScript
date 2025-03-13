// DOM Elementlerini Seçme
const taskInput = document.getElementById('task-input');
const addButton = document.getElementById('add-button');
const taskList = document.getElementById('task-list');
const allFilter = document.getElementById('all');
const activeFilter = document.getElementById('active');
const completedFilter = document.getElementById('completed');
const clearCompletedButton = document.getElementById('clear-completed');
const clearAllButton = document.getElementById('clear-all');

// Uygulama Durumu
let tasks = [];
let currentFilter = 'all';

// Sayfa Yüklendiğinde
document.addEventListener('DOMContentLoaded', () => {
    // LocalStorage'dan görevleri yükleme
    loadTasksFromLocalStorage();
    
    // Event Listenerları Ekleme
    addButton.addEventListener('click', addTask);
    taskInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            addTask();
        }
    });
    
    allFilter.addEventListener('click', () => filterTasks('all'));
    activeFilter.addEventListener('click', () => filterTasks('active'));
    completedFilter.addEventListener('click', () => filterTasks('completed'));
    
    clearCompletedButton.addEventListener('click', clearCompletedTasks);
    clearAllButton.addEventListener('click', clearAllTasks);
    
    // Başlangıçta görevleri render
    renderTasks();
    updateFilterButtons();
});

// Yeni Görev Ekleme Fonksiyonu
function addTask() {
    const taskText = taskInput.value.trim();
    
    if (taskText !== '') {
        // Yeni görev objesi
        const newTask = {
            id: Date.now(), // Benzersiz ID için timestamp kullanımı
            text: taskText,
            completed: false,
            createdAt: new Date()
        };
        
        // Görevi diziye ekleme
        tasks.push(newTask);
        
        // Input alanını temizleme
        taskInput.value = '';
        
        // Listeyi güncelleme
        saveTasksToLocalStorage();
        renderTasks();
    }
}

// Görevleri Filtreleme
function filterTasks(filter) {
    currentFilter = filter;
    updateFilterButtons();
    renderTasks();
}

// Filtre Butonlarını Güncelleme
function updateFilterButtons() {
    // Tüm butonlardan active sınıfını kaldır
    allFilter.classList.remove('active');
    activeFilter.classList.remove('active');
    completedFilter.classList.remove('active');
    
    // Aktif filtreye göre active sınıfını ekle
    if (currentFilter === 'all') {
        allFilter.classList.add('active');
    } else if (currentFilter === 'active') {
        activeFilter.classList.add('active');
    } else if (currentFilter === 'completed') {
        completedFilter.classList.add('active');
    }
}

// Görevlerin Görüntülenmesi
function renderTasks() {
    // Liste içeriğini temizleme
    taskList.innerHTML = '';
    
    // Filtreli görevleri alma
    let filteredTasks = [];
    
    if (currentFilter === 'all') {
        filteredTasks = tasks;
    } else if (currentFilter === 'active') {
        filteredTasks = tasks.filter(task => !task.completed);
    } else if (currentFilter === 'completed') {
        filteredTasks = tasks.filter(task => task.completed);
    }
    
    // Eğer görev yoksa mesaj göster
    if (filteredTasks.length === 0) {
        const emptyMessage = document.createElement('p');
        emptyMessage.className = 'empty-list';
        
        if (currentFilter === 'all') {
            emptyMessage.textContent = 'Henüz görev eklenmemiş.';
        } else if (currentFilter === 'active') {
            emptyMessage.textContent = 'Aktif görev bulunmamaktadır.';
        } else {
            emptyMessage.textContent = 'Tamamlanmış görev bulunmamaktadır.';
        }
        
        taskList.appendChild(emptyMessage);
        return;
    }
    
    // Her görev için bir liste elemanı oluştur
    filteredTasks.forEach(task => {
        const taskItem = document.createElement('li');
        taskItem.className = 'task-item';
        if (task.completed) {
            taskItem.classList.add('task-completed');
        }
        
        const taskContent = document.createElement('span');
        taskContent.className = 'task-content';
        taskContent.textContent = task.text;
        
        // Görev durumunu değiştirme (tıklama olayı)
        taskContent.addEventListener('click', () => {
            toggleTaskStatus(task.id);
        });
        
        const deleteButton = document.createElement('button');
        deleteButton.className = 'delete-button';
        deleteButton.textContent = 'Sil';
        
        // Silme butonuna tıklama olayı
        deleteButton.addEventListener('click', () => {
            deleteTask(task.id);
        });
        
        // Öğeleri liste elemanına ekleme
        taskItem.appendChild(taskContent);
        taskItem.appendChild(deleteButton);
        
        // Liste elemanını listeye ekleme
        taskList.appendChild(taskItem);
    });
}

// Görev Durumunu Değiştirme
function toggleTaskStatus(taskId) {
    // İlgili görevi bulma
    const taskIndex = tasks.findIndex(task => task.id === taskId);
    
    if (taskIndex !== -1) {
        // Durumu değiştirme
        tasks[taskIndex].completed = !tasks[taskIndex].completed;
        
        // Değişiklikleri kaydetme ve görüntüleme
        saveTasksToLocalStorage();
        renderTasks();
    }
}

// Görevi Silme
function deleteTask(taskId) {
    // İlgili görevi bulma ve diziden çıkarma
    tasks = tasks.filter(task => task.id !== taskId);
    
    // Değişiklikleri kaydetme ve görüntüleme
    saveTasksToLocalStorage();
    renderTasks();
}

// Tamamlanan Görevleri Temizleme
function clearCompletedTasks() {
    // Sadece tamamlanmamış görevleri tutma
    tasks = tasks.filter(task => !task.completed);
    
    // Değişiklikleri kaydetme ve görüntüleme
    saveTasksToLocalStorage();
    renderTasks();
}

// Tüm Görevleri Temizleme
function clearAllTasks() {
    // Kullanıcıya onay sorma
    if (tasks.length > 0 && confirm('Tüm görevleri silmek istediğinizden emin misiniz?')) {
        // Görev dizisini boşaltma
        tasks = [];
        
        // Değişiklikleri kaydetme ve görüntüleme
        saveTasksToLocalStorage();
        renderTasks();
    }
}

// LocalStorage'a Görevleri Kaydetme
function saveTasksToLocalStorage() {
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

// LocalStorage'dan Görevleri Yükleme
function loadTasksFromLocalStorage() {
    const storedTasks = localStorage.getItem('tasks');
    
    if (storedTasks) {
        tasks = JSON.parse(storedTasks);
    }
}