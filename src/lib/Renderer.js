export class Renderer {

    constructor(root) {

        this._root = root;
    }

    renderView(template) {

        this._root.innerHTML = template;
    }

    updateView(template) {

        const newDomParent = document.createElement('div');

        newDomParent.innerHTML = template;

        const currentDom = this._root.childNodes;  
        const newDom = newDomParent.childNodes;

        this._compareNodesCollections(currentDom, newDom);
    }

    _compareNodesCollections(currentDom, newDom, parent = this._root) {

        for (let i = 0; i < currentDom.length || i < newDom.length; i++) {

            const currentNode = currentDom[i];
            const newNode = newDom[i];

            const childrenToCheckExist = Renderer._compareNodes(
                parent, currentNode, newNode
            );

            if (childrenToCheckExist) {

                this._compareNodesCollections(
                    currentNode.childNodes,
                    newNode.childNodes,
                    parent.childNodes[i]
                );
            }
        }
    }

    static _compareNodes(parent, currentNode, newNode) {

        if (currentNode === undefined && newNode !== undefined) {

            parent.appendChild(newNode.cloneNode(true));

            return false;

        } else if (currentNode !== undefined && newNode === undefined) {

            parent.removeChild(currentNode);

            return false;

        } else if (!Renderer._areNodesTheSame(currentNode, newNode)) {

            parent.replaceChild(newNode.cloneNode(true), currentNode);

            return false;

        } else if (currentNode.nodeType !== 1) {

            return false;
        }

        Renderer._compareAttributes(currentNode, newNode);

        return (currentNode.childNodes.length > 0 || newNode.childNodes.length > 0);
    }

    static _compareAttributes(currentNode, newNode) {

        const currentAttrs = currentNode.attributes
        const newAttrs = newNode.attributes;

        const removedAttrs = Array.prototype.filter.call(currentAttrs, currentAttr => (

            !Array.prototype.some.call(newAttrs, newAttr => (

                newAttr.name === currentAttr.name
            ))
        ));
        
        removedAttrs.forEach(attr => currentNode.removeAttribute(attr.name));

        Array.prototype.forEach.call(newAttrs, (newAttr) => {

            const currentAttr = Array.prototype.find.call(currentAttrs, attr => (
                attr.name === newAttr.name
            ));

            if (!currentAttr || currentAttr.value !== newAttr.value) {

                currentNode.setAttribute(newAttr.name, newAttr.value);
            }
        });
    }

    static _areNodesTheSame(node1, node2) {

        return (
            node1.nodeType === node2.nodeType && (
                node1.nodeType === 1 && node1.tagName === node2.tagName ||
                node1.nodeType === 3 && node1.wholeText === node2.wholeText
            )
        );
    }
}