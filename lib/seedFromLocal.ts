import { buildFileTree, FileNode } from "./buildFileTree";
import { seedNode, subjectMapping } from "./seedNew";

async function seedFromLocalFolder() {
  // Podaj właściwą ścieżkę do folderu, w którym znajdują się foldery z przedmiotami.
  const folderPath = "/home/viventer/nauka/szkola";
  const tree: FileNode[] = buildFileTree(folderPath);

  // Iterujemy po wszystkich elementach znajdujących się bezpośrednio w folderPath.
  for (const subjectFolder of tree) {
    if (subjectFolder.type === "folder") {
      const key = subjectFolder.name.toLowerCase();
      console.log(key);
      if (subjectMapping.hasOwnProperty(key)) {
        const subject = subjectMapping[key];
        console.log(subject);
        // Przetwarzamy wszystkie elementy (foldery oraz pliki) wewnątrz folderu przedmiotowego.
        if (subjectFolder.children && subjectFolder.children.length > 0) {
          for (const child of subjectFolder.children) {
            // Dla każdego elementu przekazujemy subject odziedziczony z głównego folderu.
            await seedNode(child, null, subject);
          }
        } else {
          console.log(`Folder ${subjectFolder.name} jest pusty.`);
        }
      } else {
        console.log(
          `Pominięto folder ${subjectFolder.name} – brak zgodności z mapowaniem subject.`
        );
      }
    } else {
      // Jeśli w folderze głównym (folderPath) znajdują się pliki, możesz zdecydować,
      // czy je przetwarzać czy pominąć. W tym przykładzie je pomijamy.
      console.log(
        `Pominięto plik ${subjectFolder.name} spoza folderu przedmiotowego.`
      );
    }
  }
}

seedFromLocalFolder()
  .then(() => {
    console.log("Seedowanie zakończone pomyślnie.");
  })
  .catch((err) => {
    console.error("Błąd podczas seedowania:", err);
  });
