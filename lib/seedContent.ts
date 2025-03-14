import {
  collection,
  query,
  where,
  getDocs,
  doc,
  updateDoc,
} from "firebase/firestore";
import { db } from "./firebase";

const markdownContent = `### 1. Co utrudnia porozumienie między przedstawicielami różnych grup społecznych? Omów zagadnienie na podstawie Wesela Stanisława Wyspiańskiego. W swojej odpowiedzi uwzględnij również wybrany kontekst

- "Wesele" pokazuje brak porozumienia między chłopami a inteligencją z powodu różnic klasowych, stereotypów i odmiennych wartości. Inteligencja idealizuje chłopów, ale nie traktuje ich poważnie, a chłopi nie ufają inteligencji.
- Symboliczne sceny: Złoty róg (utracona szansa na jedność), chocholi taniec (bierność społeczeństwa).
- Kontekst – "Lalka" B. Prusa: Konflikt klasowy między Wokulskim a arystokracją i mieszczaństwem, pokazujący trudności w przełamywaniu barier społecznych.

### 2. Rola chłopów i inteligencji w sprawie niepodległościowej. Omów zagadnienie na podstawie Wesela Stanisława Wyspiańskiego. W swojej odpowiedzi uwzględnij również wybrany kontekst

- "Wesele" ukazuje, że zarówno chłopi, jak i inteligencja mogliby odegrać kluczową rolę w walce o niepodległość, ale dzieli ich brak zaufania i różnice społeczne. Inteligencja jest bierna i niezdecydowana, a chłopi – choć mają potencjał – nie mają świadomości narodowej (symbol Jakuba Szeli i utrata złotego rogu).
- Symbolika: Złoty róg (szansa na wolność), Chochoł (bierność narodu).
- Kontekst – powstanie styczniowe (22.01.1863 - 22.10.1864) – Było to zbrojne wystąpienie Polaków przeciwko rosyjskiemu zaborcy, którego celem było odzyskanie niepodległości. Choć powstanie miało poparcie części inteligencji i szlachty, nie udało się zjednoczyć całego społeczeństwa, szczególnie chłopów, którzy nie czuli się wystarczająco zmotywowani, by walczyć.

### 3. Sen o Polsce czy sąd nad Polską? Omów zagadnienie na podstawie Wesela Stanisława Wyspiańskiego. W swojej odpowiedzi uwzględnij również wybrany kontekst

- Wesele ukazuje jednocześnie idealistyczny sen o odrodzeniu narodu i odzyskaniu niepodległości, a z drugiej jest krytycznym sądem nad jego błędami i słabościami.
- W grobie agammemnona Słowacki ukazał zarówno wizję Polski idealnej, zjednoczonej, której symbolem jest posąg z jednej bryły. Poeta marzy o Polsce pozbawionej podziałów społecznych, niepodgległej, wolnej od wszystkich wad narodowych. Jednocześnie wytyka w utworze bezmyślność i egoizm polskiej szlachty. Uważa, że Polacy, stojąc nad grobem leonidasa, powinny czuć wstyd za swoje tchórzostwo, a powstanie listopadowe można porównać do bitwy pod Cheroneą (największej porażki Greków), a nie do bitwy pod Termopilami.
- Zreasumuj, że „Sen o Polsce” i „sąd nad Polską” to dwie strony tej samej monety – marzenia o odrodzeniu i krytyczna ocena przeszłości muszą iść w parze, aby naród mógł się naprawdę zmienić.

### 4. Symboliczne znaczenie widm i zjaw. Omów zagadnienie na podstawie Wesela Stanisława Wyspiańskiego. W swojej odpowiedzi uwzględnij również wybrany kontekst

- W weselu zjawy stanowią pogłębienie charakterystyki bohaterów realistycznych. Są personifikacją ich głęboko ukrytych, wewnętrznych pragnień, marzeń, celów oraz wyrzutów sumienia.
- Dziady cz. 2 – widma pokazują skutki złych czynów ludzi za życia. Każde zjawisko uczy ważnych wartości, np. że nie można być obojętnym na cierpienie innych (Widmo Złego Pana) lub że sama niewinność nie wystarczy do zbawienia (Rózia i Józio). Widma symbolizują konieczność rozliczenia się z przeszłością i pokazują, że każdy czyn ma swoje konsekwencje.

### 5. Motyw tańca. Omów zagadnienie na podstawie Wesela Stanisława Wyspiańskiego. W swojej odpowiedzi uwzględnij również wybrany kontekst

- W weselu chocholi taniec z ostatniej sceny ujawnia bierność i rozbicie społeczne, a w "Panu Tadeuszu" polonez symbolizuje jedność narodową, nadzieję na odrodzenie Polski.
`;

export async function seedContent() {
  try {
    // Utwórz zapytanie do kolekcji "notes", gdzie title jest równe "ogólnie"
    const notesRef = collection(db, "notes");
    const q = query(notesRef, where("title", "==", "ogólnie"));
    const querySnapshot = await getDocs(q);

    if (!querySnapshot.empty) {
      // Jeśli znaleziono notatkę, aktualizujemy jej pole mdContent
      querySnapshot.forEach(async (document) => {
        const noteDocRef = doc(db, "notes", document.id);
        await updateDoc(noteDocRef, { mdContent: markdownContent });
        console.log(`Notatka o id ${document.id} została zaktualizowana.`);
      });
    } else {
      console.log("Nie znaleziono notatki o tytule 'ogólnie'.");
    }
  } catch (error) {
    console.error("Błąd przy aktualizacji notatki:", error);
  }
}
