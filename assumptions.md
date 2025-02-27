# Ogólne założenia aplikacji

## Dostępne funkcjonalności.

### Po stronie admin'a.

#### 1. CRUD na notatkach

- edycja notatek odbywa się poprzez edytor wzięty z vs code, czyli monaco
- dodatkowo dostępny jest vim poprzez monaco-vim
- keybindy są zmienione na moje np. kj na przejście do trybu visual
- utworzone notatki zapisywane są w firebase firestore db
- oprócz nazwy i zawartości notatki w firestore przechowujemy też jej datę utworzenia, nick autora i ścieżkę do niej np. /polski/romantyzm/dziady

#### 2. Upload zdjęć

- zdjęcia uploadowane są w bocznym, rozsuwanym panelu (obok edytora md)
- uploadowane zdjęcie jest od razu przesyłane do firebase storage
- po uploadowaniu (przeciągnięciu lub wybraniu) obrazu, użytkownik musi podać jego nazwę
- chcąc zamieścić obraz w pliku markdown wystarczy, że wpisze ![nazwaObrazu], a odnośnik do obrazu w firebase storage zostanie wygenerowany automatycznie

#### 3. Zarządzanie strukturą notatek

- Notatki uporządkowane są w hierarchicznej strukturze folderów i podfolderów np. polski -> romantyzm -> dziady -> notatka1.md
- Aplikacja pozwala na operacje CRUD na folderach, podfolderach i notatkach
- możliwa jest zmiana nazw notatek i folderów
- notatki można przenosić do innych folderów/podfolderów zmieniając ścieżkę u góry
- Nazwy folderów i plików odpowiadają nazwą, które widzi użytkownik końcowy nawigując się po aplikacji
- w przypadku usunięcia folderu - notatki trafiają do folderu "Pozostałe", on jest niemożliwy do usunięcia

#### 4. Zarządzanie użytkownikami

- usuwanie użytkowników
- określanie dostępu do notatek - administrator może określić do których folderów ma mieć dostęp użytkownik (domyślnie do żadnych)
- konta użytkowników, którzy nie dostali dostępu do żadnych folderów przez dwa tygodnie są automatycznie usuwane

### Po stronie end usera

#### 1. Strona główna

- animowane logo svg
- nazwa aplikacji - NotesBucket
- opis aplikacji - Wszystkie notatki w jednym miejscu
- przycisk - przeglądaj notatki

#### 2. Auth

- przycisk sprawdź przenosi automatycznie na stronę logowania
- logowanie jest wymagana, użytkownik niezalogowany widzi tylko stronę główną
- logowanie odbywa się poprzez konto google
- po zalogowaniu użytkownik jest poproszony o podanie prawdziwego imienia i nazwiska (inaczej nie zostanie zweryfikowany i nie będzie miał dostępu do notatek)

#### 3. Przeglądanie notatek

- użytkownik może nawigować się po notatkach jak po strukturze katalogów
- nad strukturą katalogów obecna jest wyszukiwarka, w której może szukać notatek po nazwach katalogów, podkatalogów i samych notatek
- możliwość pobrania notatek (w formacie github pdf), skopiowania i wydrukowania

## Wykorzystywane technologie

- nextjs - frontend i api
- firebase - auth, firestore, storage, cloud functions, hosting
- shadcn - ui
- monaco - edytor markdown
- reactmarkdown - parse markdown
- tailwind - css
- gsap - animowanie svg
- figma - mockup, design
- inkscape - svg
