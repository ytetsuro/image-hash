export default function NTSCCoefMethod(r: Uint8, g: Uint8, b: Uint8): Uint8 {
    return <Uint8>(Math.round((2*r + 4*g + b) / 7));
};