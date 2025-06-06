import type { Cat } from "./typesCat";

interface CatListProps {
    cats: Cat[];
    onSelectCat: (cat: Cat) => void;
}

export type { CatListProps };