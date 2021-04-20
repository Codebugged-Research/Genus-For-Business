export const setLocalStorage = (value) => {
    if(localStorage.getItem('name')){
        localStorage.removeItem('name')
    }
    localStorage.setItem('name', value);
}

export const isNamed = () => {
    if(localStorage.getItem('name')){
        return true
    } else {
        return false
    }
}