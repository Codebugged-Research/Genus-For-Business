export const setLocalStorage = (value) => {
    localStorage.setItem('name', value);
}

export const isNamed = () => {
    if(localStorage.getItem('name')){
        return true
    } else {
        return false
    }
}