export const setSessionStorage = (key, value) => {
    sessionStorage.setItem(key, value);
}

export const isNamed = () => {
    if(sessionStorage.getItem('userName')){
        return true
    } else {
        return false
    }
}