//function to convert date time into IST and Indian format
export const convertToDateTime = (date: string)=>{
    const dateFormat = new Date(date);
    const localDateTime = dateFormat.toLocaleString("en-IN");
    return localDateTime;
}