type HTMLInputs = HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement;

class Selector<SelectedElemT extends HTMLElement> {
    private _elem: SelectedElemT;

    public constructor(elem: SelectedElemT) {
        this._elem = elem;
    }

    public get elem(): SelectedElemT {
        return this._elem;
    }

    public id<ElemT extends HTMLElement>(id: string): ElemT {
        const elem = this._elem.querySelector(`#${id}`);
        if (elem) return elem as ElemT;
        throw Error(`No element with id "${id}"`);
    }

    public classname<ElemT extends HTMLElement>(classname: string): ElemT[] {
        const results = this._elem.getElementsByClassName(classname);
        return Array.from(results) as ElemT[];
    }

    public parents<ElemT extends HTMLElement>(classname?: string): ElemT[] {
        let parents: HTMLElement[] = [];
        let curr: HTMLElement | null = this._elem;
        while (curr != null) {
            curr = curr.parentElement;
            if (curr) parents.push(curr);
        }
        if (classname) {
            parents = parents.filter((p) => p.classList.contains(classname));
        }
        return Array.from(parents) as ElemT[];
    }

    public siblings<ElemT extends HTMLElement>(classname?: string): ElemT[] {
        if (!this._elem.parentNode) return [];
        const level = Array.from(this._elem.parentNode.children);
        let siblings = level.filter((s) => !s.isSameNode(this._elem));
        if (classname) {
            siblings = siblings.filter((s) => s.classList.contains(classname));
        }
        return Array.from(siblings) as ElemT[];
    }

    public label(): HTMLLabelElement {
        let labels = Array.from(
            document.body.getElementsByTagName('label')
        ) as HTMLLabelElement[];
        labels = labels.filter((l) => l.getAttribute('for') == this._elem.id);
        if (labels.length === 0) throw Error('No matching label');
        return labels[0];
    }

    public inputs(): HTMLInputs[] {
        return [
            ...Array.from(this._elem.getElementsByTagName('input')),
            ...Array.from(this._elem.getElementsByTagName('select')),
            ...Array.from(this._elem.getElementsByTagName('textarea'))
        ];
    }
}

function query<ElemT extends HTMLElement>(elem?: ElemT): Selector<ElemT> {
    return new Selector<ElemT>(elem || (document.body as ElemT));
}

export default query;
