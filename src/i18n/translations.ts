export type LangCode = "en" | "sl" | "de" | "it" | "fr" | "es";

export interface Translations {
  loading: string;
  gallery: string;
  audioGuide: string;
  narration: string;
  unknownArtist: string;
  discovery: string;
  material: string;
  artifactual: string;
  period: string;
  universal: string;
  no3DModel: string;
  rateExperience: string;
  ratings: [string, string, string, string, string];
  selectRating: string;
  feedbackPlaceholder: string;
  submitting: string;
  postReview: string;
  thankYou: string;
  feedbackThanks: string;
  showcase: string;
  settings: string;
  by: string;
  from: string;
}

const translations: Record<LangCode, Translations> = {
  en: {
    loading: "Loading...",
    gallery: "Gallery",
    audioGuide: "Audio Guide",
    narration: "Narration",
    unknownArtist: "Unknown Artist",
    discovery: "Discovery",
    material: "Material",
    artifactual: "Artifactual",
    period: "Period",
    universal: "Universal",
    no3DModel: "No 3D Visual Available",
    rateExperience: "Rate this experience",
    ratings: ["Poor", "Decent", "Good", "Great", "Incredible"],
    selectRating: "Select Rating",
    feedbackPlaceholder: "Tell us what you discovered... (Optional)",
    submitting: "Submitting...",
    postReview: "Post Review",
    thankYou: "Thank you!",
    feedbackThanks: "Your feedback helps others discover this piece.",
    showcase: "Showcase",
    settings: "Settings",
    by: "by",
    from: "from",
  },
  sl: {
    loading: "Nalaganje...",
    gallery: "Galerija",
    audioGuide: "Zvočni vodnik",
    narration: "Pripovedovanje",
    unknownArtist: "Neznan umetnik",
    discovery: "Odkritje",
    material: "Material",
    artifactual: "Artefakt",
    period: "Obdobje",
    universal: "Univerzalno",
    no3DModel: "3D model ni na voljo",
    rateExperience: "Ocenite izkušnjo",
    ratings: ["Slabo", "Solidno", "Dobro", "Odlično", "Neverjetno"],
    selectRating: "Izberite oceno",
    feedbackPlaceholder: "Povejte nam, kaj ste odkrili... (Neobvezno)",
    submitting: "Pošiljanje...",
    postReview: "Objavi mnenje",
    thankYou: "Hvala!",
    feedbackThanks: "Vaše mnenje pomaga drugim odkriti to umetnost.",
    showcase: "Razstava",
    settings: "Nastavitve",
    by: "avtor",
    from: "iz leta",
  },
  de: {
    loading: "Laden...",
    gallery: "Galerie",
    audioGuide: "Audioguide",
    narration: "Erzählung",
    unknownArtist: "Unbekannter Künstler",
    discovery: "Entdeckung",
    material: "Material",
    artifactual: "Artefakt",
    period: "Epoche",
    universal: "Universal",
    no3DModel: "Kein 3D-Modell verfügbar",
    rateExperience: "Bewerte dieses Erlebnis",
    ratings: ["Schlecht", "Ordentlich", "Gut", "Toll", "Unglaublich"],
    selectRating: "Bewertung auswählen",
    feedbackPlaceholder: "Erzähl uns, was du entdeckt hast... (Optional)",
    submitting: "Wird gesendet...",
    postReview: "Bewertung abschicken",
    thankYou: "Danke!",
    feedbackThanks: "Dein Feedback hilft anderen, dieses Werk zu entdecken.",
    showcase: "Ausstellung",
    settings: "Einstellungen",
    by: "von",
    from: "aus",
  },
  it: {
    loading: "Caricamento...",
    gallery: "Galleria",
    audioGuide: "Audioguida",
    narration: "Narrazione",
    unknownArtist: "Artista Sconosciuto",
    discovery: "Scoperta",
    material: "Materiale",
    artifactual: "Artefatto",
    period: "Periodo",
    universal: "Universale",
    no3DModel: "Modello 3D non disponibile",
    rateExperience: "Valuta questa esperienza",
    ratings: ["Scarso", "Discreto", "Buono", "Ottimo", "Incredibile"],
    selectRating: "Seleziona valutazione",
    feedbackPlaceholder: "Racconta cosa hai scoperto... (Opzionale)",
    submitting: "Invio in corso...",
    postReview: "Pubblica recensione",
    thankYou: "Grazie!",
    feedbackThanks: "Il tuo feedback aiuta gli altri a scoprire quest'opera.",
    showcase: "Vetrina",
    settings: "Impostazioni",
    by: "di",
    from: "del",
  },
  fr: {
    loading: "Chargement...",
    gallery: "Galerie",
    audioGuide: "Audioguide",
    narration: "Narration",
    unknownArtist: "Artiste Inconnu",
    discovery: "Découverte",
    material: "Matériau",
    artifactual: "Artefact",
    period: "Période",
    universal: "Universel",
    no3DModel: "Aucun modèle 3D disponible",
    rateExperience: "Évaluez cette expérience",
    ratings: ["Médiocre", "Correct", "Bien", "Super", "Incroyable"],
    selectRating: "Sélectionner une note",
    feedbackPlaceholder: "Dites-nous ce que vous avez découvert... (Facultatif)",
    submitting: "Envoi en cours...",
    postReview: "Publier l'avis",
    thankYou: "Merci !",
    feedbackThanks: "Votre avis aide les autres à découvrir cette œuvre.",
    showcase: "Vitrine",
    settings: "Paramètres",
    by: "par",
    from: "de",
  },
  es: {
    loading: "Cargando...",
    gallery: "Galería",
    audioGuide: "Audioguía",
    narration: "Narración",
    unknownArtist: "Artista Desconocido",
    discovery: "Descubrimiento",
    material: "Material",
    artifactual: "Artefacto",
    period: "Período",
    universal: "Universal",
    no3DModel: "Modelo 3D no disponible",
    rateExperience: "Califica esta experiencia",
    ratings: ["Pobre", "Decente", "Bueno", "Genial", "Increíble"],
    selectRating: "Seleccionar calificación",
    feedbackPlaceholder: "Cuéntanos qué descubriste... (Opcional)",
    submitting: "Enviando...",
    postReview: "Publicar reseña",
    thankYou: "¡Gracias!",
    feedbackThanks: "Tu opinión ayuda a otros a descubrir esta pieza.",
    showcase: "Exhibición",
    settings: "Configuración",
    by: "de",
    from: "de",
  },
};

export function getTranslations(): Translations {
  const lang = (localStorage.getItem("artnode_language") || "en") as LangCode;
  return translations[lang] ?? translations.en;
}

// Map language codes to BCP 47 tags for SpeechSynthesis
export const langBcp47: Record<LangCode, string> = {
  en: "en-US",
  sl: "sl-SI",
  de: "de-DE",
  it: "it-IT",
  fr: "fr-FR",
  es: "es-ES",
};
