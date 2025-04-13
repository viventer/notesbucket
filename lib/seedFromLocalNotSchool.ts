import { buildFileTree, FileNode } from "./buildFileTree";
import { seedNode } from "./seedNotSchool";

const toTransfer = [
  "linux",
  "mysql",
  "gitlab",
  "js",
  "lepszy kod",
  "nextjs",
  "vim",
  "mui",
  "firebase",
  "git",
  "html i css",
  "jira",
  "mongo",
  "php",
  "seo",
  "web accesibility",
];

async function seedFromLocalFolder() {
  // Podaj właściwą ścieżkę do folderu, w którym znajdują się foldery z przedmiotami.
  const folderPath = "/home/viventer/nauka/programowanie";
  const tree: FileNode[] = buildFileTree(folderPath);

  // Iterujemy po wszystkich elementach znajdujących się bezpośrednio w folderPath.
  for (const mainFolder of tree) {
    if (mainFolder.type === "folder") {
      const key = mainFolder.name.toLowerCase();
      if (!toTransfer.includes(key)) {
        continue;
      }
      console.log(key);
      await seedNode(mainFolder, null);
    } else {
      console.log(`Pominięto plik ${mainFolder.name} spoza folderu głównego.`);
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
