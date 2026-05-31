import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-app.js";
import { getAuth, signInWithEmailAndPassword, signOut, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-auth.js";
import { getFirestore, doc, setDoc, getDoc } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-firestore.js";

const firebaseConfig = {
    apiKey: "AIzaSyBrgGQ77ABeIjE3wp9PFjzG4hYdrCjtW0A",
    authDomain: "shawrma-mall-admin.firebaseapp.com",
    projectId: "shawrma-mall-admin",
    storageBucket: "shawrma-mall-admin.firebasestorage.app",
    messagingSenderId: "993219033000",
    appId: "1:993219033000:web:3998010d015629cd724f9d"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// Default Data to initialize LocalStorage if empty
const defaultMenuData = {
    shawarma: [
        { name: "شاورما دجاج", prices: [{ label: "ساندويش صغير", price: "0.60" }, { label: "ساندويش كبير", price: "1.10" }, { label: "وجبة عادي", price: "2.00" }] },
        { name: "شاورما اللحمة", prices: [{ label: "ساندويش كبير", price: "1.20" }, { label: "وجبة عادي", price: "2.10" }] }
    ],
    burgers: [
        { name: "سكالوب دجاج", prices: [{ label: "ساندويش", price: "1.20" }, { label: "وجبة", price: "2.50" }] },
        { name: "برغر بالبيض", prices: [{ label: "ساندويش", price: "1.50" }, { label: "وجبة", price: "2.75" }] }
    ],
    snacks: [
        { name: "زنجر حار او بارد", prices: [{ label: "ساندويش", price: "1.50" }, { label: "وجبة", price: "2.75" }] }
    ],
    broasted: [
        { name: "البروستد (حار أو بارد)", prices: [{ label: "4 قطع", price: "3.50" }, { label: "8 قطع", price: "6.50" }] }
    ]
};

const defaultSections = [
    { id: "shawarma", name: "شاورما" },
    { id: "burgers", name: "البرغر" },
    { id: "snacks", name: "السناكات" },
    { id: "broasted", name: "البروستد والكرسبي" }
];

const defaultSettings = {
    heroTitle: "مرحباً بكم في شاورما مول",
    heroSubtitle: "أشهى الوجبات، الشاورما، البرغر، والبروستد المحضرة يومياً بأجود المكونات.",
    hours: "يومياً: ١٢:٠٠ ظهراً - ٢:٠٠ فجراً\nالجمعة: ٢:٠٠ ظهراً - ٣:٠٠ فجراً",
    address: "عمان، الأردن",
    phone: "0790000000"
};

// State Management
let menuData = defaultMenuData;
let sectionsData = defaultSections;
let settingsData = defaultSettings;

const loadData = async () => {
    try {
        const docRef = doc(db, "restaurantData", "content");
        const docSnap = await getDoc(docRef);
        
        if (docSnap.exists()) {
            const data = docSnap.data();
            menuData = data.menuData || defaultMenuData;
            sectionsData = data.sectionsData || defaultSections;
            settingsData = data.settingsData || defaultSettings;
        } else {
            // Save defaults if doc doesn't exist
            await saveData();
        }
    } catch (error) {
        console.error("Error fetching data:", error);
    }
};

const saveData = async () => {
    try {
        await setDoc(doc(db, "restaurantData", "content"), {
            menuData,
            sectionsData,
            settingsData
        });
        updateStats();
    } catch (error) {
        console.error("Error saving data:", error);
        alert("حدث خطأ أثناء حفظ البيانات!");
    }
};

// DOM Elements
const loginScreen = document.getElementById('login-screen');
const dashboard = document.getElementById('dashboard');
const loginForm = document.getElementById('login-form');
const loginError = document.getElementById('login-error');
const navItems = document.querySelectorAll('.nav-item[data-target]');
const viewSections = document.querySelectorAll('.view-section');

// Auth Logic
onAuthStateChanged(auth, async (user) => {
    if (user) {
        loginScreen.style.display = 'none';
        dashboard.style.display = 'flex';
        await loadData();
        initDashboard();
    } else {
        loginScreen.style.display = 'flex';
        dashboard.style.display = 'none';
    }
});

loginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const user = document.getElementById('username').value;
    const pass = document.getElementById('password').value;
    
    signInWithEmailAndPassword(auth, user, pass)
        .then((userCredential) => {
            loginError.style.display = 'none';
        })
        .catch((error) => {
            loginError.innerText = 'البريد الإلكتروني أو كلمة المرور غير صحيحة';
            loginError.style.display = 'block';
        });
});

document.getElementById('logout-btn').addEventListener('click', () => {
    signOut(auth).catch((error) => {
        console.error("Logout error", error);
    });
});

