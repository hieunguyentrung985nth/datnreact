export const transDate = (value)=>{
    const newDate = new Date(value);
    const date = newDate.getDate();
    const month = newDate.getMonth() + 1;
    const year = newDate.getFullYear();
    return `${date}/${month}/${year}`;
}

export const hideText = (text, size)=>{
    if(text.length >=size){
        const newText = text.substring(0,size);
        const res = newText.substring(0, newText.lastIndexOf(' '));
        return res +'...';
    }
    return text;
}