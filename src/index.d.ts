export type JSONstring = string | null;

export type ObjStrStr = { [key: string]: string };

export type DicItem = {
    name: string;
    desc: string;
    more: string[];
    syn: string[];
}

export type Dictionary = DicItem[];