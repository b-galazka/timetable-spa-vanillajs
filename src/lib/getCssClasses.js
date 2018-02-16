export function getCssClasses(classes) {

    const output = Object.keys(classes).reduce((output, cssClass) => {

        const condition = classes[cssClass];

        if (!condition) {

            return output;
        }

        return `${output}${(output.length > 0) ? ' ' : ''}${cssClass}`;
    }, '');

    return output;
}