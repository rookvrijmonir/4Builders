// js/main.js

const translations = {
    nl: {
        // Navigatie
        nav_home: "Home",
        nav_services: "Diensten",
        nav_pricing: "Prijzen",
        nav_about: "Over Ons",
        nav_contact: "Offerte Aanvragen",
        
        // Home Pagina
        hero_title: "Achterhoekse Nuchterheid.<br>Amsterdamse Kwaliteit.",
        hero_sub: "Wij komen wél opdagen. Gespecialiseerd vastgoedonderhoud door vakmannen die bouwen aan hun toekomst en uw pand.",
        hero_cta_primary: "Prijsindicatie aanvragen",
        usp_1: "Binnen 24 uur reactie. Altijd.",
        usp_2: "Afspraak = Afspraak",
        usp_3: "Maatschappelijk Betrokken",
        
        // Diensten Sectie (Titels & Korte tekst)
        services_title: "Onze Vakgebieden",
        service_1_title: "Schilderwerk",
        service_1_desc: "Strak lakwerk voor kozijnen, deuren en muren. Wij plakken alles netjes af.",
        service_2_title: "Vloeren",
        service_2_desc: "Laminaat en PVC leggen. Inclusief ondervloer en hoge plinten.",
        service_3_title: "Timmerwerk",
        service_3_desc: "Kasten op maat, deuren afhangen en kleine constructies in huis.",
        service_4_title: "Tuin & Bestrating",
        service_4_desc: "Renovatie van binnentuinen, patio's en dakterrassen.",
        
        // Prijzen Sectie
        pricing_title: "Transparante Vanaf Prijzen",
        pricing_sub: "Geen uurtje-factuurtje. Duidelijkheid vooraf.",
        table_work: "Werkzaamheden",
        table_price: "Vanaf Prijs (ex. BTW)",
        pricing_disclaimer: "* Definitieve prijs na beoordeling foto's of bezoek. Parkeerkosten in Amsterdam Centrum voor rekening klant.",
        
        // Over Ons (Aangepast: Zorgreferenties verwijderd)
        about_title: "Het Team",
        about_text_1: "4Builders brengt de Achterhoekse werkmentaliteit naar Amsterdam. Wij stropen de mouwen op en leveren gewoon goed werk af.",
        about_text_2: "Wij werken met gedreven teams onder leiding van ervaren projectmanagers. Door deze strakke begeleiding garanderen wij kwaliteit voor u, en bieden wij onze vakmannen de kans om mooie projecten te realiseren.",
        
        // Contact & Footer
        contact_title: "Start je project",
        contact_sub: "Vul het formulier in en ontvang binnen 24 uur een reactie van de manager.",
        footer_rights: "Alle rechten voorbehouden."
    },
    en: {
        // Navigation
        nav_home: "Home",
        nav_services: "Services",
        nav_pricing: "Pricing",
        nav_about: "About Us",
        nav_contact: "Request Quote",
        
        // Home Page
        hero_title: "Dutch Craftsmanship.<br>Amsterdam Heart.",
        hero_sub: "We actually show up. Specialized property maintenance by skilled workers building their future and your property.",
        hero_cta_primary: "Get a price estimate",
        usp_1: "Response within 24 hours. Always.",
        usp_2: "A deal is a deal",
        usp_3: "Socially Responsible",
        
        // Services Section
        services_title: "Our Expertise",
        service_1_title: "Painting",
        service_1_desc: "Tight paintwork for frames, doors and walls. We tape everything neatly.",
        service_2_title: "Flooring",
        service_2_desc: "Laminate and PVC flooring. Including subfloor and high skirting boards.",
        service_3_title: "Carpentry",
        service_3_desc: "Custom cabinets, hanging doors and small constructions in the house.",
        service_4_title: "Garden & Paving",
        service_4_desc: "Renovation of inner gardens, patios and roof terraces.",
        
        // Pricing Section
        pricing_title: "Transparent Starting Prices",
        pricing_sub: "No hourly billing surprises. Clarity upfront.",
        table_work: "Service",
        table_price: "Starting Price (ex. VAT)",
        pricing_disclaimer: "* Final price after photo assessment or visit. Parking costs in Amsterdam Center for client's account.",
        
        // About Us
        about_title: "The Team",
        about_text_1: "4Builders brings the hard-working mentality from the east of the Netherlands to Amsterdam. We roll up our sleeves and deliver quality work.",
        about_text_2: "We work with driven teams led by experienced project managers. Through this tight supervision, we guarantee quality for you, and offer our craftsmen the chance to realize beautiful projects.",
        
        // Contact & Footer
        contact_title: "Start your project",
        contact_sub: "Fill in the form and receive a response from the manager within 24 hours.",
        footer_rights: "All rights reserved."
    }
};

let currentLanguage = 'nl';

function switchLanguage() {
    currentLanguage = currentLanguage === 'nl' ? 'en' : 'nl';
    const langBtn = document.getElementById('current-lang');
    if(langBtn) langBtn.innerText = currentLanguage.toUpperCase();
    
    document.querySelectorAll('[data-lang-key]').forEach(element => {
        const key = element.getAttribute('data-lang-key');
        if (translations[currentLanguage][key]) {
            element.innerHTML = translations[currentLanguage][key];
        }
    });
}