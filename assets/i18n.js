(() => {
    const storageKey = "guillem-language";
    const supportedLanguages = ["es", "en"];
    let translations;
    let currentLanguage = "es";

    const loadLanguage = async (language) => {
        const response = await fetch(`assets/i18n/${language}.json`);

        if (!response.ok) {
            throw new Error(`No se pudo cargar el idioma ${language}: ${response.status}`);
        }

        return response.json();
    };

    const t = (key, values = {}) => {
        const template = translations[key];

        if (typeof template !== "string") {
            throw new Error(`No existe la traducción "${key}" para ${currentLanguage}.`);
        }

        return template.replace(/\{(\w+)\}/g, (match, name) => values[name] ?? match);
    };

    const applyTranslations = () => {
        document.documentElement.lang = currentLanguage;

        for (const element of document.querySelectorAll("[data-i18n]")) {
            element.textContent = t(element.dataset.i18n);
        }

        for (const element of document.querySelectorAll("[data-i18n-html]")) {
            element.innerHTML = t(element.dataset.i18nHtml);
        }

        for (const element of document.querySelectorAll("[data-i18n-attr]")) {
            for (const mapping of element.dataset.i18nAttr.split(";")) {
                const [attribute, key] = mapping.split(":");
                element.setAttribute(attribute, t(key));
            }
        }

        for (const button of document.querySelectorAll("[data-language]")) {
            button.setAttribute("aria-pressed", String(button.dataset.language === currentLanguage));
        }
    };

    const setLanguage = async (language) => {
        if (!supportedLanguages.includes(language)) {
            throw new Error(`Idioma no soportado: ${language}`);
        }

        if (language !== currentLanguage) {
            translations = await loadLanguage(language);
            currentLanguage = language;

            try {
                localStorage.setItem(storageKey, language);
            } catch (error) {
                console.error("No se pudo guardar el idioma seleccionado:", error);
            }
        }

        applyTranslations();
        document.dispatchEvent(new CustomEvent("languagechange", { detail: { language } }));
    };

    let savedLanguage;
    try {
        savedLanguage = localStorage.getItem(storageKey);
    } catch (error) {
        console.error("No se pudo leer el idioma guardado:", error);
    }
    const initialLanguage = supportedLanguages.includes(savedLanguage) ? savedLanguage : "es";

    window.t = t;
    window.setLanguage = setLanguage;
    window.i18nReady = loadLanguage(initialLanguage).then((catalog) => {
        translations = catalog;
        currentLanguage = initialLanguage;
        applyTranslations();
    });

    document.addEventListener("click", (event) => {
        const button = event.target.closest("[data-language]");

        if (button) {
            setLanguage(button.dataset.language).catch((error) => {
                console.error("Error al cambiar el idioma:", error);
            });
        }
    });
})();
