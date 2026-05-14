export type NotationTransformMode = 'source' | 'japanese-punctuation' | 'fullwidth-punctuation';

export const notationTransformOptions: Array<{ label: string; mode: NotationTransformMode; title: string }> = [
    { label: '原文', mode: 'source', title: '原文の表記で表示' },
    { label: '。、', mode: 'japanese-punctuation', title: '句読点を「。、」に変換' },
    { label: '．，', mode: 'fullwidth-punctuation', title: '句読点を「．，」に変換' },
];

export function applyNotationTransform(text: string, mode: NotationTransformMode) {
    if (mode === 'japanese-punctuation') {
        return text.replaceAll('．', '。').replaceAll('，', '、');
    }

    if (mode === 'fullwidth-punctuation') {
        return text.replaceAll('。', '．').replaceAll('、', '，');
    }

    return text;
}
