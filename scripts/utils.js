const elements = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'.split('');

function generateUUID() {
    let val = "";

    for (let i = 0 ; i < 32 ; i++) {
        val += elements[Math.floor(Math.random() * elements.length)];
    }
    
    return val;
}