// buildFileTree.ts
import fs from "fs";
import path from "path";

export interface FileNode {
  name: string;
  type: "folder" | "file";
  fullPath: string;
  children?: FileNode[];
}

/**
 * Funkcja rekurencyjna budująca drzewo plików i folderów.
 * @param dir – ścieżka początkowa
 * @returns drzewo węzłów FileNode
 */
export function buildFileTree(dir: string): FileNode[] {
  const items = fs.readdirSync(dir, { withFileTypes: true });
  return items.map((item) => {
    const fullPath = path.join(dir, item.name);
    if (item.isDirectory()) {
      return {
        name: item.name,
        type: "folder",
        fullPath,
        children: buildFileTree(fullPath),
      };
    } else {
      return {
        name: item.name,
        type: "file",
        fullPath,
      };
    }
  });
}
