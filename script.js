import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-app.js";
import { getFirestore, doc, getDoc } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-firestore.js";

const firebaseConfig = {
    apiKey: "AIzaSyBrgGQ77ABeIjE3wp9PFjzG4hYdrCjtW0A",
    authDomain: "shawrma-mall-admin.firebaseapp.com",
    projectId: "shawrma-mall-admin",
    storageBucket: "shawrma-mall-admin.firebasestorage.app",
    messagingSenderId: "993219033000",
    appId: "1:993219033000:web:3998010d015629cd724f9d"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Default Data
const defaultMenuData = {
    shawarma: [
        { name: "شاورما دجاج", prices: [{ label: "ساندويش صغير", price: "0.60" }, { label: "ساندويش كبير", price: "1.10" }, { label: "وجبة عادي", price: "2.00" }, { label: "وجبة سوبر", price: "2.50" }, { label: "وجبة دبل", price: "3.00" }, { label: "وجبة تريبل", price: "4.00" }] },
        { name: "شاورما اللحمة", prices: [{ label: "ساندويش كبير", price: "1.20" }, { label: "وجبة عادي", price: "2.10" }, { label: "وجبة سوبر", price: "2.75" }, { label: "وجبة دبل", price: "3.50" }, { label: "وجبة تريبل", price: "4.50" }] },
        { name: "شاورما توست ايطالي", prices: [{ label: "وجبة عادي", price: "2.65" }, { label: "وجبة سوبر", price: "3.25" }, { label: "وجبة دبل", price: "4.50" }] },
        { name: "شاورما ايطالي", prices: [{ label: "دجاج", price: "3.90" }, { label: "لحمة", price: "4.50" }] },
        { name: "شاورما حلبي", prices: [{ label: "دجاج", price: "3.50" }, { label: "لحمة", price: "4.00" }] }
    ],
    burgers: [
        { name: "سكالوب دجاج", prices: [{ label: "ساندويش", price: "1.20" }, { label: "وجبة", price: "2.50" }] },
        { name: "برغر بالبيض", prices: [{ label: "ساندويش", price: "1.50" }, { label: "وجبة", price: "2.75" }] },
        { name: "برغر 100 غم", prices: [{ label: "ساندويش", price: "1.20" }, { label: "وجبة", price: "2.50" }] },
        { name: "برجر دجاج جريل", prices: [{ label: "ساندويش", price: "1.75" }, { label: "وجبة", price: "3.00" }] },
        { name: "مايتي برغر 150 غم", prices: [{ label: "ساندويش", price: "2.00" }, { label: "وجبة", price: "3.25" }] },
        { name: "سكالوب دجاج دبل", prices: [{ label: "ساندويش", price: "2.00" }, { label: "وجبة", price: "3.25" }] },
        { name: "برغر فاير هاوس بافلو", prices: [{ label: "ساندويش", price: "2.40" }, { label: "وجبة", price: "3.75" }] },
        { name: "برغر مول", prices: [{ label: "ساندويش", price: "2.40" }, { label: "وجبة", price: "3.75" }] }
    ],
    snacks: [
        { name: "زنجر حار او بارد", prices: [{ label: "ساندويش", price: "1.50" }, { label: "وجبة", price: "2.75" }] },
        { name: "تشكن مكسيكي", prices: [{ label: "ساندويش", price: "1.50" }, { label: "وجبة", price: "2.75" }] },
        { name: "تيركي مع جبنة", prices: [{ label: "ساندويش", price: "1.25" }, { label: "وجبة", price: "2.50" }] },
        { name: "ستيك دجاج", prices: [{ label: "ساندويش", price: "1.75" }, { label: "وجبة", price: "3.00" }] },
        { name: "هوت دوغ مع بيض", prices: [{ label: "ساندويش", price: "1.50" }, { label: "وجبة", price: "2.75" }] },
        { name: "هوت دوغ بالموزاريلا والكريمة", prices: [{ label: "ساندويش", price: "2.00" }, { label: "وجبة", price: "3.25" }] },
        { name: "كوردن بلو", prices: [{ label: "ساندويش", price: "1.75" }, { label: "وجبة", price: "3.25" }] },
        { name: "فاهيتا", prices: [{ label: "ساندويش", price: "1.50" }, { label: "وجبة", price: "2.75" }] },
        { name: "باربكيو", prices: [{ label: "ساندويش", price: "1.50" }, { label: "وجبة", price: "2.75" }] },
        { name: "فيلادلفيا", prices: [{ label: "ساندويش", price: "1.50" }, { label: "وجبة", price: "2.75" }] },
        { name: "هوت دوغ جامبو", prices: [{ label: "ساندويش", price: "1.50" }, { label: "وجبة", price: "2.75" }] },
        { name: "مشروم بالكريمة", prices: [{ label: "ساندويش", price: "1.75" }, { label: "وجبة", price: "3.25" }] },
        { name: "زنجر مول", prices: [{ label: "ساندويش", price: "2.40" }, { label: "وجبة", price: "3.75" }] }
    ],
    broasted: [
        { name: "البروستد (حار أو بارد)", prices: [{ label: "4 قطع", price: "3.50" }, { label: "8 قطع", price: "6.50" }, { label: "12 قطعة", price: "9.75" }, { label: "16 قطعة", price: "12.50" }, { label: "20 قطعة", price: "15.00" }, { label: "24 قطعة", price: "18.50" }, { label: "32 قطعة", price: "24.00" }] },
        { name: "الكرسبي (قطع دجاج مسحب مقلي)", prices: [{ label: "3 قطع", price: "2.90" }, { label: "5 قطع", price: "4.00" }, { label: "8 قطع", price: "6.50" }, { label: "10 قطع", price: "7.50" }, { label: "20 قطعة", price: "14.00" }] }
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

let menuData = defaultMenuData;
let sectionsData = defaultSections;
let settingsData = defaultSettings;

document.addEventListener('DOMContentLoaded', async () => {
    
    try {
        const docRef = doc(db, "restaurantData", "content");
        const docSnap = await getDoc(docRef);
        
        if (docSnap.exists()) {
            const data = docSnap.data();
            menuData = data.menuData || defaultMenuData;
            sectionsData = data.sectionsData || defaultSections;
            settingsData = data.settingsData || defaultSettings;
        }
    } catch (error) {
        console.error("Error fetching data from Firestore, falling back to defaults:", error);
    }
    
    // Apply Settings
    const heroTitleEl = document.getElementById('hero-title-el');
    if(heroTitleEl) heroTitleEl.innerHTML = settingsData.heroTitle.replace('شاورما مول', '<span>شاورما مول</span>');
    
    const heroSubtitleEl = document.getElementById('hero-subtitle-el');
    if(heroSubtitleEl) heroSubtitleEl.innerText = settingsData.heroSubtitle;
    
    const footerHoursEl = document.getElementById('footer-hours-el');
    if(footerHoursEl) footerHoursEl.innerText = settingsData.hours;
    
    const footerAddressEl = document.getElementById('footer-address-el');
    if(footerAddressEl) footerAddressEl.innerText = settingsData.address;
    
    const footerPhoneEl = document.getElementById('footer-phone-el');
    if(footerPhoneEl) footerPhoneEl.innerText = settingsData.phone;

    // Render Categories
    const menuFiltersContainer = document.getElementById('menu-filters');
    if(menuFiltersContainer) {
        menuFiltersContainer.innerHTML = '';
        sectionsData.forEach((sec, index) => {
            const btn = document.createElement('button');
            btn.className = `filter-btn ${index === 0 ? 'active' : ''}`;
            btn.setAttribute('data-filter', sec.id);
            btn.innerText = sec.name;
            menuFiltersContainer.appendChild(btn);
        });
    }

    const menuContainer = document.getElementById('menu-container');
    
    // Function to render menu items
    const renderMenu = (category) => {
        if(!menuContainer) return;
        menuContainer.innerHTML = '';
        const items = menuData[category];
        
        if (!items || items.length === 0) {
            menuContainer.innerHTML = '<p style="text-align:center; width:100%; color:#A3A3A3; grid-column: 1 / -1;">لا توجد وجبات في هذا القسم حالياً.</p>';
            return;
        }

        items.forEach((item, index) => {
            const itemEl = document.createElement('div');
            itemEl.className = 'menu-item animate-up';
            itemEl.style.animationDelay = `${index * 0.05}s`;
            
            let pricesHTML = '';
            item.prices.forEach(p => {
                pricesHTML += `
                    <div class="price-row">
                        <span>${p.label}</span>
                        <span class="price-val">${p.price} دينار</span>
                    </div>
                `;
            });

            itemEl.innerHTML = `
                <div class="item-header">
                    <span class="item-name">${item.name}</span>
                </div>
                <div class="item-prices">
                    ${pricesHTML}
                </div>
            `;
            menuContainer.appendChild(itemEl);
        });
    };

    // Initial render
    if (sectionsData.length > 0) {
        renderMenu(sectionsData[0].id);
    }

    // Filter functionality
    const filterBtns = document.querySelectorAll('.filter-btn');
    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Remove active class from all
            filterBtns.forEach(b => b.classList.remove('active'));
            // Add active class to clicked
            btn.classList.add('active');
            
            const filter = btn.getAttribute('data-filter');
            renderMenu(filter);
        });
    });
});
