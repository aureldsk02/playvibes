// Mock nanoid to avoid ESM issues in Jest
export const nanoid = () => 'test-id-' + Math.random().toString(36).substring(7);

export const customAlphabet = (alphabet: string, size: number) => {
    return () => {
        let id = '';
        for (let i = 0; i < size; i++) {
            id += alphabet.charAt(Math.floor(Math.random() * alphabet.length));
        }
        return id;
    };
};
