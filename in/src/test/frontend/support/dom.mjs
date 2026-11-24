export function createElement(tagName) {
    const children = [];
    return {
        tagName,
        children,
        dataset: {},
        append(child) { children.push(child); },
        insertCell() {
            const cell = createElement('td');
            children.push(cell);
            return cell;
        }
    };
}
