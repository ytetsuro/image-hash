export default function NTSCCoefMethod(r: Uint8, g: Uint8, b: Uint8): Uint8 {
    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);

    return <Uint8>(Math.round((2*r + 4*g + b) / 7));
};