// Navigation Logic
navItems.forEach(item => {
    item.addEventListener('click', () => {
        navItems.forEach(n => n.classList.remove('active'));
        item.classList.add('active');
        
        viewSections.forEach(v => v.classList.remove('active'));
        document.getElementById(item.getAttribute('data-target')).classList.add('active');
    });
});

// Dashboard Init
const updateStats = () => {
    document.getElementById('stat-sections').innerText = sectionsData.length;
    let totalItems = 0;
    for (const key in menuData) {
        totalItems += menuData[key].length;
    }
    document.getElementById('stat-items').innerText = totalItems;
};

const initDashboard = () => {
    updateStats();
    renderMenuTable();
    renderSectionsTable();
    populateSettingsForm();
};

// Menu Management
const menuTableBody = document.getElementById('menu-table-body');
const itemModal = document.getElementById('item-modal');
const closeItemModal = document.querySelector('.close-modal');

const getSectionName = (id) => {
    const sec = sectionsData.find(s => s.id === id);
    return sec ? sec.name : id;
};

const renderMenuTable = () => {
    menuTableBody.innerHTML = '';
    for (const sectionKey in menuData) {
        menuData[sectionKey].forEach((item, index) => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>${item.name}</td>
                <td>${getSectionName(sectionKey)}</td>
                <td class="actions-cell">
                    <button class="btn btn-sm btn-secondary edit-item-btn" data-section="${sectionKey}" data-index="${index}">تعديل</button>
                    <button class="btn btn-sm btn-danger delete-item-btn" data-section="${sectionKey}" data-index="${index}">حذف</button>
                </td>
            `;
            menuTableBody.appendChild(tr);
        });
    }

    // Attach Edit/Delete
    document.querySelectorAll('.edit-item-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const section = e.target.getAttribute('data-section');
            const index = e.target.getAttribute('data-index');
            openItemModal(section, index);
        });
    });

    document.querySelectorAll('.delete-item-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            if(confirm("هل أنت متأكد من حذف هذه الوجبة؟")) {
                const section = e.target.getAttribute('data-section');
                const index = e.target.getAttribute('data-index');
                menuData[section].splice(index, 1);
                saveData();
                renderMenuTable();
            }
        });
    });
};

// Item Modal Logic
document.getElementById('btn-add-item').addEventListener('click', () => openItemModal());
closeItemModal.addEventListener('click', () => itemModal.classList.remove('active'));

const populateSectionDropdown = () => {
    const select = document.getElementById('item-section');
    select.innerHTML = '';
    sectionsData.forEach(s => {
        const opt = document.createElement('option');
        opt.value = s.id;
        opt.innerText = s.name;
        select.appendChild(opt);
    });
};

const pricesContainer = document.getElementById('prices-container');

const renderPriceInputs = (prices = []) => {
    pricesContainer.innerHTML = '';
    if (prices.length === 0) {
        addPriceInput('', '');
    } else {
        prices.forEach(p => addPriceInput(p.label, p.price));
    }
};

const addPriceInput = (labelVal, priceVal) => {
    const div = document.createElement('div');
    div.className = 'price-input-group';
    div.innerHTML = `
        <input type="text" placeholder="الحجم/النوع (مثال: وجبة)" class="price-label" value="${labelVal}" required>
        <input type="number" step="0.01" placeholder="السعر" class="price-val" value="${priceVal}" required>
        <button type="button" class="btn btn-danger btn-sm remove-price">X</button>
    `;
    pricesContainer.appendChild(div);

    div.querySelector('.remove-price').addEventListener('click', () => {
        if(pricesContainer.children.length > 1) {
            div.remove();
        }
    });
};

document.getElementById('add-price-btn').addEventListener('click', () => addPriceInput('', ''));

const openItemModal = (sectionKey = null, index = null) => {
    populateSectionDropdown();
    document.getElementById('item-form').reset();
    
    if (sectionKey !== null && index !== null) {
        document.getElementById('modal-title').innerText = 'تعديل وجبة';
        const item = menuData[sectionKey][index];
        document.getElementById('item-edit-index').value = index;
        document.getElementById('item-edit-old-section').value = sectionKey;
        document.getElementById('item-name').value = item.name;
        document.getElementById('item-section').value = sectionKey;
        renderPriceInputs(item.prices);
    } else {
        document.getElementById('modal-title').innerText = 'إضافة وجبة';
        document.getElementById('item-edit-index').value = '';
        document.getElementById('item-edit-old-section').value = '';
        if(sectionsData.length > 0) document.getElementById('item-section').value = sectionsData[0].id;
        renderPriceInputs();
    }
    
    itemModal.classList.add('active');
};

document.getElementById('item-form').addEventListener('submit', (e) => {
    e.preventDefault();
    
    const name = document.getElementById('item-name').value;
    const section = document.getElementById('item-section').value;
    const oldSection = document.getElementById('item-edit-old-section').value;
    const indexStr = document.getElementById('item-edit-index').value;
    
    // Gather prices
    const prices = [];
    const groups = document.querySelectorAll('.price-input-group');
    groups.forEach(g => {
        const label = g.querySelector('.price-label').value;
        const price = g.querySelector('.price-val').value;
        prices.push({ label, price });
    });

    const newItem = { name, prices };

    // Ensure section array exists
    if (!menuData[section]) {
        menuData[section] = [];
    }

    if (indexStr !== '') {
        // Edit mode
        const index = parseInt(indexStr);
        if (section === oldSection) {
            menuData[section][index] = newItem;
        } else {
            menuData[oldSection].splice(index, 1);
            menuData[section].push(newItem);
        }
    } else {
        // Add mode
        menuData[section].push(newItem);
    }

    saveData();
    renderMenuTable();
    itemModal.classList.remove('active');
});

// Sections Management
const sectionsTableBody = document.getElementById('sections-table-body');

const renderSectionsTable = () => {
    sectionsTableBody.innerHTML = '';
    sectionsData.forEach((sec, index) => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${sec.name}</td>
            <td>${sec.id}</td>
            <td class="actions-cell">
                <button class="btn btn-sm btn-secondary edit-section-btn" data-index="${index}">تعديل</button>
                <button class="btn btn-sm btn-danger delete-section-btn" data-index="${index}">حذف</button>
            </td>
        `;
        sectionsTableBody.appendChild(tr);
    });

    document.querySelectorAll('.edit-section-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const index = e.target.getAttribute('data-index');
            openSectionModal(index);
        });
    });

    document.querySelectorAll('.delete-section-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const index = e.target.getAttribute('data-index');
            const secId = sectionsData[index].id;
            
            if(menuData[secId] && menuData[secId].length > 0) {
                alert("لا يمكن حذف هذا القسم لأنه يحتوي على وجبات. يرجى حذف الوجبات أو نقلها أولاً.");
                return;
            }

            if(confirm("هل أنت متأكد من حذف هذا القسم؟")) {
                sectionsData.splice(index, 1);
                saveData();
                renderSectionsTable();
            }
        });
    });
};

