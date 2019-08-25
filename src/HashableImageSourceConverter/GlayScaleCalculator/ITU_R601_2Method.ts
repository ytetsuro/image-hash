export default function ITU_R601_2Method(r: Uint8, g: Uint8, b: Uint8): Uint8 {
    return <Uint8>Math.round((r*299/1000 + g*587/1000 + b*114/1000));
};