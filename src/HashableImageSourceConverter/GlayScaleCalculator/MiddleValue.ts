export default function MiddleValue(r: Uint8, g: Uint8, b: Uint8): Uint8 {
    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);

    return <Uint8>(Math.floor((max+min)/2));
};