import i18n from "i18next";
import { initReactI18next } from "react-i18next";

i18n.use(initReactI18next).init({
  resources: {
    en: {
      translation: {
        Title: "Title",
        Author: "Author",
        Rate: "Rate",
        Finished: "Finished",
        Date: "Date",
        Actions: "Actions",
        Next: "Next",
        Previous: "Previous",
        Read: "Read",
        Reading: "Reading",
        "Want To Read": "Want To Read",
        Status: "Status",
        Add: "Add",
        Save: "Save",
        Ok: "Ok",
        Cancel: "Cancel",
        "and rated it": "and rated it",
        Stars: "Stars",
        "No activity yet": "No activity yet",
        "No results.": "No results.",
        "Books": "Books",
        "Feed": "Feed",
      },
    },
    pl: {
      translation: {
        Title: "Tytuł",
        Author: "Autor",
        Rate: "Ocena",
        Finished: "Przeczytane",
        Date: "Data",
        Actions: "Akcje",
        Next: "Następna",
        Previous: "Poprzednia",
        Read: "Przeczytane",
        Reading: "Czytając",
        "Want To Read": "Chcę przeczytać",
        Status: "Status",
        Add: "Dodaj",
        Save: "Zapisz",
        Ok: "Ok",
        Cancel: "Anuluj",
        "and rated it": "i ocenił",
        stars: "gwiazdkami",
        finished: "skończyłem",
        "No activity yet": "Brak aktywności",
        "No results.": "Brak wyników.",
        "Books": "Książki",
        "Feed": "Aktywność",
      },
    },
  },
  lng: "en",
  fallbackLng: "en",
  interpolation: {
    escapeValue: false,
  },
});