const sectionModal = document.getElementById('section-modal');
const closeSectionModal = document.querySelector('.close-section-modal');

document.getElementById('btn-add-section').addEventListener('click', () => openSectionModal());
closeSectionModal.addEventListener('click', () => sectionModal.classList.remove('active'));

const openSectionModal = (index = null) => {
    document.getElementById('section-form').reset();
    
    if (index !== null) {
        document.getElementById('section-modal-title').innerText = 'تعديل قسم';
        const sec = sectionsData[index];
        document.getElementById('section-edit-index').value = index;
        document.getElementById('section-name').value = sec.name;
        document.getElementById('section-id').value = sec.id;
        document.getElementById('section-id').setAttribute('readonly', 'true'); // ID should not be easily changed if it links to items
    } else {
        document.getElementById('section-modal-title').innerText = 'إضافة قسم';
        document.getElementById('section-edit-index').value = '';
        document.getElementById('section-id').removeAttribute('readonly');
    }
    
    sectionModal.classList.add('active');
};

document.getElementById('section-form').addEventListener('submit', (e) => {
    e.preventDefault();
    
    const name = document.getElementById('section-name').value;
    const id = document.getElementById('section-id').value;
    const indexStr = document.getElementById('section-edit-index').value;
    
    if (indexStr !== '') {
        // Edit mode
        const index = parseInt(indexStr);
        sectionsData[index].name = name;
        // Don't change ID to avoid orphaned items
    } else {
        // Add mode
        // Ensure ID is unique
        if(sectionsData.find(s => s.id === id)) {
            alert("المعرف (ID) مستخدم مسبقاً! الرجاء اختيار معرف آخر.");
            return;
        }
        sectionsData.push({ id, name });
    }

    saveData();
    renderSectionsTable();
    sectionModal.classList.remove('active');
});

// Website Settings
const populateSettingsForm = () => {
    document.getElementById('setting-hero-title').value = settingsData.heroTitle;
    document.getElementById('setting-hero-subtitle').value = settingsData.heroSubtitle;
    document.getElementById('setting-hours').value = settingsData.hours;
    document.getElementById('setting-address').value = settingsData.address;
    document.getElementById('setting-phone').value = settingsData.phone;
};

document.getElementById('settings-form').addEventListener('submit', (e) => {
    e.preventDefault();
    settingsData.heroTitle = document.getElementById('setting-hero-title').value;
    settingsData.heroSubtitle = document.getElementById('setting-hero-subtitle').value;
    settingsData.hours = document.getElementById('setting-hours').value;
    settingsData.address = document.getElementById('setting-address').value;
    settingsData.phone = document.getElementById('setting-phone').value;
    
    saveData();
    alert("تم حفظ الإعدادات بنجاح!");
});

// Start App
// Application is initialized and rendered through onAuthStateChanged
