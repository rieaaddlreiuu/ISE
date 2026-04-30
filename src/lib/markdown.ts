export function normalizeDisplayMathBlocks(content: string) {
    let result = '';
    let index = 0;
    let inDisplayMath = false;

    while (index < content.length) {
        if (content.slice(index, index + 2) === '$$') {
            const previousChar = result.at(-1);
            const nextChar = content[index + 2];

            if (previousChar && previousChar !== '\n') {
                result += '\n';
            }

            result += '$$';
            inDisplayMath = !inDisplayMath;

            if (!inDisplayMath) {
                if (nextChar && nextChar !== '\n') {
                    result += '\n';
                }
            } else if (nextChar && nextChar !== '\n') {
                result += '\n';
            }

            index += 2;
            continue;
        }

        result += content[index];
        index += 1;
    }

    return result;
}
