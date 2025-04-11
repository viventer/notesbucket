import { buildFileTree, FileNode } from "./buildFileTree";
import { seedNode, subjectMapping } from "./seedNew";

async function seedFromLocalFolder() {
  // Podaj właściwą ścieżkę do folderu, w którym znajdują się foldery z przedmiotami.
  const folderPath = "/home/viventer/nauka/szkola";
  const tree: FileNode[] = buildFileTree(folderPath);

  for (const node of tree) {
    if (node.type === "folder") {
      const key = node.name.toLowerCase();
      if (subjectMapping.hasOwnProperty(key)) {
        const subject = subjectMapping[key];
        await seedNode(node, null, subject);
      } else {
        console.log(
          `Pominięto folder ${node.name} – brak zgodności z mapowaniem subject.`
        );
      }
    } else {
      // Pomijamy pliki znajdujące się na najwyższym poziomie.
      console.log(`Pominięto plik ${node.name} na najwyższym poziomie.`);
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
